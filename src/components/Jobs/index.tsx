import { listJobs } from "@/services/job/job.api";
import { getAllApplies } from "@/services/apply/apply.api";
import { getCurrentLocale } from "@/i18n/server";
import { localizePath } from "@/i18n/config";
import Link from "next/link";
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";

import JobsSearchForm from "./JobsSearchForm";

const Jobs = async ({
  currentPage = 1,
}: {
  currentPage?: number;
}) => {
  const locale = await getCurrentLocale();
  const jobs = await listJobs();
  const applies = await getAllApplies();
  const appliedJobIds = Array.from(new Set(
    applies
      .map((apply) => apply.jobId)
      .filter((jobId): jobId is string => Boolean(jobId)),
  ));
  const activeJobs = jobs.filter((job) => job.status === "active");
  const jobsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(activeJobs.length / jobsPerPage));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedJobs = activeJobs.slice(
    (safeCurrentPage - 1) * jobsPerPage,
    safeCurrentPage * jobsPerPage,
  );
  const previousPage = safeCurrentPage > 1 ? safeCurrentPage - 1 : null;
  const nextPage = safeCurrentPage < totalPages ? safeCurrentPage + 1 : null;
  const jobsPath = localizePath("/jobs", locale);

  return (
    <section
      id="jobs"
      className="bg-gray-light py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        {activeJobs.length > 0 ? (
          <>
            <JobsSearchForm jobs={paginatedJobs} appliedJobIds={appliedJobIds} />
            {totalPages > 1 ? (
              <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-xs border border-gray-200 bg-white px-6 py-4 text-sm text-body-color shadow-one md:flex-row">
                <p>
                  Página {safeCurrentPage} de {totalPages}
                </p>
                <div className="flex items-center gap-3">
                  {previousPage ? (
                    <Link
                      href={`${jobsPath}?page=${previousPage}`}
                      className="inline-flex items-center gap-2 rounded-xs border border-gray-800 px-4 py-2 font-medium uppercase text-gray-800 transition-colors hover:border-gray-300 hover:text-gray-300"
                    >
                      <FaRegArrowAltCircleLeft className="text-base" />
                      Anterior
                    </Link>
                  ) : null}
                  {nextPage ? (
                    <Link
                      href={`${jobsPath}?page=${nextPage}`}
                      className="inline-flex items-center gap-2 rounded-xs border border-gray-800 px-4 py-2 font-medium uppercase text-gray-800 transition-colors hover:border-gray-300 hover:text-gray-300"
                    >
                      <FaRegArrowAltCircleRight className="text-base" />
                      Próxima
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
};

export default Jobs;
