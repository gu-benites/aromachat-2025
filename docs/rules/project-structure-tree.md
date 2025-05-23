project-root/
├── .github/                      # GitHub Actions workflows and issue/PR templates
├── .husky/                       # Git hooks (e.g., pre-commit, pre-push) for code quality
├── docs/                         # Project documentation (diagrams, database schemas, ADRs, etc.)
│   ├── diagrams/                 # System architecture diagrams
│   ├── database_sql/             # Contains SQL scripts purely for reference/manual recovery
├── public/                       # Static assets (images, fonts, favicon.ico, robots.txt, etc.)
├── hasura/                       # Hasura configuration (managed by Hasura CLI)
│   ├── migrations/               # Database schema definitions, relationships, permissions
│   ├── metadata/                 # Hasura metadata (actions, remote schemas, etc.)
│   └── config.yaml               # Hasura CLI configuration
├── src/
│   ├── app/                      # Next.js App Router (Routing layer)
│   │   ├── (auth)/               # Route group for auth-related routes
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── ...
│   │   ├── (dashboard)/          # Route group for protected dashboard routes
│   │   │   ├── overview/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── ...
│   │   ├── api/                  # API route handlers (webhooks, specific non-Next.js client needs)
│   │   │   ├── health/route.ts
│   │   │   ├── logs/client/route.ts
│   │   │   └── [feature]/...
│   │   ├── layout.tsx            # Root layout
│   │   ├── global-error.tsx      # Global error boundary
│   │   └── ...
│   ├── features/                 # **CORE: Feature-based modules**
│   │   ├── auth/                 # Auth Feature Module
│   │   │   ├── components/       # UI components specific to auth
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── login-form.test.tsx
│   │   │   │   ├── login-form.stories.tsx
│   │   │   │   └── register-form.tsx
│   │   │   ├── hooks/            # Feature-specific React hooks (non-data-fetching UI logic)
│   │   │   │   ├── useAuth.ts    # As defined in essential-hook-guidelines.md
│   │   │   │   ├── index.ts      # Barrel file for hooks
│   │   │   │   └── use-auth-form-state.ts # Example other auth-related hook
│   │   │   ├── services/         # Business logic services for auth
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.service.test.ts
│   │   │   ├── schemas/          # Zod validation schemas for auth
│   │   │   │   ├── login.schema.ts
│   │   │   │   └── register.schema.ts
│   │   │   ├── types/            # TypeScript types specific to auth
│   │   │   │   └── auth.types.ts
│   │   │   ├── queries/          # React Query definitions for auth
│   │   │   │   └── auth.queries.ts
│   │   │   ├── translations/     # i18n translation files for this feature
│   │   │   │   ├── en.json
│   │   │   │   └── es.json
│   │   │   ├── utils/            # Utility functions specific to the auth feature
│   │   │   │   └── api-auth.utils.ts # e.g., HOFs for API route authentication
│   │   │   ├── actions.ts        # Server Actions specific to auth
│   │   │   ├── actions.test.ts   # Tests for Server Actions
│   │   │   ├── README.md         # Documentation for the auth feature module
│   │   │   └── index.ts          # Barrel file: Public API of the auth module
│   │   ├── user-profile/         # User Profile Feature Module
│   │   │   ├── components/       # (e.g., EditProfileForm, ProfileAvatar)
│   │   │   │   ├── edit-profile-form.tsx
│   │   │   │   ├── edit-profile-form.test.tsx
│   │   │   │   └── edit-profile-form.stories.tsx
│   │   │   ├── services/         # (e.g., user-profile.service.ts)
│   │   │   │   └── user-profile.service.test.ts
│   │   │   ├── schemas/          # (e.g., profile-update.schema.ts)
│   │   │   ├── types/            # (e.g., user-profile.types.ts)
│   │   │   ├── queries/          # (e.g., useUserProfileQuery)
│   │   │   ├── translations/     # i18n translation files
│   │   │   │   ├── en.json
│   │   │   │   └── es.json
│   │   │   ├── actions.ts        # (e.g., handleUpdateProfile Server Action)
│   │   │   ├── actions.test.ts
│   │   │   ├── README.md
│   │   │   └── index.ts
│   │   └── ...                   # Other distinct feature modules
│   ├── components/               # **Shared UI components (not specific to a single feature)**
│   │   ├── ui/                   # Atomic UI components (e.g., from shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── button.test.tsx
│   │   │   ├── button.stories.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   └── common/               # Composed shared components
│   │       ├── layout/           # Global layout components (Navbar, Sidebar, Footer)
│   │       │   ├── navbar.tsx
│   │       │   └── page-wrapper.tsx
│   │       ├── forms/            # Generic form elements/wrappers
│   │       │   └── form-field-wrapper.tsx
│   │       └── feedback/         # (e.g., GenericModal, ToasterWrapper)
│   │           └── loading-spinner.tsx
│   ├── lib/                      # Low-level libraries, clients, and core utilities
│   │   ├── clients/              # External API client initializations
│   │   │   ├── supabase.ts
│   │   │   ├── hasura.ts
│   │   │   ├── redis.ts
│   │   │   └── openai.ts
│   │   ├── auth/                 # Core, reusable auth utility functions (generic)
│   │   ├── logger/               # Centralized logging configuration
│   │   │   ├── index.ts
│   │   │   ├── winston.config.ts
│   │   │   └── client.logger.ts
│   │   ├── events/               # Optional: For a simple global event bus if needed
│   │   └── utils/                # Truly generic utility functions (date, string, etc.)
│   │       ├── api.utils.ts      # HOFs like createApiRouteHandler, frontend fetch helpers
│   │       ├── date.utils.ts
│   │       ├── string.utils.ts   # Example generic util
│   │       └── index.ts          # Barrel file for utils
│   │
│   ├── providers/                # Global React context providers
│   │   ├── query-client-provider.tsx
│   │   └── auth-session-provider.tsx
│   ├── config/                   # Application-wide configuration
│   │   ├── env.ts                # Environment variable validation (Zod)
│   │   ├── constants.ts          # Global app constants
│   │   └── site.ts               # Site metadata
│   ├── hooks/                    # **Shared custom React hooks (non-data-fetching, non-feature-specific)**
│   │   └── use-media-query.ts
│   ├── store/                    # Global client-side state management (e.g., Zustand)
│   │   ├── index.ts
│   │   └── slices/
│   │       └── global-settings.slice.ts
│   ├── styles/                   # Global styles, Tailwind base/components/utilities
│   │   └── globals.css
│   ├── types/                    # **Global TypeScript types and interfaces**
│   │   ├── api.types.ts
│   │   ├── supabase.d.ts
│   │   └── index.ts
│   ├── locales/                  # Global i18n translation files (if not all are feature-specific)
│   │   ├── en.json
│   │   └── es.json
│   └── middleware.ts             # Next.js Edge middleware
├── scripts/                      # Utility scripts
├── .env.example
├── .gitignore
├── .nvmrc
├── components.json               # shadcn/ui configuration
├── eslint.config.mjs
├── next.config.js
├── package.json
├── postcss.config.js
├── prettier.config.js
├── sentry.client.config.ts
├── sentry.server.config.ts
├── sentry.edge.config.ts (if applicable)
├── tailwind.config.js
├── tsconfig.json
└── README.md