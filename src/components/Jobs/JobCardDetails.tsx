import { Job } from "@/interfaces/job.interface";
import { CiCirclePlus } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";

const JobCardDetails = ({ job }: { job: Job }) => {
  const {
    id,
    title,
    role,
    slots,
    createdAt,
    isPaidAdvertising,
    company,
  } = job;

  const publishDate = new Date(createdAt).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const slotsLabel = `${slots} ${slots === 1 ? "vaga" : "vagas"}`;
  const coverImage =
    company.cover?.trim() || "/images/jobs/default_company_cover.png";
  const companyLogo =
    company.logo?.trim() || "/images/jobs/default_company_logo.png";
  const detailsHref = `/job/${id || ""}/details`;
  const formattedRole =
    role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  const locationCity = company.address?.city?.trim();
  const locationState = company.address?.state?.trim();
  const locationLabel = [locationCity, locationState].filter(Boolean).join(" - ");
  const showFeaturedBadge = isPaidAdvertising === true;

  return (
    <div className="group shadow-one hover:shadow-two relative overflow-hidden rounded-xs bg-white duration-300">
        <Link
          href={detailsHref}
          className="relative block aspect-37/22 w-full"
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-6 right-6 z-20 flex flex-wrap justify-end gap-2">
            {showFeaturedBadge ? (
              <span className="bg-orange-900 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white">
                Destaque
              </span>
            ) : null}
            <span className="bg-primary inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white">
              {formattedRole}
            </span>
          </div>
          <div className="absolute right-6 bottom-6 left-6 z-20">
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              {title}
            </h3>
            {locationLabel ? (
              <p className="mt-2 text-sm font-medium text-white/90 sm:text-base">
                {locationLabel}
              </p>
            ) : null}
          </div>
          <Image src={coverImage} alt={title} fill className="object-cover" />
        </Link>
        <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
          <p className="border-body-color/10 text-body-color mb-6 border-b pb-6 text-base font-medium">
            {slotsLabel} disponiveis para esta vaga.
          </p>
          <div className="flex items-center justify-between gap-4">
            <div className="border-body-color/10 flex flex-1 items-center border-r pr-5">
              <div className="mr-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={companyLogo}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="w-full">
                <h4 className="text-dark mb-1 text-sm font-medium">
                  {company.name || "Empresa"}
                </h4>
                <p className="text-body-color text-xs">Publicado: {publishDate}</p>
              </div>
            </div>
            <Link
              href={detailsHref}
              className="inline-flex items-center gap-2 rounded-md bg-green-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              <CiCirclePlus className="text-lg" />
              Detalhes
            </Link>
          </div>
        </div>
      </div>
  );
};

export default JobCardDetails;
