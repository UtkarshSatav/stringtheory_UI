import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { db } from './config/firebase'; // Ensure firebase initializes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Serve frontend in single deployment (Production)
const frontendPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendPath));

app.use((req, res) => {
    // If it's an API route that wasn't matched, it should logically have been caught above,
    // but we use /api prefix to be safe.
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'API Route not found' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

app.listen(PORT, () => {
    console.log(`String Theory OMS Backend listening on port ${PORT}`);
});
