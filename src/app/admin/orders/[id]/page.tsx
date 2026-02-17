'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Order, OrderItem } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Printer, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Mock Data for fallback
const mockOrder: Order = {
    id: '1',
    user_id: 'user_123',
    razorpay_order_id: 'order_N12345',
    razorpay_payment_id: 'pay_12345',
    total_amount: 145000,
    payment_status: 'paid',
    order_status: 'processing',
    shipping_address: '123, Green Park, New Delhi, 110016',
    created_at: new Date().toISOString(),
    items: [
        {
            id: 'item_1',
            order_id: '1',
            product_id: 'p1',
            quantity: 1,
            price_at_purchase: 145000,
            product: {
                id: 'p1',
                name: 'Royal Gold Necklace',
                description: '22K Gold',
                metal_type: 'gold',
                purity: '22K',
                weight: 20,
                making_charge_type: 'fixed',
                making_charge_value: 5000,
                stock: 1,
                is_featured: true,
                created_at: '',
                images: ['https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974']
            }
        }
    ]
}

export default function OrderDetailsPage() {
    const params = useParams()
    const id = params.id as string
    const [order, setOrder] = useState<Order>(mockOrder) // Use mock initially

    // Future: Fetch real order
    /*
    useEffect(() => {
        const fetchOrder = async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('orders')
                .select('*, items:order_items(*, product:products(*))')
                .eq('id', id)
                .single()
            if (data) setOrder(data)
        }
        fetchOrder()
    }, [id])
    */

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 print:p-0">
            {/* Header / Actions - Hidden in Print */}
            <div className="flex items-center justify-between mb-8 print:hidden">
                <Link href="/admin/orders" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
                </Link>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" /> Print Invoice
                    </Button>
                    <Button>
                        Update Status
                    </Button>
                </div>
            </div>

            {/* Invoice Container */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 print:shadow-none print:border-none">

                {/* Invoice Header */}
                <div className="bg-emerald-950 text-white p-8 print:bg-white print:text-black print:border-b print:border-gray-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-serif font-bold tracking-wider mb-2">INVOICE</h1>
                            <p className="text-emerald-100 print:text-gray-500">Mahi Fashion Jewellery</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold">#{order.id.slice(0, 8).toUpperCase()}</h2>
                            <p className="text-sm opacity-80">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Addresses */}
                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Billed To</h3>
                            <div className="text-gray-900 font-medium text-lg mb-2">Customer Name</div>
                            {/* In real app, join with profiles table to get name */}
                            <p className="text-gray-600 mb-2">{order.shipping_address}</p>
                            <div className="text-sm text-gray-500 flex items-center mt-2">
                                <Mail className="h-4 w-4 mr-2" /> customer@example.com
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Phone className="h-4 w-4 mr-2" /> +91 98765 43210
                            </div>
                        </div>
                        <div className="text-right">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Shipped From</h3>
                            <div className="text-gray-900 font-medium text-lg mb-2">Mahi Fashion Jewellery</div>
                            <p className="text-gray-600">123, Gold Souk, T. Nagar</p>
                            <p className="text-gray-600">Chennai, Tamil Nadu - 600017</p>
                            <p className="text-gray-600 mt-1">GSTIN: 33ABCDe1234F1Z5</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <table className="w-full mb-8">
                        <thead>
                            <tr className="border-b-2 border-emerald-900/10 text-left">
                                <th className="py-3 font-semibold text-gray-900">Item Description</th>
                                <th className="py-3 font-semibold text-gray-900 text-center">Qty</th>
                                <th className="py-3 font-semibold text-gray-900 text-right">Price</th>
                                <th className="py-3 font-semibold text-gray-900 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {order.items?.map((item) => (
                                <tr key={item.id}>
                                    <td className="py-4">
                                        <div className="font-medium text-gray-900">{item.product?.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {item.product?.metal_type} • {item.product?.purity} • {item.product?.weight}g
                                        </div>
                                    </td>
                                    <td className="py-4 text-center">{item.quantity}</td>
                                    <td className="py-4 text-right text-gray-600">{formatCurrency(item.price_at_purchase)}</td>
                                    <td className="py-4 text-right font-medium text-gray-900">
                                        {formatCurrency(item.price_at_purchase * item.quantity)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Summary */}
                    <div className="flex justify-end">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(order.total_amount)}</span> {/* Simplified for demo */}
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-emerald-900 font-bold text-lg pt-3 border-t border-emerald-900/20">
                                <span>Total</span>
                                <span>{formatCurrency(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-6 text-center text-sm text-gray-500 print:bg-white border-t border-gray-100">
                    <p>Thank you for choosing Mahi Fashion Jewellery.</p>
                    <p>For support, please contact support@mahifashion.com</p>
                </div>
            </div>
        </div>
    )
}
