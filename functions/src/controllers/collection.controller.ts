import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { Collection } from '../models/types';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

const collectionsRef = db.collection('collections');
const productsRef = db.collection('products');

export const getCollections = async (req: Request, res: Response) => {
    try {
        const snapshot = await collectionsRef.get();
        const collections = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, count: collections.length, data: collections });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createCollection = async (req: Request, res: Response) => {
    try {
        const data: Collection = req.body;
        data.createdAt = Timestamp.now();
        data.updatedAt = Timestamp.now();

        const docRef = await collectionsRef.add(data);
        res.status(201).json({ success: true, data: { id: docRef.id, ...data } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const assignProductToCollection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Collection ID
        const { productId } = req.body;

        // Verify Collection Exists
        const colDoc = await collectionsRef.doc(id as string).get();
        if (!colDoc.exists) return res.status(404).json({ success: false, message: 'Collection not found' });

        // Update Product's collectionIds array
        await productsRef.doc(productId).update({
            collectionIds: FieldValue.arrayUnion(id),
            updatedAt: Timestamp.now()
        });

        res.json({ success: true, message: 'Product assigned to collection successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
