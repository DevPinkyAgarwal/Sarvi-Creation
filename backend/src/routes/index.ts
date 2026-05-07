import { Router } from 'express';
import mongoose from 'mongoose';

import userRoutes from './user.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import orderRoutes from './order.routes';
import couponRoutes from './coupon.routes';
import announcementRoutes from './announcement.routes';
import newsletterRoutes from './newsletter.routes';
import paymentRoutes from './payment.routes';
import contactRoutes from './contact.routes';

const router = Router();

// Route Integrations
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/coupons', couponRoutes);
router.use('/announcements', announcementRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/payment', paymentRoutes);
router.use('/contact', contactRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({ 
        status: 'ok', 
        database: dbStatus,
        timestamp: new Date().toISOString() 
    });
});

export default router;
