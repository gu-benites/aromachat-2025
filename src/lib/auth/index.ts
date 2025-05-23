// Authentication utilities and types

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Session {
  user: User;
  expires: string;
}

/**
 * Checks if the user is authenticated
 * @param session - The current session
 * @returns boolean indicating if the user is authenticated
 */
export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user;
}

/**
 * Gets the current user from the session
 * @param session - The current session
 * @returns The current user or null if not authenticated
 */
export function getCurrentUser(session: Session | null): User | null {
  return session?.user || null;
}

/**
 * Checks if the current user has a specific role
 * @param session - The current session
 * @param role - The role to check for
 * @returns boolean indicating if the user has the specified role
 */
export function hasRole(session: Session | null, role: string): boolean {
  // This is a placeholder - implement your own role checking logic
  return false;
}
