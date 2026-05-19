import { Metadata } from 'next';
import { JobDetailsPageContent } from '@/components/jobs/job-details-page-content';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '@/constants/seo';
import { JobPostingJsonLd } from '@/components/seo/job-posting-json-ld';
import { CompanyService } from '@/services/company/company.service';
import { JobService } from '@/services/job/job.service';
import { stripHtml, toAbsoluteUrl, truncateMetaDescription } from '@/utils/seo.utils';
import { resolveFileUrl } from '@/utils/file-url';

interface JobDetailsPageProps {
  params: Promise<{
    jobId: string;
  }>;
}

export async function generateMetadata({ params }: JobDetailsPageProps): Promise<Metadata> {
  const { jobId } = await params;
  const canonicalUrl = absoluteUrl(`/jobs/${jobId}`);

  try {
    const job = await JobService.read(jobId);
    const description = truncateMetaDescription(stripHtml(job.description || ''));
    const imageUrl = job.media?.coverUrl
      ? resolveFileUrl(job.media.coverUrl)
      : absoluteUrl(DEFAULT_OG_IMAGE);

    return {
      title: job.title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${job.title} | ${SITE_NAME}`,
        description,
        url: canonicalUrl,
        images: [{ url: toAbsoluteUrl(imageUrl) || absoluteUrl(DEFAULT_OG_IMAGE) }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${job.title} | ${SITE_NAME}`,
        description,
        images: [toAbsoluteUrl(imageUrl) || absoluteUrl(DEFAULT_OG_IMAGE)],
      },
    };
  } catch {
    return {
      title: 'Vaga',
      description: 'Veja detalhes da vaga na fitematch.',
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `Vaga | ${SITE_NAME}`,
        description: 'Veja detalhes da vaga na fitematch.',
        url: canonicalUrl,
        images: [{ url: absoluteUrl(DEFAULT_OG_IMAGE) }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `Vaga | ${SITE_NAME}`,
        description: 'Veja detalhes da vaga na fitematch.',
        images: [absoluteUrl(DEFAULT_OG_IMAGE)],
      },
    };
  }
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { jobId } = await params;
  let jobForJsonLd: Parameters<typeof JobPostingJsonLd>[0]['job'] | null = null;

  try {
    const job = await JobService.read(jobId);
    const companies = job.company ? [] : await CompanyService.listPublic();
    const company = job.company
      ? job.company
      : companies.find((item) => item._id === job.companyId);

    jobForJsonLd = {
      ...job,
      company: company || job.company,
    };
  } catch {
    jobForJsonLd = null;
  }

  return (
    <>
      {jobForJsonLd && <JobPostingJsonLd job={jobForJsonLd} />}
      <JobDetailsPageContent jobId={jobId} />
    </>
  );
}
