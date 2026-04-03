import Link from "next/link";

const CandidateIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    fill="none"
    className="h-[1.1em] w-[1.1em] shrink-0"
  >
    <circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M4.5 16.5c.6-2.8 2.8-4.5 5.5-4.5s4.9 1.7 5.5 4.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const RecruiterIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    fill="none"
    className="h-[1.1em] w-[1.1em] shrink-0"
  >
    <circle cx="8" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M3.8 15.5c.5-2.2 2.2-3.5 4.2-3.5 1 0 1.9.3 2.6.8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M13.5 11.5v5m-2.5-2.5h5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const HeroLogged = () => {
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
                Continue navegando pela plataforma para encontrar vagas ou criar
                novos anuncios.
              </p>
              <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 rounded-xs bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-gray-700"
                >
                  <CandidateIcon />
                  Buscar Vagas
                </Link>
                <Link
                  href="/account/advertisement"
                  className="inline-flex items-center gap-2 rounded-xs bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-gray-700"
                >
                  <RecruiterIcon />
                  Criar Anuncio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100" />
      <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100" />
    </section>
  );
};

export default HeroLogged;
