/**
 * Base error class for authentication-related errors
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AuthError';
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      ...(this.details && { details: this.details }),
    };
  }
}

// Specific auth error types
export class InvalidCredentialsError extends AuthError {
  constructor(details?: Record<string, unknown>) {
    super('Invalid email or password', 'INVALID_CREDENTIALS', 401, details);
    this.name = 'InvalidCredentialsError';
  }
}

export class EmailAlreadyInUseError extends AuthError {
  constructor(email: string) {
    super('Email is already in use', 'EMAIL_IN_USE', 409, { email });
    this.name = 'EmailAlreadyInUseError';
  }
}

export class WeakPasswordError extends AuthError {
  constructor() {
    super(
      'Password does not meet requirements',
      'WEAK_PASSWORD',
      400,
      {
        requirements: {
          minLength: 8,
          requireUppercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
        },
      }
    );
    this.name = 'WeakPasswordError';
  }
}

export class InvalidTokenError extends AuthError {
  constructor() {
    super('Invalid or expired token', 'INVALID_TOKEN', 401);
    this.name = 'InvalidTokenError';
  }
}

export class RateLimitError extends AuthError {
  constructor(retryAfter?: number) {
    super(
      'Too many requests, please try again later',
      'RATE_LIMIT_EXCEEDED',
      429,
      retryAfter ? { retryAfter } : undefined
    );
    this.name = 'RateLimitError';
  }
}

/**
 * Error thrown when a user attempts to sign in with an unverified email
 */
export class EmailNotVerifiedError extends AuthError {
  constructor(message: string = 'Please verify your email address before signing in') {
    super(message, 'EMAIL_NOT_VERIFIED', 403, {
      action: 'resend-verification',
      message: 'A verification email has been sent to your email address'
    });
    this.name = 'EmailNotVerifiedError';
  }
}

/**
 * Error thrown when a user attempts to sign in with an unconfirmed email
 */
export class UnconfirmedEmailError extends AuthError {
  constructor(email: string) {
    super(
      'Your email address has not been confirmed yet', 
      'EMAIL_UNCONFIRMED', 
      403,
      { 
        email,
        action: 'resend-confirmation',
        message: 'Please check your email for a confirmation link or request a new one'
      }
    );
    this.name = 'UnconfirmedEmailError';
  }
}

export class SessionExpiredError extends AuthError {
  constructor() {
    super('Session has expired', 'SESSION_EXPIRED', 401);
    this.name = 'SessionExpiredError';
  }
}

// Helper type for auth error codes
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_IN_USE'
  | 'WEAK_PASSWORD'
  | 'INVALID_TOKEN'
  | 'RATE_LIMIT_EXCEEDED'
  | 'EMAIL_NOT_VERIFIED'
  | 'EMAIL_UNCONFIRMED'
  | 'SESSION_EXPIRED'
  | 'UNKNOWN_ERROR';
