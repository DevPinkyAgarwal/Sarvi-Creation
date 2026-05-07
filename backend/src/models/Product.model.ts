import mongoose, { Document, Schema } from 'mongoose';

export interface IVariant {
    size?: string;
    color?: string;
    material?: string;
    purity?: string;
    priceAmount: number; // Final variant price
    stockQuantity: number;
    sku: string;
}

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    categories: mongoose.Types.ObjectId[];
    images: { public_id: string; url: string; isPrimary?: boolean }[];
    basePrice: number;
    makingCharges?: number;
    gstPercentage?: number;
    variants: IVariant[];
    isActive: boolean;
    ratingsAverage: number;
    ratingsQuantity: number;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        categories: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
        images: [
            {
                public_id: { type: String, required: true },
                url: { type: String, required: true },
                isPrimary: { type: Boolean, default: false },
            },
        ],
        basePrice: { type: Number, required: true },
        makingCharges: { type: Number, default: 0 },
        gstPercentage: { type: Number, default: 3 }, // standard GST for gold in India is 3%
        variants: [
            {
                size: { type: String },
                color: { type: String },
                material: { type: String },
                purity: { type: String },
                priceAmount: { type: Number, required: true },
                stockQuantity: { type: Number, required: true, default: 0 },
                sku: { type: String, required: true },
            },
        ],
        isActive: { type: Boolean, default: true, index: true },
        ratingsAverage: {
            type: Number,
            default: 0,
            min: [0, 'Rating must be above 0'],
            max: [5, 'Rating must be below 5.0'],
            set: (val: number) => Math.round(val * 10) / 10,
        },
        ratingsQuantity: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);
