'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useAuthSession } from '@/providers/auth-session-provider';
import { useCurrentUserProfile } from '@/features/user-profile/queries/user-profile.queries';
import { getClientLogger } from '@/lib/logger/client.logger';

const logger = getClientLogger('useAuth');

export interface AuthenticatedUser extends SupabaseUser {
  // Add any additional fields from your user profile
  username?: string;
  full_name?: string;
  avatar_url?: string;
  // Add other profile fields as needed
}

export function useAuth() {
  const { session, isLoading: isLoadingSession, error: sessionError } = useAuthSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch user profile if session exists
  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch: refetchProfile,
  } = useCurrentUserProfile();

  // Determine authentication state
  const hasActiveSession = !!session?.user && !sessionError;
  const isUserProfileLoaded = !!userProfile && !profileError;
  const isAuthenticated = hasActiveSession && isUserProfileLoaded;
  const isLoadingAuth = isLoadingSession || (hasActiveSession && isLoadingProfile);

  // Combine session user with profile data
  const authUser = useMemo<AuthenticatedUser | null>(() => {
    if (!isAuthenticated || !session?.user) return null;
    
    return {
      ...session.user,
      ...userProfile,
    };
  }, [isAuthenticated, session?.user, userProfile]);

  // Handle sign out
  const logout = useCallback(async () => {
    try {
      const { supabase } = await import('@/lib/clients/supabase');
      await supabase.auth.signOut();
      
      // Clear all queries from the cache
      queryClient.clear();
      
      // Invalidate all queries
      await queryClient.invalidateQueries();
      
      // Redirect to home page after sign out
      router.push('/');
      router.refresh(); // Ensure the page refreshes to reflect auth state
    } catch (error) {
      logger.error('Error signing out:', { error });
      throw error;
    }
  }, [queryClient, router]);

  // Handle profile refresh
  const reloadUserProfile = useCallback(async () => {
    try {
      await refetchProfile();
    } catch (error) {
      logger.error('Error reloading user profile:', { error });
      throw error;
    }
  }, [refetchProfile]);

  return {
    // Core auth state
    authUser,
    session,
    isAuthenticated,
    isLoadingAuth,
    authError: sessionError || profileError,
    
    // Derived states
    hasActiveSession,
    isUserProfileLoaded,
    
    // Actions
    logout,
    reloadUserProfile,
  };
}
