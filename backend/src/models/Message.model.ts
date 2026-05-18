import mongoose from 'mongoose';

export interface IMessage {
  jobId: mongoose.Types.ObjectId;
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  message: string;
  bidAmount?: number;
  read: boolean;
  createdAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobRequest',
    required: true,
  },
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  bidAmount: {
    type: Number,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);