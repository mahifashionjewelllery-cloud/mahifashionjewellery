'use client'

import { useState } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminAuthGuard } from '@/components/AdminAuthGuard'
import { Menu } from 'lucide-react'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <AdminAuthGuard>
            <div className="min-h-screen bg-gray-100">
                {/* Mobile Header */}
                <div className="md:hidden bg-emerald-950 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
                    <span className="font-serif text-lg tracking-widest uppercase text-accent">Admin Panel</span>
                    <button onClick={() => setSidebarOpen(true)} className="p-1 rounded-md hover:bg-emerald-900 transition-colors">
                        <Menu className="h-6 w-6 text-emerald-100" />
                    </button>
                </div>

                <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="md:pl-64 flex flex-col flex-1">
                    {/* Desktop Header */}
                    <div className="hidden md:flex h-16 bg-white border-b border-gray-200 px-8 items-center justify-between shadow-sm">
                        <h1 className="text-xl font-serif text-emerald-950">Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">Welcome, Admin</span>
                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">A</div>
                        </div>
                    </div>

                    <main className="flex-1 pb-8">
                        <div className="py-6 px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AdminAuthGuard>
    )
}
