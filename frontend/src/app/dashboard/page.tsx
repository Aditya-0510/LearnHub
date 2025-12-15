'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

interface Course {
  id: number
  title: string
  description?: string
}

export default function Dashboard() {
  const { role, isAuthenticated } = useAuth()
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
          throw new Error(`HTTP error! Status: ${res.status}`)
        }

        const data = await res.json()
        setCourses(data.courses || [])
        console.log(courses);
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

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto p-8">
      {role === 'STUDENT' ? (
        <>
          <h1 className="text-2xl font-bold mb-4">My Registered Courses</h1>
          {courses.length === 0 ? (
            <p className="text-gray-600">You haven't registered for any courses yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(course => (
                <div
                  key={course.id}
                  className="bg-white shadow p-4 rounded-lg border border-gray-200"
                >
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p className="text-gray-600 mt-2">
                    {course.description || 'No description available.'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Courses You Created</h1>
          {courses.length === 0 ? (
            <p className="text-gray-600">You haven't created any courses yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(course => (
                <div
                  key={course.id}
                  className="bg-white shadow p-4 rounded-lg border border-gray-200"
                >
                  <h2 className="text-xl font-semibold">{course.id}</h2>
                  <p className="text-gray-600 mt-2">
                    {course.description || 'No description available.'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
