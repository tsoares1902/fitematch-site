import { getTranslations } from 'next-intl/server';
import { FaFileContract } from 'react-icons/fa';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { TermsOfUseContent } from '@/components/legal/terms-of-use-content';
import { ROUTES } from '@/constants/routes';
import type { Locale } from '@/i18n/config';
import { publicPageMetadata } from '@/utils/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return publicPageMetadata({
    locale,
    pathname: '/terms-of-use',
    titleKey: 'terms',
    descriptionKey: 'termsDescription',
  });
}

export default async function TermsOfUsePage() {
  const t = await getTranslations('Metadata');
  const page = await getTranslations('PublicPages');

  return (
    <section className="min-h-screen bg-black py-20 text-zinc-200">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: page('home'), href: ROUTES.HOME }, { label: t('terms') }]} />

        <div className="mt-8">
          <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
              <FaFileContract className="h-5 w-5" />
            </span>
            {t('terms')}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">{page('termsSubtitle')}</p>
        </div>

        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <FaFileContract className="h-5 w-5 text-lime-400" />
            <h2 className="text-xl font-semibold text-zinc-100">{page('quickRead')}</h2>
          </div>

          <TermsOfUseContent />
        </div>
      </div>
    </section>
  );
}
