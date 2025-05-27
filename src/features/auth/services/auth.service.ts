import { createClient } from '@/lib/clients/supabase/client';
import { SignUpFormData } from '../schemas/auth.schemas';
import { getClientLogger } from '@/lib/logger/client.logger';
import { 
  AuthError,
  EmailAlreadyInUseError, 
  EmailNotVerifiedError, 
  InvalidCredentialsError, 
  RateLimitError,
  WeakPasswordError,
  UnconfirmedEmailError
} from '../errors/auth.errors';
import { AuthError as SupabaseAuthError } from '@supabase/supabase-js';

/**
 * Type guard to check if an error is an AuthApiError from Supabase
 */
function isAuthApiError(error: unknown): error is SupabaseAuthError {
  if (!error || typeof error !== 'object') return false;
  return 'status' in error && 'code' in error;
}

const logger = getClientLogger('auth:service');

/**
 * Service responsible for all authentication-related operations.
 * Implements the singleton pattern to ensure a single instance manages auth state.
 * Handles user sign-up, sign-in, sign-out, and session management.
 */
export class AuthService {
  private static instance: AuthService;
  private supabase = createClient();

  private constructor() {}

  /**
   * Gets the singleton instance of AuthService
   * @returns The singleton AuthService instance
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Registers a new user with the provided credentials
   * @param userData - User registration data
   * @returns Authentication data including the new user and session
   * @throws {EmailAlreadyInUseError} If the email is already registered
   * @throws {WeakPasswordError} If the password doesn't meet requirements
   * @throws {RateLimitError} If too many requests are made
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
   * Authenticates a user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Authentication data including the user and session
   * @throws {InvalidCredentialsError} If credentials are invalid
   * @throws {EmailNotVerifiedError} If email verification is required
   * @throws {RateLimitError} If too many failed attempts
   */
  public async signInWithPassword(email: string, password: string) {
    try {
      logger.info('Attempting user sign in', { email });
      
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Log the raw error for debugging
        const errorDetails = new Error(error.message);
        if (isAuthApiError(error)) {
          (errorDetails as any).code = error.code;
          (errorDetails as any).status = error.status;
        }
        
        // Handle unconfirmed/not verified emails
        const errorMessage = error.message.toLowerCase();
        const isUnconfirmed = errorMessage.includes('email not confirmed') || 
                           errorMessage.includes('unconfirmed') ||
                           (error as any).code === 'email_not_confirmed';
        
        // Create a properly typed error object for logging
        const logError = {
          message: error.message,
          stack: error.stack,
          name: error.name,
          isUnconfirmed,
          originalError: {
            message: error.message,
            code: (error as any).code,
            status: (error as any).status
          }
        };
        
        logger.error('Supabase auth error', logError);
        
        if (isUnconfirmed) {
          const unconfirmedError = new UnconfirmedEmailError(email);
          logger.debug('Throwing UnconfirmedEmailError', { 
            message: unconfirmedError.message,
            email,
            originalError: error 
          });
          throw unconfirmedError;
        }
        
        // Let handleAuthError handle other cases
        this.handleAuthError(error);
      }

      logger.info('User sign in successful', { userId: data.user?.id });
      return data;
    } catch (error) {
      // If it's already an UnconfirmedEmailError, re-throw it directly
      if (error instanceof UnconfirmedEmailError) {
        throw error;
      }
      
      // For other errors, log and re-throw
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorToLog = new Error(`User sign in failed: ${errorMessage}`);
      
      if (error instanceof Error) {
        errorToLog.stack = error.stack;
      }
      
      logger.error('User sign in failed', errorToLog);
      throw error;
    }
  }

  /**
   * Signs out the currently authenticated user
   * Clears the current session and authentication state
   * @throws {AuthError} If sign out fails
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
   * Resends the email confirmation to the specified email address
   * @param email - The email address to resend the confirmation to
   * @returns Promise that resolves when the email is sent
   * @throws {AuthError} If there's an error sending the confirmation email
   */
  public async resendConfirmationEmail(email: string): Promise<void> {
    try {
      logger.info('Resending confirmation email', { email });
      
      const { error } = await this.supabase.auth.resend({
        email,
        type: 'signup',
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        this.handleAuthError(error);
      }

      logger.info('Confirmation email resent successfully', { email });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('Failed to resend confirmation email', err, { email });
      throw error; // Re-throw to be handled by the caller
    }
  }

  /**
   * Handles authentication errors from Supabase and maps them to application-specific error types
   * 
   * @remarks
   * This method processes errors from Supabase auth operations and converts them into
   * more specific application error types. It handles various error scenarios including:
   * - Invalid credentials
   * - Unconfirmed email addresses
   * - Rate limiting
   * - Weak passwords
   * - Email already in use
   * 
   * @param error - The error object from Supabase or other auth operations
   * @throws {InvalidCredentialsError} When login credentials are invalid
   * @throws {EmailNotVerifiedError} When the email hasn't been verified
   * @throws {RateLimitError} When too many requests are made
   * @throws {WeakPasswordError} When password doesn't meet requirements
   * @throws {EmailAlreadyInUseError} When trying to sign up with an existing email
   * @throws {AuthError} For all other authentication errors
   */
  private handleAuthError(error: unknown): never {
    // Create a safe error object
    const safeError = error instanceof Error 
      ? error 
      : new Error(String(error));
    
    // Log the error safely
    logger.error('Auth error occurred', { 
      name: safeError.name,
      message: safeError.message,
      stack: safeError.stack 
    });

    // Check for unconfirmed email in the error message
    const errorMessage = safeError.message.toLowerCase();
    if (errorMessage.includes('unconfirmed') || 
        errorMessage.includes('email not confirmed') ||
        errorMessage.includes('verify your email')) {
      const email = (error as any).email || '';
      throw new UnconfirmedEmailError(email);
    }

    // Handle Supabase Auth API errors
    if (isAuthApiError(error)) {
      const { code, status } = error;
      
      // Handle specific error codes
      switch (code) {
        case 'email_not_confirmed': {
          const email = (error as any).email || '';
          throw new UnconfirmedEmailError(email);
        }
        case 'signup_disabled':
        case 'email_provider_disabled':
          throw new EmailNotVerifiedError();
        case 'invalid_credentials':
          throw new InvalidCredentialsError();
        case 'weak_password':
          throw new WeakPasswordError();
        case 'email_exists':
        case 'user_already_exists': {
          const userEmail = 'email' in error ? String(error.email) : '';
          throw new EmailAlreadyInUseError(userEmail);
        }
        case 'over_request_rate_limit':
        case 'over_email_send_rate_limit':
          throw new RateLimitError(60);
      }

      // Handle by status code if code wasn't matched
      switch (status) {
        case 401:
          throw new InvalidCredentialsError();
        case 403:
        case 422:
          // These statuses might indicate unconfirmed email
          if (error.message?.toLowerCase().includes('email')) {
            const email = (error as any).email || '';
            throw new UnconfirmedEmailError(email);
          }
          break;
        case 429:
          throw new RateLimitError(60);
      }
    }

    // Default to generic auth error
    const errorObj = error as { message?: string; code?: string | number; status?: number };
    throw new AuthError(
      errorObj?.message || 'An authentication error occurred',
      typeof errorObj?.code === 'string' ? errorObj.code : 'AUTH_ERROR',
      typeof errorObj?.status === 'number' ? errorObj.status : 500
    );
  }
}

// Export a singleton instance
const authService = AuthService.getInstance();

// Export individual methods for easier imports
export const {
  signUp,
  signInWithPassword,
  signOut,
  getSession,
  getUser,
  updatePassword,
  resendConfirmationEmail,
} = authService;

export { authService };