import { createBrowserClient } from '@supabase/ssr'

// Helper to check if we're in the browser
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (!isBrowser) return undefined
          // Get the cookie value from document.cookie
          const value = `; ${document.cookie}`
          const parts = value.split(`; ${name}=`)
          if (parts.length === 2) return parts.pop()?.split(';').shift()
          return undefined
        },
        set(name: string, value: string, options: any) {
          if (!isBrowser) return
          try {
            document.cookie = `${name}=${value}${options?.maxAge ? `; Max-Age=${options.maxAge}` : ''}${options?.path ? `; Path=${options.path}` : ''}${options?.sameSite ? `; SameSite=${options.sameSite}` : ''}${options?.secure ? '; Secure' : ''}${options?.httpOnly ? '; HttpOnly' : ''}`
          } catch (error) {
            // Handle error if needed
          }
        },
        /**
         * Removes a cookie by setting its max age to 0
         * @param {string} name - Name of the cookie to remove
         * @param {Object} [options] - Additional cookie options
         * @param {string} [options.path] - Cookie path that was used when setting the cookie
         */
        remove(name: string, options: any) {
          if (!isBrowser) return
          try {
            document.cookie = `${name}=; Max-Age=0${options?.path ? `; Path=${options.path}` : ''}`
          } catch (error) {
            // Silently handle errors to prevent breaking the application
          }
        },
      },
    }
  )
}