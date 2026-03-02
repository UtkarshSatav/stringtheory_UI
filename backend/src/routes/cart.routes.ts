import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { validateRequest } from '../middleware/validate';
import { cartValidateSchema } from '../models/schemas';

const router = Router();

router.post('/validate', validateRequest(cartValidateSchema), cartController.validateCart);

export default router;
