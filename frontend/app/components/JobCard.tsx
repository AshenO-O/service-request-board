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

const categoryIcons: Record<string, string> = {
  'Plumbing': 'plumbing',
  'Electrical': 'electrical_services',
  'Painting': 'brush',
  'Joinery': 'carpenter',
  'Other': 'handyman',
};

export default function JobCard({ job }: JobCardProps) {
  const formattedDate = new Date(job.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });

  const budget = job.budget || '£100 - £300';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="material-symbols-outlined text-base">location_on</span>
            <span>{job.location}</span>
            <span className="text-gray-300">|</span>
            <span className="material-symbols-outlined text-base">event</span>
            <span>{formattedDate}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
          {job.status}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {job.description.substring(0, 100)}...
      </p>
      
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-blue-900 text-lg">price_check</span>
          <span className="text-lg font-bold text-blue-900">{budget}</span>
        </div>
        <Link
          href={`/jobs/${job._id}`}
          className="text-blue-900 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
        >
          View Details
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}