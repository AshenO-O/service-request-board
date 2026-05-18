import mongoose from 'mongoose';

export interface IApplication {
  jobId: mongoose.Types.ObjectId;
  tradespersonId: mongoose.Types.ObjectId;
  message: string;
  bidAmount?: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

const applicationSchema = new mongoose.Schema<IApplication>({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobRequest',
    required: true,
  },
  tradespersonId: {
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
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Application = mongoose.model<IApplication>('Application', applicationSchema);