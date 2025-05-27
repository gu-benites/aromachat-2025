declare module '@/providers/auth-session-provider' {
  import { ReactNode } from 'react';
  import { Session } from '@supabase/supabase-js';

  interface AuthSessionProviderProps {
    children: ReactNode;
    initialSession: Session | null;
  }

  export default function AuthSessionProvider(props: AuthSessionProviderProps): JSX.Element;
  
  export function useAuth(): {
    session: Session | null;
    user: any | null;
    loading: boolean;
  };
}
