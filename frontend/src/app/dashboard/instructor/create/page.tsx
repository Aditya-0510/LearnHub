'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input, TextArea } from '../../../components/FormElements';

export default function CreateCoursePage() {
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Simple auth check/redirect could be better handled by a HOC or Middleware
  if (!isAuthenticated || role !== 'INSTRUCTOR') {
      // Just return null or simple message, useEffect will handle redirect if we added one, 
      // but for now relying on the user being responsible or the layout. 
      // Ideally we'd redirect here.
      if (typeof window !== 'undefined' && !isAuthenticated) router.push('/auth/login');
      if (typeof window !== 'undefined' && isAuthenticated && role !== 'INSTRUCTOR') router.push('/dashboard');
      return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || '',
        },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        throw new Error('Failed to create course');
      }

      const data = await res.json();
      router.push(`/dashboard/instructor/${data.course.id}`);
    } catch (error) {
      console.error(error);
      alert('Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Course</h1>
      <div className="bg-white shadow-sm border border-cornflower-blue-100 rounded-xl p-8">
        <form onSubmit={handleSubmit}>
          <Input
            label="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g., Advanced React Patterns"
          />
          <TextArea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe what students will learn..."
          />
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="mr-4 px-6 py-2 text-gray-700 font-medium hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-cornflower-blue-600 text-white rounded-lg font-medium hover:bg-cornflower-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
