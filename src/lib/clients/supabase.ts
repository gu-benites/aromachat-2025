import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import { getClientLogger } from '@/lib/logger/client.logger';

const logger = getClientLogger('supabase-client');

/**
 * Type representing the Supabase client for browser usage
 */
type SupabaseClient = ReturnType<typeof createSupabaseBrowserClient<Database>>;

/**
 * Validates and retrieves required Supabase environment variables
 * @returns {Object} Object containing Supabase URL and anonymous key
 * @property {string} supabaseUrl - The URL of the Supabase project
 * @property {string} supabaseAnonKey - The anonymous/public key for Supabase
 * @throws {Error} If any required environment variables are missing
 */
const getEnvVars = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const error = new Error(
      'Missing Supabase environment variables. Please check your .env.local file.'
    );
    logger.error('Missing Supabase environment variables', error);
    throw error;
  }

  return { 
    supabaseUrl, 
    supabaseAnonKey
  };
};

/**
 * Creates a browser client for Supabase with automatic session management
 * 
 * @example
 * // In a client component:
 * const supabase = createBrowserClient();
 * const { data } = await supabase.from('todos').select('*');
 * 
 * @returns {SupabaseClient} A configured Supabase client for browser use
 * @throws {Error} If required environment variables are missing
 */
export function createBrowserClient(): SupabaseClient {
  const { supabaseUrl, supabaseAnonKey } = getEnvVars();
  
  return createSupabaseBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    }
  );
}

// Export types for use throughout the application
export type { SupabaseClient };

/**
 * Creates a server-side Supabase client with request-specific cookie handling
 * 
 * @example
 * // In a server component or route handler:
 * const cookieStore = cookies();
 * const supabase = createServerClient(cookieStore);
 * const { data } = await supabase.from('todos').select('*');
 * 
 * @param {ReturnType<typeof cookies>} cookieStore - The cookies from the request
 * @returns {SupabaseClient} A configured Supabase client for server-side use
 * @throws {Error} If required environment variables are missing
 */
export function createServerClient(cookieStore: ReturnType<typeof cookies>) {
  const { supabaseUrl, supabaseAnonKey } = getEnvVars();

  return createSupabaseServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie setting in server actions
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookie removal in server actions
          }
        },
      },
    }
  );
}

// Export a default browser client for backward compatibility
const supabase = createBrowserClient();

export default supabase;
