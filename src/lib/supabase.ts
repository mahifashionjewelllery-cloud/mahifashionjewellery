import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
        console.warn('Supabase keys missing. Auth and DB features will not work.')
        throw new Error('Missing Supabase environment variables')
    }

    return createBrowserClient(url, key)
}
