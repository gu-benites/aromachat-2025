import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { SignInFormData, SignUpFormData } from '../schemas/auth.schemas';

/** Query keys for auth-related queries */
const AUTH_KEYS = {
  session: ['auth', 'session'],
  user: ['auth', 'user'],
} as const;

/**
 * Hook to fetch the current authentication session
 * @returns Query object containing session data and status
 */
export function useSession() {
  return useQuery({
    queryKey: AUTH_KEYS.session,
    queryFn: () => authService.getSession(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch the currently authenticated user
 * @returns Query object containing user data and status
 */
export function useUser() {
  return useQuery({
    queryKey: AUTH_KEYS.user,
    queryFn: () => authService.getUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to handle user sign-in
 * @returns Mutation object with signIn function and status
 */
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: SignInFormData) => authService.signInWithPassword(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEYS.session, data.session);
      queryClient.setQueryData(AUTH_KEYS.user, data.user);
    },
  });
}

/**
 * Hook to handle user registration
 * @returns Mutation object with signUp function and status
 */
export function useSignUp() {
  return useMutation({
    mutationFn: (userData: SignUpFormData) => authService.signUp(userData),
  });
}

/**
 * Hook to handle user sign-out
 * @returns Mutation object with signOut function and status
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_KEYS.session });
      queryClient.removeQueries({ queryKey: AUTH_KEYS.user });
    },
  });
}

/**
 * Hook to invalidate all auth-related queries.
 * 
 * This hook returns a function that invalidates the session and user queries.
 * This can be used to refresh the auth data after a user's authentication status changes.
 * 
 * @returns Function to invalidate auth queries
 */
export function useInvalidateAuthQueries() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: AUTH_KEYS.session });
    queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user });
  };
}
