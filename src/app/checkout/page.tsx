'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatCurrency } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getTotal, clearCart } = useCartStore()
    const [loading, setLoading] = useState(false)

    // Basic Form State
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
    })

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const totalAmount = getTotal()

        try {
            const orderRes = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items,
                    shippingDetails: form,
                    totalAmount,
                }),
            })

            const orderData = await orderRes.json()

            if (!orderRes.ok) {
                throw new Error(orderData.error || 'Failed to create order')
            }

            if (orderData.success) {
                clearCart()
                router.push('/order-confirmation?success=true')
            } else {
                alert(orderData.error || 'Failed to place order. Please try again.')
            }
        } catch (error: any) {
            console.error(error)
            alert(`Error: ${error.message || 'Something went wrong. Please try again.'}`)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    if (items.length === 0) {
        return <div className="p-10 text-center">Your cart is empty. <br /><br /> <Button onClick={() => router.push('/shop')}>Go Shop</Button></div>
    }

    return (
        <div className="bg-emerald-50/10 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <h1 className="font-serif text-3xl text-emerald-950 mb-8 text-center">Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-sm shadow-sm border border-emerald-900/5">

                    {/* Shipping Form */}
                    <div>
                        <h2 className="text-lg font-bold text-emerald-900 mb-6 border-b pb-2">Shipping Details</h2>
                        <form onSubmit={handlePlaceOrder} className="space-y-4">
                            <Input
                                label="Full Name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                            />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="john@example.com"
                            />
                            <Input
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                placeholder="9876543210"
                            />
                            <Input
                                label="Address"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                required
                                placeholder="Block A, Apt 101"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="City"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    required
                                    placeholder="Mumbai"
                                />
                                <Input
                                    label="Pincode"
                                    name="pincode"
                                    value={form.pincode}
                                    onChange={handleChange}
                                    required
                                    placeholder="400001"
                                />
                            </div>
                        </form>
                    </div>

                    {/* Order Summary & Pay */}
                    <div className="bg-gray-50 p-6 rounded-sm h-fit">
                        <h2 className="text-lg font-bold text-emerald-900 mb-6 border-b pb-2">Your Order</h2>

                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                            {items.map(item => (
                                <div key={item.product.id} className="flex justify-between text-sm">
                                    <div>
                                        <span className="font-medium text-emerald-900 block">{item.product.name}</span>
                                        <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="font-mono text-emerald-700">{formatCurrency(item.currentPrice * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-dashed border-gray-300 pt-4 mb-8">
                            <div className="flex justify-between items-baseline">
                                <span className="font-bold text-emerald-900 text-lg">Total Amount</span>
                                <span className="font-serif text-2xl font-bold text-accent">{formatCurrency(getTotal())}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handlePlaceOrder}
                            size="lg"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Processing...</> : 'Place Order'}
                        </Button>

                        <p className="text-xs text-center text-gray-400 mt-4">
                            By placing order, you agree to our terms and conditions.
                            Payment via Cash on Delivery.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}
