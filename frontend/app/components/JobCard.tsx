'use client';

import { Job } from '../types/job';
import Link from 'next/link';

interface JobCardProps {
  job: Job;
}

const statusColors = {
  'Open': 'bg-green-100 text-green-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Closed': 'bg-gray-100 text-gray-800',
};

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
          {job.status}
        </span>
      </div>
      <p className="text-gray-600 text-sm mt-2">{job.description.substring(0, 100)}...</p>
      <div className="mt-3 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <span className="font-medium">Category:</span> {job.category} | 
          <span className="font-medium ml-2">Location:</span> {job.location}
        </div>
        <Link 
          href={`/jobs/${job._id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}