'use client';

import { ReactNode, useEffect } from 'react';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { PageLoading } from '@/components/ui/page-loading';
import { useRouter } from '@/i18n/navigation';

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.SIGN_IN);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
