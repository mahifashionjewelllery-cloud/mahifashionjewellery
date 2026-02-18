'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Search, Mail, Phone, Calendar, MessageSquare, Clock } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { format } from 'date-fns'

interface Message {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string
    message: string
    created_at: string
    status: 'new' | 'read' | 'replied'
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            const response = await fetch('/api/admin/messages')
            const data = await response.json()
            if (data.messages) {
                setMessages(data.messages)
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredMessages = messages.filter(m =>
        m.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.message.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
                    <p className="text-sm text-gray-500 mt-1">View inquiries from the contact form.</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search messages..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Messages List */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredMessages.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No messages found.
                                    </td>
                                </tr>
                            ) : filteredMessages.map((msg) => (
                                <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top w-40">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3 text-gray-400" />
                                            {format(new Date(msg.created_at), 'MMM d, yyyy')}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                            <Clock className="h-3 w-3" />
                                            {format(new Date(msg.created_at), 'h:mm a')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 align-top w-48">
                                        {msg.first_name} {msg.last_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top w-64">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3 text-gray-400" />
                                            <a href={`mailto:${msg.email}`} className="hover:text-emerald-600 transition-colors">{msg.email}</a>
                                        </div>
                                        {msg.phone && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <Phone className="h-3 w-3 text-gray-400" />
                                                <a href={`tel:${msg.phone}`} className="hover:text-emerald-600 transition-colors">{msg.phone}</a>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 align-top">
                                        <div className="max-w-lg whitespace-pre-wrap">{msg.message}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm align-top w-32">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${msg.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                                msg.status === 'read' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-green-100 text-green-800'}`}>
                                            {msg.status || 'new'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
