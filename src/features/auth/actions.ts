// src/features/auth/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger/client.logger';
import { authService } from '@/features/auth/services/auth.service';

type ActionResult = {
  error: string | null;
  success?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
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
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    await authService.signInWithEmail({ email, password });
    redirect('/dashboard');
    return { error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { 
      error: error instanceof Error ? error.message : 'Failed to sign in' 
    };
  }
}

export const signUpAction: FormAction = async (formData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  
  if (!email || !password || !fullName) {
    return { error: 'All fields are required' };
  }

  try {
    await authService.signUp({ email, password, fullName });
    redirect('/auth/verify-email');
    return { error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { 
      error: error instanceof Error ? error.message : 'Failed to create account' 
    };
  }
}

export async function signOut() {
  try {
    await authService.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
  
  redirect('/login');
}

import { forgotPasswordSchema } from './schemas/auth.schemas';

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

import { resetPasswordSchema } from './schemas/auth.schemas';

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
