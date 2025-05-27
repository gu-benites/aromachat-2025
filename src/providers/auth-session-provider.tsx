'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/clients/supabase/client'
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js'

type AuthContextType = {
  session: Session | null
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthSessionProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode
  initialSession: Session | null
}) {
  const [session, setSession] = useState<Session | null>(initialSession)
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, newSession: Session | null) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const value = {
    session,
    user,
    loading,
  }


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access the auth context
 * Must be used within an AuthSessionProvider
 * 
 * @throws {Error} If used outside of AuthSessionProvider
 * @returns {AuthContextType} The auth context value
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthSessionProvider')
  }
  return context
}

export default AuthSessionProvider
