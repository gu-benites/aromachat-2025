# Project Structure Documentation (Aligned with Next.js App Router & Feature-Based Architecture)

This document outlines the project's structure, adapted to leverage a modern Next.js App Router architecture with a strong emphasis on feature-based modularity. This structure aims to enhance scalability, maintainability, and developer experience by co-locating related logic and adhering to modernized best practices.

## **Key Architectural Principles**
*   **Feature-Based Modularity:** Core application logic is organized into distinct feature modules, each encapsulating its own UI, state, services, and tests.
*   **Strong Encapsulation:** Features expose a well-defined public API via an `index.ts` barrel file, preventing unauthorized deep imports and promoting maintainability.
*   **Co-location:** Related code (components, services, tests, stories, translations, documentation) for a feature resides within the feature's directory.
*   **Clear Separation of Concerns:** Distinguishing between routing (`src/app/`), feature logic (`src/features/`), shared UI (`src/components/`), core libraries (`src/lib/`), and global configurations.

## **Root Directory (`./`)**
*   **`public/`**: Stores static assets served directly by the webserver (e.g., images, fonts, `favicon.ico`, `robots.txt`).
*   **`hasura/`**: Contains all Hasura configurations, including migrations (schema definitions, relationships, permissions) and metadata. Managed by the Hasura CLI.
*   **`docs/`**: Designated location for all non-code project documentation, including system architecture diagrams, database schema references (not live migrations), and general explanatory material.
    *   **Subdirectories (Example):**
        *   `diagrams/`: System architecture diagrams.
        *   `database_sql/`: **Reference Only.** Contains SQL scripts purely for reference, manual disaster recovery. These files are NOT executed by automated processes or the application.
