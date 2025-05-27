'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '../lib/clients/supabase/client'
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js'

export * from './theme-provider';
export * from './auth-session-provider';
export * from './query-client-provider';


// Auth Context
type AuthContextType = {
  session: Session | null
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthSessionProvider({
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

function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthSessionProvider')
  }
  return context
}

// Main Providers component
function Providers({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthSessionProvider initialSession={session}>
      {children}
    </AuthSessionProvider>
  )
}

export { AuthSessionProvider, useAuth };

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
