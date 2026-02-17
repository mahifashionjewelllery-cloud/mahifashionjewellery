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

        // Use Service Role for data fetching
        const supabaseAdmin = createServiceRoleClient()

        // Fetch orders raw (no join)
        const { data: orders, error: ordersError } = await supabaseAdmin
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })

        if (ordersError) throw ordersError

        // Extract user IDs to fetch profiles
        const userIds = Array.from(new Set(orders.map(o => o.user_id).filter(Boolean)))

        let profiles: any[] = []
        if (userIds.length > 0) {
            const { data: profilesData } = await supabaseAdmin
                .from('profiles')
                .select('id, full_name, phone')
                .in('id', userIds)
            if (profilesData) profiles = profilesData
        }

        // Helper function to map user ID to email using Service Role
        // For 2 users, this is fine. For 1000, maybe pagination needed, but standard listUsers returns 50 per page?
        // listUsers() without params returns first 50.
        // We might miss users if we have > 50.
        // But for now, let's keep simple.
        const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })

        const enrichedOrders = orders.map(order => {
            const profile = profiles.find(p => p.id === order.user_id)
            const user = users?.find(u => u.id === order.user_id)

            return {
                ...order,
                customer_name: profile?.full_name || 'Guest User',
                customer_email: user?.email || 'N/A',
                customer_phone: profile?.phone || 'N/A'
            }
        })

        return NextResponse.json({ orders: enrichedOrders })

    } catch (error: any) {
        console.error('Error fetching admin orders:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch { }
                    },
                },
            }
        )

        // Check Admin
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { id, status } = await request.json()

        const { error } = await supabase
            .from('orders')
            .update({ order_status: status })
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
