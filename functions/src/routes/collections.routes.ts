import { Router } from 'express';
import * as collectionController from '../controllers/collection.controller';
import { validateRequest } from '../middleware/validate';
import { collectionSchema } from '../models/schemas';
import { verifyToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', collectionController.getCollections);

router.use(verifyToken, requireAdmin);
router.post('/', validateRequest(collectionSchema), collectionController.createCollection);
router.post('/:id/assign', collectionController.assignProductToCollection);

export default router;
