'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Loader2, X, Upload } from 'lucide-react'
import { Product } from '@/types'

export interface ProductFormData {
    name: string
    description: string
    metal_type: 'gold' | 'silver' | 'diamond' // Adjusted to match select options
    purity: string
    weight: string // form uses string for input
    making_charge_type: 'percentage' | 'fixed'
    making_charge_value: string
    stock: string
    is_featured: boolean
}

interface ProductFormProps {
    initialData?: Product
    onSubmit: (data: ProductFormData, newImages: File[]) => Promise<void>
    loading: boolean
    onDeleteImage?: (imageUrl: string) => Promise<void>
}

export function ProductForm({ initialData, onSubmit, loading, onDeleteImage }: ProductFormProps) {
    const [images, setImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [existingImages, setExistingImages] = useState<string[]>([])

    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        metal_type: 'gold',
        purity: '22K',
        weight: '',
        making_charge_type: 'percentage',
        making_charge_value: '',
        stock: '',
        is_featured: false
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description || '',
                // @ts-ignore
                metal_type: initialData.metal_type,
                purity: initialData.purity,
                weight: initialData.weight.toString(),
                making_charge_type: initialData.making_charge_type,
                making_charge_value: initialData.making_charge_value.toString(),
                stock: initialData.stock.toString(),
                is_featured: initialData.is_featured
            })
            if (initialData.images) {
                setExistingImages(initialData.images)
            }
        }
    }, [initialData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
        // @ts-ignore
        setFormData({ ...formData, [e.target.name]: value })
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            setImages((prev) => [...prev, ...filesArray])

            const newPreviews = filesArray.map((file) => URL.createObjectURL(file))
            setImagePreviews((prev) => [...prev, ...newPreviews])
        }
    }

    const removeNewImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    }

    const handleRemoveExistingImage = async (imageUrl: string) => {
        if (confirm('Are you sure you want to remove this image?')) {
            if (onDeleteImage) {
                await onDeleteImage(imageUrl)
                setExistingImages(prev => prev.filter(img => img !== imageUrl))
            }
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData, images)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg p-6 space-y-6">
            {/* Image Upload Section */}
            <div>
                <label className="block text-sm font-medium text-emerald-900 mb-2">Product Images</label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {/* Existing Images */}
                    {existingImages.map((url, index) => (
                        <div key={`existing-${index}`} className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden border border-gray-200 group">
                            <img src={url} alt={`Product ${index}`} className="w-full h-full object-cover" />
                            {onDeleteImage && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveExistingImage(url)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    ))}

                    {/* New Image Previews */}
                    {imagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden border border-gray-200 group">
                            <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}

                    {/* Upload Button */}
                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-sm cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="text-xs text-gray-500 text-center"><span className="font-semibold">Click to upload</span><br />(Multiple allowed)</p>
                        </div>
                        <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                    </label>
                </div>
            </div>

            <Input
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />

            <div>
                <label className="block text-sm font-medium text-emerald-900">Description</label>
                <textarea
                    name="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-emerald-900/20 rounded-sm focus:outline-none focus:ring-1 focus:ring-accent text-gray-900 placeholder:text-gray-400"
                    placeholder="Product description"
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-emerald-900 mb-1">Metal Type</label>
                    <select
                        name="metal_type"
                        className="flex w-full rounded-sm border border-emerald-900/20 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-accent mb-2"
                        value={formData.metal_type}
                        onChange={handleChange}
                    >
                        <option value="gold">Gold</option>
                        <option value="silver">Silver</option>
                        <option value="diamond">Diamond</option>
                    </select>
                </div>
                <Input
                    label="Purity (e.g. 22K, 92.5)"
                    name="purity"
                    value={formData.purity}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <Input
                    label="Weight (grams)"
                    name="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Stock Quantity"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-sm border border-gray-100">
                <div>
                    <label className="block text-sm font-medium text-emerald-900 mb-1">Making Charge Type</label>
                    <select
                        name="making_charge_type"
                        className="flex w-full rounded-sm border border-emerald-900/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent mb-2"
                        value={formData.making_charge_type}
                        onChange={handleChange}
                    >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                </div>
                <Input
                    label="Making Charge Value"
                    name="making_charge_value"
                    type="number"
                    step="0.01"
                    value={formData.making_charge_value}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="flex items-center">
                <input
                    id="is_featured"
                    name="is_featured"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    checked={formData.is_featured}
                    // @ts-ignore
                    onChange={handleChange}
                />
                <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                    Feature this product on homepage
                </label>
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => window.history.back()}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : (initialData ? 'Update Product' : 'Create Product')}
                </Button>
            </div>
        </form>
    )
}
