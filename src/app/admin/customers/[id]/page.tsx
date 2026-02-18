'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface CustomerDetails {
    id: string
    name: string
    email: string
    phone: string
    address: string
    joined: string
    totalOrders: number
    totalSpent: number
}

interface Order {
    id: string
    created_at: string
    total_amount: number
    payment_status: string
    order_status: string
    items_count?: number
}

export default function CustomerDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [customer, setCustomer] = useState<CustomerDetails | null>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (params.id) {
            fetchCustomerDetails(params.id as string)
        }
    }, [params.id])

    const fetchCustomerDetails = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/customers/${id}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch customer details')
            }

            setCustomer(data.customer)
            setOrders(data.orders || [])
        } catch (error: any) {
            console.error('Error fetching customer details:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
            </div>
        )
    }

    if (error || !customer) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Customer</h2>
                <p className="text-gray-500 mb-6">{error || 'Customer not found'}</p>
                <Link href="/admin/customers" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    &larr; Back to Customers
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto">
            <button
                onClick={() => router.back()}
                className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Customers
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Profile Card */}
                <div className="md:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-3xl font-bold mb-4">
                            {customer.name.charAt(0)}
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">{customer.name}</h1>
                        <p className="text-sm text-gray-500">Customer ID: {customer.id.slice(0, 8)}</p>
                    </div>

                    <div className="space-y-4 border-t border-gray-100 pt-4">
                        <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                                <p className="text-sm text-gray-900">{customer.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                                <p className="text-sm text-gray-900">{customer.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Address</p>
                                <p className="text-sm text-gray-900">{customer.address || 'No address provided'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Joined</p>
                                <p className="text-sm text-gray-900">{new Date(customer.joined).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{customer.totalOrders}</p>
                            <p className="text-xs text-gray-500 uppercase">Orders</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(customer.totalSpent)}</p>
                            <p className="text-xs text-gray-500 uppercase">Spent</p>
                        </div>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Package className="h-5 w-5 text-gray-500" />
                            Order History
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No orders found for this customer.
                                        </td>
                                    </tr>
                                ) : orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                            #{order.id.slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {formatCurrency(order.total_amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full uppercase
                                                ${order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {order.order_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full uppercase
                                                ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                                    order.payment_status === 'cod' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
