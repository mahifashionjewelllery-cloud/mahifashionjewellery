'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ProductForm, ProductFormData } from '@/components/admin/ProductForm'
import { Product } from '@/types'

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [loading, setLoading] = useState(false)
    const [initialData, setInitialData] = useState<Product | undefined>(undefined)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        fetchProduct()
    }, [id])

    const fetchProduct = async () => {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    product_images(image_url)
                `)
                .eq('id', id)
                .single()

            if (error) throw error

            const productWithImages = {
                ...data,
                images: data.product_images?.map((img: any) => img.image_url) || []
            }

            setInitialData(productWithImages)
        } catch (error) {
            console.error('Error fetching product:', error)
            alert('Failed to fetch product')
            router.push('/admin/products')
        } finally {
            setFetching(false)
        }
    }

    const uploadImages = async (images: File[]) => {
        const supabase = createClient()
        const imageUrls: string[] = []

        for (const file of images) {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file)

            if (uploadError) {
                console.error('Error uploading image:', uploadError)
                continue
            }

            const { data } = supabase.storage.from('products').getPublicUrl(filePath)
            imageUrls.push(data.publicUrl)
        }
        return imageUrls
    }

    const handleSubmit = async (formData: ProductFormData, images: File[]) => {
        setLoading(true)

        try {
            const supabase = createClient()

            // 1. Update product details
            const { error: productError } = await supabase
                .from('products')
                .update({
                    ...formData,
                    weight: Number(formData.weight),
                    making_charge_value: Number(formData.making_charge_value),
                    stock: Number(formData.stock),
                })
                .eq('id', id)

            if (productError) throw productError

            // 2. Upload and insert NEW images
            if (images.length > 0) {
                const uploadedImageUrls = await uploadImages(images)

                const imageRecords = uploadedImageUrls.map(url => ({
                    product_id: id,
                    image_url: url
                }))

                const { error: imagesError } = await supabase
                    .from('product_images')
                    .insert(imageRecords)

                if (imagesError) {
                    console.error('Error inserting new images:', imagesError)
                }
            }

            router.push('/admin/products')
            router.refresh()
        } catch (error: any) {
            console.error('Error updating product:', error)
            alert('Failed to update product: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteImage = async (imageUrl: string) => {
        try {
            const supabase = createClient()

            // Delete from database
            const { error: dbError } = await supabase
                .from('product_images')
                .delete()
                .match({ product_id: id, image_url: imageUrl })

            if (dbError) throw dbError

            // Optionally delete from storage (requires parsing filename from URL)
            // For now, we just remove the reference from DB which hides it.
            // Garbage collection of storage can be a separate task.

        } catch (error) {
            console.error('Error deleting image:', error)
            throw error // Propagate to component to handle state update or alert
        }
    }

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900"></div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Edit Product</h1>
            <ProductForm
                initialData={initialData}
                onSubmit={handleSubmit}
                loading={loading}
                onDeleteImage={handleDeleteImage}
            />
        </div>
    )
}
