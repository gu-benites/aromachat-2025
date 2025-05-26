import { createBrowserClient } from './clients/supabase';

export async function getCurrentUser() {
  const supabase = createBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
}

export async function getUserSession() {
  const supabase = createBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function signOut() {
  const supabase = createBrowserClient();
  await supabase.auth.signOut();
  // Reload the page to update the UI
  window.location.href = '/login';
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string, userData: Record<string, any> = {}) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  
  if (error) throw error;
  return data;
}
