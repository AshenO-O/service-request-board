'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ProfilePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [] as string[],
    role: '',
    createdAt: '',
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProfile({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        bio: data.bio || '',
        skills: data.skills || [],
        role: data.role || '',
        createdAt: data.createdAt || new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          location: profile.location,
          bio: profile.bio,
          skills: profile.skills,
        }),
      });
      
      if (res.ok) {
        setIsEditing(false);
        alert('Profile updated successfully!');
        // Update local storage user name
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.name = profile.name;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skill),
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-trade-primary"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-trade-primary to-trade-primary-light px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-trade-primary">
                  {profile.role === 'tradesperson' ? 'construction' : 'home'}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                <p className="text-blue-100">
                  {profile.role === 'tradesperson' ? 'Tradesperson' : 'Homeowner'} 
                  {' • Member since ' + new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-trade-primary hover:text-trade-primary-light text-sm font-medium flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 text-sm bg-trade-primary text-white rounded hover:opacity-90"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-trade-primary"
                  />
                ) : (
                  <p className="text-gray-900">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <p className="text-gray-500">{profile.email}</p>
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-trade-primary"
                    placeholder="Add your phone number"
                  />
                ) : (
                  <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-trade-primary"
                    placeholder="e.g., London, UK"
                  />
                ) : (
                  <p className="text-gray-900">{profile.location || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-trade-primary"
                    placeholder="Tell about yourself..."
                  />
                ) : (
                  <p className="text-gray-900">{profile.bio || 'No bio added yet'}</p>
                )}
              </div>

              {profile.role === 'tradesperson' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills & Expertise</label>
                  {isEditing ? (
                    <div>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-trade-primary"
                          placeholder="Add a skill (e.g., Plumbing)"
                        />
                        <button
                          onClick={addSkill}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill) => (
                          <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="hover:text-red-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.length > 0 ? (
                        profile.skills.map((skill) => (
                          <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No skills added yet</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}