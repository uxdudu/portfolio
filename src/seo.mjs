const SITE_URL = "https://eduardoamaral.me";
const SITE_NAME = "Eduardo Amaral";
const PERSON_ID = `${SITE_URL}/#person`;
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const CASE_METADATA = {
  "/cases/clinia": {
    image: `${SITE_URL}/cases/clinia.webp`,
    imageAlt: "Interface da plataforma Clinia 2.0",
  },
  "/cases/talqui": {
    image: `${SITE_URL}/cases/talqui.webp`,
    imageAlt: "Interface da plataforma Talqui",
  },
  "/cases/petrobras-nossa-energia": {
    image: `${SITE_URL}/cases/petrobras-nossa-energia.webp`,
    imageAlt: "Interface do portal Petrobras Nossa Energia",
  },
  "/cases/petrobras-design-system": {
    image: `${SITE_URL}/cases/petrobras-design-system.webp`,
    imageAlt: "Fundações e componentes do Design System Petrobras",
  },
};

const CASE_PATHS = new Set(Object.keys(CASE_METADATA));
const ROUTE_PATHS = new Set([
  "/",
  "/sobre",
  "/projetos",
  "/conteudos",
  "/contato",
  "/bio",
  "/styleguide",
  "/mapa-do-site",
  "/clinia",
  "/petrobras",
  "/playground",
  "/cases/clinia",
  "/cases/talqui",
  "/cases/petrobras-nossa-energia",
  "/cases/petrobras-design-system",
  "/cv/pt",
  "/cv/en",
  "/404",
]);

function routeCopy(path, en) {
  const t = (pt, english) => (en ? english : pt);

  switch (path) {
    case "/":
      return {
        title: `${SITE_NAME} | Product Designer | UX, UI & ${t("Design com IA", "AI for UX")}`,
        description: t(
          "Portfólio de Eduardo Amaral, Senior Product Designer especializado em UX/UI, Design Systems e IA aplicada a produtos digitais.",
          "Portfolio of Eduardo Amaral, a Senior Product Designer specializing in UX/UI, Design Systems and AI for digital products.",
        ),
      };
    case "/sobre":
      return {
        title: `${t("Sobre", "About")} | ${SITE_NAME} | Product Designer`,
        description: t(
          "Trajetória e experiência de Eduardo Amaral em Product Design, UX/UI, Design Systems e produtos digitais com IA.",
          "Eduardo Amaral's experience in Product Design, UX/UI, Design Systems and AI-enabled digital products.",
        ),
      };
    case "/projetos":
      return {
        title: `${t("Projetos", "Projects")} | ${SITE_NAME}`,
        description: t(
          "Projetos de Product Design com contexto, processo e resultados em saúde, energia, atendimento e plataformas SaaS.",
          "Product Design projects with context, process and outcomes across healthcare, energy, customer service and SaaS platforms.",
        ),
      };
    case "/conteudos":
      return {
        title: `${t("Conteúdos", "Content")} | ${SITE_NAME}`,
        description: t(
          "Vídeos e conteúdos autorais de Eduardo Amaral sobre Product Design, UX/UI, Design Systems e IA aplicada ao design.",
          "Original videos and content by Eduardo Amaral about Product Design, UX/UI, Design Systems and AI for design.",
        ),
      };
    case "/contato":
      return {
        title: `${t("Contato", "Contact")} | ${SITE_NAME}`,
        description: t(
          "Entre em contato com Eduardo Amaral para projetos, mentorias, parcerias e conversas sobre produto, design e IA.",
          "Contact Eduardo Amaral for projects, mentoring, partnerships and conversations about product, design and AI.",
        ),
      };
    case "/bio":
      return {
        title: `${SITE_NAME} | Links`,
        description: t(
          "Links principais de Eduardo Amaral: portfolio, projetos, vídeos, redes sociais, podcast e contato.",
          "Eduardo Amaral's main links: portfolio, projects, videos, social channels, podcast and contact.",
        ),
      };
    case "/styleguide":
      return {
        title: `Styleguide | ${SITE_NAME}`,
        description: t(
          "Referência interna de tipografia, cores, espaçamento e componentes do portfólio.",
          "Internal reference for the portfolio's typography, colors, spacing and components.",
        ),
      };
    case "/mapa-do-site":
      return {
        title: `${t("Mapa do site", "Sitemap")} | ${SITE_NAME}`,
        description: t(
          "Índice das páginas, projetos e cases disponíveis no portfólio de Eduardo Amaral.",
          "Index of the pages, projects and case studies in Eduardo Amaral's portfolio.",
        ),
      };
    case "/clinia":
      return {
        title: `Clinia | ${SITE_NAME} | Product Design & Design System`,
        description: t(
          "Projetos da Clinia para reconstrução da plataforma de saúde e criação de um Design System conectado ao código e à IA.",
          "Clinia projects rebuilding a healthcare platform and creating a Design System connected to code and AI.",
        ),
      };
    case "/petrobras":
      return {
        title: `Petrobras | ${SITE_NAME} | Design System & UX/UI`,
        description: t(
          "Cases da Petrobras sobre o portal Nossa Energia e um Design System usado para dar escala a mais de 100 páginas.",
          "Petrobras case studies covering the Nossa Energia portal and a Design System used to scale more than 100 pages.",
        ),
      };
    case "/cases/clinia":
      return {
        title: `Case Clinia | Design System & UX/UI | ${SITE_NAME}`,
        description: t(
          "Reconstrução da plataforma Clinia 2.0 com UX/UI, shadcn, Design System em Figma e código e fluxo design-to-code com IA.",
          "Rebuilding Clinia Platform 2.0 with UX/UI, shadcn, a Design System in Figma and code, and an AI design-to-code workflow.",
        ),
      };
    case "/cases/talqui":
      return {
        title: `Case Talqui | Product Design & UX/UI | ${SITE_NAME}`,
        description: t(
          "Redesign da plataforma Talqui com identidade própria, Design System, tokens personalizados e documentação em Storybook.",
          "Talqui platform redesign with its own identity, Design System, custom tokens and Storybook documentation.",
        ),
      };
    case "/cases/petrobras-nossa-energia":
      return {
        title: `Case Petrobras Nossa Energia | UX/UI | ${SITE_NAME}`,
        description: t(
          "Portal editorial que centralizou conteúdos institucionais da Petrobras em uma arquitetura modular integrada ao Liferay.",
          "Editorial portal that centralized Petrobras institutional content in a modular architecture integrated with Liferay.",
        ),
      };
    case "/cases/petrobras-design-system":
      return {
        title: `Case Petrobras Design System | ${SITE_NAME}`,
        description: t(
          "Design System que estruturou mais de 100 páginas da Petrobras e reduziu a criação de páginas de cerca de 6 dias para meio dia.",
          "Design System that structured more than 100 Petrobras pages and reduced page creation from about six days to half a day.",
        ),
      };
    case "/playground":
      return {
        title: `Playground | ${SITE_NAME} | UI Experiments`,
        description: t(
          "Galeria de experimentos visuais e estudos de interface para produtos digitais criados por Eduardo Amaral.",
          "Gallery of visual experiments and digital product interface studies created by Eduardo Amaral.",
        ),
      };
    case "/cv/pt":
      return {
        title: `${SITE_NAME} | Currículo`,
        description: "Currículo profissional de Eduardo Amaral, Senior Product Designer.",
      };
    case "/cv/en":
      return {
        title: `${SITE_NAME} | CV`,
        description: "Professional CV of Eduardo Amaral, Senior Product Designer.",
      };
    case "/404":
    default:
      return {
        title: `${t("Página não encontrada", "Page not found")} | ${SITE_NAME}`,
        description: t(
          "A página solicitada não foi encontrada no portfólio de Eduardo Amaral.",
          "The requested page was not found in Eduardo Amaral's portfolio.",
        ),
      };
  }
}

