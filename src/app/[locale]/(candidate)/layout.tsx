import { ReactNode } from 'react';
import { Metadata } from 'next';
import { RoleRoute } from '@/components/auth/role-route';
import { ProductRoleEnum } from '@/types/entities/user.entity';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function CandidateLayout({ children }: { children: ReactNode }) {
  return <RoleRoute allowedRoles={[ProductRoleEnum.CANDIDATE]}>{children}</RoleRoute>;
}
