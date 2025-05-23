# useAuth Hook: Authentication & User State Management
**Canonical Import:** `import { useAuth } from '@/features/auth/hooks'`

## Core Architecture
1. **useAuth is THE Interface**: Primary UI touchpoint for all auth state & actions.
2. **Session Source**: Consumes AuthSessionContext (from @/providers/auth-session-provider.tsx) for raw Supabase Session & loading state. Provider handles Supabase listener.
3. **Profile Data (SSOT)**: Via React Query's useUserProfileQuery (from @/features/user-profile/queries/).
4. **Zustand (Optional)**: For minimal global auth status (e.g., @/store/slices/global-auth-status.slice.ts) if needed outside React flow. useAuth prioritizes Context + React Query.
5. **Error Logging**: Use getClientLogger('useAuth') (from @/lib/logger/client.logger.ts); reports to /api/logs/client.

**Important Note - `useAuth` Data Flow:** While `useAuth` is the primary interface for UI components, remember its derived nature.
*   For raw Supabase session state (`session`, `isLoadingSession`), the source of truth is `AuthSessionContext` (managed by `AuthSessionProvider`).
*   For application-specific user profile data, the source of truth is `useUserProfileQuery` (from `@/features/user-profile/queries/`).
*   `authUser`, `isAuthenticated`, `isLoadingAuth` are derived from these sources. When debugging or modifying auth behavior, trace logic back to these foundational pieces.

## Key Capabilities
Enables:
- Reliable auth status checks (session, profile loaded)
- Access to combined Supabase user + app profile data
- Standardized logout & profile refresh
- Clear loading/error states for auth processes
- Secure conditional rendering & authenticated data fetching

## Dependencies
- @supabase/ssr (createBrowserClient in @/lib/clients/supabase.ts)
- @tanstack/react-query (useUserProfileQuery, useQueryClient)
- react (useContext, useMemo, useCallback)
- @/providers/auth-session-provider.tsx (AuthSessionContext)
- @/lib/clients/supabase.ts (Client setup)
- @/features/user-profile/queries/ (Query definitions)
- @/lib/logger/client.logger.ts (Client logger)
- @/features/user-profile/types/ (Type definitions)

**Key Functionality Provided by useAuth:**
* *   authUser: An object combining Supabase User properties with custom application UserProfile data. Null if not fully authenticated and profile loaded.
* *   session: The raw Supabase Session object (from AuthSessionContext).
* *   hasActiveSession: Boolean, true if a Supabase session exists.
* *   isUserProfileLoaded: Boolean, true if the application-specific user profile has been successfully fetched.
* *   isAuthenticated: Boolean, true if hasActiveSession is true AND isUserProfileLoaded is true. This is the primary flag for "fully logged in and ready."
* *   isLoadingAuth: Boolean, true if the initial session check is ongoing OR if a session exists but the user profile is still fetching.
* *   authError: An error object if profile fetching fails. Session acquisition errors are handled and logged within auth-session-provider.tsx.
* *   logout: An asynchronous function to sign the user out via Supabase.
* *   reloadUserProfile: An asynchronous function to manually trigger a re-fetch of the user's application profile data.

## Quick Rules **ALWAYS:**
1. Import from `@/features/auth/hooks`
2. Check `isLoadingAuth` first, then `isAuthenticated`
3. Access user data via `authUser` (combined Supabase + profile)
4. Use `logout()` for sign-out
5. Wrap app root with `AuthSessionProvider`

## Usage
1. **Required Provider**
   ```tsx
   // In _app.tsx or root layout
   <AuthSessionProvider>
     <App />
   </AuthSessionProvider>
   ```
2. **In Components**
   ```tsx
   import { useAuth } from '@/features/auth/hooks';  
   function MyComponent() {
     const { 
       authUser,         // Combined user data
       isAuthenticated,  // true if session + profile loaded
       isLoadingAuth,    // true during initial load
       logout,           // Sign out function
       reloadUserProfile // Refresh profile data
     } = useAuth();   
     // Handle loading/error states first
     if (isLoadingAuth) return <LoadingSpinner />;
     if (!isAuthenticated) return <LoginPrompt />;
     
     // Safe to use authUser
     return <div>Hello, {authUser.displayName}</div>;
   }
   ```
## Best Practices
1. **Error Handling**
   - Always handle `isLoadingAuth` and `authError` states
   - Use error boundaries for unexpected errors
2. **Data Fetching**
   - Use React Query for server state
   - Leverage `enabled` option for auth-dependent queries:
     ```tsx
     const { data } = useQuery({
       queryKey: ['protected-data'],
       queryFn: fetchProtectedData,
       enabled: isAuthenticated // Only run when authenticated
     });
     ```
