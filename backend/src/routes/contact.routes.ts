import express from 'express';
import { 
    submitContactForm, 
    getContactMessages, 
    markAsRead, 
    deleteMessage 
} from '../controllers/contact.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

// Public route
router.post('/', submitContactForm);

// Admin routes
router.get('/admin', protect, admin, getContactMessages);
router.put('/admin/:id/read', protect, admin, markAsRead);
router.delete('/admin/:id', protect, admin, deleteMessage);

export default router;
