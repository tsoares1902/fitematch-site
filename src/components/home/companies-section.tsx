'use client';

import Image from 'next/image';
import { FaBuilding } from 'react-icons/fa';
import { usePublicCompanies } from '@/hooks/use-public-companies';
import { SectionTitle } from '@/components/ui/section-title';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { getCompanyLogoTheme } from '@/utils/company-logo-theme';
import { resolveFileUrl } from '@/utils/file-url';

export function CompaniesSection() {
  const { companies, isLoading, error } = usePublicCompanies();

  if (!isLoading && !error && companies.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#1a232c] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="EMPRESAS QUE USAM A PLATAFORMA"
          icon={<FaBuilding className="h-6 w-6" />}
        />

        <div className="mt-10">
          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-24" />
              ))}
            </div>
          )}

          {error && <Alert type="error" message={error} />}

          {!isLoading && !error && companies.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {companies.map((company, index) => {
                const theme = getCompanyLogoTheme(company);

                return (
                  <div
                    key={company._id || company.slug || `${company.tradeName}-${index}`}
                    className="flex h-24 items-center justify-center rounded-[1.25rem] border px-4 text-center shadow-[0_16px_35px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-1"
                    style={{
                      background: theme.background,
                      borderColor: theme.borderColor,
                      boxShadow: theme.boxShadow,
                      color: theme.textColor,
                    }}
                  >
                    {company.media?.logoUrl ? (
                      <Image
                        src={resolveFileUrl(company.media.logoUrl)}
                        alt={company.tradeName}
                        width={160}
                        height={48}
                        unoptimized
                        className="max-h-12 max-w-full object-contain drop-shadow-[0_0_18px_rgba(0,0,0,0.22)]"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-white">{company.tradeName}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
