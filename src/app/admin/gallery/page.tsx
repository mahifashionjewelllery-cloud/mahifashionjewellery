'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Loader2, Upload, Trash2, AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/context/ToastContext'
import { Modal } from '@/components/ui/Modal'

export default function GalleryManagementPage() {
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; index: number | null }>({
        isOpen: false,
        index: null
    })
    const { showToast } = useToast()

    useEffect(() => {
        loadGalleryImages()
    }, [])

    const loadGalleryImages = async () => {
        try {
            const response = await fetch('/api/gallery')
            const data = await response.json()
            setImages(data.images || [])
        } catch (error) {
            console.error('Error loading gallery:', error)
            showToast('Failed to load gallery images', 'error')
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        setUploading(true)
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)

        try {
            // Upload via API to bypass RLS issues
            const uploadResponse = await fetch('/api/gallery/upload', {
                method: 'POST',
                body: formData
            })

            const uploadResult = await uploadResponse.json()

            if (!uploadResponse.ok) {
                throw new Error(uploadResult.error || 'Upload failed')
            }

            const newImages = [...images, uploadResult.url]

            // Save list to database
            await saveGalleryImages(newImages)
            setImages(newImages)
            showToast('Image uploaded successfully', 'success')
        } catch (error: any) {
            console.error('Error uploading image:', error)
            showToast('Failed to upload image: ' + error.message, 'error')
        } finally {
            setUploading(false)
        }
    }

    const requestDelete = (index: number) => {
        setDeleteConfirmation({ isOpen: true, index })
    }

    const confirmDelete = async () => {
        const index = deleteConfirmation.index
        if (index === null) return

        const imageToDelete = images[index]
        const newImages = images.filter((_, i) => i !== index)

        try {
            setDeleteConfirmation({ isOpen: false, index: null })

            // 1. Delete file from storage
            const deleteResponse = await fetch('/api/gallery/upload', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: imageToDelete })
            })

            if (!deleteResponse.ok) {
                console.warn('Failed to delete file from storage, but proceeding to remove from list')
            }

            // 2. Update list in database
            await saveGalleryImages(newImages)
            setImages(newImages)
            showToast('Image removed successfully', 'success')
        } catch (error) {
            console.error('Error removing image:', error)
            showToast('Failed to remove image', 'error')
        }
    }

    const saveGalleryImages = async (imageUrls: string[]) => {
        try {
            const response = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: imageUrls })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save')
            }
        } catch (error: any) {
            console.error('Error saving gallery images:', error)
            showToast('Failed to save gallery images: ' + error.message, 'error')
            throw error
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Homepage Gallery</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage the Instagram/Gallery section images on the homepage</p>
                </div>
                <div>
                    <input
                        id="gallery-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading || images.length >= 8}
                    />
                    <Button
                        onClick={() => document.getElementById('gallery-upload')?.click()}
                        disabled={uploading || images.length >= 8}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Add Image
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {images.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No gallery images yet</p>
                    <Button onClick={() => document.getElementById('gallery-upload')?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload First Image
                    </Button>
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((imageUrl, index) => (
                            <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                                <Image
                                    src={imageUrl}
                                    alt={`Gallery ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    onClick={() => requestDelete(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                                    title="Delete Image"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                    Image {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        {images.length} / 8 images • Recommended: 4-8 images for best display
                    </p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation.isOpen && deleteConfirmation.index !== null && (
                <Modal
                    isOpen={deleteConfirmation.isOpen}
                    onClose={() => setDeleteConfirmation({ isOpen: false, index: null })}
                    title="Remove Image?"
                >
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>

                        <div className="space-y-2">
                            <p className="text-gray-600">
                                Are you sure you want to remove this image from the gallery?
                                This action cannot be undone.
                            </p>
                        </div>

                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 mt-4">
                            <Image
                                src={images[deleteConfirmation.index]}
                                alt="Image to delete"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex gap-3 w-full pt-4">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setDeleteConfirmation({ isOpen: false, index: null })}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={confirmDelete}
                            >
                                Delete Image
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}
