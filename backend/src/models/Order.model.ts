import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    orderItems: {
        product: mongoose.Types.ObjectId;
        productName: string;
        variantSku: string;
        quantity: number;
        price: number;
        image: string;
    }[];
    shippingAddress: {
        firstName: string;
        lastName: string;
        phone: string;
        email?: string;
        street: string;
        flatNo?: string;
        landmark?: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    paymentMethod: string;
    paymentResult?: {
        id: string;
        status: string;
        update_time: string;
        email_address: string;
    };
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: Date;
    razorpayOrderId?: string;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        orderItems: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                productName: { type: String, required: true },
                variantSku: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                image: { type: String, required: true },
            },
        ],
        shippingAddress: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String },
            street: { type: String, required: true },
            flatNo: { type: String },
            landmark: { type: String },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            country: { type: String, required: true, default: 'India' },
        },
        paymentMethod: { type: String, required: true },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        itemsPrice: { type: Number, required: true, default: 0.0 },
        taxPrice: { type: Number, required: true, default: 0.0 }, // GST mostly
        shippingPrice: { type: Number, required: true, default: 0.0 },
        totalPrice: { type: Number, required: true, default: 0.0 },
        isPaid: { type: Boolean, required: true, default: false, index: true },
        paidAt: { type: Date },
        razorpayOrderId: { type: String, index: true },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
            default: 'Pending',
            index: true,
        },
        deliveredAt: { type: Date },
    },
    { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);
