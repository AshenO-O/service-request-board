import mongoose from 'mongoose';

export interface INotification {
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'application' | 'application_accepted' | 'status_update' | 'message';
    read: boolean;
    relatedId?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['application', 'application_accepted', 'status_update', 'message'],
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);