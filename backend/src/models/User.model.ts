import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'user' | 'admin';
    phone?: string;
    addresses: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
        isDefault: boolean;
    }[];
    wishlist: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String }, // Optional for Social Logins if added later
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        phone: { type: String },
        addresses: [
            {
                street: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String, required: true },
                pincode: { type: String, required: true },
                country: { type: String, required: true, default: 'India' },
                isDefault: { type: Boolean, default: false },
            },
        ],
        wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
