import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      /**
       * Custom cookie handling for the Supabase server client.
       */
      cookies: {
        /**
         * Retrieves all cookies from the cookie store.
         * 
         * @returns {Object} An object containing all cookies.
         */
        getAll() {
          return cookieStore.getAll()
        },
        /**
         * Sets multiple cookies at once.
         * 
         * @param {Array<{name: string, value: string, options: Object}>} cookiesToSet - Array of cookie objects to set.
         * @param {string} cookiesToSet[].name - Cookie name.
         * @param {string} cookiesToSet[].value - Cookie value.
         * @param {Object} cookiesToSet[].options - Cookie options.
         */
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // This error occurs when called from a Server Component
            // and can be safely ignored if using middleware for session refresh
            console.debug('setAll called from Server Component, ignoring...')
          }
        },
      },
    }
  )
}