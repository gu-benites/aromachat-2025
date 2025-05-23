import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  signInWithEmail,
  signUpWithEmail,
  signOut as signOutService,
  getSession,
  getUser,
} from '../services/auth.service';
import { SignInFormData, SignUpFormData } from '../schemas/auth.schemas';

const AUTH_KEYS = {
  session: ['auth', 'session'],
  user: ['auth', 'user'],
} as const;

export function useSession() {
  return useQuery({
    queryKey: AUTH_KEYS.session,
    queryFn: getSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUser() {
  return useQuery({
    queryKey: AUTH_KEYS.user,
    queryFn: getUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: SignInFormData) => signInWithEmail(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEYS.session, data.session);
      queryClient.setQueryData(AUTH_KEYS.user, data.user);
    },
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: (data: SignUpFormData) => signUpWithEmail(data),
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOutService,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_KEYS.session });
      queryClient.removeQueries({ queryKey: AUTH_KEYS.user });
    },
  });
}

export const useInvalidateAuthQueries = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: AUTH_KEYS.session });
    queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user });
  };
};
