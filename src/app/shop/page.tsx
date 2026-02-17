'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Product } from '@/types'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase'



function ShopContent() {
    const searchParams = useSearchParams()
    const initialMetal = searchParams.get('metal') || 'all'
    const searchQuery = searchParams.get('search') || ''

    const [filter, setFilter] = useState(initialMetal)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [filter, searchQuery])

    const fetchProducts = async () => {
        try {
            const supabase = createClient()
            let query = supabase
                .from('products')
                .select(`
                    *,
                    product_images(image_url)
                `)

            if (filter !== 'all') {
                query = query.eq('metal_type', filter)
            }

            if (searchQuery) {
                query = query.ilike('name', `%${searchQuery}%`)
            }

            const { data, error } = await query

            if (error) throw error

            // Transform data to include images array
            const productsWithImages = data?.map(product => ({
                ...product,
                images: product.product_images?.map((img: any) => img.image_url) || []
            })) || []

            setProducts(productsWithImages)
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredProducts = products.filter(p => {
        const matchesType = filter === 'all' || p.metal_type === filter || (filter === 'diamond' && p.metal_type === 'gold' && p.description?.toLowerCase().includes('diamond'))
        const matchesSearch = searchQuery
            ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase())
            : true

        return matchesType && matchesSearch
    })

    return (
        <div className="bg-background min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-serif text-4xl text-foreground mb-8 text-center">Our Collection</h1>

                {/* Basic Filters */}
                <div className="flex justify-center gap-4 mb-12 flex-wrap">
                    {['all', 'gold', 'silver', 'diamond'].map((type) => (
                        <Button
                            key={type}
                            variant={filter === type ? 'primary' : 'outline'}
                            onClick={() => setFilter(type)}
                            className="capitalize min-w-[100px]"
                        >
                            {type}
                        </Button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center text-gray-500 py-20">
                        No products found in this category.
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="bg-background min-h-screen py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-serif text-4xl text-foreground mb-8 text-center">Our Collection</h1>
                    <div className="text-center text-gray-500 py-20">Loading...</div>
                </div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    )
}
