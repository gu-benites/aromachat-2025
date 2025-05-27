'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useSession, useUser } from '../queries/use-auth-queries';
import { useSignOut } from '../queries/use-auth-mutations';
import { useCurrentUserProfile } from '@/features/user-profile/queries/user-profile.queries';
import { getClientLogger } from '@/lib/logger/client.logger';

const logger = getClientLogger('useAuth');

/**
 * Extended user type that combines Supabase user with profile data
 * @extends SupabaseUser
 */
export interface AuthenticatedUser extends SupabaseUser {
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

/**
 * Hook that provides authentication state and actions
 * Combines session, user data, and profile data into a single hook
 * 
 * @returns Object containing auth state and actions
 */
export function useAuth() {
  const router = useRouter();
  
  // Use existing auth queries
  const { data: session, isLoading: isLoadingSession, error: sessionError } = useSession();
  const { data: user, isLoading: isLoadingUser, error: userError } = useUser();
  
  // Use existing mutation for sign out
  const { mutateAsync: signOut } = useSignOut();
  
  // Fetch user profile if needed
  const { 
    data: userProfile, 
    isLoading: isLoadingProfile, 
    error: profileError,
    refetch: refetchProfile 
  } = useCurrentUserProfile();

  // Determine authentication state
  const hasActiveSession = !!session?.user && !sessionError;
  const isUserProfileLoaded = !!userProfile && !profileError;
  const isAuthenticated = hasActiveSession && isUserProfileLoaded;
  const isLoadingAuth = isLoadingSession || isLoadingUser || (hasActiveSession && isLoadingProfile);
  const authError = sessionError || userError || profileError;

  // Combine session user with profile data
  const authUser = useMemo<AuthenticatedUser | null>(() => {
    if (!isAuthenticated || !user) return null;
    
    return {
      ...user,
      ...userProfile,
    };
  }, [isAuthenticated, user, userProfile]);

  /**
   * Handles user sign out
   * Clears the session and redirects to home page
   */
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      logger.error('Error during sign out:', { error });
      throw error;
    }
  };

  return {
    // Core auth state
    authUser,
    session,
    isAuthenticated,
    isLoading: isLoadingAuth,
    error: authError,
    
    // Derived states
    hasActiveSession,
    isUserProfileLoaded,
    
    // Actions
    signOut: handleSignOut,
    reloadUserProfile: refetchProfile,
  };
}
