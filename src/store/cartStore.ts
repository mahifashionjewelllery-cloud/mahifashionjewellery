import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/types'

interface CartState {
    items: CartItem[]
    addItem: (product: Product, currentPrice: number) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    getTotal: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, currentPrice) => {
                set((state) => {
                    const existingItem = state.items.find((item) => item.product.id === product.id)
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id
                                    ? { ...item, quantity: item.quantity + 1, currentPrice } // Update price to latest
                                    : item
                            ),
                        }
                    }
                    return { items: [...state.items, { product, quantity: 1, currentPrice }] }
                })
            },
            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.product.id !== productId),
                }))
            },
            updateQuantity: (productId, quantity) => {
                if (quantity < 1) return;
                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId ? { ...item, quantity } : item
                    ),
                }))
            },
            clearCart: () => set({ items: [] }),
            getTotal: () => {
                const { items } = get()
                return items.reduce((total, item) => total + item.currentPrice * item.quantity, 0)
            },
        }),
        {
            name: 'cart-storage',
        }
    )
)
