import { Job, CreateJobData } from '../types/job';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  // Get all jobs with optional filters
  async getJobs(filters?: { category?: string; status?: string }): Promise<Job[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    
    const res = await fetch(`${API_URL}/api/jobs?${params}`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  // Get single job
  async getJob(id: string): Promise<Job> {
    const res = await fetch(`${API_URL}/api/jobs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch job');
    return res.json();
  },

  // Create new job
  async createJob(data: CreateJobData): Promise<Job> {
    const res = await fetch(`${API_URL}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create job');
    return res.json();
  },

  // Update job status
  async updateStatus(id: string, status: string): Promise<Job> {
    const res = await fetch(`${API_URL}/api/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  // Delete job
  async deleteJob(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/jobs/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete job');
  },
};