import SectionTitle from "../Common/SectionTitle";
import JobCardDetails from "./JobCardDetails";
import jobData from "./jobData";

const Jobs = () => {
  return (
    <section
      id="jobs"
      className="bg-gray-light py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="Vagas em destaque"
          paragraph="Confirma algumas das vagas em destaque e se cadastre"
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {jobData.map((job) => (
            <div key={job.id} className="w-full">
              <JobCardDetails job={job} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
