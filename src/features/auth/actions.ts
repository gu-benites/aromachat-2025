'use server';

import { redirect } from 'next/navigation';
import { signInWithEmail, signUpWithEmail, signOut as serverSignOut } from './services/server-auth.service';

export async function signIn(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    await signInWithEmail({ email, password });
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
  
  redirect('/dashboard');
}

export async function signUp(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    
    if (!email || !password || !fullName) {
      throw new Error('All fields are required');
    }

    await signUpWithEmail({ email, password, fullName });
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
  
  redirect('/login?signup=success');
}

export async function signOut() {
  try {
    await serverSignOut();
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
  
  redirect('/login');
}
