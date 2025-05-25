# Macro Cheat Sheet

    Development Philosophy
    - Write clean, maintainable, and scalable code
    - Follow SOLID principles
    - Prefer functional and declarative programming patterns over imperative (aligns with functional services in bedrock)
    - Emphasize type safety and static analysis (aligns with TypeScript & Zod usage in bedrock)
    - Practice component-driven development (aligns with React & feature-based structure in bedrock)

    Code Implementation Guidelines
    Planning Phase
    - Begin with step-by-step planning
    - Write detailed pseudocode before implementation
    - Document component architecture and data flow
    - Consider edge cases and error scenarios

    Code Style
    - Follow the project's Prettier configuration for indentation, quotes, semicolons, and line length.
    - Eliminate unused variables (enforced by ESLint as per bedrock practices).
    - Add space after keywords (typically handled by Prettier).
    - Add space before function declaration parentheses (typically handled by Prettier).
    - Always use strict equality (===) instead of loose equality (==).
    - Space infix operators (typically handled by Prettier).
    - Add space after commas (typically handled by Prettier).
    - Keep else statements on the same line as closing curly braces (typically handled by Prettier).
    - Use curly braces for multi-line if statements (typically handled by Prettier).
    - Always handle error parameters in callbacks or use try/catch with async/await as preferred in services.
    - Use trailing commas in multiline object/array literals (typically handled by Prettier).

    Naming Conventions
    General Rules
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

    Specific Naming Patterns
    - Prefix event handlers with 'handle': `handleClick`, `handleSubmit`
    - Prefix boolean variables with verbs: `isLoading`, `hasError`, `canSubmit`, `isAuthenticated`
    - Prefix custom hooks with 'use': `useAuth`, `useFormValidation` (as per React & bedrock conventions)
    - Use complete words over abbreviations except for common and well-understood ones like:
      - `err` (error)
      - `req` (request)
      - `res` (response)
      - `props` (properties)
      - `ref` (reference)

    React Best Practices
    Component Architecture
    - Use functional components with TypeScript interfaces/types.
    - Define components using the `function` keyword or arrow functions (both acceptable as seen in bedrock examples).
    - Extract reusable UI logic into custom hooks (non-data-fetching UI logic in `src/features/{feature}/hooks/` or shared ones in `src/hooks/`).
    - Implement proper component composition.
    - Use `React.memo()` strategically for performance.
    - Implement proper cleanup in `useEffect` hooks.

    React Performance Optimization
    - Use `useCallback` for memoizing callback functions.
    - Implement `useMemo` for expensive computations.
    - Avoid inline function definitions in JSX where performance is critical.
    - Implement code splitting using dynamic imports (`next/dynamic`).
    - Implement proper `key` props in lists (avoid using index as key if list can reorder or items have stable IDs).

    Next.js Best Practices
    Core Concepts
    - Utilize App Router for routing (as per bedrock `src/app/`).
    - Implement proper metadata management (e.g., using `generateMetadata`).
    - Use proper caching strategies (server-side with Redis/Upstash, client-side with React Query, Hasura caching, as outlined in bedrock).
    - Implement proper error boundaries (e.g., `global-error.tsx` and feature-level if needed).

    Components and Features
    - Use Next.js built-in components where appropriate:
      - `Image` component for optimized images.
      - `Link` component for client-side navigation.
      - `Script` component for external scripts.
    - Implement proper loading states (e.g., with `loading.tsx`, React Suspense).
    - Use proper data fetching methods:
        - React Query for client-side data fetching and caching (`src/features/{feature}/queries/`).
        - Server Actions for mutations and some server-side data fetching (`src/features/{feature}/actions.ts`).
        - API Routes in `src/app/api/` for specific use cases like webhooks, delegating to services.

    Server Components
    - Default to Server Components for UI that doesn't require client-side interactivity.
    - Use URL query parameters or route params for data fetching and server state management.
    - Use 'use client' directive only when necessary for:
      - Event listeners (`onClick`, `onChange`, etc.)
      - Browser APIs (`window`, `localStorage`)
      - State and lifecycle effects (`useState`, `useEffect`, `useReducer`)
      - Client-side-only libraries.

    TypeScript Implementation
    - Enable strict mode in `tsconfig.json`.
    - Define clear interfaces/types for component props, state, service function parameters/return types, and other data structures (co-located in `src/features/{feature}/types/` or global in `src/types/`).
    - Use type guards to handle potential `undefined` or `null` values safely.
    - Apply generics to functions, types, and custom hooks where type flexibility is needed.
    - Utilize TypeScript utility types (`Partial`, `Pick`, `Omit`, `ReturnType`, `Parameters`, etc.) for cleaner and reusable code.
    - Prefer `interface` for defining object shapes that might be extended, `type` for unions, intersections, or more complex type compositions (follow project consistency).
    - Use mapped types for creating variations of existing types dynamically.

    UI and Styling
    Component Libraries
    - Use Shadcn UI for consistent, accessible component design (from `src/components/ui/` as per bedrock).
    - Leverage Radix UI primitives (which Shadcn UI is built upon) for customizable, accessible UI elements.
    - Apply composition patterns to create modular, reusable components (shared in `src/components/common/` or feature-specific in `src/features/{feature}/components/`).

    Styling Guidelines
    - Use Tailwind CSS for utility-first, maintainable styling (configured in `tailwind.config.js`).
    - Design with mobile-first, responsive principles for flexibility across devices.
    - Implement dark mode using CSS variables or Tailwind’s dark mode features.
    - Ensure color contrast ratios meet accessibility standards for readability.
    - Maintain consistent spacing values to establish visual harmony.
    - Define CSS variables for theme colors and spacing in `src/styles/globals.css` to support easy theming and maintainability.

    State Management
    Local State
    - Use `useState` for simple component-level state.
    - Implement `useReducer` for more complex component-level state logic.
    - Use `useContext` for sharing state within a specific component subtree (providers in `src/providers/`).
    - Implement proper state initialization.

    Global State
    - Use **Zustand** for global client-side state management (as specified in bedrock `tech-stack.md` and located in `src/store/`).
      - Define stores with `create` from Zustand.
      - Separate concerns by feature or domain into different slices/stores if application grows complex.
      - Access state using the generated hook from the store.
      - Consider patterns for memoized selectors if deriving complex data from state.

    Error Handling and Validation
    Form Validation
    - Use Zod for schema validation (schemas co-located in `src/features/{feature}/schemas/`).
      - For Server Actions, validate input against Zod schemas.
      - For API Routes, use `createApiRouteHandler` with Zod schemas.
      - For client-side forms, use with libraries like React Hook Form.
    - Implement clear, user-friendly error messages.
    - Use React Hook Form for managing form state, submission, and validation.

    Error Boundaries
    - Use React Error Boundaries to catch and handle JavaScript errors in component trees gracefully.
      - Implement a global error boundary (`src/app/global-error.tsx`).
      - Consider feature-specific error boundaries for more granular control.
    - Log caught errors to an external service (e.g., Sentry, as configured in bedrock).
    - Design user-friendly fallback UIs to display when errors occur.

    Testing
    Unit Testing
    - Write thorough unit tests for services, utility functions, complex hook logic, and individual components.
    - Use Jest as the test runner and React Testing Library for testing React components.
    - Follow patterns like Arrange-Act-Assert (or Given-When-Then) for clarity.
    - Mock external dependencies (e.g., API clients from `src/lib/clients/`, `getServerLogger`) and service calls to isolate unit tests (as shown in bedrock `service-implementation-cheat-sheet.md`).

    Integration Testing
    - Focus on testing interactions between components, services, and user workflows.
    - Set up and tear down test environments or states properly to maintain test independence.
    - Use snapshot testing sparingly and for specific UI components where visual regression is critical.
    - Leverage testing utilities (e.g., `screen`, `userEvent` from RTL) for robust tests.

    Accessibility (a11y)
    Core Requirements
    - Use semantic HTML for meaningful structure.
    - Apply accurate ARIA (Accessible Rich Internet Applications) attributes where native semantics are insufficient.
    - Ensure full keyboard navigation support for all interactive elements.
    - Manage focus order and visibility effectively (e.g., for modals, dropdowns).
    - Maintain accessible color contrast ratios (WCAG AA minimum).
    - Follow a logical heading hierarchy (`<h1>` to `<h6>`).
    - Make all interactive elements (buttons, links, form controls) accessible and clearly identifiable.
    - Provide clear and accessible error feedback, associating errors with their respective form fields.

    Security
    - Implement input sanitization where displaying user-generated content to prevent XSS attacks.
      - Consider libraries like DOMPurify if directly rendering HTML from untrusted sources.
    - Adhere to authentication and authorization patterns outlined in bedrock `auth-api-guidelines.md` and `service-implementation-cheat-sheet.md`.
      - Utilize Supabase Auth for user authentication.
      - Ensure proper session management (e.g., via `middleware.ts`, `AuthSessionProvider`).
      - Secure API routes and Server Actions by validating user identity and permissions.

    Internationalization (i18n)
    - If implementing i18n:
      - Consider using a library such as `next-i18next` or `react-i18next` with a suitable Next.js integration.
      - Organize feature-specific translation files in `src/features/{feature}/translations/` and global/shared translations in `src/locales/` (as per bedrock `project-structure-guidelines.md`).
      - Implement proper locale detection (e.g., from browser, user preference, URL).
      - Use appropriate libraries or browser APIs for number, date, and currency formatting based on locale.
      - Implement proper Right-To-Left (RTL) support if targeting RTL languages.

    Documentation
    - Maintain `README.md` files within each feature directory (`src/features/{feature}/README.md`) to document:
        - Overview of the feature.
        - How to use its main components, hooks, services, and actions.
        - Any specific configurations or environment variables it relies on.
        - Important architectural decisions or gotchas related to the feature.
    - For code-level API documentation (functions, classes, types), consider using JSDoc comments.
      - Document all public functions, types, and interfaces.
      - Add examples where appropriate.
      - Keep descriptions clear, concise, and use complete sentences.