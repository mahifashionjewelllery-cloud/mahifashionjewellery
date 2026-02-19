'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Product } from '@/types'
import { calculateProductPrice, formatCurrency, cn } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { Button } from './ui/Button'
import { useState } from 'react'

import { useMetalRatesStore } from '@/store/metalRatesStore'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useToast } from '@/context/ToastContext'

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const router = useRouter()
    const { showToast } = useToast()
    const addToCart = useCartStore((state) => state.addItem)
    const { getRate } = useMetalRatesStore()
    const [isAdding, setIsAdding] = useState(false)

    // Dynamic rate based on product properties
    const currentRate = getRate(product.metal_type, product.purity)

    const priceDetails = calculateProductPrice(product, currentRate)

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            showToast('Please login to add items to cart', 'error')
            router.push('/login')
            return
        }

        setIsAdding(true)
        addToCart(product, priceDetails.total)

        // Simulate feedback
        setTimeout(() => setIsAdding(false), 500)
    }

    return (
        <div className="group relative bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-emerald-950/5">
            <Link href={`/product/${product.id}`}>
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                    {product.images?.[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    {product.is_featured && (
                        <span className="absolute top-2 left-2 bg-accent text-emerald-950 text-xs font-bold px-2 py-1 uppercase tracking-wider">
                            Featured
                        </span>
                    )}
                </div>
            </Link>

            <div className="p-4">
                <div className="mb-2">
                    <span className="text-xs text-emerald-600 font-medium uppercase tracking-wider">{product.metal_type} • {product.purity}</span>
                </div>
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-serif text-lg text-emerald-950 mb-1 leading-tight group-hover:text-emerald-700 transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Approx. Price</span>
                        <span className="font-serif text-lg text-emerald-900 font-bold">
                            {formatCurrency(priceDetails.total)}
                        </span>
                    </div>

                    <Button
                        size="sm"
                        variant="secondary"
                        className={cn("rounded-full h-10 w-10 p-0 flex items-center justify-center transition-all", isAdding ? "bg-green-600" : "")}
                        onClick={handleAddToCart}
                        aria-label="Add to cart"
                    >
                        <ShoppingBag className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
