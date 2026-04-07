import Link from "next/link";
import { FaUserGraduate, FaUserTie } from "react-icons/fa6";

const Hero = () => {
  return (
    <section
        id="home"
        className="relative z-10 flex min-h-screen items-center overflow-hidden bg-white pb-16 pt-[120px] md:pt-[150px] xl:pt-[180px] 2xl:pt-[210px]"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[800px] text-center">
                <h1 className="mb-5 text-3xl font-bold leading-tight text-black sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                  Sua vaga ou candidato estão aqui!
                </h1>
                <p className="mb-12 text-base leading-relaxed! text-body-color sm:text-lg md:text-xl">
                  Seja um candidato buscando uma nova oportunidade ou recrutando um novo talento.
                </p>
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link
                    href="/account/candidate"
                    className="inline-flex items-center gap-2 rounded-xs bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-gray-700"
                  >
                    <FaUserGraduate className="h-[1.1em] w-[1.1em] shrink-0" />
                    Sou um candidato
                  </Link>
                  <Link
                    href="/account/recruiter"
                    className="inline-flex items-center gap-2 rounded-xs bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-gray-700"
                  >
                    <FaUserTie className="h-[1.1em] w-[1.1em] shrink-0" />
                    Sou um recrutador
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
        </div>
        <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
        </div>
      </section>
  );
};

export default Hero;
