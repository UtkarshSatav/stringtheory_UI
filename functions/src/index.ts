
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/firebase'; // Ensure firebase initializes

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
import productRoutes from './routes/products.routes';
import collectionRoutes from './routes/collections.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/orders.routes';
import paymentRoutes from './routes/payments.routes';
import formRoutes from './routes/forms.routes';
import customerRoutes from './routes/customers.routes';
import returnRoutes from './routes/returns.routes';

app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/returns', returnRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Since we are running in Firebase Functions (which will be mounted under /api),
// we don't need the static file catching or the '/api' prefix inside the handlers.

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

const isFirebase = !!process.env.FUNCTION_TARGET || !!process.env.FUNCTIONS_EMULATOR;

export const api = isFirebase
    ? require('firebase-functions/v2/https').onRequest(app)
    : null;

// Export app for Vercel
export default app;

if (!isFirebase && process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`String Theory OMS Backend listening on port ${PORT} (Local Dev Mode)`);
    });
}
