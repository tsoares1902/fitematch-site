import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "fitematch | Recrutador",
  description: "Acesse o fluxo de cadastro para recrutadores na fitematch.",
};

export default function RecruiterPage() {
  return (
    <main className="bg-white pt-8 pb-20">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-xs border border-gray-200 bg-gray-50 p-8 md:p-12">
          <span className="text-primary mb-4 inline-block text-sm font-semibold uppercase tracking-[0.24em]">
            Conta
          </span>
          <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
            Cadastro para recrutador
          </h1>
          <p className="text-body-color mb-8 text-base leading-relaxed md:text-lg">
            Inicie seu cadastro para publicar vagas, acompanhar candidatos e
            organizar o processo seletivo.
          </p>
          <Link
            href="/account/recruiter/register"
            className="shadow-submit bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-xs px-8 py-4 text-base font-medium text-white duration-300"
          >
            Continuar cadastro
          </Link>
        </div>
      </div>
    </main>
  );
}
