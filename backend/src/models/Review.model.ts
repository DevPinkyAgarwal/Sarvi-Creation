import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    rating: number; // 1 to 5
    comment: string;
    isApproved: boolean; // Admin moderation
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        rating: {
            type: Number,
            required: true,
            min: [1, 'Minimum rating is 1'],
            max: [5, 'Maximum rating is 5'],
        },
        comment: { type: String, required: true },
        isApproved: { type: Boolean, default: true }, // Set to false if you want strict moderation first
    },
    { timestamps: true }
);

// Prevent user from reviewing the same product twice
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
