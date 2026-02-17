'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const defaultCategories = [
    {
        id: '1',
        name: 'Gold Jewellery',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop',
        link: '/shop?metal=gold'
    },
    {
        id: '2',
        name: 'Silver Collection',
        image: 'https://images.unsplash.com/photo-1602751584552-8ba43d5c38f4?q=80&w=2070&auto=format&fit=crop',
        link: '/shop?metal=silver'
    },
    {
        id: '3',
        name: 'Diamond Essence',
        image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974&auto=format&fit=crop',
        link: '/shop?metal=diamond'
    },
    {
        id: '4',
        name: 'Wedding Collection',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb0537bf?q=80&w=2070&auto=format&fit=crop',
        link: '/collections/wedding'
    }
]

interface Category {
    id: string
    name: string
    image: string
    link: string
}

export function Categories() {
    const [categories, setCategories] = useState<Category[]>(defaultCategories)

    const fetchCategories = async () => {
        try {
            const supabase = createClient()
            const { data } = await supabase
                .from('collections')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true })

            if (data && data.length > 0) {
                setCategories(data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    image: item.image_url,
                    link: item.link
                })))
            }
        } catch (error) {
            // Error fetching categories, using defaults
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }

    return (
        <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="font-serif text-4xl text-foreground mb-4">Curated Categories</h2>
                        <div className="h-1 w-24 bg-accent mx-auto" />
                    </motion.div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {categories.map((category) => (
                        <motion.div key={category.id} variants={item}>
                            <Link
                                href={category.link}
                                className="group relative h-96 overflow-hidden rounded-sm block"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url('${category.image}')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <h3 className="font-serif text-2xl text-white mb-2">{category.name}</h3>
                                    <span className="inline-flex items-center text-accent text-sm font-medium tracking-wide">
                                        Explore <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
