'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';
import { UnconfirmedEmailError } from '../errors/auth.errors';

/**
 * Initiates the password reset process for a user
 * @param email - The email address to send the reset link to
 * @returns Object indicating success/failure and optional message/error
 */
const forgotPasswordAction = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    // TODO: Implement actual forgot password logic using the email parameter
    console.log('Sending password reset email to:', email);
    // This is a placeholder implementation
    return { success: true, message: `Password reset email sent to ${email}` };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send reset email' };
  }
};

/**
 * Resets a user's password using a valid reset token
 * @param token - The password reset token
 * @param password - The new password
 * @returns Object indicating success/failure and optional message/error
 */
const resetPasswordAction = async (token: string, password: string): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    // TODO: Implement actual password reset logic using the token and password parameters
    console.log('Resetting password with token:', token, 'New password length:', password.length);
    // This is a placeholder implementation
    return { success: true, message: 'Password has been reset successfully' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to reset password' };
  }
};


/**
 * Hook for handling user sign-in with email and password
 * 
 * @remarks
 * This mutation handles the sign-in process, including error handling for various scenarios
 * such as unconfirmed emails, invalid credentials, and rate limiting.
 * 
 * @example
 * ```tsx
 * const { mutate: signIn, isPending } = useSignIn();
 * signIn({ email: 'user@example.com', password: 'securepassword' });
 * ```
 * 
 * @returns An object containing:
 * - `mutate`: Function to initiate the sign-in
 * - `isPending`: Boolean indicating if the sign-in is in progress
 * - `error`: Error object if the sign-in failed
 */
/**
 * Hook for handling user sign-in with email and password
 * 
 * @remarks
 * This mutation handles the sign-in process, including error handling for various scenarios
 * such as unconfirmed emails, invalid credentials, and rate limiting.
 * 
 * @example
 * ```tsx
 * const { mutate: signIn, isPending } = useSignIn();
 * signIn({ email: 'user@example.com', password: 'securepassword' });
 * ```
 * 
 * @returns An object containing:
 * - `mutate`: Function to initiate the sign-in
 * - `isPending`: Boolean indicating if the sign-in is in progress
 * - `error`: Error object if the sign-in failed
 */
export function useSignIn() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      try {
        return await authService.signInWithPassword(email, password);
      } catch (error) {
        console.log('Auth service error:', error);
        throw error; // Re-throw to be handled by onError
      }
    },
    onSuccess: () => {
      toast.success('Signed in successfully');
      router.push('/dashboard');
      router.refresh();
    },
    onError: (error: Error) => {
      const errorMessage = error?.message?.toLowerCase() || '';
      const isUnconfirmed = error instanceof UnconfirmedEmailError || 
                          errorMessage.includes('unconfirmed') || 
                          errorMessage.includes('email not confirmed') ||
                          errorMessage.includes('verify your email');
      
      console.log('useSignIn onError:', { 
        error, 
        isUnconfirmed,
        message: error?.message,
        name: error?.name,
        constructor: error?.constructor?.name
      });
      
      if (isUnconfirmed) {
        // Re-throw to allow component-level handling
        throw error;
      }
      
      // Only show toast for non-unconfirmed errors
      toast.error(error?.message || 'Failed to sign in');
    },
  });
}

/**
 * Hook for handling user registration
 * @returns Mutation object with signUp function and status
 */
export function useSignUp() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (values: { email: string; password: string; confirmPassword: string; firstName: string; lastName: string }) => {
      return authService.signUp(values);
    },
    onSuccess: () => {
      toast.success('Account created successfully! Please check your email to verify your account.');
      router.push('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create account');
    },
  });
}

/**
 * Hook for handling user sign-out
 * @returns Mutation object with signOut function and status
 */
export function useSignOut() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async () => {
      return authService.signOut();
    },
    onSuccess: () => {
      toast.success('Signed out successfully');
      router.push('/login');
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to sign out');
    },
  });
}

/**
 * Hook for requesting a password reset email
 * @returns Mutation object with requestReset function and status
 */
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: async (params: ForgotPasswordParams) => {
      return forgotPasswordAction(params.email);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || 'Password reset email sent');
      } else if (result.error) {
        throw new Error(result.error);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset email');
    },
  });
}

/**
 * Hook for updating a user's password
 * @returns Mutation object with updatePassword function and status
 */
export function useUpdatePassword() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      return authService.updatePassword(password);
    },
    onSuccess: () => {
      toast.success('Password updated successfully');
      router.push('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update password');
    },
  });
}

/**
 * Hook for resending email confirmation
 * @returns Mutation object with resendConfirmation function and status
 */
export function useResendConfirmationEmail() {
  return useMutation({
    mutationFn: async (email: string) => {
      return authService.resendConfirmationEmail(email);
    },
    onSuccess: () => {
      toast.success('Confirmation email resent successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to resend confirmation email');
    },
  });
}

/** Parameters for the forgot password request */
interface ForgotPasswordParams {
  email: string;
  redirectTo: string;
}

/**
 * Hook for resetting a user's password with a reset token
 * @returns Mutation object with resetPassword function and status
 */
export function useResetPassword() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (params: { password: string; token: string }) => {
      return resetPasswordAction(params.token, params.password);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || 'Password reset successfully');
        router.push('/login');
      } else if (result.error) {
        throw new Error(result.error);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });
}
