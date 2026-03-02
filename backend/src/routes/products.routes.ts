import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validateRequest } from '../middleware/validate';
import { productSchema, stockAdjustSchema } from '../models/schemas';
import { verifyToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public Routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin Routes
router.use(verifyToken, requireAdmin);
router.post('/', validateRequest(productSchema), productController.createProduct);
router.put('/:id', validateRequest(productSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/:id/adjust-stock', validateRequest(stockAdjustSchema), productController.adjustStock);

export default router;
