import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServerClient as createServiceRoleClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
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

        // 1. Fetch user profile
        const { data: customerProfile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single()

        if (profileError) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
        }

        // 2. Fetch user email from auth (admin only)
        const { data: { user: customerUser }, error: userError } = await supabaseAdmin.auth.admin.getUserById(id)

        // 3. Fetch user orders
        const { data: orders, error: ordersError } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('user_id', id)
            .order('created_at', { ascending: false })

        if (ordersError) throw ordersError

        // 4. Calculate stats
        const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_amount), 0)

        const customer = {
            id: customerProfile.id,
            name: customerProfile.full_name || 'N/A',
            email: customerUser?.email || 'N/A',
            phone: customerProfile.phone || 'N/A',
            address: customerProfile.address || 'N/A',
            joined: customerProfile.created_at,
            totalOrders: orders.length,
            totalSpent: totalSpent
        }

        return NextResponse.json({ customer, orders })
    } catch (error: any) {
        console.error('Error fetching customer details:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
