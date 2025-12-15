'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface Course {
  id: number
  title: string
  description?: string
}

export default function Dashboard() {
  const { role, isAuthenticated } = useAuth()
  const router = useRouter() // Added router hook
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem('token')
        console.log('Token being sent:', token)
        if (!token) {
          console.error('No token found')
          setLoading(false)
          return
        }

        // Choose endpoint based on role
        const endpoint =
          role === 'STUDENT'
            ? 'http://localhost:4000/api/courses/enrolled'
            : 'http://localhost:4000/api/courses/instructor'

        const res = await fetch(endpoint, {
          headers: {
            Authorization: token,
          },
        })

        if (!res.ok) {
           // Handle 404 cleanly if no enrolled courses
           if(res.status === 404) {
               setCourses([]);
               return;
           }
           const errorData = await res.json().catch(() => ({}));
            console.error('API Error:', res.status, errorData);
           throw new Error(`HTTP error! Status: ${res.status}`)
        }

        const data = await res.json()
        setCourses(data.courses || [])
      } 
      catch (error) {
        console.error('Error fetching courses:', error)
      } 
      finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [role, isAuthenticated])

  if (!isAuthenticated) {
    return <div className="p-8 text-center">Please log in to view your dashboard.</div>
  }

  if (loading) return <div className="p-12 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cornflower-blue-600"></div></div>

  return (
    <div className="max-w-7xl mx-auto p-8">
      {role === 'STUDENT' ? (
        <>
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">My Registered Courses</h1>
              <button 
                  onClick={() => router.push('/courses')}
                  className="bg-cornflower-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-cornflower-blue-700 transition-colors"
              >
                  Find More Courses
              </button>
          </div>
          
          {courses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-600 mb-4">You haven't registered for any courses yet.</p>
                <button 
                  onClick={() => router.push('/courses')}
                  className="text-cornflower-blue-600 font-medium hover:underline"
                >
                  Browse Catalog
                </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((item: any) => {
                // Handle structure difference: Student endpoint returns Enrollments (with .course), Instructor returns Courses directly
                const course = item.course || item; 
                return (
                    <div
                    key={course.id}
                    className="bg-white shadow-sm hover:shadow-md transition-shadow p-6 rounded-xl border border-cornflower-blue-100 flex flex-col cursor-pointer group"
                    onClick={() => router.push(`/learn/${course.id}`)}
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cornflower-blue-600 transition-colors">{course.title}</h2>
                        <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">
                            {course.description || 'No description available.'}
                        </p>
                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                             <span>Continue Learning &rarr;</span>
                        </div>
                    </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
              <button 
                  onClick={() => router.push('/dashboard/instructor/create')}
                  className="bg-cornflower-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-cornflower-blue-700 transition-colors"
                >
                  + Create New Course
              </button>
            </div>

          {courses.length === 0 ? (
             <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-600 mb-4">You haven't created any courses yet.</p>
                <button 
                  onClick={() => router.push('/dashboard/instructor/create')}
                  className="text-cornflower-blue-600 font-medium hover:underline"
                >
                  Create your first course
                </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div
                  key={course.id}
                  className="bg-white shadow-sm hover:shadow-md transition-shadow p-6 rounded-xl border border-cornflower-blue-100 flex flex-col cursor-pointer group"
                  onClick={() => router.push(`/dashboard/instructor/${course.id}`)}
                >
                   <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cornflower-blue-600 transition-colors">{course.title}</h2>
                  <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">
                    {course.description || 'No description available.'}
                  </p>
                   <div className="mt-auto pt-4 border-t border-gray-100 text-sm font-medium text-cornflower-blue-600">
                        Manage Content
                   </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
