import { Children, Fragment, Suspense, createContext, isValidElement, lazy, useContext, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { usePostHog } from "@posthog/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Lenis from "lenis";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import avatar from "./assets/avatar.webp";
import companyApogeuTechLogo from "./assets/company-apogeu-tech-symbol.svg";
import companyArkuspayLogo from "./assets/company-arkuspay-symbol.svg";
import companyAsimovLogo from "./assets/company-asimov-symbol.svg";
import companyAsimovInvertedLogo from "./assets/company-asimov-inverted-symbol.svg";
import companyBancoDoBrasilLogo from "./assets/company-banco-do-brasil-symbol.svg";
import companyBriviaLogo from "./assets/company-brivia-symbol.svg";
import companyBriviaInvertedLogo from "./assets/company-brivia-inverted-symbol.svg";
import companyCliniaLogo from "./assets/company-clinia-symbol.svg";
import companyGennioLogo from "./assets/company-gennio-symbol.svg";
import companyGranaAiLogo from "./assets/company-grana-ai-symbol.svg";
import companyJStackLogo from "./assets/company-jstack-symbol.svg";
import companyJStackInvertedLogo from "./assets/company-jstack-inverted-symbol.svg";
import companyMarmarisLogo from "./assets/company-marmaris-symbol.svg";
import companyMundpayLogo from "./assets/company-mundpay-symbol.svg";
import companyOrcamaisLogo from "./assets/company-orcamais-symbol.svg";
import companyPetrobrasLogo from "./assets/company-petrobras-symbol.svg";
import companyTalquiLogo from "./assets/company-talqui-symbol.svg";
import companyVellooLogo from "./assets/company-velloo-symbol.svg";
import cliniaShadcnFoundation from "./assets/clinia-shadcn-foundation.webp";
import cliniaDsCheckboxLibrary from "./assets/clinia-ds-checkbox-library.webp";
import cliniaDsCheckboxOverview from "./assets/clinia-ds-checkbox-overview.webp";
import cliniaDsCheckboxVariables from "./assets/clinia-ds-checkbox-variables.webp";
import cliniaClaudeCursorFigmaMcp from "./assets/clinia-claude-cursor-figma-mcp.webp";
import cliniaCover from "./assets/clinia-cover.webp";
import cliniaV1Inbox from "./assets/clinia-v1-inbox.webp";
import cliniaV1Login from "./assets/clinia-v1-login.webp";
import cliniaV1Settings from "./assets/clinia-v1-settings.webp";
import faviconSymbol from "./assets/favicon-symbol.svg";
import bioVersareCover from "./assets/bio-versare-cover.png";
import loadingMotionPortrait from "./assets/loading-motion-portrait.png";
import logo from "./assets/logo.svg";
import navState from "./assets/nav-state.svg";
import ogImage from "./assets/og-image.webp";
import cliniaLogoBlue from "./assets/clinia-logo-blue.svg";
import cliniaLogoPng from "./assets/clinia-logo.png";
import grupoPrimoLogo from "./assets/grupo-primo-logo.svg";
import orcamaisColorsLogo from "./assets/orcamais-colors.svg";
import orcamaisLightLogo from "./assets/orcamais-light.svg";
import petrobrasLogo from "./assets/petrobras-logo.png";
import petrobrasNossaEnergia from "./assets/case-petrobras-nossa-energia.webp";
import petrobrasNossaEnergiaHomeDesktop from "./assets/petrobras-nossa-energia-home-desktop.webp";
import petrobrasNossaEnergiaHomeMobile from "./assets/petrobras-nossa-energia-home-mobile.webp";
import petrobrasDsBulletSpec from "./assets/petrobras-ds-bullet-spec.webp";
import petrobrasDsCardSpec from "./assets/petrobras-ds-card-spec.webp";
import petrobrasDsComponents from "./assets/petrobras-ds-components.webp";
import petrobrasDsCover from "./assets/petrobras-ds-cover.webp";
import petrobrasDsTokens from "./assets/petrobras-ds-tokens.webp";
import talquiCover from "./assets/talqui-cover.webp";
import talquiFigmaVariables from "./assets/talqui-figma-variables.png";
import talquiFigmaDoc from "./assets/talqui-figma-doc.webp";
import talquiStorybook from "./assets/talqui-storybook.webp";
import talquiOnboarding from "./assets/talqui-figma0interface.webp";
import petrodsCover from "./assets/petrods-cover.webp";
import petrodsColors from "./assets/petrods-colors.webp";
import petrodsTemplate from "./assets/petrods-template-pagina.webp";
import petrodsVariables from "./assets/petrods-variables.webp";
import talquiLogo from "./assets/talqui-logo.svg";
import talquiLogoPng from "./assets/talqui-logo.png";
import talquiSymbol from "./assets/talqui-symbol.svg";
import brFlag from "./assets/br.svg";
import usFlag from "./assets/us.svg";
import { useSanityPortfolioContent } from "./lib/useSanityPortfolioContent";
import type { SanityCaseStudy, SanityProject } from "./lib/sanity";
import { trackEvent, trackPageView } from "./lib/analytics";
import { normalizeRoutePath } from "./routePath.mjs";
import { getRouteSeo } from "./seo.mjs";
import {
  IconlyDownload,
  IconlyDribbble,
  IconlyInstagram,
  IconlyLinkedin,
  IconlyMoon,
  IconlyPrinter,
  IconlySendMessage,
  IconlySpotify,
  IconlySun,
  IconlyWhatsapp,
  IconlyYoutube,
  IconlyMonitorDisplay,
} from "./components/icons";

const PetrobrasDesignSystemCasePage = lazy(() =>
  import("./CasePages").then((m) => ({ default: m.PetrobrasDesignSystemCasePage })),
);
const PetrobrasNossaEnergiaCasePage = lazy(() =>
  import("./CasePages").then((m) => ({ default: m.PetrobrasNossaEnergiaCasePage })),
);
const CliniaCasePage = lazy(() => import("./CasePages").then((m) => ({ default: m.CliniaCasePage })));
const TalquiCasePage = lazy(() => import("./CasePages").then((m) => ({ default: m.TalquiCasePage })));
const PlaygroundPage = lazy(() => import("./PlaygroundPage").then((m) => ({ default: m.PlaygroundPage })));

const SPRING = { type: "spring" as const, stiffness: 180, damping: 24, mass: 0.9 };
const TAP = { scale: 0.96 };
type LanguagePreference = "pt-BR" | "en";

const LanguageContext = createContext<{
  language: LanguagePreference;
  onLanguageChange: (language: LanguagePreference) => void;
}>({
  language: "pt-BR",
  onLanguageChange: () => undefined,
});

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const staggerChildren = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const pageFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

function FigmaMotionPortrait({
  className = "",
  animated = true,
  eager = false,
  playOnHover = false,
}: {
  className?: string;
  animated?: boolean;
  eager?: boolean;
  playOnHover?: boolean;
}) {
  return (
    <span className={`relative block overflow-hidden rounded-full bg-[#f4f4f4] ${playOnHover ? "figma-motion-hover" : ""} ${className}`}>
      <img
        src={loadingMotionPortrait}
        alt=""
        className={`absolute inset-0 size-full object-cover ${animated ? "figma-motion-normal" : ""}`}
        decoding="async"
        fetchPriority={eager ? "high" : undefined}
      />
      {animated ? (
        <img
          src={loadingMotionPortrait}
          alt=""
          className="figma-motion-pixel absolute object-cover"
          decoding="async"
          fetchPriority={eager ? "high" : undefined}
        />
      ) : null}
    </span>
  );
}

function LoadingScreen() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-background text-foreground"
      role="status"
      aria-label="Carregando"
    >
      <motion.div
        className="relative grid size-[184px] place-items-center overflow-hidden rounded-full bg-[#f4f4f4]"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <FigmaMotionPortrait className="size-full" animated={!prefersReducedMotion} eager />
      </motion.div>
    </div>
  );
}

type ThemePreference = "system" | "light" | "dark";
type ActivePage = "home" | "about" | "projects" | "content" | "contact" | "none";
type LightboxImage = {
  src: string;
  alt: string;
  caption?: string;
};

const themeOptions: { label: string; value: ThemePreference }[] = [
  { label: "Usar tema do sistema", value: "system" },
  { label: "Usar tema claro", value: "light" },
  { label: "Usar tema escuro", value: "dark" },
];

function SystemIcon() {
  return <IconlyMonitorDisplay size={16} />;
}

function SunIcon() {
  return <IconlySun size={16} />;
}

function MoonIcon() {
  return <IconlyMoon size={16} />;
}

const projects = [
  {
    id: "clinia",
    title: "Clinia",
    tags: ["AI, Saúde, CRM", "Em andamento"],
    tagsEn: ["AI, Health, CRM", "In progress"],
    description: "Site, Plataforma, Design System",
    descriptionEn: "Site, Platform, Design System",
    logo: cliniaLogoPng,
    icon: cliniaLogoPng,
    href: "/cases/clinia/",
  },
  {
    id: "talqui",
    title: "Talqui",
    tags: ["AI, Provedores, Chat", "Em andamento"],
    tagsEn: ["AI, Providers, Chat", "In progress"],
    description: "Site, Plataforma, Design System",
    descriptionEn: "Site, Platform, Design System",
    logo: talquiLogoPng,
    symbol: talquiSymbol,
    icon: talquiLogoPng,
    href: "/cases/talqui/",
  },
  {
    id: "petrobras",
    title: "Petrobras",
    tags: ["Institucional", "2022 - 2024"],
    tagsEn: ["Institutional", "2022 - 2024"],
    description: "Site, Portal de Conteúdos, Design System",
    descriptionEn: "Site, Content Portal, Design System",
    href: "/petrobras/",
    icon: petrobrasLogo,
  },
  {
    id: "orcamais",
    title: "Orçamais",
    tags: ["AI, Obras, SaaS", "Em andamento"],
    tagsEn: ["AI, Construction, SaaS", "In progress"],
    description: "Plataforma de gestão de obras pela Versare",
    descriptionEn: "Construction management platform by Versare",
    logo: orcamaisColorsLogo,
    lightLogo: orcamaisLightLogo,
    icon: orcamaisColorsLogo,
  },
  {
    id: "grupo-primo",
    title: "Grupo Primo",
    tags: ["Marketing, Finanças, Educacional", "2021 - 2022"],
    tagsEn: ["Marketing, Finance, Education", "2021 - 2022"],
    description: "Finclass, Staage, Staart, Design System e Landing Pages",
    descriptionEn: "Finclass, Staage, Staart, Design System and Landing Pages",
    logo: grupoPrimoLogo,
    icon: grupoPrimoLogo,
  },
];

const petrobrasProjects = [
  {
    title: "Nossa Energia",
    eyebrow: "Portal de conteúdos",
    description:
      "Hub editorial da Petrobras para centralizar conteúdos institucionais, artigos e editorias usando componentes do design system.",
    href: "/cases/petrobras-nossa-energia/",
    status: "Case disponível",
  },
  {
    title: "Design System Petrobras",
    eyebrow: "Fundação do ecossistema",
    description:
      "Biblioteca documentada manualmente com tokens, componentes, seções, templates, motion e specs para sustentar o ecossistema digital.",
    href: "/cases/petrobras-design-system/",
    status: "Case disponível",
  },
];

const petrobrasProjectsEn = [
  {
    title: "Nossa Energia",
    eyebrow: "Content portal",
    description:
      "Petrobras editorial hub to centralize institutional content, articles and editorial sections using design system components.",
    href: "/cases/petrobras-nossa-energia/",
    status: "Case available",
  },
  {
    title: "Petrobras Design System",
    eyebrow: "Ecosystem foundation",
    description:
      "Manually documented library with tokens, components, sections, templates, motion and specs to sustain the digital ecosystem.",
    href: "/cases/petrobras-design-system/",
    status: "Case available",
  },
];

const caseProcess = [
  "Mapeamento dos conteúdos dispersos e dos principais tipos editoriais da Petrobras.",
  "Arquitetura da informação para organizar artigos, editorias, informações institucionais e chamadas.",
  "Uso do Design System Petrobras v2 para acelerar consistência visual, componentes e governança.",
  "Documentação manual de specs, tokens, componentes, seções, templates, motion e acessibilidade.",
];

const caseOutcomes = [
  "Centralização dos conteúdos institucionais em uma experiência editorial mais clara.",
  "Maior liberdade para equipes publicarem páginas e artigos sem depender de layouts únicos.",
  "Reuso de componentes, sections e templates do design system entre portal, site principal e outras frentes digitais.",
  "Base mais escalável para colaboração entre UX, UI, desenvolvimento Liferay e conteúdo.",
];

const petrobrasDsPillars = [
  "Design Tokens",
  "Components",
  "Sections",
  "Templates",
  "Motion",
  "Acessibilidade",
];

const petrobrasDsFoundations = [
  {
    title: "Design Tokens",
    description: "Cores, tipografia, espaçamentos e tamanhos organizados como variáveis de estilo para reduzir decisões soltas.",
  },
  {
    title: "Components",
    description: "Botões, cards, abas, accordions e padrões de interface documentados com estados, anatomia e regras de uso.",
  },
  {
    title: "Sections",
    description: "Blocos reutilizáveis como hero banners, menus, footers e áreas de conteúdo para acelerar páginas editoriais.",
  },
  {
    title: "Templates",
    description: "Modelos de páginas por nível, erro e estrutura institucional para manter consistência entre fluxos e times.",
  },
  {
    title: "Motion",
    description: "Diretrizes de movimento para orientar transições, feedbacks e comportamentos sem quebrar performance.",
  },
  {
    title: "Acessibilidade",
    description: "Regras de contraste, leitura, foco, estrutura e inclusão para sustentar uma experiência pública mais robusta.",
  },
];

const petrobrasDsProcess = [
  "Inventário de padrões existentes no ecossistema Petrobras para entender redundâncias, inconsistências e lacunas.",
  "Definição de fundações visuais e estruturais para criar uma linguagem comum entre portal, site principal e novas páginas.",
  "Documentação manual no Notion com exemplos, anatomia, specs, variações, estados e orientações de implementação.",
  "Organização de componentes, sections e templates para aproximar design, conteúdo, Liferay e desenvolvimento.",
];

const petrobrasDsOutcomes = [
  "Base reutilizável para acelerar construção de páginas e reduzir desalinhamento entre equipes.",
  "Documentação navegável para designers, desenvolvedores e stakeholders consultarem decisões de interface.",
  "Mais consistência entre o Nossa Energia, o site principal e outras frentes digitais da Petrobras.",
  "Menos ambiguidade na passagem para desenvolvimento por meio de specs, estados e critérios de uso.",
];

const petrobrasDsEvidence = [
  {
    title: "Tokens",
    description: "Galeria de fundações com cores, tipografia, breakpoints, efeitos, bordas, ícones, spacing, ilustrações, sizing e imagens.",
    image: petrobrasDsTokens,
  },
  {
    title: "Componentes",
    description: "Catálogo em Notion organizado por grupos como Actions e Content, com buttons, accordion, avatar, bullet e cards.",
    image: petrobrasDsComponents,
  },
  {
    title: "Specs de anatomia",
    description: "Exemplo de documentação manual do componente Bullet, detalhando elementos, função, cores e regras de composição.",
    image: petrobrasDsBulletSpec,
  },
  {
    title: "Specs de layout",
    description: "Exemplo de variação horizontal com medidas, propriedades e tokens como padding, radius, gaps, width e height.",
    image: petrobrasDsCardSpec,
  },
];

const cliniaProcess = [
  "Entendimento das dores, gargalos e motivos para criar uma versão 2.0 mesmo com uma plataforma já existente.",
  "Auditoria da experiência atual para mapear inconsistências, ausência de fundações e pontos que dificultavam escala.",
  "Adaptação da linha visual desejada pela empresa para uma estrutura de design system no Figma baseada em shadcn.",
  "Construção dos componentes equivalentes em código com Cursor, criando uma ponte prática entre design e frontend.",
];

const cliniaOutcomes = [
  "Figma e código passaram a falar a mesma língua, com componentes mais próximos da implementação real.",
  "Designers passaram a entregar telas, componentes e código em um repositório dedicado.",
  "Devs conseguem consumir o design do Figma e acelerar implementação com apoio de ferramentas de IA.",
  "A próxima etapa é aproximar esse fluxo do repositório oficial de frontend da plataforma.",
];

const cliniaWorkflow = [
  {
    title: "Diagnóstico",
    description: "Antes de redesenhar, o foco foi entender por que a nova versão precisava existir e quais gargalos impediam evolução.",
  },
  {
    title: "Design System",
    description: "A identidade visual desejada foi organizada em fundações e componentes reutilizáveis dentro do Figma.",
  },
  {
    title: "shadcn como base",
    description: "A estrutura foi adaptada para conversar com uma stack moderna e com padrões de frontend usados por startups.",
  },
  {
    title: "Cursor e Claude",
    description: "O design system também foi implementado em código, usando IA no fluxo diário de designers e desenvolvedores.",
  },
  {
    title: "Repositório frontend",
    description: "Criamos um repositório separado para alimentar componentes continuamente e reduzir distância entre design e produto.",
  },
  {
    title: "Próximos passos",
    description: "A evolução natural é começar a contribuir diretamente no repositório oficial de frontend da plataforma.",
  },
];

const cliniaDesignSystemEvidence = [
  {
    image: cliniaDsCheckboxOverview,
    title: "Clinia DS v2, componente Checkbox",
    caption:
      "shadcn customizado para a identidade da Clinia, com variantes, estados e propriedades organizadas para uso em produto.",
  },
  {
    image: cliniaDsCheckboxLibrary,
    title: "Biblioteca de componentes no Figma",
    caption:
      "Estrutura de componentes no Figma com páginas e propriedades preparadas para escalar o design system da plataforma.",
  },
  {
    image: cliniaDsCheckboxVariables,
    title: "Tokens e variáveis da Clinia",
    caption:
      "Coleções de variáveis com modos light e dark, conectando Tailwind, tema, customizações e motion ao design system.",
  },
];

