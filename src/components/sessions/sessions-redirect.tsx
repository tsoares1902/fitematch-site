'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageLoading } from '@/components/ui/page-loading';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { ProductRoleEnum } from '@/types/entities/user.entity';

export function SessionsRedirect() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user?.productRole === ProductRoleEnum.CANDIDATE) {
      router.replace(ROUTES.CANDIDATE_SESSIONS);
      return;
    }

    if (user?.productRole === ProductRoleEnum.RECRUITER) {
      router.replace(ROUTES.RECRUITER_SESSIONS);
      return;
    }

    router.replace(ROUTES.HOME);
  }, [isLoading, router, user?.productRole]);

  return <PageLoading />;
}
