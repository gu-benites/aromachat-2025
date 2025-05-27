/**
 * Authentication utility functions for Next.js API routes and middleware.
 * Handles session management and authentication state synchronization with Supabase.
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Updates the authentication session by syncing Supabase auth state with Next.js cookies.
 * Ensures proper authentication state is maintained during server-side rendering and API routes.
 * 
 * @param {NextRequest} request - The incoming Next.js request object
 * @returns {Promise<NextResponse>} The response object with updated auth cookies
 * 
 * @throws {Error} If required environment variables are missing
 * 
 * @example
 * // In a Next.js API route or middleware:
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request);
 * }
 */
export async function updateSession(request: NextRequest) {
  // Initialize the response object that will be returned
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Create a Supabase client configured for server-side usage with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * Retrieves all cookies from the incoming request
         * This is used by Supabase to access the current session
         */
        getAll() {
          return request.cookies.getAll()
        },
        
        /**
         * Handles setting multiple cookies at once
         * Ensures cookies are properly set in both the request and response
         * 
         * @param {Array<{name: string, value: string}>} cookiesToSet - Array of cookies to set
         */
        setAll(cookiesToSet) {
          // Update the request cookies for the current request
          // This ensures subsequent middleware/handlers see the updated cookies
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // Create a new response with the updated cookies
          // This ensures the client receives the updated cookies
          supabaseResponse = NextResponse.next({
            request, // Maintain the original request reference
          })
          
          // Apply all cookie updates to the response
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not add any code between createServerClient and auth.getUser()
  // This ensures proper session synchronization and prevents race conditions
  // that could cause users to be unexpectedly logged out
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Route protection: Redirect unauthenticated users trying to access protected routes
  if (!user && request.nextUrl.pathname.startsWith('/private')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // Add the current URL as a redirect parameter to return after login
    url.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  /**
   * IMPORTANT: Always return the supabaseResponse object directly.
   * 
   * If you need to modify the response, follow these steps to maintain session consistency:
   * 1. Create a new response with the request context:
   *    ```typescript
   *    const myNewResponse = NextResponse.next({ request })
   *    ```
   * 2. Copy all cookies from supabaseResponse:
   *    ```typescript
   *    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
   *    ```
   * 3. Make your modifications to myNewResponse
   * 4. Return myNewResponse
   * 
   * Failure to follow this pattern may cause authentication issues and session termination.
   */
  return supabaseResponse
}