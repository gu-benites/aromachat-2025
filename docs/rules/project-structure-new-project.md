# Next.js App Router Feature-Based Project: File & Folder Structure Cheat Sheet

This cheat sheet provides a starting file and folder structure for a new Next.js project using the App Router and a feature-based architecture, based on the provided project guidelines.

## 1. Naming Conventions

**General Rules**
- Use PascalCase for:
  - Components (e.g., `LoginForm`, `UserProfilePage`)
  - Type definitions (e.g., `UserProfile`, `Order`)
  - Interfaces (e.g., `AuthenticatedUser`)
- Use kebab-case for:
  - Directory names (e.g., `src/features/user-profile`, `components/auth-wizard`)
  - File names (e.g., `user-profile.service.ts`, `login-form.tsx`)
- Use camelCase for:
  - Variables (e.g., `currentUser`, `orderItems`)
  - Functions (e.g., `fetchUserProfile`, `calculateTotal`)
  - Methods
  - Hooks (e.g., `useAuth`, `useFormState`)
  - Properties
  - Props (e.g., `userId`, `onSuccess`)
- Use UPPERCASE for:
  - Environment variables (e.g., `NEXT_PUBLIC_API_URL`, accessed via `validatedConfig`)
  - Constants (e.g., `MAX_ITEMS`, defined in `src/config/constants.ts`)
  - Global configurations

**Specific Naming Patterns**
- Prefix event handlers with 'handle': `handleClick`, `handleSubmit`
- Prefix boolean variables with verbs: `isLoading`, `hasError`, `canSubmit`, `isAuthenticated`
- Prefix custom hooks with 'use': `useAuth`, `useFormValidation` (as per React & bedrock conventions)
- Use complete words over abbreviations except for common and well-understood ones like:
  - `err` (error)
  - `req` (request)
  - `res` (response)
  - `props` (properties)
  - `ref` (reference)

## 2. Root Directory Structure (High-Level)

project-root/
├── .github/                      # GitHub Actions, PR/Issue templates
├── .husky/                       # Git hooks
├── docs/                         # Project documentation
├── public/                       # Static assets
├── src/                          # Application source code (see details below)
├── .env.example                  # Environment variable template
├── .gitignore
├── .nvmrc                        # Node version
├── components.json               # shadcn/ui configuration
├── eslint.config.mjs             # ESLint configuration
├── next.config.js                # Next.js configuration
├── package.json
├── postcss.config.js
├── prettier.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md

## 3. `src/` Directory Structure

### `src/app/` - Routing Layer

Defines URL structure and composes UI from `src/features/` and `src/components/`.

src/app/
├── (auth)/                       # Optional: Route group for auth pages like /login, /register
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/                  # Route group for protected dashboard routes (e.g., /dashboard/*)
│   ├── chat/page.tsx             # Route: /dashboard/chat
│   ├── settings/page.tsx         # Route: /dashboard/settings
│   ├── feature-one/page.tsx      # Route: /dashboard/feature-one
│   ├── feature-two/page.tsx      # Route: /dashboard/feature-two
│   ├── layout.tsx                # Layout specific to the dashboard (e.g., with sidebar/navbar)
│   ├── loading.tsx               # Optional: Loading UI for dashboard routes
│   └── error.tsx                 # Optional: Error boundary for dashboard routes
├── api/                          # API routes (webhooks, specific non-Next.js client needs)
│   ├── health/route.ts           # Example: /api/health
│   └── ...                       # Other API routes as needed
├── global-error.tsx              # Global error boundary
├── layout.tsx                    # Root layout for the entire application
├── loading.tsx                   # Optional: Root loading UI
├── page.tsx                      # Homepage route (/)
└── not-found.tsx                 # Optional: Custom 404 page

### `src/features/` - Feature Modules

Core application logic, organized into distinct feature modules.

