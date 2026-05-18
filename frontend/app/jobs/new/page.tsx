'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import { api } from '../../lib/api';

const categories = ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Landscaping', 'Roofing', 'Other'];

export default function NewJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Plumbing',
        location: '',
        contactName: '',
        contactEmail: '',
        phone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            console.log('Creating job with token:', token ? 'Token exists' : 'No token');
            console.log('Form data:', formData);

            const result = await api.createJob(formData);
            console.log('Job created:', result);

            alert('Job created successfully!');
            router.push('/');
        } catch (err: any) {
            console.error('Create job error:', err);
            setError(err.message || 'Failed to create job. Please check all fields.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <main className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Post a New Service Request
                    </h1>
                    <p className="text-lg text-gray-600">
                        Connect with qualified local tradespeople by providing details about your project.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Job Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">
                                    Job Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-trade-primary focus:border-transparent"
                                    placeholder="e.g., Fix leaking kitchen faucet"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    A concise title helps experts find your request faster.
                                </p>
                            </div>

                            {/* Category and Location Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-trade-primary focus:border-transparent"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                                        Location <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-trade-primary focus:border-transparent"
                                        placeholder="Street address or city"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">
                                    Detailed Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    required
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-trade-primary focus:border-transparent"
                                    placeholder="Describe the problem, the required outcome, and any specific requirements or materials you have already purchased..."
                                />
                            </div>

                            {/* Contact Information Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-1">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="contactName"
                                            required
                                            value={formData.contactName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-trade-primary focus:border-transparent"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-1">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            required
                                            value={formData.contactEmail}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-trade-primary focus:border-transparent"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-1">
                                            Phone Number (Optional)
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-trade-primary focus:border-transparent"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <Link
                                    href="/"
                                    className="flex-1 text-center px-6 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-trade-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Posting...' : 'Post Job'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar Tips */}
                    <div className="space-y-6">
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Why Post on TradeConnect?</h3>
                            <ul className="space-y-3">
                                <li className="flex gap-2 text-sm">
                                    <span className="material-symbols-outlined text-blue-900 text-lg">verified_user</span>
                                    <span className="text-gray-700">Verified professionals with background checks and customer ratings.</span>
                                </li>
                                <li className="flex gap-2 text-sm">
                                    <span className="material-symbols-outlined text-blue-900 text-lg">payments</span>
                                    <span className="text-gray-700">Secure payment system held in escrow until you're satisfied with the work.</span>
                                </li>
                                <li className="flex gap-2 text-sm">
                                    <span className="material-symbols-outlined text-blue-900 text-lg">support_agent</span>
                                    <span className="text-gray-700">Dedicated 24/7 customer support for every step of your project.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Posting Tips</h3>
                            <p className="text-sm text-gray-600 mb-3">A great job description increases your response rate by up to 40%.</p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="material-symbols-outlined text-green-600 text-base">check_circle</span>
                                    Mention the specific tools needed
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="material-symbols-outlined text-green-600 text-base">check_circle</span>
                                    Specify your preferred start date
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="material-symbols-outlined text-green-600 text-base">check_circle</span>
                                    Upload photos if possible
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}