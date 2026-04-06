import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CiFacebook,
  CiInstagram,
  CiLinkedin,
  CiTwitter,
} from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { IoIosArrowDropleft } from "react-icons/io";

import { getJob } from "@/api/job.api";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Job } from "@/interfaces/job.interface";

type JobDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function readJobOrNull(jobId: string): Promise<Job | null> {
  try {
    return await getJob(jobId);
  } catch {
    return null;
  }
}

function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

function formatPublishDate(createdAt: Date) {
  return new Date(createdAt).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildSocialLink(baseUrl: string, value?: string) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  return `${baseUrl}${trimmedValue}`;
}

export async function generateMetadata({
  params,
}: JobDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await readJobOrNull(id);

  if (!job) {
    return {
      title: "fitematch | Vaga não encontrada",
    };
  }

  const locationLabel = [
    job.company.address?.city?.trim(),
    job.company.address?.state?.trim(),
  ]
    .filter(Boolean)
    .join(" - ");

  return {
    title: `fitematch | ${job.title}`,
    description:
      locationLabel ||
      "Confira os detalhes da vaga e avance para a candidatura.",
  };
}

export default async function JobDetailsPage({
  params,
}: Readonly<JobDetailsPageProps>) {
  const { id } = await params;
  const job = await readJobOrNull(id);

  if (!job) {
    notFound();
  }

  const coverImage =
    job.company.cover?.trim() || "/images/jobs/default_company_cover.png";
  const companyLogo =
    job.company.logo?.trim() || "/images/jobs/default_company_logo.png";
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
      label: "Instagram",
      href: buildSocialLink(
        "https://www.instagram.com/",
        job.company.social?.instagram,
      ),
      icon: CiInstagram,
    },
    {
      key: "facebook",
      label: "Facebook",
      href: buildSocialLink(
        "https://www.facebook.com/",
        job.company.social?.facebook,
      ),
      icon: CiFacebook,
    },
    {
      key: "twitter",
      label: "Twitter",
      href: buildSocialLink("https://x.com/", job.company.social?.twitter),
      icon: CiTwitter,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: buildSocialLink(
        "https://www.linkedin.com/in/",
        job.company.social?.linkedin,
      ),
      icon: CiLinkedin,
    },
  ].filter((item) => item.href);

  return (
    <>
      <Breadcrumb
        pageName={job.title}
        description={locationLabel || "Localização não informada"}
      />
      <main className="bg-gray-light py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/jobs"
            className="mb-8 inline-flex items-center gap-2 rounded-md border border-blue-900 bg-gray-light px-4 py-2 text-sm font-semibold text-blue-900 transition-colors hover:border-blue-900 hover:bg-blue-900 hover:text-white"
          >
            <IoIosArrowDropleft className="text-lg" />
            Voltar para vagas
          </Link>

          <div className="overflow-hidden rounded-xs border border-gray-200 bg-white shadow-one">
            <div className="relative aspect-16/7 w-full bg-gray-100">
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
                <span className="bg-primary rounded-full px-4 py-2 text-sm font-semibold text-white capitalize">
                  {formattedRole}
                </span>
                <span className="text-body-color text-sm">
                  Publicada em {publishDate}
                </span>
              </div>

              <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
                {job.title}
              </h1>

              <div className="mb-8 space-y-2 text-base md:text-lg">
                <p className="text-body-color">
                  {slotsLabel} disponíveis para esta vaga.
                </p>
                {benefits.length > 0 ? (
                  <div className="text-body-color">
                    <p>Benefícios:</p>
                    <p>{benefits.join(", ")}</p>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-6 rounded-xs bg-gray-50 p-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full bg-white">
                      <Image
                        src={companyLogo}
                        alt={job.title}
                        fill
                        className="object-cover"
                      />
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
                            className="inline-flex items-center gap-2 rounded-xs border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:border-blue-900 hover:text-blue-900"
                          >
                            <Icon className="text-lg" />
                            {socialLink.label}
                          </a>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                <Link
                  href="/account/candidate"
                  className="inline-flex items-center justify-center gap-2 rounded-xs border border-green-900 bg-transparent px-6 py-3 text-sm font-semibold text-green-900 transition-colors hover:border-green-700 hover:bg-green-700 hover:text-white"
                >
                  <FaCheck />
                  Candidatar-se
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
    </>
  );
}
