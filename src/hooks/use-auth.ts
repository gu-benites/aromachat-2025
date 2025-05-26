import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createBrowserClient } from '@/lib/clients/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    // Get the current user session
    const getSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Get the initial session
    getSession();

    // Clean up the subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase.auth]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
