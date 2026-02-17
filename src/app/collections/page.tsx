'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Collection {
    id: string
    name: string
    image_url: string
    link: string
    display_order: number
}

export default function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCollections = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('collections')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true })

            if (data) setCollections(data)
            setLoading(false)
        }
        fetchCollections()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        )
    }

    return (
        <div className="bg-background min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="font-serif text-4xl md:text-5xl text-emerald-950 mb-6">Our Collections</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Explore our themed collections, curated to match every occasion and style.
                    </p>
                </motion.div>

                <div className="space-y-20">
                    {collections.length === 0 ? (
                        <p className="text-center text-gray-500">No collections found.</p>
                    ) : (
                        collections.map((collection, index) => (
                            <motion.div
                                key={collection.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className="w-full md:w-1/2 relative h-[400px] rounded-sm overflow-hidden group">
                                    <div className="absolute inset-0 bg-emerald-950/10 group-hover:bg-transparent transition-colors z-10" />
                                    <Image
                                        src={collection.image_url}
                                        alt={collection.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                <div className="w-full md:w-1/2 text-center md:text-left">
                                    <h2 className="font-serif text-3xl text-emerald-900 mb-4">{collection.name}</h2>
                                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                        Discover the elegance of our {collection.name}. Handcrafted to perfection.
                                    </p>
                                    <Link href={collection.link}>
                                        <button className="inline-flex items-center px-6 py-3 border border-emerald-900 text-emerald-900 hover:bg-emerald-900 hover:text-white transition-colors duration-300 uppercase tracking-widest text-sm font-medium">
                                            View Collection <ArrowRight className="ml-2 h-4 w-4" />
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
