import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order } from '../models/Order.model';
import { emitStatsUpdate } from '../utils/socket';

const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret || key_id.includes('YOUR_KEY')) {
        throw new Error('Razorpay API keys are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file.');
    }
    return new Razorpay({ key_id, key_secret });
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/razorpay
// @access  Private
export const createRazorpayOrder = async (req: Request, res: Response) => {
    try {
        const { amount, orderId } = req.body;
        
        if (!amount || !orderId) {
            return res.status(400).json({ message: 'Amount and Order ID are required' });
        }

        const razorpay = getRazorpayInstance();

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);
        
        if (!razorpayOrder) {
            return res.status(500).json({ message: 'Failed to create Razorpay order' });
        }

        // Update our order with the razorpay order id
        await Order.findByIdAndUpdate(orderId, { razorpayOrderId: razorpayOrder.id });

        res.json(razorpayOrder);
    } catch (error: any) {
        console.error('Razorpay Error:', error);
        res.status(500).json({ message: error.message || 'Server error creating Razorpay order.' });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId // Our MongoDB Order ID
        } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET';

        // Create HMAC to verify signature
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        if (digest !== razorpay_signature) {
            return res.status(400).json({ message: 'Transaction not legit!' });
        }

        // If signature is valid, update the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
            id: razorpay_payment_id,
            status: 'success',
            update_time: new Date().toISOString(),
            email_address: req.user.email, // Using logged in user's email
        };
        order.status = 'Processing';
        
        const updatedOrder = await order.save();
        emitStatsUpdate(); // Notify admin dashboard

        res.json({
            message: 'Payment verified successfully',
            order: updatedOrder
        });

    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ message: 'Server error verifying payment.' });
    }
};

// @desc    Razorpay Webhook handler
// @route   POST /api/payment/webhook
// @access  Public (Signature verified)
export const razorpayWebhook = async (req: Request, res: Response) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_webhook_secret';
    const signature = req.headers['x-razorpay-signature'] as string;

    try {
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if (digest !== signature) {
            return res.status(400).json({ message: 'Invalid webhook signature' });
        }

        const event = req.body.event;

        if (event === 'order.paid') {
            const razorpayOrderId = req.body.payload.order.entity.id;
            const paymentId = req.body.payload.payment.entity.id;
            const email = req.body.payload.payment.entity.email;

            const order = await Order.findOne({ razorpayOrderId });
            
            if (order && !order.isPaid) {
                order.isPaid = true;
                order.paidAt = new Date();
                order.paymentResult = {
                    id: paymentId,
                    status: 'success',
                    update_time: new Date().toISOString(),
                    email_address: email,
                };
                order.status = 'Processing';
                await order.save();
                emitStatsUpdate();
                console.log(`✅ Order ${order._id} marked as paid via webhook.`);
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ message: 'Webhook error' });
    }
};
