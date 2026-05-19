import { Metadata } from 'next';
import { UserRound } from 'lucide-react';
import { PrivateRoute } from '@/components/auth/private-route';
import { CandidateProfileRedirect } from '@/components/profile/candidate-profile-redirect';
import { ProfileForm } from '@/components/profile/profile-form';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ROUTES } from '@/constants/routes';
import { PAGE_STYLES, TEXT_STYLES } from '@/constants/styles';

export const metadata: Metadata = {
  title: 'Profile',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <CandidateProfileRedirect>
        <section className={`${PAGE_STYLES.body} py-20`}>
          <div className={PAGE_STYLES.container}>
            <Breadcrumb items={[{ label: 'Home', href: ROUTES.HOME }, { label: 'Perfil' }]} />

            <div className="mt-8 flex items-start gap-3">
              <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
                <UserRound className="h-4 w-4" />
              </span>
              <div>
                <h1 className={TEXT_STYLES.pageTitle}>Perfil</h1>
              </div>
            </div>

            <div className="mt-10">
              <ProfileForm />
            </div>
          </div>
        </section>
      </CandidateProfileRedirect>
    </PrivateRoute>
  );
}
