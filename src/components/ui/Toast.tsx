import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-in-out ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
            }`}>
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-white/20">
                {type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                ) : (
                    <XCircle className="w-5 h-5" />
                )}
            </div>
            <div className="ml-3 text-sm font-normal">{message}</div>
            <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-white hover:text-gray-100 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-white/10 inline-flex h-8 w-8"
                onClick={onClose}
                aria-label="Close"
            >
                <span className="sr-only">Close</span>
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
