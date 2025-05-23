import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

export type AuthenticatedUser = {
  id: string;
  email: string;
  // Add other user properties as needed
};

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
        },
      }
    );

    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.user) {
      return { user: null, error: error || new Error('No active session') };
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email!,
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

export async function requireAuthenticatedUser() {
  const { user, error } = await getAuthenticatedUser();
  
  if (error || !user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

// Server-side auth utilities
export async function getServerSession() {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  return supabase.auth.getSession();
}

export async function getCurrentUser() {
  const { data: { session } } = await getServerSession();
  return session?.user ?? null;
}

// Client-side auth utilities (for use in client components)
// Note: This is now a re-export of the main useAuth hook from @/features/auth/hooks/use-auth
export { useAuth } from '@/features/auth/hooks/use-auth';
