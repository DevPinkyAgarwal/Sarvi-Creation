import { Router } from 'express';
import { subscribe } from '../controllers/newsletter.controller';

const router = Router();

// Public
router.post('/subscribe', subscribe);

export default router;
