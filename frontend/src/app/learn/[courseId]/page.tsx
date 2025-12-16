'use client';
import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Course } from '../../types';

interface Lesson {
  id: number;
  title: string;
  content: string;
}

export default function LessonViewerPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: token || '' };

        // 1. Fetch Course details (for title) - Optional, but nice
        // Actually, let's just fetch lessons. API checks enrollment.
        
        // Fetch Lessons
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons`, { headers });
        
        if (res.status === 403 || res.status === 404) {
             setError("You are not enrolled in this course or it doesn't exist.");
             setLoading(false);
             return;
        }

        if (!res.ok) throw new Error('Failed to load lessons');

        const data = await res.json();
        const sortedLessons = data.lessons || []; 
        // Ideally sorting by ID or an order field. Assuming ID for now.
        
        setLessons(sortedLessons);
        if (sortedLessons.length > 0) {
          setCurrentLesson(sortedLessons[0]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load content.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, isAuthenticated]);

  if (!isAuthenticated) {
     if(typeof window !== 'undefined') router.push('/auth/login');
     return null;
  }

  if (loading) return <div className="min-h-screen flex text-center justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cornflower-blue-600"></div></div>;

  if (error) {
       return (
           <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
               <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
               <button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-cornflower-blue-600 text-white px-6 py-2 rounded-lg hover:bg-cornflower-blue-700"
                >
                   Return to Dashboard
               </button>
           </div>
       )
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* Sidebar - Lesson List */}
      <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col overflow-y-auto hidden md:flex">
         <div className="p-6 border-b border-gray-200">
             <button 
                onClick={() => router.push('/dashboard')} 
                className="text-sm text-gray-500 hover:text-cornflower-blue-600 mb-2 flex items-center"
             >
                 &larr; Back to Dashboard
             </button>
             <h2 className="text-lg font-bold text-gray-900">Course Content</h2>
         </div>
         <div className="flex-1 p-4 space-y-2">
             {lessons.map((lesson, idx) => (
                 <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                        currentLesson?.id === lesson.id 
                        ? 'bg-cornflower-blue-100 text-cornflower-blue-900 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                 >
                     <span className="mr-2 text-gray-400">{(idx + 1).toString().padStart(2, '0')}</span>
                     {lesson.title}
                 </button>
             ))}
             {lessons.length === 0 && <p className="text-xs text-gray-400 p-2">No lessons available.</p>}
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12">
           {currentLesson ? (
               <div className="max-w-4xl mx-auto">
                   <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
                       {currentLesson.title}
                   </h1>
                   <div className="prose prose-blue max-w-none text-gray-800">
                       {/* Basic rendering. For real markdown, use react-markdown */}
                       {currentLesson.content.split('\n').map((line, i) => (
                           <p key={i} className="mb-4 whitespace-pre-wrap">{line}</p>
                       ))}
                   </div>
               </div>
           ) : (
               <div className="flex items-center justify-center h-full text-gray-500">
                   Select a lesson to start learning
               </div>
           )}
      </div>
    </div>
  );
}
