# Service Implementation Cheat Sheet
**Refer to: `auth-api-guidelines.md`, `project-structure-guidelines.md`, `essential-hook-guidelines.md` for foundational rules.**

## 1. Service File Structure & Location
- **Location**: `src/features/{feature-name}/services/{service-name}.service.ts`
- **Exports**: Primarily through the feature's main barrel file: `src/features/{feature-name}/index.ts`. Explicitly name exports in the feature's `index.ts` for clarity (e.g., `export { getUserProfileById, updateUserProfile } from './services/user-profile.service';`).
- **Example**:
````
src/features/  
└── user-profile/  
├── services/  
│ ├── user-profile.service.ts  
│ └── user-profile.service.test.ts // Co-located test file  
└── index.ts // Exports from user-profile.service
````
## 2. Core Implementation Pattern (Functional)
Services encapsulate business logic and data access. They should be stateless and throw errors on failure.

```typescript
// src/features/user-profile/services/user-profile.service.ts
import { getServerLogger } from '@/lib/logger';
import { validatedConfig } from '@/config/env'; // Access validated ENV VARS
import { createSupabaseServerClient } from '@/lib/clients/supabase'; // Server-side Supabase client
import { cookies } from 'next/headers';
import type { UserProfile, UpdateUserProfilePayload } from '../types/user-profile.types';

const logger = getServerLogger('UserProfileService');

// --- Предполагаемые пользовательские классы ошибок (обычно определяются в другом месте) ---
// export class DatabaseOperationError extends Error {
//   constructor(message: string, public errorCode?: string) {
//     super(message);
//     this.name = 'DatabaseOperationError';
//   }
// }
// export class ProfileNotFoundError extends Error {
//   constructor(userId: string) {
//     super(`Profile not found for user ${userId}.`);
//     this.name = 'ProfileNotFoundError';
//   }
// }
// export class UnexpectedServiceError extends Error {
//   constructor(message: string = 'An unexpected error occurred in the service.') {
//     super(message);
//     this.name = 'UnexpectedServiceError';
//   }
// }
// --- Конец предполагаемых пользовательских классов ошибок ---


// Helper to get Supabase client; cookies() makes it request-specific.
const getSupabase = () => createSupabaseServerClient(cookies());

export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
  logger.info('Fetching profile for user', { userId });
  const supabase = getSupabase();
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      logger.error('Supabase error fetching user profile', { userId, errorCode: error.code, errorMessage: error.message });
      // Throw a specific custom error for database issues
      throw new Error(`DatabaseOperationError: Failed to fetch profile for user ${userId}. Code: ${error.code}`); // Simulating custom error
    }
    
    if (!profile) {
        // `single()` returns `null` data if no row found. This is a specific case.
        // No need to log an error here, as it's a valid "not found" scenario.
        // The caller can decide if this is an error condition for their use case.
        return null;
    }
    return profile as UserProfile;
  } catch (error: any) {
    // If it's not one of our specific operational errors, log it as unexpected.
    if (!(error.message.startsWith('DatabaseOperationError'))) { // Check if it's already a known type of error we threw
        logger.error('Unexpected error in getUserProfileById', { userId, errorDetails: error.message, stack: error.stack });
        // Re-throw as a generic service error or the original if it's already an Error instance
        throw new Error(error.message.startsWith('UnexpectedServiceError:') ? error.message : `UnexpectedServiceError: ${error.message || 'Failed to get user profile.'}`);
    }
    // Re-throw the specific error (like DatabaseOperationError)
    throw error;
  }
}

export async function updateUserProfile(
  userId: string,
  payload: UpdateUserProfilePayload
): Promise<UserProfile> {
  logger.info('Updating profile for user', { userId, payloadKeys: Object.keys(payload) });
  const supabase = getSupabase();

  try {
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      logger.error('Supabase error updating user profile', { userId, errorCode: error.code, errorMessage: error.message });
      throw new Error(`DatabaseOperationError: Profile update failed for user ${userId}. Code: ${error.code}`); // Simulating custom error
    }
    if (!updatedProfile) {
      logger.warn('User profile not found for update, or update returned no data', { userId });
      // This is a specific "not found" or "failed update" scenario
      throw new Error(`ProfileNotFoundError: Profile not found for user ${userId}, update failed.`); // Simulating custom error
    }
    return updatedProfile as UserProfile;
  } catch (error: any) {
    if (!(error.message.startsWith('DatabaseOperationError') || error.message.startsWith('ProfileNotFoundError'))) {
        logger.error('Unexpected error in updateUserProfile', { userId, errorDetails: error.message, stack: error.stack });
        throw new Error(error.message.startsWith('UnexpectedServiceError:') ? error.message : `UnexpectedServiceError: ${error.message || 'Failed to update user profile.'}`);
    }
    throw error;
  }
}
````
## 3\. Key Principles
* *   **Stateless**: Services are stateless. Data is passed in, results returned. Functional approach is preferred.
* *   **Single Responsibility**: Focus on a specific domain.
* *   **Error Handling**:
*     * *   Log errors with context using `getServerLogger()`.
*     * *   **Services MUST throw errors on failure.** Prefer throwing specific custom error classes (e.g., `ProfileNotFoundError`, `DatabaseOperationError` extending `Error`) to allow for more granular error handling by the caller.
*     * *   Services should log unexpected errors or add context to errors they catch and re-throw.
*     * *   The caller (Server Action, API Route handler via `createApiRouteHandler`) catches these errors and formats the final client-facing response, potentially logging them again at a higher level with request context.
* *   **Logging**: Use getServerLogger('ServiceName'). Log operations, parameters (mask PII), and errors.
* *   **Dependencies**: Import clients from src/lib/clients/, config from src/config/env.ts.
* *   **Type Safety**: Use TypeScript types from src/features/{feature-name}/types/.
* *   **Validation**:
*     * *   Primary request validation occurs in API Routes (via createApiRouteHandler) or Server Actions (Zod).
*     * *   Services can perform additional **business rule** validations. If validation fails, throw an error.

## 4\. Calling Services
* *   **From Server Actions (src/features/{feature-name}/actions.ts):**  
*     Pass only necessary data to services (e.g., userId, validated payload). If a service needs to perform authorization based on user roles/properties beyond userId, pass the relevant parts of the AuthenticatedUser object or the full object if justified.
```
// src/features/user-profile/actions.ts
'use server';
// ...
// Canonical utility for getting the authenticated user (Supabase user + app profile).
// `getServerAuthenticatedUser` (from `src/features/auth/utils/api-auth.utils.ts`) is the canonical utility
// responsible for retrieving the session user and their associated application profile,
// returning them as a single, combined `AuthenticatedUser` object (defined in `src/features/auth/types/auth.types.ts`).
import { getServerAuthenticatedUser } from '@/features/auth/utils/api-auth.utils';
// Canonical AuthenticatedUser type.
import type { AuthenticatedUser } from '@/features/auth/types/auth.types';
// ...

