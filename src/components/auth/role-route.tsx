'use client';

import { ReactNode, useEffect } from 'react';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { ProductRoleEnum } from '@/types/entities/user.entity';
import { PageLoading } from '@/components/ui/page-loading';
import { useRouter } from '@/i18n/navigation';

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: ProductRoleEnum[];
  redirectTo?: string;
}

export function RoleRoute({ children, allowedRoles, redirectTo = ROUTES.PROFILE }: RoleRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const hasAllowedRole = Boolean(user?.productRole) && allowedRoles.includes(user!.productRole);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.SIGN_IN);
      return;
    }

    if (!isLoading && isAuthenticated && !hasAllowedRole) {
      router.push(redirectTo);
    }
  }, [hasAllowedRole, isAuthenticated, isLoading, redirectTo, router]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!isAuthenticated || !hasAllowedRole) {
    return null;
  }

  return <>{children}</>;
}
