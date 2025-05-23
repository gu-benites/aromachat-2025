import { Session, User } from '@supabase/supabase-js';

declare global {
  interface Window {
    env: {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    };
  }
}

// Extend the Session type to include any custom fields
interface CustomSession extends Session {
  user: User & {
    // Add any custom user fields here
  };
}

export {}; // This file needs to be a module
