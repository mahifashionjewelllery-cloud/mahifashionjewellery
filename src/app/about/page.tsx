import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Award, Heart, Shield, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white py-20">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="font-serif text-4xl md:text-6xl mb-6 animate-fade-in-up">
                            About Mahi Fashion Jewellery
                        </h1>
                        <p className="text-xl text-emerald-100 leading-relaxed">
                            Crafting timeless elegance in the heart of Kanyakumari since generations
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 bg-gradient-to-b from-white to-emerald-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="font-serif text-3xl text-emerald-950 mb-6">Our Story</h2>
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    Nestled in the picturesque coastal town of Kanyakumari, <strong>Mahi Fashion Jewellery</strong> has been
                                    a beacon of trust and craftsmanship for discerning jewellery lovers. What began as a small family
                                    venture has blossomed into one of the region's most cherished jewellery destinations.
                                </p>
                                <p>
                                    Our journey is rooted in a deep passion for creating exquisite pieces that celebrate life's precious
                                    moments. From traditional temple jewellery to contemporary designs, each piece is meticulously crafted
                                    by skilled artisans who pour their heart and soul into every creation.
                                </p>
                                <p>
                                    With our showroom in <strong>Ettani</strong>, we've become an integral part of
                                    the Kanyakumari community, serving families across generations with authenticity, quality, and
                                    unparalleled customer service.
                                </p>
                            </div>
                        </div>
                        <div className="relative rounded-lg overflow-hidden shadow-xl group">
                            <img
                                src="/ownerpic.jpeg"
                                alt="Rajeesh R - Owner of Mahi Fashion Jewellery"
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-950/90 to-transparent p-6 pt-20">
                                <p className="text-emerald-200 text-sm font-medium tracking-wider uppercase mb-1">Owner</p>
                                <h3 className="text-white font-serif text-2xl">Rajeesh R</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="font-serif text-3xl text-emerald-950 text-center mb-12">What We Stand For</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-emerald-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                <Award className="h-10 w-10 text-emerald-700" />
                            </div>
                            <h3 className="font-serif text-xl text-emerald-900 mb-2">Authenticity</h3>
                            <p className="text-gray-600 text-sm">
                                100% BIS hallmarked gold and certified diamonds. Every piece comes with a guarantee of purity.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-amber-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-10 w-10 text-amber-700" />
                            </div>
                            <h3 className="font-serif text-xl text-emerald-900 mb-2">Craftsmanship</h3>
                            <p className="text-gray-600 text-sm">
                                Handcrafted by master artisans with decades of experience in traditional and modern designs.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-emerald-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-10 w-10 text-emerald-700" />
                            </div>
                            <h3 className="font-serif text-xl text-emerald-900 mb-2">Trust</h3>
                            <p className="text-gray-600 text-sm">
                                Transparent pricing, lifetime exchange, and buyback policies that put our customers first.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-amber-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="h-10 w-10 text-amber-700" />
                            </div>
                            <h3 className="font-serif text-xl text-emerald-900 mb-2">Innovation</h3>
                            <p className="text-gray-600 text-sm">
                                Blending timeless traditions with contemporary styles to create pieces for every occasion.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Locations */}
            <section className="py-16 bg-gradient-to-b from-emerald-50/30 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="font-serif text-3xl text-emerald-950 text-center mb-12">Visit Our Showroom</h2>
                    <div className="grid md:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">

                        {/* Ettani Location Info */}
                        <div className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden hover:shadow-xl transition-shadow h-full">
                            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-6 text-white">
                                <h3 className="font-serif text-2xl mb-2">Ettani Showroom</h3>
                                <p className="text-amber-100">Serving the community</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-amber-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">Address</p>
                                        <p className="text-gray-600">Mahi Fashion Jewellery, Bazaar Street, Ettani, Kanyakumari District, Tamil Nadu - 629177</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-amber-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">Phone</p>
                                        <p className="text-gray-600">+91 73051 23617</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">Hours</p>
                                        <p className="text-gray-600">Mon - Sat: 9:00 AM - 8:00 PM</p>
                                        <p className="text-gray-600">Sunday: 10:00 AM - 6:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Embed */}
                        <div className="h-full min-h-[300px] bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-emerald-100">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.449830087065!2d77.23786257579212!3d8.25794280058009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04ff403271a1b7%3A0xd157f1e89620dc5!2sMahi%20Fashion%20Jewellery!5e0!3m2!1sen!2sin!4v1771313315634!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 bg-emerald-950 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="font-serif text-3xl text-center mb-12">Why Kanyakumari Trusts Us</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-accent mb-2">25+</div>
                            <p className="text-emerald-100">Years of Excellence</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-accent mb-2">10,000+</div>
                            <p className="text-emerald-100">Happy Customers</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-accent mb-2">100%</div>
                            <p className="text-emerald-100">BIS Hallmarked</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 bg-gradient-to-b from-white to-emerald-50/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-serif text-3xl text-emerald-950 mb-4">Experience the Mahi Difference</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Visit our showroom in Ettani to explore our exquisite collection.
                        Our expert consultants are ready to help you find the perfect piece for every occasion.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                        <Link href="/shop">
                            <Button size="lg" className="w-full sm:w-auto min-w-[200px]">
                                Browse Collection
                            </Button>
                        </Link>
                        <a href="tel:+917305123617">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto min-w-[200px]">
                                <Phone className="mr-2 h-4 w-4" />
                                Call Us Now
                            </Button>
                        </a>
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Mail className="h-4 w-4" />
                        <a href="mailto:info@mahifashionjewellery.com" className="hover:text-emerald-700 transition-colors">
                            info@mahifashionjewellery.com
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
