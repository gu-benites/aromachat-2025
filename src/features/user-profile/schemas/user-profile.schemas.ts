import { z } from 'zod';

/**
 * Schema for updating a user's basic profile information
 */
export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters')
    .optional(),
  
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .or(z.literal('')),
    
  website: z
    .string()
    .url('Please enter a valid URL')
    .or(z.literal(''))
    .optional(),
    
  location: z
    .string()
    .max(100, 'Location must be less than 100 characters')
    .optional(),
    
  dateOfBirth: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Please enter a valid date in YYYY-MM-DD format'
    )
    .optional()
    .or(z.literal('')),
    
  gender: z
    .enum(['male', 'female', 'non-binary', 'other', 'prefer-not-to-say'], {
      errorMap: () => ({ message: 'Please select a valid gender option' }),
    })
    .optional(),
});

/**
 * Schema for updating a user's email preferences
 */
export const emailPreferencesSchema = z.object({
  marketingEmails: z.boolean().default(false),
  productUpdates: z.boolean().default(true),
  securityAlerts: z.boolean().default(true),
  newsletter: z.boolean().default(false),
});

/**
 * Schema for updating a user's notification preferences
 */
export const notificationPreferencesSchema = z.object({
  email: z.boolean().default(true),
  push: z.boolean().default(true),
  inApp: z.boolean().default(true),
  mentions: z.boolean().default(true),
  comments: z.boolean().default(true),
  messages: z.boolean().default(true),
  recommendations: z.boolean().default(true),
});

/**
 * Schema for updating a user's social links
 */
export const socialLinksSchema = z.object({
  twitter: z
    .string()
    .url('Please enter a valid URL')
    .or(z.literal(''))
    .optional(),
  facebook: z
    .string()
    .url('Please enter a valid URL')
    .or(z.literal(''))
    .optional(),
  instagram: z
    .string()
    .url('Please enter a valid URL')
    .or(z.literal(''))
    .optional(),
  linkedin: z
    .string()
    .url('Please enter a valid URL')
    .or(z.literal(''))
    .optional(),
  youtube: z
    .string()
    .url('Please enter a valid URL')
    .or(z.literal(''))
    .optional(),
  github: z
    .string()
    .url('Please enter a valid URL')
    .or(z.literal(''))
    .optional(),
});

/**
 * Schema for changing a user's password
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });

/**
 * Schema for updating a user's email
 */
export const updateEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  currentPassword: z.string().min(1, 'Current password is required'),
});

/**
 * Schema for deleting a user's account
 */
export const deleteAccountSchema = z.object({
  confirm: z.literal(true, {
    errorMap: () => ({
      message: 'You must confirm that you want to delete your account',
    }),
  }),
  password: z.string().min(1, 'Please enter your password to confirm'),
});

// Export types
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type EmailPreferencesInput = z.infer<typeof emailPreferencesSchema>;
export type NotificationPreferencesInput = z.infer<
  typeof notificationPreferencesSchema
>;
export type SocialLinksInput = z.infer<typeof socialLinksSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
