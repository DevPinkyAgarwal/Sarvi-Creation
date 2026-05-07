import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon.model';

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req: Request, res: Response) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching coupons.' });
    }
};

// @desc    Create a coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req: Request, res: Response) => {
    try {
        const { code, discountType, discountValue, minPurchaseAmount, maxDiscountAmount, expiryDate, usageLimit } = req.body;
        const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
        if (couponExists) {
            return res.status(400).json({ message: 'Coupon code already exists.' });
        }
        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            minPurchaseAmount,
            maxDiscountAmount,
            expiryDate,
            usageLimit,
        });
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating coupon.' });
    }
};

// @desc    Update a coupon (Admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req: Request, res: Response) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found.' });

        const { code, discountType, discountValue, minPurchaseAmount, maxDiscountAmount, expiryDate, usageLimit, isActive } = req.body;

        if (code) coupon.code = code.toUpperCase();
        if (discountType) coupon.discountType = discountType;
        if (discountValue !== undefined) coupon.discountValue = discountValue;
        if (minPurchaseAmount !== undefined) coupon.minPurchaseAmount = minPurchaseAmount;
        if (maxDiscountAmount !== undefined) coupon.maxDiscountAmount = maxDiscountAmount;
        if (expiryDate) coupon.expiryDate = expiryDate;
        if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
        if (isActive !== undefined) coupon.isActive = isActive;

        const updated = await coupon.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating coupon.' });
    }
};

// @desc    Delete a coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req: Request, res: Response) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found.' });
        await coupon.deleteOne();
        res.json({ message: 'Coupon deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting coupon.' });
    }
};

// @desc    Validate a coupon (Public)
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req: Request, res: Response) => {
    try {
        const { code, cartTotal } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid or inactive coupon code.' });
        }

        if (new Date() > new Date(coupon.expiryDate)) {
            return res.status(400).json({ message: 'Coupon has expired.' });
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Coupon usage limit reached.' });
        }

        if (cartTotal < (coupon.minPurchaseAmount || 0)) {
            return res.status(400).json({ message: `Minimum purchase of ₹${coupon.minPurchaseAmount} required.` });
        }

        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (cartTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
                discount = coupon.maxDiscountAmount;
            }
        } else {
            discount = coupon.discountValue;
        }

        res.json({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount: discount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error validating coupon.' });
    }
};
