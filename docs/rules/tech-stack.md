### Tech Stack Alignment with Proposed Structure

The proposed modular structure is designed to integrate seamlessly with your specified tech stack, providing clear conventions and actionable patterns for organizing your application.

### Frontend

*   **Next.js Latest (App Router):**
    *   The `src/app/` directory is strictly for routing, housing pages, layouts, and route groups as per App Router conventions.
    *   The `src/features/` directory is central. Self-contained UI and logic (components, hooks, services, types, schemas, Server Actions) for distinct application features are built here. These are then composed into your App Router pages and layouts. For example, `src/app/(dashboard)/overview/page.tsx` will import necessary components and hooks from `src/features/dashboard-overview/`.
    *   Server Components and Client Components are organized within their respective feature modules.
    *   Server Actions, encapsulating server-side mutations and data fetching logic, are co-located within the feature directory they primarily serve (e.g., `src/features/auth/actions.ts`).

*   **TypeScript Latest:**
    *   Types and interfaces specific to a feature are co-located within that feature's module in `src/features/{feature}/types/`. This enhances type safety and makes types more discoverable.
    *   Global types, shared across multiple features or the entire application, reside in `src/types/`.
    *   Utilize `tsconfig.json` path aliases (e.g., `@/features/*`, `@/components/*`, `@/lib/*`) for clean and maintainable import statements.

*   **Tailwind CSS Latest with shadcn/ui:**
    *   Atomic, presentational UI components, primarily from shadcn/ui, are located in `src/components/ui/`. These are the foundational building blocks.
    *   More complex UI elements shared across multiple features (e.g., `Navbar`, `PageWrapper`) are placed in `src/components/common/`.
    *   Feature-specific components, located in `src/features/{feature}/components/`, will consume components from both `src/components/ui/` and `src/components/common/`. Global styles are managed in `src/styles/globals.css`.

*   **@tanstack/react-query Latest**
    *   All React Query definitions—including query keys, query functions, custom hooks wrapping `useQuery` and `useMutation` (e.g., `useUserProfileQuery`), and cache invalidation logic—are placed within `src/features/{feature}/queries/`. This keeps data-fetching logic tightly coupled with the feature it serves.
    *   The global `QueryClientProvider` is correctly set up in `src/providers/query-client-provider.tsx`.
    *   For direct API interactions not managed by React Query (if any), consider utility functions in `src/lib/utils/api.utils.ts` (e.g., `safeFetch`, `authenticatedFetchWrapper`) to encapsulate common logic like adding auth headers or consistent error handling.

*   **react-hook-form Latest with zod Latest:**
    *   Zod schemas for validating form data specific to a feature are located in `src/features/{feature}/schemas/` (e.g., `src/features/auth/schemas/login.schema.ts`).
    *   Form components (e.g., `LoginForm.tsx`) are part of their respective feature module, residing in `src/features/{feature}/components/`.
    *   Generic, reusable form utility components or wrappers (e.g., `FieldWrapper`) are placed in `src/components/common/forms/`.

*   **Icons: Lucide React Latest:**
    *   Icons are imported directly into the components where they are used.

*   **Global State (Client-Side):**
    *   If global state beyond React Query and Context is needed, @Zustand will be used (setup in `src/store/index.ts`). Stores like `useGlobalSettingsStore` would manage application-wide state not tied to server data. Component-level state is managed with React's `useState` and `useEffect`.

### Backend

*   **Node.js Latest:**
    *   The runtime environment for your Next.js application. (Version specified in `.nvmrc` / `.tool-versions`)

*   **API Layer:**
    *   **Next.js API Routes (`src/app/api/`):**
        *   This directory is used for server-side API endpoints that handle custom backend logic not suitable for, or extending beyond, Server Actions (e.g., webhook handlers, specific integrations).
        *   These API routes will utilize services from `src/features/{feature}/services/` to encapsulate business logic.
		*   **API Validation:** Zod schemas (from `src/features/{feature}/schemas/` or shared schemas) are used for robust validation of incoming request bodies, query parameters, and route parameters. This is primarily handled by the `createApiRouteHandler` HOF (from `src/lib/utils/api.utils.ts`) through its `schema` and `querySchema` options. Mentions of more granular HOFs like `withZodValidation(schema, handler)` should be understood as conceptual building blocks or internal mechanisms that `createApiRouteHandler` might leverage, rather than separate, directly-used HOFs for route definition.
        *   **API Authentication:** Secure endpoint access is primarily handled by the `createApiRouteHandler` HOF (from `src/lib/utils/api.utils.ts`) through its `requireAuth: true` option. This HOF internally utilizes authentication utilities (e.g., from `src/features/auth/utils/api-auth.utils.ts`) to verify sessions. Mentions of more granular HOFs like `withAuthenticatedApiRoute(handler)` should be understood as conceptual building blocks or internal mechanisms that `createApiRouteHandler` might leverage, rather than separate, directly-used HOFs for route definition.
