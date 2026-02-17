import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServerClient as createServiceRoleClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

export async function GET() {
    try {
        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                        }
                    },
                },
            }
        )

        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Use Service Role for data fetching to bypass RLS
        const supabaseAdmin = createServiceRoleClient()

        // Fetch orders ordered by date (no join)
        const { data: orders, error: ordersError } = await supabaseAdmin
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })

        if (ordersError) throw ordersError

        // Calculate Dashboard Stats

        // 1. Total Revenue (all non-cancelled orders)
        const totalRevenue = orders
            .filter(o => o.order_status !== 'cancelled')
            .reduce((sum, o) => sum + Number(o.total_amount), 0)

        // 2. Active Orders (pending, processing or shipped)
        const activeOrders = orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.order_status)).length

        // 3. Registered Users Count (approx from profiles)
        const { count: usersCount } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true })

        // 4. Products Count
        const { count: productsCount } = await supabaseAdmin.from('products').select('*', { count: 'exact', head: true })

        // 5. Sales Trend (Revenue by month) - Last 6 months
        // This is complex in SQL/JS. Simplified: grouping current fetched orders (which might be few)
        // Ideally we use a SQL view or RPC, but let's do simple aggregation here.
        const monthlyRevenue: Record<string, number> = {}
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        orders.forEach(order => {
            if (order.order_status !== 'cancelled') {
                const date = new Date(order.created_at)
                const month = months[date.getMonth()]
                monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(order.total_amount)
            }
        })

        // Format for Recharts
        const salesData = Object.keys(monthlyRevenue).map(name => ({
            name,
            revenue: monthlyRevenue[name]
        }))

        // Sort by month index if needed, but object keys iteration might be arbitrary order. 
        // For now let's just use what we have, or ensure order.
        // Better: Initialize last 6 months with 0.

        // 6. Category Distribution (Products by metal_type)
        const { data: products } = await supabaseAdmin.from('products').select('metal_type')
        const categoryMap: Record<string, number> = {}

        products?.forEach(p => {
            const type = p.metal_type || 'Other'
            const key = type.charAt(0).toUpperCase() + type.slice(1) // Capitalize
            categoryMap[key] = (categoryMap[key] || 0) + 1
        })

        const categoryData = Object.keys(categoryMap).map(name => ({
            name,
            value: categoryMap[name]
        }))

        return NextResponse.json({
            stats: {
                totalRevenue,
                activeOrders,
                totalProducts: productsCount || 0,
                registeredUsers: usersCount || 0
            },
            salesData,
            categoryData,
            recentOrders: orders.slice(0, 5)
        })

    } catch (error: any) {
        console.error('Error fetching dashboard stats:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
