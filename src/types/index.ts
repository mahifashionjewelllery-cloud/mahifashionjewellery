export type MetalType = 'gold' | 'silver';
export type Purity = '22K' | '24K' | '18K' | '14K' | '92.5' | 'pure';
export type MakingChargeType = 'percentage' | 'fixed';
export type Role = 'user' | 'admin';

export interface Profile {
    id: string;
    full_name: string | null;
    phone: string | null;
    address: string | null;
    role: Role;
    created_at: string;
}

export interface MetalRate {
    id: string;
    metal_type: MetalType;
    purity: string; // Using string to be flexible with DB, though it should match Purity
    rate_per_gram: number;
    updated_at: string;
}

export interface Product {
    id: string;
    name: string;
    description: string | null;
    metal_type: MetalType;
    purity: Purity;
    weight: number;
    making_charge_type: MakingChargeType;
    making_charge_value: number;
    stock: number;
    is_featured: boolean;
    created_at: string;
    images?: string[]; // Joined from product_images
}

export interface ProductImage {
    id: string;
    product_id: string;
    image_url: string;
    created_at: string;
}

export interface Order {
    id: string;
    user_id: string;
    razorpay_order_id: string | null;
    razorpay_payment_id: string | null;
    total_amount: number;
    payment_status: 'cod' | 'paid';
    payment_method?: 'cod' | 'online';
    order_status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shipping_address: string | null;
    created_at: string;
    items?: OrderItem[];
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price_at_purchase: number;
    product?: Product;
}

export interface CartItem {
    product: Product;
    quantity: number;
    currentPrice: number; // Calculated dynamic price
}
