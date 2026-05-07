import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import {
    registerUser, loginUser, logoutUser,
    getUserProfile, updateUserProfile, manageAddress, toggleWishlist
} from '../controllers/user.controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.put('/address', protect, manageAddress);
router.put('/wishlist/:productId', protect, toggleWishlist);

export default router;