*   **Hasura GraphQL (v2.0+):**
        *   The Hasura client is initialized and configured in `src/lib/clients/hasura.ts`.
        *   Feature services (`src/features/{feature}/services/`) and React Query hooks (`src/features/{feature}/queries/`) utilize this client to interact with your Hasura GraphQL API.

*   **Backend as a Service (BaaS) - Supabase:**
    *   The Supabase client is initialized and configured in `src/lib/clients/supabase.ts`.
    *   **Authentication:** Supabase Auth is used for user login, signup, session management, and JWT generation for Hasura.
    *   **Database:** Supabase PostgreSQL serves as the primary data store, managed via Hasura migrations (`hasura/migrations/`).
    *   **Storage:** Supabase Storage is used for file uploads (e.g., user avatars in a `user-avatars` bucket, feature-specific assets in dedicated buckets).

*   **Authentication (Detailed):**
    *   The `src/features/auth/` module centralizes all primary authentication logic (UI, client-side hooks, services, Server Actions).
    *   `src/middleware.ts` handles server-side session management and route protection using `@supabase/ssr`.
    *   JWTs generated by Supabase Auth are configured (within Supabase settings/functions) to include necessary Hasura claims (e.g., `x-hasura-user-id`, `x-hasura-default-role`).
    *   User profile synchronization logic (e.g., creating a profile on signup) resides in `src/features/user-profile/services/user-profile.service.ts`, triggered by auth events or actions.

*   **Caching:**
    *   **Redis via Upstash (@upstash/redis Latest):**
        *   The Redis client is initialized in `src/lib/clients/redis.ts`.
        *   Caching logic is implemented within the services of the features that own the data (`src/features/{feature}/services/`) or within Server Actions/API Routes that serve that data.
    *   **Hasura response caching:** Configured directly within Hasura.

*   **AI Integration: OpenAI API (openai Latest):**
    *   The OpenAI client is initialized and configured in `src/lib/clients/openai.ts`.
    *   AI-related functionalities are integrated into the specific features that utilize them via **typed service layers**. For instance, `src/features/content-generation/services/ai-content.service.ts` would define methods with clear input/output types (defined in `src/features/content-generation/types/ai.types.ts`) for interacting with the OpenAI client.

### Logging & Observability

*   **Server-Side Logging:**
    *   @Winston is used for structured logging on the backend. Configuration resides in `src/lib/logger/winston.config.ts`.
    *   A factory function, `getServerLogger(moduleName: string)`, provided by `src/lib/logger/index.ts`, is used to obtain module-specific logger instances within services, API routes, and Server Actions.
    *   Integration with an observability platform like Sentry will be configured here, with Sentry initialization in files like `sentry.server.config.ts`.
*   **Client-Side Logging:**
    *   A custom logger, defined in `src/lib/logger/client.logger.ts`, is used.
    *   This logger can provide component-specific instances and will send critical logs (errors, warnings) to a dedicated Next.js API route (e.g., `/api/logs/client`) using an authenticated utility function. This API route will then use the server-side logger. **Consider appropriate security for this endpoint, such as rate limiting, to prevent abuse, even if individual log contents are not highly sensitive.**
    *   Sentry client-side initialization (`sentry.client.config.ts`) will capture unhandled exceptions and performance data.

### Key Architectural Patterns (Reinforced)

*   **Service Layer:** Core business logic, complex data manipulations, and interactions with external services (Supabase, Redis, OpenAI, Hasura client) are encapsulated in service classes/functions within `src/features/{feature}/services/`. API routes and Server Actions primarily delegate to these services.
*   **Utility Functions:** Reusable, lower-level, and pure functions are organized in `src/lib/utils/` (e.g., `date.utils.ts`, `string.utils.ts`, `api.utils.ts` for HOFs/wrappers). Feature-specific utilities reside in `src/features/{feature}/utils/`.
*   **Modular Components & Features:** The `src/features/` directory promotes self-contained modules. Complex domains can be broken down into more granular sub-features within this structure if needed.