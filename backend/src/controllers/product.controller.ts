import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { Product } from '../models/types';
import { Timestamp } from 'firebase-admin/firestore';

const productsRef = db.collection('products');

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, collection, active, search } = req.query;
        let query: FirebaseFirestore.Query = productsRef;

        if (category) {
            query = query.where('category', '==', category);
        }
        if (collection) {
            query = query.where('collectionIds', 'array-contains', collection);
        }

        const snapshot = await query.get();
        let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (active !== undefined) {
            const isActive = active === 'true';
            products = products.filter((p: any) => p.active === isActive);
        }

        // Simple search implementation (client-side style filtering for simple usecase)
        if (search && typeof search === 'string') {
            const lowerSearch = search.toLowerCase();
            products = products.filter((p: any) =>
                p.title.toLowerCase().includes(lowerSearch) || p.description.toLowerCase().includes(lowerSearch)
            );
        }

        res.json({ success: true, count: products.length, data: products });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const doc = await productsRef.doc(req.params.id as string).get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Product not found' });

        res.json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const productData: Product = req.body;
        productData.inStock = productData.stockQuantity > 0;
        productData.createdAt = Timestamp.now();
        productData.updatedAt = Timestamp.now();

        const docRef = await productsRef.add(productData);
        res.status(201).json({ success: true, data: { id: docRef.id, ...productData } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const updateData = req.body;
        updateData.updatedAt = Timestamp.now();
        if (updateData.stockQuantity !== undefined) {
            updateData.inStock = updateData.stockQuantity > 0;
        }

        await productsRef.doc(req.params.id as string).update(updateData);
        res.json({ success: true, message: 'Product updated successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await productsRef.doc(req.params.id as string).delete();
        res.json({ success: true, message: 'Product deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const adjustStock = async (req: Request, res: Response) => {
    try {
        const { quantity } = req.body; // how much to add or subtract
        const docRef = productsRef.doc(req.params.id as string);

        await db.runTransaction(async (t) => {
            const doc = await t.get(docRef);
            if (!doc.exists) throw new Error('Product not found');

            const currentStats = doc.data() as Product;
            const newStock = currentStats.stockQuantity + quantity;

            if (newStock < 0) throw new Error('Not enough stock available');

            t.update(docRef, {
                stockQuantity: newStock,
                inStock: newStock > 0,
                updatedAt: Timestamp.now()
            });
        });

        res.json({ success: true, message: 'Stock adjusted' });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};
