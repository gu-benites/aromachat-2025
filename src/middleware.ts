import { type NextRequest } from 'next/server'
import { updateSession } from '@/features/auth/utils/api-auth.utils'

/**
 * Middleware function that runs on every request
 * Handles session management and authentication state
 * 
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<NextResponse>} The response after processing
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

/**
 * Configuration for the middleware
 * Defines the routes that the middleware should run on
 */
export const config = {
  /**
   * Pattern to match request paths
   * The middleware will run on all paths that match this pattern
   * 
   * The pattern excludes:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - Files with extensions .svg, .png, .jpg, .jpeg, .gif, .webp
   */
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}