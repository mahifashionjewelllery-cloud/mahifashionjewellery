'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input' // Keep import if needed, though we use native input below
import { Loader2, TrendingUp, RefreshCw } from 'lucide-react'
import { MetalRate } from '@/types'
import { useToast } from '@/context/ToastContext'

// Mock initial data matching new schema
export default function MetalRatesPage() {
    const [rates, setRates] = useState<MetalRate[]>([])
    const [loading, setLoading] = useState(false)
    const [updating, setUpdating] = useState<string | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newRateData, setNewRateData] = useState({ metal_type: 'gold', purity: '', rate_per_gram: '' })
    const { showToast } = useToast()

    useEffect(() => {
        fetchRates()
    }, [])

    const fetchRates = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/metal-rates')
            const data = await response.json()
            if (data.rates) {
                setRates(data.rates)
            }
        } catch (error) {
            console.error('Error fetching rates:', error)
            showToast('Failed to fetch rates', 'error')
        } finally {
            setLoading(false)
        }
    }



    const handleUpdate = async (id: string, newRate: number) => {
        setUpdating(id)
        try {
            const response = await fetch('/api/metal-rates', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, rate_per_gram: newRate })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update rate')
            }

            setRates(rates.map(r => r.id === id ? { ...r, rate_per_gram: newRate, updated_at: new Date().toISOString() } : r))
            showToast('Rate updated successfully!', 'success')
        } catch (error: any) {
            console.error('Error updating rate:', error)
            showToast(error.message, 'error')
        } finally {
            setUpdating(null)
        }
    }

    const handleAddRate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch('/api/metal-rates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    metal_type: newRateData.metal_type,
                    purity: newRateData.purity,
                    rate_per_gram: Number(newRateData.rate_per_gram)
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add rate')
            }

            showToast('New rate added successfully!', 'success')
            setShowAddModal(false)
            setNewRateData({ metal_type: 'gold', purity: '', rate_per_gram: '' })
            fetchRates() // Refresh list
        } catch (error: any) {
            console.error('Error adding rate:', error)
            showToast(error.message, 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative">
            {/* Custom Toast */}


            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Manage Metal Rates</h1>
                <div className="flex gap-2">
                    <Button onClick={() => setShowAddModal(true)}>
                        <TrendingUp className="h-4 w-4 mr-2" /> Add Rate
                    </Button>
                    <Button variant="outline" size="sm" onClick={fetchRates}>
                        <RefreshCw className="h-4 w-4 mr-2" /> Sync
                    </Button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden max-w-4xl">
                <div className="bg-emerald-950 px-6 py-4 border-b border-emerald-900 flex items-center justify-between">
                    <div className="flex items-center">
                        <TrendingUp className="text-accent mr-3 h-6 w-6" />
                        <h2 className="text-lg font-medium text-white">Live Rates Configuration</h2>
                    </div>
                    <span className="text-xs text-emerald-200/60 font-mono hidden sm:inline">Last Updated: {new Date().toLocaleTimeString()}</span>
                </div>

                {/* Mobile View (Cards) */}
                <div className="block md:hidden p-4 space-y-4">
                    {rates.map((rate) => (
                        <div key={rate.id} className="bg-white border rounded-lg shadow-sm p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-gray-900 capitalize">{rate.metal_type}</h3>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 mt-1">
                                        {rate.purity}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 font-mono">
                                    {new Date(rate.updated_at).toLocaleDateString()}
                                </div>
                            </div>

                            <div>
                                <label htmlFor={`mobile-rate-${rate.id}`} className="block text-xs font-medium text-gray-500 mb-1">
                                    Current Rate (₹/g)
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 text-sm">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        id={`mobile-rate-${rate.id}`}
                                        defaultValue={rate.rate_per_gram}
                                        className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-emerald-500 focus:ring-emerald-500 text-base text-gray-900 py-2" // text-base prevents iOS zoom
                                        placeholder="0.00"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-gray-400 text-sm">/g</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                    const input = document.getElementById(`mobile-rate-${rate.id}`) as HTMLInputElement
                                    handleUpdate(rate.id, Number(input.value))
                                }}
                                disabled={updating === rate.id}
                            >
                                {updating === rate.id ? <Loader2 className="animate-spin h-3 w-3 mr-2" /> : null}
                                {updating === rate.id ? 'Updating...' : 'Update Rate'}
                            </Button>
                        </div>
                    ))}
                    {rates.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            No rates found. Add a new rate to get started.
                        </div>
                    )}
                </div>

                {/* Desktop View (Table) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metal</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purity</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Rate (₹/g)</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {rates.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No rates found. Add a new rate to get started.
                                    </td>
                                </tr>
                            ) : rates.map((rate) => (
                                <tr key={rate.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                                        {rate.metal_type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            {rate.purity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="relative rounded-md shadow-sm max-w-[140px]">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="text-gray-500 sm:text-xs">₹</span>
                                            </div>
                                            <input
                                                type="number"
                                                id={`rate-${rate.id}`}
                                                defaultValue={rate.rate_per_gram}
                                                className="block w-full rounded-md border-gray-300 pl-6 pr-12 focus:border-emerald-500 focus:ring-emerald-500 text-sm text-gray-900 py-1.5"
                                            />
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                <span className="text-gray-400 sm:text-xs">/g</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                const input = document.getElementById(`rate-${rate.id}`) as HTMLInputElement
                                                handleUpdate(rate.id, Number(input.value))
                                            }}
                                            disabled={updating === rate.id}
                                            className="min-w-[80px]"
                                        >
                                            {updating === rate.id ? <Loader2 className="animate-spin h-3 w-3" /> : 'Update'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Rates updated here will reflect immediately on product pages based on their purity.
                    </p>
                </div>
            </div>

            {/* Add Rate Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Metal Rate</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddRate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Metal Type</label>
                                <select
                                    className="w-full rounded-md border border-gray-300 p-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                                    value={newRateData.metal_type}
                                    onChange={(e) => setNewRateData({ ...newRateData, metal_type: e.target.value })}
                                >
                                    <option value="gold">Gold</option>
                                    <option value="silver">Silver</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Purity (e.g. 24K, 22K, 92.5)</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-md border border-gray-300 p-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                                    placeholder="e.g. 24K"
                                    value={newRateData.purity}
                                    onChange={(e) => setNewRateData({ ...newRateData, purity: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rate per Gram (₹)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full rounded-md border border-gray-300 p-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                                    placeholder="e.g. 7200"
                                    value={newRateData.rate_per_gram}
                                    onChange={(e) => setNewRateData({ ...newRateData, rate_per_gram: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="mr-3">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Add Rate'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
