import { Locale } from "./config";

export const dictionaries = {
  pt: {
    common: {
      home: "Home",
      jobs: "Vagas",
      faq: "FAQ",
      login: "Entrar",
      signup: "Cadastro",
      profile: "Perfil",
      signout: "Sair",
      searchJobs: "Buscar Vagas",
      createAdvertisement: "Criar Anúncio",
      candidate: "Candidato",
      recruiter: "Recrutador",
      candidateLabel: "Sou um candidato",
      recruiterLabel: "Sou um recrutador",
      privacyPolicy: "Política de Privacidade",
      termsOfUse: "Termos de Uso",
      supportHelp: "Suporte & Ajuda",
      allRightsReserved: "Todos os direitos reservados",
      developedBy: "Desenvolvido por",
      languages: "Idiomas",
      portuguese: "🇧🇷 PORTUGUÊS",
      spanish: "🇪🇸 ESPANHOL",
      english: "🇺🇸 INGLÊS",
      published: "Publicado",
      details: "Detalhes",
      appliedToJob: "Você já se aplicou a esta vaga",
      searchPlaceholder: "Busque sua vaga",
      faqIntro: "Reunimos aqui respostas sobre suas possíveis dúvidas.",
      privacyIntro:
        "Esta página apresenta as diretrizes de coleta, tratamento, armazenamento e uso de dados pessoais de candidatos, recrutadores e empresas dentro da plataforma.",
      termsIntro:
        "Esta página apresenta as regras de uso da plataforma, direitos, responsabilidades, limites operacionais e condições para candidatos e recrutadores utilizarem os serviços da fitematch.",
    },
    hero: {
      title: "Sua vaga ou candidato estão aqui!",
      subtitle:
        "Seja um candidato buscando uma nova oportunidade ou um recrutador procurando um novo talento.",
      loggedSubtitle:
        "Continue navegando pela plataforma para encontrar vagas ou criar novos anúncios.",
    },
    features: {
      title: "Funcionalidades",
      paragraph:
        "Faça o seu cadastro e aproveite nossa ferramenta de busca de vagas.",
      items: [
        {
          title: "Busque Vagas",
          paragraph:
            "Como candidato, busque vagas nas mais renomadas academias, studios e negócios fitness.",
        },
        {
          title: "Cadastre Vagas",
          paragraph:
            "Como recrutador, cadastre vagas da sua empresa e acompanhe as candidaturas.",
        },
        {
          title: "Sistema de Match",
          paragraph:
            "Defina parâmetros para encontrar candidatos aderentes e acompanhar oportunidades com mais precisão.",
        },
        {
          title: "Alerta de Novas Vagas",
          paragraph:
            "Adicione parâmetros para receber alertas de novas vagas com as características desejadas.",
        },
        {
          title: "Aplicativo Android",
          paragraph:
            "Em desenvolvimento para Android, em breve na Play Store para download.",
        },
        {
          title: "Aplicativo iOS",
          paragraph:
            "Em desenvolvimento para iOS, em breve na Apple Store para download.",
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Perguntas frequentes",
      items: [
        ["O que é a fitematch?", "A fitematch conecta profissionais e empresas do mercado fitness. Candidatos podem buscar vagas e se candidatar. Recrutadores podem publicar oportunidades e acompanhar inscrições."],
        ["Quem pode criar conta na plataforma?", "Existem dois perfis principais: candidato e recrutador. O candidato usa a plataforma para encontrar oportunidades. O recrutador usa a plataforma para divulgar vagas e gerenciar processos seletivos."],
        ["Como faço para me candidatar a uma vaga?", "Basta criar sua conta, acessar a lista de vagas, abrir os detalhes da oportunidade desejada e confirmar sua candidatura na página da vaga."],
        ["Quais tipos de vaga posso encontrar na fitematch?", "As vagas podem aparecer em formatos como Estágio, Autônomo, CLT e PJ, dependendo do que foi publicado pela empresa contratante."],
        ["Como funciona a busca de vagas?", "Na página de vagas, você pode usar o campo de busca para filtrar oportunidades pelo nome da empresa, título da vaga, cidade, estado e também pelo tipo da vaga."],
        ["Como um recrutador publica uma vaga?", "Depois de criar a conta de recrutador e acessar a área da conta, é possível abrir o formulário de anúncio, preencher os dados da vaga e publicar a oportunidade."],
        ["Consigo acompanhar minhas candidaturas?", "Sim. O candidato pode acessar a área de processos seletivos para visualizar as vagas em que já se candidatou e acompanhar seu histórico dentro da plataforma."],
        ["Posso editar meus dados de perfil?", "Sim. Na área da conta, você pode atualizar informações pessoais, documentos, contatos e redes sociais para manter seu perfil completo e atualizado."],
        ["Preciso pagar para usar a plataforma?", "O uso pode variar conforme o perfil e a funcionalidade disponível na plataforma. Para o candidato, o foco é buscar vagas e se candidatar. Para o recrutador, a plataforma oferece recursos de publicação e gestão de vagas."],
      ],
    },
    jobs: {
      roleLabels: {
        intern: "Estágio",
        freelance: "Autônomo",
        contract_person: "CLT",
        contract_company: "PJ",
      },
      slotsAvailable: "vaga disponível",
      slotsAvailablePlural: "vagas disponíveis",
      notInformed: "Não informado",
      publishedOn: "Publicada em",
      backToJobs: "Voltar para vagas",
      benefits: "Benefícios:",
      appliedMessage: "Você já se aplicou a esta vaga.",
      availableForJob: "disponíveis para esta vaga.",
      applyTitlePrefix: "Candidatar à vaga de",
      applyDescription:
        "Revise as informações antes de participar do processo seletivo.",
      applyTerms:
        "Ao enviar sua candidatura, você confirma que deseja participar do processo seletivo da",
      locatedIn: "localizada na cidade de",
      applyCheckboxPrefix: "Quero candidatar à vaga de",
      inUnit: "na unidade",
      redirecting: "Redirecionando em 5 segundos.",
      sendApplicationError:
        "Não foi possível enviar sua candidatura. Tente novamente.",
      sendApplicationSuccess: "Você enviou sua candidatura a esta vaga.",
      close: "Fechar",
    },
    publicPages: {
      privacyEyebrow: "Privacidade",
      privacyTitle: "Política de Privacidade",
      termsEyebrow: "Termos",
      termsTitle: "Termos de Uso",
    },
  },
  es: {
    common: {
      home: "Inicio",
      jobs: "Vacantes",
      faq: "Preguntas frecuentes",
      login: "Ingresar",
      signup: "Registro",
      profile: "Perfil",
      signout: "Salir",
      searchJobs: "Buscar vacantes",
      createAdvertisement: "Crear anuncio",
      candidate: "Candidato",
      recruiter: "Reclutador",
      candidateLabel: "Soy candidato",
      recruiterLabel: "Soy reclutador",
      privacyPolicy: "Política de privacidad",
      termsOfUse: "Términos de uso",
      supportHelp: "Soporte y ayuda",
      allRightsReserved: "Todos los derechos reservados",
      developedBy: "Desarrollado por",
      languages: "Idiomas",
      portuguese: "🇧🇷 PORTUGUÉS",
      spanish: "🇪🇸 ESPAÑOL",
      english: "🇺🇸 INGLÉS",
      published: "Publicado",
      details: "Detalles",
      appliedToJob: "Ya te postulaste a esta vacante",
      searchPlaceholder: "Busca tu vacante",
      faqIntro: "Reunimos aquí respuestas sobre tus posibles dudas.",
      privacyIntro:
        "Esta página presenta las directrices sobre la recopilación, el tratamiento, el almacenamiento y el uso de datos personales de candidatos, reclutadores y empresas dentro de la plataforma.",
      termsIntro:
        "Esta página presenta las reglas de uso de la plataforma, derechos, responsabilidades, límites operativos y condiciones para que candidatos y reclutadores utilicen los servicios de fitematch.",
    },
    hero: {
      title: "¡Tu vacante o candidato está aquí!",
      subtitle:
        "Ya seas un candidato en busca de una nueva oportunidad o un reclutador buscando un nuevo talento.",
      loggedSubtitle:
        "Sigue navegando por la plataforma para encontrar vacantes o crear nuevos anuncios.",
    },
    features: {
      title: "Funcionalidades",
      paragraph:
        "Crea tu cuenta y aprovecha nuestra herramienta de búsqueda de vacantes.",
      items: [
        {
          title: "Busca vacantes",
          paragraph:
            "Como candidato, busca vacantes en las academias, estudios y negocios fitness más reconocidos.",
        },
        {
          title: "Publica vacantes",
          paragraph:
            "Como reclutador, publica vacantes de tu empresa y acompaña las postulaciones.",
        },
        {
          title: "Sistema de match",
          paragraph:
            "Define parámetros para encontrar candidatos adecuados y acompañar oportunidades con mayor precisión.",
        },
        {
          title: "Alertas de nuevas vacantes",
          paragraph:
            "Agrega parámetros para recibir alertas de nuevas vacantes con las características deseadas.",
        },
        {
          title: "Aplicación Android",
          paragraph:
            "En desarrollo para Android, próximamente en Play Store para descarga.",
        },
        {
          title: "Aplicación iOS",
          paragraph:
            "En desarrollo para iOS, próximamente en Apple Store para descarga.",
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Preguntas frecuentes",
      items: [
        ["¿Qué es fitematch?", "fitematch conecta profesionales y empresas del mercado fitness. Los candidatos pueden buscar vacantes y postularse. Los reclutadores pueden publicar oportunidades y acompañar las postulaciones."],
        ["¿Quién puede crear una cuenta en la plataforma?", "Existen dos perfiles principales: candidato y reclutador. El candidato utiliza la plataforma para encontrar oportunidades. El reclutador la utiliza para publicar vacantes y gestionar procesos de selección."],
        ["¿Cómo puedo postularme a una vacante?", "Solo debes crear tu cuenta, acceder a la lista de vacantes, abrir los detalles de la oportunidad deseada y confirmar tu postulación en la página de la vacante."],
        ["¿Qué tipos de vacantes puedo encontrar en fitematch?", "Las vacantes pueden aparecer en formatos como Prácticas, Autónomo, CLT y PJ, según lo que publique la empresa contratante."],
        ["¿Cómo funciona la búsqueda de vacantes?", "En la página de vacantes, puedes usar el campo de búsqueda para filtrar oportunidades por nombre de empresa, título de la vacante, ciudad, estado y también por el tipo de vacante."],
        ["¿Cómo publica una vacante un reclutador?", "Después de crear la cuenta de reclutador y acceder al área de la cuenta, es posible abrir el formulario de anuncio, completar los datos de la vacante y publicarla."],
        ["¿Puedo seguir mis postulaciones?", "Sí. El candidato puede acceder al área de procesos de selección para visualizar las vacantes en las que ya se postuló y seguir su historial dentro de la plataforma."],
        ["¿Puedo editar los datos de mi perfil?", "Sí. En el área de la cuenta puedes actualizar información personal, documentos, contactos y redes sociales para mantener tu perfil completo y actualizado."],
        ["¿Las vacantes destacadas son diferentes de las demás?", "Las vacantes destacadas reciben más visibilidad dentro del listado, pero siguen siendo oportunidades normales registradas por reclutadores en la plataforma."],
        ["¿Necesito pagar para usar la plataforma?", "El uso puede variar según el perfil y la funcionalidad disponible en la plataforma. Para el candidato, el foco está en buscar vacantes y postularse. Para el reclutador, la plataforma ofrece recursos de publicación y gestión de vacantes."],
      ],
    },
    jobs: {
      roleLabels: {
        intern: "Prácticas",
        freelance: "Autónomo",
        contract_person: "CLT",
        contract_company: "PJ",
      },
      slotsAvailable: "vacante disponible",
      slotsAvailablePlural: "vacantes disponibles",
      notInformed: "No informado",
      publishedOn: "Publicada el",
      backToJobs: "Volver a vacantes",
      benefits: "Beneficios:",
      appliedMessage: "Ya te postulaste a esta vacante.",
      availableForJob: "disponibles para esta vacante.",
      applyTitlePrefix: "Postular a la vacante de",
      applyDescription:
        "Revisa la información antes de participar en el proceso de selección.",
      applyTerms:
        "Al enviar tu postulación, confirmas que deseas participar en el proceso de selección de",
      locatedIn: "ubicada en la ciudad de",
      applyCheckboxPrefix: "Quiero postular a la vacante de",
      inUnit: "en la unidad",
      redirecting: "Redirigiendo en 5 segundos.",
      sendApplicationError:
        "No fue posible enviar tu postulación. Inténtalo nuevamente.",
      sendApplicationSuccess: "Has enviado tu postulación a esta vacante.",
      close: "Cerrar",
    },
    publicPages: {
      privacyEyebrow: "Privacidad",
      privacyTitle: "Política de privacidad",
      termsEyebrow: "Términos",
      termsTitle: "Términos de uso",
    },
  },
  en: {
    common: {
      home: "Home",
      jobs: "Jobs",
      faq: "FAQ",
      login: "Login",
      signup: "Sign up",
      profile: "Profile",
      signout: "Sign out",
      searchJobs: "Browse jobs",
      createAdvertisement: "Create listing",
      candidate: "Candidate",
      recruiter: "Recruiter",
      candidateLabel: "I am a candidate",
      recruiterLabel: "I am a recruiter",
      privacyPolicy: "Privacy Policy",
      termsOfUse: "Terms of Use",
      supportHelp: "Support & Help",
      allRightsReserved: "All rights reserved",
      developedBy: "Developed by",
      languages: "Languages",
      portuguese: "🇧🇷 PORTUGUESE",
      spanish: "🇪🇸 SPANISH",
      english: "🇺🇸 ENGLISH",
      published: "Published",
      details: "Details",
      appliedToJob: "You have already applied to this job",
      searchPlaceholder: "Search your job",
      faqIntro: "We gathered here answers to your possible questions.",
      privacyIntro:
        "This page presents the guidelines for collecting, processing, storing and using personal data from candidates, recruiters and companies within the platform.",
      termsIntro:
        "This page presents the platform usage rules, rights, responsibilities, operating limits and conditions for candidates and recruiters to use fitematch services.",
    },
    hero: {
      title: "Your job or candidate is here!",
      subtitle:
        "Whether you are a candidate looking for a new opportunity or a recruiter searching for new talent.",
      loggedSubtitle:
        "Keep browsing the platform to find jobs or create new listings.",
    },
    features: {
      title: "Features",
      paragraph:
        "Create your account and make the most of our job search tool.",
      items: [
        {
          title: "Search Jobs",
          paragraph:
            "As a candidate, search for jobs at leading gyms, studios and fitness businesses.",
        },
        {
          title: "Post Jobs",
          paragraph:
            "As a recruiter, publish jobs for your company and track applications.",
        },
        {
          title: "Match System",
          paragraph:
            "Define parameters to find matching candidates and follow opportunities more accurately.",
        },
        {
          title: "New Job Alerts",
          paragraph:
            "Add parameters to receive alerts for new jobs with the characteristics you want.",
        },
        {
          title: "Android App",
          paragraph:
            "Under development for Android, coming soon to the Play Store.",
        },
        {
          title: "iOS App",
          paragraph:
            "Under development for iOS, coming soon to the Apple Store.",
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
      items: [
        ["What is fitematch?", "fitematch connects professionals and companies in the fitness market. Candidates can browse jobs and apply. Recruiters can publish opportunities and track applications."],
        ["Who can create an account on the platform?", "There are two main profiles: candidate and recruiter. Candidates use the platform to find opportunities. Recruiters use it to publish jobs and manage hiring processes."],
        ["How do I apply for a job?", "You just need to create your account, access the jobs list, open the details of the desired opportunity and confirm your application on the job page."],
        ["What job types can I find on fitematch?", "Jobs may appear in formats such as Internship, Independent, CLT and PJ, depending on what the hiring company has published."],
        ["How does job search work?", "On the jobs page, you can use the search field to filter opportunities by company name, job title, city, state and also by job type."],
        ["How does a recruiter post a job?", "After creating a recruiter account and accessing the account area, it is possible to open the listing form, fill in the job details and publish the opportunity."],
        ["Can I track my applications?", "Yes. Candidates can access the hiring processes area to view the jobs they have already applied to and follow their history within the platform."],
        ["Can I edit my profile data?", "Yes. In the account area, you can update personal information, documents, contacts and social media to keep your profile complete and up to date."],
        ["Do I need to pay to use the platform?", "Usage may vary according to profile and the functionality available on the platform. For candidates, the focus is on searching and applying for jobs. For recruiters, the platform offers job posting and management resources."],
      ],
    },
    jobs: {
      roleLabels: {
        intern: "Internship",
        freelance: "Independent",
        contract_person: "CLT",
        contract_company: "PJ",
      },
      slotsAvailable: "available job",
      slotsAvailablePlural: "available jobs",
      notInformed: "Not informed",
      publishedOn: "Published on",
      backToJobs: "Back to jobs",
      benefits: "Benefits:",
      appliedMessage: "You have already applied to this job.",
      availableForJob: "available for this job.",
      applyTitlePrefix: "Apply for the job",
      applyDescription:
        "Review the information before joining the hiring process.",
      applyTerms:
        "By sending your application, you confirm that you want to participate in the hiring process for",
      locatedIn: "located in the city of",
      applyCheckboxPrefix: "I want to apply for the job",
      inUnit: "at the unit",
      redirecting: "Redirecting in 5 seconds.",
      sendApplicationError:
        "We could not send your application. Please try again.",
      sendApplicationSuccess: "You have successfully applied for this job.",
      close: "Close",
    },
    publicPages: {
      privacyEyebrow: "Privacy",
      privacyTitle: "Privacy Policy",
      termsEyebrow: "Terms",
      termsTitle: "Terms of Use",
    },
  },
} satisfies Record<Locale, unknown>;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
