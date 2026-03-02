import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { Timestamp } from 'firebase-admin/firestore';

const newsletterRef = db.collection('newsletter');
const inquiriesRef = db.collection('inquiries');

export const subscribeNewsletter = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        // Prevent duplicates
        const existing = await newsletterRef.where('email', '==', email).limit(1).get();
        if (!existing.empty) {
            return res.status(400).json({ success: false, message: 'Email already subscribed' });
        }

        await newsletterRef.add({ email, subscribedAt: Timestamp.now() });
        res.status(201).json({ success: true, message: 'Subscribed successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const submitContact = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, message } = req.body;
        await inquiriesRef.add({
            name,
            email,
            phone: phone || null,
            message,
            status: 'unread',
            submittedAt: Timestamp.now(),
        });
        res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getInquiries = async (req: Request, res: Response) => {
    try {
        const snapshot = await inquiriesRef.orderBy('submittedAt', 'desc').get();
        const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, data: records });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getNewsletterGroup = async (req: Request, res: Response) => {
    try {
        const snapshot = await newsletterRef.orderBy('subscribedAt', 'desc').get();
        const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, data: records });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
