import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { ReturnRequest } from '../models/types';
import { Timestamp } from 'firebase-admin/firestore';

const returnsRef = db.collection('returns');

export const createReturn = async (req: Request, res: Response) => {
    try {
        const { orderId, reason } = req.body;

        // Use the authenticated user context if available, fallback otherwise
        const customerId = (req as any).user?.uid || null;
        const customerEmail = (req as any).user?.email || req.body.email || '';

        // Check if order actually exists
        const orderDoc = await db.collection('orders').doc(orderId).get();
        if (!orderDoc.exists) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        const returnData: ReturnRequest = {
            orderId,
            customerId,
            customerEmail: customerEmail || orderDoc.data()?.customerDetails?.email || '',
            reason,
            status: 'Pending',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        const docRef = await returnsRef.add(returnData);

        res.status(201).json({ success: true, message: 'Return request submitted successfully', data: { id: docRef.id, ...returnData } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getReturns = async (req: Request, res: Response) => {
    try {
        const snapshot = await returnsRef.orderBy('createdAt', 'desc').get();
        const returns = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, count: returns.length, data: returns });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateReturnStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { status } = req.body;

        await returnsRef.doc(id).update({
            status,
            updatedAt: Timestamp.now()
        });

        res.json({ success: true, message: `Return request status updated to ${status}` });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
