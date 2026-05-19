import { OrganizationJsonLd } from '@/components/seo/organization-json-ld';
import { HomeFeatures } from '@/features/home/components/features';
import { FeaturedJobs } from '@/features/home/components/featured-jobs';
import { HomeHero } from '@/features/home/components/hero';
import { PartnerCompanies } from '@/features/home/components/partner-companies';
import type { Locale } from '@/i18n/config';
import { publicPageMetadata } from '@/utils/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return publicPageMetadata({
    locale,
    pathname: '/',
    titleKey: 'home',
    descriptionKey: 'homeDescription',
  });
}

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <HomeHero />
      <HomeFeatures />
      <PartnerCompanies />
      <FeaturedJobs />
    </>
  );
}
