'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Upload, X, Loader2, Save } from 'lucide-react'
import Image from 'next/image'

export interface CollectionFormData {
    name: string
    link: string
    display_order: number
    is_active: boolean
}

interface Collection {
    id: string
    name: string
    image_url: string
    link: string
    display_order: number
    is_active: boolean
}

interface CollectionFormProps {
    initialData?: Collection
    onSubmit: (data: CollectionFormData, image: File | null) => Promise<void>
    loading: boolean
}

export function CollectionForm({ initialData, onSubmit, loading }: CollectionFormProps) {
    const [formData, setFormData] = useState<CollectionFormData>({
        name: initialData?.name || '',
        link: initialData?.link || '',
        display_order: initialData?.display_order || 0,
        is_active: initialData?.is_active ?? true,
    })
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSubmit(formData, imageFile)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Input
                            label="Collection Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Wedding Collection"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Input
                            label="Link URL"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            placeholder="e.g. /shop?metal=gold"
                            required
                        />
                        <p className="text-xs text-gray-500">Internal link starting with / or full URL.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Display Order</label>
                            <Input
                                type="number"
                                value={formData.display_order}
                                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2 flex items-center pt-8">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Collection Image</label>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative h-64 flex flex-col items-center justify-center">
                        {imagePreview ? (
                            <>
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    className="object-cover rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview(null)
                                        setImageFile(null)
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-red-50 text-red-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <div className="space-y-2 pointer-events-none">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <Upload className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="text-sm text-gray-500">
                                    <span className="font-semibold text-emerald-600">Click to upload</span> or drag and drop
                                </div>
                                <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 2MB)</p>
                            </div>
                        )}
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleImageChange}
                            accept="image/*"
                            disabled={!!imagePreview}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
                <Button type="submit" disabled={loading} className="min-w-[150px]">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Collection
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
