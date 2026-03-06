import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';
import { verifyToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Protected Customer Routes
router.use(verifyToken);
router.get('/profile', customerController.getCustomerProfile);
router.get('/orders', customerController.getCustomerOrders);
router.post('/sync', customerController.syncCustomer);

// Admin
router.get('/admin/all', requireAdmin, customerController.getAllCustomers);

export default router;
