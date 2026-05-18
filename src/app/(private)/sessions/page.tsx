import { Metadata } from 'next';
import { PrivateRoute } from '@/components/auth/private-route';
import { SessionsRedirect } from '@/components/sessions/sessions-redirect';

export const metadata: Metadata = {
  title: 'Sessões',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SessionsPage() {
  return (
    <PrivateRoute>
      <SessionsRedirect />
    </PrivateRoute>
  );
}