src/features/
├── auth/                         # Authentication feature (login, signup, session)
│   ├── actions.ts
│   ├── actions.test.ts
│   ├── components/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── hooks/                    # e.g., useAuth.ts (as per essential-hook-guidelines.md)
│   │   └── index.ts
│   ├── queries/
│   │   └── auth.queries.ts
│   ├── schemas/
│   │   ├── login.schema.ts
│   │   └── register.schema.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── types/
│   │   └── auth.types.ts         # Contains AuthenticatedUser type
│   ├── utils/                    # Feature-specific auth utils
│   │   └── api-auth.utils.ts     # e.g., getServerAuthenticatedUser
│   ├── index.ts                  # Barrel file: Public API of the auth module
│   └── README.md
│
├── user-profile/                 # User profile management (details beyond basic auth)
│   ├── actions.ts
│   ├── components/
│   │   └── edit-profile-form.tsx
│   ├── queries/
│   │   └── user-profile.queries.ts
│   ├── schemas/
│   │   └── update-profile.schema.ts
│   ├── services/
│   │   └── user-profile.service.ts
│   ├── types/
│   │   └── user-profile.types.ts
│   ├── index.ts
│   └── README.md
│
├── homepage/                     # Feature module for the public homepage
│   ├── components/
│   │   ├── hero-section.tsx
│   │   └── features-list.tsx
│   ├── constants/                # Homepage-specific constants (if any)
│   ├── types/
│   │   └── homepage.types.ts
│   ├── index.ts
│   └── README.md
│
├── dashboard-chat/               # Feature module for the chat page
│   ├── actions.ts
│   ├── components/
│   │   ├── chat-interface.tsx
│   │   └── message-list.tsx
│   ├── queries/
│   │   └── chat.queries.ts
│   ├── services/
│   │   └── chat.service.ts
│   ├── types/
│   │   └── chat.types.ts
│   ├── index.ts
│   └── README.md
│
├── dashboard-settings/           # Feature module for the settings page
│   ├── actions.ts
│   ├── components/
│   │   ├── account-settings-form.tsx
│   │   └── notification-preferences.tsx
│   ├── queries/
│   │   └── settings.queries.ts
│   ├── services/                 # May call user-profile.service.ts or have its own
│   ├── types/
│   │   └── settings.types.ts
│   ├── index.ts
│   └── README.md
│
├── dashboard-feature-one/        # Feature module for "Feature 1"
│   ├── ... (standard feature subdirectories: actions, components, queries, services, types, etc.)
│   ├── index.ts
│   └── README.md
│
└── dashboard-feature-two/        # Feature module for "Feature 2"
    ├── ... (standard feature subdirectories)
    ├── index.ts
    └── README.md

#### Standard Feature Module Structure (`src/features/{feature-name}/`)

Each feature directory generally contains:
*   `actions.ts`: Server Actions specific to the feature.
*   `actions.test.ts`: Tests for Server Actions.
*   `components/`: UI components specific to this feature.
    *   `{component-name}.tsx`
    *   `{component-name}.test.tsx`
    *   `{component-name}.stories.tsx` (if using Storybook)
*   `hooks/`: Feature-specific React hooks (non-data fetching UI logic).
*   `queries/`: React Query definitions (hooks, query keys, fetch functions).
*   `schemas/`: Zod validation schemas for forms, API inputs.
*   `services/`: Business logic, interactions with DB/external APIs.
    *   `{service-name}.service.ts`
    *   `{service-name}.service.test.ts`
*   `types/`: TypeScript type definitions specific to this feature.
*   `translations/`: (Optional) i18n files (e.g., `en.json`).
*   `utils/`: (Optional) Utility functions specific to this feature.
*   `index.ts`: Barrel file, defines the public API of the feature.
*   `README.md`: (Recommended) Documentation for the feature.

### `src/components/` - Shared UI Components

UI components shared across multiple features or globally.

src/components/
├── ui/                           # Atomic UI components (e.g., from shadcn/ui or custom)
│   ├── button.tsx
│   ├── input.tsx
│   └── ...
├── common/                       # Composed shared components
│   ├── layout/                   # Global layout components
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   └── page-wrapper.tsx
│   ├── forms/                    # Generic form elements/wrappers
│   │   └── form-field-wrapper.tsx
│   └── feedback/                 # e.g., GenericModal, ToasterWrapper
│       └── loading-spinner.tsx
└── index.ts                      # Optional: Barrel file for shared components

### `src/lib/` - Low-level Libraries, Clients, Core Utilities

Truly generic, non-feature-specific code.

src/lib/
├── clients/                      # External API client initializations
│   ├── supabase.ts               # Supabase client setup (browser, server, service_role)
│   ├── redis.ts                  # Redis client (if used)
│   └── openai.ts                 # OpenAI client (if used)
├── auth/                         # Core, reusable, generic auth utility functions (use sparingly)
│                                 # Most app-specific auth logic (session, user object) is in `src/features/auth/`
├── logger/                       # Centralized logging configuration
│   ├── index.ts                  # Exports logger instances/factory
│   ├── winston.config.ts         # Server-side logger config
│   └── client.logger.ts          # Client-side logger utility
├── utils/                        # Truly generic utility functions
│   ├── api.utils.ts              # `createApiRouteHandler` HOF, frontend fetch helpers (`authenticatedGet`, `authenticatedPost`)
│   ├── date.utils.ts
│   ├── string.utils.ts
│   └── index.ts                  # Barrel file for utils
└── index.ts                      # Optional: Barrel file for lib