export async function handleUpdateProfileAction(
  formData: FormData
): Promise<ServerActionResult<UserProfile, typeof UpdateUserProfilePayloadSchema>> {
  const authResult = await getServerAuthenticatedUser();
  if (!authResult.user) {
    // logger.warn('Authentication error in handleUpdateProfileAction', { authError: authResult.error?.message });
    return { success: false, message: authResult.error?.message || 'User not authenticated.' };
  }
  const user = authResult.user; // Type: AuthenticatedUser
  // ...
}
```
* *   **From API Route Handlers (using createApiRouteHandler):**  
*     The createApiRouteHandler provides the AuthenticatedUser in context.user if requireAuth: true.
```
// src/app/api/user-profile/[userId]/route.ts
// ...
// Canonical AuthenticatedUser type, provided by createApiRouteHandler's context.user.
import type { AuthenticatedUser } from '@/features/auth/types/auth.types';
//

interface HandlerContext {
  params: { userId: string };
  user: AuthenticatedUser; // `user` is guaranteed if requireAuth: true // <--- VERIFY THIS
}

async function handleGetUserProfile(
  req: NextRequest,
  context: HandlerContext // context.user is AuthenticatedUser
) {
  // `context.user` is available and typed as AuthenticatedUser.
  // ...
}
```

## 5\. Testing Services
* *   **Co-locate test file**: user-profile.service.test.ts next to user-profile.service.ts.
* *   **Unit test public functions**: Mock dependencies (DB clients, external API calls, getServerLogger).
* *   **Test successful outcomes and error conditions (ensure errors are thrown).**
```
// src/features/user-profile/services/user-profile.service.test.ts
import { getUserProfileById, updateUserProfile } from './user-profile.service';
import { createSupabaseServerClient } from '@/lib/clients/supabase';
// import { validatedConfig } from '@/config/env'; // Mock if service uses it
import { getServerLogger } from '@/lib/logger';
import { cookies } from 'next/headers'; // Mock if createSupabaseServerClient requires it

// Mock dependencies
jest.mock('@/lib/clients/supabase');
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockReturnValue({ get: jest.fn(), /* other cookie methods */ }),
}));
// jest.mock('@/config/env', () => ({ validatedConfig: { /* ... */ } }));
jest.mock('@/lib/logger', () => ({
  getServerLogger: jest.fn().mockReturnValue({ info: jest.fn(), error: jest.fn(), warn: jest.fn() }),
}));

