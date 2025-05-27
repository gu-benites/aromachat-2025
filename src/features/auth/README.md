# Authentication System

This module implements a secure, scalable authentication system for AromaChat using **Supabase Auth** as the identity provider. It follows modern security best practices and provides a seamless authentication experience across the application.

## Features

- 🔐 Email/Password Authentication
- 🔄 Session Management
- 🔄 User Profile Management
- 🔒 Secure Password Reset Flow
- 🚀 Server-Side Authentication
- 🔄 OAuth Integration (via Supabase)
- 🔄 Email Verification

## Architecture

The authentication system is built with a clear separation of concerns:

```
src/features/auth/
├── components/           # UI Components
│   ├── auth-forms/       # Form components for auth flows
│   └── auth-layout.tsx   # Layout wrapper for auth pages
├── hooks/                # Custom React hooks
│   └── use-auth.ts       # Main auth hook
├── queries/              # React Query hooks
│   ├── use-auth-queries.ts
│   └── use-auth-mutations.ts
├── schemas/              # Validation schemas
│   └── auth.schemas.ts
├── services/             # Business logic
│   └── auth.service.ts
├── types/                # TypeScript types
│   └── auth.types.ts
└── utils/                # Utility functions
    └── api-auth.utils.ts
```

## Core Components

### 1. AuthService

Central service handling all authentication logic:

```typescript
class AuthService {
  // Singleton pattern
  private static instance: AuthService;
  
  // Core methods
  async signUp(userData: SignUpFormData)
  async signInWithPassword(email: string, password: string)
  async signOut()
  async getSession()
  async getUser()
  async updatePassword(newPassword: string)
}
```

### 2. React Query Hooks

#### useAuthQueries
- `useSession()`: Get current auth session
- `useUser()`: Get current user data
- `useSignIn()`: Handle sign in
- `useSignUp()`: Handle user registration
- `useSignOut()`: Handle sign out
- `useUpdatePassword()`: Update user password

### 3. useAuth Hook

A convenient hook that combines session, user, and profile data:

```typescript
const {
  authUser,          // Combined user + profile data
  session,           // Current auth session
  isAuthenticated,   // Auth state
  isLoading,         // Loading state
  error,             // Error state
  signOut,           // Sign out function
  reloadUserProfile  // Refresh user data
} = useAuth();
```

## Authentication Flows

### 1. User Registration

1. User submits registration form
2. Client validates input using Zod schemas
3. `AuthService.signUp()` is called
4. Supabase creates user and sends verification email
5. User verifies email through confirmation link

### 2. User Login

1. User submits login form
2. Client validates input
3. `useSignIn()` mutation is called
4. On success, user is redirected to dashboard
5. Session is stored in HTTP-only cookies

### 3. Password Reset

1. User requests password reset
2. Reset email with token is sent
3. User submits new password
4. Token is validated and password is updated

## Security Features

- 🔒 JWT-based authentication
- 🔄 Short-lived access tokens
- 🔄 Secure token refresh
- 🔒 CSRF protection
- 🔒 Rate limiting
- 🔒 Secure password policies
- 🔒 Email verification

## Usage Examples

### Protecting Routes

```typescript
// app/dashboard/page.tsx
'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Unauthorized</div>;

  return <div>Protected Content</div>;
}
```

### Server-Side Authentication

```typescript
// app/api/protected/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from '@/features/auth/utils/api-auth.utils';

export async function GET(request: Request) {
  const session = await getServerSession(request);
  
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  return NextResponse.json({ data: 'Protected Data' });
}
```

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Error Handling

The system provides detailed error handling with specific error types:

- `AuthError`: Base authentication error
- `EmailAlreadyInUseError`: Email is already registered
- `InvalidCredentialsError`: Invalid login credentials
- `WeakPasswordError`: Password doesn't meet requirements
- `EmailNotVerifiedError`: Email needs verification
- `RateLimitError`: Too many requests

## Testing

Run the test suite:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
