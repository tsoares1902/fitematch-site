"use client";

import { useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";

import { Job } from "@/interfaces/job.interface";

import JobCardDetails from "./JobCardDetails";

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

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

function matchesJob(job: Job, query: string) {
  if (!query.length) {
    return true;
  }

  const fields = [
    job.company.name,
    job.title,
    job.company.address?.city,
    job.company.address?.state,
    job.role,
    formatRole(job.role),
  ];

  return fields.some((field) => normalizeSearchValue(field ?? "").includes(query));
}

export default function JobsSearchForm({
  appliedJobIds,
  jobs,
}: Readonly<{
  appliedJobIds: string[];
  jobs: Job[];
}>) {
  const [query, setQuery] = useState("");

  const filteredJobs = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(query);

    return jobs.filter((job) => matchesJob(job, normalizedQuery));
  }, [jobs, query]);

  return (
    <>
      <div className="mb-12 w-full rounded-xs border border-gray-200 bg-white p-6 shadow-one md:p-8">
        <form className="space-y-6">
          <div className="flex overflow-hidden rounded-xs border border-gray-200 bg-white focus-within:border-blue-900">
            <span className="flex items-center border-r border-gray-200 bg-gray-50 px-4 py-3 text-body-color">
              <CiSearch className="text-xl" />
            </span>
            <input
              id="jobs-search-title"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-gray-400 placeholder:uppercase"
              placeholder="Busque sua vaga"
            />
          </div>

          <div className="border-body-color/15 border-t" />
        </form>
      </div>

      <div className="border-body-color/15 my-10 border-t" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredJobs.map((job) => (
          <div key={job.id ?? job.slug} className="min-w-0">
            <JobCardDetails
              job={job}
              hasApplied={job.id ? appliedJobIds.includes(job.id) : false}
            />
          </div>
        ))}
      </div>
    </>
  );
}
