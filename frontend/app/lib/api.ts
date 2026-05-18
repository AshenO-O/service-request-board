import { Job, CreateJobData } from '../types/job';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const getHeaders = () => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  async getJobs(filters?: { category?: string; status?: string }): Promise<Job[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    
    const res = await fetch(`${API_URL}/api/jobs?${params}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async getMyJobs(): Promise<Job[]> {
    const res = await fetch(`${API_URL}/api/jobs/my-jobs`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch your jobs');
    return res.json();
  },

  async getJob(id: string): Promise<Job> {
    const res = await fetch(`${API_URL}/api/jobs/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch job');
    return res.json();
  },

  async createJob(data: CreateJobData): Promise<Job> {
    const res = await fetch(`${API_URL}/api/jobs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create job');
    }
    return res.json();
  },

  async updateStatus(id: string, status: string): Promise<Job> {
    const res = await fetch(`${API_URL}/api/jobs/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  async deleteJob(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/jobs/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete job');
  },
};