export function getSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: ["pt-BR", "en"],
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: SITE_NAME,
        alternateName: ["uxdudu", "UX Dudu", "Eduardo Amaral UX"],
        url: SITE_URL,
        jobTitle: "Senior Product Designer",
        description: "Product Designer especializado em UX/UI, Design Systems e IA aplicada ao design.",
        knowsAbout: [
          "UX Design",
          "UI Design",
          "Product Design",
          "Design Systems",
          "Design com IA",
        ],
        sameAs: [
          "https://www.linkedin.com/in/eduardooamaral/",
          "https://www.instagram.com/ux.dudu/",
          "https://dribbble.com/eduardooamaral",
          "https://open.spotify.com/show/3iRN3dTrHKCfA6bIg56hQv",
        ],
      },
    ],
  };
}

function structuredDataFor(path, title, description, canonical, inLanguage, image) {
  if (path === "/") {
    return {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profile`,
      url: canonical,
      name: title,
      description,
      mainEntity: { "@id": PERSON_ID },
    };
  }

  if (CASE_PATHS.has(path)) {
    return {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${canonical}#case-study`,
      url: canonical,
      name: title,
      description,
      image,
      inLanguage,
      author: { "@id": PERSON_ID },
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": path === "/projetos" ? "CollectionPage" : "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    author: { "@id": PERSON_ID },
  };
}

export function getRouteSeo(path, en = false) {
  const pathWithoutQueryOrFragment = path.split(/[?#]/, 1)[0] || "/";
  const normalizedPath =
    pathWithoutQueryOrFragment === "/" ? "/" : pathWithoutQueryOrFragment.replace(/\/+$/, "");
  const isKnownRoute = ROUTE_PATHS.has(normalizedPath);
  const seoPath = isKnownRoute ? normalizedPath : "/404";
  const canonical = seoPath === "/" ? `${SITE_URL}/` : `${SITE_URL}${seoPath}/`;
  const copy = routeCopy(seoPath, en);
  const noindex =
    !isKnownRoute ||
    seoPath === "/404" ||
    seoPath === "/styleguide" ||
    seoPath === "/mapa-do-site" ||
    seoPath.startsWith("/cv/");
  const caseMetadata = CASE_METADATA[seoPath];
  const image = caseMetadata?.image || DEFAULT_IMAGE;

  return {
    ...copy,
    canonical,
    robots: noindex ? "noindex, follow" : "index, follow, max-image-preview:large",
    openGraphType: CASE_PATHS.has(seoPath) ? "article" : "website",
    image,
    imageAlt: caseMetadata?.imageAlt || "Eduardo Amaral, Senior Product Designer",
    structuredData: structuredDataFor(
      seoPath,
      copy.title,
      copy.description,
      canonical,
      en ? "en" : "pt-BR",
      image,
    ),
  };
}
