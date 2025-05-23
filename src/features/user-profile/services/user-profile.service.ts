import { apiClient } from '@/lib/clients';
import { UserProfile, UpdateUserProfileInput } from '../types/user-profile.types';

/**
 * Service for handling user profile related API calls
 */
class UserProfileService {
  private readonly BASE_PATH = '/api/users';

  /**
   * Get a user's profile by ID
   * @param userId - The ID of the user to fetch
   * @returns The user's profile data
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    const { data } = await apiClient.get<UserProfile>(
      `${this.BASE_PATH}/${userId}/profile`
    );
    return data;
  }

  /**
   * Update a user's profile
   * @param userId - The ID of the user to update
   * @param profileData - The updated profile data
   * @returns The updated user profile
   */
  async updateUserProfile(
    userId: string,
    profileData: UpdateUserProfileInput
  ): Promise<UserProfile> {
    const { data } = await apiClient.patch<UserProfile>(
      `${this.BASE_PATH}/${userId}/profile`,
      profileData
    );
    return data;
  }

  /**
   * Upload a profile picture for a user
   * @param userId - The ID of the user
   * @param file - The image file to upload
   * @returns The updated user profile with the new picture URL
   */
  async uploadProfilePicture(
    userId: string,
    file: File
  ): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<UserProfile>(
      `${this.BASE_PATH}/${userId}/profile/picture`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  }

  /**
   * Search for users by name, email, or other criteria
   * @param searchTerm - The search term to match against user names/emails
   * @param filters - Additional filters for the search
   * @returns A list of matching user profiles
   */
  async searchUsers(
    searchTerm: string,
    filters: Record<string, unknown> = {}
  ): Promise<UserProfile[]> {
    const { data } = await apiClient.get<UserProfile[]>(
      `${this.BASE_PATH}/search`,
      {
        params: {
          q: searchTerm,
          ...filters,
        },
      }
    );
    return data;
  }
}

export const userProfileService = new UserProfileService();
