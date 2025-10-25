'use client'
import { createContext, useContext, useEffect, useState } from 'react'

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

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    const storedRole = localStorage.getItem('role')
    setIsAuthenticated(!!token)
    setRole(storedRole)
  }

  useEffect(() => {
    checkAuth()
  }, [])

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
