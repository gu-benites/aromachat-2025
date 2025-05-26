// src/features/auth/actions.ts
'use server';

import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger/client.logger';
import { authService } from '@/features/auth/services/auth.service';
import { signUpSchema, forgotPasswordSchema, resetPasswordSchema } from './schemas/auth.schemas';

/**
 * Custom error class for authentication-related errors
 */
class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'AUTH_ERROR',
    public readonly status: number = 400,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Standard response format for all auth actions
 */
type ActionResult<T = unknown> = {
  success: boolean;
  message?: string;
  error?: string | null;
  data?: T;
  fieldErrors?: Record<string, string[]>;
  redirectTo?: string;
};

type FormAction = (formData: FormData) => Promise<ActionResult>;

const actionLogger = logger;

export async function handleAuthCallback(request: Request): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';
  const error = requestUrl.searchParams.get('error');

  try {
    if (error) {
      throw new Error(`Authentication error: ${error}`);
    }

    if (!code) {
      throw new Error('No authorization code provided');
    }

    await authService.exchangeAuthCode(code);
    actionLogger.info('Successfully processed auth callback', { redirectTo: next });
    return NextResponse.redirect(new URL(next, requestUrl.origin));

  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error('Unknown error during authentication');
    actionLogger.error('Auth callback error:', errorObj);
    
    return NextResponse.redirect(
      new URL(
        `/auth/error?error=${encodeURIComponent(errorObj.message)}`, 
        requestUrl.origin
      )
    );
  }
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env['VERCEL_URL']) return `https://${process.env['VERCEL_URL']}`; // SSR should use vercel url
  return `http://localhost:${process.env['PORT'] ?? 3000}`; // dev SSR should use localhost
};

export const signIn: FormAction = async (formData) => {
  try {
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
        fieldErrors: {
          email: !email ? ['Email is required'] : [],
          password: !password ? ['Password is required'] : []
        }
      };
    }

    await authService.signInWithEmail({ email, password });
    
    return {
      success: true,
      message: 'Successfully signed in',
      redirectTo: '/dashboard',
      error: null
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
    actionLogger.error('Sign in error:', new AuthError(errorMessage, 'SIGNIN_ERROR'));
    
    const fieldErrors: Record<string, string[]> = {};
    if (errorMessage.toLowerCase().includes('email')) {
      fieldErrors['email'] = [errorMessage];
    } else if (errorMessage.toLowerCase().includes('password')) {
      fieldErrors['password'] = [errorMessage];
    }
    
    return {
      success: false,
      error: 'Authentication failed. Please check your credentials and try again.',
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
    };
  }
}

/**
 * Handles user registration form submission
 * @param formData Form data from the registration form
 * @returns ActionResult with success/error status and messages
 */
export const signUpAction: FormAction = async (formData) => {
  try {
    // Parse and validate the form data
    const result = signUpSchema.safeParse({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    // Handle validation errors
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors,
      };
    }

    const { email, password, firstName, lastName } = result.data;

    // Call the auth service to register the user
    const { data, error } = await authService.signUp({ 
      email, 
      password, 
      firstName, 
      lastName 
    });

    if (error || !data?.user) {
      throw new AuthError(error?.message || 'Failed to create account', 'SIGNUP_ERROR');
    }

    // If email confirmation is required, return success with message
    if (!data.user.identities?.length) {
      return {
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        redirectTo: '/login',
        error: null,
      };
    }

    // If user is already confirmed, redirect to dashboard
    return {
      success: true,
      message: 'Registration successful!',
      redirectTo: '/dashboard',
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    actionLogger.error('Sign up error:', new AuthError(errorMessage, 'SIGNUP_ERROR'));
    
    // Handle specific error cases
    let errorResponse: Omit<ActionResult, 'success'> = {
      error: 'Registration failed. Please try again.',
      message: undefined
    };

    if (errorMessage.toLowerCase().includes('already in use')) {
      errorResponse = {
        error: 'This email is already registered. Please use a different email or sign in.',
        fieldErrors: {
          email: ['This email is already registered']
        }
      };
    } else if (errorMessage.toLowerCase().includes('password')) {
      errorResponse = {
        error: 'Invalid password. Please ensure it meets the requirements.',
        fieldErrors: {
          password: [errorMessage]
        }
      };
    } else if (errorMessage.toLowerCase().includes('email')) {
      errorResponse = {
        error: 'Please enter a valid email address.',
        fieldErrors: {
          email: [errorMessage]
        }
      };
    }
    
    return { 
      success: false,
      ...errorResponse
    };
  }
}

export const signOut = async (): Promise<ActionResult> => {
  try {
    await authService.signOut();
    return {
      success: true,
      message: 'Successfully signed out',
      redirectTo: '/login',
      error: null
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
    actionLogger.error('Sign out error:', new Error(errorMessage));
    
    return {
      success: false,
      error: 'Failed to sign out. Please try again.'
    };
  }
}

export const forgotPassword: FormAction = async (formData) => {
  try {
    // Parse and validate the form data
    const result = forgotPasswordSchema.safeParse({
      email: formData.get('email'),
    });

    // Handle validation errors
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return { 
        success: false, 
        error: Object.values(errors).flat().join('\n') || 'Invalid form data',
        fieldErrors: errors,
      };
    }

    const { email } = result.data;
    const redirectUrl = new URL('/reset-password', getBaseUrl()).toString();
    
    // Send password reset email using the auth service
    await authService.resetPassword({ email, redirectTo: redirectUrl });

    return { 
      success: true, 
      error: null,
      message: 'Password reset email sent. Please check your inbox.' 
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      fieldErrors: {},
    };
  }
}

// Schema imports are now at the top of the file

export const resetPassword: FormAction = async (formData) => {
  try {
    // Parse and validate the form data
    const result = resetPasswordSchema.safeParse({
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      token: formData.get('token'),
    });

    // Handle validation errors
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return { 
        success: false, 
        error: Object.values(errors).flat().join('\n') || 'Invalid form data',
        fieldErrors: errors,
      };
    }

    const { password, token } = result.data;
    
    // Update the password using the auth service
    await authService.updatePassword({ password, token });

    return { 
      success: true, 
      error: null,
      message: 'Your password has been reset successfully. You can now sign in with your new password.'
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      fieldErrors: {},
    };
  }
}
