import type { Metadata } from "next";
import { getAllApplies } from "@/services/apply/apply.api";
import { getJob } from "@/services/job/job.api";
import { getJobMongoId } from "@/services/job/job.helpers";
import { ApplyStatus } from "@/services/apply/apply.types";
import Link from "next/link";
import { MdEditNote } from "react-icons/md";

export const metadata: Metadata = {
  title: "fitematch | Minhas Candidaturas",
  description: "Acompanhe o andamento das suas candidaturas e processos seletivos na fitematch.",
};

function formatDate(date?: Date | string) {
  if (!date) {
    return "Nao informado";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Nao informado";
  }

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

  return `${formattedDate} as ${formattedTime}.`;
}

function getStatusPresentation(status: ApplyStatus) {
  switch (status) {
    case "active":
      return {
        label: "Ativo",
        className: "text-green-900",
      };
    case "freeze":
      return {
        label: "Congelada",
        className: "text-red-900",
      };
    case "canceled":
      return {
        label: "Cancelada",
        className: "text-red-900",
      };
    case "inactive":
    default:
      return {
        label: "Inativa",
        className: "text-red-900",
      };
  }
}

export default async function JobApplicationsPage() {
  const applies = await getAllApplies();
  const applications = await Promise.all(
    applies.map(async (apply) => {
      try {
        const job = await getJob(apply.jobId);

        return {
          apply,
          job,
        };
      } catch {
        return null;
      }
    }),
  );

  const validApplications = applications.filter((item) => item !== null);

  return (
    <main className="bg-gray-light py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
              Processos Seletivos
            </h1>
            <p className="text-body-color text-base md:text-lg">
              Acompanhe seus processos seletivos e visualize o andamento das suas candidaturas.
            </p>
          </div>

          <div className="space-y-6">
            {validApplications.length > 0 ? (
              validApplications.map(({ apply, job }) => {
                const jobMongoId = getJobMongoId(job);
                const locationLabel = [
                  job.company?.address?.city?.trim(),
                  job.company?.address?.state?.trim(),
                ]
                  .filter(Boolean)
                  .join(" - ");
                const status = getStatusPresentation(apply.status);

                return (
                    <article
                      key={apply.id ?? `${apply.userId}-${apply.jobId}`}
                      className="rounded-xs border border-gray-200 bg-white p-6 shadow-one"
                    >
                      <p className={`mb-3 text-sm font-bold uppercase ${status.className}`}>
                        {status.label}
                      </p>
                      <h3 className="mb-2 text-2xl font-bold text-black">
                        {job.company?.name || "Empresa"} - {job.title}
                      </h3>
                      <p className="text-body-color mb-3 text-base">
                        {locationLabel || "Localizacao nao informada"}
                      </p>
                      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <p className="text-body-color text-base">
                          Candidatura enviada em: {formatDate(apply.createdAt)}
                        </p>
                        <Link
                          href={`/job/${jobMongoId}/details`}
                          className="inline-flex items-center gap-2 rounded-md bg-green-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                        >
                          <MdEditNote className="text-lg" />
                          Visualizar Vaga
                        </Link>
                      </div>
                    </article>
                );
              })
            ) : (
              <div className="rounded-xs border border-gray-200 bg-white p-8 text-center shadow-one">
                <p className="text-body-color text-base">
                  Nenhuma candidatura encontrada.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
