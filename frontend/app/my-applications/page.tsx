'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  jobLocation: string;
  message: string;
  bidAmount?: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sample applications data - In real app, fetch from backend
    setApplications([
      {
        id: '1',
        jobId: 'job1',
        jobTitle: 'fridge repair',
        jobLocation: 'colombo',
        message: 'I have 5 years experience in fridge repair',
        bidAmount: 150,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        jobId: 'job2',
        jobTitle: 'pipe leaking',
        jobLocation: 'colombo',
        message: 'I can fix this within 2 hours',
        bidAmount: 80,
        status: 'accepted',
        createdAt: new Date().toISOString(),
      },
    ]);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track your submitted job applications</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-trade-primary"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <span className="material-symbols-outlined text-5xl text-gray-400 mb-3">
              description
            </span>
            <p className="text-gray-600 text-lg mb-4">You haven't applied to any jobs yet</p>
            <Link 
              href="/"
              className="bg-trade-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 inline-block"
            >
              Browse Available Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{app.jobTitle}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span className="material-symbols-outlined text-base">location_on</span>
                      <span>{app.jobLocation}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{app.message}</p>
                
                {app.bidAmount && (
                  <div className="flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-trade-primary text-lg">price_check</span>
                    <span className="text-lg font-bold text-trade-primary">£{app.bidAmount}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                  <Link
                    href={`/jobs/${app.jobId}`}
                    className="text-trade-primary hover:text-trade-primary-light text-sm font-semibold"
                  >
                    View Job Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}