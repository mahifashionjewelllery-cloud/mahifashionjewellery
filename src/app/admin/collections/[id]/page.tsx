'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { CollectionForm, CollectionFormData } from '@/components/admin/CollectionForm'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/context/ToastContext'

interface Collection extends CollectionFormData {
    id: string
    image_url: string
}

export default function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [initialData, setInitialData] = useState<Collection | undefined>(undefined)
    const { showToast } = useToast()

    useEffect(() => {
        fetchCollection()
    }, [id])

    const fetchCollection = async () => {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('collections')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            setInitialData(data)
        } catch (error) {
            console.error('Error fetching collection:', error)
            showToast('Failed to load collection', 'error')
            router.push('/admin/collections')
        } finally {
            setFetching(false)
        }
    }

    const uploadImage = async (image: File): Promise<string> => {
        const formData = new FormData()
        formData.append('file', image)

        const response = await fetch('/api/collections/upload', {
            method: 'POST',
            body: formData
        })

        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Upload failed')

        return result.url
    }

    const handleSubmit = async (formData: CollectionFormData, image: File | null) => {
        setLoading(true)
        try {
            let imageUrl = initialData?.image_url

            // 1. Upload new image if provided
            if (image) {
                imageUrl = await uploadImage(image)
            }

            // 2. Update Collection
            const supabase = createClient()
            const { error } = await supabase
                .from('collections')
                .update({
                    name: formData.name,
                    link: formData.link,
                    display_order: formData.display_order,
                    is_active: formData.is_active,
                    image_url: imageUrl
                })
                .eq('id', id)

            if (error) throw error

            showToast('Collection updated successfully', 'success')
            router.push('/admin/collections')
        } catch (error: any) {
            console.error('Error updating collection:', error)
            showToast('Failed to update collection: ' + error.message, 'error')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/admin/collections"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Collections
                </Link>
                <h1 className="text-2xl font-semibold text-gray-900">Edit Collection</h1>
            </div>

            <CollectionForm
                initialData={initialData}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    )
}