*   **`.github/`**: Houses GitHub Actions workflows (CI/CD, automated checks) and issue/PR templates.
*   **`.husky/`**: Contains Git hooks (e.g., pre-commit, pre-push) to enforce code quality standards (linting, testing).
*   **`scripts/`**: Holds utility scripts for development and operational tasks (e.g., database seeding, type generation, custom build steps).
*   **Configuration Files** (e.g., `README.md`, `.nvmrc`, `eslint.config.mjs`, `next.config.js`, `package.json`, `tsconfig.json`, `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` (if using Edge Sentry): Configure the project's environment, build tools, and development standards.

## **`src/` Directory: The Core Application Code**
The `src/` directory is organized to support the Next.js App Router and a feature-driven architecture.

*   **`src/app/`**: The **routing layer** for the Next.js App Router. Contains pages (`page.tsx`), layouts (`layout.tsx`), loading UIs, error boundaries, and route groups. Defines URL structure and composes UI from `src/features/` and `src/components/`.
    The directory structure within `src/app/` should directly mirror the application's URL structure. For complex sections of the application, this will involve creating deeply nested subdirectories. Each route segment can have its own `page.tsx`, and optionally `layout.tsx`, `loading.tsx`, `error.tsx`, and `not-found.tsx` files to manage its specific UI, loading states, and error handling. This organization keeps routing concerns well-structured, even for applications with many sub-routes and dynamic segments.
    *   **Subdirectories:**
        *   `src/app/(auth)/`, `src/app/(dashboard)/`: Route groups for organizing routes.
        *   `src/app/api/`: Server-side API route handlers.
            *   **Guideline:** Prefer Next.js Server Actions (`src/features/{feature_name}/actions.ts`) for client-initiated mutations. Use `src/app/api/` for webhooks, serving non-Next.js clients, or specific needs like file streaming. These routes should delegate business logic to services in `src/features/{feature_name}/services/`.
            *   **Important:** When creating a backend endpoint for a client-initiated mutation (e.g., form submission, data creation/update):
                *   **Strongly prefer creating a Server Action** within the relevant feature module (e.g., `src/features/{feature_name}/actions.ts`).
                *   Only consider an API Route in `src/app/api/` if the requirement explicitly matches the stated exceptions: webhooks, serving non-Next.js clients, or scenarios demonstrably unsuitable for Server Actions (e.g., file streaming responses, specific legacy needs). If unsure, default to Server Actions or seek clarification.
*   **`src/components/`**: Houses UI components **shared across multiple features or globally**.
    *   **Subdirectories:**
        *   `ui/`: Atomic, presentational UI components (e.g., `Button.tsx`). Include tests and stories.
        *   `common/`: More complex, composed UI elements shared across features or layouts. Include tests and stories.
*   **`src/features/`**: The **central directory for application functionality**. Each subdirectory is a distinct feature module (e.g., `auth`, `user-profile`).
    *   **Encapsulation:** Each feature should be self-contained. External modules **must only** import from the feature's public API exposed via its `src/features/{feature_name}/index.ts`. ESLint rules should enforce this. Action for you: Implement the ESLint rule (e.g., using eslint-plugin-import's no-restricted-paths) to prevent deep imports into feature modules, enforcing that imports only come from the feature's index.ts.
        *   **Important:** Strictly adhere to importing from feature module barrel files (`index.ts`). **Do not create deep imports** into a feature's internal files (e.g., `import ... from '@/features/some-feature/components/specific-component'`). Always use the public API exposed by `src/features/some-feature/index.ts` (e.g., `import { SpecificComponent } from '@/features/some-feature'`). This enforces encapsulation and maintainability.
    *   **Inter-Feature Communication:**
        *   **Direct Import (via `index.ts`):** For clear dependencies.
        *   **Global State (e.g., Zustand in `src/store/`):** For reacting to global, non-owned state changes.
        *   **React Query Invalidations:** For actions in one feature triggering data refetches in another.
        *   **Custom Event Bus (`src/lib/events/`):** Use sparingly for highly decoupled "fire-and-forget" events.
    *   **Large Features:** If a feature grows too large, it can be internally sub-divided into sub-modules, each with its own internal structure and `index.ts`, composed by the parent feature's `index.ts`.
    *   **Example Feature Structure (`src/features/{feature_name}/`):**
        *   `README.md`: Feature-specific documentation.
        *   `components/`: UI components specific to this feature (e.g., `my-component.tsx`).
            *   `my-component.test.tsx`: Component tests.
            *   `my-component.stories.tsx`: Storybook stories.
        *   `hooks/`: Feature-specific React hooks (non-data fetching UI logic).
        *   `services/`: Business logic, interaction with `src/lib/clients/`.
            *   `my-service.ts`
            *   `my-service.test.ts`: Service tests.
        *   `schemas/`: Zod validation schemas for this feature.
        *   `types/`: TypeScript types specific to this feature.
        *   `queries/`: React Query definitions.
        *   `translations/`: i18n files (e.g., `en.json`) for this feature.
        *   `utils/`: Utility functions specific to this feature.
        *   `actions.ts`: Server Actions for this feature.
        *   `actions.test.ts`: Server Action tests.
        *   `index.ts`: Barrel file exporting the feature's public API.
		
