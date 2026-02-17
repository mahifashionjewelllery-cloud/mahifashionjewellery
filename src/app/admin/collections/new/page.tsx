'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { CollectionForm, CollectionFormData } from '@/components/admin/CollectionForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewCollectionPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

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
        if (!image) {
            alert('Please select an image for the collection.')
            return
        }

        setLoading(true)
        try {
            // 1. Upload Image
            const imageUrl = await uploadImage(image)

            // 2. Create Collection
            const supabase = createClient()
            const { error } = await supabase
                .from('collections')
                .insert({
                    name: formData.name,
                    link: formData.link,
                    display_order: formData.display_order,
                    is_active: formData.is_active,
                    image_url: imageUrl
                })

            if (error) throw error

            router.push('/admin/collections')
        } catch (error: any) {
            console.error('Error creating collection:', error)
            alert('Failed to create collection: ' + error.message)
        } finally {
            setLoading(false)
        }
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
                <h1 className="text-2xl font-semibold text-gray-900">Add New Collection</h1>
            </div>

            <CollectionForm
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    )
}
