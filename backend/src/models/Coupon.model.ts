import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minPurchaseAmount?: number;
    maxDiscountAmount?: number; // Only applicable for percentage
    expiryDate: Date;
    isActive: boolean;
    usageLimit?: number;
    usedCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
    {
        code: { type: String, required: true, unique: true, uppercase: true },
        discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
        discountValue: { type: Number, required: true },
        minPurchaseAmount: { type: Number, default: 0 },
        maxDiscountAmount: { type: Number },
        expiryDate: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
        usageLimit: { type: Number },
        usedCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
