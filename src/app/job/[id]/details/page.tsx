import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import jobData from "@/components/Jobs/jobData";

type JobDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: JobDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = jobData.find((item) => item.id === Number(id));

  if (!job) {
    return {
      title: "fitematch | Vaga não encontrada",
    };
  }

  return {
    title: `fitematch | ${job.title}`,
    description: job.paragraph,
  };
}

export default async function JobDetailsPage({ params }: Readonly<JobDetailsPageProps>) {
  const { id } = await params;
  const job = jobData.find((item) => item.id === Number(id));

  if (!job) {
    notFound();
  }

  return (
    <main className="bg-white pt-8 pb-20">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/#jobs"
            className="text-primary mb-6 inline-flex text-sm font-semibold hover:opacity-80"
          >
            Voltar para vagas
          </Link>

          <div className="overflow-hidden rounded-xs border border-gray-200 bg-white shadow-one">
            <div className="relative aspect-16/7 w-full bg-gray-100">
              <Image
                src={job.image}
                alt={job.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="p-8 md:p-10">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="bg-primary rounded-full px-4 py-2 text-sm font-semibold text-white capitalize">
                  {job.tags[0]}
                </span>
                <span className="text-body-color text-sm">
                  Publicada em {job.publishDate}
                </span>
              </div>

              <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
                {job.title}
              </h1>

              <p className="text-body-color mb-8 max-w-3xl text-base leading-relaxed md:text-lg">
                {job.paragraph}
              </p>

              <div className="flex flex-col gap-6 rounded-xs bg-gray-50 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full bg-white">
                    <Image
                      src={job.company.image}
                      alt={job.company.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-black text-base font-semibold">
                      {job.company.name}
                    </p>
                    <p className="text-body-color text-sm">
                      {job.company.designation}
                    </p>
                  </div>
                </div>

                <Link
                  href="/account/candidate"
                  className="inline-flex items-center justify-center rounded-xs bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
                >
                  Candidatar-se
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
