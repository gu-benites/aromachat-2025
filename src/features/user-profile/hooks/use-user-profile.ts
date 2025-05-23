import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/store';
import { userProfileService } from '../services';
import { UpdateUserProfileInput, UserProfile } from '../types/user-profile.types';

type UserProfileQueryKey = ['userProfile', string | undefined];

type AppState = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
};

export const useUserProfile = (userId?: string) => {
  const queryClient = useQueryClient();
  const currentUser = useAppStore((state: AppState) => state.user);
  const targetUserId = userId || currentUser?.id;

  // Get user profile
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery<UserProfile, Error, UserProfile, UserProfileQueryKey>({
    queryKey: ['userProfile', targetUserId],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      if (!id) {
        throw new Error('User ID is required');
      }
      return userProfileService.getUserProfile(id);
    },
    enabled: !!targetUserId,
  });

  // Update user profile
  const updateProfileMutation = useMutation<
    UserProfile,
    Error,
    UpdateUserProfileInput
  >({
    mutationFn: (data: UpdateUserProfileInput) => {
      if (!targetUserId) {
        throw new Error('User ID is required');
      }
      return userProfileService.updateUserProfile(targetUserId, data);
    },
    onSuccess: (updatedProfile) => {
      if (!targetUserId) return;
      
      // Update the profile in the cache
      queryClient.setQueryData(['userProfile', targetUserId], updatedProfile);
      
      // If this is the current user, update the user in the global store
      if (targetUserId === currentUser?.id) {
        useAppStore.getState().setUser({
          ...currentUser,
          ...updatedProfile,
        });
      }
    },
  });

  // Upload profile picture
  const uploadProfilePicture = useMutation({
    mutationFn: (file: File) => {
      if (!targetUserId) {
        throw new Error('User ID is required');
      }
      return userProfileService.uploadProfilePicture(targetUserId, file);
    },
    onSuccess: (updatedProfile) => {
      if (!targetUserId) return;
      
      // Update the profile in the cache
      queryClient.setQueryData(['userProfile', targetUserId], updatedProfile);
      
      // If this is the current user, update the user in the global store
      if (targetUserId === currentUser?.id) {
        useAppStore.getState().setUser({
          ...currentUser,
          ...updatedProfile,
        });
      }
    },
  });

  // Follow/Unfollow user
  const toggleFollowMutation = useMutation({
    mutationFn: async (isFollowing: boolean) => {
      if (!targetUserId) {
        throw new Error('User ID is required');
      }
      // These methods need to be implemented in the userProfileService
      if (isFollowing) {
        // return userProfileService.unfollowUser(targetUserId);
        throw new Error('unfollowUser not implemented');
      } else {
        // return userProfileService.followUser(targetUserId);
        throw new Error('followUser not implemented');
      }
    },
    onSuccess: () => {
      if (!targetUserId) return;
      
      // Invalidate the profile query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ['userProfile', targetUserId] });
      
      // Invalidate the user list query if it exists
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    uploadProfilePicture: uploadProfilePicture.mutateAsync,
    isUploading: uploadProfilePicture.isPending,
    toggleFollow: toggleFollowMutation.mutateAsync,
    isTogglingFollow: toggleFollowMutation.isPending,
  };
};

// Hook to fetch the current user's profile
export const useCurrentUserProfile = () => {
  const currentUser = useAppStore((state: { user: UserProfile | null }) => state.user);
  return useUserProfile(currentUser?.id);
};

// Hook to fetch a list of users (for admin or user search)
export const useUserList = (searchTerm = '', filters: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: ['users', searchTerm, filters] as const,
    queryFn: ({ queryKey }) => {
      const [, search, filterParams] = queryKey;
      return userProfileService.searchUsers(search, filterParams);
    },
  });
};
