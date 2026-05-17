'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import JobCard from './components/JobCard';
import JobFilters from './components/JobFilters';
import { api } from './lib/api';
import { Job } from './types/job';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobs();
  }, [selectedCategory]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const filters: { category?: string } = {};
      if (selectedCategory) filters.category = selectedCategory;
      const data = await api.getJobs(filters);
      setJobs(data);
      setError('');
    } catch (err) {
      setError('Failed to load jobs. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Service Request Board</h1>
          <Link
            href="/jobs/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Job Request
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <JobFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading jobs...</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && (
          <>
            {jobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500 text-lg">No job requests found</p>
                <Link
                  href="/jobs/new"
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                >
                  Create the first job request →
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}