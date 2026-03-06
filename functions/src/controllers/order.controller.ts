import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { CheckoutPayload, OrderItem, Product, Order } from '../models/types';
import { Timestamp } from 'firebase-admin/firestore';

const ordersRef = db.collection('orders');

export const checkout = async (req: Request, res: Response) => {
    try {
        const payload: CheckoutPayload = req.body;
        let subtotal = 0;
        const orderItems: OrderItem[] = [];

        // 1. Validate items and availability
        for (const item of payload.items) {
            const doc = await db.collection('products').doc(item.productId).get();
            if (!doc.exists) throw new Error(`Product ${item.productId} not found`);
            const product = doc.data() as Product;

            if (!product.active || product.stockQuantity < item.quantity) {
                throw new Error(`Insufficient stock for ${product.title}`);
            }

            orderItems.push({
                productId: item.productId,
                title: product.title,
                price: product.price,
                quantity: item.quantity,
            });
            subtotal += product.price * item.quantity;
        }

        // 2. Simplistic Discount Logic
        let discount = 0;
        // ... insert discount lookup logic ...

        const shippingFee = subtotal > 500 ? 0 : 50; // Simple rule: free shipping over 500
        const grandTotal = subtotal - discount + shippingFee;

        // 3. Create Pending Order
        // customerId comes from: (a) Firebase token if user was logged in, or (b) payload field set by frontend
        const customerId = (req as any).user?.uid || payload.customerId || null;

        const orderData: Order = {
            customerId,
            customerDetails: payload.customerDetails,
            shippingAddress: payload.shippingAddress,
            items: orderItems,
            subtotal,
            discount,
            shippingFee,
            grandTotal,
            paymentMethod: payload.paymentMethod,
            paymentStatus: payload.paymentMethod === 'cod' ? 'pending' : 'pending',
            orderStatus: 'Pending',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        const docRef = await ordersRef.add(orderData);

        // 4. Return order and intent keys (placeholder for Stripe/Razorpay)
        const paymentIntent = payload.paymentMethod === 'cod' ? null : `pi_dummy_${docRef.id}`;

        res.status(201).json({
            success: true,
            data: {
                orderId: docRef.id,
                status: orderData.orderStatus,
                grandTotal,
                paymentIntent
            }
        });

    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const snapshot = await ordersRef.orderBy('createdAt', 'desc').get();
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, count: orders.length, data: orders });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        await ordersRef.doc(req.params.id as string).update({
            orderStatus: status,
            updatedAt: Timestamp.now()
        });
        res.json({ success: true, message: `Order status updated to ${status}` });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
