'use client'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const Header = () => {
  const { isAuthenticated, role, checkAuth } = useAuth()
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    checkAuth()
    router.push("/")
  }

  return (
    <header className="bg-cornflower-blue-50 shadow-sm border-b border-cornflower-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <BookOpen className="w-8 h-8 text-cornflower-blue-600 group-hover:text-cornflower-blue-700 transition-colors" />
            <span className="text-2xl font-bold text-gray-900 group-hover:text-cornflower-blue-900 transition-colors">LearnHub</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
             <Link href="/courses" className="text-gray-700 hover:text-cornflower-blue-600 font-medium transition-colors">
                  Browse Courses
             </Link>
            {!isAuthenticated && (
              <>
                <Link href="/" className="text-gray-700 hover:text-cornflower-blue-600 font-medium transition-colors">
                  Home
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-cornflower-blue-600 font-medium transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-cornflower-blue-600 font-medium transition-colors">
                  Contact
                </Link>
              </>
            )}

            {isAuthenticated && role === 'STUDENT' && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-cornflower-blue-600 font-medium transition-colors">
                  Dashboard
                </Link>
              </>
            )}

            {isAuthenticated && role === 'INSTRUCTOR' && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-cornflower-blue-600 font-medium transition-colors">
                  Instructor Dashboard
                </Link>
              </>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link href="/auth/login">
                  <button className="px-4 py-2 text-gray-700 hover:text-cornflower-blue-600 font-medium transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/auth/register">
                  <button className="px-6 py-2 bg-cornflower-blue-600 text-white rounded-lg hover:bg-cornflower-blue-700 transition-colors shadow-sm">
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