const cliniaProjects = [
  {
    title: "Plataforma",
    category: "Web App",
    eyebrow: "Web App",
    description:
      "Nova base da plataforma Clinia: versão 2.0, onboarding, estatísticas, CRM, design system e fluxo design-to-code com Cursor e Claude.",
    href: "/cases/clinia/",
    status: "Case disponível",
  },
];

const cliniaProjectsEn = [
  {
    title: "Platform",
    category: "Web App",
    eyebrow: "Web App",
    description:
      "New foundation of the Clinia platform: v2.0, onboarding, statistics, CRM, design system and design-to-code workflow with Cursor and Claude.",
    href: "/cases/clinia/",
    status: "Case available",
  },
];

const talquiProcess = [
  "Redesenho da plataforma a partir de uma versão antiga que havia nascido como um fork de interface criada pelo time de desenvolvimento.",
  "Criação de uma identidade de plataforma alinhada à marca Talqui, conectando produto, experiência e linguagem visual.",
  "Construção do design system com variáveis, design tokens e componentes pensados para escala e manutenção contínua.",
  "Definição de uma nomenclatura personalizada para tokens, aproximando semântica de design e implementação.",
];

const talquiOutcomes = [
  "Nova plataforma com linguagem própria, mais coerente com a marca e preparada para evoluções futuras.",
  "Design system versionável com repositório dedicado, manutenção contínua pelo time de desenvolvimento e documentação sincronizada.",
  "Tokens e componentes estruturados para evitar decisões soltas e acelerar novas telas sem perder consistência.",
  "Base mais escalável para updates, novos fluxos, novas features e evolução do produto de atendimento com IA.",
];

const talquiFoundations = [
  {
    title: "Identidade de plataforma",
    description: "A interface deixou de parecer uma adaptação técnica e passou a ter uma linguagem de produto própria para a Talqui.",
  },
  {
    title: "Design tokens",
    description: "Variáveis nomeadas com uma lógica personalizada para facilitar uso, manutenção e conexão com código.",
  },
  {
    title: "Componentes escaláveis",
    description: "Componentes pensados para múltiplos contextos, estados e atualizações sem recriar padrões a cada tela.",
  },
  {
    title: "Repositório de DS",
    description: "Os devs criaram uma base dedicada para o design system, atualizada continuamente junto da plataforma.",
  },
  {
    title: "Storybook",
    description: "A documentação técnica é sincronizada com Storybook, criando uma fonte viva de referência para o time.",
  },
  {
    title: "Novas telas",
    description: "A plataforma foi reconstruída com novas telas e fluxos apoiados por essa fundação visual e técnica.",
  },
];

const talquiEvidenceFallback = [
  {
    title: "Variáveis e tokens do Talqui DS",
    caption: "Coleções de variáveis no Figma com grupos Theme, Style, Typography e Extensions organizando os tokens semânticos da plataforma Talqui.",
    imageUrl: talquiFigmaVariables,
  },
  {
    title: "Componente Badge documentado no Figma",
    caption: "Componente Base Badge documentado no Figma com property table, variantes e exemplos de uso da plataforma Talqui.",
    imageUrl: talquiFigmaDoc,
  },
  {
    title: "Documentação no Storybook",
    caption: "Storybook do Talqui DS em design-system.talqui.dev com variantes do componente Badge: cores, outline e ícones.",
    imageUrl: talquiStorybook,
  },
  {
    title: "Fluxo de onboarding e componente Button",
    caption: "Tela de cadastro da plataforma Talqui com o componente t-base-button em uso.",
    imageUrl: talquiOnboarding,
  },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/eduardooamaral/" },
  { label: "Instagram", href: "https://www.instagram.com/ux.dudu/" },
  { label: "YouTube", href: "https://www.youtube.com/@uxdudu" },
  { label: "Dribbble", href: "https://dribbble.com/eduardooamaral" },
];

const contentLinks = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/@uxdudu",
    icon: "youtube",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/ux.dudu/",
    icon: "instagram",
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/show/3iRN3dTrHKCfA6bIg56hQv?si=871df89c77f94e21&nd=1&dlsi=91c8707c7bda41e3",
    icon: "spotify",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/eduardooamaral/",
    icon: "linkedin",
  },
];

const bioLinks = [
  {
    title: "Portfolio",
    description: "Projetos, cases e estudos de interface.",
    href: "/",
    domain: "eduardoamaral.me",
    kind: "featured",
    image: ogImage,
  },
  {
    title: "Projetos",
    description: "Cases de produto, UX/UI, design system e IA.",
    href: "/projetos/",
    domain: "eduardoamaral.me/projetos",
    kind: "wide",
    image: talquiCover,
  },
  {
    title: "YouTube",
    description: "Vídeos sobre design, IA, Figma e produto.",
    href: "https://www.youtube.com/@uxdudu",
    domain: "youtube.com/@uxdudu",
    kind: "video",
    videoId: "hSLU8O22BZM",
    icon: "youtube",
  },
  {
    title: "Instagram",
    description: "Bastidores, processos e referências visuais.",
    href: "https://www.instagram.com/ux.dudu/",
    domain: "instagram.com/ux.dudu",
    kind: "social",
    icon: "instagram",
  },
  {
    title: "LinkedIn",
    description: "Posts e atualizações profissionais.",
    href: "https://www.linkedin.com/in/eduardooamaral/",
    domain: "linkedin.com/in/eduardooamaral",
    kind: "social",
    icon: "linkedin",
  },
  {
    title: "Dribbble",
    description: "Explorações de UI e visual design.",
    href: "https://dribbble.com/eduardooamaral",
    domain: "dribbble.com/eduardooamaral",
    kind: "social",
    icon: "dribbble",
  },
  {
    title: "Podcast",
    description: "Conversas e conteúdos em áudio.",
    href: "https://open.spotify.com/show/3iRN3dTrHKCfA6bIg56hQv?si=871df89c77f94e21&nd=1&dlsi=91c8707c7bda41e3",
    domain: "open.spotify.com",
    kind: "compact",
    icon: "spotify",
  },
  {
    title: "Contato",
    description: "Projetos, parcerias e mentorias.",
    href: "/contato/",
    domain: "eduardoamaral.me/contato",
    kind: "compact",
    icon: "whatsapp",
  },
] as const;

type BioLink = (typeof bioLinks)[number];
type BioIconName = Extract<BioLink, { icon: string }>["icon"];

const youtubeVideos = [
  {
    id: "cop3LX65sEA",
    title: "Hands On - Claude Design - Conhecendo a novidade do Claude",
    date: "17 abr 2026",
    dateEn: "Apr 17, 2026",
    views: "1,7 mil visualizações",
    viewsEn: "1.7K views",
  },
  {
    id: "qvnCen5ffA4",
    title: "Conheça o Wonder, a ferramenta de vibe design",
    date: "2 abr 2026",
    dateEn: "Apr 2, 2026",
    views: "372 visualizações",
    viewsEn: "372 views",
  },
  {
    id: "TwZJ1KtJzoQ",
    title: "Editor visual para Claude Code e Cursor",
    date: "30 mar 2026",
    dateEn: "Mar 30, 2026",
    views: "429 visualizações",
    viewsEn: "429 views",
  },
  {
    id: "hSLU8O22BZM",
    title: "Design System com IA - Claude Code + Figma",
    date: "26 mar 2026",
    dateEn: "Mar 26, 2026",
    views: "5,2 mil visualizações",
    viewsEn: "5.2K views",
  },
];

const socialFeedSections = [
  {
    title: "Instagram",
    handle: "@ux.dudu",
    description:
      "Espaço para posts recentes, bastidores e stories. Para ficar automático, precisa conectar Instagram Graph API ou usar embeds de posts específicos.",
    href: "https://www.instagram.com/ux.dudu/",
    cta: "Abrir Instagram",
    status: "Posts e stories exigem API",
  },
  {
    title: "LinkedIn",
    handle: "eduardooamaral",
    description:
      "Espaço para publicações sobre produto, IA, Figma, carreira e processos. O LinkedIn bloqueia feed público automático sem autenticação.",
    href: "https://www.linkedin.com/in/eduardooamaral/",
    cta: "Ver atividade",
    status: "Feed exige autenticação",
  },
];

const aboutHighlights = [
  "Product Designer com mais de 6 anos criando produtos, sites e design systems.",
  "Atuo de discovery a interface, protótipo, handoff e evolução com times de produto.",
  "Trabalhei em projetos para Petrobras, Banco do Brasil, Grupo Primo, Clinia e Talqui.",
  "Hoje também construo a Versare Design, estúdio focado em produto digital e IA.",
];

const aboutStats = [
  { value: "+6", label: "Anos de experiência" },
  { value: "+80", label: "Projetos entregues" },
  { value: "+51", label: "Clientes satisfeitos" },
];

const faviconUrl = (href: string) => `${new URL(href).origin}/favicon.ico`;

const testimonials = [
  {
    quote:
      "O Eduardo entendeu muito bem o desafio das interfaces da Grana.ai e entregou um trabalho de alto nível. Seguiu as orientações, aplicou boas práticas de usabilidade e trouxe um visual moderno e atraente.",
    author: "Arthur Simoneto",
    role: "Grana.ai",
    company: "Grana.ai",
    companyUrl: "http://grana.ai/",
    companyLogo: companyGranaAiLogo,
  },
  {
    quote:
      "O Amaral é um profissional exemplar. Sempre está disposto a contribuir com o time, ouvindo muito e disseminando seus conhecimentos para que todos ao seu redor cresçam também.",
    author: "Eduardo van Leeuwen",
    role: "CEO",
    company: "Orbi",
    companyUrl: "https://orbi.design/",
    companyIconUrl: faviconUrl("https://orbi.design/"),
  },
  {
    quote:
      "O Eduardo é um dos profissionais mais disciplinados e competentes que já trabalhei, entregando as demandas com maestria e agilidade.",
    author: "Kácio Felipe",
    role: "Product Designer e Framer Expert",
    company: "Flatirons",
    companyUrl: "https://swovo.com/",
    companyIconUrl: faviconUrl("https://swovo.com/"),
  },
  {
    quote:
      "Sua meticulosidade e dedicação à excelência na entrega o destacam como um Designer de Produto singular. Eduardo é um profissional completo.",
    author: "Igor S.",
    role: "UX Motion e Product Designer",
    company: "Meiuca",
    companyUrl: "https://meiuca.design/",
    companyIconUrl: faviconUrl("https://meiuca.design/"),
  },
  {
    quote:
      "Trabalhar com o Edu é entrar em uma imersão diária de lições e aprendizados. Tudo que aprendi com ele foi significativo na minha trajetória profissional.",
    author: "Elias Cândido",
    role: "Senior Product Designer",
    company: "Lanlink",
    companyUrl: "https://www.lanlink.com.br/",
    companyIconUrl: faviconUrl("https://www.lanlink.com.br/"),
  },
  {
    quote:
      "O Dudu é um cara incrível, metódico e organizado, trouxe um nível de organização sem igual para o projeto. Dá gosto de trabalhar com designers assim!",
    author: "Richard Jesus",
    role: "Outusual",
    company: "Outusual",
    companyUrl: "https://outusual.com/",
    companyIconUrl: faviconUrl("https://outusual.com/"),
  },
];

const testimonialsEn = [
  {
    quote:
      "Eduardo understood the challenge behind Grana.ai's interfaces and delivered high-level work, with strong usability practices and a modern visual result.",
    author: "Arthur Simoneto",
    role: "Grana.ai",
    company: "Grana.ai",
    companyUrl: "http://grana.ai/",
    companyLogo: companyGranaAiLogo,
  },
  {
    quote:
      "Amaral is an exemplary professional. He is always willing to contribute to the team, listen carefully, and share knowledge so people around him can grow.",
    author: "Eduardo van Leeuwen",
    role: "CEO",
    company: "Orbi",
    companyUrl: "https://orbi.design/",
    companyIconUrl: faviconUrl("https://orbi.design/"),
  },
  {
    quote:
      "Eduardo is one of the most disciplined and competent professionals I have worked with, delivering work with mastery and agility.",
    author: "Kácio Felipe",
    role: "Product Designer and Framer Expert",
    company: "Flatirons",
    companyUrl: "https://swovo.com/",
    companyIconUrl: faviconUrl("https://swovo.com/"),
  },
  {
    quote:
      "His meticulousness and dedication to excellence make him stand out as a singular Product Designer. Eduardo is a complete professional.",
    author: "Igor S.",
    role: "UX Motion and Product Designer",
    company: "Meiuca",
    companyUrl: "https://meiuca.design/",
    companyIconUrl: faviconUrl("https://meiuca.design/"),
  },
  {
    quote:
      "Working with Edu means entering a daily immersion of lessons and learning. Everything I learned from him was meaningful in my professional path.",
    author: "Elias Cândido",
    role: "Senior Product Designer",
    company: "Lanlink",
    companyUrl: "https://www.lanlink.com.br/",
    companyIconUrl: faviconUrl("https://www.lanlink.com.br/"),
  },
  {
    quote:
      "Dudu is an incredible, methodical, and organized person. He brought an unmatched level of organization to the project. It is a pleasure to work with designers like that!",
    author: "Richard Jesus",
    role: "Outusual",
    company: "Outusual",
    companyUrl: "https://outusual.com/",
    companyIconUrl: faviconUrl("https://outusual.com/"),
  },
];

const knownCompanies = [
  { name: "Arkuspay", href: "https://arkushq.com/", logo: companyArkuspayLogo },
  { name: "Asimov", href: "http://asimov.academy/", logo: companyAsimovLogo, logoLight: companyAsimovInvertedLogo, logoDark: companyAsimovLogo },
  { name: "Banco do Brasil", href: "https://www.bb.com.br/", logo: companyBancoDoBrasilLogo },
  { name: "Brivia", href: "https://www.brivia.com.br/", logo: companyBriviaLogo, logoLight: companyBriviaLogo, logoDark: companyBriviaInvertedLogo },
  { name: "Clinia", href: "https://clinia.io/", logo: companyCliniaLogo },
  { name: "Gennio", href: "http://gennio.io/", logo: companyGennioLogo },
  { name: "JStack", href: "https://jstack.com.br/", logo: companyJStackLogo, logoLight: companyJStackInvertedLogo, logoDark: companyJStackLogo },
  { name: "Marmaris", href: "https://marmaristurismo.com/", logo: companyMarmarisLogo },
  { name: "Mundpay", href: "https://mundpay.com/", logo: companyMundpayLogo },
  { name: "Orçamais", href: "https://orcamais.com/", logo: companyOrcamaisLogo },
  { name: "Petrobras", href: "https://petrobras.com.br/", logo: companyPetrobrasLogo },
  { name: "Talqui", href: "https://talqui.com.br/", logo: companyTalquiLogo },
  { name: "Velloo", href: "https://velloo.app/", logo: companyVellooLogo },
  { name: "Apogeu Tech", href: "https://apogeu.tech/", logo: companyApogeuTechLogo },
  { name: "Grana.ai", href: "http://grana.ai/", logo: companyGranaAiLogo },
];

const projectCompanyVisuals: Record<string, { logo?: string; iconUrl?: string; cover?: string; coverAlt?: string; coverClassName?: string }> = {
  Clinia: { logo: companyCliniaLogo, cover: cliniaCover, coverAlt: "Clinia Plataforma" },
  Talqui: { logo: companyTalquiLogo, cover: talquiCover, coverAlt: "Talqui Plataforma" },
  Petrobras: {
    logo: companyPetrobrasLogo,
    cover: petrobrasNossaEnergia,
    coverAlt: "Portal Nossa Energia Petrobras",
    coverClassName: "object-top",
  },
  "Grupo Primo": { iconUrl: faviconUrl("https://www.grupo-primo.com/") },
  "Grana.ai": { logo: companyGranaAiLogo },
  Gennio: { logo: companyGennioLogo },
  JStack: { logo: companyJStackLogo },
  Orçamais: { logo: companyOrcamaisLogo },
  Velloo: { logo: companyVellooLogo },
  Marmaris: { logo: companyMarmarisLogo },
};

const experiences = [
  {
    role: "Senior Product Designer",
    company: "Clinia",
    meta: "Design de produto para saúde digital, com pesquisa de UX, validações de usabilidade, interfaces escaláveis e experiências com IA para clínicas.",
  },
  {
    role: "Fundador / Product Designer",
    company: "Versare Design",
    meta: "Estúdio de produto digital para startups e empresas em crescimento, com discovery, design end-to-end, Framer, plataformas e produtos com IA.",
  },
  {
    role: "Senior UX Designer",
    company: "Brivia",
    meta: "Redesign do portal da Petrobras com design system aplicado em 100+ páginas e prototipação da Escola de Influenciadores do Banco do Brasil.",
  },
  {
    role: "Product Designer",
    company: "Grupo Primo",
    meta: "Produtos digitais de educação e conteúdo como Staart, Finclass e Staage, com co-criação, prototipação, componentes e acompanhamento técnico.",
  },
  {
    role: "UX Designer",
    company: "União Sul Brasileira da IASD",
    meta: "Produtos digitais e educacionais, com criação de interfaces, prototipação, componentes e acompanhamento técnico.",
  },
];

// ─── English translations for static content ────────────────────────────────

const caseProcessEn = [
  "Mapping dispersed content and Petrobras's main editorial types.",
  "Information architecture to organize articles, editorials, institutional information, and calls to action.",
  "Using the Petrobras Design System v2 to accelerate visual consistency, components, and governance.",
  "Manual documentation of specs, tokens, components, sections, templates, motion, and accessibility.",
];

const caseOutcomesEn = [
  "Centralization of institutional content into a clearer editorial experience.",
  "Greater freedom for teams to publish pages and articles without depending on unique layouts.",
  "Reuse of design system components, sections, and templates across the portal, main site, and other digital fronts.",
  "A more scalable foundation for collaboration between UX, UI, Liferay development, and content teams.",
];

