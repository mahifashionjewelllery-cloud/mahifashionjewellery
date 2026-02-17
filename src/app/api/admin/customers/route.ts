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

        // Use Service Role client
        const supabaseAdmin = createServiceRoleClient()

        // 1. Fetch all users to get their emails (admin only feature)
        const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
        if (usersError) throw usersError

        // 2. Fetch all profiles
        const { data: profiles, error: profilesError } = await supabaseAdmin
            .from('profiles')
            .select('*')
        if (profilesError) throw profilesError

        // 3. Fetch all orders to calculate stats
        const { data: orders, error: ordersError } = await supabaseAdmin
            .from('orders')
            .select('user_id, total_amount')
        if (ordersError) throw ordersError

        // 4. Combine data
        const customers = profiles.map(profile => {
            const user = users.find(u => u.id === profile.id)
            // If user not found (deleted from auth but profile exists?), handle gracefully

            const userOrders = orders.filter(o => o.user_id === profile.id)
            const totalSpent = userOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)

            return {
                id: profile.id,
                name: profile.full_name || 'N/A',
                email: user?.email || 'N/A',
                phone: profile.phone || 'N/A',
                joined: profile.created_at,
                totalOrders: userOrders.length,
                totalSpent: totalSpent
            }
        })

        return NextResponse.json({ customers })
    } catch (error: any) {
        console.error('Error fetching customers:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
