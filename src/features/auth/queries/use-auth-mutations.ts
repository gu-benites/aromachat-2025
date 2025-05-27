'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';

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
 * Hook for handling user sign-in
 * @returns Mutation object with signIn function and status
 */
export function useSignIn() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return authService.signInWithPassword(email, password);
    },
    onSuccess: () => {
      toast.success('Signed in successfully');
      router.push('/dashboard');
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to sign in');
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
