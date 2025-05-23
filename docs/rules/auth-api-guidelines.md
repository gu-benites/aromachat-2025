# API Handling & Security Guidelines (Next.js App Router & Feature-Based Architecture)
**All new API endpoints and API calls (frontend or backend) MUST follow these guidelines.**

## 1\. Introduction
This document outlines the **mandatory** rules and procedures for creating and modifying API
endpoints within the project's codebase (primarily `src/app/api/`) and for interacting with these
endpoints from the frontend or other backend services. The primary goals are to ensure
**security**, **consistency**, and **maintainability** by standardizing how authentication, method
validation, and request data validation are handled. Adherence to these guidelines is critical for
preventing security vulnerabilities and ensuring predictable API behavior.

## 2\. Core Principles
*   **Security First:** Authentication and validation are non-negotiable.
*   **Consistency:** Use established utility functions and patterns.
*   **Leverage Utilities:**
    *   **Backend API Routes (`src/app/api/`):** Utilize the `createApiRouteHandler` HOF from `src/lib/utils/api.utils.ts`. This HOF internally uses authentication utilities (e.g., from `src/features/auth/utils/api-auth.utils.ts`) and Zod schemas (from `src/features/{feature_name}/schemas/`).
    *   **Server Actions (`src/features/{feature_name}/actions.ts`):** Directly use authentication utilities and Zod schemas.
    *   **Frontend:** Prioritize React Query (`src/features/{feature_name}/queries/`) using fetch utilities (e.g., `authenticatedGet`, `authenticatedPost`) from `src/lib/utils/api.utils.ts`.
*   **Clear Separation & Delegation:**
    *   API routes (`src/app/api/...`) handle HTTP interactions via the `createApiRouteHandler` and delegate core business logic to services (`src/features/{feature_name}/services/`).
    *   Server Actions (`src/features/{feature_name}/actions.ts`) encapsulate mutations and can call services.
    *   Frontend uses React Query for data fetching and Server Actions for mutations.
    *   Backend services: Prefer direct calls for internal communication.
*   **Prefer Server Actions:** For client-initiated mutations, use Server Actions. `src/app/api/` routes are primarily for webhooks, serving non-Next.js clients, or specific scenarios not fitting Server Actions.
*   **Important:** When tasked with creating a backend endpoint for a client-initiated mutation (e.g., form submission, data creation/update):
    *   **Strongly prefer creating a Server Action** within the relevant feature module (e.g., `src/features/{feature_name}/actions.ts`).
    *   Only consider an API Route in `src/app/api/` if the requirement explicitly matches the stated exceptions: webhooks, serving non-Next.js clients, or scenarios demonstrably unsuitable for Server Actions (e.g., file streaming responses, specific legacy needs). If unsure, default to Server Actions or seek clarification.

## 3\. Mandatory Backend Implementation Pattern (Defining API Endpoints in `src/app/api/`)
API route handlers in `src/app/api/...` **MUST** be constructed using the `createApiRouteHandler` Higher-Order Function (HOF) from `src/lib/utils/api.utils.ts`. This HOF centralizes common concerns like authentication, data validation, and standardized error handling.

**The `createApiRouteHandler` HOF manages:**
1.  **Authentication:** If configured (e.g., `requireAuth: true`), it verifies the user session. The `context.user` passed to your `handler` (when `requireAuth: true`) will be of type `AuthenticatedUser` (as defined in `src/features/auth/types/auth.types.ts`), combining Supabase user data with the application-specific user profile. The HOF internally ensures this data fetching and combination, typically by leveraging utilities like `getServerAuthenticatedUser` from `src/features/auth/utils/api-auth.utils.ts`.
2.  **Data Validation:** If a Zod `schema` (for body) or `querySchema` (for URL query) is provided, it validates the data.
3.  **Error Handling:** Provides a consistent `try...catch` structure for error responses.
4.  **Core Logic Invocation:** Calls the provided `handler` function with `NextRequest` and a `context` object (containing `user`, `validatedBody`, `validatedQuery`, `params`).

