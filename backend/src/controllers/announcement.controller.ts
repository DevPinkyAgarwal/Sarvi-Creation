import { Request, Response } from 'express';
import { Announcement } from '../models/Announcement.model';

// @desc    Get all announcements (Admin)
// @route   GET /api/announcements
// @access  Private/Admin
export const getAnnouncements = async (req: Request, res: Response) => {
    try {
        const announcements = await Announcement.find({}).sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Get active announcement (Public)
// @route   GET /api/announcements/active
// @access  Public
export const getActiveAnnouncement = async (req: Request, res: Response) => {
    try {
        const activeAnnouncement = await Announcement.findOne({ isActive: true });
        if (activeAnnouncement) {
            res.json(activeAnnouncement);
        } else {
            res.status(404).json({ message: 'No active announcement' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private/Admin
export const createAnnouncement = async (req: Request, res: Response) => {
    try {
        const { message, isActive } = req.body;

        // If newly created is active, deactivate all others
        if (isActive) {
            await Announcement.updateMany({}, { isActive: false });
        }

        const announcement = await Announcement.create({
            message,
            isActive: isActive || false,
        });

        res.status(201).json(announcement);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Update an announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
export const updateAnnouncement = async (req: Request, res: Response) => {
    try {
        const { message, isActive } = req.body;
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        // If setting this to active, deactivate all others
        if (isActive && !announcement.isActive) {
            await Announcement.updateMany({}, { isActive: false });
        }

        announcement.message = message !== undefined ? message : announcement.message;
        announcement.isActive = isActive !== undefined ? isActive : announcement.isActive;

        const updatedAnnouncement = await announcement.save();
        res.json(updatedAnnouncement);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
export const deleteAnnouncement = async (req: Request, res: Response) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        await announcement.deleteOne();
        res.json({ message: 'Announcement removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};