*   **`src/lib/`**: Contains low-level libraries, client initializations, and core, truly global utility functions.
    *   **Subdirectories:**
        *   `clients/`: Initialization for external API clients (Supabase, Hasura, OpenAI).
        *   `auth/`: **Core, highly generic, and application-agnostic authentication utility functions.**
            *   **Purpose:** This directory is for truly foundational auth helper functions that are not tied to *this specific application's* authentication flow, UI, or chosen auth provider's (e.g., Supabase, NextAuth.js) higher-level APIs.
            *   **Think:** Low-level, pure functions that could theoretically be part of a standalone utility library.
            *   **Examples:**
                *   A function to parse a JWT and extract claims (if not already handled by a dedicated library).
                *   Generic cryptographic helpers related to authentication (e.g., a specific hashing utility *if not provided by standard libraries/auth provider SDKs*).
            *   **Guideline:** This directory should be used sparingly. **Most authentication logic, including interactions with your auth provider (e.g., Supabase client calls for login/signup), session management specific to the application, and user state handling, belongs in `src/features/auth/` (specifically in its `services/`, `actions.ts`, `queries/`, etc.).**
            *   **Litmus Test:** If a function in `src/lib/auth/` directly imports from `src/lib/clients/supabase.ts` (or similar provider client) to perform an auth operation like sign-in, sign-up, or session checking, it likely belongs in `src/features/auth/services/auth.service.ts` or `src/features/auth/actions.ts` instead. `src/lib/auth/` functions should ideally be pure or rely only on very generic inputs.
            *   **Important:** When dealing with authentication logic, meticulously differentiate between `src/lib/auth/` and `src/features/auth/`.
                *   `src/lib/auth/` is for **truly generic, provider-agnostic, low-level helper functions** (e.g., JWT parsing if not provided by a library, generic crypto helpers). These should NOT import `supabaseClient` or interact directly with Supabase auth APIs.
                *   `src/features/auth/` (especially `services/`, `actions.ts`, `queries/`, `utils/api-auth.utils.ts`) is for **all application-specific authentication logic**, including Supabase client interactions (login, signup, session management, RLS policy helpers), user state, and UI-related auth hooks like `useAuth`.
                *   **Default to `src/features/auth/` for any new authentication-related code unless it meets the strict 'generic library function' criteria for `src/lib/auth/`.**
        *   `logger/`: Centralized logging configuration.
        *   `events/`: Optional. For a simple global event bus.
        *   `utils/`: Truly generic, pure utility functions (e.g., `date.utils.ts`, `string.utils.ts`). This directory is also home to critical API utility functions like `api.utils.ts` which contains the `createApiRouteHandler` HOF and frontend fetch helpers (`authenticatedGet`, `authenticatedPost`, etc.) as outlined in the API Handling & Security Guidelines.
            *   **Important:** When creating a new utility function:
                *   If the function is **truly generic, pure, and has no dependency on any specific feature's types, services, or logic**, place it in `src/lib/utils/`.
                *   If the utility function is **specific to a single feature, uses its types, or supports its internal logic**, place it in `src/features/{feature_name}/utils/`.
                *   Avoid placing feature-specific utilities in `src/lib/utils/`.
*   **`src/providers/`**: Global React Context providers (React Query, Theme, Auth Session).
*   **`src/config/`**: Application-wide configuration, validated environment variables (via `env.ts` with Zod), constants, and site metadata.
    *   **Guideline:** All environment variable access should go through the validated config object from `env.ts`.
*   **`src/hooks/`**: Shared, global custom React hooks (non-feature-specific, non-data-fetching). Examples: `useLocalStorage`, `useMediaQuery`.
*   **`src/store/`**: Global client-side state management (e.g., Zustand) if needed beyond React Query and Context.
*   **`src/styles/`**: Global CSS files (e.g., `globals.css` for Tailwind).
*   **`src/types/`**: Global TypeScript types and interfaces shared across the application. Feature-specific types are co-located. Includes `supabase.d.ts`.
*   **`src/locales/`**: Global i18n translation files (e.g., `en.json`, `es.json`) for texts shared across the entire application or not attributable to a single feature. Feature-specific translations are co-located within their respective feature directories (e.g. `src/features/auth/translations/`).
*   **`src/middleware.ts`**: Next.js Edge middleware (auth, redirects, etc.).

## **General Guidelines & Best Practices**
*   **src/lib/auth/ vs. src/features/auth/ distinction**
    *   Be mindful of how src/features/auth/ depends on src/lib/auth/. Ensure this dependency is well-managed and that src/lib/auth/ truly remains generic, without acquiring knowledge of specific features. Always Ensure secure session management.
*   **Internationalization (i18n):**
    *   Prefer co-locating feature-specific translation files within the feature directory (e.g., `src/features/{feature_name}/translations/`).
    *   Use `src/locales/` for truly global translations not tied to any specific feature.
*   **Naming Conventions:**
    *   Establish and adhere to consistent naming conventions.
*   **Deprecated Patterns:**
    *   Avoid top-level `src/schemas/`, `src/services/`, or a global `src/utils/` for feature-specific logic.
    *   The concept of a `src/views/` directory is absorbed by `page.tsx` files within `src/app/`.
*   **Co-location of Tests and Stories:**
    *   **Test Files:** Always create corresponding test files (e.g., `my-component.test.tsx`, `my-service.test.ts`) directly alongside the source files they test.
    *   **Storybook Files:** For UI components, create corresponding Storybook files (e.g., `my-component.stories.tsx`) in the same directory as the component.
    *   **Naming Convention:** Use the pattern `{filename}.test.{ext}` for test files and `{filename}.stories.{ext}` for Storybook files, maintaining the same base name as the source file.
    *   **Scope:** This applies to all testable code including components, services, actions, hooks, and utility functions.