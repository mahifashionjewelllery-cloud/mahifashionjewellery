'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        try {
            // 1. Create User via API (Auto-confirmed)
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: form.email,
                    phone: form.phone || null,
                    password: form.password,
                    fullName: form.fullName
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed')
            }

            // 2. Auto-Login with email
            const supabase = createClient()
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password
            })

            if (loginError) {
                // Account created but login failed? 
                setError('Account created, but auto-login failed. Please sign in.')
                setLoading(false)
                // Optionally redirect to login
                setTimeout(() => router.push('/login'), 2000)
            } else {
                router.push('/')
                router.refresh()
            }

        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl border border-emerald-900/5">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-serif text-emerald-950">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link href="/login" className="font-medium text-accent hover:text-accent/80">
                            sign in to existing account
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <Input
                            label="Full Name"
                            type="text"
                            required
                            placeholder="John Doe"
                            value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        />
                        <Input
                            label="Email address"
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        <Input
                            label="Mobile Number (Optional)"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                        <Input
                            label="Password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Creating Account...</> : 'Create Account'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