const mockSupabaseSingle = jest.fn();
const mockSupabaseEq = jest.fn().mockReturnThis(); // .eq() returns 'this' for chaining
const mockSupabaseSelect = jest.fn().mockReturnThis(); // .select() returns 'this'
const mockSupabaseUpdateInstance = { eq: mockSupabaseEq, select: mockSupabaseSelect }; // Object returned by update()
const mockSupabaseUpdate = jest.fn().mockReturnValue(mockSupabaseUpdateInstance);
const mockSupabaseFromInstance = { select: mockSupabaseSelect, update: mockSupabaseUpdate, eq: mockSupabaseEq }; // Object returned by from()
const mockSupabaseFrom = jest.fn().mockReturnValue(mockSupabaseFromInstance);

const mockSupabaseClient = {
  from: mockSupabaseFrom,
};
(createSupabaseServerClient as jest.Mock).mockReturnValue(mockSupabaseClient);

// Further refine mock chain for select -> eq -> single
mockSupabaseSelect.mockImplementation(() => ({
    eq: mockSupabaseEq.mockImplementation(() => ({
        single: mockSupabaseSingle
    }))
}));
// Further refine mock chain for update -> eq -> select -> single
mockSupabaseUpdate.mockImplementation(() => ({
    eq: mockSupabaseEq.mockImplementation(() => ({
        select: mockSupabaseSelect.mockImplementation(() => ({
            single: mockSupabaseSingle
        }))
    }))
}));

describe('UserProfileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the resolution for single() which is the end of the chain
    mockSupabaseSingle.mockReset();
  });

  describe('getUserProfileById', () => {
    it('should return a user profile if found', async () => {
      const mockProfileData = { id: '1', name: 'Test User', bio: 'Test bio' };
      mockSupabaseSingle.mockResolvedValue({ data: mockProfileData, error: null });

      const profile = await getUserProfileById('1');
      expect(profile).toEqual(mockProfileData);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabaseFromInstance.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseEq).toHaveBeenCalledWith('id', '1'); // from select chain
      expect(mockSupabaseSingle).toHaveBeenCalled();
    });

    it('should return null if user not found (Supabase returns data: null, error: null)', async () => {
      mockSupabaseSingle.mockResolvedValue({ data: null, error: null });
      const profile = await getUserProfileById('nonexistent-id');
      expect(profile).toBeNull();
    });

    it('should throw an error if Supabase call fails (e.g., DB error)', async () => {
      const dbError = { code: 'DB500', message: 'DB connection error' };
      mockSupabaseSingle.mockResolvedValue({ data: null, error: dbError });
      await expect(getUserProfileById('error-id')).rejects.toThrow('Failed to fetch profile for user error-id. Code: DB500');
    });
  });

  describe('updateUserProfile', () => {
    const userId = '1';
    const payload = { name: 'Updated Name', bio: 'Updated Bio' };

    it('should update and return the user profile', async () => {
      const expectedProfileData = { id: userId, ...payload, email: 'test@example.com' }; // Assuming email is not updated
      mockSupabaseSingle.mockResolvedValue({ data: expectedProfileData, error: null });

      const profile = await updateUserProfile(userId, payload);
      expect(profile).toEqual(expectedProfileData);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabaseFromInstance.update).toHaveBeenCalledWith(payload);
      expect(mockSupabaseEq).toHaveBeenCalledWith('id', userId); // from update chain
      expect(mockSupabaseSelect).toHaveBeenCalled(); // from update chain
      expect(mockSupabaseSingle).toHaveBeenCalled(); // from update chain
    });

    it('should throw an error if update fails (Supabase returns error)', async () => {
      const dbError = { code: 'DB501', message: 'DB update constraint failed' };
      mockSupabaseSingle.mockResolvedValue({ data: null, error: dbError });
      await expect(updateUserProfile(userId, payload)).rejects.toThrow('Profile update failed for user 1. Code: DB501');
    });

    it('should throw an error if profile not found for update (Supabase returns no data after update)', async () => {
      mockSupabaseSingle.mockResolvedValue({ data: null, error: null }); // No error, but no data
      await expect(updateUserProfile(userId, payload)).rejects.toThrow('Profile not found for user 1, update failed.');
    });
  });
});
```

## 6\. Environment Variables
* *   Access via validatedConfig from src/config/env.ts.
*     ```
*     // In service:
*     // import { validatedConfig } from '@/config/env';
*     // const apiKey = validatedConfig.SOME_API_KEY;
*     ```