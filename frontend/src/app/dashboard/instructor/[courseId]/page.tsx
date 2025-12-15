'use client';
import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Course } from '@/app/types';
import { Input, TextArea } from '../../../components/FormElements';

interface Lesson {
  id: number;
  title: string;
  content: string;
}

export default function ManageCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lesson Form State
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [submittingLesson, setSubmittingLesson] = useState(false);

  const fetchCourseData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: token || '' };

      // Fetch Course
      const courseRes = await fetch(`http://localhost:4000/api/courses/${courseId}`, { headers });
      if (courseRes.ok) {
        const data = await courseRes.json();
        setCourse(data.course);
      } else {
        throw new Error('Failed to fetch course');
      }

      // Fetch Lessons
      const lessonsRes = await fetch(`http://localhost:4000/api/courses/${courseId}/lessons`, { headers });
      if (lessonsRes.ok) {
        const data = await lessonsRes.json();
        setLessons(data.lessons || []);
      }
    } catch (error) {
      console.error(error);
      // alert('Error loading course data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && role === 'INSTRUCTOR') {
      fetchCourseData();
    } else if(!isAuthenticated) {
        setLoading(false);
    }
  }, [isAuthenticated, role, courseId]);

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLesson(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || '',
        },
        body: JSON.stringify({ title: lessonTitle, content: lessonContent }),
      });

      if (res.ok) {
        setLessonTitle('');
        setLessonContent('');
        setShowLessonForm(false);
        fetchCourseData(); // Refresh list
      } else {
        alert('Failed to add lesson');
      }
    } catch (error) {
      console.error(error);
      alert('Error adding lesson');
    } finally {
      setSubmittingLesson(false);
    }
  };

  if (!isAuthenticated || role !== 'INSTRUCTOR') {
      return <div className="p-8 text-center">Access Restricted</div>;
  }

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!course) return <div className="p-12 text-center">Course not found</div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
           <p className="text-gray-500">Manage Course Content</p>
        </div>
        <button
            onClick={() => router.push('/dashboard')}
            className="text-cornflower-blue-600 font-medium hover:underline"
        >
            Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar / Course Info */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-cornflower-blue-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Course Details</h2>
                <div className="mb-4">
                    <span className="text-sm text-gray-500 uppercase font-semibold">Description</span>
                    <p className="text-gray-700 mt-1">{course.description}</p>
                </div>
            </div>
        </div>

        {/* Main Content / Lessons */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-cornflower-blue-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Lessons ({lessons.length})</h2>
                    <button
                        onClick={() => setShowLessonForm(!showLessonForm)}
                        className="bg-cornflower-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cornflower-blue-700 transition-colors"
                    >
                        {showLessonForm ? 'Cancel' : 'Add New Lesson'}
                    </button>
                </div>

                {showLessonForm && (
                     <form onSubmit={handleAddLesson} className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-md font-bold text-gray-900 mb-4">New Lesson</h3>
                        <Input 
                            label="Title" 
                            value={lessonTitle}
                            onChange={(e) => setLessonTitle(e.target.value)}
                            required
                        />
                        <TextArea
                            label="Content"
                            value={lessonContent}
                            onChange={(e) => setLessonContent(e.target.value)}
                            required
                            placeholder="Enter lesson content here (Markdown supported)..."
                        />
                         <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submittingLesson}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {submittingLesson ? 'Saving...' : 'Save Lesson'}
                            </button>
                        </div>
                     </form>
                )}

                <div className="space-y-4">
                    {lessons.length === 0 ? (
                        <p className="text-gray-500 italic">No lessons yet.</p>
                    ) : (
                        lessons.map((lesson, index) => (
                            <div key={lesson.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                                 <div>
                                    <span className="text-sm font-mono text-gray-500 mr-2">#{index + 1}</span>
                                    <span className="font-medium text-gray-900">{lesson.title}</span>
                                 </div>
                                 {/* <button className="text-gray-400 hover:text-cornflower-blue-600">Edit</button> */}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
