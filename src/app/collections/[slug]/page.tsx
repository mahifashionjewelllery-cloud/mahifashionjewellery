'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/types'

// Mock Data (In real app, fetch from DB filtered by collection tag/category)
const mockCollectionProducts: Record<string, Product[]> = {
    'wedding': [
        {
            id: '1',
            name: 'Royal Gold Necklace',
            description: '22K Gold necklace suitable for weddings',
            metal_type: 'gold',
            purity: '22K',
            weight: 45,
            making_charge_type: 'percentage',
            making_charge_value: 15,
            stock: 3,
            is_featured: true,
            images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop'],
            created_at: new Date().toISOString(),
        },
        {
            id: '5',
            name: 'Bridal Choker Set',
            description: 'Heavy gold choker set with earrings',
            metal_type: 'gold',
            purity: '22K',
            weight: 60,
            making_charge_type: 'percentage',
            making_charge_value: 18,
            stock: 2,
            is_featured: true,
            images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2069&auto=format&fit=crop'],
            created_at: new Date().toISOString(),
        }
    ],
    'temple': [
        {
            id: '4',
            name: 'Temple Jewellery Set',
            description: 'Handcrafted temple design set',
            metal_type: 'gold',
            purity: '22K',
            weight: 35,
            making_charge_type: 'percentage',
            making_charge_value: 14,
            stock: 4,
            is_featured: true,
            images: ['https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=1935&auto=format&fit=crop'],
            created_at: new Date().toISOString(),
        }
    ]
}

export default function CollectionDetailPage() {
    const params = useParams()
    const slug = params.slug as string

    const products = mockCollectionProducts[slug] || []
    const collectionName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

    return (
        <div className="bg-background min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-12">
                    <Link href="/collections" className="text-sm text-gray-500 hover:text-emerald-900 mb-4 inline-block">
                        &larr; Back to Collections
                    </Link>
                    <h1 className="font-serif text-4xl text-emerald-950 mb-4">{collectionName} Collection</h1>
                    <p className="text-gray-600">Discover our exclusive {collectionName.toLowerCase()} pieces.</p>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-gray-50 rounded-sm">
                        <p className="text-gray-500 mb-6">Create new memories with our upcoming {collectionName} designs.</p>
                        <Link href="/shop" className="text-emerald-900 font-medium underline">
                            Browse all products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
