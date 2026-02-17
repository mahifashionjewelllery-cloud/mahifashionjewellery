'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Order } from '@/types'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

// Mock Data
const mockOrders: Order[] = [
    {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: 'user_1',
        razorpay_order_id: 'order_KWD123',
        razorpay_payment_id: 'pay_KWD123',
        total_amount: 154000,
        payment_status: 'paid',
        order_status: 'processing',
        shipping_address: '123 Main St, Mumbai',
        created_at: new Date(Date.now() - 86400000).toISOString()
    }
]

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true)
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
                if (data) setOrders(data)
            }
            setLoading(false)
        }
        fetchOrders()
    }, [])

    if (loading) return <div className="p-20 text-center"><p className="animate-pulse">Loading orders...</p></div>

    return (
        <div className="bg-background min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-serif text-3xl text-foreground mb-8">Your Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-emerald-50/5 rounded-sm border border-emerald-900/10">
                        <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                        <Link href="/shop">
                            <Button>Start Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white p-6 rounded-sm border border-emerald-900/10 shadow-sm">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                                    <div>
                                        <span className="text-xs text-gray-400 uppercase tracking-wide block">Order ID</span>
                                        <span className="font-mono text-sm text-emerald-900">#{order.id.slice(0, 8)}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400 uppercase tracking-wide block">Date</span>
                                        <span className="text-sm text-emerald-900">{new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400 uppercase tracking-wide block">Total Amount</span>
                                        <span className="font-bold text-emerald-900">{formatCurrency(order.total_amount)}</span>
                                    </div>
                                    <div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                        ${order.order_status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {order.order_status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <div className="text-sm text-gray-500">
                                        Payment Status: <span className="font-medium text-emerald-700 capitalize">{order.payment_status}</span>
                                    </div>

                                    <Link href={`/orders/${order.id}`}>
                                        <Button variant="outline" size="sm">View Details</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