const petrobrasDsPillarsEn = ["Design Tokens", "Components", "Sections", "Templates", "Motion", "Accessibility"];

const petrobrasDsFoundationsEn = [
  { title: "Design Tokens", description: "Colors, typography, spacing, and sizes organized as style variables to reduce ad-hoc decisions." },
  { title: "Components", description: "Buttons, cards, tabs, accordions, and interface patterns documented with states, anatomy, and usage rules." },
  { title: "Sections", description: "Reusable blocks like hero banners, menus, footers, and content areas to speed up editorial pages." },
  { title: "Templates", description: "Page models by level, error state, and institutional structure to maintain consistency across flows and teams." },
  { title: "Motion", description: "Motion guidelines to direct transitions, feedback, and behaviors without breaking performance." },
  { title: "Accessibility", description: "Contrast, readability, focus, structure, and inclusion rules to support a more robust public experience." },
];

const petrobrasDsProcessEn = [
  "Inventory of existing patterns across the Petrobras ecosystem to understand redundancies, inconsistencies, and gaps.",
  "Definition of visual and structural foundations to create a common language across the portal, main site, and new pages.",
  "Manual Notion documentation with examples, anatomy, specs, variants, states, and implementation guidelines.",
  "Organization of components, sections, and templates to bring design, content, Liferay, and development closer together.",
];

const petrobrasDsOutcomesEn = [
  "Reusable foundation to speed up page building and reduce misalignment between teams.",
  "Navigable documentation for designers, developers, and stakeholders to reference interface decisions.",
  "More consistency between Nossa Energia, the main site, and other Petrobras digital fronts.",
  "Less ambiguity in handoff to development through specs, states, and usage criteria.",
];

const petrobrasDsEvidenceEn = [
  { title: "Tokens", description: "Foundation gallery with colors, typography, breakpoints, effects, borders, icons, spacing, illustrations, sizing, and images.", image: petrobrasDsTokens },
  { title: "Components", description: "Notion catalog organized by groups like Actions and Content, with buttons, accordion, avatar, bullet, and cards.", image: petrobrasDsComponents },
  { title: "Anatomy specs", description: "Example of manual documentation for the Bullet component, detailing elements, function, colors, and composition rules.", image: petrobrasDsBulletSpec },
  { title: "Layout specs", description: "Example of horizontal variant with measurements, properties, and tokens like padding, radius, gaps, width, and height.", image: petrobrasDsCardSpec },
];

const petrobrasDsCmsEvidenceFallback = [
  {
    title: "Arquivo PetroDS v2 no Figma",
    caption: "Visão da capa do arquivo PetroDS v2 no Figma, com navegação lateral de tokens e componentes.",
    imageUrl: petrodsCover,
  },
  {
    title: "Tokens de cores",
    caption: "Documentação dos tokens de cores da marca no PetroDS v2.",
    imageUrl: petrodsColors,
  },
  {
    title: "Template de página",
    caption: "Template de página do PetroDS v2 documentado em variações default e high contrast.",
    imageUrl: petrodsTemplate,
  },
  {
    title: "Variáveis de tema",
    caption: "Coleções de variáveis do PetroDS v2 organizadas por temas default e high contrast.",
    imageUrl: petrodsVariables,
  },
];

const cliniaProcessEn = [
  "Understanding the pain points and reasons for building a 2.0 even with an existing platform.",
  "Audit of the current experience to map inconsistencies, missing foundations, and bottlenecks blocking scale.",
  "Adapting the company's desired visual identity into a design system structure in Figma based on shadcn.",
  "Building equivalent components in code with Cursor, creating a practical bridge between design and frontend.",
];

const cliniaOutcomesEn = [
  "Figma and code started speaking the same language, with components closer to the real implementation.",
  "Designers began delivering screens, components and code in a dedicated repository.",
  "Devs can consume the Figma design and accelerate implementation with AI tool support.",
  "The next step is to bring this workflow closer to the platform's official frontend repository.",
];

const cliniaWorkflowEn = [
  { title: "Diagnosis", description: "Before redesigning, the focus was on understanding why the new version needed to exist and what bottlenecks prevented growth." },
  { title: "Design System", description: "The desired visual identity was organized into reusable foundations and components inside Figma." },
  { title: "shadcn as a base", description: "The structure was adapted to work with a modern stack and the frontend standards used by startups." },
  { title: "Cursor and Claude", description: "The design system was also implemented in code, using AI in the daily workflow of designers and developers." },
  { title: "Frontend repository", description: "We created a separate repository to continuously supply components and reduce the distance between design and product." },
  { title: "Next steps", description: "The natural evolution is to start contributing directly to the platform's official frontend repository." },
];

const cliniaDesignSystemEvidenceEn = [
  { image: cliniaDsCheckboxOverview, title: "Clinia DS v2, Checkbox component", caption: "Customized shadcn adapted to Clinia's identity, with variants, states, and organized properties for use in product." },
  { image: cliniaDsCheckboxLibrary, title: "Component library in Figma", caption: "Component structure in Figma with pages and properties prepared to scale the platform's design system." },
  { image: cliniaDsCheckboxVariables, title: "Clinia tokens and variables", caption: "Variable collections with light and dark modes, connecting Tailwind, theme, customizations, and motion to the design system." },
];

const talquiProcessEn = [
  "Redesign of the platform from an older version that had been born as an interface fork created by the dev team.",
  "Creation of a platform identity aligned with the Talqui brand, connecting product, experience, and visual language.",
  "Building a design system with variables, design tokens, and components designed for scale and continuous maintenance.",
  "Defining a custom naming convention for tokens, bringing design semantics and implementation closer together.",
];

const talquiOutcomesEn = [
  "New platform with its own language, more consistent with the brand and ready for future evolutions.",
  "Versionable design system with a dedicated repository, continuous dev team maintenance, and synced documentation.",
  "Structured tokens and components to avoid ad-hoc decisions and speed up new screens without losing consistency.",
  "More scalable foundation for updates, new flows, features, and evolution of the AI-powered support product.",
];

const talquiFoundationsEn = [
  { title: "Platform identity", description: "The interface stopped feeling like a technical adaptation and gained its own product language for Talqui." },
  { title: "Design tokens", description: "Named variables with custom logic to ease use, maintenance, and connection to code." },
  { title: "Scalable components", description: "Components built for multiple contexts, states, and updates without recreating patterns for each screen." },
  { title: "DS repository", description: "Devs created a dedicated base for the design system, updated continuously alongside the platform." },
  { title: "Storybook", description: "Technical documentation is synced with Storybook, creating a live reference for the team." },
  { title: "New screens", description: "The platform was rebuilt with new screens and flows supported by this visual and technical foundation." },
];

const socialFeedSectionsEn = [
  { title: "Instagram", handle: "@ux.dudu", description: "Space for recent posts, behind-the-scenes, and stories. Automatic updates require connecting Instagram Graph API or using specific post embeds.", href: "https://www.instagram.com/ux.dudu/", cta: "Open Instagram", status: "Posts and stories require API" },
  { title: "LinkedIn", handle: "eduardooamaral", description: "Space for posts about product, AI, Figma, career, and processes. LinkedIn blocks automatic public feed without authentication.", href: "https://www.linkedin.com/in/eduardooamaral/", cta: "View activity", status: "Feed requires authentication" },
];

const aboutHighlightsEn = [
  "Product Designer with 6+ years building products, sites, and design systems.",
  "I work from discovery to interface, prototype, handoff, and product evolution.",
  "I have worked on projects for Petrobras, Banco do Brasil, Grupo Primo, Clinia, and Talqui.",
  "I also run Versare Design, a studio focused on digital products and AI.",
];

const aboutStatsEn = [
  { value: "+6", label: "Years of experience" },
  { value: "+80", label: "Projects delivered" },
  { value: "+51", label: "Happy clients" },
];

const experiencesEn = [
  { role: "Senior Product Designer", company: "Clinia", meta: "Product design for digital health, including UX research, usability testing, scalable interfaces, and AI-powered experiences for clinics." },
  { role: "Founder / Product Designer", company: "Versare Design", meta: "Digital product studio for startups and growing companies, covering discovery, end-to-end design, Framer, platforms, and AI products." },
  { role: "Senior UX Designer", company: "Brivia", meta: "Petrobras portal redesign using a design system applied across 100+ pages, and prototyping Banco do Brasil's Escola de Influenciadores." },
  { role: "Product Designer", company: "Grupo Primo", meta: "Digital education and content products like Staart, Finclass, and Staage, with co-creation, prototyping, components, and technical oversight." },
  { role: "UX Designer", company: "South Brazil Union of the SDA Church", meta: "Digital and educational products, including interface design, prototyping, components, and technical delivery support." },
];

// ────────────────────────────────────────────────────────────────────────────

const projectTypeFilters = ["Todos", "Web app", "App", "Blog", "Site"] as const;
const deliverableFilters = ["Todos", "UI/UX", "Design System", "Motion", "No code", "AI"] as const;
const hiddenProjectIds = new Set(["orcamais", "grupo-primo", "clinia-site", "petrobras-main-site"]);
const hiddenProjectNames = new Set(["Orçamais", "Grupo Primo"]);

const allProjects = [
  {
    name: "Clinia",
    type: "Web app",
    status: "Em andamento",
    statusEn: "In progress",
    summary: "Produto de saúde digital com CRM, experiências com IA e design system.",
    summaryEn: "Digital health product with CRM, AI experiences and design system.",
    deliverables: ["UI/UX", "Design System", "AI"],
    href: "/cases/clinia/",
  },
  {
    name: "Talqui",
    type: "Web app",
    status: "Em andamento",
    statusEn: "In progress",
    summary: "Plataforma de atendimento com IA, redesign, design system e site em Framer.",
    summaryEn: "AI support platform, redesign, design system and Framer site.",
    deliverables: ["UI/UX", "Design System", "No code", "AI"],
    href: "/cases/talqui/",
  },
  {
    name: "Orçamais",
    type: "Web app",
    status: "Em andamento",
    statusEn: "In progress",
    summary: "Plataforma de gestão de obras construída pela Versare com AI no processo.",
    summaryEn: "Construction management platform by Versare with AI in the process.",
    deliverables: ["UI/UX", "AI", "Design System"],
  },
  {
    name: "Petrobras",
    type: "Site",
    status: "Case disponível",
    statusEn: "Case available",
    summary: "Portal Nossa Energia, site institucional e Design System Petrobras v2.",
    summaryEn: "Nossa Energia portal, institutional site and Petrobras Design System v2.",
    deliverables: ["UI/UX", "Design System"],
    href: "/petrobras/",
  },
  {
    name: "Grupo Primo",
    type: "Site",
    status: "Finalizado",
    statusEn: "Completed",
    summary: "Produtos digitais de educação e conteúdo como Finclass, Staage e Staart.",
    summaryEn: "Digital education and content products like Finclass, Staage and Staart.",
    deliverables: ["UI/UX", "Design System"],
  },
  {
    name: "JStack",
    type: "Site",
    status: "Finalizado",
    statusEn: "Completed",
    summary: "Redesign institucional, posicionamento, landing pages e evolução de produto.",
    summaryEn: "Institutional redesign, positioning, landing pages and product evolution.",
    deliverables: ["UI/UX", "No code", "Design System"],
  },
  {
    name: "Grana.ai",
    type: "Web app",
    status: "Versare",
    summary: "Produto financeiro com foco em clareza, jornadas e experiência de uso.",
    summaryEn: "Financial product focused on clarity, journeys and user experience.",
    deliverables: ["UI/UX", "AI"],
  },
  {
    name: "Docompliance",
    type: "Web app",
    status: "Versare",
    summary: "Plataforma jurídica com IA para fluxos de compliance e operação.",
    summaryEn: "Legal platform with AI for compliance and operation flows.",
    deliverables: ["UI/UX", "AI", "Design System"],
  },
  {
    name: "Gennio",
    type: "Site",
    status: "Versare",
    summary: "Landing pages e presença digital para comunicação de produto.",
    summaryEn: "Landing pages and digital presence for product communication.",
    deliverables: ["UI/UX", "No code"],
  },
  {
    name: "Velloo",
    type: "App",
    status: "Versare",
    summary: "Experiência mobile com foco em interface, fluxos e produto.",
    summaryEn: "Mobile experience focused on interface, flows and product.",
    deliverables: ["UI/UX"],
  },
  {
    name: "Marmaris",
    type: "Site",
    status: "Versare",
    summary: "Site institucional com direção visual e experiência responsiva.",
    summaryEn: "Institutional site with visual direction and responsive experience.",
    deliverables: ["UI/UX", "No code"],
  },
];

type HomeProject = (typeof projects)[number];
type DirectoryProject = (typeof allProjects)[number];
type HubProject = (typeof petrobrasProjects)[number];
type CliniaHubProject = (typeof cliniaProjects)[number];

const deliverableDisplayOrder = ["AI", "UI/UX", "Design System", "No Code", "Motion"] as const;
const deliverableAliases: Record<string, string> = {
  "No code": "No Code",
};

