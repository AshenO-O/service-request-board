'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import { api } from '../lib/api';
import { Job } from '../types/job';
import Link from 'next/link';

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await api.getJobs();
      setJobs(data);
      setError('');
    } catch (err) {
      setError('Failed to load your jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-trade-primary"></div>
            <p className="mt-2 text-gray-600">Loading your jobs...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
          <p className="text-gray-600">Track and manage your posted service requests</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <span className="material-symbols-outlined text-5xl text-gray-400 mb-3">work_history</span>
            <p className="text-gray-600 text-lg mb-4">You haven't posted any jobs yet</p>
            <Link 
              href="/jobs/new"
              className="bg-trade-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 inline-block"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}