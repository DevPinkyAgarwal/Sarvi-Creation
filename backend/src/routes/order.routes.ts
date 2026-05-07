import { Router } from 'express';
import { protect, admin } from '../middlewares/auth.middleware';
import {
    createOrder, getMyOrders, getOrderById, updateOrderToPaid,
    getAllOrders, updateOrderStatus, getDashboardStats
} from '../controllers/order.controller';

const router = Router();

// User
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

// Admin
router.get('/admin/all', protect, admin, getAllOrders);
router.put('/admin/:id/status', protect, admin, updateOrderStatus);
router.get('/admin/dashboard', protect, admin, getDashboardStats);

export default router;
