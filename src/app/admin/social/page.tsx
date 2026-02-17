'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Trash2, Plus, GripVertical, Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SocialLink {
    id: string
    platform: string
    url: string
    icon: string
    is_active: boolean
    created_at: string
}

const AVAILABLE_ICONS = [
    { name: 'facebook', icon: Facebook },
    { name: 'instagram', icon: Instagram },
    { name: 'twitter', icon: Twitter },
    { name: 'linkedin', icon: Linkedin },
    { name: 'youtube', icon: Youtube },
    { name: 'mail', icon: Mail },
    { name: 'globe', icon: Globe },
]

export default function SocialMediaPage() {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const router = useRouter()

    const [newLink, setNewLink] = useState({
        platform: '',
        url: '',
        icon: 'globe'
    })

    useEffect(() => {
        fetchSocialLinks()
    }, [])

    const fetchSocialLinks = async () => {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('social_links')
            .select('*')
            .order('created_at', { ascending: true })

        if (error) {
            console.error('Error fetching social links:', error)
        } else {
            setSocialLinks(data || [])
        }
        setLoading(false)
    }

    const handleAddLink = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = createClient()

        const { error } = await supabase
            .from('social_links')
            .insert([newLink])

        if (error) {
            console.error('Error adding link:', error)
            alert('Failed to add link')
        } else {
            setNewLink({ platform: '', url: '', icon: 'globe' })
            setIsAdding(false)
            fetchSocialLinks()
        }
    }

    const handleDeleteLink = async (id: string) => {
        if (!confirm('Are you sure you want to delete this link?')) return

        const supabase = createClient()
        const { error } = await supabase
            .from('social_links')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting link:', error)
            alert('Failed to delete link')
        } else {
            fetchSocialLinks()
        }
    }

    const renderIcon = (iconName: string) => {
        const iconObj = AVAILABLE_ICONS.find(i => i.name === iconName)
        const Icon = iconObj ? iconObj.icon : Globe
        return <Icon className="h-5 w-5" />
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-emerald-950">Social Media Links</h1>
                    <p className="text-gray-600 mt-2">Manage your social media presence in the footer.</p>
                </div>
                <Button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add New Link
                </Button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-8 animate-fade-in-up">
                    <h3 className="font-serif text-xl mb-4 text-emerald-900">Add New Link</h3>
                    <form onSubmit={handleAddLink} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                                <Input
                                    value={newLink.platform}
                                    onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                                    placeholder="e.g. Facebook"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                                <Input
                                    value={newLink.url}
                                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                    placeholder="https://facebook.com/yourpage"
                                    required
                                    type="url"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                            <div className="flex flex-wrap gap-3">
                                {AVAILABLE_ICONS.map((item) => (
                                    <button
                                        key={item.name}
                                        type="button"
                                        onClick={() => setNewLink({ ...newLink, icon: item.name })}
                                        className={`p-3 rounded-md border flex items-center justify-center transition-all ${newLink.icon === item.name
                                                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                                                : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600'
                                            }`}
                                    >
                                        <item.icon className="h-6 w-6" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                            <Button type="submit">Save Link</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {socialLinks.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Globe className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p>No social media links found.</p>
                        <button onClick={() => setIsAdding(true)} className="text-emerald-600 hover:text-emerald-700 font-medium mt-2">
                            Add your first link
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {socialLinks.map((link) => (
                            <div key={link.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-emerald-50 p-2 rounded-full text-emerald-700">
                                        {renderIcon(link.icon)}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{link.platform}</h4>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-emerald-600 truncate max-w-[200px] block">
                                            {link.url}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDeleteLink(link.id)}
                                        className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
