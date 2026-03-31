import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "fitematch | FAQ",
  description: "Perguntas frequentes sobre a plataforma fitematch.",
};

export default function FaqPage() {
  return (
    <main className="bg-white pt-8 pb-20">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-xs border border-gray-200 bg-gray-50 p-8 md:p-12">
            <span className="text-primary mb-4 inline-block text-sm font-semibold uppercase tracking-[0.24em]">
              FAQ
            </span>
            <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
              Perguntas frequentes
            </h1>
            <p className="text-body-color text-base leading-relaxed md:text-lg">
              Esta sera a pagina com respostas para as principais duvidas de
              candidatos e recrutadores sobre cadastro, candidaturas, alertas,
              planos e funcionamento da plataforma.
            </p>
          </div>
        </div>
      </main>
  );
}
