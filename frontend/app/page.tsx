'use client';

import { useEffect, useState } from 'react';
import Header from './components/Header';
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
    <>
      <Header />
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Available Opportunities
          </h1>
          <p className="text-lg text-gray-600">
            Find and bid on trade requests in your local area.
          </p>
        </div>

        {/* Filters */}
        <JobFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-trade-primary"></div>
            <p className="mt-2 text-gray-600">Loading opportunities...</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && (
          <>
            {jobs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <span className="material-symbols-outlined text-5xl text-gray-400 mb-3">
                  work_history
                </span>
                <p className="text-gray-600 text-lg mb-4">No job requests found</p>
                <button
                  onClick={() => window.location.href = '/jobs/new'}
                  className="text-trade-primary hover:text-trade-primary-light font-semibold inline-flex items-center gap-1"
                >
                  Post the first job request →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}