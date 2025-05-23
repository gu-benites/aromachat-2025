/**
 * Type declarations for the Supabase client
 */

declare module '@/lib/clients/supabase' {
  import { SupabaseClient, createClient as createSupabaseClient } from '@supabase/supabase-js';
  import { Database } from '@/lib/database.types';

  /**
   * Creates a new Supabase client for browser usage
   */
  export function createBrowserClient(): SupabaseClient<Database>;

  /**
   * Creates a new Supabase client for server-side usage
   * @param accessToken The access token for the user session
   */
  export function createServerClient(accessToken?: string): SupabaseClient<Database>;
}
