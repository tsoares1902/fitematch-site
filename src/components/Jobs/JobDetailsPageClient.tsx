"use client";

import Image from "next/image";
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

import { Job } from "@/interfaces/job.interface";

import JobApplicationFormModal from "./JobApplicationFormModal";

function getCompanyInitials(name?: string) {
  const normalizedName = name?.trim();

  if (!normalizedName) {
    return "EM";
  }

  const words = normalizedName.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function formatRole(role: string) {
  switch (role.toLowerCase()) {
    case "intern":
      return "Estágio";
    case "freelance":
      return "Frrelancer";
    case "contract":
      return "Contrato";
    default:
      return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }
}

function formatPublishDate(createdAt?: Date) {
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
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const coverImage =
    job.company.cover?.trim() || "/images/jobs/default_company_cover.png";
  const companyInitials = getCompanyInitials(job.company.name);
  const formattedRole = formatRole(job.role);
  const publishDate = formatPublishDate(job.createdAt);
  const locationLabel = [
    job.company.address?.city?.trim(),
    job.company.address?.state?.trim(),
  ]
    .filter(Boolean)
    .join(" - ");
  const neighborhood = job.company.address?.neighborhood?.trim();
  const addressLabel = [
    [job.company.address?.street?.trim(), job.company.address?.number?.trim()]
      .filter(Boolean)
      .join(", "),
    neighborhood,
  ]
    .filter(Boolean)
    .join(" - ");
  const slotsLabel = `${job.slots} ${job.slots === 1 ? "vaga" : "vagas"}`;
  const benefits = [
    job.benefits.salary ? `Salário: R$ ${job.benefits.salary}` : null,
    job.benefits.transportation ? "Vale Transporte" : null,
    job.benefits.alimentation ? "Vale Alimentação/Refeição" : null,
    job.benefits.health ? "Plano de Saúde" : null,
    job.benefits.parking ? "Vaga de Estacionamento" : null,
    job.benefits.bonus ? `Bônus: ${job.benefits.bonus}` : null,
  ].filter(Boolean);
  const socialLinks = [
    {
      key: "instagram",
      href: buildSocialLink(
        "https://www.instagram.com/",
        job.company.social?.instagram,
      ),
      icon: CiInstagram,
      className: "hover:text-purple-700",
    },
    {
      key: "facebook",
      href: buildSocialLink(
        "https://www.facebook.com/",
        job.company.social?.facebook,
      ),
      icon: CiFacebook,
      className: "hover:text-blue-700",
    },
    {
      key: "twitter",
      href: buildSocialLink("https://x.com/", job.company.social?.twitter),
      icon: FaXTwitter,
      className: "hover:text-black",
    },
    {
      key: "linkedin",
      href: buildSocialLink(
        "https://www.linkedin.com/in/",
        job.company.social?.linkedin,
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
              href="/jobs"
              className="mb-8 inline-flex items-center gap-2 rounded-md border border-blue-900 bg-gray-light px-4 py-2 text-sm font-semibold text-blue-900 transition-colors hover:border-blue-900 hover:bg-blue-900 hover:text-white"
            >
              <IoIosArrowDropleft className="text-lg" />
              Voltar para vagas
            </a>

            <div className="overflow-hidden rounded-xs border border-gray-200 bg-white shadow-one">
              <div className="relative aspect-16/7 w-full bg-gray-100">
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-primary rounded-full px-4 py-2 text-sm font-semibold text-white capitalize">
                    {formattedRole}
                  </span>
                </div>
                <Image
                  src={coverImage}
                  alt={job.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-8 md:p-10">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <span className="text-body-color text-sm">
                    Publicada em {publishDate}
                  </span>
                </div>

                <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
                  {job.company.name || "Empresa"} - {job.title}
                </h1>

                <div className="mb-8 space-y-2 text-base md:text-lg">
                  {hasApplied ? (
                    <p className="flex w-full items-center gap-2 rounded-sm border border-green-600 bg-green-900 px-4 py-3 text-base font-medium text-green-100">
                      <AiFillLike className="text-lg shrink-0" />
                      <span>Voce ja se aplicou a esta vaga.</span>
                    </p>
                  ) : (
                    <p className="text-body-color">
                      {slotsLabel} disponíveis para esta vaga.
                    </p>
                  )}
                  {benefits.length > 0 ? (
                    <div className="text-body-color">
                      <p className="mb-3 font-semibold text-black">Benefícios:</p>
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
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-lg font-bold uppercase text-white">
                        {companyInitials}
                      </div>
                      <div>
                        <p className="text-black text-base font-semibold">
                          {job.company.name || "Empresa"}
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
