import { Request, Response } from 'express';
import { JobRequest } from '../models/JobRequest.model';

export const getJobs = async (req: Request, res: Response) => {
  try {
    const { category, status } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMyJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await JobRequest.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;

    if (!title || !description || !category || !location || !contactName || !contactEmail) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log('Creating job for user:', req.user.id);

    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
      userId: req.user.id,  // This must be present
    });

    console.log('Job created with userId:', job.userId);
    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(400).json({ message: 'Invalid data', error });
  }
};

export const updateJobStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!status || !['Open', 'In Progress', 'Closed'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};