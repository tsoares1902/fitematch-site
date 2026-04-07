import { getAllJobs } from "@/api/job.api";
import { getAllApplies } from "@/api/apply.api";

import FeaturedJobsMarquee from "./FeaturedJobsMarquee";
import JobCardDetails from "./JobCardDetails";
import JobsSearchPanel from "./JobsSearchPanel";

const Jobs = async ({
  showRegularJobs = true,
}: {
  showRegularJobs?: boolean;
}) => {
  const jobs = await getAllJobs();
  const applies = await getAllApplies();
  const appliedJobIds = Array.from(new Set(
    applies
      .map((apply) => apply.jobId)
      .filter((jobId): jobId is string => Boolean(jobId)),
  ));
  const activeJobs = jobs.filter((job) => job.status === "active");
  const isFeaturedJob = (value: boolean | undefined) => value === true;
  const featuredJobs = activeJobs.filter((job) =>
    isFeaturedJob(job.isPaidAdvertising),
  );
  const regularJobs = activeJobs.filter((job) =>
    !isFeaturedJob(job.isPaidAdvertising),
  );

  return (
    <section
      id="jobs"
      className="bg-gray-light py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <FeaturedJobsMarquee jobs={featuredJobs} appliedJobIds={appliedJobIds} />

        {showRegularJobs && regularJobs.length > 0 ? (
          <>
            <div className="border-body-color/15 my-10 border-t" />
            <JobsSearchPanel />
            <div className="border-body-color/15 my-10 border-t" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {regularJobs.map((job) => (
                <div key={job.id ?? job.slug} className="min-w-0">
                  <JobCardDetails
                    job={job}
                    hasApplied={job.id ? appliedJobIds.includes(job.id) : false}
                  />
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
