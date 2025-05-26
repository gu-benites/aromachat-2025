'use server';

import { redirect } from 'next/navigation';
import { 
  signInWithEmail, 
  signUp, 
  signOut as serverSignOut,
  resetPassword as resetPasswordService,
  updatePassword
} from './services/auth.service';

type ActionResult = {
  error: string | null;
  success?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

type FormAction = (formData: FormData) => Promise<ActionResult>;

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
    await signInWithEmail({ email, password });
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
    await signUp({ email, password, fullName });
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
    await serverSignOut();
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
    await resetPasswordService({ email, redirectTo: redirectUrl });

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
    await updatePassword({ password, token });

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
