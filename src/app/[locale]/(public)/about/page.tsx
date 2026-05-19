import { AboutPageContent } from '@/features/about/components/about-page-content';
import type { Locale } from '@/i18n/config';
import { publicPageMetadata } from '@/utils/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return publicPageMetadata({
    locale,
    pathname: '/about',
    titleKey: 'about',
    descriptionKey: 'aboutDescription',
  });
}

export default function AboutPage() {
  return <AboutPageContent />;
}
