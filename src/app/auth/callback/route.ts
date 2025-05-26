'use server';

import { createServerClient } from '@/lib/clients/supabase';
import { NextResponse } from 'next/server';

/**
 * Handles the OAuth callback from Supabase Auth
 * @param request The incoming request object
 * @returns A redirect response to the specified URL or home page
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';
  const error = requestUrl.searchParams.get('error');

  if (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(
      new URL(`/auth/error?error=${encodeURIComponent(error)}`, requestUrl.origin)
    );
  }

  if (code) {
    try {
      // Use the server client with proper cookie handling
      const supabase = createServerClient();
      
      // Exchange the code for a session
      const { error: authError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (authError) {
        console.error('Error exchanging code for session:', authError);
        return NextResponse.redirect(
          new URL(`/auth/error?error=${encodeURIComponent(authError.message)}`, requestUrl.origin)
        );
      }

      // Get the session to ensure it's set
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return NextResponse.redirect(
          new URL('/auth/error?error=no_session', requestUrl.origin)
        );
      }
    } catch (error) {
      console.error('Error in auth callback:', error);
      return NextResponse.redirect(
        new URL(
          `/auth/error?error=${encodeURIComponent(
            error instanceof Error ? error.message : 'Unknown error'
          )}`, 
          requestUrl.origin
        )
      );
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
