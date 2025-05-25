# Project Task Plan: Integrating Purchased Dashboard Template into Bedrock Architecture

**Objective:** Adapt the purchased dashboard template (`/docs/purchased-dashboard-template`) into the company's "Bedrock" Next.js architecture, adhering to internal guidelines for project structure, naming conventions, and best practices.

**Key Reference Documents:**
1.  **Purchased Template:** `/docs/purchased-dashboard-template`
2.  **Bedrock - New Project Structure:** `/docs/project-structure-new-project.md`
3.  **Bedrock - Macro Cheat Sheet:** `/docs/best-practices.md`
4.  **All Bedrock Foundational Docs:** (e.g., feature/service guidelines, API handling, `useAuth`)

---

## Phase 0: Preparation & Setup (Estimated: 1 Day)

*   **[ ] Task 0.1: Thoroughly Review Bedrock Documentation:**
    *   Focus: `project-structure-new-project.md`, `best-practices.md`.
    *   Broaden: Key feature, service, API, and auth guidelines.
*   **[ ] Task 0.2: Analyze Purchased Template:**
    *   Identify: Key layouts, common UI components, main pages/sections, existing structure, styling, interactivity.
*   **[ ] Task 0.3: Set Up New Next.js Project:**
    *   Create new Next.js project.
    *   Initialize Bedrock folder structure (`project-structure-new-project.md`).
    *   Configure ESLint, Prettier.
    *   Install core dependencies: Tailwind CSS, shadcn/ui (init), Lucide Icons, React Query, Zustand, Zod.
    *   Configure `tsconfig.json`, `tailwind.config.js`.

---

## Phase 1: Core Layout and Shared UI Components (Estimated: 2-3 Days)

*Goal: Establish the main application shell and common UI elements.*

*   **[ ] Task 1.1: Implement Root Layout (`src/app/layout.tsx`):**
    *   Integrate global providers (`QueryClientProvider`, `AuthSessionProvider`, `ThemeProvider`).
    *   Basic HTML structure, global styles.
*   **[ ] Task 1.2: Implement Dashboard Layout (`src/app/(dashboard)/layout.tsx`):**
    *   Create reusable layout components in `src/components/common/layout/` (e.g., `Sidebar.tsx`, `Navbar.tsx`, `PageWrapper.tsx`).
    *   Compose them into `src/app/(dashboard)/layout.tsx`.
*   **[ ] Task 1.3: Recreate/Adapt Atomic UI Components (`src/components/ui/`):**
    *   Prioritize using/styling shadcn/ui components to match template.
    *   Create custom if necessary, following shadcn/ui patterns. Style with Tailwind.
*   **[ ] Task 1.4: Recreate/Adapt Common Composed Components (`src/components/common/`):**
    *   Build complex shared elements (modals, user dropdowns, generic tables) composing from `src/components/ui/`.

---

## Phase 2: Authentication Feature (Estimated: 2-3 Days)

*Goal: Implement basic authentication flow using Bedrock principles.*

*   **[ ] Task 2.1: Set up `src/features/auth/` Module:**
    *   Directory structure, types (`auth.types.ts`), Zod schemas (`login.schema.ts`).
*   **[ ] Task 2.2: Implement Auth UI Components (`src/features/auth/components/`):**
    *   Recreate `LoginForm.tsx`, `RegisterForm.tsx` from template using `src/components/ui/`.
*   **[ ] Task 2.3: Implement `AuthSessionProvider` (`src/providers/auth-session-provider.tsx`):**
    *   Supabase client listeners for auth state changes.
*   **[ ] Task 2.4: Implement `useAuth` Hook (`src/features/auth/hooks/useAuth.ts`):**
    *   Follow `essential-hook-guidelines.md`.
*   **[ ] Task 2.5: Implement Auth Services (`src/features/auth/services/auth.service.ts`):**
    *   Login, signup, logout functions using Supabase client.
*   **[ ] Task 2.6: Implement Auth Server Actions (`src/features/auth/actions.ts`):**
    *   Handle form submissions, call auth services, validate with Zod.
*   **[ ] Task 2.7: Implement Auth Pages (`src/app/(auth)/login/page.tsx`, etc.).**
*   **[ ] Task 2.8: Implement `middleware.ts` for Basic Route Protection.**

---

## Phase 3: User Profile Feature (Estimated: 1-2 Days)

*Goal: Implement basic user profile viewing/editing.*