### `src/providers/` - Global React Context Providers

src/providers/
├── auth-session-provider.tsx     # Provides Supabase session state, consumed by `useAuth`
├── query-client-provider.tsx     # React Query client provider
└── theme-provider.tsx            # Optional: For theme management

### `src/config/` - Application-wide Configuration

src/config/
├── constants.ts                  # Global application constants
├── env.ts                        # Environment variable validation (Zod) and export
└── site.ts                       # Site metadata (name, description, etc.)

### `src/hooks/` - Shared Custom React Hooks

Non-data-fetching, non-feature-specific global hooks.

src/hooks/
└── use-media-query.ts            # Example

### `src/store/` - Global Client-side State (e.g., Zustand)

src/store/
├── index.ts
└── slices/
    └── global-settings.slice.ts  # Example Zustand slice

### `src/styles/` - Global Styles

src/styles/
└── globals.css                   # Tailwind base, components, utilities, global CSS

### `src/types/` - Global TypeScript Types

Types shared across the entire application.

src/types/
├── api.types.ts                  # Common API response/request types
├── supabase.d.ts                 # Auto-generated or custom Supabase types
└── index.ts                      # Optional: Barrel file for global types

### `src/locales/` - Global i18n Translations

Translations not specific to a single feature. Feature-specific translations are co-located.

src/locales/
├── en.json
└── es.json

### `src/middleware.ts` - Next.js Edge Middleware

Handles auth, redirects, etc., at the edge.

## 4. Key File Explanations & Workflow Notes

*   **`src/app/layout.tsx` & `src/app/(dashboard)/layout.tsx`**: Define the overall page structure. The root layout wraps everything, while the dashboard layout might add a Navbar/Sidebar for authenticated routes. These layouts will import components from `src/components/common/layout/` and providers from `src/providers/`.
*   **`src/app/.../page.tsx`**: These are your route entry points. They primarily compose UI by importing components from the relevant `src/features/{feature-name}/components/` or `src/features/{feature-name}/index.ts` and shared components from `src/components/`. They also use hooks from `src/features/{feature-name}/queries/` or `src/features/{feature-name}/hooks/`.
*   **`src/features/{feature-name}/index.ts`**: The public API for a feature. All imports from outside a feature should go through this file.
*   **`src/features/{feature-name}/actions.ts`**: Use Server Actions for client-initiated mutations (form submissions, data creation/updates). These actions will call services from `src/features/{feature-name}/services/`.
*   **`src/features/{feature-name}/services/*.service.ts`**: Contain core business logic. They are called by Server Actions or API Route Handlers. Services interact with database clients (e.g., Supabase from `src/lib/clients/supabase.ts`) and external APIs. Services throw errors on failure.
*   **`src/features/{feature-name}/queries/*.queries.ts`**: Define React Query hooks (`useQuery`, `useMutation`) for data fetching and caching. Mutations often call Server Actions.
*   **`src/features/{feature-name}/schemas/*.schema.ts`**: Zod schemas for validating Server Action inputs, API route data, and potentially client-side forms (with `react-hook-form`).
*   **`src/lib/utils/api.utils.ts`**: Contains `createApiRouteHandler` HOF for `src/app/api/` routes. This HOF handles authentication (`requireAuth: true`), request validation (using Zod schemas from feature modules), and standardized error handling. Also contains frontend fetch helpers like `authenticatedGet`, `authenticatedPost`.
*   **`src/features/auth/hooks/useAuth.ts`**: The primary hook for UI components to access authentication state (user, session, loading status) and actions (logout). Relies on `AuthSessionProvider`.
*   **`src/features/auth/utils/api-auth.utils.ts`**: Contains `getServerAuthenticatedUser` to get the combined Supabase user and app profile on the server (in Server Actions, API Routes).
*   **Environment Variables**: Always access through `validatedConfig` from `src/config/env.ts`.

This structure promotes modularity, maintainability, and scalability by co-locating related code and enforcing clear boundaries between features and shared infrastructure.