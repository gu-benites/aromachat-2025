'use server';

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

type SignInCredentials = {
  email: string;
  password: string;
};

type SignUpData = {
  email: string;
  password: string;
  fullName: string;
};

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false, // We'll handle session persistence manually
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

export async function signInWithEmail({ email, password }: SignInCredentials) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

export async function signUpWithEmail({ email, password, fullName }: SignUpData) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error('Sign up error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Get session error:', error);
      throw new Error(error.message);
    }

    return data.session;
  } catch (error) {
    console.error('Session error:', error);
    throw error;
  }
}

export async function getUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Get user error:', error);
      throw new Error(error.message);
    }

    return data.user;
  } catch (error) {
    console.error('User error:', error);
    throw error;
  }
}
