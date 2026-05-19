'use client';

import { useEffect } from 'react';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { ProductRoleEnum } from '@/types/entities/user.entity';
import { PageLoading } from '@/components/ui/page-loading';
import { useRouter } from '@/i18n/navigation';

export function CandidateProfileRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const redirectHref =
    user?.productRole === ProductRoleEnum.CANDIDATE
      ? ROUTES.CANDIDATE_PROFILE
      : user?.productRole === ProductRoleEnum.RECRUITER
        ? ROUTES.RECRUITER_PROFILE
        : null;

  useEffect(() => {
    if (!isLoading && redirectHref) {
      router.replace(redirectHref);
    }
  }, [isLoading, redirectHref, router]);

  if (isLoading || redirectHref) {
    return <PageLoading />;
  }

  return <>{children}</>;
}
