'use client';
import React, { useEffect, useState } from 'react';
import { Course } from '../types';
import CourseCard from '../components/CourseCard';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`);
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl sm:tracking-tight lg:text-6xl">
            Explore Our Courses
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Discover new skills and advance your career with our comprehensive course catalog.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cornflower-blue-600"></div>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No courses available at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
