
import { createServerClient } from '@/lib/supabase-server'
import { createServerClient as createSSRClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        // 1. Get current user if logged in (for linking order to user)
        const cookieStore = await cookies()
        const supabaseSSR = createSSRClient(
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
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    }
                }
            }
        )
        const { data: { user } } = await supabaseSSR.auth.getUser()

        // 2. Use Service Role Client for database operations (bypasses RLS)
        const supabaseAdmin = createServerClient()

        const body = await req.json()
        const { items, shippingDetails, totalAmount } = body

        // Validate request
        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 })
        }

        if (!shippingDetails || !shippingDetails.name || !shippingDetails.address) {
            return NextResponse.json({ error: 'Shipping details are required' }, { status: 400 })
        }

        // Format shipping address
        const shippingAddress = `${shippingDetails.name}\n${shippingDetails.phone}\n${shippingDetails.address}\n${shippingDetails.city}, ${shippingDetails.pincode}\nEmail: ${shippingDetails.email}`

        // Create order in database
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                user_id: user ? user.id : null, // Link to user if logged in, else null
                total_amount: totalAmount,
                payment_status: 'cod',
                payment_method: 'cod',
                order_status: 'processing',
                shipping_address: shippingAddress,
            })
            .select()
            .single()

        if (orderError) {
            console.error('Error creating order:', orderError)
            return NextResponse.json({ error: 'Failed to create order: ' + orderError.message }, { status: 500 })
        }

        // Create order items
        // We also use admin client here because order items might be restricted by RLS if user_id is null
        // RLS for order_items usually checks if user owns the order.
        // If user_id is null, RLS will fail for anon users unless we have public insert policy.
        // Using admin client bypasses this.

        const orderItems = items.map((item: any) => ({
            order_id: order.id,
            product_id: item.product.id,
            quantity: item.quantity,
            price_at_purchase: item.currentPrice,
        }))

        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItems)

        if (itemsError) {
            console.error('Error creating order items:', itemsError)
            // Optionally rollback order creation here
            // But for now we just return error
            return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            orderId: order.id,
            message: 'Order placed successfully',
        })

    } catch (error: any) {
        console.error('Error processing order:', error)
        return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 })
    }
}
