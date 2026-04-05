import { Job } from "@/interfaces/job.interface";
import Image from "next/image";
import Link from "next/link";

const JobCardDetails = ({ job }: { job: Job }) => {
  const {
    id,
    title,
    logo,
    logoAlt,
    role,
    slots,
    slug,
    createdAt,
    company,
  } = job;

  const publishDate = new Date(createdAt).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const slotsLabel = `${slots} ${slots === 1 ? "vaga" : "vagas"}`;
  const coverImage =
    company?.cover?.trim() || "/images/jobs/default_company_cover.png";
  const companyLogo =
    company?.logo?.trim() || "/images/jobs/default_company_logo.png";
  const companyName = company?.name?.trim() || "";
  const companySlug = company?.role?.trim() || slug;

  return (
    <div className="group shadow-one hover:shadow-two relative overflow-hidden rounded-xs bg-white duration-300">
        <Link
          href={`/job/${id}/details`}
          className="relative block aspect-37/22 w-full"
        >
          <span className="bg-primary absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white capitalize">
            {role}
          </span>
          <Image src={coverImage} alt={logoAlt || title} fill className="object-cover" />
        </Link>
        <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
          <h3>
            <Link
              href={`/job/${id}/details`}
              className="hover:text-primary mb-4 block text-xl font-bold text-black sm:text-2xl"
            >
              {title}
            </Link>
          </h3>
          <p className="border-body-color/10 text-body-color mb-6 border-b pb-6 text-base font-medium">
            {slotsLabel} disponiveis para esta vaga.
          </p>
          <div className="flex items-center">
            <div className="border-body-color/10 mr-5 flex items-center border-r pr-5 xl:mr-3 xl:pr-3 2xl:mr-5 2xl:pr-5">
              <div className="mr-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={companyLogo}
                    alt={logoAlt || title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="w-full">
                <h4 className="text-dark mb-1 text-sm font-medium">
                  {companyName}
                </h4>
                <p className="text-body-color text-xs">{companySlug}</p>
              </div>
            </div>
            <div className="inline-block">
              <h4 className="text-dark mb-1 text-sm font-medium">
                Publicado
              </h4>
              <p className="text-body-color text-xs">{publishDate}</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default JobCardDetails;
