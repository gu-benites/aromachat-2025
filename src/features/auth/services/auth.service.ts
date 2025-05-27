import { createClient } from '@/lib/clients/supabase/client';
import { SignUpFormData } from '../schemas/auth.schemas';
import { getClientLogger } from '@/lib/logger/client.logger';
import { 
  AuthError,
  EmailAlreadyInUseError, 
  InvalidCredentialsError, 
  WeakPasswordError,
  EmailNotVerifiedError,
  RateLimitError
} from '../errors/auth.errors';

type ApiError = Error & {
  status?: number;
  code?: string;
  email?: string;
  retryAfter?: number;
  message: string;
};

function isApiError(error: unknown): error is ApiError {
  return error instanceof Error;
}

const logger = getClientLogger('auth:service');

/**
 * Service for handling authentication operations
 */
export class AuthService {
  private static instance: AuthService;
  private supabase = createClient();

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Register a new user
   */
  public async signUp({ email, password, firstName, lastName }: SignUpFormData) {
    try {
      logger.info('Attempting user registration', { email });
      
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        this.handleAuthError(error);
      }

      logger.info('User registration successful', { userId: data.user?.id });
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('User registration failed', err, { email });
      throw error; // Re-throw to be handled by the caller
    }
  }

  /**
   * Sign in with email and password
   */
  public async signInWithEmail(email: string, password: string) {
    try {
      logger.info('Attempting user sign in', { email });
      
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        this.handleAuthError(error);
      }

      logger.info('User sign in successful', { userId: data.user?.id });
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('User sign in failed', err, { email });
      throw error; // Re-throw to be handled by the caller
    }
  }

  /**
   * Sign out the current user
   */
  public async signOut() {
    try {
      logger.info('Attempting user sign out');
      
      const { error } = await this.supabase.auth.signOut();
      
      if (error) {
        this.handleAuthError(error);
      }

      logger.info('User signed out successfully');
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('User sign out failed', err);
      throw error; // Re-throw to be handled by the caller
    }
  }

  /**
   * Get the current session
   */
  public async getSession() {
    try {
      logger.debug('Fetching current session');
      
      const { data, error } = await this.supabase.auth.getSession();
      
      if (error) {
        this.handleAuthError(error);
      }

      return data.session;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('Failed to get session', err);
      throw error; // Re-throw to be handled by the caller
    }
  }

  /**
   * Get the current user
   */
  public async getUser() {
    try {
      logger.debug('Fetching current user');
      
      const { data, error } = await this.supabase.auth.getUser();
      
      if (error) {
        this.handleAuthError(error);
      }

      return data.user;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('Failed to get user', err);
      throw error; // Re-throw to be handled by the caller
    }
  }

  /**
   * Update user password
   */
  public async updatePassword(newPassword: string) {
    try {
      logger.info('Attempting to update password');
      
      const { data, error } = await this.supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        this.handleAuthError(error);
      }

      logger.info('Password updated successfully');
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('Failed to update password', err);
      throw error; // Re-throw to be handled by the caller
    }
  }

  /**
   * Handle authentication errors and throw appropriate custom errors
   */
  private handleAuthError(error: unknown): never {
    const err = error instanceof Error ? error : new Error(String(error));
    
    // Log the error with any additional context
    logger.error('Auth error occurred', err);

    // If it's not an API error, throw a generic auth error
    if (!isApiError(error)) {
      throw new AuthError(
        err.message,
        'AUTH_ERROR',
        500
      );
    }

    // Map Supabase auth errors to our custom errors
    if (typeof error.status === 'number') {
      switch (error.status) {
        case 400:
          if (error.message?.includes('password')) {
            throw new WeakPasswordError();
          }
          break;
        case 401:
          if (error.message?.includes('Invalid login credentials')) {
            throw new InvalidCredentialsError();
          }
          break;
        case 409:
          throw new EmailAlreadyInUseError(error.email || '');
        case 422:
          if (error.message?.includes('email not confirmed')) {
            throw new EmailNotVerifiedError();
          }
          break;
        case 429:
          throw new RateLimitError(error.retryAfter);
      }
    }

    // Default to generic auth error with the original error's details
    throw new AuthError(
      error.message || 'An authentication error occurred',
      error.code || 'AUTH_ERROR',
      typeof error.status === 'number' ? error.status : 500
    );
  }
}

// Export a singleton instance
export const authService = AuthService.getInstance();