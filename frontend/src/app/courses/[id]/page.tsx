'use client';
import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Course, Review } from '../../types';
import { useAuth } from '@/context/AuthContext';
import ReviewSection from '../../components/ReviewSection';

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState('');

  const fetchCourseDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return; // Wait for auth check or redirect
      }

      const headers = { Authorization: token };

      // Fetch course details
      const courseRes = await fetch(`http://localhost:4000/api/courses/${id}`, { headers });
      if (courseRes.ok) {
        const data = await courseRes.json();
        setCourse(data.course);
      } else {
        if(courseRes.status === 403 || courseRes.status === 401) {
             setError("Please log in to view course details.");
        } else {
            setError('Failed to load course details.');
        }
      }

      // Fetch reviews
      const reviewsRes = await fetch(`http://localhost:4000/api/courses/${id}/reviews`, { headers });
      if (reviewsRes.ok) {
        const data = await reviewsRes.json();
        setReviews(data.reviews || []);
      }

      // Check enrollment status (if student)
      if (role === 'STUDENT') {
         // This is a bit tricky as the API doesn't have a direct "check enrollment" endpoint for specific course
         // We can infer from errors or fetch all enrolled courses. 
         // For now, let's rely on the user trying to enroll or the button state. 
         // Actually, let's fetch enrolled courses to check state.
         const enrolledRes = await fetch('http://localhost:4000/api/courses/enrolled', { headers });
         if(enrolledRes.ok) {
             const data = await enrolledRes.json();
             const enrolledIds = data.courses?.map((e: any) => e.courseId) || [];
             if(enrolledIds.includes(Number(id))) {
                 setIsEnrolled(true);
             }
         }
      }

    } catch (err) {
      console.error(err);
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
        fetchCourseDetails();
    } else {
        setLoading(false);
    }
  }, [id, isAuthenticated, role]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setEnrolling(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/courses/${id}/enroll`, {
        method: 'POST',
        headers: {
          Authorization: token || '',
        },
      });

      if (res.ok) {
        setIsEnrolled(true);
        router.push('/dashboard'); // Redirect to dashboard or stay here
      } else {
        alert('Failed to enroll.');
      }
    } catch (err) {
      console.error(err);
      alert('Error enrolling in course.');
    } finally {
      setEnrolling(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
            <p className="text-gray-600 mb-6">You must be logged in to view course details.</p>
            <button 
                onClick={() => router.push('/auth/login')}
                className="bg-cornflower-blue-600 text-white px-6 py-2 rounded-lg hover:bg-cornflower-blue-700 transition-colors"
            >
                Sign In
            </button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cornflower-blue-600"></div></div>;

  if (error || !course) return <div className="p-12 text-center text-red-500">{error || 'Course not found'}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-cornflower-blue-100 overflow-hidden">
          <div className="h-64 bg-cornflower-blue-600 flex items-center justify-center text-white">
            <h1 className="text-4xl font-bold px-4 text-center">{course.title}</h1>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Instructor</h2>
                    <p className="text-gray-600">{(course as any).instructor?.username || 'Unknown Instructor'}</p>
                </div>
                
                <div className="mt-4 md:mt-0">
                    {role === 'STUDENT' && (
                        isEnrolled ? (
                            <button 
                                onClick={() => router.push(`/learn/${course.id}`)}
                                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-md"
                            >
                                Continue Learning
                            </button>
                        ) : (
                            <button 
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className="bg-cornflower-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-cornflower-blue-700 transition-colors shadow-md disabled:opacity-70"
                            >
                                {enrolling ? 'Enrolling...' : 'Enroll Now'}
                            </button>
                        )
                    )}
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Course</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{course.description}</p>
            </div>

            <ReviewSection 
                courseId={Number(id)} 
                reviews={reviews} 
                onReviewAdded={fetchCourseDetails} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
