import { getTranslations } from 'next-intl/server';
import { FaqTabs } from '@/components/faq/faq-tabs';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ROUTES } from '@/constants/routes';
import type { Locale } from '@/i18n/config';
import { publicPageMetadata } from '@/utils/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return publicPageMetadata({
    locale,
    pathname: '/faq',
    titleKey: 'faq',
    descriptionKey: 'faqDescription',
  });
}

export default async function FaqPage() {
  const t = await getTranslations('Metadata');
  const faq = await getTranslations('Faq');

  return (
    <section className="min-h-screen bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('home'), href: ROUTES.HOME }, { label: t('faq') }]} />
        <p className="mt-8 text-sm font-medium uppercase tracking-[0.28em] text-lime-400">
          {faq('title')}
        </p>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">{faq('description')}</p>

        <div className="mt-12">
          <FaqTabs />
        </div>
      </div>
    </section>
  );
}
