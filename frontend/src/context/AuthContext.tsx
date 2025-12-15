'use client'
import { createContext, useContext, useEffect, useState } from 'react'
// import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  role: string | null
  setIsAuthenticated: (value: boolean) => void
  setRole: (value: string | null) => void
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  // const router = useRouter()
  // const pathname = usePathname()
  // const [isLoading, setIsLoading] = useState(true)

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    const storedRole = localStorage.getItem('role')
    setIsAuthenticated(!!token)
    setRole(storedRole)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // useEffect(() => {
  //   if (isLoading) return 

  //   const publicPaths = ['/', '/login', '/signup']
  //   const isPublicPath = publicPaths.includes(pathname)

  //   if (isAuthenticated && isPublicPath) { 
  //     router.push('/dashboard')
  //   }

  //   if (!isAuthenticated && !isPublicPath) {
  //     router.push('/login')
  //   }
  // }, [isAuthenticated, role, pathname, router, isLoading])

  // if (isLoading) {
  //   return <div>Loading...</div> 
  // }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, setIsAuthenticated, setRole, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
