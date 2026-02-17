import { create } from 'zustand'
import { createClient } from '@/lib/supabase'
import { MetalRate } from '@/types'

interface MetalRatesState {
    rates: MetalRate[]
    isLoading: boolean
    error: string | null
    fetchRates: () => Promise<void>
    getRate: (metalType: string, purity: string) => number
}

// Global fallback rates if DB fetch fails or is empty initially
const FALLBACK_RATES: { [key: string]: number } = {
    'gold-24K': 7250,
    'gold-22K': 6850,
    'gold-18K': 5600,
    'silver-92.5': 88,
    'silver-pure': 90,
}

export const useMetalRatesStore = create<MetalRatesState>((set, get) => ({
    rates: [],
    isLoading: false,
    error: null,

    fetchRates: async () => {
        set({ isLoading: true, error: null })
        try {
            const supabase = createClient()
            const { data, error } = await supabase.from('metal_rates').select('*')

            if (error) throw error

            if (data) {
                set({ rates: data, isLoading: false })
            }
        } catch (err: any) {
            console.error('Failed to fetch metal rates:', err)
            set({ error: err.message, isLoading: false })
        }
    },

    getRate: (metalType: string, purity: string) => {
        const { rates } = get()

        // Find the specific rate for the metal type and purity
        const exactRate = rates.find(
            r => r.metal_type.toLowerCase() === metalType.toLowerCase() &&
                r.purity === purity
        )

        if (exactRate) {
            return exactRate.rate_per_gram
        }

        // Fallback or calculation if exact match not found (legacy support)
        // Try to find a base rate (e.g. 24K for Gold) to calculate from if needed, 
        // but preferably we should have all rates in DB.

        // Return 0 or fallback if not found
        const key = `${metalType.toLowerCase()}-${purity}`
        return FALLBACK_RATES[key] || 0
    }
}))
