'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  signInWithEmail, 
  signOut, 
  updatePassword 
} from '../services/auth.service';
import { signUpWithEmail } from '../services/server-auth.service';
import { 
  forgotPassword as forgotPasswordAction,
  resetPassword as resetPasswordAction 
} from '../actions';


export function useSignIn() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return signInWithEmail({ email, password });
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

export function useSignUp() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
      return signUpWithEmail({ email, password, fullName });
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

export function useSignOut() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async () => {
      return signOut();
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

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: async (params: ForgotPasswordParams) => {
      const formData = new FormData();
      formData.append('email', params.email);
      return forgotPasswordAction(formData);
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

export function useUpdatePassword() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      return updatePassword({ password });
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

interface ForgotPasswordParams {
  email: string;
  redirectTo: string;
}

export function useResetPassword() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (params: { password: string; token: string }) => {
      const formData = new FormData();
      formData.append('password', params.password);
      formData.append('confirmPassword', params.password);
      formData.append('token', params.token);
      return resetPasswordAction(formData);
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
