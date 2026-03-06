import { Router } from 'express';
import { createReturn, getReturns, updateReturnStatus } from '../controllers/return.controller';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { returnRequestSchema, returnStatusSchema } from '../models/schemas';

const router = Router();

// Public / Authenticated Users
router.post('/', validateRequest(returnRequestSchema), createReturn);

// Admin only
router.get('/', verifyToken, requireAdmin, getReturns);
router.put('/:id/status', verifyToken, requireAdmin, validateRequest(returnStatusSchema), updateReturnStatus);

export default router;
