import { User } from '@supabase/supabase-js';

export type AuthUser = User & {
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: AuthUser;
};

export type AuthState = {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  error: Error | null;
};
