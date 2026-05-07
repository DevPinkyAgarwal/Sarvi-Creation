import { Request, Response } from 'express';
import { Subscriber } from '../models/Subscriber.model';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribe = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        // Check if already subscribed
        const existingSubscriber = await Subscriber.findOne({ email });

        if (existingSubscriber) {
            if (!existingSubscriber.isActive) {
                existingSubscriber.isActive = true;
                await existingSubscriber.save();
                return res.status(200).json({ message: 'Successfully re-subscribed to the newsletter!' });
            }
            return res.status(400).json({ message: 'This email is already subscribed.' });
        }

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        res.status(201).json({ message: 'Successfully subscribed to the newsletter!' });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        console.error('Newsletter subscription error:', error);
        res.status(500).json({ message: 'Server error processing subscription.' });
    }
};
