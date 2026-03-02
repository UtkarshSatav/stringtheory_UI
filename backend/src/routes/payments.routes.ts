import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

router.post('/intent', paymentController.createPaymentIntent);
router.post('/webhook', paymentController.paymentWebhook);

export default router;
