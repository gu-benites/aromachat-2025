'use client';

import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/database.types';
import { getClientLogger } from '@/lib/logger/client.logger';

const logger = getClientLogger('supabase-client');

/**
 * Type representing the Supabase client for browser usage
 */
type SupabaseClient = ReturnType<typeof createSupabaseBrowserClient<Database>>;

/**
 * Validates and retrieves required Supabase environment variables
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
 * Creates a browser client for Supabase
 * This should be used in client components and the AuthSessionProvider
 * @returns {SupabaseClient} A Supabase client instance for browser use
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

// Export a default browser client for backward compatibility
const supabase = createBrowserClient();

export default supabase;
