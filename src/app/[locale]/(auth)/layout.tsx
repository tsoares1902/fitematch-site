import { AuthOnlyRoute } from '@/components/auth/auth-only-route';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthOnlyRoute>{children}</AuthOnlyRoute>;
}
