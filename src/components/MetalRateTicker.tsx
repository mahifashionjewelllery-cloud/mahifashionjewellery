'use client'

import { useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import { useMetalRatesStore } from '@/store/metalRatesStore'

export function MetalRateTicker() {
    const { rates, fetchRates, getRate } = useMetalRatesStore()

    useEffect(() => {
        fetchRates()
    }, [fetchRates])

    // Get rates for display, defaulting to store logic (which handles fallbacks)
    const gold24k = getRate('gold', '24K')
    const gold22k = getRate('gold', '22K')
    const silver = getRate('silver', '92.5') // Assuming 92.5 is the standard display rate for silver

    return (
        <div className="bg-emerald-950 text-emerald-100 text-xs py-2 overflow-hidden border-b border-emerald-900 relative z-50">
            <div className="max-w-7xl mx-auto px-4 flex items-center">
                <span className="font-bold text-accent mr-4 flex items-center uppercase tracking-wider whitespace-nowrap">
                    <TrendingUp className="h-3 w-3 mr-1" /> Today's Rates
                </span>

                <div className="flex-1 overflow-hidden relative">
                    <div className="animate-marquee whitespace-nowrap flex space-x-8">
                        <span>Gold 24K: <span className="text-white font-medium">₹{gold24k}/g</span></span>
                        <span>Gold 22K: <span className="text-white font-medium">₹{gold22k}/g</span></span>
                        <span>Silver (92.5): <span className="text-white font-medium">₹{silver}/g</span></span>

                        <span className="text-emerald-900">|</span>

                        <span>Gold 24K: <span className="text-white font-medium">₹{gold24k}/g</span></span>
                        <span>Gold 22K: <span className="text-white font-medium">₹{gold22k}/g</span></span>
                        <span>Silver (92.5): <span className="text-white font-medium">₹{silver}/g</span></span>
                    </div>
                </div>
            </div>
        </div>
    )
}
