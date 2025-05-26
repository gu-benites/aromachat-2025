# Authentication Feature

This module implements the core authentication workflow for AromaChat following the Bedrock architecture and security best practices. It provides a secure, scalable authentication system using **Supabase Auth** as the identity provider.

## Security First Principles

1. **Zero Trust Architecture**
   - All routes are protected by default
   - Explicit authentication checks for all sensitive operations
   - Principle of least privilege for all permissions

2. **Defense in Depth**
   - Multiple layers of validation (client, server, database)
   - Rate limiting on authentication endpoints
   - Secure session management with short-lived tokens

3. **Data Protection**
   - All sensitive data encrypted at rest and in transit
   - Secure password hashing using industry-standard algorithms
   - No sensitive data in client-side storage

## Core Security Features

### Authentication Flows
- **User Registration**
  - Email/password sign-up with server-side validation
  - Email verification requirement
  - Password strength enforcement (minimum 12 characters, mixed case, numbers, special chars)
  - Rate limiting on registration attempts

- **User Login**
  - Secure credential handling with React Hook Form
  - Server-side validation of all inputs
  - Protection against brute force attacks
  - Session fixation protection

- **Password Management**
  - Secure password reset flow with expiring tokens
  - No password hints or security questions
  - Password change requires current password verification
  - Password history to prevent reuse

- **Session Management**
  - Short-lived access tokens (15 min)
  - Secure, HTTP-only cookies for token storage
  - Server-side session validation on each request
  - Automatic token rotation and refresh

### Security Headers
All authentication endpoints include:
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy` with strict directives
- `X-XSS-Protection: 1; mode=block`

## Architecture

### Layer Separation

1. **Presentation Layer**
   - React components for UI rendering
   - Form handling with React Hook Form
   - Client-side validation with Zod

2. **Application Layer**
   - Server Actions for form submissions
   - Request validation
   - Error handling and logging

3. **Domain Layer**
   - Business logic and rules
   - Authentication workflows
   - Authorization checks

4. **Infrastructure Layer**
   - Supabase client configuration
   - Token management
   - Session storage

### Core Components

- `AuthSessionProvider`: Manages the raw Supabase session state
- `useAuth`: Hook for accessing auth state and methods
- Server Actions: Handle form submissions with CSRF protection
- Services: Encapsulate Supabase interactions

## Project Structure

```
src/features/auth/
├── actions.ts                # Server Actions with CSRF protection
├── components/               # UI components (client-side only)
│   └── auth-forms/          
│       ├── login-form.tsx    
│       ├── register-form.tsx 
│       └── forgot-password-form.tsx
├── hooks/                   
│   ├── use-auth.ts           # Main auth hook with session state
│   └── use-require-auth.ts   # Route protection hook
├── queries/                 
│   ├── auth.queries.ts       # Auth queries with caching
│   └── use-auth-mutations.ts # Mutations with error handling
├── schemas/                 
│   └── auth.schemas.ts       # Validation schemas
├── services/                
│   ├── auth.service.ts       # Client auth operations
│   └── server-auth.service.ts # Server-side auth operations
├── types/                   
│   └── auth.types.ts         # Type definitions
├── utils/                   
│   ├── auth-utils.ts         # Auth utilities
│   ├── rate-limit.ts        # Rate limiting
│   └── security-headers.ts   # Security middleware
└── README.md               
```

## Security Controls

1. **Input Validation**
   - All user inputs validated with Zod schemas
   - Server-side validation for all API requests
   - Sanitization of all dynamic content

2. **Authentication**
   - JWT-based authentication with short-lived tokens
   - Secure cookie storage with HttpOnly and SameSite=Strict
   - CSRF protection for all state-changing operations

3. **Session Management**
   - Short-lived access tokens (15 min)
   - Secure refresh token rotation
   - Server-side session invalidation on logout

4. **Rate Limiting**
   - Login attempts: 5 per minute per IP
   - Password reset: 3 per hour per account
   - API endpoints: 100 requests per minute per IP

## Implementation Guidelines

### Client Components

```typescript
// components/protected-route.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [isAuthenticated, isLoadingAuth, router]);

  if (isLoadingAuth) {
    return <div>Verifying session...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
}
```

### Server Components/Actions

```typescript
// app/api/protected-route/route.ts
import { NextResponse } from 'next/server';
import { getServerAuthenticatedUser } from '@/features/auth/utils/api-auth.utils';

