'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { createBrowserClient } from '@/lib/clients/supabase';
import { getClientLogger } from '@/lib/logger/client.logger';

const logger = getClientLogger('AuthSessionProvider');

type AuthSessionContextType = {
  /** The current Supabase session */
  session: Session | null;
  /** The current Supabase user */
  user: SupabaseUser | null;
  /** True while the initial session is being loaded */
  isLoading: boolean;
  /** Any error that occurred during authentication */
  error: Error | null;
  /** Refresh the current session */
  refreshSession: () => Promise<void>;
  /** The Supabase client */
  supabaseClient: ReturnType<typeof createBrowserClient>;
};

const AuthSessionContext = createContext<AuthSessionContextType | undefined>(undefined);

interface AuthSessionProviderProps {
  children: ReactNode;
  /** Optional initial session for SSR */
  initialSession?: Session | null;
}

/**
 * Provides authentication session context to the application
 * Should be used at the root of the application
 */
export function AuthSessionProvider({ 
  children, 
  initialSession = null 
}: AuthSessionProviderProps) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [user, setUser] = useState<SupabaseUser | null>(initialSession?.user ?? null);
  const [isLoading, setIsLoading] = useState(!initialSession);
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize Supabase client
  const supabaseClient = useMemo(() => createBrowserClient(), []);

  /**
   * Refreshes the current session from Supabase
   */
  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { session: newSession }, error: sessionError } = 
        await supabaseClient.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      logger.info('Session refreshed', { 
        hasSession: !!newSession,
        userId: newSession?.user?.id 
      });
      
      // Don't return anything to match the Promise<void> return type
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to refresh session');
      setError(error);
      logger.error('Error refreshing session: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient.auth]);

  // Handle auth state changes
  useEffect(() => {
    // Skip if we're in SSR
    if (typeof window === 'undefined') return;

    // Initial session load if not provided
    if (!initialSession) {
      refreshSession().catch(err => {
        const errorMessage = err instanceof Error ? err.message : String(err);
      logger.error('Failed to load initial session: ' + errorMessage);
      });
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event: string, newSession: Session | null) => {
        try {
          logger.debug('Auth state changed', { event });
          
          // Update session and user
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setError(null);
          
          // Handle specific auth events
          if (event === 'SIGNED_OUT') {
            logger.info('User signed out');
            setSession(null);
            setUser(null);
          } else if (event === 'SIGNED_IN' && newSession?.user?.id) {
            logger.info('User signed in', { userId: newSession.user.id });
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Auth state change error');
          setError(error);
          logger.error(`Error handling auth state change (${event}): ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [refreshSession, supabaseClient.auth, initialSession]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    session,
    user,
    isLoading,
    error,
    refreshSession,
    supabaseClient,
  }), [session, user, isLoading, error, refreshSession, supabaseClient]);

  return (
    <AuthSessionContext.Provider value={contextValue}>
      {children}
    </AuthSessionContext.Provider>
  );
}

/**
 * Hook to access the auth session context
 * @throws {Error} If used outside of an AuthSessionProvider
 */
export function useAuthSession(): AuthSessionContextType {
  const context = useContext(AuthSessionContext);
  if (context === undefined) {
    throw new Error('useAuthSession must be used within an AuthSessionProvider');
  }
  return context;
}
