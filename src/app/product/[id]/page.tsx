'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { useMetalRatesStore } from '@/store/metalRatesStore'
import { calculateProductPrice, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ShoppingBag, Star, HelpCircle, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/context/ToastContext'

export default function ProductDetailPage() {
    const params = useParams()
    const id = params.id as string

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    const addToCart = useCartStore((state) => state.addItem)
    const { getRate } = useMetalRatesStore()

    useEffect(() => {
        fetchProduct()
    }, [id])

    const fetchProduct = async () => {
        try {
            setLoading(true)
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

            setProduct(productWithImages)
        } catch (err: any) {
            console.error('Error fetching product:', err)
            setError('Product not found')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900"></div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <h2 className="text-2xl font-serif text-emerald-900 mb-4">Product Not Found</h2>
                <Link href="/shop">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collection
                    </Button>
                </Link>
            </div>
        )
    }

    // Rate logic - Dynamic
    const metalRate = getRate(product.metal_type, product.purity)
    const priceDetails = calculateProductPrice(product, metalRate)

    const router = useRouter()
    const { showToast } = useToast()

    const handleAddToCart = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            showToast('Please login to add items to cart', 'error')
            router.push('/login')
            return
        }

        setIsAdding(true)
        addToCart(product, priceDetails.total)
        setTimeout(() => setIsAdding(false), 500)
    }

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/shop" className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-900 mb-8 transition-colors">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back to Collection
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

                    {/* Image Section */}
                    <div className="space-y-4 w-full max-w-md mx-auto md:max-w-none">
                        <div className="aspect-square relative rounded-sm overflow-hidden bg-gray-100 border border-emerald-950/10">
                            {product.images && product.images.length > 0 ? (
                                <Image
                                    src={selectedImage || product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50">
                                    <ShoppingBag className="h-16 w-16 opacity-20" />
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative aspect-square rounded-sm overflow-hidden border transition-all ${(selectedImage === img || (!selectedImage && index === 0))
                                            ? 'border-accent ring-1 ring-accent opacity-100'
                                            : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="text-sm font-bold text-accent uppercase tracking-wider">{product.metal_type}</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-sm text-gray-500">{product.purity} Purity</span>
                            <span className="text-sm text-gray-500">|</span>
                            <span className="text-sm text-gray-500">{product.weight}g Net Weight</span>
                        </div>

                        <h1 className="font-serif text-4xl text-emerald-950 mb-4">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex text-yellow-500">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                            </div>
                            <span className="text-sm text-gray-400">(24 Reviews)</span>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            {product.description}
                        </p>

                        <div className="bg-emerald-50/50 p-6 rounded-sm border border-emerald-900/5 mb-8">
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="text-sm text-emerald-800 font-medium">Current Price</span>
                                <span className="font-serif text-3xl font-bold text-emerald-900">{formatCurrency(priceDetails.total)}</span>
                            </div>
                            <div className="text-xs text-emerald-600/80 space-y-1">
                                <div className="flex justify-between">
                                    <span>Metal Rate ({product.metal_type} {product.purity}):</span>
                                    <span>{formatCurrency(priceDetails.breakdown.metalPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Making Charges:</span>
                                    <span>{formatCurrency(priceDetails.breakdown.makingCharges)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>GST (3%):</span>
                                    <span>{formatCurrency(priceDetails.breakdown.gst)}</span>
                                </div>
                                <div className="pt-2 text-right opacity-60">* Price is calculated based on live metal rates</div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                size="lg"
                                className="flex-1 text-lg h-14"
                                onClick={handleAddToCart}
                            >
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                {isAdding ? 'Added to Cart' : 'Add to Cart'}
                            </Button>
                            <Button variant="outline" size="lg" className="h-14 lg:px-6">
                                <HelpCircle className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
                            <div className="text-center">
                                <div className="font-serif text-emerald-900 mb-1">BIS</div>
                                <div className="text-xs text-gray-500">Hallmarked</div>
                            </div>
                            <div className="text-center">
                                <div className="font-serif text-emerald-900 mb-1">100%</div>
                                <div className="text-xs text-gray-500">Certified</div>
                            </div>
                            <div className="text-center">
                                <div className="font-serif text-emerald-900 mb-1">Free</div>
                                <div className="text-xs text-gray-500">Shipping</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
