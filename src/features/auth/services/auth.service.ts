'use server';

import { createBrowserClient, createServerClient } from '@/lib/clients/supabase';
import { cookies } from 'next/headers';
import { logger } from '@/lib/logger/client.logger';
import type { User, Session, AuthResponse } from '@supabase/supabase-js';

type SignInCredentials = {
  email: string;
  password: string;
};

type SignUpParams = {
  email: string;
  password: string;
  fullName: string;
};

type ResetPasswordParams = {
  email: string;
  redirectTo: string;
};

type UpdatePasswordParams = {
  password: string;
  token?: string; // Optional token for password reset flow
};

const authLogger = logger; // Using logger directly as child method is not available

/**
 * Gets the current server session
 * @returns The current session or null if no session exists
 */
export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error : new Error('Unknown error');
    authLogger.error('Error getting server session:', errorMessage);
    return null;
  }
}

/**
 * Sends a password reset email to the specified email address
 * @param params Email and redirect URL
 * @returns Success status
 * @throws {Error} If the operation fails
 */
export async function resetPassword({ 
  email, 
  redirectTo 
}: ResetPasswordParams): Promise<{ success: true }> {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  
  if (error) {
    authLogger.error('Password reset error:', error);
    throw new Error(error.message);
  }
  
  return { success: true };
}

/**
 * Updates the current user's password
 * @param params New password and optional token
 * @returns Updated user data
 * @throws {Error} If the operation fails
 */
export async function updatePassword({ 
  password,
  token 
}: UpdatePasswordParams): Promise<User> {
  const cookieStore = cookies();
  const supabase = token ? createServerClient(cookieStore) : createBrowserClient();
  
  try {
    // If token is provided, verify it first
    if (token) {
      const { data: { user }, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'recovery',
      });

      if (verifyError || !user) {
        throw new Error(verifyError?.message || 'Invalid or expired reset token');
      }
    }
    
    // Update the password
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error || !data.user) {
      throw new Error(error?.message || 'Failed to update password');
    }
    
    return data.user;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error : new Error('Unknown error');
    authLogger.error('Password update error:', errorMessage);
    throw errorMessage;
  }
}

/**
 * Signs in a user with email and password
 * @param credentials User credentials
 * @returns Authentication response with session data
 * @throws {Error} If authentication fails
 */
export async function signInWithEmail({ 
  email, 
  password 
}: SignInCredentials): Promise<AuthResponse> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    authLogger.error('Sign in error:', error);
    throw new Error(error.message);
  }
  
  if (!data.session) {
    throw new Error('No session returned after sign in');
  }
  
  return { data, error: null };
}

/**
 * Creates a new user account with email and password
 * @param params User registration data
 * @returns Authentication response with user data
 * @throws {Error} If registration fails
 */
export async function signUp({ 
  email, 
  password, 
  fullName 
}: SignUpParams): Promise<AuthResponse> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    authLogger.error('Sign up error:', error);
    throw new Error(error.message);
  }

  return { data, error: null };
}

/**
 * Signs out the current user
 * @returns Success status
 * @throws {Error} If sign out fails
 */
export async function signOut(): Promise<{ success: true }> {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    authLogger.error('Sign out error:', error);
    throw new Error(error.message);
  }
  
  return { success: true };
}

/**
 * Gets the current session
 * @returns The current session or null if no session exists
 * @throws {Error} If the operation fails
 */
export async function getSession(): Promise<Session | null> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    authLogger.error('Get session error:', error);
    throw new Error(error.message);
  }
  
  return data.session;
}

/**
 * Gets the current authenticated user
 * @returns The current user or null if not authenticated
 * @throws {Error} If the operation fails
 */
export async function getUser(): Promise<User | null> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    authLogger.error('Get user error:', error);
    throw new Error(error.message);
  }
  
  return data.user;
}

/**
 * Verifies if the current user is authenticated
 * @returns User data if authenticated, null otherwise
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await getUser();
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Requires the user to be authenticated
 * @returns The authenticated user
 * @throws {Error} If the user is not authenticated
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  return user;
}

/**
 * Exchanges an OAuth code for a session
 * @param code The authorization code from the OAuth provider
 * @returns Promise that resolves when the code exchange is complete
 * @throws {Error} If the code exchange fails
 */
export async function exchangeAuthCode(code: string): Promise<void> {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      throw new Error(`Failed to exchange code for session: ${error.message}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error : new Error('Unknown error during code exchange');
    authLogger.error('Code exchange error:', errorMessage);
    throw errorMessage;
  }
}

// Export all service functions
export const authService = {
  resetPassword,
  updatePassword,
  signInWithEmail,
  signUp,
  signOut,
  getSession,
  getUser,
  getCurrentUser,
  requireUser,
  exchangeAuthCode
};
