import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "fitematch | Termos de Uso",
  description: "Conheça os termos de uso da fitematch.",
};

export default function TermsOfUsePage() {
  return (
    <main className="bg-white pt-8 pb-20">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-xs border border-gray-200 bg-gray-50 p-8 md:p-12">
            <span className="text-primary mb-4 inline-block text-sm font-semibold uppercase tracking-[0.24em]">
              Termos
            </span>
            <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
              Termos de Uso
            </h1>
            <p className="text-body-color text-base leading-relaxed md:text-lg">
              Esta sera a pagina com as regras de uso da plataforma, direitos,
              responsabilidades, limites operacionais e condicoes para
              candidatos e recrutadores utilizarem os servicos da fitematch.
            </p>
          </div>
        </div>
      </main>
  );
}
