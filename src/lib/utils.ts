import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { MetalRate, Product } from "@/types"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount)
}

export const calculateProductPrice = (product: Product, metalRate: number) => {
    const metalPrice = product.weight * metalRate;

    let makingCharges = 0;
    if (product.making_charge_type === 'percentage') {
        makingCharges = metalPrice * (product.making_charge_value / 100);
    } else {
        makingCharges = product.making_charge_value;
    }

    const subTotal = metalPrice + makingCharges;
    const gst = subTotal * 0.03; // 3% GST

    return {
        total: Math.round(subTotal + gst),
        breakdown: {
            metalPrice,
            makingCharges,
            gst,
            subTotal
        }
    };
}
