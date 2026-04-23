"use client";

import { useDictionary, useLocale } from "@/contexts/locale-context";
import { localizePath } from "@/i18n/config";
import { getJobMongoId } from "@/services/job/job.helpers";
import { Job } from "@/services/job/job.types";
import { CiCirclePlus } from "react-icons/ci";
import Link from "next/link";
import CompanyAvatar, { resolveCompanyAssetUrl } from "./CompanyAvatar";

function formatRole(role: string) {
  switch (role.toLowerCase()) {
    case "intern":
      return "Estágio";
    case "freelance":
      return "Autônomo";
    case "contract_person":
      return "CLT";
    case "contract_company":
      return "PJ";
    default:
      return role;
  }
}

const JobCardDetails = ({
  job,
  hasApplied = false,
}: {
  job: Job;
  hasApplied?: boolean;
}) => {
  const dictionary = useDictionary();
  const locale = useLocale();
  const {
    title,
    role,
    slots,
    createdAt,
    company,
  } = job;
  const jobMongoId = getJobMongoId(job) ?? "";

  const publishDate = createdAt
    ? new Date(createdAt).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    : dictionary.jobs.notInformed;
  const slotsLabel = `${slots} ${
    slots === 1 ? dictionary.jobs.slotsAvailable : dictionary.jobs.slotsAvailablePlural
  }`;
  const coverImage =
    resolveCompanyAssetUrl(job.media?.coverUrl ?? job.cover) ||
    "/images/jobs/default_company_cover.png";
  const detailsHref = hasApplied
    ? localizePath("/jobs/applications", locale)
    : localizePath(`/job/${jobMongoId}/details`, locale);
  const jobDetailsHref = localizePath(`/job/${jobMongoId}/details`, locale);
  const locationCity = company?.address?.city?.trim();
  const locationState = company?.address?.state?.trim();
  const locationLabel = [locationCity, locationState].filter(Boolean).join(" - ");
  const localizedRole =
    role
      ? dictionary.jobs.roleLabels[role as keyof typeof dictionary.jobs.roleLabels] ??
        formatRole(role)
      : dictionary.jobs.notInformed;
  const roleLabel = localizedRole.toUpperCase();

  return (
    <div className="group shadow-one hover:shadow-two relative overflow-hidden rounded-xs bg-white duration-300">
        <Link
          href={detailsHref}
          className="relative block aspect-37/22 w-full"
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-6 right-6 z-20">
            <span className="inline-flex items-center justify-center rounded-full bg-blue-800 px-4 py-2 text-xs font-semibold uppercase text-blue-100">
              {roleLabel}
            </span>
          </div>
          <div className="absolute right-6 bottom-6 left-6 z-20">
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              {title}
            </h3>
            {locationLabel ? (
              <p className="mt-2 text-sm font-medium text-white/90 sm:text-base">
                {locationLabel}
              </p>
            ) : null}
          </div>
          <img src={coverImage} alt={title} className="h-full w-full object-cover" />
        </Link>
        <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
          <div className="border-body-color/10 mb-6 border-b pb-6">
            {hasApplied ? (
              <p className="text-base font-bold uppercase text-gray-500">
                {dictionary.common.appliedToJob}
              </p>
            ) : (
              <p className="text-base font-bold uppercase text-gray-500">
                {slotsLabel}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="border-body-color/10 flex flex-1 items-center border-r pr-5">
              <div className="mr-4">
                <CompanyAvatar
                  logo={company?.logo}
                  name={company?.name}
                  sizeClassName="h-10 w-10"
                  textClassName="text-sm"
                />
              </div>
              <div className="w-full">
                <h4 className="text-dark mb-1 text-sm font-medium">
                  {company?.name || "Empresa"}
                </h4>
                <p className="text-body-color text-xs">
                  {dictionary.common.published}: {publishDate}
                </p>
              </div>
            </div>
            <Link
              href={jobDetailsHref}
              className="inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-green-100 transition-colors hover:bg-green-900"
            >
              <CiCirclePlus className="text-lg" />
              {dictionary.common.details}
            </Link>
          </div>
        </div>
      </div>
  );
};

export default JobCardDetails;
