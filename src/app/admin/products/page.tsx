'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Product } from '@/types'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase'

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setProducts(data || [])
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const supabase = createClient()

                // Delete product images first
                await supabase
                    .from('product_images')
                    .delete()
                    .eq('product_id', id)

                // Delete product
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', id)

                if (error) throw error

                // Refresh list
                setProducts(products.filter(p => p.id !== id))
            } catch (error: any) {
                console.error('Error deleting product:', error)
                alert('Failed to delete product: ' + error.message)
            }
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" /> Add Product
                    </Button>
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                    <p className="text-gray-500 mb-4">No products yet</p>
                    <Link href="/admin/products/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" /> Add Your First Product
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metal & Purity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                            {product.metal_type} ({product.purity})
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.weight}g
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.stock}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`/admin/products/${product.id}`} className="text-emerald-600 hover:text-emerald-900 mr-4">
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
