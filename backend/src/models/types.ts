import { Timestamp } from 'firebase-admin/firestore';

export interface Product {
    id?: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    price: number;
    images: string[];
    active: boolean;
    stockQuantity: number;
    inStock: boolean;
    collectionIds: string[];
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface Collection {
    id?: string;
    title: string;
    slug: string;
    description?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface OrderItem {
    productId: string;
    title: string;
    quantity: number;
    price: number;
}

export interface Order {
    id?: string;
    customerId: string | null;
    customerDetails: {
        name: string;
        email: string;
        phone: string;
    };
    shippingAddress: string;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    shippingFee: number;
    grandTotal: number;
    paymentMethod: string;
    paymentStatus: 'pending' | 'paid' | 'failed';
    orderStatus: 'Pending' | 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface ReturnRequest {
    id?: string;
    orderId: string;
    customerId?: string | null;
    customerEmail: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Refunded';
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface Customer {
    id?: string;
    name: string;
    email: string;
    phone: string;
    addresses?: string[];
    role: 'user' | 'admin';
    createdAt?: Timestamp;
}

export interface CartPayload {
    items: Array<{ productId: string; quantity: number }>;
    discountCode?: string;
}

export interface CheckoutPayload {
    customerId?: string | null;
    customerDetails: {
        name: string;
        email: string;
        phone: string;
    };
    shippingAddress: string;
    items: Array<{ productId: string; quantity: number }>;
    discountCode?: string;
    paymentMethod: string;
}
