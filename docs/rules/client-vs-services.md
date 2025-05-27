# Cheat Sheet: Clients (/lib) vs. Services (/features)
This explains why client initializations (e.g., for Supabase, Hasura) belong in src/lib/clients/ and how services in src/features/ use them.
## 1\. Client Initializations (src/lib/clients/)
* *   **What:** Code that sets up and configures connections to external services (databases, BaaS, 3rd-party APIs).
*     * *   Example: src/lib/clients/supabase.ts, src/lib/clients/hasura.ts
* *   **Why Here?**
*     * *   **Singleton/Centralized:** Provides a single, globally configured instance (or factory) for each external service.
*     * *   **Reusable:** Any feature can import and use these pre-configured clients.
*     * *   **Low-Level:** Focuses on how to connect, not what business logic to perform.
*     * *   **Analogy:** Like installing a generic tool (e.g., axios) once for the whole project.
* *   **Contains:**
*     * *   API keys, service URLs (often from src/config/env.ts).
*     * *   Client-specific setup (e.g., Supabase SSR, Apollo Client cache).
* *   **Exports:** Client instances or functions to get client instances.

```
// src/lib/clients/supabase.ts (Conceptual)
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

## 2\. Feature Services (src/features/{feature\_name}/services/)

* *   **What:** Modules containing specific business logic for a feature.
*     * *   Example: src/features/auth/services/auth.service.ts, src/features/user-profile/services/user-profile.service.ts
* *   **Why Here?**
*     * *   **Business Logic:** Implements what to do (e.g., "register user," "fetch profile," "create post").
*     * *   **Feature-Specific:** Tailored to the needs of its particular feature.
*     * *   **Uses Clients:** Imports and utilizes the shared clients from src/lib/clients/ to interact with external systems.
* *   **Contains:**
*     * *   Functions that perform specific operations.
*     * *   Data transformation, validation of business rules.
* *   **Imports:** Clients from src/lib/clients/.

```
// src/features/user-profile/services/user-profile.service.ts
import { createBrowserClient } from '@/lib/clients/supabase'; // Import shared client
```
## Key Takeaway:
* *   src/lib/clients/: **Provides the "tools"** (configured clients).
* *   src/features/.../services/: **Uses the "tools"** to do feature-specific work.

This separation keeps your codebase organized, promotes reusability, and centralizes external service configurations.