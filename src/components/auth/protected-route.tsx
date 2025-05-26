'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the current URL to redirect back after login
      const redirectUrl = window.location.pathname + window.location.search;
      router.push(`/login?redirectTo=${encodeURIComponent(redirectUrl)}`);
    } else if (!isLoading && isAuthenticated && requireAdmin && !user?.user_metadata?.isAdmin) {
      // If admin access is required but user is not an admin
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, requireAdmin, router, user]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || (requireAdmin && !user?.user_metadata?.isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
