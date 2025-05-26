import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Database } from '@/lib/database.types';

/**
 * Type representing an authenticated user in the application
 */
export type AuthenticatedUser = {
  id: string;
  email: string;
  full_name?: string;
  // Add other user properties as needed
};

/**
 * Retrieves the currently authenticated user on the server side
 * @returns An object containing the user and any error that occurred
 */
export async function getAuthenticatedUser(): Promise<{
  user: AuthenticatedUser | null;
  error: Error | null;
}> {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.user) {
      return { user: null, error: error || new Error('No active session') };
    }

    // Get additional user data if needed
    const { data: userData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email!,
        full_name: userData?.full_name,
        // Map other user properties as needed
      },
      error: null,
    };
  } catch (error) {
    console.error('Auth error:', error);
    return { 
      user: null, 
      error: error instanceof Error ? error : new Error('Authentication failed') 
    };
  }
}

/**
 * Server-side authentication utilities
 */
export async function getServerSession() {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return { session: null, error: error || new Error('No session found') };
    }

    return { session, error: null };
  } catch (error) {
    console.error('Error getting server session:', error);
    return { 
      session: null, 
      error: error instanceof Error ? error : new Error('Failed to get session') 
    };
  }
}

/**
 * Gets the current user from the session
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser() {
  const result = await getServerSession();
  return result.session?.user || null;
}

/**
 * Ensures the user is authenticated
 * @throws {Error} If the user is not authenticated
 * @returns The authenticated user
 */
export async function requireAuthenticatedUser() {
  const { user, error } = await getAuthenticatedUser();
  
  if (error || !user) {
    throw new Error(error?.message || 'User not authenticated');
  }
  
  return user;
}

// Client-side auth utilities (for use in client components)
// This is a re-export of the main useAuth hook from @/features/auth/hooks/use-auth
export { useAuth } from '@/features/auth/hooks/use-auth';
