'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Shield, Truck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal } = useCartStore()
    const total = getTotal()
    const router = useRouter()

    // Prevent body scroll when cart is open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    const handleClose = () => {
        router.back()
    }

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300"
                onClick={handleClose}
            />

            {/* Side Panel */}
            <div className="fixed inset-y-0 right-0 w-full sm:w-[600px] lg:w-[700px] bg-white z-50 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-white">
                    <div>
                        <h2 className="font-serif text-2xl text-emerald-950">Shopping Cart</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {items.length} {items.length === 1 ? 'item' : 'items'}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close cart"
                    >
                        <X className="h-6 w-6 text-gray-600" />
                    </button>
                </div>

                {items.length === 0 ? (
                    /* Empty Cart State */
                    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                        <div className="bg-emerald-50 rounded-full p-6 mb-4">
                            <ShoppingBag className="h-16 w-16 text-emerald-600" />
                        </div>
                        <h3 className="font-serif text-2xl text-emerald-950 mb-2">Your Cart is Empty</h3>
                        <p className="text-gray-500 mb-6 max-w-sm">
                            Discover our exquisite collection of handcrafted jewellery pieces.
                        </p>
                        <Link href="/shop" onClick={handleClose}>
                            <Button size="lg">
                                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Cart Items - Scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.product.id}
                                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200"
                                    >
                                        <div className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="relative w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                                                {item.product.images?.[0] && (
                                                    <Image
                                                        src={item.product.images[0]}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/product/${item.product.id}`}
                                                    onClick={handleClose}
                                                    className="hover:text-accent transition-colors"
                                                >
                                                    <h4 className="font-serif text-base text-emerald-950 mb-1 truncate">
                                                        {item.product.name}
                                                    </h4>
                                                </Link>

                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                        {item.product.metal_type}
                                                    </span>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                                                        {item.product.purity}
                                                    </span>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                                                        {item.product.weight}g
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="text-lg font-bold text-emerald-900">
                                                        {formatCurrency(item.currentPrice)}
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center bg-white rounded-md border border-gray-300">
                                                            <button
                                                                className="p-1.5 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Minus className="h-3.5 w-3.5" />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-semibold text-gray-900">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                className="p-1.5 hover:bg-gray-50 transition-colors"
                                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                            >
                                                                <Plus className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => removeItem(item.product.id)}
                                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer - Order Summary */}
                        <div className="border-t border-gray-200 bg-white px-6 py-4">
                            {/* Price Breakdown */}
                            <div className="space-y-2 mb-4 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(total)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Insurance</span>
                                    <span className="font-semibold text-green-600">Free</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t border-gray-200 pt-3 mb-4">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-bold text-gray-900 text-lg">Total</span>
                                    <span className="font-serif text-2xl font-bold text-emerald-700">
                                        {formatCurrency(total)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 text-right mt-0.5">Inclusive of all taxes</p>
                            </div>

                            {/* Checkout Button */}
                            <Button
                                size="lg"
                                className="w-full shadow-lg mb-3"
                                onClick={() => router.push('/checkout')}
                            >
                                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>

                            {/* Trust Badges */}
                            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-1.5">
                                    <Shield className="h-4 w-4 text-emerald-600" />
                                    <span>Cash on Delivery</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Truck className="h-4 w-4 text-emerald-600" />
                                    <span>Free Shipping</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
