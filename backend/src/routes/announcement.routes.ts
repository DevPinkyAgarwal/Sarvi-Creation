import express from 'express';
import {
    getAnnouncements,
    getActiveAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} from '../controllers/announcement.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/active', getActiveAnnouncement);

// Admin routes
router.route('/')
    .get(protect, admin, getAnnouncements)
    .post(protect, admin, createAnnouncement);

router.route('/:id')
    .put(protect, admin, updateAnnouncement)
    .delete(protect, admin, deleteAnnouncement);

export default router;
