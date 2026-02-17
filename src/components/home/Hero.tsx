'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function Hero() {
    return (
        <section className="relative h-[80vh] sm:h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <Image
                        src="/herojewell.png"
                        alt="Hero Background"
                        fill
                        className="object-cover"
                        priority={true}
                    />
                </motion.div>
                <div className="absolute inset-0 bg-emerald-950/60 z-10" />
            </div>

            <div className="relative z-20 text-center max-w-5xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl text-white mb-6 tracking-wide">
                        Timeless <span className="text-accent italic font-light">Elegance</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-emerald-50/90 text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed font-light"
                >
                    Discover our exclusive collection of handcrafted gold and silver jewellery, designed to celebrate your most precious moments.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link href="/shop">
                        <Button size="lg" className="w-full sm:w-auto min-w-[200px] text-lg py-6 bg-accent text-emerald-950 hover:bg-white hover:text-emerald-950 border-none">
                            Shop Collection
                        </Button>
                    </Link>
                    <Link href="/about">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px] text-lg py-6 text-white border-white/30 hover:bg-white/10 hover:border-white backdrop-blur-sm">
                            Our Story
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:block"
            >
                <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent mx-auto" />
                <span className="text-[10px] uppercase tracking-widest text-white/50 mt-2 block">Scroll</span>
            </motion.div>
        </section>
    )
}
