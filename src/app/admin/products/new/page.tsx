'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ProductForm, ProductFormData } from '@/components/admin/ProductForm'
import { useToast } from '@/context/ToastContext'

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { showToast } = useToast()

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

            // 1. Create the product first
            const { data: product, error: productError } = await supabase
                .from('products')
                .insert({
                    ...formData,
                    weight: Number(formData.weight),
                    making_charge_value: Number(formData.making_charge_value),
                    stock: Number(formData.stock),
                })
                .select()
                .single()

            if (productError) throw productError

            // 2. Upload images and insert into product_images table
            if (images.length > 0) {
                const uploadedImageUrls = await uploadImages(images)

                // Insert each image URL into product_images table
                const imageRecords = uploadedImageUrls.map(url => ({
                    product_id: product.id,
                    image_url: url
                }))

                const { error: imagesError } = await supabase
                    .from('product_images')
                    .insert(imageRecords)

                if (imagesError) {
                    console.error('Error inserting images:', imagesError)
                    // Product is created, but images failed - still redirect
                }
            }

            showToast('Product created successfully', 'success')
            router.push('/admin/products')
            router.refresh()
        } catch (error: any) {
            console.error('Error creating product:', error)
            showToast('Failed to create product: ' + error.message, 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Add New Product</h1>
            <ProductForm onSubmit={handleSubmit} loading={loading} />
        </div>
    )
}
