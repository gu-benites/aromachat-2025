import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';
import { getClientLogger } from '@/lib/logger/client.logger';

const logger = getClientLogger('supabase-client');

type SupabaseClientType = SupabaseClient<Database>;

/**
 * Validates and retrieves required Supabase environment variables
 * @throws {Error} If any required environment variables are missing
 */
const getEnvVars = () => {
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

  if (!supabaseUrl || !supabaseAnonKey) {
    const error = new Error(
      'Missing Supabase environment variables. Please check your .env.local file.'
    );
    logger.error('Missing Supabase environment variables', { message: error.message });
    throw error;
  }

  return { supabaseUrl, supabaseAnonKey };
};

/**
 * Creates a new Supabase client with the provided configuration
 * @param options Additional client options
 * @returns A configured Supabase client instance
 */
const createSupabaseClient = (options?: {
  accessToken?: string;
  headers?: Record<string, string>;
}): SupabaseClientType => {
  try {
    const { supabaseUrl, supabaseAnonKey } = getEnvVars();
    
    const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'aroma_auth_token',
        ...(options?.accessToken && {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        }),
      },
      global: {
        headers: {
          'X-Client-Info': 'aroma-chat/1.0',
          ...(options?.accessToken && {
            Authorization: `Bearer ${options.accessToken}`,
          }),
          ...options?.headers,
        },
      },
    });

    logger.debug('Created new Supabase client', { 
      hasAccessToken: !!options?.accessToken,
      customHeaders: !!options?.headers,
    });

    return client;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Failed to create Supabase client');
    logger.error('Failed to create Supabase client', { message: err.message });
    throw err;
  }
};

// Default client instance for browser usage
const supabase = createSupabaseClient();

/**
 * Creates a new Supabase client for browser usage
 * @returns A new Supabase client instance
 */
export function createBrowserClient(): SupabaseClientType {
  return createSupabaseClient();
}

/**
 * Creates a new Supabase client for server-side usage
 * @param accessToken Optional access token for authenticated requests
 * @param headers Additional headers to include in requests
 * @returns A new Supabase client instance
 */
export function createServerClient(
  accessToken?: string,
  headers?: Record<string, string>
): SupabaseClientType {
  return createSupabaseClient({ accessToken, headers });
}

export type { SupabaseClientType };
export default supabase;
