'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    footer?: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [animateIn, setAnimateIn] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isOpen) {
            // Small delay to allow render before animation
            requestAnimationFrame(() => setAnimateIn(true))
            document.body.style.overflow = 'hidden'
        } else {
            const timer = setTimeout(() => {
                setAnimateIn(false)
                document.body.style.overflow = 'unset'
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    if (!isMounted) return null

    if (!isOpen && !animateIn) return null

    return createPortal(
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none pointer-events-none'
            }`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`
                    relative w-full max-w-md bg-white rounded-lg shadow-2xl 
                    transform transition-all duration-300 border border-emerald-900/10
                    ${isOpen && animateIn ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-xl font-serif font-semibold text-emerald-950">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-100 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    )
}
