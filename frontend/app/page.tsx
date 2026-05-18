'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Header from './components/Header';
import JobCard from './components/JobCard';
import { api } from './lib/api';
import { Job } from './types/job';

export default function Home() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  // Listen for search updates from Header
  useEffect(() => {
    const handleSearchUpdate = (event: CustomEvent) => {
      setSearchTerm(event.detail);
    };

    window.addEventListener('searchUpdate', handleSearchUpdate as EventListener);
    return () => {
      window.removeEventListener('searchUpdate', handleSearchUpdate as EventListener);
    };
  }, []);

  // Filter jobs in real-time when search term changes
  useEffect(() => {
    if (user?.role === 'tradesperson' && jobs.length > 0) {
      if (searchTerm.trim()) {
        const filtered = jobs.filter(job =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredJobs(filtered);
      } else {
        setFilteredJobs(jobs);
      }
    } else {
      setFilteredJobs(jobs);
    }
  }, [searchTerm, jobs, user]);

  const loadJobs = async () => {
    try {
      setLoading(true);

      let data;
      if (user?.role === 'homeowner') {
        // For homeowners, get jobs they posted
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/jobs/my-jobs`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        data = await res.json();
      } else {
        // For tradespeople, get all open jobs
        data = await api.getJobs();
      }

      setJobs(Array.isArray(data) ? data : []);
      setFilteredJobs(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Failed to load jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmitted = () => {
    loadJobs();
    alert('Application submitted successfully! The homeowner will be notified.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-trade-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayJobs = filteredJobs;

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.role === 'homeowner' ? 'My Job Requests' : 'Available Opportunities'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'homeowner'
              ? 'Track and manage your posted service requests'
              : 'Find and apply to trade requests in your local area'}
          </p>
        </div>

        {/* Search Results Info - Only for tradesperson */}
        {user?.role === 'tradesperson' && searchTerm && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg flex justify-between items-center">
            <span className="text-sm text-gray-700">
              🔍 Found {displayJobs.length} result{displayJobs.length !== 1 ? 's' : ''} for "<strong>{searchTerm}</strong>"
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                window.dispatchEvent(new CustomEvent('searchUpdate', { detail: '' }));
                setFilteredJobs(jobs);
              }}
              className="text-sm text-trade-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-trade-primary"></div>
            <p className="mt-2 text-gray-600">Loading jobs...</p>
          </div>
        ) : displayJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <span className="material-symbols-outlined text-5xl text-gray-400 mb-3">
              work_history
            </span>
            <p className="text-gray-600 text-lg mb-4">
              {user?.role === 'homeowner'
                ? "You haven't posted any jobs yet"
                : searchTerm
                  ? `No jobs found matching "${searchTerm}"`
                  : 'No job requests available at the moment'}
            </p>
            {user?.role === 'homeowner' && (
              <button
                onClick={() => router.push('/jobs/new')}
                className="bg-trade-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
              >
                Post Your First Job
              </button>
            )}
            {user?.role === 'tradesperson' && searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  window.dispatchEvent(new CustomEvent('searchUpdate', { detail: '' }));
                  setFilteredJobs(jobs);
                }}
                className="text-trade-primary hover:underline"
              >
                Clear search and show all jobs
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onApply={handleApplicationSubmitted}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}