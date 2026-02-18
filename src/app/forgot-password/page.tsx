'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [email, setEmail] = useState('')

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${location.origin}/auth/callback?next=/reset-password`,
            })

            if (error) throw error

            setSuccess(true)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl border border-emerald-900/5 text-center">
                    <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-serif text-emerald-950 mb-4">Check your email</h2>
                    <p className="text-gray-600 mb-8">
                        We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>. Please check your inbox and spam folder.
                    </p>
                    <Link href="/login">
                        <Button variant="outline" className="w-full">
                            Back to Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl border border-emerald-900/5">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-serif text-emerald-950">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleReset}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <Input
                            label="Email address"
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Sending Link...</> : 'Send Reset Link'}
                    </Button>

                    <div className="text-center mt-4">
                        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
