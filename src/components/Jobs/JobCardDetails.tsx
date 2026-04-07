import { Job } from "@/interfaces/job.interface";
import { CiCirclePlus } from "react-icons/ci";
import { FaMedal } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

function getCompanyInitials(name?: string) {
  const normalizedName = name?.trim();

  if (!normalizedName) {
    return "EM";
  }

  const words = normalizedName.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

const JobCardDetails = ({
  job,
  hasApplied = false,
}: {
  job: Job;
  hasApplied?: boolean;
}) => {
  const {
    id,
    title,
    role,
    slots,
    createdAt,
    isPaidAdvertising,
    company,
  } = job;

  const publishDate = createdAt
    ? new Date(createdAt).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    : "Nao informado";
  const slotsLabel = `${slots} ${slots === 1 ? "vaga disponível" : "vagas disponíveis"}`;
  const coverImage =
    company.cover?.trim() || "/images/jobs/default_company_cover.png";
  const companyInitials = getCompanyInitials(company.name);
  const detailsHref = hasApplied
    ? "/jobs/applications"
    : `/job/${id || ""}/details`;
  const jobDetailsHref = `/job/${id || ""}/details`;
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
          <div className="absolute top-6 left-6 z-20 flex flex-wrap items-center gap-2">
            {showFeaturedBadge ? (
              <span className="bg-orange-900 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white">
                <FaMedal className="text-base" />
              </span>
            ) : null}
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
          <div className="border-body-color/10 mb-6 border-b pb-6">
            {hasApplied ? (
              <p className="text-body-color text-base font-bold uppercase">
                Você já se aplicou a esta vaga
              </p>
            ) : (
              <p className="text-body-color text-base font-bold uppercase">
                {slotsLabel}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="border-body-color/10 flex flex-1 items-center border-r pr-5">
              <div className="mr-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-bold uppercase text-white">
                  {companyInitials}
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
              href={jobDetailsHref}
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
