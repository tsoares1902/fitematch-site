import { PrivateRoute } from '@/components/auth/private-route';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
