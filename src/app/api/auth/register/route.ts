import { createServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, phone, password, fullName } = body

        // Initialize Supabase Admin Client
        const supabaseAdmin = createServerClient()

        // Validate inputs
        if (!password) {
            return NextResponse.json(
                { error: 'Password is required' },
                { status: 400 }
            )
        }

        if (!email && !phone) {
            return NextResponse.json(
                { error: 'Email or Phone is required' },
                { status: 400 }
            )
        }

        // Create User Options
        const userAttributes: any = {
            password,
            email_confirm: true,
            phone_confirm: true,
            user_metadata: {
                full_name: fullName
            }
        }

        if (email) {
            userAttributes.email = email
            // If phone is also provided, add it to metadata or as phone attribute if unique?
            // createClient admin.createUser doesn't support setting both email and phone as primary identities cleanly in one go 
            // without potential conflict if one is already taken.
            // But we can set phone in metadata if email is primary, or vice versa.
            // Let's stick to the logic:
            // If Email is provided, use it as identity. Phone goes to user_metadata or phone attribute?
            // Safest: Set email as primary identity. Set phone in attributes if valid.
            if (phone) {
                userAttributes.phone = phone
            }
        } else if (phone) {
            userAttributes.phone = phone
        }

        const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser(userAttributes)

        if (createError) {
            return NextResponse.json(
                { error: createError.message },
                { status: 400 }
            )
        }

        if (user.user) {
            // Create Profile Entry (if trigger doesn't handle it, or to be safe/explicit with metadata)
            // Our schema has a trigger `on_auth_user_created` which uses `new.raw_user_meta_data->>'full_name'`.
            // So profile should be created automatically.
            // We might need to ensure `phone` is in the profile if it was passed.
            // The trigger uses `new.phone`. `admin.createUser` sets `new.phone` if we passed `phone`.
            // So we should be good.

            return NextResponse.json(
                { message: 'User created successfully', user: user.user },
                { status: 200 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        )

    } catch (error: any) {
        console.error('Registration Error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