*   **[ ] Task 3.1: Set up `src/features/user-profile/` Module:**
    *   Structure, types, schemas.
*   **[ ] Task 3.2: Implement Profile Service (`user-profile.service.ts`):**
    *   Fetch/update user profile data (Supabase DB).
*   **[ ] Task 3.3: Implement Profile React Query Hooks (`user-profile.queries.ts`):**
    *   `useUserProfileQuery`, mutation hook for updates.
*   **[ ] Task 3.4: Update `useAuth` Hook (`src/features/auth/hooks/useAuth.ts`):**
    *   Integrate `useUserProfileQuery` to merge profile into `authUser`.
*   **[ ] Task 3.5: Implement `getServerAuthenticatedUser` (`src/features/auth/utils/api-auth.utils.ts`):**
    *   Ensure it fetches Supabase user + application profile.
*   **[ ] Task 3.6: Implement Profile UI & Page:**
    *   (e.g., `src/features/user-profile/components/EditProfileForm.tsx`).
    *   Server Action in `src/features/user-profile/actions.ts`.
    *   Page: `src/app/(dashboard)/settings/page.tsx` (initially or dedicated page).

---

## Phase 4: Integrating Core Dashboard Pages (Iterative - Estimated: 5+ Days, page-dependent)

*Goal: Rebuild key dashboard pages one by one, following the feature-based architecture.*

*For each major page/section (e.g., Homepage, Chat, Settings, other features):*
*   **[ ] Task 4.X.1: Create Feature Module (`src/features/{feature-name}/`).**
*   **[ ] Task 4.X.2: Implement Components (`src/features/{feature-name}/components/`).**
*   **[ ] Task 4.X.3: Implement Types (`src/features/{feature-name}/types/`).**
*   **[ ] Task 4.X.4: Implement Services (if backend logic needed) (`src/features/{feature-name}/services/`).**
*   **[ ] Task 4.X.5: Implement React Query Hooks (`src/features/{feature-name}/queries/`).**
*   **[ ] Task 4.X.6: Implement Server Actions (`src/features/{feature-name}/actions.ts`).**
*   **[ ] Task 4.X.7: Implement Page Route (`src/app/(dashboard)/{page-name}/page.tsx` or `src/app/{page-name}/page.tsx`).**
*   **[ ] Task 4.X.8: Write Unit/Integration Tests (Progressively).**

**Examples:**
*   **[ ] Homepage Feature (`src/features/homepage/`, page: `src/app/page.tsx`)**
*   **[ ] Dashboard Chat Feature (`src/features/dashboard-chat/`, page: `src/app/(dashboard)/chat/page.tsx`)**
*   **[ ] Dashboard Settings Feature (`src/features/dashboard-settings/`, page: `src/app/(dashboard)/settings/page.tsx`)**
    *   (This might also reuse `user-profile` components/services).
*   **[ ] Other Feature 1 (`src/features/dashboard-feature-one/`, page: `src/app/(dashboard)/feature-one/page.tsx`)**
*   **[ ] Other Feature 2 (`src/features/dashboard-feature-two/`, page: `src/app/(dashboard)/feature-two/page.tsx`)**

---

## Phase 5: Refinement & Generalization (Ongoing throughout development)

*   **[ ] Task 5.1: Styling:**
    *   Consistent Tailwind CSS application.
    *   Refine `tailwind.config.js` (theme colors, fonts, spacing).
    *   Ensure responsive design.
*   **[ ] Task 5.2: State Management:**
    *   Correct use of React Query, component state, Zustand (if needed).
*   **[ ] Task 5.3: Error Handling:**
    *   User-friendly error messages, error boundaries.
*   **[ ] Task 5.4: Accessibility (a11y):**
    *   Semantic HTML, ARIA attributes.
*   **[ ] Task 5.5: Documentation:**
    *   `README.md` files for new feature modules.
    *   Code comments.

---

**General Guidelines During Development:**
*   **Commit Frequently:** Clear, descriptive commit messages.
*   **Iterate:** Build, test, refine.
*   **Ask Questions:** Clarify any doubts about Bedrock architecture.
*   **Prioritize Core Functionality:** Main structure and key features first.
*   **Adherence to Bedrock is Key:** Bedrock principles override template conflicting patterns.

---
**Regular Sync-ups:** Schedule brief daily or bi-daily check-ins to discuss progress, roadblocks, and ensure alignment with Bedrock principles.