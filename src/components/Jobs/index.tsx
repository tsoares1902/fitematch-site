import { getAllJobs } from "@/api/job";

import SectionTitle from "../Common/SectionTitle";
import JobCardDetails from "./JobCardDetails";

const Jobs = async () => {
  const jobs = await getAllJobs();
  const isFeaturedJob = (value: boolean | string | number | undefined) =>
    value === true || value === "true" || value === 1 || value === "1";
  const featuredJobs = jobs.filter((job) => isFeaturedJob(job.isPaidAdvertising));
  const regularJobs = jobs.filter((job) => !isFeaturedJob(job.isPaidAdvertising));

  return (
    <section
      id="jobs"
      className="bg-gray-light py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="Vagas em destaque"
          paragraph="Confira algumas das vagas em destaque e cadastre-se"
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {featuredJobs.map((job) => (
            <div key={job.id} className="w-full">
              <JobCardDetails job={job} />
            </div>
          ))}
        </div>

        {regularJobs.length > 0 ? (
          <>
            <div className="border-body-color/15 my-10 border-t" />
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
              {regularJobs.map((job) => (
                <div key={job.id} className="w-full">
                  <JobCardDetails job={job} />
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default Jobs;
