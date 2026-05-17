'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const showNotification = () => {
    router.push('/notifications');
  };

  const showProfile = () => {
    router.push('/profile');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-trade-primary">
            TradeConnect
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <button 
              onClick={() => handleNavigation('/')}
              className="text-gray-700 font-medium hover:text-trade-primary transition-all"
            >
              Find Work
            </button>
            <button 
              onClick={() => handleNavigation('/my-jobs')}
              className="text-gray-700 font-medium hover:text-trade-primary transition-all"
            >
              My Jobs
            </button>
            <button 
              onClick={() => handleNavigation('/messages')}
              className="text-gray-700 font-medium hover:text-trade-primary transition-all"
            >
              Messages
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative items-center">
            <span className="material-symbols-outlined absolute left-3 text-gray-400 text-lg">search</span>
            <input 
              type="text" 
              placeholder="Search services..." 
              className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-trade-primary focus:ring-1 focus:ring-trade-primary"
            />
          </div>
          <button 
            onClick={() => handleNavigation('/jobs/new')}
            className="bg-trade-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-trade-primary-light transition-all shadow-sm"
          >
            Post a Job
          </button>
          <div className="flex gap-1">
            <button 
              onClick={showNotification}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={showProfile}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}