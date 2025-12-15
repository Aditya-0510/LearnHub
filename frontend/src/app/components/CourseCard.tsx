'use client';
import React from 'react';
import Link from 'next/link';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-cornflower-blue-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="h-48 bg-cornflower-blue-100 flex items-center justify-center">
         {/* Placeholder for course image */}
        <span className="text-4xl">📚</span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow text-sm">
          {course.description || 'No description available for this course.'}
        </p>
        <div className="mt-auto">
            <Link
              href={`/courses/${course.id}`}
              className="block w-full text-center bg-cornflower-blue-600 hover:bg-cornflower-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              View Details
            </Link>
        </div>
      </div>
    </div>
  );
}
