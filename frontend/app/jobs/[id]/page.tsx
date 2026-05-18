'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../lib/api';
import { Job } from '../../types/job';

const statusOptions = ['Open', 'In Progress', 'Closed'];
const statusColors = {
    'Open': 'bg-green-100 text-green-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Closed': 'bg-gray-100 text-gray-600',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, token } = useAuth();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [applicationMessage, setApplicationMessage] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [sending, setSending] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadJob();
        if (user) {
            loadMessages();
        }
    }, [params.id, user]);

    useEffect(() => {
        // Scroll to bottom when messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

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

    const loadMessages = async () => {
        try {
            const res = await fetch(`${API_URL}/api/messages/conversation/${params.id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            setMessages(data);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            setUpdating(true);
            const updated = await api.updateStatus(params.id as string, newStatus);
            setJob(updated);

            // Send notification about status change
            await fetch(`${API_URL}/api/messages/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    jobId: params.id,
                    message: `Job status has been updated to: ${newStatus}`,
                }),
            });
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

    const handleSendApplication = async () => {
        if (!applicationMessage.trim()) {
            alert('Please enter a message');
            return;
        }

        setSending(true);
        try {
            const res = await fetch(`${API_URL}/api/messages/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    jobId: params.id,
                    message: applicationMessage,
                    bidAmount: bidAmount ? parseInt(bidAmount) : undefined,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Application sent successfully! The homeowner will be notified.');
                setShowApplyForm(false);
                setApplicationMessage('');
                setBidAmount('');
                loadMessages();
            } else {
                alert(data.message || 'Failed to send application');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error sending application. Please make sure the backend is running.');
        } finally {
            setSending(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const res = await fetch(`${API_URL}/api/messages/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    jobId: params.id,
                    message: newMessage,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setNewMessage('');
                loadMessages();
            } else {
                console.error('Failed to send message:', data);
                alert(data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Error sending message. Please check your connection.');
        }
    };

    // Calculate estimated price in LKR
    const getEstimatedPriceLKR = () => {
        if (job?.budget) return job.budget;
        const prices: Record<string, string> = {
            'Plumbing': '5,000 - 15,000',
            'Electrical': '4,000 - 12,000',
            'Painting': '10,000 - 30,000',
            'Joinery': '8,000 - 25,000',
            'Landscaping': '7,000 - 20,000',
            'Roofing': '15,000 - 40,000',
            'Other': '5,000 - 20,000',
        };
        return prices[job?.category || 'Other'] || '5,000 - 20,000';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
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
                <div className="max-w-5xl mx-auto px-4">
                    {/* Main Job Details */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{job.title}</h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[job.status]}`}>
                                    {job.status}
                                </span>
                            </div>

                            {/* Job Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-500">category</span>
                                    <div>
                                        <p className="text-xs text-gray-500">Category</p>
                                        <p className="font-medium text-gray-900">{job.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-500">location_on</span>
                                    <div>
                                        <p className="text-xs text-gray-500">Location</p>
                                        <p className="font-medium text-gray-900">{job.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-500">currency_rupee</span>
                                    <div>
                                        <p className="text-xs text-gray-500">Estimated Price</p>
                                        <p className="font-medium text-trade-primary text-lg">{getEstimatedPriceLKR()} LKR</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-500">event</span>
                                    <div>
                                        <p className="text-xs text-gray-500">Posted Date</p>
                                        <p className="font-medium text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
                            </div>

                            {/* Contact Information - Only visible to logged in users */}
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium text-gray-700">Name:</span> {job.contactName}</p>
                                    <p><span className="font-medium text-gray-700">Email:</span> {job.contactEmail}</p>
                                </div>
                            </div>

                            {/* Actions for Homeowner */}
                            {user?.role === 'homeowner' && job.userId === user?.id && (
                                <div className="mb-6 pt-4 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Manage Job</h3>
                                    <div className="flex flex-wrap gap-3">
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
                                                Mark as {status}
                                            </button>
                                        ))}
                                        <button
                                            onClick={handleDelete}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                        >
                                            Delete Job
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Apply Button for Tradesperson */}
                            {user?.role === 'tradesperson' && job.status === 'Open' && !showApplyForm && (
                                <div className="pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => setShowApplyForm(true)}
                                        className="w-full bg-green-600 text-white py-3 rounded-lg text-base font-semibold hover:bg-green-700 transition-all"
                                    >
                                        Apply for this Job
                                    </button>
                                </div>
                            )}

                            {/* Application Form */}
                            {showApplyForm && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-gray-900 mb-3">Submit Your Application</h3>
                                    <textarea
                                        placeholder="Introduce yourself, describe your experience, and explain why you're qualified for this job..."
                                        value={applicationMessage}
                                        onChange={(e) => setApplicationMessage(e.target.value)}
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-trade-primary mb-3"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Your bid amount (LKR) - Optional"
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-trade-primary mb-3"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSendApplication}
                                            disabled={sending || !applicationMessage.trim()}
                                            className="flex-1 bg-trade-primary text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                                        >
                                            {sending ? 'Sending...' : 'Send Application'}
                                        </button>
                                        <button
                                            onClick={() => setShowApplyForm(false)}
                                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Messages Section - Show if there's an existing conversation */}
                    {messages.length > 0 && (
                        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-900">Conversation</h3>
                            </div>

                            <div id="messages-container" className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[400px]">
                                {messages.map((msg, idx) => {
                                    const isFromMe = msg.fromUserId._id === user?.id;
                                    return (
                                        <div
                                            key={idx}
                                            className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[70%] ${isFromMe ? 'order-2' : 'order-1'}`}>
                                                <div className={`rounded-lg p-3 ${isFromMe
                                                        ? 'bg-trade-primary text-white'
                                                        : 'bg-gray-100 text-gray-900'
                                                    }`}>
                                                    <p className="text-sm">{msg.message}</p>
                                                    {msg.bidAmount && (
                                                        <p className={`text-xs mt-1 ${isFromMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                                            Bid: LKR {msg.bidAmount.toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className={`text-xs text-gray-400 mt-1 ${isFromMe ? 'text-right' : 'text-left'}`}>
                                                    {formatDate(msg.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 border-t border-gray-200">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type your message..."
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-trade-primary"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                        className="bg-trade-primary text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-trade-primary transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}