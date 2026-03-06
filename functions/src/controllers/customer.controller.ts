import { Request, Response } from 'express';
import { db, auth } from '../config/firebase';
import { Customer } from '../models/types';
import { Timestamp } from 'firebase-admin/firestore';

const customersRef = db.collection('customers');
const ordersRef = db.collection('orders');

export const getCustomerProfile = async (req: Request, res: Response) => {
    try {
        const uid = (req as any).user?.uid;
        if (!uid) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const doc = await customersRef.doc(uid).get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Customer not found' });

        res.json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCustomerOrders = async (req: Request, res: Response) => {
    try {
        const uid = (req as any).user?.uid;
        const email = (req as any).user?.email;
        if (!uid) return res.status(401).json({ success: false, message: 'Unauthorized' });

        // Query by UID first (for new orders with customerId set)
        const byUid = await ordersRef.where('customerId', '==', uid).get();

        // Also query by email as a fallback (for orders placed before the fix, where customerId was null)
        const byEmail = email
            ? await ordersRef.where('customerDetails.email', '==', email).get()
            : null;

        // Merge and deduplicate by document ID
        const seen = new Set<string>();
        const orders: any[] = [];

        for (const doc of [...byUid.docs, ...(byEmail?.docs || [])]) {
            if (!seen.has(doc.id)) {
                seen.add(doc.id);
                orders.push({ id: doc.id, ...doc.data() });
            }
        }

        // Sort newest first
        orders.sort((a, b) => (b.createdAt?._seconds || 0) - (a.createdAt?._seconds || 0));

        res.json({ success: true, count: orders.length, data: orders });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const syncCustomer = async (req: Request, res: Response) => {
    try {
        // Called after a user signs up on the frontend
        const { uid, email, name, phone } = req.body; // or get from decoded token

        const customerData: Customer = {
            name,
            email,
            phone: phone || '',
            role: 'user',
            createdAt: Timestamp.now(),
        };

        await customersRef.doc(uid).set(customerData, { merge: true });

        res.json({ success: true, message: 'Customer synced' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllCustomers = async (req: Request, res: Response) => {
    try {
        const snapshot = await customersRef.get();
        const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, count: customers.length, data: customers });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