3. **Performance**
   - Use `useMemo` for derived state
   - Memoize callbacks with `useCallback`
   - Consider code splitting for auth-related components
4. **Testing**
   - Mock `useAuth` in component tests
   - Test all auth states (loading, authenticated, unauthenticated, error)
   - Verify protected routes and redirects
## Conceptual AuthSessionContext (Expected from src/providers/auth-session-provider.tsx):
```typescript
interface AuthSessionContextType {
  session: Session | null;
  isLoadingSession: boolean;
  sessionError: Error | null; // Error specifically from Supabase session management
  supabaseClient: SupabaseClient; // The initialized browser client
}
```
## Conceptual useAuth Hook Example:
```typescript
// src/features/auth/hooks/useAuth.ts (Conceptual Outline)

// --- Core Imports (Illustrative) ---
import { useContext, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Session, User as SupabaseAuthUser } from '@supabase/supabase-js'; // From Supabase

// --- Project-Specific Imports (Illustrative Paths) ---
import { AuthSessionContext } from '@/providers/auth-session-provider'; // Expected context
import { useUserProfileQuery } from '@/features/user-profile/queries'; // Specific query hook
import type { UserProfile } from '@/features/user-profile/types';       // App-specific profile type
import { getClientLogger } from '@/lib/logger/client.logger';           // Standard logger

// --- Logger Initialization ---
// const logger = getClientLogger('useAuth'); // Initialize as needed
// --- Combined User Type Definition ---
export interface AuthenticatedUser extends SupabaseAuthUser, UserProfile {
  // Represents the merged Supabase user and application-specific profile.
  // Handle potential property name conflicts during implementation.
}
// --- The `useAuth` Hook ---
export const useAuth = () => {
  // 1. Access Session State from Context:
  //    - Provided by `AuthSessionProvider` which handles Supabase auth listener.
  //    - Destructure `session`, `isLoadingSession`, `sessionError`, `supabaseClient`.
  //    Example: const { session, isLoadingSession, sessionError, supabaseClient } = useContext(AuthSessionContext);
  //    Handle context not being available (throw error if outside provider).
  // 2. Fetch Application-Specific User Profile:
  //    - Use `useUserProfileQuery` from `@/features/user-profile/queries/`.
  //    - Pass `session?.user?.id` as the user ID for the query.
  //    - Enable the query only if a valid `session` and `userId` exist and no `sessionError`.
  //    - Destructure `data` (as `userProfile`), `isLoading` (as `isLoadingProfile`), `error` (as `profileError`), `refetch`.
  //    Example: const { data: userProfile, isLoading: isLoadingProfile, ... } = useUserProfileQuery(userId, { enabled: !!userId && !sessionError });
  // 3. Derive Authenticated States:
  //    - `hasActiveSession`: Based on `session` presence and no `sessionError`.
  //    - `isUserProfileLoaded`: Based on `userProfile` presence and no `profileError`.
  //    - `isAuthenticated`: True if both `hasActiveSession` and `isUserProfileLoaded` are true.
  //    - `isLoadingAuth`: True if `isLoadingSession` is true, OR if `hasActiveSession` but `isLoadingProfile` and profile not yet loaded.
  //    - `authError`: Combine `sessionError` (if critical) and `profileError`.
  // 4. Construct Combined `authUser` Object:
  //    - Use `useMemo` to combine `session.user` and `userProfile` into `AuthenticatedUser`.
  //    - Returns `null` if not fully `isAuthenticated`.
  //    Example: const authUser = useMemo(() => isAuthenticated ? { ...session.user, ...userProfile } : null, [isAuthenticated, session, userProfile]);
  // 5. Implement `logout` Function:
  //    - Use `useCallback`.
  //    - Call `supabaseClient.auth.signOut()`.
  //    - Log any errors.
  //    - Clear React Query cache (`queryClient.clear()`) to prevent stale data.
  //    - The `AuthSessionProvider`'s listener will handle session state update.
  // 6. Implement `reloadUserProfile` Function:
  //    - Use `useCallback`.
  //    - Call the `refetch` function obtained from `useUserProfileQuery`.
  //    - Log any errors.
  //    - Ensure it only attempts to refetch if a `userId` is available.
  // 7. Return Hook API:
  //    - Expose `authUser`, `session`, `isAuthenticated`, `isLoadingAuth`, `authError`, `logout`, `reloadUserProfile`,
  //      `hasActiveSession`, `isUserProfileLoaded`.
  return {
    // authUser: ...,
    // session: ...,
    // isAuthenticated: ...,
    // isLoadingAuth: ...,
    // authError: ...,
    // logout: ...,
    // reloadUserProfile: ...,
    // hasActiveSession: ...,
    // isUserProfileLoaded: ...,
  };
};