export async function GET() {
  const user = await getServerAuthenticatedUser();
  
  if (!user) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // User is authenticated, proceed with the request
  return NextResponse.json({ data: 'Protected data' });
}
```

### Available Hooks & Utilities

- `useAuth()`: Access auth state and methods
- `useRequireAuth()`: Protect client-side routes
- `useSession()`: Access current session data
- `withAuth()`: HOC for protected routes
- `getServerSession()`: Get session in server components
- `requireAuth()`: Protect API routes and server actions

## Error Handling & Logging

### Error Types

1. **Authentication Errors**
   - Invalid credentials
   - Expired sessions
   - CSRF validation failures
   - OAuth callback errors

2. **Authorization Errors**
   - Insufficient permissions
   - Rate limit exceeded
   - Invalid access tokens

3. **Validation Errors**
   - Invalid input formats
   - Missing required fields
   - Business rule violations

### Logging Strategy

- **Client-side**: Log errors to monitoring service (e.g., Sentry)
- **Server-side**: Structured logging with request context
- **Sensitive Data**: Never log credentials or tokens
- **Audit Logs**: Record all authentication events

### Error Responses

All error responses follow the format:
```typescript
{
  "error": {
    "code": "error_code",
    "message": "User-friendly message",
    "details": {} // Additional error context
  }
}
```

## Security Testing

### Automated Testing

1. **Unit Tests**
   - Auth service methods
   - Validation logic
   - Utility functions

2. **Integration Tests**
   - Authentication flows
   - Session management
   - Error conditions

3. **Security Tests**
   - OWASP ZAP scanning
   - Dependency vulnerability scanning
   - Secrets detection

### Manual Testing

1. **Authentication**
   - Test all auth flows
   - Verify session handling
   - Check error conditions

2. **Authorization**
   - Role-based access control
   - Permission boundaries
   - Token validation

3. **Security Headers**
   - Verify all security headers
   - Test CORS configuration
   - Check for information leakage

## Security Hardening

### Environment Configuration

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Required for OAuth callbacks

# Security Headers
CONTENT_SECURITY_POLICY="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'"
STRICT_TRANSPORT_SECURITY="max-age=31536000; includeSubDomains"
X_CONTENT_TYPE_OPTIONS="nosniff"
X_FRAME_OPTIONS="DENY"
X_XSS_PROTECTION="1; mode=block"

# Rate Limiting
AUTH_RATE_LIMIT=5
AUTH_RATE_WINDOW_MS=60000

# Session Configuration
NEXT_PUBLIC_SUPABASE_COOKIE_NAME=aroma_auth_token
NEXT_PUBLIC_SUPABASE_COOKIE_LIFETIME=3600  # 1 hour
```

### Security Notes
- Never commit `.env` files to version control
- Use environment variables for all sensitive configuration
- Ensure proper CORS configuration in your Supabase project
- Set up proper redirect URLs in your Supabase dashboard

### Dependencies

```bash
# Core dependencies
npm install @supabase/supabase-js @supabase/ssr

# Form handling
npm install @hookform/resolvers zod react-hook-form

# Security
npm install @hapi/rate-limit csrf helmet
```

### Implementation Example

```tsx
// app/login/page.tsx
'use client';

import { LoginForm } from '@/features/auth/components/auth-forms/login-form';
import { SecurityHeaders } from '@/features/auth/utils/security-headers';

export default function LoginPage() {
  return (
    <>
      <SecurityHeaders />
      <div className="container mx-auto flex min-h-screen items-center justify-center">
        <LoginForm />
      </div>
    </>
  );
}
```

## Secure Route Configuration

### Route Structure

```
src/app/
├── (auth)/                      # Public auth routes
│   ├── login/page.tsx           # Login page
│   ├── register/page.tsx        # Registration page
│   ├── forgot-password/page.tsx # Password reset request
│   └── reset-password/page.tsx  # Password reset form
├── (app)/                       # Protected application routes
│   ├── dashboard/page.tsx
│   └── settings/page.tsx
└── api/auth/                    # Auth API endpoints
    ├── login/route.ts
    ├── register/route.ts
    └── logout/route.ts
```

### Route Protection

1. **Public Routes**
   - Accessible without authentication
   - Redirect authenticated users to dashboard
   - Example: Login, Register, Forgot Password

2. **Protected Routes**
   - Require authentication
   - Redirect unauthenticated users to login
   - Example: Dashboard, Settings, Profile

3. **API Routes**
   - Require CSRF token
   - Rate limited
   - Input validated

### Middleware

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = ['/login', '/register', '/forgot-password'].includes(path);
  
  // Handle auth routes
  if (isPublicPath && isAuthenticated(request)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Protect non-public routes
  if (!isPublicPath && !isAuthenticated(request)) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(path)}`, request.url)
    );
  }
  
  // Apply security headers
  const response = NextResponse.next();
  applySecurityHeaders(response);
  
  return response;
}

// Apply to all routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## API Reference

### Auth Service

#### `signIn(credentials: { email: string; password: string })`

Authenticates a user with email and password.

**Example:**
```typescript
import { signIn } from '@/features/auth/services/auth.service';

const { user, session } = await signIn({
  email: 'user@example.com',
  password: 'securepassword123'
});
```

#### `signUp(params: { email: string; password: string; fullName: string })`

Creates a new user account.

**Example:**
```typescript
import { signUp } from '@/features/auth/services/auth.service';

const { user, error } = await signUp({
  email: 'newuser@example.com',
  password: 'securepassword123',
  fullName: 'John Doe'
});
```

#### `signOut()`

Signs out the current user.

**Example:**
```typescript
import { signOut } from '@/features/auth/services/auth.service';

await signOut();
```

#### `resetPassword({ email: string, redirectTo: string })`

Sends a password reset email to the specified address.

**Example:**
```typescript
import { resetPassword } from '@/features/auth/services/auth.service';

await resetPassword({
  email: 'user@example.com',
  redirectTo: 'https://yourapp.com/reset-password'
});
```

### React Hooks

#### `useSignIn()`

React Query mutation for handling user sign-in.

**Example:**
```typescript
import { useSignIn } from '@/features/auth/hooks/use-auth';

const { mutate: signIn, isLoading } = useSignIn();

// In your component:
signIn({
  email: 'user@example.com',
  password: 'securepassword123'
});
```

## Form Validation

All forms use `react-hook-form` with `zod` for validation. The validation schemas are defined in each form component.

**Example Schema:**
```typescript
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
```

## Error Handling

- Form validation errors are displayed below each field
- API errors are shown as toast notifications
- Session-related errors automatically redirect to the login page

## Security Considerations

- Passwords are never stored in local storage
- All auth tokens are stored in HTTP-only cookies
- CSRF protection is enabled via Supabase
- Password reset tokens are single-use and expire after 24 hours

## Testing

Run the test suite:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Last updated: May 25, 2025
