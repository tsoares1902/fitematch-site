"use client";

import Link from "next/link";
import { useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import {
  CiCircleCheck,
  CiFacebook,
  CiInstagram,
  CiLinkedin,
} from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { IoIosArrowDropleft } from "react-icons/io";

import { useDictionary, useLocale } from "@/contexts/locale-context";
import { localizePath } from "@/i18n/config";
import { Job } from "@/services/job/job.types";

import JobApplicationFormModal from "./JobApplicationFormModal";
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

function formatPublishDate(createdAt?: Date | string) {
  if (!createdAt) {
    return "";
  }

  const parsedDate = new Date(createdAt);
  const formattedDate = parsedDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = parsedDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${formattedDate} as ${formattedTime}`;
}

function buildSocialLink(baseUrl: string, value?: string) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  return `${baseUrl}${trimmedValue}`;
}

export default function JobDetailsPageClient({
  job,
  hasApplied = false,
}: Readonly<{
  job: Job;
  hasApplied?: boolean;
}>) {
  const dictionary = useDictionary();
  const locale = useLocale();
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const coverImage =
    resolveCompanyAssetUrl(job.media?.coverUrl ?? job.cover) ||
    "/images/jobs/default_company_cover.png";
  const formattedRole =
    job.role
      ? dictionary.jobs.roleLabels[
          job.role as keyof typeof dictionary.jobs.roleLabels
        ] ?? formatRole(job.role)
      : dictionary.jobs.notInformed;
  const publishDate = formatPublishDate(job.createdAt);
  const locationLabel = [
    job.company?.address?.city?.trim(),
    job.company?.address?.state?.trim(),
  ]
    .filter(Boolean)
    .join(" - ");
  const neighborhood = job.company?.address?.neighborhood?.trim();
  const addressLabel = [
    [
      job.company?.address?.street?.trim(),
      job.company?.address?.number
        ? String(job.company.address.number).trim()
        : undefined,
    ]
      .filter(Boolean)
      .join(", "),
    neighborhood,
  ]
    .filter(Boolean)
    .join(" - ");
  const slotsLabel = `${job.slots} ${
    job.slots === 1 ? dictionary.jobs.slotsAvailable : dictionary.jobs.slotsAvailablePlural
  }`;
  const benefitsData = job.benefits;
  const benefits = [
    benefitsData?.salary
      ? `${locale === "en" ? "Salary" : locale === "es" ? "Salario" : "Salário"}: R$ ${benefitsData.salary}`
      : null,
    benefitsData?.transportationVoucher ? "Vale Transporte" : null,
    benefitsData?.alimentationVoucher ? "Vale Alimentação/Refeição" : null,
    benefitsData?.healthInsurance ? "Plano de Saúde" : null,
    benefitsData?.dentalInsurance ? "Plano Odontológico" : null,
  ].filter(Boolean);
  const socialLinks = [
    {
      key: "instagram",
      href: buildSocialLink(
        "https://www.instagram.com/",
        job.company?.social?.instagram,
      ),
      icon: CiInstagram,
      className: "hover:text-purple-700",
    },
    {
      key: "facebook",
      href: buildSocialLink(
        "https://www.facebook.com/",
        job.company?.social?.facebook,
      ),
      icon: CiFacebook,
      className: "hover:text-blue-700",
    },
    {
      key: "twitter",
      href: buildSocialLink("https://x.com/", job.company?.social?.twitter),
      icon: FaXTwitter,
      className: "hover:text-black",
    },
    {
      key: "linkedin",
      href: buildSocialLink(
        "https://www.linkedin.com/in/",
        job.company?.social?.linkedin,
      ),
      icon: CiLinkedin,
      className: "hover:text-blue-700",
    },
  ].filter((item) => item.href);

  return (
    <>
      <main className="bg-gray-light py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <a
              href={localizePath("/jobs", locale)}
              className="mb-8 inline-flex items-center gap-2 rounded-md border border-blue-900 bg-gray-light px-4 py-2 text-sm font-semibold text-blue-900 transition-colors hover:border-blue-900 hover:bg-blue-900 hover:text-white"
            >
              <IoIosArrowDropleft className="text-lg" />
              {dictionary.jobs.backToJobs}
            </a>

            <div className="overflow-hidden rounded-xs border border-gray-200 bg-white shadow-one">
              <div className="relative aspect-16/7 w-full bg-gray-100">
                <div className="absolute top-6 right-6 z-10">
                  <span className="rounded-full bg-blue-800 px-4 py-2 text-xs font-semibold uppercase text-blue-100">
                    {formattedRole}
                  </span>
                </div>
                <img
                  src={coverImage}
                  alt={job.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-8 md:p-10">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <span className="text-body-color text-sm">
                    {dictionary.jobs.publishedOn} {publishDate}
                  </span>
                </div>

                <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
                  {job.company?.name || "Empresa"} - {job.title}
                </h1>

                <div className="mb-8 space-y-2 text-base md:text-lg">
                  {hasApplied ? (
                    <p className="flex w-full items-center gap-2 rounded-sm border border-green-600 bg-green-900 px-4 py-3 text-base font-medium text-green-100">
                      <AiFillLike className="text-lg shrink-0" />
                      <span>{dictionary.jobs.appliedMessage}</span>
                    </p>
                  ) : (
                    <p className="text-body-color">
                      {slotsLabel} {dictionary.jobs.availableForJob}
                    </p>
                  )}
                  {benefits.length > 0 ? (
                    <div className="text-body-color">
                      <p className="mb-3 font-semibold text-black">{dictionary.jobs.benefits}</p>
                      <ol className="space-y-2">
                        {benefits.map((benefit) => (
                          <li
                            key={benefit}
                            className="flex items-center gap-2"
                          >
                            <CiCircleCheck className="text-lg shrink-0 text-green-900" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col gap-6 rounded-xs bg-gray-100 p-6 md:flex-row md:items-end md:justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <CompanyAvatar
                        logo={job.company?.logo}
                        name={job.company?.name}
                        sizeClassName="h-14 w-14"
                        textClassName="text-lg"
                      />
                      <div>
                        <p className="text-black text-base font-semibold">
                          {job.company?.name || "Empresa"}
                        </p>
                        {locationLabel ? (
                          <p className="text-body-color text-sm">
                            {locationLabel}
                          </p>
                        ) : null}
                        {addressLabel ? (
                          <p className="text-body-color text-sm">
                            {addressLabel}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {socialLinks.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {socialLinks.map((socialLink) => {
                          const Icon = socialLink.icon;

                          return (
                            <a
                              key={socialLink.key}
                              href={socialLink.href!}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${socialLink.key}-link`}
                              className={`text-body-color inline-flex items-center justify-center rounded-xs border border-gray-200 bg-white p-2 transition-colors ${socialLink.className}`}
                            >
                              <Icon className="text-[28px]" />
                            </a>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>

                  {hasApplied ? (
                    <Link
                      href="/jobs/applications"
                      className="inline-flex items-center justify-center gap-2 rounded-xs border border-green-900 bg-transparent px-6 py-3 text-sm font-semibold text-green-900 transition-colors hover:border-green-700 hover:bg-green-700 hover:text-white"
                    >
                      <AiOutlineLike className="text-lg" />
                      Ver Aplicações
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsApplicationModalOpen(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-xs border border-green-900 bg-transparent px-6 py-3 text-sm font-semibold text-green-900 transition-colors hover:border-green-700 hover:bg-green-700 hover:text-white"
                    >
                      <AiOutlineLike className="text-lg" />
                      Candidatar-se
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isApplicationModalOpen ? (
        <JobApplicationFormModal
          job={job}
          onClose={() => setIsApplicationModalOpen(false)}
        />
      ) : null}
    </>
  );
}
