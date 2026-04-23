import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listApplies } from "@/services/apply/apply.api";
import { Apply } from "@/services/apply";
import { readCompany } from "@/services/company/company.api";
import { Company } from "@/services/company/company.types";
import { readJob } from "@/services/job/job.api";
import { getJobMongoId } from "@/services/job/job.helpers";
import { Job } from "@/services/job/job.types";
import Breadcrumb from "@/components/Common/Breadcrumb";
import JobDetailsPageClient from "@/components/Jobs/JobDetailsPageClient";

type JobDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function readJobOrNull(jobId: string): Promise<Job | null> {
  try {
    return await readJob(jobId);
  } catch {
    return null;
  }
}

async function readCompanyOrNull(companyId: string): Promise<Company | null> {
  try {
    return await readCompany(companyId);
  } catch {
    return null;
  }
}

async function readAppliesOrNull(): Promise<Apply[]> {
  try {
    return await listApplies();
  } catch {
    return [];
  }
}

function getCompanyLocationLabel(company: Company | null) {
  return [
    company?.contacts?.address?.city?.trim(),
    company?.contacts?.address?.state?.trim(),
  ]
    .filter(Boolean)
    .join(" - ");
}

function withCompany(job: Job, company: Company | null): Job {
  if (!company) {
    return job;
  }

  return {
    ...job,
    company: {
      ...company,
      id: company.id,
      slug: company.slug,
      name: company.name ?? company.tradeName,
      address: company.address ?? company.contacts.address,
      social: company.social,
      logo: company.logo,
      cover: company.cover,
      status: company.status,
    },
  };
}

export async function generateMetadata({
  params,
}: JobDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await readJobOrNull(id);
  const company = job?.companyId ? await readCompanyOrNull(job.companyId) : null;

  if (!job) {
    return {
      title: "fitematch | Vaga não encontrada",
    };
  }

  const locationLabel = getCompanyLocationLabel(company);

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

  const [company, applies] = await Promise.all([
    job.companyId ? readCompanyOrNull(job.companyId) : Promise.resolve(null),
    readAppliesOrNull(),
  ]);

  const jobMongoId = getJobMongoId(job);
  const hasApplied = applies.some((apply) => apply.jobId === jobMongoId);
  const locationLabel = getCompanyLocationLabel(company);
  const jobWithCompany = withCompany(job, company);

  return (
    <>
      <Breadcrumb
        pageName={job.title}
        description={locationLabel || "Localização não informada"}
      />
      <JobDetailsPageClient job={jobWithCompany} hasApplied={hasApplied} />
    </>
  );
}
