'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import { api } from '../lib/api';
import { Job } from '../types/job';
import { useAuth } from '../../context/AuthContext';

export default function TradespersonDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  }, [searchTerm, jobs]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await api.getJobs();
      setJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Available Opportunities
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}! Browse and bid on trade requests in your area.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trade-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-trade-primary"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <span className="material-symbols-outlined text-5xl text-gray-400 mb-3">
              work_history
            </span>
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No jobs match your search' : 'No jobs available at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}