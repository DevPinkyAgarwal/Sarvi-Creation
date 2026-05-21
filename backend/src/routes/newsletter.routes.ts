import { Router } from 'express';
import { subscribe, getAllSubscribers, deleteSubscriber } from '../controllers/newsletter.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = Router();

// Public
router.post('/subscribe', subscribe);

// Admin Only
router.get('/admin/all', protect, admin, getAllSubscribers);
router.delete('/admin/:id', protect, admin, deleteSubscriber);

export default router;