function normalizeDeliverables(deliverables: string[] = []) {
  const nextDeliverables: string[] = [];
  const normalizedItems = deliverables.map((item) => deliverableAliases[item] ?? item);
  const hasUiUx = normalizedItems.some((item) => item === "UI" || item === "UX" || item === "UI/UX");

  if (hasUiUx) nextDeliverables.push("UI/UX");

  for (const item of normalizedItems) {
    if (item === "UI" || item === "UX" || item === "UI/UX" || item === "Research") continue;
    if (!nextDeliverables.includes(item)) nextDeliverables.push(item);
  }

  return nextDeliverables.sort((a, b) => {
    const indexA = deliverableDisplayOrder.indexOf(a as (typeof deliverableDisplayOrder)[number]);
    const indexB = deliverableDisplayOrder.indexOf(b as (typeof deliverableDisplayOrder)[number]);

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

function mergeHomeProjects(cmsProjects: SanityProject[] | undefined): HomeProject[] {
  const visibleProjects = projects.filter((project) => !hiddenProjectIds.has(project.id));
  if (!cmsProjects?.length) return visibleProjects;

  const cmsById = new Map(
    cmsProjects
      .filter((project) => project.featured && !hiddenProjectIds.has(project.id))
      .map((project) => [project.id, project]),
  );

  return visibleProjects.map((project) => {
    const cmsProject = cmsById.get(project.id);
    if (!cmsProject) return project;

    return {
      ...project,
      title: cmsProject.title || project.title,
      tags: cmsProject.tags?.length ? cmsProject.tags : project.tags,
      description: cmsProject.description || project.description,
      href: (cmsProject.href ?? project.href) as string,
    } as HomeProject;
  });
}

function mergeDirectoryProjects(cmsProjects: SanityProject[] | undefined): DirectoryProject[] {
  if (!cmsProjects?.length) return allProjects.filter((project) => !hiddenProjectNames.has(project.name));

  const directoryProjects = cmsProjects
    .filter((project) => project.group === "portfolio" && project.type && project.summary && !hiddenProjectIds.has(project.id))
    .map((project) => ({
      name: project.title,
      type: project.type as DirectoryProject["type"],
      status: project.status || "",
      statusEn: undefined as string | undefined,
      summary: project.summary || project.description || "",
      summaryEn: undefined as string | undefined,
      deliverables: normalizeDeliverables(project.deliverables || []),
      href: project.href,
    }));

  const fallbackProjects = allProjects
    .filter((project) => !hiddenProjectNames.has(project.name))
    .map((project) => ({ ...project, deliverables: normalizeDeliverables(project.deliverables) }));

  return (directoryProjects.length ? directoryProjects : fallbackProjects) as DirectoryProject[];
}

function mergeHubProjects<T extends HubProject | CliniaHubProject>(
  fallbackProjects: T[],
  cmsProjects: SanityProject[] | undefined,
  group: "clinia" | "petrobras",
): T[] {
  const groupProjects = cmsProjects?.filter((project) => project.group === group && !hiddenProjectIds.has(project.id));
  if (!groupProjects?.length) return fallbackProjects;

  return groupProjects.map((project) => ({
    title: project.title,
    eyebrow: project.eyebrow || project.type || "",
    description: project.description || project.summary || "",
    href: project.href,
    status: project.status || "",
  })) as T[];
}

function getCaseStudy(cmsCases: SanityCaseStudy[] | undefined, slug: string) {
  return cmsCases?.find((caseStudy) => caseStudy.slug === slug);
}

function localizeProjects(cmsProjects: SanityProject[] | undefined, language: LanguagePreference) {
  if (!cmsProjects?.length || language !== "en") return cmsProjects;

  return cmsProjects.map((project) => ({
    ...project,
    title: project.titleEn || project.title,
    tags: project.tagsEn?.length ? project.tagsEn : project.tags,
    description: project.descriptionEn || project.description,
    status: project.statusEn || project.status,
    summary: project.summaryEn || project.summary,
    eyebrow: project.eyebrowEn || project.eyebrow,
  }));
}

function localizeCaseStudies(cmsCases: SanityCaseStudy[] | undefined, language: LanguagePreference) {
  if (!cmsCases?.length || language !== "en") return cmsCases;

  return cmsCases.map((caseStudy) => ({
    ...caseStudy,
    title: caseStudy.titleEn || caseStudy.title,
    role: caseStudy.roleEn || caseStudy.role,
    status: caseStudy.statusEn || caseStudy.status,
    summary: caseStudy.summaryEn || caseStudy.summary,
    stack: caseStudy.stackEn?.length ? caseStudy.stackEn : caseStudy.stack,
    sections: caseStudy.sectionsEn?.length ? caseStudy.sectionsEn : caseStudy.sections,
  }));
}

function useTranslation() {
  const { language } = useContext(LanguageContext);
  return {
    language,
    t: {
      zoom: language === "en" ? "Zoom in" : "Ampliar",
      close: language === "en" ? "Close" : "Fechar",
      summary: language === "en" ? "Summary" : "Resumo",
      role: language === "en" ? "Role" : "Função",
      seeProjects: language === "en" ? "See projects" : "Ver projetos",
      openCase: language === "en" ? "Open case" : "Abrir case",
      backToProjects: language === "en" ? "← Back to projects" : "← Voltar para projetos",
      backToClinia: language === "en" ? "← Back to Clinia" : "← Voltar para Clinia",
      backToPetrobras: language === "en" ? "← Back to Petrobras" : "← Voltar para Petrobras",
      viewPetroDs: language === "en" ? "View Petro DS v2 documentation" : "Ver documentação do Petro DS v2",
      watchOnYoutube: language === "en" ? "Watch on YouTube" : "Assistir no YouTube",
      viewChannel: language === "en" ? "View channel" : "Ver canal",
      latestVideo: language === "en" ? "Latest video" : "Vídeo mais recente",
    },
  };
}

function Logo({ className = "", linked = false }: { className?: string; linked?: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const wrapperVariants = {
    rest: { y: 0 },
    hover: { y: prefersReducedMotion ? 0 : -1 },
  };
  const content = (
    <span className={`relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-full ${className}`}>
      <motion.img
        loading="lazy"
        decoding="async"
        src={logo}
        alt="Eduardo Amaral"
        className="h-5 w-[26px]"
        variants={{
          rest: { opacity: 1, scale: 1, rotate: 0 },
          hover: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, rotate: 0 },
        }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className="absolute inset-0"
        variants={{
          rest: { opacity: 0, scale: 0.92, rotate: 0 },
          hover: prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 },
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <FigmaMotionPortrait className="size-full" animated={!prefersReducedMotion} playOnHover />
      </motion.span>
    </span>
  );

  if (!linked) {
    return (
      <motion.span
        className="inline-flex rounded-full"
        variants={wrapperVariants}
        initial="rest"
        animate="rest"
        whileHover="hover"
        transition={SPRING}
      >
        {content}
      </motion.span>
    );
  }

  return (
    <motion.a
      href="/"
      aria-label="Ir para a home"
      className="inline-flex rounded-full"
      variants={wrapperVariants}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={TAP}
      transition={SPRING}
    >
      {content}
    </motion.a>
  );
}

function NavItem({ label, href, active = false }: { label: string; href: string; active?: boolean }) {
  return (
    <motion.a
      href={href}
      className="relative flex h-[28px] items-start justify-center rounded-[10px] px-3 py-1 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-muted"
      whileHover={{ y: -1, color: "var(--color-foreground)" }}
      whileTap={TAP}
      transition={SPRING}
    >
      {label}
      {active ? (
        <img loading="lazy" decoding="async"
          src={navState}
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 h-px w-2 -translate-x-1/2"
        />
      ) : null}
    </motion.a>
  );
}

function ThemeSwitcher({
  theme,
  onThemeChange,
}: {
  theme: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
}) {
  const posthog = usePostHog();
  const iconByTheme = {
    system: <SystemIcon />,
    light: <SunIcon />,
    dark: <MoonIcon />,
  };

  return (
    <div className="flex rounded-full border border-border bg-card p-1" aria-label="Selecionar tema">
      {themeOptions.map((option) => (
        <motion.button
          key={option.value}
          type="button"
          onClick={() => {
            trackEvent(posthog, "theme_changed", { theme: option.value, previous_theme: theme });
            onThemeChange(option.value);
          }}
          aria-label={option.label}
          title={option.label}
          className={`grid size-8 place-items-center rounded-full text-[13px] font-medium leading-[1.45] tracking-[-0.39px] transition-colors ${
            theme === option.value ? "bg-background text-foreground" : "text-muted"
          }`}
          whileHover={{ y: -1 }}
          whileTap={TAP}
          transition={SPRING}
        >
          {iconByTheme[option.value]}
        </motion.button>
      ))}
    </div>
  );
}

function LanguageSwitcher() {
  const { language, onLanguageChange } = useContext(LanguageContext);
  const posthog = usePostHog();
  const options: Array<{ value: LanguagePreference; label: string; flag: string }> = [
    { value: "pt-BR", label: "PT", flag: brFlag },
    { value: "en", label: "EN", flag: usFlag },
  ];

  return (
    <div className="flex rounded-full border border-border bg-card p-1" aria-label="Selecionar idioma">
      {options.map((option) => (
        <motion.button
          key={option.value}
          type="button"
          onClick={() => {
            trackEvent(posthog, "language_changed", { language: option.value, previous_language: language });
            onLanguageChange(option.value);
          }}
          aria-label={option.value === "pt-BR" ? "Usar português" : "Use English"}
          title={option.value === "pt-BR" ? "Português" : "English"}
          className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium leading-[1.45] tracking-[-0.24px] transition-colors ${
            language === option.value ? "bg-background text-foreground" : "text-muted"
          }`}
          whileHover={{ y: -1 }}
          whileTap={TAP}
          transition={SPRING}
        >
          <img src={option.flag} alt="" aria-hidden="true" className="size-4 shrink-0" />
          <span>{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

function PreferencesMenu({
  activePage,
  theme,
  onThemeChange,
}: {
  activePage: ActivePage;
  theme: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
}) {
  const { language } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navItems = [
    { key: "home", label: language === "en" ? "Home" : "Home", href: "/" },
    { key: "projects", label: language === "en" ? "Projects" : "Projetos", href: "/projetos/" },
    { key: "content", label: language === "en" ? "Content" : "Conteúdos", href: "/conteudos/" },
    { key: "about", label: language === "en" ? "About" : "Sobre", href: "/sobre/" },
  ] as const;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={language === "en" ? "Open preferences" : "Abrir preferências"}
        className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-card hover:text-foreground"
        whileHover={{ y: -1 }}
        whileTap={TAP}
        transition={SPRING}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5 stroke-current"
          fill="none"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-12 z-50 w-[264px] origin-top-right overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-[0_20px_60px_rgba(0,0,0,0.14)]"
          >
            <div className="flex flex-col gap-2 border-b border-border pb-2 xl:hidden">
              {navItems.map((item) => (
                <motion.a
                  key={item.key}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className={`flex min-h-11 items-center rounded-xl px-3 text-[15px] font-medium leading-[1.45] tracking-[-0.3px] transition-colors ${
                    activePage === item.key
                      ? "bg-background text-foreground"
                      : "text-muted hover:bg-background hover:text-foreground"
                  }`}
                  whileTap={TAP}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-border px-3 py-3">
              <span className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-card-foreground">
                {language === "en" ? "Theme" : "Tema"}
              </span>
              <ThemeSwitcher theme={theme} onThemeChange={onThemeChange} />
            </div>
            <div className="flex items-center justify-between gap-4 px-3 py-3">
              <span className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-card-foreground">
                {language === "en" ? "Language" : "Idioma"}
              </span>
              <LanguageSwitcher />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Header({
  activePage,
  theme,
  onThemeChange,
}: {
  activePage: ActivePage;
  theme: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
}) {
  const { language } = useContext(LanguageContext);
  const navLabels =
    language === "en"
      ? { home: "Home", projects: "Projects", content: "Content", about: "About", contact: "Contact" }
      : { home: "Home", projects: "Projetos", content: "Conteúdos", about: "Sobre", contact: "Contato" };

  return (
    <motion.header
      className="sticky top-0 z-40 flex w-full items-center justify-between bg-background/90 px-5 py-4 backdrop-blur-md lg:h-[88px] lg:px-10 lg:py-6 xl:px-20"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex min-w-0 flex-1 items-start px-[3px] py-0.5">
        <Logo linked />
      </div>

      <nav className="hidden shrink-0 items-center justify-center rounded-[14px] p-1 xl:flex">
        <div className="flex items-center justify-center gap-4 rounded-[44px]">
          <NavItem label={navLabels.home} href="/" active={activePage === "home"} />
          <NavItem label={navLabels.projects} href="/projetos/" active={activePage === "projects"} />
          <NavItem label={navLabels.content} href="/conteudos/" active={activePage === "content"} />
          <NavItem label={navLabels.about} href="/sobre/" active={activePage === "about"} />
          <NavItem label="Playground" href="/playground/" />
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 lg:gap-3">
        <motion.a
          href="/contato/"
          className="hidden rounded-[10px] border border-border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary lg:block"
          whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
          whileTap={TAP}
          transition={SPRING}
        >
          {navLabels.contact}
        </motion.a>
        <PreferencesMenu activePage={activePage} theme={theme} onThemeChange={onThemeChange} />
      </div>
    </motion.header>
  );
}

function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const { language } = useTranslation();

  return (
    <motion.section
      className="flex w-full flex-col items-center justify-center gap-8"
      initial={prefersReducedMotion ? false : "hidden"}
      animate="visible"
      variants={staggerChildren}
    >
      <motion.h1
        className="flex w-full max-w-[657px] flex-wrap items-baseline justify-center gap-x-2 text-center"
        variants={sectionReveal}
        transition={{ ...SPRING, delay: 0.08 }}
      >
        <span className="font-display text-[32px] font-medium leading-none tracking-[-1.6px] text-foreground sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
          {language === "en" ? "Hi, I'm" : "Olá, eu sou"}
        </span>
        <motion.span
          className="relative top-[2px] h-[36px] w-[65px] shrink-0 overflow-hidden rounded-[24px] sm:top-[3px] sm:h-[45px] sm:w-[81px] sm:rounded-[32px]"
          initial={prefersReducedMotion ? false : { scaleX: 0, opacity: 0, originX: 0.5 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ ...SPRING, delay: 0.2 }}
        >
          <img decoding="async" src={avatar} alt="" className="h-full w-full object-cover" />
        </motion.span>
        <em className="font-serif text-[32px] font-medium italic leading-none tracking-[-0.32px] text-foreground sm:text-[44px] sm:tracking-[-0.44px] lg:text-[56px] lg:tracking-[-0.56px]">
          Eduardo
        </em>
        <span className="font-display text-[32px] font-medium leading-none tracking-[-1.6px] text-foreground sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
          Product Designer
        </span>
      </motion.h1>
      <motion.p
        className="w-full text-center text-[16px] font-normal leading-[1.45] tracking-[-0.32px] text-muted"
        variants={sectionReveal}
        transition={{ ...SPRING, delay: 0.16 }}
      >
        {language === "en"
          ? "I help startups and companies build scalable software with a strong focus on design."
          : "Ajudo startups e empresas a criar software escalável com foco forte em design."}
      </motion.p>
    </motion.section>
  );
}

function Favicon() {
  return (
    <div className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-border">
      <img loading="lazy" decoding="async" src={faviconSymbol} alt="" className="size-4" />
    </div>
  );
}

function ProjectFavicon({ project }: { project: HomeProject }) {
  if (!project.icon) {
    return <Favicon />;
  }

  return (
    <div className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-background">
      <img loading="lazy" decoding="async" src={project.icon} alt="" className="h-full w-full object-cover" />
    </div>
  );
}

function ProjectCover({ project }: { project: HomeProject }) {
  if (project.id === "clinia") {
    return (
      <div className="relative h-full overflow-hidden rounded-[20px] bg-[#eef5ff]">
        <img loading="lazy" decoding="async" src={cliniaCover} alt="Clinia Plataforma" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }

  if (project.id === "talqui") {
    return (
      <div className="relative h-full overflow-hidden rounded-[20px] bg-[#49a8ff]">
        <img loading="lazy" decoding="async" src={talquiCover} alt="Talqui Plataforma" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }

  if (project.id === "petrobras") {
    return (
      <div className="relative h-full overflow-hidden rounded-[20px] bg-media">
        <img loading="lazy" decoding="async"
          src={petrobrasNossaEnergia}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top opacity-90"
        />
      </div>
    );
  }

  if (project.id === "orcamais") {
    return (
      <div className="relative h-full overflow-hidden rounded-[20px] bg-[#0b1220]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(245,158,11,0.32),transparent_30%),radial-gradient(circle_at_82%_74%,rgba(59,130,246,0.28),transparent_34%)]" />
        <div className="absolute left-8 top-8 flex h-14 items-center rounded-2xl border border-white/10 bg-white px-5 shadow-[0_20px_80px_rgba(0,0,0,0.2)]">
          <img loading="lazy" decoding="async" src={project.logo} alt="Orçamais" className="h-7 w-auto" />
        </div>
        <div className="absolute right-8 top-8 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-white backdrop-blur">
          Versare Lab
        </div>
        <div className="absolute left-8 right-8 top-[116px] rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="h-3 w-32 rounded-full bg-white/20" />
              <div className="mt-3 h-8 w-56 rounded-full bg-white/88" />
            </div>
            <div className="rounded-2xl bg-[#f59e0b] px-4 py-3 text-[18px] font-medium leading-none tracking-[-0.54px] text-[#1f1300]">
              AI
            </div>
          </div>
          <div className="grid grid-cols-[0.9fr_1.1fr] gap-4">
            <div className="rounded-2xl bg-white/12 p-4">
              <div className="mb-4 h-4 w-24 rounded-full bg-white/24" />
              {[72, 92, 58, 82].map((width) => (
                <div key={width} className="mb-3 h-3 rounded-full bg-white/18" style={{ width }} />
              ))}
            </div>
            <div className="space-y-3">
              {["Fundação", "Estrutura", "Acabamento"].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/88 px-4 py-3">
                  <div className="size-3 rounded-full bg-[#f59e0b]" />
                  <span className="text-[14px] font-medium tracking-[-0.42px] text-[#0b1220]">{item}</span>
                  <div className="ml-auto h-2 rounded-full bg-[#dbeafe]" style={{ width: `${60 + index * 22}px` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="absolute bottom-8 left-8 max-w-[360px] text-[44px] font-medium leading-none tracking-[-2.2px] text-white/10">
          GESTÃO DE OBRAS
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden rounded-[20px] bg-[#08080c]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,180,60,0.34),transparent_30%),radial-gradient(circle_at_78%_70%,rgba(30,144,255,0.28),transparent_36%)]" />
      <div className="absolute left-8 top-8 flex h-14 items-center rounded-2xl border border-white/10 bg-white px-5">
        <img loading="lazy" decoding="async" src={project.logo} alt="Grupo Primo" className="h-7 w-auto" />
      </div>
      <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-4">
        <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
          <p className="text-[44px] font-medium leading-none tracking-[-2.2px] text-white">Finclass</p>
          <p className="mt-3 text-[14px] leading-[1.45] tracking-[-0.42px] text-white/62">Educação financeira</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
          <p className="text-[44px] font-medium leading-none tracking-[-2.2px] text-white">Staage</p>
          <p className="mt-3 text-[14px] leading-[1.45] tracking-[-0.42px] text-white/62">Conteúdo e lançamentos</p>
        </div>
      </div>
      <p className="absolute right-8 top-[116px] text-right text-[48px] font-medium leading-none tracking-[-2.4px] text-white/10">
        EDTECH FINTECH
      </p>
    </div>
  );
}

function ProjectCard({ project }: { project: HomeProject }) {
  const { t, language } = useTranslation();
  const posthog = usePostHog();
  const Wrapper = project.href ? motion.a : motion.article;

  return (
    <Wrapper
      href={project.href}
      className="overflow-hidden rounded-[32px] border border-border p-2 will-change-transform lg:h-[562px]"
      variants={sectionReveal}
      whileHover={project.href ? { y: -6, borderColor: "var(--color-primary)" } : undefined}
      whileTap={project.href ? TAP : undefined}
      transition={SPRING}
      onClick={project.href ? () => trackEvent(posthog, "project_card_clicked", { project_id: project.id, project_title: project.title, href: project.href }) : undefined}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[24px] bg-card">
        <div className="media-outline relative h-[260px] shrink-0 overflow-hidden rounded-3xl bg-card p-1 sm:h-[360px] lg:h-[450px]">
          <motion.div
            className="h-full"
            whileHover={project.href ? { scale: 1.015 } : undefined}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProjectCover project={project} />
          </motion.div>
          
          {/* Top-to-bottom dark gradient to protect contrast of the top tags */}
          <div className="absolute inset-x-0 top-0 h-[80px] bg-gradient-to-b from-black/40 via-black/8 to-transparent pointer-events-none z-10" />

          <div className="absolute left-4 top-4 z-10 rounded-full border border-white/8 bg-black/40 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white/90 backdrop-blur-md">
            {language === "en" ? (project.tagsEn?.[0] ?? project.tags[0]) : project.tags[0]}
          </div>
          <div className="absolute right-4 top-4 z-10 rounded-full border border-white/8 bg-black/40 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white/90 backdrop-blur-md">
            {language === "en" ? (project.tagsEn?.[1] ?? project.tags[1]) : project.tags[1]}
          </div>
        </div>

        <div className="flex w-full gap-4 rounded-b-[24px] bg-card px-5 pb-5 pt-4">
          <ProjectFavicon project={project} />
          <div className="flex min-w-0 flex-1 flex-col gap-2 leading-[1.45]">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-[18px] font-medium leading-[1.45] tracking-[-0.54px] text-card-foreground lg:text-[20px] lg:tracking-[-0.6px]">
                {project.title}
              </h2>
              {project.href ? (
                <span className="shrink-0 pt-1 text-[14px] leading-[1.45] tracking-[-0.42px] text-primary">
                  {t.seeProjects}
                </span>
              ) : null}
            </div>
            <p className="overflow-hidden text-[15px] font-normal leading-[1.45] tracking-[-0.30px] text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] lg:text-[16px] lg:tracking-[-0.32px]">
              {language === "en" ? (project.descriptionEn ?? project.description) : project.description}
            </p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

function Footer() {
  return (
    <footer className="flex w-full flex-col items-center gap-4 px-5 py-6 lg:h-[88px] lg:flex-row lg:justify-between lg:px-20">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {socialLinks.map((item) => (
          <motion.a
            href={item.href}
            key={item.label}
            target="_blank"
            rel="noreferrer"
            className="rounded-[10px] px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-muted"
            whileHover={{ y: -1, color: "var(--color-foreground)" }}
            whileTap={TAP}
            transition={SPRING}
          >
            {item.label}
          </motion.a>
        ))}
      </div>

      <Logo className="shrink-0" />

      <div className="flex justify-center px-4 py-2 lg:min-w-[300px] lg:justify-end">
        <p className="whitespace-nowrap text-[14px] font-normal leading-[1.45] tracking-[-0.42px] text-muted">
          Copyright Eduardo Amaral © 2026
        </p>
      </div>
    </footer>
  );
}

type PageProps = {
  theme: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
};

function HomePage({
  theme,
  onThemeChange,
  homeProjects = projects,
}: PageProps & { homeProjects?: HomeProject[] }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <Header activePage="home" theme={theme} onThemeChange={onThemeChange} />
      <div className="flex w-full flex-col gap-10 p-5 lg:gap-20 lg:p-20">
        <Hero />
        <motion.section
          id="projetos"
          className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-12% 0px" }}
          variants={staggerChildren}
        >
          {homeProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </motion.section>
      </div>
      <Footer />
    </>
  );
}

function SectionLabel({ children, sticky = false }: { children: string; sticky?: boolean }) {
  return (
    <p
      className={[
        "text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary",
        sticky ? "sticky top-[72px] z-20 w-fit rounded-xl bg-background/88 px-2 py-1 backdrop-blur-md lg:top-[112px]" : "",
      ].join(" ")}
    >
      {children}
    </p>
  );
}

function CvDropdownButton({ language }: { language: "en" | "pt-BR" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const posthog = usePostHog();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buttonLabel = language === "en" ? "Download CV" : "Baixar CV";
  const ptLabel = language === "en" ? "Portuguese version" : "Versão em português";
  const enLabel = language === "en" ? "English version" : "Versão em inglês";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2.5 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary cursor-pointer hover:border-primary transition-colors"
        whileHover={{ y: -1 }}
        whileTap={TAP}
        transition={SPRING}
      >
        <IconlyDownload size={16} />
        <span>{buttonLabel}</span>
        <svg
          viewBox="0 0 24 24"
          className={["size-4 stroke-current transition-transform duration-200", isOpen ? "rotate-180" : ""].join(" ")}
          fill="none"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute left-0 mt-2 w-max min-w-[12rem] origin-top-left rounded-xl border border-border bg-card p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.12)] z-30"
        >
          <a
            href="/cv/pt/"
            target="_blank"
            className="flex w-full items-center gap-2.5 whitespace-nowrap rounded-[8px] px-3 py-2 text-left text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-foreground hover:bg-[#fafafa] dark:hover:bg-[#08080c] transition-colors"
            onClick={() => { trackEvent(posthog, "cv_downloaded", { cv_language: "pt-BR" }); setIsOpen(false); }}
          >
            <img src={brFlag} alt="" aria-hidden="true" className="size-[18px] shrink-0" />
            <span>{ptLabel}</span>
          </a>
          <a
            href="/cv/en/"
            target="_blank"
            className="flex w-full items-center gap-2.5 whitespace-nowrap rounded-[8px] px-3 py-2 text-left text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-foreground hover:bg-[#fafafa] dark:hover:bg-[#08080c] transition-colors"
            onClick={() => { trackEvent(posthog, "cv_downloaded", { cv_language: "en" }); setIsOpen(false); }}
          >
            <img src={usFlag} alt="" aria-hidden="true" className="size-[18px] shrink-0" />
            <span>{enLabel}</span>
          </a>
        </motion.div>
      )}
    </div>
  );
}

function CvPrintPage({ lang }: { lang: "pt" | "en" }) {
  const t = {
    pt: {
      print: "Imprimir / Salvar PDF",
      back: "Voltar para o Portfólio",
      role: "Senior Product Designer",
      profile: "Perfil Profissional",
      skills: "Competências & Ferramentas",
      experience: "Experiência Profissional",
      education: "Formação Acadêmica & Cursos",
      contact: "Contato",
      aboutText: "Product Designer Sênior com mais de 6 anos de experiência transformando desafios complexos em soluções digitais intuitivas e centradas no usuário. Possuo uma abordagem versátil e ponta a ponta (end-to-end), cobrindo desde a etapa de descoberta (discovery) e pesquisa de UX até a criação de Design Systems avançados, desenvolvimento sem código (Webflow/Framer) e implementação técnica de frontend integrada a fluxos de Inteligência Artificial.",
    },
    en: {
      print: "Print / Save PDF",
      back: "Back to Portfolio",
      role: "Senior Product Designer",
      profile: "Professional Profile",
      skills: "Skills & Tools",
      experience: "Professional Experience",
      education: "Education & Training",
      contact: "Contact",
      aboutText: "Senior Product Designer with 6+ years of experience turning complex challenges into intuitive, user-centered digital solutions. Possess a highly versatile, end-to-end approach, covering everything from UX research and discovery to advanced Design Systems, no-code development (Framer/Webflow), and frontend technical implementation integrated with modern AI workflows.",
    }
  }[lang];

  const cvExps = lang === "pt" ? [
    {
      role: "Senior Product Designer",
      company: "Clinia",
      period: "2024 - Presente",
      description: "Design de produto para saúde digital, conduzindo pesquisas de UX, testes de usabilidade, criação de interfaces escaláveis e design systems baseados em shadcn. Integração com ferramentas de inteligência artificial no fluxo de trabalho técnico de frontend."
    },
    {
      role: "Fundador / Product Designer",
      company: "Versare Design",
      period: "2023 - Presente",
      description: "Liderança de estúdio de produto digital end-to-end, gerenciando discovery, UX/UI, sites em Framer e desenvolvimento de plataformas web/mobile inteligentes com IA. Mais de 80 projetos entregues."
    },
    {
      role: "Senior UX Designer",
      company: "Brivia",
      period: "2022",
      description: "Redesign do portal da Petrobras com design system aplicado a mais de 100 páginas de conteúdos editoriais. Prototipação funcional para a Escola de Influenciadores do Banco do Brasil."
    },
    {
      role: "Product Designer",
      company: "Grupo Primo",
      period: "2021 - 2022",
      description: "Design de produto para edtechs e finanças (Finclass, Staage, Staart). Condução de co-criação, prototipagem ágil, estruturação de componentes no Figma e acompanhamento de entrega técnica."
    }
  ] : [
    {
      role: "Senior Product Designer",
      company: "Clinia",
      period: "2024 - Present",
      description: "Product design for digital health, including UX research, usability testing, scalable interfaces, and shadcn-based design systems. Integrated AI-powered workflows into frontend development pipelines."
    },
    {
      role: "Founder / Product Designer",
      company: "Versare Design",
      period: "2023 - Present",
      description: "Led a product studio delivering discovery, end-to-end design, Framer websites, and AI platforms. Managed design pipelines for 80+ projects with exceptional satisfaction."
    },
    {
      role: "Senior UX Designer",
      company: "Brivia",
      period: "2022",
      description: "Directed the Petrobras portal redesign with design system patterns scaled across 100+ pages. Prototyped the Escola de Influenciadores platform for Banco do Brasil."
    },
    {
      role: "Product Designer",
      company: "Grupo Primo",
      period: "2021 - 2022",
      description: "Created tech education and finance products (Finclass, Staage, Staart). Facilitated co-creation, rapid prototyping, component structures in Figma, and frontend handoff."
    }
  ];

  const cvCourses = lang === "pt" ? [
    "Product Design: Design Circuit, UX Unicórnio",
    "UI Design: UI Boost, UI Expert"
  ] : [
    "Product Design: Design Circuit, UX Unicórnio",
    "UI Design: UI Boost, UI Expert"
  ];

  const cvSkills = lang === "pt" ? [
    "UX/UI Design",
    "Design Systems",
    "Framer Development",
    "AI Workflows",
    "Figma MCP",
    "Cursor",
    "Claude",
    "Teste de Usabilidade",
    "Discovery",
    "Delivery",
    "Design Tokens",
    "Interaction Design"
  ] : [
    "UX/UI Design",
    "Design Systems",
    "Framer Development",
    "AI Workflows",
    "Figma MCP",
    "Cursor",
    "Claude",
    "Usability Testing",
    "Discovery",
    "Delivery",
    "Design Tokens",
    "Interaction Design"
  ];

  const cvContact = [
    { label: lang === "pt" ? "Local" : "Location", value: lang === "pt" ? "Maringá, PR - Brasil" : "Maringá, PR - Brazil" },
    { label: "Email", value: "oi@eduardoamaral.me", href: "mailto:oi@eduardoamaral.me" },
    { label: "LinkedIn", value: "linkedin.com/in/eduardooamaral", href: "https://www.linkedin.com/in/eduardooamaral/" },
    { label: "Web", value: "eduardoamaral.me", href: "https://eduardoamaral.me" },
  ];

  return (
    <div className="cv-page min-h-screen w-full bg-[#fafafa] px-6 py-8 font-sans text-[#08080c] selection:bg-black/10 sm:px-12 md:px-24 md:py-16 print:bg-white print:p-0 print:text-black">
      {/* Action Bar (hidden when printing) */}
      <div className="cv-action-bar flex items-center justify-between pb-6 print:hidden">
        <a
          href="/sobre/"
          className="inline-flex items-center gap-1.5 whitespace-nowrap text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-[#636374] transition-colors hover:text-[#08080c]"
        >
          <svg viewBox="0 0 24 24" className="size-4 stroke-current" fill="none" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          {t.back}
        </a>
        <button
          onClick={() => window.print()}
          className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border border-border bg-card px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary transition-colors hover:border-primary"
        >
          <IconlyPrinter size={18} />
          {t.print}
        </button>
      </div>

      {/* Main CV Layout */}
      <div className="cv-sheet-wrap rounded-[24px] px-0 py-6 sm:p-12 print:p-0">
      <div className="cv-sheet mx-auto flex max-w-[800px] flex-col gap-10 rounded-[16px] bg-white p-8 shadow-[0_8px_8px_rgba(8,8,12,0.02)] sm:p-12 lg:p-16 print:gap-8 print:rounded-none print:p-0 print:shadow-none">
        {/* Header Section */}
        <div className="cv-header flex flex-col gap-5 border-b border-[#e8e8ee] pb-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-display text-[36px] font-medium leading-none tracking-[-1.8px] text-[#08080c] sm:text-[44px] sm:tracking-[-2.2px]">
              Eduardo Amaral
            </h1>
            <p className="text-[14px] font-medium uppercase leading-[1.45] tracking-[0.12em] text-[#08080c] sm:text-right">
              {t.role}
            </p>
          </div>
          <div className="grid gap-2 text-[13px] leading-[1.45] tracking-[-0.26px] text-[#636374] sm:grid-cols-2">
            {cvContact.map((item) => {
              const content = (
                <>
                  <span className="min-w-[58px] text-[11px] font-medium uppercase tracking-[0.12em] text-[#9c9caf]">
                    {item.label}
                  </span>
                  <span className="text-[#636374]">{item.value}</span>
                </>
              );
              return item.href ? (
                <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined} className="flex items-baseline gap-2 transition-colors hover:text-[#08080c]">
                  {content}
                </a>
              ) : (
                <span key={item.label} className="flex items-baseline gap-2">
                  {content}
                </span>
              );
            })}
          </div>
        </div>

        {/* Profile Section */}
        <section className="cv-section flex flex-col gap-3">
          <h2 className="cv-section-title border-b border-[#f3f3f6] pb-1.5 text-[12px] font-medium uppercase leading-[1.45] tracking-[0.14em] text-[#9c9caf]">
            {t.profile}
          </h2>
          <p className="text-[15px] font-normal leading-[1.65] tracking-[-0.3px] text-[#363642]">
            {t.aboutText}
          </p>
        </section>

        {/* Skills Section */}
        <section className="cv-section flex flex-col gap-3">
          <h2 className="cv-section-title border-b border-[#f3f3f6] pb-1.5 text-[12px] font-medium uppercase leading-[1.45] tracking-[0.14em] text-[#9c9caf]">
            {t.skills}
          </h2>
          <div className="flex flex-wrap gap-2 pt-1">
            {cvSkills.map(skill => (
              <span key={skill} className="cv-skill rounded-full border border-[#e8e8ee] px-2.5 py-1 text-[12px] font-medium leading-[1.5] tracking-[-0.26px] text-[#363642]">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className="cv-section flex flex-col gap-3">
          <h2 className="cv-section-title border-b border-[#f3f3f6] pb-1.5 text-[12px] font-medium uppercase leading-[1.45] tracking-[0.14em] text-[#9c9caf]">
            {t.experience}
          </h2>
          <div className="flex flex-col gap-6">
            {cvExps.map(exp => (
              <article key={exp.company + exp.role} className="cv-experience flex flex-col gap-1.5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 className="text-[17px] font-medium leading-[1.25] tracking-[-0.51px] text-[#08080c]">
                    {exp.role} <span className="font-normal text-[#636374]">@ {exp.company}</span>
                  </h3>
                  <span className="shrink-0 text-[13px] font-medium leading-[1.45] tracking-[-0.26px] text-[#636374]">
                    {exp.period}
                  </span>
                </div>
                <p className="text-[14px] font-normal leading-[1.55] tracking-[-0.28px] text-[#636374]">
                  {exp.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="cv-section flex flex-col gap-3">
          <h2 className="cv-section-title border-b border-[#f3f3f6] pb-1.5 text-[12px] font-medium uppercase leading-[1.45] tracking-[0.14em] text-[#9c9caf]">
            {t.education}
          </h2>
          <ul className="flex list-none flex-col gap-2 text-[14px] font-normal leading-[1.55] tracking-[-0.28px] text-[#636374]">
            {cvCourses.map((course, idx) => (
              <li key={idx}>
                {course}
              </li>
            ))}
          </ul>
        </section>
      </div>
      </div>
    </div>
  );
}

function AboutPage({ theme, onThemeChange }: PageProps) {
  const prefersReducedMotion = useReducedMotion();
  const { language } = useTranslation();
  const highlights = language === "en" ? aboutHighlightsEn : aboutHighlights;
  const stats = language === "en" ? aboutStatsEn : aboutStats;
  const socialProof = language === "en" ? testimonialsEn : testimonials;
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const activeTestimonial = socialProof[testimonialIndex];
  const testimonialAuthorInitials = activeTestimonial.author
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  const exps = language === "en" ? experiencesEn : experiences;
  const goToPreviousTestimonial = () => {
    setTestimonialIndex((current) => (current === 0 ? socialProof.length - 1 : current - 1));
  };
  const goToNextTestimonial = () => {
    setTestimonialIndex((current) => (current + 1) % socialProof.length);
  };

  return (
    <>
      <Header activePage="about" theme={theme} onThemeChange={onThemeChange} />
      <motion.div
        className="flex w-full flex-col gap-12 p-6 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_360px] lg:items-center lg:gap-8" variants={sectionReveal}>
          <div className="flex flex-col items-start gap-8">
            <SectionLabel>{language === "en" ? "About" : "Sobre"}</SectionLabel>
            <h1 className="max-w-[490px] font-display text-[40px] font-medium leading-none tracking-[-2px] text-foreground sm:text-[48px] sm:tracking-[-2.4px] lg:text-[56px] lg:tracking-[-2.8px]">
              <span className="block">Crafting</span>
              <span className="block">Excepcional</span>
              <span className="block">Designs</span>
            </h1>
            <p className="max-w-[420px] text-[18px] leading-[1.45] tracking-[-0.36px] text-muted">
              {language === "en"
                ? "My point of view connects product, craft, and scale to create consistent digital experiences."
                : "Minha visão conecta produto, craft e escala para criar experiências digitais consistentes."}
            </p>
            <CvDropdownButton language={language} />
          </div>
          <motion.div
            className="w-full overflow-hidden rounded-[32px] border border-border bg-card p-2"
          >
            <div className="aspect-square overflow-hidden rounded-[24px] bg-media">
              <img loading="lazy" decoding="async"
                src={avatar}
                alt="Eduardo Amaral"
                className="h-full w-full object-cover object-[50%_34%]"
              />
            </div>
          </motion.div>
        </motion.section>

        <motion.section className="flex flex-col gap-8 border-t border-border pt-10" variants={sectionReveal}>
          <SectionLabel>{language === "en" ? "Overview" : "Resumo"}</SectionLabel>
          <div className="grid grid-cols-1 gap-0.5 bg-card sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <motion.p
                key={item}
                className="rounded-md bg-background p-4 text-[18px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                variants={sectionReveal}
              >
                {item}
              </motion.p>
            ))}
          </div>
        </motion.section>

        <motion.section className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20" variants={sectionReveal}>
          <SectionLabel>{language === "en" ? "Impact" : "Impacto"}</SectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <motion.div
                key={item.label}
                className="p-6"
                variants={sectionReveal}
              >
                <p className="font-display text-[32px] font-medium leading-none tracking-[-1.6px] text-card-foreground tabular-nums lg:text-[48px] lg:tracking-[-2.4px]">
                  {item.value}
                </p>
                <p className="mt-2 text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          variants={sectionReveal}
        >
          <div className="flex flex-col gap-4">
            <SectionLabel>{language === "en" ? "Companies" : "Empresas"}</SectionLabel>
            <h2 className="max-w-[320px] text-[28px] font-medium leading-[1.1] tracking-[-1.4px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "Companies that know my work" : "Empresas que conhecem meu trabalho"}
            </h2>
          </div>
          <div className="about-companies-grid grid grid-cols-2 gap-0.5 bg-card sm:grid-cols-3 lg:grid-cols-5">
            {knownCompanies.map((company) => (
              <motion.a
                key={company.name}
                href={company.href}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-[104px] flex-col justify-between rounded-md bg-background p-4 transition-colors hover:bg-card"
                variants={sectionReveal}
                whileHover={{ y: -2 }}
                whileTap={TAP}
                transition={SPRING}
              >
                {company.logoLight || company.logoDark ? (
                  <span className="flex h-9 items-center">
                    <img loading="lazy" decoding="async"
                      src={company.logoLight}
                      alt=""
                      className="about-logo-light size-9 rounded-lg object-contain object-left"
                    />
                    <img loading="lazy" decoding="async"
                      src={company.logoDark}
                      alt=""
                      className="about-logo-dark size-9 rounded-lg object-contain object-left"
                    />
                  </span>
                ) : company.logo ? (
                  <span className="flex h-9 items-center">
                    <img loading="lazy" decoding="async"
                      src={company.logo}
                      alt=""
                      className="size-9 rounded-lg object-contain object-left"
                    />
                  </span>
                ) : (
                  <span className="grid size-9 place-items-center rounded-xl border border-border bg-background text-[13px] font-medium leading-none text-primary">
                    {company.name.slice(0, 2)}
                  </span>
                )}
                <span className="text-[14px] font-medium leading-[1.25] tracking-[-0.28px] text-card-foreground">
                  {company.name}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          variants={sectionReveal}
        >
          <div className="flex flex-col gap-4">
            <SectionLabel>{language === "en" ? "Testimonials" : "Depoimentos"}</SectionLabel>
            <h2 className="max-w-[320px] text-[28px] font-medium leading-[1.1] tracking-[-1.4px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "What people say about working with me" : "O que falam sobre trabalhar comigo"}
            </h2>
          </div>

          <div className="flex flex-col items-center gap-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={`${activeTestimonial.author}-${language}`}
                className="flex min-h-[420px] w-full flex-col justify-between rounded-3xl bg-card p-6 sm:p-8"
                initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, x: -24 }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="flex min-h-10 items-center">
                  {activeTestimonial.companyLogo || activeTestimonial.companyIconUrl ? (
                    <a href={activeTestimonial.companyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={activeTestimonial.companyLogo || activeTestimonial.companyIconUrl}
                        alt={activeTestimonial.company || ""}
                        className="size-10 rounded-lg object-contain object-left"
                      />
                      <span className="text-[14px] font-medium leading-none tracking-[-0.42px] text-card-foreground">
                        {activeTestimonial.company}
                      </span>
                    </a>
                  ) : (
                    <span className="text-[14px] font-medium leading-none tracking-[-0.42px] text-card-foreground">
                      {activeTestimonial.company}
                    </span>
                  )}
                </div>

                <blockquote className="max-w-[540px] py-8 text-[20px] font-medium leading-[1.4] tracking-[-0.6px] text-card-foreground lg:text-[22px] lg:tracking-[-0.66px]">
                  {activeTestimonial.quote}
                </blockquote>

                <figcaption className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-background text-[13px] font-medium leading-none tracking-[-0.39px] text-card-foreground">
                    {testimonialAuthorInitials}
                  </span>
                  <span className="text-[16px] font-medium leading-[1.2] tracking-[-0.48px] text-card-foreground lg:text-[18px] lg:tracking-[-0.54px]">
                    {activeTestimonial.author}
                    <span className="mt-1 block text-[14px] font-normal leading-[1.45] tracking-[-0.28px] text-muted">
                      {activeTestimonial.role}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            <div className="flex items-center gap-4">
              <motion.button
                type="button"
                onClick={goToPreviousTestimonial}
                aria-label={language === "en" ? "Previous testimonial" : "Depoimento anterior"}
                className="grid size-12 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-card"
                whileTap={TAP}
                transition={SPRING}
              >
                <svg viewBox="0 0 24 24" className="size-5 stroke-current" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </motion.button>
              <motion.button
                type="button"
                onClick={goToNextTestimonial}
                aria-label={language === "en" ? "Next testimonial" : "Próximo depoimento"}
                className="grid size-12 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-card"
                whileTap={TAP}
                transition={SPRING}
              >
                <svg viewBox="0 0 24 24" className="size-5 stroke-current" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          variants={sectionReveal}
        >
          <div className="flex flex-col gap-4">
            <SectionLabel>{language === "en" ? "Experience" : "Experiência"}</SectionLabel>
            <h2 className="max-w-[320px] text-[28px] font-medium leading-[1.1] tracking-[-1.4px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "A little about my professional journey" : "Um pouco da minha trajetória profissional"}
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {exps.map((item) => (
              <motion.article
                key={`${item.role}-${item.company}`}
                className="flex flex-col gap-4 sm:grid sm:grid-cols-[260px_1fr] sm:gap-20"
                variants={sectionReveal}
              >
                <div>
                  <h2 className="text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground">
                    {item.role}
                  </h2>
                  <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                    {item.company}
                  </p>
                </div>
                <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                  {item.meta}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

      </motion.div>
      <Footer />
    </>
  );
}

function VideoCard({ video, featured = false }: { video: (typeof youtubeVideos)[number]; featured?: boolean }) {
  const { t } = useTranslation();
  const posthog = usePostHog();
  const href = `https://www.youtube.com/watch?v=${video.id}`;

  if (featured) {
    const handleMobileCardOpen = (event: MouseEvent<HTMLElement>) => {
      if (window.matchMedia("(min-width: 1024px)").matches) return;
      if ((event.target as HTMLElement).closest("a")) return;
      window.open(href, "_blank", "noreferrer");
      trackEvent(posthog, "youtube_video_clicked", { video_id: video.id, video_title: video.title, featured: true, source: "mobile_card" });
    };

    return (
      <motion.article
        className="featured-video-card flex cursor-pointer flex-col gap-4 rounded-[32px] border border-border bg-card p-2 lg:grid lg:cursor-default lg:grid-cols-2 lg:gap-4"
        variants={sectionReveal}
        role="link"
        tabIndex={0}
        onClick={handleMobileCardOpen}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          if (window.matchMedia("(min-width: 1024px)").matches) return;
          window.open(href, "_blank", "noreferrer");
          trackEvent(posthog, "youtube_video_clicked", { video_id: video.id, video_title: video.title, featured: true, source: "mobile_card_keyboard" });
        }}
      >
        <div className="media-outline aspect-video overflow-hidden rounded-[24px] bg-[light-dark(#eeeeee,#24242e)]">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${video.id}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="featured-video-copy flex flex-col justify-center gap-8 p-4">
          <div className="featured-video-content flex flex-col gap-4">
            <SectionLabel>{t.latestVideo}</SectionLabel>
            <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-card-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {video.title}
            </h2>
          </div>
          <motion.a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="hidden w-fit rounded-[10px] border border-border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary lg:inline-flex"
            whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
            whileTap={TAP}
            transition={SPRING}
            onClick={() => trackEvent(posthog, "youtube_video_clicked", { video_id: video.id, video_title: video.title, featured: true })}
          >
            {t.watchOnYoutube}
          </motion.a>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={video.title}
      className="group media-outline aspect-video overflow-hidden rounded-2xl bg-[light-dark(#eeeeee,#24242e)]"
      variants={sectionReveal}
      whileHover={{ y: -4 }}
      whileTap={TAP}
      transition={SPRING}
      onClick={() => trackEvent(posthog, "youtube_video_clicked", { video_id: video.id, video_title: video.title, featured: false })}
    >
      <img
        loading="lazy"
        decoding="async"
        src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
        alt=""
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
      />
    </motion.a>
  );
}

function SocialFeedCard({ item }: { item: (typeof socialFeedSections)[number] }) {
  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="group flex min-h-[260px] flex-col justify-between rounded-3xl border border-border bg-card p-6"
      variants={sectionReveal}
      whileHover={{ y: -5, borderColor: "var(--color-primary)" }}
      whileTap={TAP}
      transition={SPRING}
    >
      <div className="flex items-start justify-between gap-6">
        <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
          {item.handle}
        </p>
        <span className="rounded-full border border-border px-3 py-1 text-[14px] leading-[1.45] tracking-[-0.42px] text-muted">
          {item.status}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-card-foreground lg:text-[32px] lg:tracking-[-1.6px]">
          {item.title}
        </h2>
        <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
          {item.description}
        </p>
        <span className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
          {item.cta}
        </span>
      </div>
    </motion.a>
  );
}

function SocialIcon({ icon }: { icon: (typeof contentLinks)[number]["icon"] }) {
  if (icon === "youtube") {
    return <IconlyYoutube size={20} />;
  }

  if (icon === "instagram") {
    return <IconlyInstagram size={20} />;
  }

  if (icon === "spotify") {
    return <IconlySpotify size={20} />;
  }

  return <IconlyLinkedin size={20} />;
}

function BioSocialIcon({ icon }: { icon: BioIconName }) {
  if (icon === "youtube") return <IconlyYoutube size={19} />;
  if (icon === "instagram") return <IconlyInstagram size={19} />;
  if (icon === "linkedin") return <IconlyLinkedin size={19} />;
  if (icon === "dribbble") return <IconlyDribbble size={19} />;
  if (icon === "spotify") return <IconlySpotify size={19} />;
  if (icon === "whatsapp") return <IconlyWhatsapp size={19} />;
  return null;
}

function BioLinkCard({ item }: { item: BioLink }) {
  const posthog = usePostHog();
  const hasMedia = "image" in item || "videoId" in item;
  const isFeatured = item.kind === "featured";
  const isWide = item.kind === "wide";

  return (
    <motion.a
      href={item.href}
      target={item.href.startsWith("http") ? "_blank" : undefined}
      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
      className={[
        "group bio-card flex min-h-[132px] overflow-hidden rounded-[22px] border border-border bg-card text-card-foreground shadow-[0_1px_2px_rgb(8_8_12_/_0.04)]",
        isFeatured ? "col-span-full min-h-[268px] flex-col" : "",
        isWide ? "col-span-full sm:col-span-7" : "",
        item.kind === "video" ? "sm:col-span-5 sm:flex-col" : "",
        item.kind === "social" ? "sm:col-span-4" : "",
        item.kind === "compact" ? "sm:col-span-6" : "",
        !hasMedia ? "p-4" : "",
      ].join(" ")}
      whileHover={{ y: -4, borderColor: "var(--color-primary)" }}
      whileTap={TAP}
      transition={SPRING}
      onClick={() => trackEvent(posthog, "bio_link_clicked", { label: item.title, href: item.href })}
    >
      {"image" in item ? (
        <div className={isFeatured ? "h-[150px] overflow-hidden bg-[light-dark(#eeeeee,#24242e)]" : "w-[42%] overflow-hidden bg-[light-dark(#eeeeee,#24242e)]"}>
          <img
            src={item.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          />
        </div>
      ) : null}
      {"videoId" in item ? (
        <div className="relative w-[45%] overflow-hidden bg-[light-dark(#eeeeee,#24242e)] sm:h-[132px] sm:w-full">
          <img
            src={`https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          />
          <span className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full bg-white text-[#ff0033] shadow-[0_10px_30px_rgb(8_8_12_/_0.18)]">
            <IconlyYoutube size={18} />
          </span>
        </div>
      ) : null}
      <div className={["flex min-w-0 flex-1 flex-col justify-between gap-5", hasMedia ? "p-4" : ""].join(" ")}>
        <div className="flex items-start justify-between gap-4">
          {"icon" in item ? (
            <span className="grid size-10 shrink-0 place-items-center rounded-[14px] border border-border bg-background text-primary">
              <BioSocialIcon icon={item.icon} />
            </span>
          ) : null}
          <span className="ml-auto text-[13px] font-medium leading-[1.2] tracking-[-0.26px] text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Abrir
          </span>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <h2 className="text-[17px] font-medium leading-[1.1] tracking-[-0.51px] text-card-foreground">
            {item.title}
          </h2>
          <p className="line-clamp-2 text-[14px] leading-[1.35] tracking-[-0.28px] text-muted">
            {item.description}
          </p>
          <p className="truncate text-[13px] leading-[1.35] tracking-[-0.26px] text-neutral-400">
            {item.domain}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

function BioPage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="bio-page min-h-svh w-full bg-background px-4 pb-16 pt-7 text-foreground sm:px-6 sm:pt-10">
      <div className="mx-auto flex w-full max-w-[620px] flex-col gap-4">
        <motion.section
          className="overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_1px_2px_rgb(8_8_12_/_0.04)]"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bio-cover relative h-[166px] overflow-hidden bg-[light-dark(#eeeeee,#24242e)]">
            <img src={bioVersareCover} alt="" className="bio-cover-image h-full w-full object-cover" decoding="async" fetchPriority="high" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(8_8_12_/_0)_48%,rgb(8_8_12_/_0.16)_100%)]" />
          </div>
          <div className="flex flex-col gap-6 px-5 pb-6 pt-0 sm:px-7">
            <div className="-mt-11 flex items-end justify-between gap-4">
              <FigmaMotionPortrait className="size-[88px] border-4 border-card shadow-[0_16px_44px_rgb(8_8_12_/_0.16)]" animated={!prefersReducedMotion} eager />
              <motion.button
                type="button"
                className="mb-4 grid size-11 place-items-center rounded-[14px] border border-border bg-card text-primary shadow-[0_10px_28px_rgb(8_8_12_/_0.10)]"
                aria-label="Compartilhar página"
                whileHover={{ y: -2 }}
                whileTap={TAP}
                transition={SPRING}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: "Eduardo Amaral", url: "https://eduardoamaral.me/bio/" });
                  } else {
                    navigator.clipboard?.writeText("https://eduardoamaral.me/bio/");
                  }
                }}
              >
                <IconlySendMessage size={18} />
              </motion.button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <h1 className="text-[28px] font-medium leading-none tracking-[-1.4px] text-card-foreground">
                  Eduardo Amaral
                </h1>
                <p className="max-w-[470px] text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                  Senior Product Designer. UX/UI, Design Systems, IA aplicada ao design e produtos digitais.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {bioLinks.filter((item): item is Extract<BioLink, { icon: BioIconName }> => "icon" in item).slice(0, 5).map((item) => (
                  <motion.a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.title}
                    className="grid h-10 min-w-12 place-items-center rounded-[14px] border border-border bg-background px-3 text-primary"
                    whileHover={{ y: -2, borderColor: "var(--color-primary)" }}
                    whileTap={TAP}
                    transition={SPRING}
                  >
                    <BioSocialIcon icon={item.icon} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="grid grid-cols-1 gap-4 sm:grid-cols-12"
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          variants={staggerChildren}
        >
          {bioLinks.map((item) => (
            <BioLinkCard key={item.title} item={item} />
          ))}
        </motion.section>
      </div>
    </div>
  );
}

function StyleguidePage({ theme, onThemeChange }: PageProps) {
  const prefersReducedMotion = useReducedMotion();
  const { language } = useTranslation();
  const colorTokens = [
    { name: "Background", token: "--background", className: "bg-background" },
    { name: "Foreground", token: "--foreground", className: "bg-foreground" },
    { name: "Card", token: "--card", className: "bg-card" },
    { name: "Primary", token: "--primary-foreground", className: "bg-primary" },
    { name: "Muted", token: "--muted-foreground", className: "bg-muted" },
    { name: "Border", token: "--border", className: "bg-border" },
  ];
  const componentSamples = [
    language === "en" ? "Product Design" : "Design de Produto",
    "UX/UI",
    "Design System",
    language === "en" ? "AI for UX" : "Design com IA",
  ];
  const typographyScale = [
    { name: "Display", className: "text-[32px] lg:text-[56px]", tracking: "-1.6px / -2.8px", leading: "1", sample: "Crafting Excepcional Design" },
    { name: "Section title", className: "text-[22px] lg:text-[32px]", tracking: "-1.1px / -1.6px", leading: "1", sample: language === "en" ? "Projects and cases" : "Projetos e cases" },
    { name: "Card title", className: "text-[22px] lg:text-[32px]", tracking: "-1.1px / -1.6px", leading: "1", sample: "Design System" },
    { name: "Body large", className: "text-[18px]", tracking: "-0.36px", leading: "1.45", sample: language === "en" ? "Clear writing for product stories." : "Escrita clara para histórias de produto." },
    { name: "Body", className: "text-[16px]", tracking: "-0.32px", leading: "1.45", sample: language === "en" ? "Context, process and decisions." : "Contexto, processo e decisões." },
    { name: "Caption", className: "text-[14px]", tracking: "-0.42px", leading: "1.45", sample: language === "en" ? "Small label" : "Rótulo pequeno" },
  ];
  const spacingScale = [
    { name: "1", value: "4px", className: "w-1" },
    { name: "2", value: "8px", className: "w-2" },
    { name: "3", value: "12px", className: "w-3" },
    { name: "4", value: "16px", className: "w-4" },
    { name: "5", value: "20px", className: "w-5" },
    { name: "6", value: "24px", className: "w-6" },
    { name: "8", value: "32px", className: "w-8" },
    { name: "10", value: "40px", className: "w-10" },
    { name: "20", value: "80px", className: "w-20" },
  ];
  const radiusScale = [
    { name: "Button", value: "10px", className: "rounded-[10px]" },
    { name: "Nav / badge", value: "14px", className: "rounded-[14px]" },
    { name: "Small card", value: "16px", className: "rounded-2xl" },
    { name: "Media", value: "20px", className: "rounded-[20px]" },
    { name: "Card", value: "24px", className: "rounded-3xl" },
    { name: "Pill", value: "9999px", className: "rounded-full" },
  ];

  return (
    <>
      <Header activePage="none" theme={theme} onThemeChange={onThemeChange} />
      <motion.div
        className="content-page-shell flex w-full flex-col gap-10 p-6 lg:gap-14 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20" variants={sectionReveal}>
          <SectionLabel>Styleguide</SectionLabel>
          <div className="flex flex-col gap-5">
            <h1 className="max-w-[720px] text-[32px] font-medium leading-none tracking-[-1.6px] text-foreground lg:text-[56px] lg:tracking-[-2.8px]">
              {language === "en" ? "Visual foundations for this portfolio." : "Fundações visuais deste portfólio."}
            </h1>
            <p className="max-w-[620px] text-[18px] leading-[1.45] tracking-[-0.36px] text-muted">
              {language === "en"
                ? "A compact reference for typography, colors, spacing and reusable interface patterns."
                : "Uma referência compacta de tipografia, cores, espaçamentos e padrões reutilizáveis de interface."}
            </p>
          </div>
        </motion.section>

        <motion.section className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20" variants={sectionReveal}>
          <SectionLabel>{language === "en" ? "Typography" : "Tipografia"}</SectionLabel>
          <div className="grid gap-4">
            {typographyScale.map((item) => (
              <div key={item.name} className="rounded-3xl border border-border bg-card p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">{item.name}</p>
                  <p className="text-[13px] leading-[1.45] tracking-[-0.26px] text-muted">
                    {item.className} · tracking {item.tracking} · line {item.leading}
                  </p>
                </div>
                <p className={`${item.className} font-medium leading-none tracking-[-1.1px] text-card-foreground lg:tracking-[-1.6px]`}>
                  {item.sample}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20" variants={sectionReveal}>
          <SectionLabel>{language === "en" ? "Colors" : "Cores"}</SectionLabel>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {colorTokens.map((color) => (
              <div key={color.token} className="rounded-3xl border border-border bg-card p-4">
                <div className={`mb-4 h-24 rounded-2xl border border-border ${color.className}`} />
                <p className="text-[16px] font-medium leading-[1.2] tracking-[-0.48px] text-card-foreground">{color.name}</p>
                <p className="mt-1 text-[14px] leading-[1.45] tracking-[-0.28px] text-muted">{color.token}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20" variants={sectionReveal}>
          <SectionLabel>{language === "en" ? "Spacing" : "Espaçamento"}</SectionLabel>
          <div className="grid gap-3">
            {spacingScale.map((space) => (
              <div key={space.name} className="grid grid-cols-[88px_1fr_80px] items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-card-foreground">gap-{space.name}</p>
                <div className="h-8 rounded-full bg-background">
                  <div className={`${space.className} h-8 rounded-full bg-primary`} />
                </div>
                <p className="text-right text-[14px] leading-[1.45] tracking-[-0.28px] text-muted">{space.value}</p>
              </div>
            ))}
            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="mb-4 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
                {language === "en" ? "Common page spacing" : "Espaçamentos comuns de página"}
              </p>
              <div className="grid gap-3 text-[15px] leading-[1.45] tracking-[-0.3px] text-muted">
                <p><span className="font-medium text-card-foreground">Page padding:</span> p-6 / lg:p-20</p>
                <p><span className="font-medium text-card-foreground">Section gap:</span> gap-10 / lg:gap-14 / lg:gap-20</p>
                <p><span className="font-medium text-card-foreground">Card padding:</span> p-6 / p-8 / lg:p-10</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20" variants={sectionReveal}>
          <SectionLabel>Radius</SectionLabel>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {radiusScale.map((radius) => (
              <div key={radius.name} className="rounded-3xl border border-border bg-card p-4">
                <div className={`mb-4 h-28 border border-border bg-background ${radius.className}`} />
                <p className="text-[16px] font-medium leading-[1.2] tracking-[-0.48px] text-card-foreground">{radius.name}</p>
                <p className="mt-1 text-[14px] leading-[1.45] tracking-[-0.28px] text-muted">{radius.value}</p>
                <p className="mt-1 text-[13px] leading-[1.45] tracking-[-0.26px] text-muted">{radius.className}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20" variants={sectionReveal}>
          <SectionLabel>{language === "en" ? "Components" : "Componentes"}</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex min-h-[220px] flex-col justify-between rounded-3xl border border-border bg-card p-6">
              <div className="flex flex-wrap gap-2">
                {componentSamples.map((item) => (
                  <span key={item} className="rounded-full border border-border px-3 py-1 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-card-foreground lg:text-[32px] lg:tracking-[-1.6px]">
                  {language === "en" ? "Card pattern" : "Padrão de card"}
                </h2>
                <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                  {language === "en" ? "Rounded, quiet and content-first." : "Arredondado, discreto e centrado no conteúdo."}
                </p>
              </div>
            </div>
            <div className="flex min-h-[220px] flex-col justify-between rounded-3xl border border-border bg-card p-6">
              <SectionLabel>{language === "en" ? "Actions" : "Ações"}</SectionLabel>
              <div className="flex flex-wrap gap-3">
                <a href="/projetos/" className="rounded-[10px] border border-border px-4 py-2.5 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
                  {language === "en" ? "See projects" : "Ver projetos"}
                </a>
                <a href="/contato/" className="rounded-[10px] bg-foreground px-4 py-2.5 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-background">
                  {language === "en" ? "Contact" : "Contato"}
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
      <Footer />
    </>
  );
}

function SitemapPage({ theme, onThemeChange }: PageProps) {
  const prefersReducedMotion = useReducedMotion();
  const { language } = useTranslation();
  const groups = [
    {
      title: language === "en" ? "Main pages" : "Páginas principais",
      links: [
        { label: "Home", href: "/" },
        { label: language === "en" ? "Projects" : "Projetos", href: "/projetos/" },
        { label: language === "en" ? "Content" : "Conteúdos", href: "/conteudos/" },
        { label: language === "en" ? "About" : "Sobre", href: "/sobre/" },
        { label: language === "en" ? "Contact" : "Contato", href: "/contato/" },
      ],
    },
    {
      title: language === "en" ? "Case hubs" : "Hubs de cases",
      links: [
        { label: "Clinia", href: "/clinia/" },
        { label: "Petrobras", href: "/petrobras/" },
      ],
    },
    {
      title: "Cases",
      links: [
        { label: "Clinia", href: "/cases/clinia/" },
        { label: "Talqui", href: "/cases/talqui/" },
        { label: "Petrobras Nossa Energia", href: "/cases/petrobras-nossa-energia/" },
        { label: "Petrobras Design System", href: "/cases/petrobras-design-system/" },
      ],
    },
    {
      title: language === "en" ? "Utilities" : "Utilitários",
      links: [
        { label: "Styleguide", href: "/styleguide/" },
        { label: "Sitemap", href: "/mapa-do-site/" },
        { label: "Playground", href: "/playground/" },
        { label: "CV PT", href: "/cv/pt/" },
        { label: "CV EN", href: "/cv/en/" },
      ],
    },
  ];

  return (
    <>
      <Header activePage="none" theme={theme} onThemeChange={onThemeChange} />
      <motion.div
        className="content-page-shell flex w-full flex-col gap-10 p-6 lg:gap-14 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20" variants={sectionReveal}>
          <SectionLabel>Sitemap</SectionLabel>
          <div className="flex flex-col gap-5">
            <h1 className="max-w-[720px] text-[32px] font-medium leading-none tracking-[-1.6px] text-foreground lg:text-[56px] lg:tracking-[-2.8px]">
              {language === "en" ? "All available pages." : "Todas as páginas disponíveis."}
            </h1>
            <p className="max-w-[620px] text-[18px] leading-[1.45] tracking-[-0.36px] text-muted">
              {language === "en"
                ? "A simple index of visible and support pages in the portfolio."
                : "Um índice simples das páginas visíveis e de apoio do portfólio."}
            </p>
          </div>
        </motion.section>

        <motion.section className="grid gap-4 border-t border-border pt-10 sm:grid-cols-2" variants={sectionReveal}>
          {groups.map((group) => (
            <article key={group.title} className="rounded-3xl border border-border bg-card p-6">
              <h2 className="mb-5 text-[22px] font-medium leading-none tracking-[-1.1px] text-card-foreground lg:text-[32px] lg:tracking-[-1.6px]">
                {group.title}
              </h2>
              <div className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="group flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-[15px] font-medium leading-[1.45] tracking-[-0.3px] text-card-foreground transition-colors hover:border-primary"
                  >
                    <span>{link.label}</span>
                    <span className="text-[14px] font-normal text-muted group-hover:text-primary">{link.href}</span>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </motion.section>
      </motion.div>
      <Footer />
    </>
  );
}

function ContentPage({ theme, onThemeChange }: PageProps) {
  const prefersReducedMotion = useReducedMotion();
  const { t, language } = useTranslation();
  const posthog = usePostHog();
  const [featuredVideo, ...moreVideos] = youtubeVideos;

  return (
    <>
      <Header activePage="content" theme={theme} onThemeChange={onThemeChange} />
      <motion.div
        className="content-page-shell flex w-full flex-col gap-10 p-6 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col gap-8" variants={sectionReveal}>
          <SectionLabel>{language === "en" ? "Content" : "Conteúdos"}</SectionLabel>
          <h1 className="w-full font-display text-[32px] font-medium leading-none tracking-[-1.6px] text-foreground sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
            {language === "en" ? "My point of view on Product Design, AI and more." : "Meus pontos de vista sobre Product Design, IA e muito mais"}
          </h1>
          <p className="w-full text-left text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
            {language === "en" ? "Explore the latest shared content." : "Confira os últimos conteúdos compartilhados"}
          </p>
        </motion.section>

        <motion.section
          className="flex flex-col gap-6 border-t border-border pt-10"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <div className="flex items-end justify-between gap-10">
            <div className="flex flex-col gap-3">
              <SectionLabel>YouTube</SectionLabel>
              <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
                {language === "en" ? "Latest videos from @uxdudu" : "Últimos vídeos do canal @uxdudu"}
              </h2>
            </div>
            <a
              href="https://www.youtube.com/@uxdudu"
              target="_blank"
              rel="noreferrer"
              className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary"
            >
              {t.viewChannel}
            </a>
          </div>
          <VideoCard video={featuredVideo} featured />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {moreVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </motion.section>

        <motion.section
          className="flex items-center justify-between gap-8 border-t border-border py-10"
          variants={sectionReveal}
        >
          <SectionLabel>Links</SectionLabel>
          <div className="flex items-center gap-2">
            {contentLinks.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                title={item.label}
                className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-card hover:text-primary"
                whileHover={{ y: -2 }}
                whileTap={TAP}
                transition={SPRING}
                onClick={() => trackEvent(posthog, "social_link_clicked", { platform: item.label, href: item.href })}
              >
                <SocialIcon icon={item.icon} />
              </motion.a>
            ))}
          </div>
        </motion.section>
      </motion.div>
      <Footer />
    </>
  );
}

function ContactPage({ theme, onThemeChange }: PageProps) {
  const prefersReducedMotion = useReducedMotion();
  const { language } = useTranslation();
  const posthog = usePostHog();
  const whatsappHref = language === "en"
    ? "https://api.whatsapp.com/send?phone=5544988593038&text=Hi%20Eduardo%2C%20I%20came%20from%20your%20portfolio%20and%20would%20like%20to%20talk%20about%20a%20project."
    : "https://api.whatsapp.com/send?phone=5544988593038&text=Oi%20Eduardo%2C%20vim%20pelo%20seu%20portf%C3%B3lio%20e%20quero%20conversar%20sobre%20um%20projeto.";

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <Header activePage="contact" theme={theme} onThemeChange={onThemeChange} />
      <motion.div
        className="flex w-full flex-col gap-10 p-5 lg:gap-20 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_360px] lg:items-end lg:gap-20" variants={sectionReveal}>
          <div className="flex flex-col gap-8">
            <SectionLabel>{language === "en" ? "Contact" : "Contato"}</SectionLabel>
            <h1 className="max-w-[760px] font-display text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px] sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
              {language === "en" ? "Let's talk about product, design or AI." : "Vamos conversar sobre produto, design ou IA."}
            </h1>
          </div>
          <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
            {language === "en"
              ? "Fill out the form to send an email with context, or message me on WhatsApp if you prefer a quicker conversation."
              : "Preencha o formulário para enviar um email com contexto, ou me chame direto no WhatsApp se preferir uma conversa mais rápida."}
          </p>
        </motion.section>

        <motion.section className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_360px]" variants={sectionReveal}>
          <form
            action="https://formsubmit.co/oi@eduardoamaral.me"
            method="POST"
            className="flex flex-col gap-6 p-0"
            onSubmit={() => trackEvent(posthog, "contact_form_submitted", { language })}
          >
            <input type="hidden" name="_next" value={window.location.origin + "/contato?success=true"} />
            <input type="hidden" name="_subject" value="Novo contato do Portfólio!" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-card-foreground">
                {language === "en" ? "Name" : "Nome"}
                <input
                  name="nome"
                  required
                  placeholder={language === "en" ? "Your name" : "Seu nome"}
                  className="h-12 rounded-[14px] border border-border bg-background px-4 text-[16px] font-normal tracking-[-0.32px] text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-card-foreground">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="h-12 rounded-[14px] border border-border bg-background px-4 text-[16px] font-normal tracking-[-0.32px] text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-card-foreground">
              {language === "en" ? "Message" : "Mensagem"}
              <textarea
                name="mensagem"
                required
                rows={8}
                placeholder={language === "en" ? "Tell me a bit about your project, challenge or idea." : "Me conte um pouco sobre o projeto, desafio ou ideia."}
                className="resize-none rounded-[14px] border border-border bg-background px-4 py-3 text-[16px] font-normal leading-[1.45] tracking-[-0.32px] text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary"
              />
            </label>

            <div className="flex items-center justify-between gap-4">
              <p className="max-w-[420px] text-[14px] leading-[1.45] tracking-[-0.42px] text-muted">
                {language === "en" ? "Your message will be sent directly to my email." : "Sua mensagem será enviada diretamente para o meu email."}
              </p>
              <motion.button
                type="submit"
                className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[10px] border border-border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary"
                whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
                whileTap={TAP}
                transition={SPRING}
              >
                <span>{language === "en" ? "Send email" : "Enviar email"}</span>
                <span className="shrink-0">
                  <IconlySendMessage size={16} />
                </span>
              </motion.button>
            </div>
          </form>

          <div className="flex flex-col gap-6">
            <motion.a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[260px] flex-col justify-between rounded-[32px] border border-border bg-card p-8"
              whileHover={{ y: -5, borderColor: "var(--color-primary)" }}
              whileTap={TAP}
              transition={SPRING}
              onClick={() => trackEvent(posthog, "whatsapp_contact_clicked", { language })}
            >
              <div className="flex flex-col gap-3">
                <SectionLabel>WhatsApp</SectionLabel>
                <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-card-foreground lg:text-[32px] lg:tracking-[-1.6px]">
                  {language === "en" ? "Prefer to cut straight to it?" : "Prefere ir direto ao ponto?"}
                </h2>
                <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                  {language === "en" ? "Send me a WhatsApp message with some context about your project." : "Me envie uma mensagem no WhatsApp com contexto do projeto."}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
                <IconlyWhatsapp size={16} />
                <span>{language === "en" ? "Message on WhatsApp" : "Chamar no WhatsApp"}</span>
              </span>
            </motion.a>

            <div className="p-8">
              <div className="flex flex-col gap-4">
                <SectionLabel>Email</SectionLabel>
                <p className="text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground">
                  oi@eduardoamaral.me
                </p>
                <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                  {language === "en" ? "For invitations, projects, mentoring, partnerships, and product conversations." : "Para convites, projetos, mentorias, parcerias e conversas sobre produto."}
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
      <Footer />

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 flex max-w-md items-center gap-3 rounded-2xl border border-border bg-card/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-md"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5 pr-2">
              <p className="text-[14px] font-semibold tracking-[-0.28px] text-foreground">
                {language === "en" ? "Message sent!" : "Mensagem enviada!"}
              </p>
              <p className="text-[12px] leading-[1.4] tracking-[-0.24px] text-muted">
                {language === "en"
                  ? "Thanks for reaching out. I'll get back to you soon."
                  : "Obrigado pelo contato. Responderei o quanto antes."}
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="ml-auto rounded-lg p-1 text-muted hover:bg-card-foreground/5 hover:text-foreground transition-colors"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] transition-colors ${
        active
          ? "border-primary bg-card text-foreground"
          : "border-border bg-transparent text-muted"
      }`}
      whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
      whileTap={TAP}
      transition={SPRING}
    >
      {label}
    </motion.button>
  );
}

function ProjectListCard({ project }: { project: DirectoryProject }) {
  const { language } = useTranslation();
  const Wrapper = project.href ? motion.a : motion.article;
  const visual = projectCompanyVisuals[project.name];
  const visualSrc = visual?.logo || visual?.iconUrl;
  const coverSrc = visual?.cover;
  const deliverables = normalizeDeliverables(project.deliverables);
  const visibleDeliverables = deliverables.slice(0, 3);
  const hiddenDeliverablesCount = Math.max(0, deliverables.length - visibleDeliverables.length);
  const statusLabel = language === "en" ? (project.statusEn ?? project.status) : project.status;
  const isCaseAvailable = statusLabel.toLowerCase().includes("case");

  return (
    <Wrapper
      href={project.href}
      className="group flex min-h-[354px] flex-col rounded-[26px] bg-card p-1"
      variants={sectionReveal}
      whileHover={project.href ? { y: -4 } : undefined}
      whileTap={project.href ? TAP : undefined}
      transition={SPRING}
    >
      <div className="project-list-card-media relative aspect-[21/9] overflow-hidden rounded-b-lg rounded-t-[20px]">
        {coverSrc ? (
          <img
            loading="lazy"
            decoding="async"
            src={coverSrc}
            alt={visual.coverAlt ?? ""}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${visual.coverClassName ?? ""}`}
          />
        ) : null}
        {coverSrc ? <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 to-transparent" /> : null}
        <span
          className={`absolute left-3 top-3 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] ${
            isCaseAvailable ? "text-[#24c653]" : coverSrc ? "text-white/80" : "text-muted"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-6">
          <h2 className="min-w-0 text-[28px] font-medium leading-none tracking-[-1.4px] text-card-foreground lg:text-[32px] lg:tracking-[-1.6px]">
            {project.name}
          </h2>
          {visualSrc ? (
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-background">
              <img loading="lazy" decoding="async" src={visualSrc} alt="" className="size-7 object-contain" />
            </span>
          ) : (
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-background text-[13px] font-medium leading-none text-primary">
              {project.name.slice(0, 2)}
            </span>
          )}
        </div>
        <p className="mt-4 h-[72px] overflow-hidden text-[16px] leading-[1.45] tracking-[-0.32px] text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {language === "en" ? (project.summaryEn ?? project.summary) : project.summary}
        </p>
        <div className="mt-4 flex min-w-0 flex-nowrap items-center gap-2 overflow-hidden">
          {visibleDeliverables.map((item) => (
            <span
              key={item}
              className="shrink-0 rounded-full bg-background px-2.5 py-1 text-[13px] leading-[1.45] tracking-[-0.39px] text-muted"
            >
              {item}
            </span>
          ))}
          {hiddenDeliverablesCount > 0 ? (
            <span className="shrink-0 rounded-full bg-background px-2.5 py-1 text-[13px] leading-[1.45] tracking-[-0.39px] text-muted">
              +{hiddenDeliverablesCount}
            </span>
          ) : null}
        </div>
      </div>
    </Wrapper>
  );
}

function ProjectsPage({
  theme,
  onThemeChange,
  directoryProjects = allProjects,
}: PageProps & { directoryProjects?: DirectoryProject[] }) {
  const prefersReducedMotion = useReducedMotion();
  const { language } = useTranslation();
  const posthog = usePostHog();
  const [typeFilter, setTypeFilter] = useState<(typeof projectTypeFilters)[number]>("Todos");
  const [deliverableFilter, setDeliverableFilter] = useState<(typeof deliverableFilters)[number]>("Todos");

  const filteredProjects = directoryProjects.filter((project) => {
    if (!project.href) return false;
    const matchesType = typeFilter === "Todos" || project.type === typeFilter;
    const deliverables = normalizeDeliverables(project.deliverables);
    const matchesDeliverable =
      deliverableFilter === "Todos" || deliverables.includes(deliverableFilter);

    return matchesType && matchesDeliverable;
  });

  return (
    <>
      <Header activePage="projects" theme={theme} onThemeChange={onThemeChange} />
      <motion.div
        className="flex w-full flex-col gap-10 p-5 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="grid gap-8 lg:grid-cols-3 lg:items-start" variants={sectionReveal}>
          <div className="flex flex-col gap-8 lg:col-span-2">
            <SectionLabel>{language === "en" ? "Projects" : "Projetos"}</SectionLabel>
            <h1 className="max-w-[760px] font-display text-[32px] font-medium leading-none tracking-[-1.6px] text-foreground sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
              {language === "en" ? (
                <>Explore some of<br />my projects</>
              ) : (
                <>Conheça alguns<br />dos meus projetos</>
              )}
            </h1>
          </div>
          <div className="lg:col-span-1 lg:flex lg:h-[165px] lg:items-end lg:py-1">
            <p className="text-left text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
              {language === "en"
                ? "Filter by type or deliverable. Some projects have more than one case."
                : "Filtre por tipo ou entregável. Alguns deles têm mais de um case."}
            </p>
          </div>
        </motion.section>

        <motion.section className="flex flex-col gap-6 border-t border-border pt-10 lg:flex-row lg:gap-10" variants={sectionReveal}>
          <div className="flex min-w-0 flex-col gap-3 lg:w-[425px] lg:shrink-0">
            <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-muted">
              {language === "en" ? "Type" : "Tipo"}
            </p>
            <div className="flex flex-wrap gap-2">
              {projectTypeFilters.map((item) => (
                <FilterChip key={item} label={item === "Todos" ? (language === "en" ? "All" : "Todos") : item} active={typeFilter === item} onClick={() => { trackEvent(posthog, "project_filter_applied", { filter_type: "type", filter_value: item }); setTypeFilter(item); }} />
              ))}
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-3 lg:flex-1">
            <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-muted">
              {language === "en" ? "Deliverables" : "Entregáveis"}
            </p>
            <div className="flex flex-wrap gap-2">
              {deliverableFilters.map((item) => (
                <FilterChip
                  key={item}
                  label={item === "Todos" ? (language === "en" ? "All" : "Todos") : item}
                  active={deliverableFilter === item}
                  onClick={() => { trackEvent(posthog, "project_filter_applied", { filter_type: "deliverable", filter_value: item }); setDeliverableFilter(item); }}
                />
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          variants={staggerChildren}
        >
          {filteredProjects.map((project) => (
            <ProjectListCard key={project.name} project={project} />
          ))}
        </motion.section>
      </motion.div>
      <Footer />
    </>
  );
}

function ProjectOptionCard({ project }: { project: HubProject }) {
  const { t } = useTranslation();
  const posthog = usePostHog();
  const isAvailable = Boolean(project.href);
  const Wrapper = isAvailable ? motion.a : motion.div;

  return (
    <Wrapper
      href={project.href}
      className="group flex min-h-[280px] flex-col justify-between rounded-3xl border border-border bg-card p-6"
      variants={sectionReveal}
      whileHover={isAvailable ? { y: -6, borderColor: "var(--color-primary)" } : undefined}
      whileTap={isAvailable ? TAP : undefined}
      transition={SPRING}
      onClick={isAvailable ? () => trackEvent(posthog, "case_study_opened", { case_title: project.title, href: project.href }) : undefined}
    >
      <div className="flex items-start justify-between gap-6">
        <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
          {project.eyebrow}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="max-w-[320px] text-[22px] font-medium leading-none tracking-[-1.1px] text-card-foreground lg:text-[32px] lg:tracking-[-1.6px]">
          {project.title}
        </h2>
        <p className="overflow-hidden text-[16px] leading-[1.45] tracking-[-0.32px] text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {project.description}
        </p>
        {isAvailable ? (
          <span className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
            {t.openCase}
          </span>
        ) : null}
      </div>
    </Wrapper>
  );
}

function CliniaProjectOptionCard({ project }: { project: CliniaHubProject }) {
  const { t } = useTranslation();
  const isAvailable = Boolean(project.href);
  const Wrapper = isAvailable ? motion.a : motion.div;

  return (
    <Wrapper
      href={project.href}
      className="group flex min-h-[280px] flex-col justify-between rounded-3xl border border-border bg-card p-6"
      variants={sectionReveal}
      whileHover={isAvailable ? { y: -6, borderColor: "var(--color-primary)" } : undefined}
      whileTap={isAvailable ? TAP : undefined}
      transition={SPRING}
    >
      <div className="flex items-start justify-between gap-6">
        <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
          {project.eyebrow}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="max-w-[320px] text-[22px] font-medium leading-none tracking-[-1.1px] text-card-foreground lg:text-[32px] lg:tracking-[-1.6px]">
          {project.title}
        </h2>
        <p className="overflow-hidden text-[16px] leading-[1.45] tracking-[-0.32px] text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {project.description}
        </p>
        {isAvailable ? (
          <span className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
            {t.openCase}
          </span>
        ) : null}
      </div>
    </Wrapper>
  );
}

function CliniaHubPage({
  theme,
  onThemeChange,
  projectOptions = cliniaProjects,
}: PageProps & { projectOptions?: CliniaHubProject[] }) {
  const prefersReducedMotion = useReducedMotion();
  const { language, t } = useTranslation();

  return (
    <>
      <Header activePage="projects" theme={theme} onThemeChange={onThemeChange} />
      <motion.div
        className="flex w-full flex-col gap-10 p-5 lg:gap-20 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col gap-6" variants={sectionReveal}>
          <a
            href="/projetos/"
            className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-muted"
          >
            {t.backToProjects}
          </a>
          <h1 className="font-display text-[32px] font-medium leading-none tracking-[-1.6px] text-foreground sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
            Clinia
          </h1>
        </motion.section>

        <motion.section
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          {projectOptions.map((project) => (
            <CliniaProjectOptionCard key={project.title} project={project} />
          ))}
        </motion.section>
      </motion.div>
      <Footer />
    </>
  );
}

function PetrobrasHubPage({
  theme,
  onThemeChange,
  projectOptions = petrobrasProjects,
}: PageProps & { projectOptions?: HubProject[] }) {
  const prefersReducedMotion = useReducedMotion();
  const { language, t } = useTranslation();
  const pillars = language === "en" ? petrobrasDsPillarsEn : petrobrasDsPillars;

  return (
    <>
      <Header activePage="projects" theme={theme} onThemeChange={onThemeChange} />
      <motion.div
        className="flex w-full flex-col gap-10 p-5 lg:gap-20 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col gap-6" variants={sectionReveal}>
          <a
            href="/#projetos"
            className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-muted"
          >
            {t.backToProjects}
          </a>
          <h1 className="font-display text-[32px] font-medium leading-none tracking-[-1.6px] text-foreground sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
            Petrobras
          </h1>
        </motion.section>

        <motion.section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" variants={staggerChildren}>
          {projectOptions.map((project) => (
            <ProjectOptionCard key={project.title} project={project} />
          ))}
        </motion.section>
      </motion.div>
      <Footer />
    </>
  );
}

export function App() {
  const prefersReducedMotion = useReducedMotion();
  const { content: sanityContent } = useSanityPortfolioContent();
  const [path, setPath] = useState(() => normalizeRoutePath(window.location.pathname));
  const lenisRef = useRef<Lenis | null>(null);
  const [theme, setTheme] = useState<ThemePreference>(() => {
    const stored = window.localStorage?.getItem("theme-preference");
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  });
  const [language, setLanguage] = useState<LanguagePreference>(() => {
    const stored = window.localStorage?.getItem("language-preference");
    return stored === "en" ? "en" : "pt-BR";
  });
  const isAbout = path === "/sobre";
  const isContent = path === "/conteudos";
  const isContact = path === "/contato";
  const isProjects = path === "/projetos";
  const isBio = path === "/bio";
  const isStyleguide = path === "/styleguide";
  const isSitemap = path === "/mapa-do-site";
  const isCliniaHub = path === "/clinia";
  const isCliniaCase = path === "/cases/clinia";
  const isTalquiCase = path === "/cases/talqui";
  const isPetrobrasHub = path === "/petrobras";
  const isPetrobrasCase = path === "/cases/petrobras-nossa-energia";
  const isPetrobrasDesignSystemCase = path === "/cases/petrobras-design-system";
  const isCvPt = path === "/cv/pt";
  const isCvEn = path === "/cv/en";

  useEffect(() => {
    if (theme === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.dataset.theme = theme;
    }

    window.localStorage?.setItem("theme-preference", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage?.setItem("language-preference", language);
  }, [language]);

  useEffect(() => {
    document.body.classList.toggle("bio-route", isBio);
    return () => document.body.classList.remove("bio-route");
  }, [isBio]);

  useLayoutEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
      document.scrollingElement?.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [path]);

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizeRoutePath(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Synchronize language when CV path is visited directly or via browser history
  useEffect(() => {
    if (path === "/cv/pt" && language !== "pt-BR") {
      setLanguage("pt-BR");
    } else if (path === "/cv/en" && language !== "en") {
      setLanguage("en");
    }
  }, [path]);

  // Título + meta por rota (title, description, Open Graph, Twitter, canonical)
  // Ajuda o Google a indexar cada página com contexto próprio e o prerender a capturar tudo.
  useEffect(() => {
    const en = language === "en";
    const seo = getRouteSeo(path, en);

    document.title = seo.title;

    const setMeta = (selector: string, attr: string, key: string, content: string) => {
      let tag = document.head.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta('meta[name="description"]', "name", "description", seo.description);
    setMeta('meta[name="robots"]', "name", "robots", seo.robots);
    setMeta('meta[property="og:type"]', "property", "og:type", seo.openGraphType);
    setMeta('meta[property="og:title"]', "property", "og:title", seo.title);
    setMeta('meta[property="og:description"]', "property", "og:description", seo.description);
    setMeta('meta[property="og:url"]', "property", "og:url", seo.canonical);
    setMeta('meta[property="og:image"]', "property", "og:image", seo.image);
    setMeta('meta[property="og:image:alt"]', "property", "og:image:alt", seo.imageAlt);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", seo.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", seo.description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", seo.image);
    setMeta('meta[name="twitter:image:alt"]', "name", "twitter:image:alt", seo.imageAlt);

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", seo.canonical);

    let structuredData = document.head.querySelector<HTMLScriptElement>(
      'script[data-route-structured-data="true"]',
    );
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.type = "application/ld+json";
      structuredData.dataset.routeStructuredData = "true";
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify(seo.structuredData);
  }, [path, language]);

  useEffect(() => {
    trackPageView();
  }, [path]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as Element | null)?.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      const target = link.getAttribute("target");
      if (!href || target || href.startsWith("mailto:") || href.startsWith("http")) return;

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      if (normalizeRoutePath(url.pathname) === normalizeRoutePath(window.location.pathname) && url.hash) {
        return;
      }

      event.preventDefault();
      window.history.pushState({}, "", `${url.pathname}${url.hash}`);
      setPath(normalizeRoutePath(url.pathname));
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      anchors: {
        offset: -24,
        duration: 1.1,
      },
    });

    lenisRef.current = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const pageProps = { theme, onThemeChange: setTheme };
  const cmsProjects = sanityContent?.projects;
  const localizedCmsProjects = localizeProjects(cmsProjects, language);
  const homeProjects = mergeHomeProjects(localizedCmsProjects);
  const directoryProjects = mergeDirectoryProjects(localizedCmsProjects);
  const cliniaFallback = language === "en" ? cliniaProjectsEn : cliniaProjects;
  const petrobrasfall = language === "en" ? petrobrasProjectsEn : petrobrasProjects;
  const cliniaProjectOptions = mergeHubProjects(cliniaFallback, localizedCmsProjects, "clinia");
  const petrobrasProjectOptions = mergeHubProjects(petrobrasfall, localizedCmsProjects, "petrobras");
  const cmsCases = sanityContent?.caseStudies;
  const localizedCmsCases = localizeCaseStudies(cmsCases, language);
  const cliniaCase = getCaseStudy(localizedCmsCases, "clinia");
  const talquiCase = getCaseStudy(localizedCmsCases, "talqui");
  const petrobrasNossaEnergiaCase = getCaseStudy(localizedCmsCases, "petrobras-nossa-energia");
  const petrobrasDesignSystemCase = getCaseStudy(localizedCmsCases, "petrobras-design-system");

  const page = isTalquiCase ? (
    <TalquiCasePage {...pageProps} cmsCase={talquiCase} />
  ) : (isCliniaHub || isCliniaCase) ? (
    <CliniaCasePage {...pageProps} cmsCase={cliniaCase} />
  ) : isPetrobrasDesignSystemCase ? (
    <PetrobrasDesignSystemCasePage {...pageProps} cmsCase={petrobrasDesignSystemCase} />
  ) : isPetrobrasCase ? (
    <PetrobrasNossaEnergiaCasePage {...pageProps} cmsCase={petrobrasNossaEnergiaCase} />
  ) : isPetrobrasHub ? (
    <PetrobrasHubPage {...pageProps} projectOptions={petrobrasProjectOptions} />
  ) : isStyleguide ? (
    <StyleguidePage {...pageProps} />
  ) : isSitemap ? (
    <SitemapPage {...pageProps} />
  ) : isContact ? (
    <ContactPage {...pageProps} />
  ) : isBio ? (
    <BioPage />
  ) : isProjects ? (
    <ProjectsPage {...pageProps} directoryProjects={directoryProjects} />
  ) : isContent ? (
    <ContentPage {...pageProps} />
  ) : isAbout ? (
    <AboutPage {...pageProps} />
  ) : (
    <HomePage {...pageProps} homeProjects={homeProjects} />
  );

  if (path === "/playground") {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <PlaygroundPage />
      </Suspense>
    );
  }

  if (path === "/cv/pt") {
    return <CvPrintPage lang="pt" />;
  }
  if (path === "/cv/en") {
    return <CvPrintPage lang="en" />;
  }

  const handleLanguageChange = (newLang: LanguagePreference) => {
    setLanguage(newLang);
    if (path === "/cv/pt" && newLang === "en") {
      window.history.pushState({}, "", "/cv/en");
      setPath("/cv/en");
    } else if (path === "/cv/en" && newLang === "pt-BR") {
      window.history.pushState({}, "", "/cv/pt");
      setPath("/cv/pt");
    }
  };

  return (
    <LanguageContext.Provider value={{ language, onLanguageChange: handleLanguageChange }}>
      <main className={isBio ? "mx-auto flex w-full flex-col items-center overflow-x-clip bg-background" : "mx-auto flex w-[1200px] flex-col items-center overflow-x-clip bg-background"}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={path}
            className="flex w-full flex-col items-center"
            variants={prefersReducedMotion ? undefined : pageFade}
            initial={prefersReducedMotion ? false : "initial"}
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <Suspense fallback={<LoadingScreen />}>{page}</Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Analytics />
      <SpeedInsights />
    </LanguageContext.Provider>
  );
}

// Símbolos compartilhados com os componentes carregados sob demanda em ./CasePages
export {
  Header,
  Footer,
  SectionLabel,
  useTranslation,
  SPRING,
  TAP,
  sectionReveal,
  staggerChildren,
  caseProcess,
  caseProcessEn,
  caseOutcomes,
  caseOutcomesEn,
  cliniaProcess,
  cliniaProcessEn,
  cliniaWorkflow,
  cliniaWorkflowEn,
  cliniaOutcomes,
  cliniaOutcomesEn,
  cliniaDesignSystemEvidence,
  cliniaDesignSystemEvidenceEn,
  petrobrasDsProcess,
  petrobrasDsProcessEn,
  petrobrasDsFoundations,
  petrobrasDsFoundationsEn,
  petrobrasDsOutcomes,
  petrobrasDsOutcomesEn,
  petrobrasDsEvidence,
  petrobrasDsEvidenceEn,
  petrobrasDsCmsEvidenceFallback,
  talquiProcess,
  talquiProcessEn,
  talquiFoundations,
  talquiFoundationsEn,
  talquiOutcomes,
  talquiOutcomesEn,
  talquiEvidenceFallback,
  experiences,
  projects,
};
export type { PageProps, LightboxImage };
