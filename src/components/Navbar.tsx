'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingBag, User, Menu, X, Search, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/lib/utils'
import { Button } from './ui/Button'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export function Navbar() {
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const cartItems = useCartStore((state) => state.items)
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

    // Check for user session
    useEffect(() => {
        const supabase = createClient()

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <nav className="bg-background border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-background/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-3 group">
                            <Image
                                src="/mahilogo.png"
                                alt="Mahi Fashion Jewellery"
                                width={50}
                                height={50}
                                className="h-12 w-auto object-contain"
                                priority
                            />
                            <div className="flex flex-col items-start leading-none">
                                <span className="font-serif text-2xl sm:text-3xl text-accent tracking-widest uppercase font-bold">Mahi</span>
                                <span className="font-sans text-[0.6rem] sm:text-xs text-emerald-100 tracking-[0.2em] sm:tracking-[0.3em] uppercase group-hover:text-white transition-colors">Fashion Jewellery</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="text-foreground/80 hover:text-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">
                                Home
                            </Link>
                            <Link href="/shop" className="text-foreground/80 hover:text-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">
                                Shop
                            </Link>
                            <Link href="/collections" className="text-foreground/80 hover:text-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">
                                Collections
                            </Link>
                            <Link href="/about" className="text-foreground/80 hover:text-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">
                                About
                            </Link>
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="relative group">
                            <div className={cn(
                                "flex items-center bg-white/5 rounded-full px-3 py-1 transition-all duration-300",
                                isSearchOpen ? "w-64 opacity-100" : "w-8 opacity-0 pointer-events-none absolute right-0"
                            )}>
                                <Search className="h-4 w-4 text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none focus:outline-none text-sm text-foreground w-full placeholder:text-gray-500"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            window.location.href = `/shop?search=${e.currentTarget.value}`
                                        }
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className={cn("text-foreground/80 hover:text-accent transition-colors p-2", isSearchOpen && "hidden")}
                            >
                                <Search className="h-5 w-5" />
                            </button>
                        </div>
                        {user ? (
                            <div className="relative group">
                                <button className="text-foreground/80 hover:text-accent transition-colors p-2 flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    <span className="text-sm hidden lg:inline">{user.email?.split('@')[0]}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-background border border-white/10 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <Link href="/orders" className="block px-4 py-2 text-sm text-foreground/80 hover:bg-white/5 hover:text-accent">
                                        My Orders
                                    </Link>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-foreground/80 hover:bg-white/5 hover:text-accent flex items-center gap-2">
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="text-foreground/80 hover:text-accent transition-colors p-2">
                                <User className="h-5 w-5" />
                            </Link>
                        )}
                        <Link href="/cart" className="text-foreground/80 hover:text-accent transition-colors p-2 relative">
                            <ShoppingBag className="h-5 w-5" />
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-background bg-accent rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <Link href="/cart" className="text-foreground/80 hover:text-accent transition-colors p-2 relative mr-2">
                            <ShoppingBag className="h-5 w-5" />
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-background bg-accent rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-accent focus:outline-none"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-background border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            href="/"
                            className="text-foreground/80 hover:text-accent block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/shop"
                            className="text-foreground/80 hover:text-accent block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Shop
                        </Link>
                        <Link
                            href="/collections"
                            className="text-foreground/80 hover:text-accent block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Collections
                        </Link>
                        <Link
                            href="/about"
                            className="text-foreground/80 hover:text-accent block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                        <div className="border-t border-white/10 mt-4 pt-4">
                            {user ? (
                                <>
                                    <div className="px-3 py-2 text-sm text-foreground/60">
                                        {user.email}
                                    </div>
                                    <Link
                                        href="/orders"
                                        className="text-foreground/80 hover:text-accent flex items-center px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <User className="h-5 w-5 mr-3" /> My Orders
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout()
                                            setIsMenuOpen(false)
                                        }}
                                        className="w-full text-left text-foreground/80 hover:text-accent flex items-center px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        <LogOut className="h-5 w-5 mr-3" /> Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="text-foreground/80 hover:text-accent flex items-center px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User className="h-5 w-5 mr-3" /> Login / Profile
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
