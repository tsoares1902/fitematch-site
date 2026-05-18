'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Copy, Globe, MapPin, Share2 } from 'lucide-react';
import { FaFacebookF, FaLinkedinIn, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';
import { useApplications } from '@/hooks/use-applications';
import { useAuth } from '@/hooks/use-auth';
import { useJob } from '@/hooks/use-job';
import { usePublicCompanies } from '@/hooks/use-public-companies';
import { Alert } from '@/components/ui/alert';
import { ApplyJobButton } from '@/components/jobs/apply-job-button';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { JobCard } from '@/components/jobs/job-card';
import { JobLocationMapTest } from '@/components/jobs/job-location-map-test';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { PAGE_STYLES } from '@/constants/styles';
import { ProductRoleEnum } from '@/types/entities/user.entity';
import { resolveFileUrl } from '@/utils/file-url';

interface JobDetailsPageContentProps {
  jobId: string;
}

function ShareButton({
  href,
  icon,
  className,
}: {
  href: string;
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border text-sm transition-all duration-300 ${className}`}
    >
      {icon}
    </a>
  );
}

export function JobDetailsPageContent({ jobId }: JobDetailsPageContentProps) {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useFlashMessage();
  const canLoadApplications = isAuthenticated && user?.productRole === ProductRoleEnum.CANDIDATE;

  const { applications, refetch } = useApplications({
    enabled: canLoadApplications,
  });

  const hasAlreadyApplied = applications.some((app) => app.jobId === jobId);
  const { job, isLoading, error } = useJob(jobId);
  const { companies, isLoading: isLoadingCompanies, error: companiesError } = usePublicCompanies();

  const company = job?.company
    ? {
        ...job.company,
        _id: job.company._id || job.company._id,
      }
    : (job && companies.find((item) => item._id === job.companyId)) || undefined;

  if (isLoading || isLoadingCompanies) {
    return (
      <section className={`${PAGE_STYLES.body} py-20`}>
        <div className={PAGE_STYLES.container}>
          <div className="space-y-6">
            <Skeleton className="h-8 w-52 rounded-xl bg-zinc-950/80" />
            <Skeleton className="h-20 rounded-2xl border border-zinc-800 bg-zinc-950/80" />
            <div className="grid gap-8 lg:grid-cols-3">
              <Skeleton className="h-[48rem] rounded-2xl border border-zinc-800 bg-zinc-950/80 lg:col-span-2" />
              <div className="space-y-6">
                <Skeleton className="h-56 rounded-2xl border border-zinc-800 bg-zinc-950/80" />
                <Skeleton className="h-56 rounded-2xl border border-zinc-800 bg-zinc-950/80" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (companiesError) {
    return <Alert type="error" message={companiesError} />;
  }

  if (!job) {
    return null;
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const location = [company?.contacts?.address?.city, company?.contacts?.address?.state]
    .filter(Boolean)
    .join(', ');

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(currentUrl);
      showSuccess('Link da vaga copiado para a área de transferência.');
    } catch {
      showError('Não foi possível copiar o link da vaga.');
    }
  }

  return (
    <section className={`${PAGE_STYLES.body} py-20`}>
      <div className={PAGE_STYLES.container}>
        <Breadcrumb
          items={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Vagas', href: ROUTES.JOBS },
            { label: job.title },
          ]}
        />

        {company?.tradeName && (
          <div className="mt-8 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400">
              <Building2 className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-[-0.04em] text-zinc-100">
                {company.tradeName}
              </h1>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-start gap-2 text-sm text-zinc-400">
          {job.createdAt && (
            <span className="rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 backdrop-blur">
              Publicado em{' '}
              {new Date(job.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
              })}
            </span>
          )}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <JobCard
              job={job}
              company={company}
              showRequirements
              hideDetailsButton
              customActions={
                <>
                  <Link href={ROUTES.JOBS}>
                    <Button
                      color="gray"
                      icon={<ArrowLeft className="h-4 w-4" />}
                      className="rounded-xl border-zinc-800 bg-black/40 text-zinc-200 hover:bg-white/[0.03]"
                    >
                      Vagas
                    </Button>
                  </Link>
                  <ApplyJobButton
                    jobId={job._id}
                    hasAlreadyApplied={hasAlreadyApplied}
                    refetch={refetch}
                  />
                </>
              }
            />
          </div>

          <aside className="space-y-6">
            {company && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur"
              >
                <div className="flex items-center gap-4">
                  {company.media?.logoUrl ? (
                    <Image
                      src={resolveFileUrl(company.media.logoUrl)}
                      alt={`Logo da empresa ${company.tradeName}`}
                      width={56}
                      height={56}
                      unoptimized
                      className="h-14 w-14 rounded-2xl border border-zinc-800 object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-black/40 text-sm font-semibold text-zinc-300">
                      {company.tradeName?.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-zinc-100">{company.tradeName}</p>
                    {location && (
                      <p className="mt-1 inline-flex items-center gap-2 text-sm text-zinc-500">
                        <MapPin className="h-4 w-4 text-lime-400" />
                        {location}
                      </p>
                    )}
                  </div>
                </div>

                {company.contacts?.website && (
                  <a
                    href={company.contacts.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center gap-2 rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 text-sm text-zinc-300 transition-all duration-300 hover:border-lime-500/20 hover:text-zinc-100"
                  >
                    <Globe className="h-4 w-4 text-lime-400" />
                    {company.contacts.website}
                  </a>
                )}
              </motion.div>
            )}

            {company && <JobLocationMapTest company={company} />}

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.04 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur"
            >
              <div className="mb-5 flex items-center gap-3 text-lg font-semibold text-zinc-100">
                <Share2 className="h-5 w-5 text-lime-400" />
                <span>Compartilhar</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void handleCopyLink()}
                  className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-zinc-800 bg-black/40 text-sm text-zinc-200 transition-all duration-300 hover:border-lime-500/20 hover:text-lime-300"
                  aria-label="Copiar link"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <ShareButton
                  href={`https://wa.me/?text=${encodeURIComponent(currentUrl)}`}
                  icon={<FaWhatsapp className="h-4 w-4" />}
                  className="border-zinc-800 bg-black/40 text-zinc-200 hover:border-[#25D366]/30 hover:text-[#25D366]"
                />
                <ShareButton
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`}
                  icon={<FaXTwitter className="h-4 w-4" />}
                  className="border-zinc-800 bg-black/40 text-zinc-200 hover:border-white/30 hover:text-white"
                />
                <ShareButton
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                  icon={<FaFacebookF className="h-4 w-4" />}
                  className="border-zinc-800 bg-black/40 text-zinc-200 hover:border-[#1877F2]/30 hover:text-[#1877F2]"
                />
                <ShareButton
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}`}
                  icon={<FaLinkedinIn className="h-4 w-4" />}
                  className="border-zinc-800 bg-black/40 text-zinc-200 hover:border-[#0A66C2]/30 hover:text-[#0A66C2]"
                />
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </section>
  );
}
