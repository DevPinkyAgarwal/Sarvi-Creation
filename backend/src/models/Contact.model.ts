import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    isBusiness: boolean;
    isRead: boolean;
    createdAt: Date;
}

const contactSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isBusiness: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

export const Contact = mongoose.model<IContact>('Contact', contactSchema);
