import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "fitematch | Criar Conta",
  description: "Crie sua conta na fitematch.",
};

export default function SignUpPage() {
  return (
    <section className="relative z-10 overflow-hidden pt-8 pb-16 md:pb-20 lg:pb-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three mx-auto max-w-[500px] rounded-sm bg-white px-6 py-10 sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl">
                Criar sua conta
              </h3>
              <p className="text-body-color mb-10 text-center text-base font-medium">
                Escolha seu perfil para cadastro.
              </p>

              <div className="flex flex-col gap-4">
                <Link
                  href="/account/candidate/register"
                  className="shadow-submit flex w-full items-center justify-center gap-2 rounded-xs bg-black px-9 py-4 text-base font-medium text-white duration-300 hover:bg-gray-700"
                >
                  <CandidateIcon />
                  Criar candidato
                </Link>
                <Link
                  href="/account/recruiter/register"
                  className="shadow-submit flex w-full items-center justify-center gap-2 rounded-xs bg-black px-9 py-4 text-base font-medium text-white duration-300 hover:bg-gray-700"
                >
                  <RecruiterIcon />
                  Criar recrutador
                </Link>
              </div>

              <p className="text-body-color mt-8 text-center text-base font-medium">
                Ja tem uma conta?{" "}
                <Link href="/account/signin" className="text-primary hover:underline">
                  Entrar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
