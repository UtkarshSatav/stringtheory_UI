import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

export interface AuthRequest extends Request {
    user?: any;
}

// Basic verify token middleware
export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    // NOTE: For a minimal OMS, we'd normally verify the JWT
    // But for simple testing without auth setup on the frontend, we can pass a dummy secret or just allow it if needed
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    try {
        // Basic shared secret check for quick dev
        if (token === process.env.ADMIN_SECRET) {
            req.user = { role: 'admin' };
            return next();
        }

        // Otherwise check Firebase Auth token
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' });
    }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Check if the assigned user has the specific Admin UID provided or a role
    if (req.user && (req.user.role === 'admin' || req.user.uid === 'bO4hxi9UxndcwtAit5hiy5FyVnD3')) {
        return next();
    }

    // For easy development, if ADMIN_SECRET is not set, we might bypass, but let's be strict
    return res.status(403).json({ success: false, message: 'Forbidden: Admin access only' });
};
