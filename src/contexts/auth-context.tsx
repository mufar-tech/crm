"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("mufar_token")
    if (storedToken) {
      setToken(storedToken)
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token")
          return res.json()
        })
        .then((userData) => {
          setUser(userData)
        })
        .catch(() => {
          localStorage.removeItem("mufar_token")
          setToken(null)
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Login failed")
    }

    localStorage.setItem("mufar_token", data.token)
    setToken(data.token)
    setUser(data.user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("mufar_token")
    setToken(null)
    setUser(null)
    router.push("/login")
  }, [router])

  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
      const res = await fetch(url, { ...options, headers })
      if (!res.ok) {
        if (res.status === 401) {
          logout()
          throw new Error("Session expired")
        }
        const err = await res.json().catch(() => ({ error: "Request failed" }))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      return res.json()
    },
    [token, logout]
  )

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
