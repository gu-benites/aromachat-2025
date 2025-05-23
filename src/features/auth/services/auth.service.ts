import { createBrowserClient } from '@/lib/clients/supabase';

type SignInCredentials = {
  email: string;
  password: string;
};

type SignUpData = {
  email: string;
  password: string;
  fullName: string;
};

export async function signInWithEmail({ email, password }: SignInCredentials) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signUpWithEmail({ email, password, fullName }: SignUpData) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return { success: true };
}

export async function getSession() {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getUser() {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}
