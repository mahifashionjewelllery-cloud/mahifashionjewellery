'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Globe } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

const AVAILABLE_ICONS: any = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
    mail: Mail,
    globe: Globe
}

export function Footer() {
    const [socialLinks, setSocialLinks] = useState<any[]>([])

    useEffect(() => {
        const fetchLinks = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('social_links')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: true })

            if (data) setSocialLinks(data)
        }
        fetchLinks()
    }, [])

    const renderIcon = (iconName: string) => {
        const Icon = AVAILABLE_ICONS[iconName] || Globe
        return <Icon className="h-5 w-5" />
    }

    return (
        <footer className="bg-emerald-950 border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <Image
                                src="/mahilogo.png"
                                alt="Mahi Fashion Jewellery"
                                width={50}
                                height={50}
                                className="h-12 w-auto object-contain"
                            />
                            <span className="font-serif text-2xl text-accent tracking-widest uppercase group-hover:text-white transition-colors">
                                Mahi Fashion Jewellery
                            </span>
                        </Link>
                        <p className="text-emerald-200/80 text-sm leading-relaxed mb-6">
                            Crafting timeless elegance in gold and silver. Each piece tells a story of heritage, purity, and unmatched artistry.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-200 hover:text-accent transition-colors"
                                    title={link.platform}
                                >
                                    {renderIcon(link.icon)}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-accent font-serif tracking-wide mb-6">Shop</h3>
                        <ul className="space-y-3 text-sm text-emerald-200/80">
                            <li><Link href="/shop?category=rings" className="hover:text-accent transition-colors">Rings</Link></li>
                            <li><Link href="/shop?category=necklaces" className="hover:text-accent transition-colors">Necklaces</Link></li>
                            <li><Link href="/shop?category=earrings" className="hover:text-accent transition-colors">Earrings</Link></li>
                            <li><Link href="/shop?category=bracelets" className="hover:text-accent transition-colors">Bracelets</Link></li>
                            <li><Link href="/shop?metal=gold" className="hover:text-accent transition-colors">Gold Jewellery</Link></li>
                            <li><Link href="/shop?metal=silver" className="hover:text-accent transition-colors">Silver Jewellery</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-accent font-serif tracking-wide mb-6">Support</h3>
                        <ul className="space-y-3 text-sm text-emerald-200/80">
                            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
                            <li><Link href="/faqs" className="hover:text-accent transition-colors">FAQs</Link></li>
                            <li><Link href="/shipping-returns" className="hover:text-accent transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/jewellery-care" className="hover:text-accent transition-colors">Jewellery Care</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-16 pt-8 text-center text-xs text-emerald-200/40">
                    <p>&copy; {new Date().getFullYear()} Mahi Fashion Jewellery. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
