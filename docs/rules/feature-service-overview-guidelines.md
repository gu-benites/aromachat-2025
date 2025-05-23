# Feature & Service Implementation Overview

## 1. Core Concepts
### Features
- **What**: Self-contained business domains, grouping related functionality.
- **Location**: `src/features/{feature-name}/`
- **Contains**: UI components, services (business logic), React Query hooks, Server Actions, types, schemas, co-located tests, and feature-specific utilities.
- **Examples**: `auth`, `user-profile`, `data-visualization`
- **Key Principle**: Maximize independence. Expose a clear public API via `index.ts`. Minimize direct cross-feature deep imports; use barrel file exports.

### Services
- **What**: Modules encapsulating specific business logic or interactions with external systems (e.g., databases, third-party APIs).
- **Location**: `src/features/{feature-name}/services/{service-name}.service.ts`
- **Responsibility**: Implement distinct business capabilities. Called by API Route handlers (via `createApiRouteHandler`), Server Actions, or other services.
- **Examples**: `userProfileService.ts` (in `user-profile` feature), `paymentGatewayService.ts` (in `billing` feature).
- **Key Principle**: Single responsibility (or closely related responsibilities), testable, reusable. **Services MUST be stateless and throw errors on failure.** The functional approach is preferred.

## 2. When to Create What
### Create a New Feature When:
- Introducing a new, distinct area of business functionality (e.g., "order-management").
- The functionality involves multiple UI components, several related services, specific data types, and potentially its own Server Actions or API routes.
- You want to encapsulate a domain to manage its complexity and dependencies independently.

### Create a New Service (within an existing or new feature) When:
- Implementing a specific piece of business logic (e.g., "calculate-shipping-cost").
- Interacting with an external API or data source (e.g., "fetch-user-data-from-crm").
- Abstracting complex operations to be used by Server Actions, API Route handlers, or other services.
- You need a reusable, testable unit of logic that, on failure, throws an error to be handled by its caller.

## 3. Key Principles for Implementation
### Features:
- **Encapsulation**: Strictly use `index.ts` barrel files to define the public API. Prevent deep imports into a feature's internal structure.
- **Co-location**: Keep all related files (components, services, hooks, types, schemas, utils, tests) within the feature directory.
- **Server Actions First**: For client-initiated mutations, prefer Server Actions (`actions.ts`) within the feature.
- **API Routes (`src/app/api/`)**: Use for webhooks, non-Next.js clients, or specific scenarios not fitting Server Actions. These routes use `createApiRouteHandler` and delegate logic to services.
- **Dependencies**: Clearly define dependencies on other features (via their `index.ts`) or shared libraries (`src/lib/`).

### Services:
- **Functional Approach (Preferred)**: Export plain functions. Module caching provides a singleton-like behavior for stateless services.
    ```typescript
    // src/features/example/services/example.service.ts
    import { validatedConfig } from '@/config/env'; // For ENV VARS
    import { getServerLogger } from '@/lib/logger';
    // Assuming SomeParams and SomeResultType are defined in ../types/
    import type { SomeParams, SomeResultType } from '../types/example.types';

    const logger = getServerLogger('ExampleService');

    export async function performSomeAction(params: SomeParams): Promise<SomeResultType> {
      // Access config: validatedConfig.SOME_API_KEY
      logger.info('Performing action', { params }); // Be mindful of logging PII from params
      try {
        // ... business logic ...
        // Example: const dbResult = await db.query(...);
        // if (!dbResult) throw new Error('Data not found for action.');

        const result: SomeResultType = { data: 'some data' /* ... construct result */ };
        return result; // Return data directly on success
      } catch (error: any) { //
        logger.error('Failed to perform action', { errorMessage: error.message, params });
        // Re-throw the original error or a new, more specific error.
        // The caller (Server Action / API Route Handler) handles the final response.
        throw new Error(`Action failed: ${error.message || 'Unknown error'}`);
      }
    }
    ```
- **Statelessness**: Services **MUST** be stateless. Data is passed in as arguments, and results returned.
- **Class-Based Approach (Discouraged; use only if a strong, documented justification exists)**: If a class-based structure is chosen (e.g., managing complex internal state that truly cannot be externalized, or for specific DI patterns with many shared private methods), ensure dependencies are injected via the constructor for testability. Avoid static `getInstance()` patterns. The functional approach is almost always sufficient and simpler.
- **Error Handling**: **Services MUST throw errors for failures.** The calling Server Action or `createApiRouteHandler` is responsible for catching these and formatting the final user-facing error response. Log errors within the service with context.
- **Input/Output Validation**:
    - Primary validation of external inputs (request body, query params) is handled by `createApiRouteHandler` (with Zod schemas) or directly in Server Actions (with Zod).
    - Services receive already validated data (or data they trust from other internal services).
    - Services *can* perform further **business rule** validations if necessary (e.g., checking if a user has permission for an operation based on business logic beyond simple role checks). If these internal business rule validations fail, the service should throw an error.
    - Clearly type inputs and outputs.
- **Reusability**: Design services to be reusable.
- **Service Parameters**:
    - Pass only necessary data to services (e.g., `userId`, validated payload).
    - If a service needs to perform authorization based on user roles/properties beyond `userId` (from the `AuthenticatedUser` object), pass the relevant parts of the `AuthenticatedUser` object, or the full object if genuinely required by multiple internal checks within the service. Clearly document why the full object or extended parts are needed.
- **Note on Zod Schemas with `FormData` in Server Actions:**
When using Server Actions that accept `FormData` (often for progressive enhancement with HTML forms), and you need to validate a payload that's more complex than simple key-value pairs (e.g., an array of objects like `items` in `CreateOrderPayloadSchema`), the recommended approach is:
1.  The client serializes the complex part of the payload into a JSON string (e.g., `JSON.stringify(itemsArray)`).
2.  The client appends this JSON string as a field in the `FormData` object (e.g., `formData.append('itemsJson', '...')`).
3.  The Server Action receives the `FormData`, retrieves the JSON string for the relevant field.
4.  The Server Action parses this JSON string (`JSON.parse()`) into a JavaScript object.
5.  This parsed object is then validated against the corresponding Zod object schema (e.g., `CreateOrderPayloadSchema.parse({ items: parsedItems })`).
The Zod schema itself (`CreateOrderPayloadSchema`) defines the structure of the *expected JavaScript object after parsing*, not directly the `FormData` structure for such complex fields.

## 4. General Workflow
1.  **Define Feature Scope**: Understand the business domain.
2.  **Structure Feature Directory**: Create necessary subdirectories.
3.  **Define Types & Schemas**: In `types/` and `schemas/`.
4.  **Implement Services**: Write business logic in `services/`, preferring the functional approach. **Services throw errors.**
5.  **Implement Server Actions/API Routes**: Create `actions.ts` or routes in `src/app/api/`. Use `createApiRouteHandler` for API routes. These will call services and handle their errors.
6.  **Develop UI Components**: In `components/`.
7.  **Create React Query Hooks**: In `queries/` for data fetching/caching.
8.  **Write Tests**: Co-locate tests.
9.  **Expose Public API**: Update `index.ts` for the feature.
10. **Document**: Update or create `README.md` for the feature if significant.

This overview aligns with the `auth-api-guidelines.md`, `project-structure-guidelines.md`, and `essential-hook-guidelines.md`. Refer to those for more detailed rules.