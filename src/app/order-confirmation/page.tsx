'use client'

import { Suspense } from 'react'
import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'

function OrderConfirmationContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const clearCart = useCartStore((state) => state.clearCart)
    const success = searchParams.get('success')

    useEffect(() => {
        if (success === 'true') {
            // Ensure cart is cleared (backup measure)
            clearCart()
        }
    }, [success, clearCart])

    if (success !== 'true') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-serif text-emerald-950 mb-4">Invalid Access</h1>
                <p className="text-gray-600 mb-8">This page is only for confirmed orders.</p>
                <Link href="/">
                    <Button>Return Home</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-emerald-50/10 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-emerald-100">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-emerald-600" />
                    </div>

                    <h1 className="font-serif text-4xl text-emerald-950 mb-4">Order Confirmed!</h1>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        Thank you for your purchase. We have received your order and will begin processing it right away.
                    </p>

                    <div className="bg-emerald-50 rounded-lg p-6 mb-8 text-left">
                        <h3 className="font-medium text-emerald-900 mb-2">What happens next?</h3>
                        <ul className="space-y-3 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="bg-emerald-200 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                                You will receive an order confirmation email shortly.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="bg-emerald-200 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                                Our team will verify the payment (COD) and pack your jewellery with care.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="bg-emerald-200 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                                You will be notified once your order is shipped.
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/shop">
                            <Button variant="outline" className="w-full sm:w-auto">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Continue Shopping
                            </Button>
                        </Link>
                        <Link href="/orders">
                            <Button className="w-full sm:w-auto">
                                View My Orders <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <OrderConfirmationContent />
        </Suspense>
    )
}
