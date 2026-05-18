export interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: string;
  budget?: string;
  userId?: string;  
}

export interface CreateJobData {
  title: string;
  description: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
  phone?: string;
}