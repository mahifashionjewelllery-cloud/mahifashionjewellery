'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, ShoppingCart, TrendingUp, Settings, LogOut, Users, Image as ImageIcon, LayoutList, Share2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Collections', href: '/admin/collections', icon: LayoutList },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Metal Rates', href: '/admin/metal-rates', icon: TrendingUp },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Social Media', href: '/admin/social', icon: Share2 },
]

interface AdminSidebarProps {
    isOpen?: boolean
    onClose?: () => void
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname()

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm transition-opacity md:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-emerald-950 border-r border-emerald-900 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:transform-none md:fixed md:inset-y-0 md:flex md:flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo & Close Button */}
                <div className="flex items-center justify-between h-16 px-4 bg-emerald-950 border-b border-emerald-900">
                    <span className="font-serif text-xl text-accent tracking-widest uppercase">Admin Panel</span>
                    <button
                        onClick={onClose}
                        className="md:hidden text-emerald-200 hover:text-white"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Nav */}
                <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
                    <nav className="mt-5 flex-1 px-2 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={onClose} // Auto-close on mobile nav
                                    className={cn(
                                        isActive ? 'bg-emerald-900 text-accent' : 'text-emerald-100 hover:bg-emerald-900/50 hover:text-white',
                                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                                    )}
                                >
                                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="flex-shrink-0 flex border-t border-emerald-900 p-4">
                    <button className="flex-shrink-0 w-full group block text-emerald-100 hover:text-white">
                        <div className="flex items-center">
                            <LogOut className="inline-block h-5 w-5 mr-3" />
                            <span className="text-sm font-medium">Logout</span>
                        </div>
                    </button>
                </div>
            </div>
        </>
    )
}
