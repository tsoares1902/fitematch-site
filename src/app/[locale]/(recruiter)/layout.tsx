import { RoleRoute } from '@/components/auth/role-route';
import { Metadata } from 'next';
import { ProductRoleEnum } from '@/types/entities/user.entity';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return <RoleRoute allowedRoles={[ProductRoleEnum.RECRUITER]}>{children}</RoleRoute>;
}
