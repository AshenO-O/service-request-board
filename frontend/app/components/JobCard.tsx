'use client';

import { Job } from '../types/job';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

interface JobCardProps {
  job: Job;
  onApply?: () => void;
}

const statusColors = {
  'Open': 'bg-green-100 text-green-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Closed': 'bg-gray-100 text-gray-600',
};

export default function JobCard({ job, onApply }: JobCardProps) {
  const { user } = useAuth();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [message, setMessage] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [applying, setApplying] = useState(false);
  
  const formattedDate = new Date(job.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Convert budget to LKR
  const budgetLKR = job.budget || '10000 - 30000';
  const estimatedPrice = budgetLKR;

  const handleApplySubmit = async () => {
    if (!user || !message.trim()) return;
    
    setApplying(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/api/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: job._id,
          message: message,
          bidAmount: bidAmount ? parseInt(bidAmount) : undefined,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert('Your application has been sent to the homeowner!');
        setShowApplyForm(false);
        setMessage('');
        setBidAmount('');
        if (onApply) onApply();
      } else {
        alert(data.message || 'Failed to send application');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending application. Please make sure the backend is running.');
    }
    setApplying(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">location_on</span>
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">event</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">category</span>
              <span>{job.category}</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
          {job.status}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {job.description}
      </p>
      
      <div className="flex justify-between items-center mb-4 pt-3 border-t border-gray-100">
        <div>
          <span className="text-xl font-bold text-trade-primary">{estimatedPrice}</span>
          <span className="text-sm text-gray-500 ml-1">LKR</span>
        </div>
        
        <Link
          href={`/jobs/${job._id}`}
          className="text-trade-primary hover:text-trade-primary-light text-sm font-semibold flex items-center gap-1"
        >
          View Full Details
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
      
      {user?.role === 'tradesperson' && job.status === 'Open' && !showApplyForm && (
        <button
          onClick={() => setShowApplyForm(true)}
          className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-all"
        >
          Apply for this Job
        </button>
      )}
      
      {showApplyForm && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Send Application</h4>
          <textarea
            placeholder="Introduce yourself and explain why you're qualified for this job..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-trade-primary mb-3"
          />
          <input
            type="number"
            placeholder="Your bid amount (LKR) - Optional"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-trade-primary mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleApplySubmit}
              disabled={applying || !message.trim()}
              className="flex-1 bg-trade-primary text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {applying ? 'Sending...' : 'Send Application'}
            </button>
            <button
              onClick={() => setShowApplyForm(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}