import mongoose from 'mongoose';

export interface IJobRequest {
  title: string;
  description: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: Date;
}

const jobRequestSchema = new mongoose.Schema<IJobRequest>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  contactName: {
    type: String,
    required: [true, 'Contact name is required'],
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const JobRequest = mongoose.model<IJobRequest>('JobRequest', jobRequestSchema);