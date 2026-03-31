"use client";

import { usePathname } from "next/navigation";

import jobData from "@/components/Jobs/jobData";
import Breadcrumb from "@/components/Common/Breadcrumb";

const Star = ({
  className,
  size = 20,
}: {
  className: string;
  size?: number;
}) => (
  <span className={className}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary/30"
    >
      <path
        d="M12 2.5L13.9 10.1L21.5 12L13.9 13.9L12 21.5L10.1 13.9L2.5 12L10.1 10.1L12 2.5Z"
        fill="currentColor"
      />
    </svg>
  </span>
);

const getBreadcrumbContent = (pathname: string) => {
  if (pathname === "/account/signin") {
    return {
      pageName: "Login",
      description:
        "Acesse sua conta para acompanhar vagas, candidaturas, alertas e comunicacoes da plataforma.",
    };
  }

  if (pathname === "/account/signup") {
    return {
      pageName: "Cadastro",
      description:
        "Escolha o perfil de acesso para continuar o seu cadastro na plataforma.",
    };
  }

  if (pathname === "/account/candidate") {
    return {
      pageName: "Candidato",
      description:
        "Inicie seu fluxo de cadastro para criar perfil, acompanhar candidaturas e receber alertas.",
    };
  }

  if (pathname === "/account/candidate/register") {
    return {
      pageName: "Cadastro de Candidato",
      description:
        "Crie sua conta de candidato para acessar vagas, alertas e candidaturas.",
    };
  }

  if (pathname === "/account/recruiter") {
    return {
      pageName: "Recrutador",
      description:
        "Inicie seu fluxo de cadastro para publicar vagas e acompanhar candidatos.",
    };
  }

  if (pathname === "/account/recruiter/register") {
    return {
      pageName: "Cadastro de Recrutador",
      description:
        "Crie sua conta de recrutador para publicar vagas e organizar o processo seletivo.",
    };
  }

  if (pathname === "/jobs") {
    return {
      pageName: "Vagas",
      description:
        "Explore oportunidades para diferentes perfis, modalidades e unidades.",
    };
  }

  if (pathname === "/pricing") {
    return {
      pageName: "Precos",
      description:
        "Conheca os planos para candidatos e recrutadores e escolha a melhor opcao.",
    };
  }

  if (pathname === "/faq") {
    return {
      pageName: "FAQ",
      description:
        "Encontre respostas para as principais duvidas de candidatos e recrutadores sobre a plataforma.",
    };
  }

  if (pathname === "/privacy-policy") {
    return {
      pageName: "Politica de Privacidade",
      description:
        "Consulte como a fitematch coleta, trata, armazena e protege os dados da plataforma.",
    };
  }

  if (pathname === "/terms-of-use") {
    return {
      pageName: "Termos de Uso",
      description:
        "Veja as regras, responsabilidades e condicoes para uso da plataforma fitematch.",
    };
  }

  const jobMatch = pathname.match(/^\/job\/(\d+)\/details$/);
  if (jobMatch) {
    const job = jobData.find((item) => item.id === Number(jobMatch[1]));

    return {
      pageName: job?.title || "Detalhes da Vaga",
      description:
        job?.paragraph ||
        "Confira os detalhes da vaga e avance para a candidatura.",
    };
  }

  return null;
};

export default function InternalPageChrome() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  const breadcrumb = getBreadcrumbContent(pathname);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#FCFCFC]" />
        <Star className="absolute left-[8%] top-[140px] hidden md:block" size={22} />
        <Star className="absolute right-[10%] top-[180px]" size={18} />
        <Star className="absolute left-[14%] top-[38%]" size={14} />
        <Star className="absolute right-[16%] top-[42%] hidden lg:block" size={24} />
        <Star className="absolute left-[10%] bottom-[26%]" size={18} />
        <Star className="absolute right-[12%] bottom-[20%]" size={16} />
        <Star className="absolute left-[50%] top-[22%] hidden xl:block" size={12} />
        <Star className="absolute left-[58%] bottom-[28%] hidden md:block" size={14} />
        <div className="absolute left-[-120px] top-[220px] h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-[-140px] top-[120px] h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-80px] left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>
      {breadcrumb ? (
        <Breadcrumb
          pageName={breadcrumb.pageName}
          description={breadcrumb.description}
        />
      ) : null}
    </>
  );
}
