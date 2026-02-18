'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { Search, Mail, Phone, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import Image from 'next/image'

// Mock Customer Data
const CustomersPage = () => {
    const [customers, setCustomers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            const response = await fetch('/api/admin/customers')
            const data = await response.json()
            if (data.customers) {
                setCustomers(data.customers)
            }
        } catch (error) {
            console.error('Error fetching customers:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your registered users and view their history.</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search customers by name or email..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                <div className="text-xs text-gray-500">ID: {customer.id.slice(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 flex items-center gap-2">
                                            <Mail className="h-3 w-3 text-gray-400" /> {customer.email}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                            <Phone className="h-3 w-3 text-gray-400" /> {customer.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3 text-gray-400" />
                                            {new Date(customer.joined).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {customer.totalOrders}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                                        ₹{customer.totalSpent.toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/admin/customers/${customer.id}`} className="text-emerald-600 hover:text-emerald-900 font-medium hover:underline">
                                            View History
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CustomersPage
