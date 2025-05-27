# Bedrock Error Logging and Handling Guidelines

Based on the provided Bedrock rules and guidelines, error logging and handling are approached differently depending on whether the code is running on the server or the client. This involves a clear separation of concerns between service logic and the calling code (such as Server Actions or API Routes).

Here's how error logging and handling are managed:

## 1. Server-Side Logging (`@Winston`, `getServerLogger`)

*   For structured logging on the backend, `@Winston` is utilized.
*   The configuration for Winston resides in `src/lib/logger/winston.config.ts`. (`src\lib\logger\server.logger.ts`)
*   To obtain module-specific logger instances within services, API routes, and Server Actions, a factory function called `getServerLogger(moduleName: string)` is used, provided by `src/lib/logger/index.ts`.
*   Services should log errors with context using `getServerLogger()`. They are expected to log operations, parameters (while being mindful to mask Personally Identifiable Information - PII), and any errors encountered.
*   Integration with an observability platform like Sentry is configured on the server side (e.g., in `sentry.server.config.ts`).

## 2. Client-Side Logging (Custom Logger, `getClientLogger`)

*   A custom logger, defined in `src/lib/logger/client.logger.ts`, is used for client-side logging.
*   This logger can provide component-specific instances.
*   Critical logs (errors, warnings) from the client logger should be sent to a dedicated Next.js API route (e.g., `/api/logs/client`).
*   This transmission is performed using an authenticated utility function.
*   The `/api/logs/client` route then uses the server-side logger to process and potentially forward these logs. Security considerations, such as rate limiting, are important for this endpoint.
*   For example, the `useAuth` hook utilizes `getClientLogger('useAuth')` (from `src/lib/logger/client.logger.ts`) for error logging related to authentication states, reporting these logs to `/api/logs/client`.
*   Sentry client-side initialization (via `sentry.client.config.ts`) is used to capture unhandled exceptions and performance data from the browser.

## 3. Error Handling Flow (Services vs. Callers)

*   Services encapsulate business logic and interactions with external systems.
*   Services **MUST** be stateless and are required to throw errors upon failure.
*   Services should log the error internally using `getServerLogger()` before throwing it.
*   It is preferred to throw specific custom error classes (e.g., `ProfileNotFoundError`, `DatabaseOperationError` extending `Error`) to allow the caller to handle different error types granularly.
*   The caller (e.g., a Server Action or API Route handler) is responsible for catching errors thrown by services and formatting the final user-facing error response.
*   Callers may choose to log these errors again at a higher level, including additional context such as request details or user ID.

## 4. API Route Handling with `createApiRouteHandler`

*   API route handlers located in `src/app/api/...` **MUST** be constructed using the `createApiRouteHandler` Higher-Order Function (HOF) from `src/lib/utils/api.utils.ts`.
*   This HOF centralizes common concerns, including standardized error handling.
*   It wraps the core logic (the handler function) in a `try...catch` structure.
*   Errors thrown by a service called within the handler will be caught by the `createApiRouteHandler`'s internal mechanism, which then formats a consistent error response to the client.

## 5. Server Action Error Handling

*   Server Actions are the preferred method for client-initiated mutations and also call services.
*   Server Actions are responsible for catching errors thrown by the services they invoke.
*   A standard return type for Server Actions that interact with forms includes a `success` boolean, an optional `message`, optional `data`, and optional `errors` (e.g., for Zod validation failures).
*   Client-side code (such as a React Query mutation hook) calling a Server Action handles the result by checking the `success` flag and the `message` or `errors` fields for logical/validation failures. It uses `onError` for unexpected network errors or errors during Server Action execution.

## 6. User-Friendly Error Messages & Error Boundaries

*   Implement clear, user-friendly error messages that are presented to the end-user.
*   Utilize React Error Boundaries (e.g., `src/app/global-error.tsx` for global errors, and potentially feature-specific boundaries) to gracefully catch and handle JavaScript errors within component trees.
*   Design user-friendly fallback UIs to display when errors occur.

## In Summary: Key Principles

Bedrock mandates a structured approach to error management:

*   **Designated Logger Utilities:**
    *   Utilize `getServerLogger` for server-side operations.
    *   Employ `getClientLogger` for client-side logging, with logs subsequently forwarded to a server endpoint.
*   **Observability:** Integrate with platforms like Sentry for comprehensive monitoring.
*   **Service Behavior:** Services **MUST** throw errors upon failure after logging them internally.
*   **Caller Responsibility:** The calling layer (Server Actions or API Route handlers, often using `createApiRouteHandler`) is responsible for catching these errors and formatting user-facing responses.
*   **Client-Side State Management:** Client components should effectively manage loading, success, and error states, typically leveraging tools like React Query or `useFormState` based on server responses.