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
  firstName: string;
  lastName: string;
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
  firstName,
  lastName
}: SignUpParams): Promise<AuthResponse> {
  try {
    const supabase = createBrowserClient();
    
    // First, sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
          email_verified: false,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      // Map common Supabase errors to more user-friendly messages
      const errorMessage = (() => {
        if (error.message.includes('already registered')) {
          return 'This email is already registered. Please sign in or use a different email.';
        } else if (error.message.includes('password')) {
          return 'Invalid password. Please ensure it meets the requirements.';
        } else if (error.message.includes('email')) {
          return 'Please enter a valid email address.';
        }
        return error.message || 'Failed to create account';
      })();
      
      const errorObj = new Error(errorMessage);
      authLogger.error('Sign up error:', errorObj);
      throw errorObj;
    }

    // If we have a user, update their profile with additional data
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
          email: data.user.email,
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        authLogger.error('Error updating user profile:', profileError);
        // Don't fail the signup if profile update fails
      }
    }

    return { data, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error : new Error('Unknown error during sign up');
    authLogger.error('Sign up error:', errorMessage);
    throw errorMessage;
  }
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
