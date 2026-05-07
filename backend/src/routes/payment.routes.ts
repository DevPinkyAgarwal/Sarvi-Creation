import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { createRazorpayOrder, verifyPayment, razorpayWebhook } from '../controllers/payment.controller';

const router = Router();

router.post('/razorpay', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', razorpayWebhook);

export default router;
