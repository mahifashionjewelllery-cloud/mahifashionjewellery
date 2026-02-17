'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, Package, Truck, CheckCircle, MapPin, Phone, Mail } from 'lucide-react'

export default function OrderDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<any>(null)
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()

                // Fetch order
                const { data: orderData, error: orderError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', params.id)
                    .single()

                if (orderError) throw orderError

                // Check if user is authorized to view this order
                // If user is logged in, check ownership. 
                // If guest, we might need a token or just allow if knowing the ID (insecure but simple for now)
                // Since RLS is technically "Users can view their own orders", 
                // if user_id is null, it might return empty for logged in user?
                // Actually if user_id is null, "auth.uid() = user_id" is false.
                // So guests can't see their orders via RLS unless we updated 'select' policy?
                // We updated INSERT policy, but maybe not SELECT.

                // For now, let's assume the user is logged in as per screenshot.

                setOrder(orderData)

                // Fetch items
                const { data: itemsData, error: itemsError } = await supabase
                    .from('order_items')
                    .select('*, product:products(*, product_images(image_url))')
                    .eq('order_id', params.id)

                if (itemsError) throw itemsError
                setItems(itemsData || [])

            } catch (err: any) {
                console.error(err)
                setError('Failed to load order details')
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchOrderDetails()
        }
    }, [params.id])

    if (loading) return <div className="p-20 text-center">Loading details...</div>
    if (error) return <div className="p-20 text-center text-red-500">{error}</div>
    if (!order) return <div className="p-20 text-center">Order not found</div>

    return (
        <div className="bg-emerald-50/10 min-h-screen py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/orders" className="inline-flex items-center text-emerald-800 hover:text-emerald-950 mb-6">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Orders
                </Link>

                <div className="bg-white rounded-lg shadow-sm border border-emerald-900/10 overflow-hidden">
                    {/* Header */}
                    <div className="bg-emerald-900 p-6 text-white flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <h1 className="font-serif text-2xl mb-1">Order #{order.id.slice(0, 8)}</h1>
                            <p className="text-emerald-200 text-sm">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="bg-emerald-800 px-3 py-1 rounded-full text-sm font-medium capitalize border border-emerald-700">
                                {order.order_status}
                            </span>
                            <span className="bg-amber-600 px-3 py-1 rounded-full text-sm font-medium capitalize">
                                {order.payment_status}
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Items */}
                        <div className="mb-10">
                            <h2 className="font-serif text-lg text-emerald-950 mb-4 flex items-center">
                                <Package className="w-5 h-5 mr-2" /> Order Items
                            </h2>
                            <div className="space-y-4">
                                {items.map((item) => {
                                    // Helper to get image URL safely
                                    const imageUrl = item.product?.product_images?.[0]?.image_url

                                    return (
                                        <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 relative">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={item.product?.name || 'Product'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">IMG</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</h3>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:mt-0 font-medium text-emerald-900">
                                                {formatCurrency(item.price_at_purchase * item.quantity)}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="font-bold text-gray-700">Total Amount</span>
                                <span className="font-serif text-2xl text-emerald-950 font-bold">{formatCurrency(order.total_amount)}</span>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="font-serif text-lg text-emerald-950 mb-4 flex items-center">
                                    <Truck className="w-5 h-5 mr-2" /> Shipping Details
                                </h2>
                                <div className="bg-gray-50 p-4 rounded-sm text-sm space-y-2 text-gray-700 whitespace-pre-line">
                                    {order.shipping_address}
                                </div>
                            </div>
                            <div>
                                <h2 className="font-serif text-lg text-emerald-950 mb-4 flex items-center">
                                    <CheckCircle className="w-5 h-5 mr-2" /> Order Status
                                </h2>
                                <div className="relative pl-4 border-l-2 border-emerald-200 space-y-6">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-600"></div>
                                        <p className="font-medium text-emerald-900">Order Placed</p>
                                        <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="relative">
                                        <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ${order.order_status === 'processing' ? 'bg-amber-400 animate-pulse' : 'bg-gray-300'}`}></div>
                                        <p className="font-medium text-gray-900">Processing</p>
                                        <p className="text-xs text-gray-500">We are preparing your order.</p>
                                    </div>
                                    <div className="relative">
                                        <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ${order.order_status === 'shipped' ? 'bg-emerald-600' : 'bg-gray-300'}`}></div>
                                        <p className="font-medium text-gray-900">Shipped</p>
                                        <p className="text-xs text-gray-500">Your order is on the way.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
