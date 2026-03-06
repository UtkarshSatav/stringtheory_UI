import { Router } from 'express';
import * as formController from '../controllers/form.controller';
import { validateRequest } from '../middleware/validate';
import { newsletterSchema, contactSchema } from '../models/schemas';
import { verifyToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public handlers
router.post('/newsletter', validateRequest(newsletterSchema), formController.subscribeNewsletter);
router.post('/contact', validateRequest(contactSchema), formController.submitContact);

// Admin handlers
router.use(verifyToken, requireAdmin);
router.get('/contact', formController.getInquiries);
router.get('/newsletter', formController.getNewsletterGroup);

export default router;
