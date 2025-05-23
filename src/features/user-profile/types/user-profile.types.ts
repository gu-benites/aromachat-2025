import { z } from 'zod';

/**
 * User profile schema for validation
 */
export const userProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().nullable(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  avatarUrl: z.string().url('Please enter a valid URL').optional().nullable(),
  coverImageUrl: z.string().url('Please enter a valid URL').optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.enum(['male', 'female', 'non-binary', 'other', 'prefer-not-to-say']).optional(),
  phoneNumber: z.string().optional().nullable(),
  preferredLanguage: z.string().optional(),
  timezone: z.string().optional(),
  isEmailVerified: z.boolean().optional(),
  isProfilePublic: z.boolean().optional(),
  notificationPreferences: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    sms: z.boolean().optional(),
  }).optional(),
  socialLinks: z.object({
    twitter: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    facebook: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    instagram: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    linkedin: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    youtube: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    github: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  }).optional(),
});

/**
 * Type for the user profile data
 */
export type UserProfile = z.infer<typeof userProfileSchema> & {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  joinDate?: string;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  followedBy?: Array<{
    id: string;
    name: string;
    avatarUrl?: string;
  }>;
};

/**
 * Type for updating a user profile
 */
export type UpdateUserProfileInput = Partial<z.infer<typeof userProfileSchema>>;

/**
 * Type for user profile search results
 */
export interface UserProfileSearchResult {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  lastActiveAt?: string;
}

/**
 * Type for user profile statistics
 */
export interface UserProfileStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  commentsCount: number;
}

/**
 * Type for user profile with extended data
 */
export interface ExtendedUserProfile extends UserProfile {
  stats: UserProfileStats;
  isFollowing?: boolean;
  isFollower?: boolean;
  isBlocked?: boolean;
  hasBlockedYou?: boolean;
}
