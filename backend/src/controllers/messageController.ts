import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Message } from '../models/Message.model';
import { JobRequest } from '../models/JobRequest.model';
import { Notification } from '../models/Notification.model';
import { User } from '../models/User.model';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { jobId, message, bidAmount } = req.body;
    const fromUserId = req.user?.id;

    console.log('Send message request:', { jobId, message, bidAmount, fromUserId });

    if (!fromUserId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!jobId || !message) {
      return res.status(400).json({ message: 'Job ID and message are required' });
    }

    // Get job details
    const job = await JobRequest.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    console.log('Job found:', { jobId: job._id, userId: job.userId });

    // If job doesn't have userId, find the user by contactEmail
    let toUserId = job.userId;
    
    if (!toUserId) {
      // Find the homeowner by email from the job
      const homeowner = await User.findOne({ email: job.contactEmail });
      if (homeowner) {
        toUserId = homeowner._id;
        // Update the job with the userId for future messages
        job.userId = homeowner._id;
        await job.save();
        console.log('Updated job with userId:', toUserId);
      } else {
        return res.status(404).json({ message: 'Homeowner not found for this job' });
      }
    }

    // Convert to ObjectId safely
    const jobObjectId = typeof jobId === 'string' ? new mongoose.Types.ObjectId(jobId) : jobId;
    const fromUserObjectId = new mongoose.Types.ObjectId(fromUserId);
    const toUserObjectId = toUserId;

    const newMessage = await Message.create({
      jobId: jobObjectId,
      fromUserId: fromUserObjectId,
      toUserId: toUserObjectId,
      message: message,
      bidAmount: bidAmount || undefined,
    });

    console.log('Message created:', newMessage._id);

    // Create notification for the recipient
    await Notification.create({
      userId: toUserObjectId,
      title: 'New Message Received',
      message: `Someone has messaged you about "${job.title}"`,
      type: 'message',
      relatedId: newMessage._id,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

export const getConversation = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Convert to ObjectId safely
    const jobObjectId = typeof jobId === 'string' ? new mongoose.Types.ObjectId(jobId) : jobId;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const messages = await Message.find({
      jobId: jobObjectId,
      $or: [
        { fromUserId: userObjectId },
        { toUserId: userObjectId },
      ],
    })
      .populate('fromUserId', 'name role')
      .populate('toUserId', 'name role')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { toUserId: userObjectId, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { fromUserId: userObjectId },
            { toUserId: userObjectId },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$jobId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$toUserId', userObjectId] }, { $eq: ['$read', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // Populate job details
    const populatedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const job = await JobRequest.findById(conv._id);
        return {
          jobId: conv._id,
          jobTitle: job?.title || 'Unknown Job',
          lastMessage: conv.lastMessage.message,
          lastMessageDate: conv.lastMessage.createdAt,
          unreadCount: conv.unreadCount,
        };
      })
    );

    res.json(populatedConversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};