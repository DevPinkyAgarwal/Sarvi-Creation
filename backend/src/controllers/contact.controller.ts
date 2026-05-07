import { Request, Response } from 'express';
import { Contact } from '../models/Contact.model';

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json({ 
            message: 'Your message has been sent successfully. We will get back to you soon.',
            contact 
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server error submitting contact form.' });
    }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/admin/contact
// @access  Private/Admin
export const getContactMessages = async (req: Request, res: Response) => {
    try {
        const messages = await Contact.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server error fetching contact messages.' });
    }
};

// @desc    Mark message as read (Admin)
// @route   PUT /api/admin/contact/:id/read
// @access  Private/Admin
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Message not found.' });

        contact.isRead = true;
        await contact.save();

        res.json({ message: 'Message marked as read.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server error updating message.' });
    }
};

// @desc    Delete contact message (Admin)
// @route   DELETE /api/admin/contact/:id
// @access  Private/Admin
export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Message not found.' });

        await contact.deleteOne();
        res.json({ message: 'Message deleted successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server error deleting message.' });
    }
};
