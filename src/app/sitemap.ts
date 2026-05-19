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

const publicRouteSeo: Record<
  string,
  { changeFrequency: 'daily' | 'weekly' | 'monthly'; priority: number }
> = {
  [ROUTES.HOME]: { changeFrequency: 'daily', priority: 1 },
  [ROUTES.JOBS]: { changeFrequency: 'daily', priority: 0.9 },
  [ROUTES.ABOUT]: { changeFrequency: 'monthly', priority: 0.6 },
  [ROUTES.CONTACT]: { changeFrequency: 'monthly', priority: 0.7 },
  [ROUTES.FAQ]: { changeFrequency: 'monthly', priority: 0.6 },
  [ROUTES.TERMS_OF_USE]: { changeFrequency: 'monthly', priority: 0.3 },
  [ROUTES.PRIVACY_POLICY]: { changeFrequency: 'monthly', priority: 0.3 },
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publicRoutes = Object.keys(publicRouteSeo);
  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    publicRoutes.map((route) => ({
      url: absoluteUrl(`/${locale}${route === ROUTES.HOME ? '' : route}`),
      lastModified: new Date(),
      changeFrequency: publicRouteSeo[route].changeFrequency,
      priority: publicRouteSeo[route].priority,
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
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        })),
      ),
    ];
  } catch {
    return staticRoutes;
  }
}
