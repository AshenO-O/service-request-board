'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import { api } from '../../lib/api';
import { Job } from '../../types/job';

const statusOptions = ['Open', 'In Progress', 'Closed'];
const statusColors = {
  'Open': 'bg-green-100 text-green-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Closed': 'bg-gray-100 text-gray-600',
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJob();
  }, []);

  const loadJob = async () => {
    try {
      setLoading(true);
      const data = await api.getJob(params.id as string);
      setJob(data);
      setError('');
    } catch (err) {
      setError('Job not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdating(true);
      const updated = await api.updateStatus(params.id as string, newStatus);
      setJob(updated);
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job request?')) return;
    
    try {
      await api.deleteJob(params.id as string);
      router.push('/');
    } catch (err) {
      alert('Failed to delete job');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-trade-primary"></div>
            <p className="mt-2 text-gray-600">Loading job details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !job) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-8 pt-24">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error || 'Job not found'}
            </div>
            <Link href="/" className="inline-block mt-4 text-trade-primary hover:text-trade-primary-light">
              ← Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[job.status]}`}>
                {job.status}
              </span>
            </div>

            <div className="border-t border-b border-gray-100 py-4 my-4">
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>

            <div className="space-y-2">
              <p><span className="font-medium text-gray-700">Category:</span> {job.category}</p>
              <p><span className="font-medium text-gray-700">Location:</span> {job.location}</p>
              <p><span className="font-medium text-gray-700">Contact Name:</span> {job.contactName}</p>
              <p><span className="font-medium text-gray-700">Contact Email:</span> {job.contactEmail}</p>
              <p><span className="font-medium text-gray-700">Created:</span> {new Date(job.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Status Update Section */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <label className="block text-gray-700 font-medium mb-2">Update Status</label>
              <div className="flex gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updating || job.status === status}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${job.status === status
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-trade-primary text-white hover:opacity-90'
                      }
                      disabled:opacity-50
                    `}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <Link
                href="/"
                className="flex-1 text-center bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ← Back to List
              </Link>
              <button
                onClick={handleDelete}
                className="px-6 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}