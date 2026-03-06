import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { CartPayload, Product } from '../models/types';

// Real-world, this might check a discounts collection
const VALID_DISCOUNTS: Record<string, { type: 'flat' | 'percentage'; value: number }> = {
    'WELCOME10': { type: 'percentage', value: 10 },
    'MINUS50': { type: 'flat', value: 50 },
};

export const validateCart = async (req: Request, res: Response) => {
    try {
        const payload: CartPayload = req.body;

        let subtotal = 0;
        const items = [];

        // Fetch latest prices and stock from DB
        for (const item of payload.items) {
            const doc = await db.collection('products').doc(item.productId).get();
            if (!doc.exists) return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });

            const product = doc.data() as Product;

            if (!product.active || product.stockQuantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Product ${product.title} is out of stock or insufficient quantity`
                });
            }

            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            items.push({
                productId: item.productId,
                title: product.title,
                price: product.price,
                quantity: item.quantity,
            });
        }

        let discount = 0;
        if (payload.discountCode && VALID_DISCOUNTS[payload.discountCode]) {
            const d = VALID_DISCOUNTS[payload.discountCode];
            if (d.type === 'percentage') {
                discount = (subtotal * d.value) / 100;
            } else {
                discount = d.value;
            }
        }

        // Ensure discount doesn't exceed subtotal
        discount = Math.min(discount, subtotal);
        const grandTotal = subtotal - discount; // Add shipping fee if applicable

        res.json({
            success: true,
            data: {
                valid: true,
                items,
                subtotal,
                discount,
                grandTotal
            }
        });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
