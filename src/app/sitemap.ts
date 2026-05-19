import { MetadataRoute } from 'next';
import { ROUTES } from '@/constants/routes';
import { absoluteUrl } from '@/constants/seo';
import { locales } from '@/i18n/config';
import { JobService } from '@/services/job/job.service';

function toDate(value?: string | Date) {
  if (!value) {
    return new Date();
  }

  return new Date(value);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publicRoutes = [
    ROUTES.HOME,
    ROUTES.JOBS,
    ROUTES.FAQ,
    ROUTES.TERMS_OF_USE,
    ROUTES.PRIVACY_POLICY,
  ];
  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    publicRoutes.map((route) => ({
      url: absoluteUrl(`/${locale}${route === ROUTES.HOME ? '' : route}`),
      lastModified: new Date(),
    })),
  );

  try {
    const jobs = await JobService.list();

    return [
      ...staticRoutes,
      ...locales.flatMap((locale) =>
        jobs.map((job) => ({
          url: absoluteUrl(`/${locale}${ROUTES.JOBS}/${job._id}`),
          lastModified: toDate(
            (job.updatedAt as string | Date | undefined) ||
              (job.createdAt as string | Date | undefined),
          ),
        })),
      ),
    ];
  } catch {
    return staticRoutes;
  }
}