**Crucial Parts for an App Router API Route Handler using the HOF:**
```typescript
// src/app/api/example-feature/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod'; // Or import from feature schemas
import { createApiRouteHandler } from '@/lib/utils/api.utils'; // The HOF
import { exampleSchema, exampleQuerySchema } from '@/features/example-feature/schemas/example.schema';
import { AuthenticatedUser } from '@/features/auth/utils/api-auth.utils'; // Your app's User type
import { exampleServiceFunction, getSomeDataService } from '@/features/example-feature/services/example.service';
// Logging can be handled within the HOF or passed as an option
// Core logic for POST, to be passed to the HOF
async function handlePostExample(
  req: NextRequest, // Full req might still be useful for some edge cases
  context: { validatedBody: z.infer<typeof exampleSchema>; user: AuthenticatedUser }
) {
  // [Important]: When implementing the `handler` function for `createApiRouteHandler`:
  //   *   **Prioritize using `context.validatedBody`, `context.validatedQuery`, and `context.user`** for accessing request data and user information, as these are processed and validated by the HOF.
  //   *   Only access the raw `req: NextRequest` object directly if you need information not available or abstracted by the `context` (e.g., specific headers not automatically processed, client IP address if not part of `context`). Clearly document why direct `req` access is necessary in such cases.

  const result = await exampleServiceFunction(context.validatedBody, context.user);
  return NextResponse.json({ message: 'Operation successful', data: result }, { status: 201 });
}

export const POST = createApiRouteHandler({
  schema: exampleSchema,
  requireAuth: true,
  handler: handlePostExample,
});

// Core logic for GET, to be passed to the HOF
async function handleGetExample(
  req: NextRequest,
  context: { validatedQuery?: z.infer<typeof exampleQuerySchema>; user: AuthenticatedUser }
) {
  const data = await getSomeDataService(context.validatedQuery, context.user);
  return NextResponse.json({ message: 'Data fetched', data });
}

export const GET = createApiRouteHandler({
  querySchema: exampleQuerySchema,
  requireAuth: true, // Can be false for public GET endpoints
  handler: handleGetExample,
});
````
**Note:** The `createApiRouteHandler` (defined in `src/lib/utils/api.utils.ts`) internally uses utilities like `getAuthenticatedUserFromRequest` (which might be sourced from or utilize functions within `src/features/auth/utils/api-auth.utils.ts` for application-specific session validation) and `validateRequestBodyWithZod` (or similar logic for parsing and validating against the provided schemas), and implements standardized error handling. This keeps the route files lean and focused on the business logic handler.

## 4\. Choosing the Right Validation Method (Zod Schemas)
Zod schemas (co-located in src/features/{feature\_name}/schemas/) are used by the createApiRouteHandler HOF:
* *   **Request Body Validation:** Provide a Zod schema to the schema option of createApiRouteHandler for POST, PUT, PATCH requests.
* *   **URL Query Parameter Validation:** Provide a Zod schema to the querySchema option of createApiRouteHandler for GET requests.

## 5\. Mandatory Frontend API Interaction Pattern (Calling APIs from UI)
Frontend API calls **MUST** use **React Query** hooks (src/features/{feature\_name}/queries/). Fetch logic within these hooks uses helpers from src/lib/utils/api.utils.ts.

**Mandatory Frontend Helper Functions (from src/lib/utils/api.utils.ts):**  
authenticatedGet, authenticatedPost, authenticatedFormPost, authenticatedFetch.  
These helpers manage the Authorization: Bearer <token> header.

**Crucial Parts for Frontend React Query:**
```
// src/features/datasets/queries/dataset.queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authenticatedGet, authenticatedPost } from '@/lib/utils/api.utils';
import { Dataset, CreateDatasetPayload } from '@/features/datasets/types/dataset.types';

const DATASET_QUERY_KEYS = { all: ['datasets'] as const /* ... more keys */ };

const fetchDatasets = async (): Promise<Dataset[]> => authenticatedGet<Dataset[]>(`/api/datasets`);
export const useDatasetsQuery = () => useQuery<Dataset[], Error>({
  queryKey: DATASET_QUERY_KEYS.all,
  queryFn: fetchDatasets,
});

const createDataset = async (payload: CreateDatasetPayload): Promise<Dataset> =>
  authenticatedPost<Dataset, CreateDatasetPayload>(`/api/datasets`, payload);

export const useCreateDatasetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Dataset, Error, CreateDatasetPayload>({
    mutationFn: createDataset,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DATASET_QUERY_KEYS.all }),
  });
};

// In a component (conceptual):
// const { data } = useDatasetsQuery();
// const mutation = useCreateDatasetMutation();
// mutation.mutateAsync({ name: 'New Dataset' });
```
**DO NOT** manually construct fetch calls and add Authorization headers from the frontend.
## 6\. Server-to-Server API Calls (Internal Backend Communication)
For internal communication (e.g., API route/Server Action calling logic also used by another API route):

* *   **Preferred: Direct Service/Utility Calls:**
*     * *   Refactor core logic into reusable service functions (src/features/{feature\_name}/services/).
*     * *   Call these services directly, passing necessary auth context (userId, etc.).
*     * *   **Why?** Efficient, type-safe, promotes reusability.
*     
*     **Crucial Parts for Server Action calling a Service:**
*     ```
*     // src/features/workflows/actions.ts
*     'use server';
*     import { getDatasetById } from '@/features/datasets/services/dataset.service';
*     import { createSupabaseServerClient } from '@/lib/clients/supabase'; // Adjust path
*     import { cookies } from 'next/headers';
*     
*     export async function executeWorkflowAction(payload: { datasetId: string }) {
*       const supabase = createSupabaseServerClient(cookies()); // Adjust as per your setup
*       const { data: { user } } = await supabase.auth.getUser();
*       if (!user) return { success: false, message: 'User not authenticated' };
*     
*       try {
*         const dataset = await getDatasetById(payload.datasetId, user.id); // Service handles authz
*         return { success: true, data: { status: 'processed', datasetId: dataset.id } };
*       } catch (error: any) {
*         return { success: false, message: error.message || 'Failed to execute workflow' };
*       }
*     }
*     ```
* *   **Alternative (Less Preferred, e.g., external services): fetchWithToken / postWithToken (from src/lib/utils/api.utils.ts):**
*     * *   Use for calling truly separate microservices or external APIs requiring a Bearer token.
*     * *   **Anti-pattern for internal API calls.**
*     * *   Requires explicitly passing a token. For external services, this is usually a service-specific API key from process.env.
*     
*     **Crucial Parts for Calling an EXTERNAL Service:**
```
// src/features/some-feature/actions.ts (or an API route)
'use server';
import { postWithToken } from '@/lib/utils/api.utils'; // Assumes this helper exists
// [Your Implementation Note]: Ensure `postWithToken` and `fetchWithToken` are robustly implemented
// in `src/lib/utils/api.utils.ts`. They should handle setting the Bearer token
// and potentially common error handling or request/response logging for external calls.

async function callExternalServiceAction() {
  const serviceSpecificToken = process.env.EXTERNAL_SERVICE_API_KEY;
  if (!serviceSpecificToken) return { success: false, message: 'External API key missing' };

  try {
    const result = await postWithToken('https://api.externalservice.com/v1/action', { data: 'value' }, serviceSpecificToken);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: 'Failed to call external service' };
  }
}
```
In summary: Prefer direct service calls internally. Use fetchWithToken for external services with appropriate token handling (e.g., service keys from process.env).