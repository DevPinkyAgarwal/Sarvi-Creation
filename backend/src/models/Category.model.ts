import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    image?: {
        public_id: string;
        url: string;
    };
    isActive: boolean;
    section: 'category' | 'collection' | 'material' | 'discover';
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        image: {
            public_id: { type: String },
            url: { type: String },
        },
        isActive: { type: Boolean, default: true, index: true },
        section: { 
            type: String, 
            enum: ['category', 'collection', 'material', 'discover'], 
            default: 'category',
            index: true
        },
    },
    { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', categorySchema);
