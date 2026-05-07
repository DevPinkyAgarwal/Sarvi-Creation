import { Router } from 'express';
import { protect, admin } from '../middlewares/auth.middleware';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon } from '../controllers/coupon.controller';

const router = Router();

router.get('/', protect, admin, getCoupons);
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);
router.post('/validate', protect, validateCoupon);

export default router;
