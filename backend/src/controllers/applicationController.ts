import { Request, Response } from 'express';
import { Application } from '../models/Application.model';
import { JobRequest } from '../models/JobRequest.model';
import { Notification } from '../models/Notification.model';

export const applyToJob = async (req: Request, res: Response) => {
  try {
    const { jobId, message, bidAmount } = req.body;
    const tradespersonId = req.user?.id;

    // Check if already applied
    const existingApplication = await Application.findOne({ jobId, tradespersonId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = await Application.create({
      jobId,
      tradespersonId,
      message,
      bidAmount,
      status: 'pending',
    });

    // Get job details for notification
    const job = await JobRequest.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Create notification for homeowner
    await Notification.create({
      userId: job.userId,
      title: 'New Application Received',
      message: `A tradesperson has applied to your job "${job.title}"`,
      type: 'application',
      relatedId: application._id,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find({ tradespersonId: req.user?.id })
      .populate('jobId')
      .sort({ createdAt: -1 });
    
    // Transform the data to include job title safely
    const formattedApplications = applications.map(app => {
      const job = app.jobId as any;
      return {
        id: app._id,
        jobId: app.jobId,
        jobTitle: job?.title || 'Unknown Job',
        jobLocation: job?.location || 'Unknown Location',
        message: app.message,
        bidAmount: app.bidAmount,
        status: app.status,
        createdAt: app.createdAt,
      };
    });
    
    res.json(formattedApplications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const acceptApplication = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Get job details
    const job = await JobRequest.findById(application.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Update application status
    application.status = 'accepted';
    await application.save();

    // Update job status to In Progress
    job.status = 'In Progress';
    await job.save();

    // Create notification for tradesperson
    await Notification.create({
      userId: application.tradespersonId,
      title: 'Application Accepted!',
      message: `Your application for "${job.title}" has been accepted`,
      type: 'application_accepted',
      relatedId: application._id,
    });

    res.json({
      success: true,
      message: 'Application accepted successfully',
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getJobApplications = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    
    const applications = await Application.find({ jobId })
      .populate('tradespersonId', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};