import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client with service role key
 * Use this ONLY in API routes or server components where you need admin privileges
 * DO NOT use this in client components
 */
export const createServerClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceRoleKey) {
        throw new Error('Missing Supabase server environment variables')
    }

    return createClient(url, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}

/**
 * Server-side Supabase client with anon key (for server components)
 * Use this in server components where you want RLS to apply
 */
export const createServerAnonClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !anonKey) {
        throw new Error('Missing Supabase environment variables')
    }

    return createClient(url, anonKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
