import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getJob } from "@/services/job/job.api";
import { getCurrentLocale } from "@/i18n/server";
import { localizePath } from "@/i18n/config";

type JobApplyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function readJobTitle(jobId: string) {
  try {
    const job = await getJob(jobId);
    return job.title;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: JobApplyPageProps): Promise<Metadata> {
  const { id } = await params;
  const jobTitle = await readJobTitle(id);

  if (!jobTitle) {
    return {
      title: "fitematch | Candidatura",
      description: "Inicie o cadastro para se candidatar a uma vaga.",
    };
  }

  return {
    title: `fitematch | Candidatar-se para ${jobTitle}`,
    description: `Inicie o cadastro para se candidatar à vaga ${jobTitle}.`,
  };
}

export default async function JobApplyPage({
  params,
}: Readonly<JobApplyPageProps>) {
  const locale = await getCurrentLocale();
  const { id } = await params;
  const jobTitle = await readJobTitle(id);

  if (!jobTitle) {
    notFound();
  }

  return (
    <main className="bg-white pt-8 pb-20">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-xs border border-gray-200 bg-gray-50 p-8 md:p-12">
          <span className="text-primary mb-4 inline-block text-sm font-semibold uppercase tracking-[0.24em]">
            Vaga
          </span>
          <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
            Candidatar-se para {jobTitle}
          </h1>
          <p className="text-body-color mb-8 text-base leading-relaxed md:text-lg">
            Inicie seu cadastro para criar perfil, acompanhar candidaturas e
            concluir sua inscrição nesta vaga.
          </p>
          <Link
            href={localizePath("/account/candidate/register", locale)}
            className="shadow-submit bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-xs px-8 py-4 text-base font-medium text-white duration-300"
          >
            Continuar cadastro
          </Link>
        </div>
      </div>
    </main>
  );
}
