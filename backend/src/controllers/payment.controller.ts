import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { Order, Product } from '../models/types';

const ordersRef = db.collection('orders');
const productsRef = db.collection('products');

export const createPaymentIntent = async (req: Request, res: Response) => {
    // Skeleton: Real world would call Stripe/Razorpay API here
    res.json({ success: true, clientSecret: 'dummy_secret_key_123', paymentIntentId: 'pi_dummy_456' });
};

export const paymentWebhook = async (req: Request, res: Response) => {
    try {
        // Note: In real world, verify webhook signature using Stripe/Razorpay SDK
        // const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        const { orderId, status } = req.body; // Mocked payload

        if (status === 'success') {
            const orderDoc = await ordersRef.doc(orderId).get();
            if (!orderDoc.exists) throw new Error('Order not found');

            const orderData = orderDoc.data() as Order;

            // Only deduct if it wasn't already paid (idempotency check)
            if (orderData.paymentStatus !== 'paid') {
                const batch = db.batch();

                // 1. Update Order Status
                batch.update(orderDoc.ref, {
                    paymentStatus: 'paid',
                    orderStatus: 'Paid',
                    updatedAt: Timestamp.now()
                });

                // 2. Deduct Stock
                for (const item of orderData.items) {
                    const productRef = productsRef.doc(item.productId);
                    batch.update(productRef, {
                        stockQuantity: FieldValue.increment(-item.quantity)
                    });
                    // Note: you'd also want to ensure inStock is updated if quantity hits 0
                    // For simplicity, a Firebase Cloud Function triggers on stockQuantity change, or we do a transaction.
                    // Since batch doesn't read, a transaction is actually safer for stock deduction:
                }

                await batch.commit();

                /*
                 * Better approach for stock deduction is transaction:
                  await db.runTransaction(async (t) => {
                    // ... read stock ...
                    // ... deduct ...
                    // ... set inStock boolean ...
                  });
                 */
            }
        }

        res.json({ received: true });
    } catch (error: any) {
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};
