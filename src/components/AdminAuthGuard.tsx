'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient()

            // Check if user is logged in
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                console.log('Redirecting to /login - No session')
                router.push('/login')
                return
            }

            // Check if user has admin role
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single()

            console.log('Admin Check:', { userId: session.user.id, profile, error })

            if (error || profile?.role !== 'admin') {
                console.log('Redirecting to / - Not admin', { error, role: profile?.role })
                router.push('/')
                return
            }

            setIsAuthorized(true)
            setIsLoading(false)
        }

        checkAuth()
    }, [router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying access...</p>
                </div>
            </div>
        )
    }

    if (!isAuthorized) {
        return null
    }

    return <>{children}</>
}
