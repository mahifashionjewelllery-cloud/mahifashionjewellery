'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Trash2, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'

interface Collection {
    id: string
    name: string
    image_url: string
    link: string
    display_order: number
    is_active: boolean
}

export default function AdminCollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchCollections()
    }, [])

    const fetchCollections = async () => {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('collections')
                .select('*')
                .order('display_order', { ascending: true })

            if (error) throw error
            setCollections(data || [])
        } catch (error) {
            console.error('Error fetching collections:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this collection?')) {
            try {
                const supabase = createClient()
                const { error } = await supabase
                    .from('collections')
                    .delete()
                    .eq('id', id)

                if (error) throw error
                setCollections(collections.filter(c => c.id !== id))
            } catch (error: any) {
                console.error('Error deleting collection:', error)
                alert('Failed to delete collection')
            }
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Collections</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage homepage categories</p>
                </div>
                <Link href="/admin/collections/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Collection
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {collections.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No collections found. Add one to get started.
                                    </td>
                                </tr>
                            ) : (
                                collections.map((collection) => (
                                    <tr key={collection.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {collection.display_order}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-12 w-12 rounded bg-gray-100 relative overflow-hidden">
                                                <Image
                                                    src={collection.image_url}
                                                    alt={collection.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 mb-1">{collection.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <LinkIcon className="w-3 h-3" />
                                                {collection.link}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${collection.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {collection.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`/admin/collections/${collection.id}`} className="text-emerald-600 hover:text-emerald-900 mr-4">
                                                <Edit className="h-4 w-4 inline" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(collection.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-4 w-4 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
