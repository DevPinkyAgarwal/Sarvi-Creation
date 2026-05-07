import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
    message: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
    {
        message: {
            type: String,
            required: [true, 'Announcement message is required'],
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// If an announcement is set to active, you might want to deactivate others. 
// We'll handle this logic in the controller.

export const Announcement = mongoose.model<IAnnouncement>('Announcement', announcementSchema);
