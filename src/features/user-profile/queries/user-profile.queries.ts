import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userProfileService } from '../services/user-profile.service';
import { useAppStore } from '@/store';
import {
  UpdateProfileInput,
  ChangePasswordInput,
  UpdateEmailInput,
  DeleteAccountInput,
  SocialLinksInput,
  EmailPreferencesInput,
  NotificationPreferencesInput,
} from '../schemas/user-profile.schemas';

const USER_PROFILE_QUERY_KEY = 'userProfile';
const USER_PROFILES_QUERY_KEY = 'userProfiles';

/**
 * Hook to fetch the current user's profile
 */
export const useCurrentUserProfile = () => {
  const { user } = useAppStore();
  
  return useQuery({
    queryKey: [USER_PROFILE_QUERY_KEY, 'current'],
    queryFn: () => userProfileService.getUserProfile(user!.id),
    enabled: !!user?.id,
  });
};

/**
 * Hook to fetch a user's profile by ID
 * @param userId - The ID of the user to fetch
 */
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: [USER_PROFILE_QUERY_KEY, userId],
    queryFn: () => userProfileService.getUserProfile(userId),
    enabled: !!userId,
  });
};

/**
 * Hook to update the current user's profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAppStore();
  
  return useMutation({
    mutationFn: (data: UpdateProfileInput) =>
      userProfileService.updateUserProfile(user!.id, data),
    onSuccess: (updatedProfile) => {
      // Update the profile in the cache
      queryClient.setQueryData([USER_PROFILE_QUERY_KEY, user!.id], updatedProfile);
      
      // Update the current user in the store
      useAppStore.getState().setUser({
        ...user!,
        ...updatedProfile,
      });
      
      // Invalidate any dependent queries
      queryClient.invalidateQueries({ queryKey: [USER_PROFILE_QUERY_KEY, user!.id] });
    },
  });
};

/**
 * Hook to upload a profile picture
 */
export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();
  const { user } = useAppStore();
  
  return useMutation({
    mutationFn: (file: File) =>
      userProfileService.uploadProfilePicture(user!.id, file),
    onSuccess: (updatedProfile) => {
      // Update the profile in the cache
      queryClient.setQueryData([USER_PROFILE_QUERY_KEY, user!.id], updatedProfile);
      
      // Update the current user in the store
      useAppStore.getState().setUser({
        ...user!,
        ...updatedProfile,
      });
      
      // Invalidate any dependent queries
      queryClient.invalidateQueries({ queryKey: [USER_PROFILE_QUERY_KEY, user!.id] });
    },
  });
};

/**
 * Hook to search for users
 * @param searchTerm - The search term to match against user names/emails
 * @param filters - Additional filters for the search
 */
export const useSearchUsers = (searchTerm: string, filters = {}) => {
  return useQuery({
    queryKey: [USER_PROFILES_QUERY_KEY, 'search', searchTerm, filters],
    queryFn: () => userProfileService.searchUsers(searchTerm, filters),
    enabled: !!searchTerm.trim(),
    keepPreviousData: true,
  });
};

/**
 * Hook to update email preferences
 */
export const useUpdateEmailPreferences = () => {
  const queryClient = useQueryClient();
  const { user } = useAppStore();
  
  return useMutation({
    mutationFn: (data: EmailPreferencesInput) =>
      userProfileService.updateUserProfile(user!.id, {
        notificationPreferences: {
          email: data,
        },
      } as any), // TODO: Fix type
    onSuccess: (updatedProfile) => {
      // Update the profile in the cache
      queryClient.setQueryData([USER_PROFILE_QUERY_KEY, user!.id], updatedProfile);
      
      // Update the current user in the store
      useAppStore.getState().setUser({
        ...user!,
        ...updatedProfile,
      });
      
      // Invalidate any dependent queries
      queryClient.invalidateQueries({ queryKey: [USER_PROFILE_QUERY_KEY, user!.id] });
    },
  });
};

/**
 * Hook to update notification preferences
 */
export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  const { user } = useAppStore();
  
  return useMutation({
    mutationFn: (data: NotificationPreferencesInput) =>
      userProfileService.updateUserProfile(user!.id, {
        notificationPreferences: data,
      } as any), // TODO: Fix type
    onSuccess: (updatedProfile) => {
      // Update the profile in the cache
      queryClient.setQueryData([USER_PROFILE_QUERY_KEY, user!.id], updatedProfile);
      
      // Update the current user in the store
      useAppStore.getState().setUser({
        ...user!,
        ...updatedProfile,
      });
      
      // Invalidate any dependent queries
      queryClient.invalidateQueries({ queryKey: [USER_PROFILE_QUERY_KEY, user!.id] });
    },
  });
};

/**
 * Hook to update social links
 */
export const useUpdateSocialLinks = () => {
  const queryClient = useQueryClient();
  const { user } = useAppStore();
  
  return useMutation({
    mutationFn: (data: SocialLinksInput) =>
      userProfileService.updateUserProfile(user!.id, {
        socialLinks: data,
      } as any), // TODO: Fix type
    onSuccess: (updatedProfile) => {
      // Update the profile in the cache
      queryClient.setQueryData([USER_PROFILE_QUERY_KEY, user!.id], updatedProfile);
      
      // Update the current user in the store
      useAppStore.getState().setUser({
        ...user!,
        ...updatedProfile,
      });
      
      // Invalidate any dependent queries
      queryClient.invalidateQueries({ queryKey: [USER_PROFILE_QUERY_KEY, user!.id] });
    },
  });
};

/**
 * Hook to change password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) =>
      userProfileService.updateUserProfile('current', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      } as any), // TODO: Fix type
  });
};

/**
 * Hook to update email
 */
export const useUpdateEmail = () => {
  return useMutation({
    mutationFn: (data: UpdateEmailInput) =>
      userProfileService.updateUserProfile('current', {
        email: data.email,
        currentPassword: data.currentPassword,
      } as any), // TODO: Fix type
  });
};

/**
 * Hook to delete account
 */
export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: (data: DeleteAccountInput) =>
      userProfileService.updateUserProfile('current', {
        deleteAccount: true,
        password: data.password,
      } as any), // TODO: Fix type
  });
};
