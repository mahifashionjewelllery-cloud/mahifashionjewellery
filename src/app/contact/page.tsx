'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="bg-emerald-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">Contact Us</h1>
                    <p className="text-emerald-100 max-w-2xl mx-auto text-lg">
                        We'd love to hear from you. Visit our showroom or get in touch with our team.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="font-serif text-2xl text-emerald-950 mb-6">Get in Touch</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-emerald-50 p-3 rounded-full">
                                        <MapPin className="h-6 w-6 text-emerald-800" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-1">Our Showroom</h3>
                                        <p className="text-gray-600">Mahi Fashion Jewellery, Bazaar Street,<br />Ettani, Kanyakumari District,<br />Tamil Nadu - 629177</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-emerald-50 p-3 rounded-full">
                                        <Phone className="h-6 w-6 text-emerald-800" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
                                        <p className="text-gray-600">+91 73051 23617</p>
                                        <p className="text-gray-600 text-sm">Mon-Sat, 10am - 8pm</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-emerald-50 p-3 rounded-full">
                                        <Mail className="h-6 w-6 text-emerald-800" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                                        <p className="text-gray-600">mahifashionjewelllery@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="h-64 bg-gray-100 rounded-lg overflow-hidden relative shadow-md">
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

                    {/* Contact Form */}
                    <div className="bg-emerald-50/50 p-8 rounded-lg border border-emerald-900/5">
                        <h2 className="font-serif text-2xl text-emerald-950 mb-6">Send us a Message</h2>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    )
}

function ContactForm() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            first_name: formData.get('first_name') as string,
            last_name: formData.get('last_name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            message: formData.get('message') as string,
        }

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('contact_messages')
                .insert(data)

            if (error) throw error

            setSuccess(true)
        } catch (error: any) {
            console.error('Error submitting form:', error)
            alert('Failed to send message: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center py-12">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-medium text-emerald-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-6">Thank you for contacting us. We'll get back to you shortly.</p>
                <Button onClick={() => setSuccess(false)} variant="outline">Send Another Message</Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <Input name="first_name" placeholder="John" required />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <Input name="last_name" placeholder="Doe" required />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <Input name="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone (Optional)</label>
                <Input name="phone" type="tel" placeholder="+91" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <textarea
                    name="message"
                    required
                    className="w-full min-h-[150px] p-3 rounded-md border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="How can we help you?"
                ></textarea>
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                {loading ? 'Sending...' : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
            </Button>
        </form>
    )
}

