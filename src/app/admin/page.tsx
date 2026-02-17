'use client'

import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'
import { ShoppingBag, ShoppingCart, Users, DollarSign, TrendingUp, Package } from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts'

const COLORS = ['#047857', '#94a3b8', '#10b981', '#f59e0b', '#3b82f6'];

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>({
        totalRevenue: 0,
        activeOrders: 0,
        totalProducts: 0,
        registeredUsers: 0
    })
    const [salesData, setSalesData] = useState<any[]>([])
    const [categoryData, setCategoryData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/admin/dashboard')
                const data = await response.json()

                if (data.stats) setStats(data.stats)
                if (data.salesData) setSalesData(data.salesData)
                if (data.categoryData) setCategoryData(data.categoryData)
            } catch (error) {
                console.error('Error loading dashboard:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const statCards = [
        { name: 'Total Revenue', value: stats.totalRevenue, icon: DollarSign, type: 'currency' },
        { name: 'Active Orders', value: stats.activeOrders, icon: ShoppingCart, type: 'number' },
        { name: 'Total Products', value: stats.totalProducts, icon: ShoppingBag, type: 'number' },
        { name: 'Registered Users', value: stats.registeredUsers, icon: Users, type: 'number' },
    ]

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((item) => (
                    <div key={item.name} className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden transition-transform hover:scale-105 duration-300">
                        <dt>
                            <div className="absolute bg-emerald-900 rounded-md p-3">
                                <item.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                            </div>
                            <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
                        </dt>
                        <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                            <p className="text-2xl font-semibold text-gray-900">
                                {item.type === 'currency' ? formatCurrency(item.value) : item.value}
                            </p>
                        </dd>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-gray-900">Revenue Trend</h2>
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `₹${value / 1000}k`}
                                />
                                <Tooltip
                                    formatter={(value: any) => typeof value === 'number' ? formatCurrency(value) : value}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#047857"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-gray-900">Products by Category</h2>
                        <Package className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
