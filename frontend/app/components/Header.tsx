'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 max-w-[1280px] mx-auto bg-white border-b border-gray-200">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold text-blue-900">
          TradeConnect
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-gray-600 font-medium hover:text-blue-900 transition-all">
            Find Work
          </Link>
          <Link href="/my-jobs" className="text-gray-600 font-medium hover:text-blue-900 transition-all">
            My Jobs
          </Link>
          <Link href="/messages" className="text-gray-600 font-medium hover:text-blue-900 transition-all">
            Messages
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative items-center">
          <span className="material-symbols-outlined absolute left-3 text-gray-500 text-xl">search</span>
          <input
            type="text"
            placeholder="Search services..."
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-900"
          />
        </div>
        <button
          onClick={() => router.push('/jobs/new')}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
        >
          Post a Job
        </button>
        <div className="flex gap-2">
          <span className="material-symbols-outlined text-gray-600 cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors">
            notifications
          </span>
          <span className="material-symbols-outlined text-gray-600 cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors">
            account_circle
          </span>
        </div>
      </div>
    </header>
  );
}