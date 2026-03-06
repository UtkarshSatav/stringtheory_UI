import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { validateRequest } from '../middleware/validate';
import { checkoutSchema, orderStatusSchema } from '../models/schemas';
import { verifyToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public: Checkout creates an order
router.post('/checkout', validateRequest(checkoutSchema), orderController.checkout);

// Admin: View and update orders
router.use(verifyToken, requireAdmin);
router.get('/', orderController.getOrders);
router.put('/:id/status', validateRequest(orderStatusSchema), orderController.updateOrderStatus);

export default router;
