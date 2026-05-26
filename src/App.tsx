import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Lenis from "lenis";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import avatar from "./assets/avatar.png";
import cliniaDsCheckboxLibrary from "./assets/clinia-ds-checkbox-library.png";
import cliniaDsCheckboxOverview from "./assets/clinia-ds-checkbox-overview.png";
import cliniaDsCheckboxVariables from "./assets/clinia-ds-checkbox-variables.png";
import cliniaClaudeCursorFigmaMcp from "./assets/clinia-claude-cursor-figma-mcp.png";
import cliniaCover from "./assets/clinia-cover.png";
import cliniaV1Inbox from "./assets/clinia-v1-inbox.png";
import cliniaV1Login from "./assets/clinia-v1-login.png";
import cliniaV1Settings from "./assets/clinia-v1-settings.png";
import faviconSymbol from "./assets/favicon-symbol.svg";
import logo from "./assets/logo.svg";
import navState from "./assets/nav-state.svg";
import cliniaLogoBlue from "./assets/clinia-logo-blue.svg";
import cliniaLogoPng from "./assets/clinia-logo.png";
import grupoPrimoLogo from "./assets/grupo-primo-logo.svg";
import orcamaisColorsLogo from "./assets/orcamais-colors.svg";
import orcamaisLightLogo from "./assets/orcamais-light.svg";
import petrobrasLogo from "./assets/petrobras-logo.png";
import petrobrasNossaEnergia from "./assets/case-petrobras-nossa-energia.png";
import petrobrasNossaEnergiaHomeDesktop from "./assets/petrobras-nossa-energia-home-desktop.png";
import petrobrasNossaEnergiaHomeMobile from "./assets/petrobras-nossa-energia-home-mobile.png";
import petrobrasDsBulletSpec from "./assets/petrobras-ds-bullet-spec.png";
import petrobrasDsCardSpec from "./assets/petrobras-ds-card-spec.png";
import petrobrasDsComponents from "./assets/petrobras-ds-components.png";
import petrobrasDsCover from "./assets/petrobras-ds-cover.png";
import petrobrasDsTokens from "./assets/petrobras-ds-tokens.png";
import talquiCover from "./assets/talqui-cover.png";
import talquiLogo from "./assets/talqui-logo.svg";
import talquiSymbol from "./assets/talqui-symbol.svg";
import { useSanityPortfolioContent } from "./lib/useSanityPortfolioContent";
import type { SanityCaseStudy, SanityProject } from "./lib/sanity";

const SPRING = { type: "spring" as const, stiffness: 180, damping: 24, mass: 0.9 };
const TAP = { scale: 0.98 };
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

type ThemePreference = "system" | "light" | "dark";
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
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
      <path d="M7 18h10M9.5 14.5v3.5M14.5 14.5v3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M5.8 5.5h12.4c1.05 0 1.9.85 1.9 1.9v5.2c0 1.05-.85 1.9-1.9 1.9H5.8c-1.05 0-1.9-.85-1.9-1.9V7.4c0-1.05.85-1.9 1.9-1.9Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M18.36 5.64l-1.42 1.42M7.06 16.94l-1.42 1.42" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
      <path
        d="M19.2 14.1A7.6 7.6 0 0 1 9.9 4.8a.8.8 0 0 0-.9-1A8.9 8.9 0 1 0 20.2 15a.8.8 0 0 0-1-0.9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const projects = [
  {
    id: "clinia",
    title: "Clinia",
    tags: ["AI, Saúde, CRM", "Em andamento"],
    description: "Site, Plataforma, Design System",
    logo: cliniaLogoPng,
    icon: cliniaLogoPng,
    href: "/clinia",
  },
  {
    id: "talqui",
    title: "Talqui",
    tags: ["AI, Provedores, Chat", "Em andamento"],
    description: "Site, Plataforma, Design System",
    logo: talquiLogo,
    symbol: talquiSymbol,
    icon: talquiLogo,
    href: "/cases/talqui",
  },
  {
    id: "petrobras",
    title: "Petrobras",
    tags: ["Institucional", "2022 - 2024"],
    description: "Site, Portal de Conteúdos, Design System",
    href: "/petrobras",
    icon: petrobrasLogo,
  },
  {
    id: "orcamais",
    title: "Orçamais",
    tags: ["AI, Obras, SaaS", "Em andamento"],
    description: "Plataforma de gestão de obras pela Versare",
    logo: orcamaisColorsLogo,
    lightLogo: orcamaisLightLogo,
    icon: orcamaisColorsLogo,
  },
  {
    id: "grupo-primo",
    title: "Grupo Primo",
    tags: ["Marketing, Finanças, Educacional", "2021 - 2022"],
    description: "Finclass, Staage, Staart, Design System e Landing Pages",
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
    href: "/cases/petrobras-nossa-energia",
    status: "Case disponível",
  },
  {
    title: "Design System Petrobras",
    eyebrow: "Fundação do ecossistema",
    description:
      "Biblioteca documentada manualmente com tokens, componentes, seções, templates, motion e specs para sustentar o ecossistema digital.",
    href: "/cases/petrobras-design-system",
    status: "Case disponível",
  },
];

const petrobrasProjectsEn = [
  {
    title: "Nossa Energia",
    eyebrow: "Content portal",
    description:
      "Petrobras editorial hub to centralize institutional content, articles and editorial sections using design system components.",
    href: "/cases/petrobras-nossa-energia",
    status: "Case available",
  },
  {
    title: "Petrobras Design System",
    eyebrow: "Ecosystem foundation",
    description:
      "Manually documented library with tokens, components, sections, templates, motion and specs to sustain the digital ecosystem.",
    href: "/cases/petrobras-design-system",
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
  "Designers começaram a entregar não apenas telas, mas também componentes e código em um repositório dedicado.",
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
    href: "/cases/clinia",
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
    href: "/cases/clinia",
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
    imageUrl: "https://cdn.sanity.io/images/f08gavsi/production/cb9ebae4699bf882c7c25ee81b88c82b358c0ce9-1484x1748.png",
  },
  {
    title: "Componente Checkbox no Figma",
    caption: "Componente t-field-checkbox documentado com variantes, estados, modos light e dark, e property table completa.",
    imageUrl: "https://cdn.sanity.io/images/f08gavsi/production/07c266b3539588596376bf83ca00d860c2c141b5-2000x1473.png",
  },
  {
    title: "Componente Conversation Menu na plataforma",
    caption: "Componente t-conversation-menu com variações da lista de conversas: empty, padrão, fixadas, com destaque, notificação e skeleton.",
    imageUrl: "https://cdn.sanity.io/images/f08gavsi/production/66d4922a8b9fd4dc638f4f1e4a43000a0b1b62a7-2000x1473.png",
  },
  {
    title: "Fluxo de onboarding e componente Button",
    caption: "Tela de cadastro da plataforma Talqui com o componente t-base-button em uso.",
    imageUrl: "https://cdn.sanity.io/images/f08gavsi/production/20baa3a2b02fcf13d4ff271b737358bfb521cf53-2000x1206.png",
  },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/eduardooamaral/" },
  { label: "YouTube", href: "https://www.youtube.com/@uxdudu" },
  { label: "Dribbble", href: "https://dribbble.com/eduardooamaral" },
];

const contentLinks = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/@uxdudu",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/ux.dudu/",
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/show/3iRN3dTrHKCfA6bIg56hQv?si=871df89c77f94e21&nd=1&dlsi=91c8707c7bda41e3",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/eduardooamaral/recent-activity/all/",
  },
];

const youtubeVideos = [
  {
    id: "cop3LX65sEA",
    title: "Hands On - Claude Design - Conhecendo a novidade do Claude",
    date: "17 abr 2026",
    views: "1,7 mil visualizações",
  },
  {
    id: "qvnCen5ffA4",
    title: "Conheça o Wonder, a ferramenta de vibe design",
    date: "2 abr 2026",
    views: "372 visualizações",
  },
  {
    id: "TwZJ1KtJzoQ",
    title: "Editor visual para Claude Code e Cursor",
    date: "30 mar 2026",
    views: "429 visualizações",
  },
  {
    id: "hSLU8O22BZM",
    title: "Design System com IA - Claude Code + Figma",
    date: "26 mar 2026",
    views: "5,2 mil visualizações",
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
    href: "https://www.linkedin.com/in/eduardooamaral/recent-activity/all/",
    cta: "Ver atividade",
    status: "Feed exige autenticação",
  },
];

const aboutHighlights = [
  "Product Designer com mais de 5 anos transformando desafios complexos em soluções digitais intuitivas e centradas no usuário.",
  "Minha abordagem versátil me permite atuar em todo o ciclo de desenvolvimento de produtos.",
  "Tenho histórico comprovado em projetos para grandes empresas como Petrobras e Banco do Brasil, onde implementei soluções que melhoraram significativamente a experiência do usuário e os resultados dos negócios.",
  "Atualmente, estou focado em construir a Versare Design, uma agência de design dedicada a criar experiências digitais excepcionais para startups e empresas consolidadas.",
];

const aboutStats = [
  { value: "5+", label: "Anos de experiência" },
  { value: "50+", label: "Projetos entregues" },
  { value: "15+", label: "Clientes satisfeitos" },
];

const experiences = [
  {
    role: "Senior Product Designer",
    company: "Clinia",
    meta: "Design de produto para saúde digital, com pesquisa de UX, validações de usabilidade, interfaces escaláveis e experiências com IA para clínicas.",
  },
  {
    role: "Senior Product Designer",
    company: "Talqui",
    meta: "Redesign completo da plataforma de atendimento com IA, novo design system, site em Framer e protótipos funcionais com vibe coding.",
  },
  {
    role: "Fundador / UX Designer",
    company: "Versare Design",
    meta: "Estúdio de produto digital para startups e empresas em crescimento, com discovery, design end-to-end, Framer, plataformas e produtos com IA.",
  },
  {
    role: "Head of Product Design",
    company: "JStack",
    meta: "Estratégia de product design, padrões de UX/UI e design systems escaláveis para plataforma de educação em desenvolvimento.",
  },
  {
    role: "Senior UX Designer",
    company: "Brivia",
    meta: "Redesign do portal da Petrobras com design system aplicado em 100+ páginas e prototipação da Escola de Influenciadores do Banco do Brasil.",
  },
  {
    role: "UX Designer",
    company: "Grupo Primo",
    meta: "Produtos digitais de educação e conteúdo como Staart, Finclass e Staage, com co-criação, prototipação, componentes e acompanhamento técnico.",
  },
];

const training = [
  "Bacharelado em Administração pela Faculdade Adventista do Paraná, 2017 a 2020",
  "Product Design pela Design Circuit, 2020 a 2021",
  "UI Design pela UX Unicórnio, 2022",
  "UI Design pela UI Expert, 2021 a 2024",
  "UI Design pela uiBoost-design, 2020 a 2024",
  "Certificações em Webflow, Figma do básico ao avançado, Semana OmniStack 11.0 e carreira em tecnologia",
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
    imageUrl: "https://cdn.sanity.io/images/f08gavsi/production/2f37b993cd9cb58cdc0d71a59248baa496cf194d-3840x2026.png",
  },
  {
    title: "Tokens de cores",
    caption: "Documentação dos tokens de cores da marca no PetroDS v2.",
    imageUrl: "https://cdn.sanity.io/images/f08gavsi/production/3b0e797f0dae611b733f275dd36b501b6a398400-3840x2026.png",
  },
  {
    title: "Template de página nível 2",
    caption: "Template nível 2 documentado em variações default e high contrast.",
    imageUrl: "https://cdn.sanity.io/images/f08gavsi/production/389c19aae13998380783cdbf2c63e49d6a41734a-3840x2026.png",
  },
  {
    title: "Componente Link",
    caption: "Documentação do componente Link em desktop e mobile, com variações default e high contrast.",
    imageUrl: "https://cdn.sanity.io/images/f08gavsi/production/c490b14bc4e21b11034fbd6c52bc6d4d91793425-3840x2026.png",
  },
  {
    title: "Variáveis de tema",
    caption: "Coleções de variáveis do PetroDS v2 organizadas por temas default e high contrast.",
    imageUrl: "https://cdn.sanity.io/images/f08gavsi/production/314d20d0601656ccedc30aa3b63fe27192bf0805-3840x2026.png",
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
  "Designers began delivering not just screens, but also components and code in a dedicated repository.",
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
  { title: "LinkedIn", handle: "eduardooamaral", description: "Space for posts about product, AI, Figma, career, and processes. LinkedIn blocks automatic public feed without authentication.", href: "https://www.linkedin.com/in/eduardooamaral/recent-activity/all/", cta: "View activity", status: "Feed requires authentication" },
];

const aboutHighlightsEn = [
  "Product Designer with 5+ years turning complex challenges into intuitive, user-centered digital solutions.",
  "My versatile approach lets me contribute across the entire product development lifecycle.",
  "I have a proven track record on projects for major companies like Petrobras and Banco do Brasil, where I implemented solutions that significantly improved user experience and business outcomes.",
  "I'm currently focused on building Versare Design, a design studio dedicated to creating exceptional digital experiences for startups and established companies.",
];

const aboutStatsEn = [
  { value: "5+", label: "Years of experience" },
  { value: "50+", label: "Projects delivered" },
  { value: "15+", label: "Happy clients" },
];

const experiencesEn = [
  { role: "Senior Product Designer", company: "Clinia", meta: "Product design for digital health, including UX research, usability testing, scalable interfaces, and AI-powered experiences for clinics." },
  { role: "Senior Product Designer", company: "Talqui", meta: "Full redesign of the AI-powered support platform, new design system, Framer site, and functional prototypes with vibe coding." },
  { role: "Founder / UX Designer", company: "Versare Design", meta: "Digital product studio for startups and growing companies, covering discovery, end-to-end design, Framer, platforms, and AI products." },
  { role: "Head of Product Design", company: "JStack", meta: "Product design strategy, UX/UI standards, and scalable design systems for an education platform for developers." },
  { role: "Senior UX Designer", company: "Brivia", meta: "Petrobras portal redesign using a design system applied across 100+ pages, and prototyping Banco do Brasil's Escola de Influenciadores." },
  { role: "UX Designer", company: "Grupo Primo", meta: "Digital education and content products like Staart, Finclass, and Staage, with co-creation, prototyping, components, and technical oversight." },
];

const trainingEn = [
  "Bachelor's in Business Administration, Faculdade Adventista do Paraná, 2017–2020",
  "Product Design at Design Circuit, 2020–2021",
  "UI Design at UX Unicórnio, 2022",
  "UI Design at UI Expert, 2021–2024",
  "UI Design at uiBoost-design, 2020–2024",
  "Certifications in Webflow, Figma (beginner to advanced), OmniStack 11.0 Week, and a tech career program",
];

// ────────────────────────────────────────────────────────────────────────────

const projectTypeFilters = ["Todos", "Web app", "App", "Blog", "Site"] as const;
const deliverableFilters = ["Todos", "UI", "UX", "Design System", "Motion", "No code", "AI", "Research"] as const;
const hiddenProjectIds = new Set(["orcamais", "grupo-primo", "clinia-site", "petrobras-main-site"]);
const hiddenProjectNames = new Set(["Orçamais", "Grupo Primo"]);

const allProjects = [
  {
    name: "Clinia",
    type: "Web app",
    status: "Em andamento",
    summary: "Produto de saúde digital com CRM, experiências com IA e design system.",
    deliverables: ["UI", "UX", "Design System", "AI", "Research"],
    href: "/clinia",
  },
  {
    name: "Talqui",
    type: "Web app",
    status: "Em andamento",
    summary: "Plataforma de atendimento com IA, redesign, design system e site em Framer.",
    deliverables: ["UI", "UX", "Design System", "No code", "AI"],
    href: "/cases/talqui",
  },
  {
    name: "Orçamais",
    type: "Web app",
    status: "Em andamento",
    summary: "Plataforma de gestão de obras construída pela Versare com AI no processo.",
    deliverables: ["UI", "UX", "AI", "Design System"],
  },
  // Petrobras hidden temporarily
  {
    name: "Grupo Primo",
    type: "Site",
    status: "Finalizado",
    summary: "Produtos digitais de educação e conteúdo como Finclass, Staage e Staart.",
    deliverables: ["UI", "UX", "Design System"],
  },
  {
    name: "JStack",
    type: "Site",
    status: "Finalizado",
    summary: "Redesign institucional, posicionamento, landing pages e evolução de produto.",
    deliverables: ["UI", "UX", "No code", "Design System"],
  },
  {
    name: "Grana.ai",
    type: "Web app",
    status: "Versare",
    summary: "Produto financeiro com foco em clareza, jornadas e experiência de uso.",
    deliverables: ["UI", "UX", "AI"],
  },
  {
    name: "Docompliance",
    type: "Web app",
    status: "Versare",
    summary: "Plataforma jurídica com IA para fluxos de compliance e operação.",
    deliverables: ["UI", "UX", "AI", "Design System"],
  },
  {
    name: "Gennio",
    type: "Site",
    status: "Versare",
    summary: "Landing pages e presença digital para comunicação de produto.",
    deliverables: ["UI", "No code"],
  },
  {
    name: "Velloo",
    type: "App",
    status: "Versare",
    summary: "Experiência mobile com foco em interface, fluxos e produto.",
    deliverables: ["UI", "UX"],
  },
  {
    name: "Marmaris",
    type: "Site",
    status: "Versare",
    summary: "Site institucional com direção visual e experiência responsiva.",
    deliverables: ["UI", "UX", "No code"],
  },
];

type HomeProject = (typeof projects)[number];
type DirectoryProject = (typeof allProjects)[number];
type HubProject = (typeof petrobrasProjects)[number];
type CliniaHubProject = (typeof cliniaProjects)[number];

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
      href: cmsProject.href ?? project.href,
    };
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
      summary: project.summary || project.description || "",
      deliverables: project.deliverables || [],
      href: project.href,
    }));

  return directoryProjects.length ? directoryProjects : allProjects.filter((project) => !hiddenProjectNames.has(project.name));
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
  const image = <img src={logo} alt="Eduardo Amaral" className={`h-5 w-[26px] ${className}`} />;

  if (!linked) {
    return image;
  }

  return (
    <motion.a
      href="/"
      aria-label="Ir para a home"
      className="inline-flex rounded-md"
      whileHover={{ y: -1 }}
      whileTap={TAP}
      transition={SPRING}
    >
      {image}
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
        <img
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
          onClick={() => onThemeChange(option.value)}
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
  const options: Array<{ value: LanguagePreference; label: string }> = [
    { value: "pt-BR", label: "PT" },
    { value: "en", label: "EN" },
  ];

  return (
    <div className="flex rounded-full border border-border bg-card p-1" aria-label="Selecionar idioma">
      {options.map((option) => (
        <motion.button
          key={option.value}
          type="button"
          onClick={() => onLanguageChange(option.value)}
          aria-label={option.value === "pt-BR" ? "Usar português" : "Use English"}
          title={option.value === "pt-BR" ? "Português" : "English"}
          className={`h-8 rounded-full px-3 text-[12px] font-medium leading-[1.45] tracking-[-0.24px] transition-colors ${
            language === option.value ? "bg-background text-foreground" : "text-muted"
          }`}
          whileHover={{ y: -1 }}
          whileTap={TAP}
          transition={SPRING}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
}

function Header({
  activePage,
  theme,
  onThemeChange,
}: {
  activePage: "home" | "about" | "projects" | "content" | "contact";
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
      className="sticky top-0 z-40 flex w-full items-center justify-between bg-background/90 px-5 py-4 backdrop-blur-md lg:h-[88px] lg:px-20 lg:py-6"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex min-w-0 flex-1 items-start px-[3px] py-0.5">
        <Logo linked />
      </div>

      <nav className="hidden shrink-0 items-center justify-center rounded-[14px] p-1 lg:flex">
        <div className="flex items-center justify-center gap-4 rounded-[44px]">
          <NavItem label={navLabels.home} href="/" active={activePage === "home"} />
          <NavItem label={navLabels.projects} href="/projetos" active={activePage === "projects"} />
          <NavItem label={navLabels.content} href="/conteudos" active={activePage === "content"} />
          <NavItem label={navLabels.about} href="/sobre" active={activePage === "about"} />
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 lg:gap-3">
        <LanguageSwitcher />
        <ThemeSwitcher theme={theme} onThemeChange={onThemeChange} />
        <motion.a
          href="/contato"
          className="hidden rounded-[10px] border border-border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary lg:block"
          whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
          whileTap={TAP}
          transition={SPRING}
        >
          {navLabels.contact}
        </motion.a>
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
          initial={prefersReducedMotion ? false : { scaleX: 0, opacity: 0, originX: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ ...SPRING, delay: 0.2 }}
        >
          <img src={avatar} alt="" className="h-full w-full object-cover" />
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
      <img src={faviconSymbol} alt="" className="size-4" />
    </div>
  );
}

function ProjectFavicon({ project }: { project: HomeProject }) {
  if (!project.icon) {
    return <Favicon />;
  }

  return (
    <div className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-background p-1.5">
      <img src={project.icon} alt="" className="max-h-full max-w-full object-contain" />
    </div>
  );
}

function ProjectCover({ project }: { project: HomeProject }) {
  if (project.id === "clinia") {
    return (
      <div className="relative h-full overflow-hidden rounded-2xl bg-[#eef5ff]">
        <img src={cliniaCover} alt="Clinia Plataforma" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }

  if (project.id === "talqui") {
    return (
      <div className="relative h-full overflow-hidden rounded-2xl bg-[#49a8ff]">
        <img src={talquiCover} alt="Talqui Plataforma" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }

  if (project.id === "petrobras") {
    return (
      <div className="relative h-full overflow-hidden rounded-2xl bg-media">
        <img
          src={petrobrasNossaEnergia}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top opacity-90"
        />
      </div>
    );
  }

  if (project.id === "orcamais") {
    return (
      <div className="relative h-full overflow-hidden rounded-2xl bg-[#0b1220]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(245,158,11,0.32),transparent_30%),radial-gradient(circle_at_82%_74%,rgba(59,130,246,0.28),transparent_34%)]" />
        <div className="absolute left-8 top-8 flex h-14 items-center rounded-2xl border border-white/10 bg-white px-5 shadow-[0_20px_80px_rgba(0,0,0,0.2)]">
          <img src={project.logo} alt="Orçamais" className="h-7 w-auto" />
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
    <div className="relative h-full overflow-hidden rounded-2xl bg-[#08080c]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,180,60,0.34),transparent_30%),radial-gradient(circle_at_78%_70%,rgba(30,144,255,0.28),transparent_36%)]" />
      <div className="absolute left-8 top-8 flex h-14 items-center rounded-2xl border border-white/10 bg-white px-5">
        <img src={project.logo} alt="Grupo Primo" className="h-7 w-auto" />
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
  const { t } = useTranslation();
  const Wrapper = project.href ? motion.a : motion.article;

  return (
    <Wrapper
      href={project.href}
      className="overflow-hidden rounded-3xl border border-border p-2 lg:h-[562px]"
      variants={sectionReveal}
      whileHover={project.href ? { y: -6, borderColor: "var(--color-primary)" } : undefined}
      whileTap={project.href ? TAP : undefined}
      transition={SPRING}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[20px] bg-card">
        <div className="relative h-[260px] shrink-0 overflow-hidden rounded-3xl bg-card p-1 sm:h-[360px] lg:h-[450px]">
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
            {project.tags[0]}
          </div>
          <div className="absolute right-4 top-4 z-10 rounded-full border border-white/8 bg-black/40 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white/90 backdrop-blur-md">
            {project.tags[1]}
          </div>
        </div>

        <div className="flex w-full gap-4 rounded-b-2xl bg-card px-5 pb-5 pt-4">
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
            <p className="text-[15px] font-normal leading-[1.45] tracking-[-0.30px] text-muted lg:text-[16px] lg:tracking-[-0.32px]">
              {project.description}
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
          className="absolute left-0 mt-2 w-48 origin-top-left rounded-xl border border-border bg-card p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.12)] z-30"
        >
          <a
            href="/cv/pt"
            target="_blank"
            className="block w-full rounded-[8px] px-3 py-2 text-left text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-foreground hover:bg-[#fafafa] dark:hover:bg-[#08080c] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            {ptLabel}
          </a>
          <a
            href="/cv/en"
            target="_blank"
            className="block w-full rounded-[8px] px-3 py-2 text-left text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-foreground hover:bg-[#fafafa] dark:hover:bg-[#08080c] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            {enLabel}
          </a>
        </motion.div>
      )}
    </div>
  );
}

function CvPrintPage({ lang }: { lang: "pt" | "en" }) {
  useEffect(() => {
    document.title = lang === "pt" 
      ? "Eduardo Amaral - Currículo" 
      : "Eduardo Amaral - CV";
  }, [lang]);

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
      aboutText: "Product Designer Sênior com mais de 5 anos de experiência transformando desafios complexos em soluções digitais intuitivas e centradas no usuário. Possuo uma abordagem versátil e ponta a ponta (end-to-end), cobrindo desde a etapa de descoberta (discovery) e pesquisa de UX até a criação de Design Systems avançados, desenvolvimento sem código (Webflow/Framer) e implementação técnica de frontend integrada a fluxos de Inteligência Artificial.",
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
      aboutText: "Senior Product Designer with 5+ years of experience turning complex challenges into intuitive, user-centered digital solutions. Possess a highly versatile, end-to-end approach, covering everything from UX research and discovery to advanced Design Systems, no-code development (Framer/Webflow), and frontend technical implementation integrated with modern AI workflows.",
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
      role: "Senior Product Designer",
      company: "Talqui",
      period: "2024",
      description: "Redesign de plataforma SaaS de atendimento com IA, criação de design system escalável com nomenclatura de tokens semânticos, construção de site institucional em Framer e protótipos em código funcional."
    },
    {
      role: "Fundador / UX Designer",
      company: "Versare Design",
      period: "2023 - Presente",
      description: "Liderança de estúdio de produto digital end-to-end, gerenciando discovery, UX/UI, sites em Framer e desenvolvimento de plataformas web/mobile inteligentes com IA. Mais de 50 projetos entregues."
    },
    {
      role: "Head of Product Design",
      company: "JStack",
      period: "2022 - 2023",
      description: "Estratégia de product design, definição de padrões de UX/UI e design systems escaláveis para plataforma de educação tech de alto engajamento."
    },
    {
      role: "Senior UX Designer",
      company: "Brivia",
      period: "2022",
      description: "Redesign do portal da Petrobras com design system aplicado a mais de 100 páginas de conteúdos editoriais. Prototipação funcional para a Escola de Influenciadores do Banco do Brasil."
    },
    {
      role: "UX Designer",
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
      role: "Senior Product Designer",
      company: "Talqui",
      period: "2024",
      description: "End-to-end redesign of Talqui's AI support platform, setup of scalable design systems with semantic design tokens, creation of their website in Framer, and functional prototyping."
    },
    {
      role: "Founder / UX Designer",
      company: "Versare Design",
      period: "2023 - Present",
      description: "Led a product studio delivering discovery, end-to-end design, Framer websites, and AI platforms. Managed design pipelines for 50+ projects with exceptional satisfaction."
    },
    {
      role: "Head of Product Design",
      company: "JStack",
      period: "2022 - 2023",
      description: "Formulated product design strategy, set UI/UX guidelines, and implemented scalable design systems for a developer education platform."
    },
    {
      role: "Senior UX Designer",
      company: "Brivia",
      period: "2022",
      description: "Directed the Petrobras portal redesign with design system patterns scaled across 100+ pages. Prototyped the Escola de Influenciadores platform for Banco do Brasil."
    },
    {
      role: "UX Designer",
      company: "Grupo Primo",
      period: "2021 - 2022",
      description: "Created tech education and finance products (Finclass, Staage, Staart). Facilitated co-creation, rapid prototyping, component structures in Figma, and frontend handoff."
    }
  ];

  const cvCourses = lang === "pt" ? [
    "Bacharelado em Administração — Faculdade Adventista do Paraná (2017 - 2020)",
    "Product Design — Design Circuit (2020 - 2021)",
    "UI Design — UX Unicórnio (2022)",
    "UI Design Especializado — UI Expert & uiBoost (2020 - 2024)",
    "Certificações adicionais em Webflow, Figma avançado e desenvolvimento moderno (OmniStack)"
  ] : [
    "Bachelor of Business Administration — Faculdade Adventista do Paraná (2017 - 2020)",
    "Product Design — Design Circuit (2020 - 2021)",
    "UI Design — UX Unicórnio (2022)",
    "Specialized UI Design — UI Expert & uiBoost (2020 - 2024)",
    "Additional certifications in Webflow, advanced Figma, and modern coding (OmniStack)"
  ];

  const cvSkills = lang === "pt" ? [
    "UX/UI Design & Discovery",
    "Design Systems & Tokens",
    "Framer & Webflow Development",
    "Protótipos em Código (AI Workflows)",
    "Figma MCP & Cursor/Claude",
    "Pesquisa & Teste de Usabilidade"
  ] : [
    "UX/UI Design & Discovery",
    "Design Systems & Design Tokens",
    "Framer & Webflow Development",
    "Code Prototyping (AI Workflows)",
    "Figma MCP & Cursor/Claude",
    "UX Research & Usability Testing"
  ];

  return (
    <div className="min-h-screen w-full bg-white text-black p-6 sm:p-12 md:py-16 md:px-24 print:p-0 print:text-black print:bg-white font-sans selection:bg-black/10">
      {/* Action Bar (hidden when printing) */}
      <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-6 print:hidden">
        <a
          href="/sobre"
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-gray-500 hover:text-black transition-colors whitespace-nowrap"
        >
          <svg viewBox="0 0 24 24" className="size-4 stroke-current" fill="none" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          {t.back}
        </a>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-[8px] bg-black px-4 py-2 text-[14px] font-medium text-white hover:bg-black/90 cursor-pointer transition-colors shadow-sm whitespace-nowrap"
        >
          <svg viewBox="0 0 24 24" className="size-4 stroke-current" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          {t.print}
        </button>
      </div>

      {/* Main CV Layout */}
      <div className="max-w-[800px] mx-auto flex flex-col gap-10 print:gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-8 print:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight text-black leading-none">
              Eduardo Amaral
            </h1>
            <p className="text-[16px] font-semibold text-gray-600 tracking-wide uppercase sm:text-right">
              {t.role}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-gray-500">
            <span className="flex items-center gap-1.5">
              📍 Paraná, Brasil
            </span>
            <a href="mailto:oi@eduardoamaral.me" className="flex items-center gap-1.5 hover:text-black transition-colors">
              ✉️ oi@eduardoamaral.me
            </a>
            <a href="https://linkedin.com/in/eduardooamaral/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-black transition-colors">
              🔗 linkedin.com/in/eduardooamaral
            </a>
            <a href="https://eduardoamaral.me" className="flex items-center gap-1.5 hover:text-black transition-colors">
              🌐 eduardoamaral.me
            </a>
          </div>
        </div>

        {/* Profile Section */}
        <section className="flex flex-col gap-3">
          <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1.5">
            {t.profile}
          </h2>
          <p className="text-[15px] leading-[1.6] text-gray-700">
            {t.aboutText}
          </p>
        </section>

        {/* Skills Section */}
        <section className="flex flex-col gap-3">
          <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1.5">
            {t.skills}
          </h2>
          <div className="flex flex-wrap gap-2 pt-1">
            {cvSkills.map(skill => (
              <span key={skill} className="rounded-[6px] border border-gray-200 bg-gray-50 px-2.5 py-1 text-[13px] font-medium text-gray-700">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className="flex flex-col gap-6">
          <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1.5">
            {t.experience}
          </h2>
          <div className="flex flex-col gap-6 print:gap-5">
            {cvExps.map(exp => (
              <article key={exp.company + exp.role} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="text-[16px] font-bold text-black">
                    {exp.role} <span className="font-normal text-gray-500">@ {exp.company}</span>
                  </h3>
                  <span className="text-[13px] font-medium text-gray-500 shrink-0">
                    {exp.period}
                  </span>
                </div>
                <p className="text-[14px] leading-[1.5] text-gray-600">
                  {exp.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="flex flex-col gap-3">
          <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1.5">
            {t.education}
          </h2>
          <ul className="flex flex-col gap-2 list-disc pl-4 text-[14px] leading-[1.5] text-gray-600">
            {cvCourses.map((course, idx) => (
              <li key={idx} className="pl-0.5">
                {course}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function AboutPage({ theme, onThemeChange }: PageProps) {
  const prefersReducedMotion = useReducedMotion();
  const { language } = useTranslation();
  const highlights = language === "en" ? aboutHighlightsEn : aboutHighlights;
  const stats = language === "en" ? aboutStatsEn : aboutStats;
  const exps = language === "en" ? experiencesEn : experiences;
  const courses = language === "en" ? trainingEn : training;

  return (
    <>
      <Header activePage="about" theme={theme} onThemeChange={onThemeChange} />
      <motion.div
        className="flex w-full flex-col gap-10 p-5 lg:gap-20 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_360px] lg:items-center lg:gap-20" variants={sectionReveal}>
          <div className="flex flex-col gap-8 items-start">
            <SectionLabel>{language === "en" ? "About" : "Sobre"}</SectionLabel>
            <h1 className="max-w-[720px] font-display text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px] sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
              {language === "en" ? "Turning complexity into clarity" : "Transformando complexidade em clareza"}
            </h1>
            <CvDropdownButton language={language} />
          </div>
          <motion.div
            className="w-full overflow-hidden rounded-[32px] border border-border bg-card p-2"
          >
            <div className="aspect-square overflow-hidden rounded-[24px] bg-media">
              <img
                src={avatar}
                alt="Eduardo Amaral"
                className="h-full w-full object-cover object-[50%_34%]"
              />
            </div>
          </motion.div>
        </motion.section>

        <motion.section className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20" variants={sectionReveal}>
          <SectionLabel>{language === "en" ? "Overview" : "Resumo"}</SectionLabel>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {highlights.map((item) => (
              <motion.p
                key={item}
                className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
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
                className="rounded-3xl border border-border bg-card p-6"
                variants={sectionReveal}
              >
                <p className="font-display text-[32px] font-medium leading-none tracking-[-1.6px] text-card-foreground lg:text-[48px] lg:tracking-[-2.4px]">
                  {item.value}
                </p>
                <p className="mt-3 text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
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
          <SectionLabel>{language === "en" ? "Experience" : "Experiência"}</SectionLabel>
          <div className="flex flex-col gap-4">
            {exps.map((item) => (
              <motion.article
                key={`${item.role}-${item.company}`}
                className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 sm:grid sm:grid-cols-[1fr_1.2fr] sm:gap-8"
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

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={sectionReveal}
        >
          <SectionLabel>{language === "en" ? "Courses & training" : "Cursos e treinamentos"}</SectionLabel>
          <div className="rounded-3xl border border-border bg-card p-2">
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[20px] bg-border sm:grid-cols-2">
              {courses.map((item) => (
                <div key={item} className="min-h-[132px] bg-card p-6">
                  <p className="text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

      </motion.div>
      <Footer />
    </>
  );
}

function VideoCard({ video, featured = false }: { video: (typeof youtubeVideos)[number]; featured?: boolean }) {
  const { t } = useTranslation();
  const href = `https://www.youtube.com/watch?v=${video.id}`;

  if (featured) {
    return (
      <motion.article
        className="flex flex-col gap-6 rounded-[32px] border border-border bg-card p-2 lg:grid lg:grid-cols-[1.35fr_0.65fr]"
        variants={sectionReveal}
      >
        <div className="aspect-video overflow-hidden rounded-[24px] bg-media">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${video.id}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="flex flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            <SectionLabel>{t.latestVideo}</SectionLabel>
            <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-card-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {video.title}
            </h2>
            <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
              {video.date}. {video.views}.
            </p>
          </div>
          <motion.a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="w-fit rounded-[10px] border border-border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary"
            whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
            whileTap={TAP}
            transition={SPRING}
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
      className="group flex min-h-[300px] flex-col overflow-hidden rounded-3xl border border-border bg-card"
      variants={sectionReveal}
      whileHover={{ y: -5, borderColor: "var(--color-primary)" }}
      whileTap={TAP}
      transition={SPRING}
    >
      <div className="aspect-video overflow-hidden bg-media">
        <img
          src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-5 p-6">
        <div className="flex flex-col gap-3">
          <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
            {video.date}
          </p>
          <h3 className="text-[24px] font-medium leading-none tracking-[-1.2px] text-card-foreground">
            {video.title}
          </h3>
        </div>
        <p className="text-[14px] leading-[1.45] tracking-[-0.42px] text-muted">
          {video.views}
        </p>
      </div>
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

function ContentPage({ theme, onThemeChange }: PageProps) {
  const prefersReducedMotion = useReducedMotion();
  const { t, language } = useTranslation();
  const [featuredVideo, ...moreVideos] = youtubeVideos;
  const feeds = language === "en" ? socialFeedSectionsEn : socialFeedSections;

  return (
    <>
      <Header activePage="content" theme={theme} onThemeChange={onThemeChange} />
      <motion.div
        className="flex w-full flex-col gap-10 p-5 lg:gap-20 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_360px] lg:items-end lg:gap-20" variants={sectionReveal}>
          <div className="flex flex-col gap-8">
            <SectionLabel>{language === "en" ? "Content" : "Conteúdos"}</SectionLabel>
            <h1 className="max-w-[760px] font-display text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px] sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
              {language === "en" ? "Design, AI, product and career across multiple channels." : "Design, IA, produto e carreira em múltiplos canais."}
            </h1>
          </div>
          <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
            {language === "en"
              ? "Check out the latest videos, posts and content from the channel."
              : "Confira os vídeos, posts e conteúdos mais recentes do canal."}
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moreVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </motion.section>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          variants={sectionReveal}
        >
          <SectionLabel>Links</SectionLabel>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {contentLinks.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                whileHover={{ y: -4, borderColor: "var(--color-primary)" }}
                whileTap={TAP}
                transition={SPRING}
              >
                {item.label}
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
                className="rounded-[10px] border border-border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary"
                whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
                whileTap={TAP}
                transition={SPRING}
              >
                {language === "en" ? "Send email" : "Enviar email"}
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
              <span className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
                {language === "en" ? "Message on WhatsApp" : "Chamar no WhatsApp"}
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
      className={`rounded-full border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] transition-colors ${
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
  const Wrapper = project.href ? motion.a : motion.article;

  return (
    <Wrapper
      href={project.href}
      className="group flex min-h-[250px] flex-col justify-between rounded-3xl border border-border bg-card p-6"
      variants={sectionReveal}
      whileHover={project.href ? { y: -5, borderColor: "var(--color-primary)" } : undefined}
      whileTap={project.href ? TAP : undefined}
      transition={SPRING}
    >
      <div className="flex items-start justify-between gap-6">
        <span className="rounded-full border border-border px-3 py-1 text-[14px] leading-[1.45] tracking-[-0.42px] text-muted">
          {project.type}
        </span>
        <span className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
          {project.status}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-card-foreground lg:text-[32px] lg:tracking-[-1.6px]">
          {project.name}
        </h2>
        <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
          {project.summary}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.deliverables.map((item) => (
            <span
              key={item}
              className="rounded-full bg-background px-3 py-1 text-[13px] leading-[1.45] tracking-[-0.39px] text-muted"
            >
              {item}
            </span>
          ))}
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
  const [typeFilter, setTypeFilter] = useState<(typeof projectTypeFilters)[number]>("Todos");
  const [deliverableFilter, setDeliverableFilter] = useState<(typeof deliverableFilters)[number]>("Todos");

  const filteredProjects = directoryProjects.filter((project) => {
    if (!project.href) return false;
    const matchesType = typeFilter === "Todos" || project.type === typeFilter;
    const matchesDeliverable =
      deliverableFilter === "Todos" || project.deliverables.includes(deliverableFilter);

    return matchesType && matchesDeliverable;
  });

  return (
    <>
      <Header activePage="projects" theme={theme} onThemeChange={onThemeChange} />
      <motion.div
        className="flex w-full flex-col gap-10 p-5 lg:gap-20 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_360px] lg:items-end lg:gap-20" variants={sectionReveal}>
          <div className="flex flex-col gap-8">
            <SectionLabel>{language === "en" ? "Projects" : "Projetos"}</SectionLabel>
            <h1 className="max-w-[760px] font-display text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px] sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
              {language === "en" ? "A catalog of the products, sites and experiences I've built." : "Um catálogo dos produtos, sites e experiências que construí."}
            </h1>
          </div>
          <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
            {language === "en"
              ? "Filter by project type and deliverables to browse product work, consulting, design system, no-code, AI, and content."
              : "Filtre por tipo de projeto e por entregáveis para navegar entre trabalhos de produto, consultoria, design system, no-code, IA e conteúdo."}
          </p>
        </motion.section>

        <motion.section className="flex flex-col gap-6 border-t border-border pt-10" variants={sectionReveal}>
          <div className="flex flex-col gap-3">
            <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
              {language === "en" ? "Type" : "Tipo"}
            </p>
            <div className="flex flex-wrap gap-2">
              {projectTypeFilters.map((item) => (
                <FilterChip key={item} label={item === "Todos" ? (language === "en" ? "All" : "Todos") : item} active={typeFilter === item} onClick={() => setTypeFilter(item)} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
              {language === "en" ? "Deliverables" : "Entregáveis"}
            </p>
            <div className="flex flex-wrap gap-2">
              {deliverableFilters.map((item) => (
                <FilterChip
                  key={item}
                  label={item === "Todos" ? (language === "en" ? "All" : "Todos") : item}
                  active={deliverableFilter === item}
                  onClick={() => setDeliverableFilter(item)}
                />
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
        <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
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
        <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
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
            href="/projetos"
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

function CaseMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-border bg-card px-4 py-2">
      <span className="text-[12px] font-medium uppercase leading-[1.45] tracking-[0.06em] text-muted">
        {label}:{" "}
      </span>
      <span className="text-[14px] leading-[1.45] tracking-[-0.42px] text-card-foreground">
        {value}
      </span>
    </div>
  );
}

function ImageLightbox({
  image,
  onClose,
}: {
  image: LightboxImage | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!image) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [image, onClose]);

  return (
    <AnimatePresence>
      {image ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 p-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
        >
          <motion.div
            className="flex max-h-full w-full max-w-[1120px] flex-col gap-4"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={SPRING}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-white">
                  {image.alt}
                </p>
                {image.caption ? (
                  <p className="mt-1 max-w-[760px] text-[14px] leading-[1.45] tracking-[-0.42px] text-white/62">
                    {image.caption}
                  </p>
                ) : null}
              </div>
              <motion.button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/18 bg-white/8 px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-white"
                whileHover={{ y: -1, borderColor: "rgba(255,255,255,0.42)" }}
                whileTap={TAP}
                transition={SPRING}
              >
                {t.close}
              </motion.button>
            </div>
            <div className="max-h-[78vh] overflow-auto rounded-[28px] border border-white/12 bg-white p-2 shadow-[0_32px_120px_rgba(0,0,0,0.42)]">
              <img src={image.src} alt={image.alt} className="h-auto w-full rounded-[20px] object-contain" />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function CaseImage({
  label,
  image = petrobrasNossaEnergiaHomeDesktop,
  position = "top",
  onOpen,
}: {
  label: string;
  image?: string;
  position?: "top" | "center" | "bottom";
  onOpen?: (image: LightboxImage) => void;
}) {
  const { t } = useTranslation();
  const objectPosition = position === "top" ? "top" : position === "bottom" ? "bottom" : "center";

  return (
    <motion.figure
      className="flex flex-col gap-4"
      variants={sectionReveal}
      transition={SPRING}
    >
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-2">
        <button
          type="button"
          onClick={() => onOpen?.({ src: image, alt: label, caption: label })}
          className="group relative block h-[240px] w-full cursor-zoom-in overflow-hidden rounded-[20px] bg-media text-left sm:h-[360px] lg:h-[460px]"
          aria-label={`${t.zoom}: ${label}`}
        >
          <img
            src={image}
            alt={label}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
            style={{ objectPosition }}
          />
          <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            {t.zoom}
          </span>
        </button>
      </div>
      <figcaption className="text-[14px] leading-[1.45] tracking-[-0.42px] text-muted">
        {label}
      </figcaption>
    </motion.figure>
  );
}

function CaseTextSection({
  eyebrow,
  title,
  stickyLabel = false,
  children,
}: {
  eyebrow: string;
  title: string;
  stickyLabel?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
      variants={sectionReveal}
    >
      <SectionLabel sticky={stickyLabel}>{eyebrow}</SectionLabel>
      <div className="flex max-w-[640px] flex-col gap-5">
        <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
          {title}
        </h2>
        <div className="flex flex-col gap-4 text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
          {children}
        </div>
      </div>
    </motion.section>
  );
}

function CmsCaseNarrative({ caseStudy }: { caseStudy?: SanityCaseStudy }) {
  const { language, t } = useTranslation();
  if (!caseStudy) return null;

  const title = language === "en" ? (caseStudy.titleEn || caseStudy.title) : caseStudy.title;
  const summary = language === "en" ? (caseStudy.summaryEn || caseStudy.summary) : caseStudy.summary;
  const stack = language === "en" ? (caseStudy.stackEn || caseStudy.stack) : caseStudy.stack;
  const sections = language === "en" ? (caseStudy.sectionsEn || caseStudy.sections) : caseStudy.sections;

  return (
    <motion.section
      className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
      variants={sectionReveal}
    >
      <SectionLabel>{t.summary}</SectionLabel>
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
                {caseStudy.client}
              </p>
              <h2 className="mt-2 text-[22px] font-medium leading-none tracking-[-1.1px] text-card-foreground lg:text-[32px] lg:tracking-[-1.6px]">
                {title}
              </h2>
            </div>
            {summary ? (
              <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                {summary}
              </p>
            ) : null}
            {stack?.length ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border px-3 py-1 text-[14px] leading-[1.45] tracking-[-0.42px] text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {sections?.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sections.map((section) => (
              <article key={`${section.eyebrow}-${section.title}`} className="rounded-3xl border border-border bg-card p-6">
                <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
                  {section.eyebrow}
                </p>
                <h3 className="mt-3 text-[24px] font-medium leading-none tracking-[-1.2px] text-card-foreground">
                  {section.title}
                </h3>
                <div className="mt-4 flex flex-col gap-3 text-[14px] leading-[1.45] tracking-[-0.42px] text-muted">
                  {section.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </motion.section>
  );
}

function DsEvidenceFigure({
  item,
  onOpen,
}: {
  item: (typeof petrobrasDsEvidence)[number];
  onOpen: (image: LightboxImage) => void;
}) {
  const { t } = useTranslation();
  return (
    <motion.figure
      className="flex flex-col gap-4"
      variants={sectionReveal}
      transition={SPRING}
    >
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-2">
        <button
          type="button"
          onClick={() => onOpen({ src: item.image, alt: item.title, caption: item.description })}
          className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[20px] bg-white text-left"
          aria-label={`${t.zoom}: ${item.title}`}
        >
          <img src={item.image} alt={item.title} className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]" />
          <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            {t.zoom}
          </span>
        </button>
      </div>
      <figcaption className="flex flex-col gap-2">
        <h3 className="text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-foreground">
          {item.title}
        </h3>
        <p className="text-[14px] leading-[1.45] tracking-[-0.42px] text-muted">
          {item.description}
        </p>
      </figcaption>
    </motion.figure>
  );
}

function CaseLightboxFigure({
  image,
  title,
  caption,
  onOpen,
  imageClassName = "h-auto w-full object-cover",
}: {
  image: string;
  title: string;
  caption: string;
  onOpen: (image: LightboxImage) => void;
  imageClassName?: string;
}) {
  const { t } = useTranslation();
  return (
    <motion.figure className="flex flex-col gap-4" variants={sectionReveal}>
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-2">
        <button
          type="button"
          onClick={() => onOpen({ src: image, alt: title, caption })}
          className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[20px] bg-white text-left"
          aria-label={`${t.zoom}: ${title}`}
        >
          <img
            src={image}
            alt={title}
            className={`${imageClassName} transition-transform duration-500 group-hover:scale-[1.01]`}
          />
          <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            {t.zoom}
          </span>
        </button>
      </div>
      <figcaption className="text-[14px] leading-[1.45] tracking-[-0.42px] text-muted">
        {caption}
      </figcaption>
    </motion.figure>
  );
}

function CliniaPrototypeSection({
  onOpen,
}: {
  onOpen: (image: LightboxImage) => void;
}) {
  return (
    <motion.section
      className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
      variants={sectionReveal}
    >
      <div className="flex flex-col gap-4">
        <SectionLabel>Prototipação real</SectionLabel>
        <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
          Claude, Cursor e MCP do Figma no fluxo.
        </h2>
      </div>
      <div className="flex flex-col gap-6">
        <CaseLightboxFigure
          image={cliniaClaudeCursorFigmaMcp}
          title="Claude, Cursor e Figma MCP aplicados na Clinia"
          caption="Uso do Claude, Cursor e MCP do Figma para criar protótipos reais e sincronizados com as interfaces do Figma."
          onOpen={onOpen}
          imageClassName="aspect-[16/9] w-full object-cover"
        />
        <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
          Usamos Claude, Cursor e MCP do Figma para criar protótipos reais sincronizados com
          as interfaces do Figma. O objetivo é reduzir a distância entre decisão de design,
          validação de fluxo e implementação.
        </p>
      </div>
    </motion.section>
  );
}

function NextCaseSection({
  nextCase,
  language,
}: {
  nextCase: "clinia" | "talqui" | "petrobras-ds" | "petrobras-ne";
  language: "en" | "pt-BR";
}) {
  const data = {
    clinia: {
      title: "Clinia",
      category: language === "en" 
        ? "Platform 2.0, design system and AI-powered workflow"
        : "Plataforma 2.0, design system e fluxo com IA",
      href: "/cases/clinia",
      coverImage: cliniaCover,
      bgClass: "bg-[#eef5ff]",
      gradientClass: "bg-gradient-to-r from-[#eef5ff] via-[#eef5ff]/88 to-[#eef5ff]/20",
      isDark: false,
    },
    talqui: {
      title: "Talqui",
      category: language === "en"
        ? "AI-powered support platform, redesign, and design system"
        : "Plataforma de atendimento com IA, redesign e design system",
      href: "/cases/talqui",
      coverImage: talquiCover,
      bgClass: "bg-[#49a8ff]",
      gradientClass: "bg-gradient-to-r from-[#49a8ff] via-[#49a8ff]/88 to-[#49a8ff]/20",
      isDark: false,
    },
    "petrobras-ds": {
      title: "Petrobras DS v2",
      category: language === "en"
        ? "Component library, design tokens and documentation"
        : "Biblioteca de componentes, design tokens e documentação",
      href: "/cases/petrobras-design-system",
      coverImage: petrobrasDsCover,
      bgClass: "bg-[#061308]",
      gradientClass: "bg-gradient-to-r from-[#061308] via-[#061308]/92 to-[#061308]/28",
      isDark: true,
    },
    "petrobras-ne": {
      title: "Nossa Energia",
      category: language === "en"
        ? "Editorial content hub connected to the design system"
        : "Portal editorial de conteúdos conectado ao design system",
      href: "/cases/petrobras-nossa-energia",
      coverImage: petrobrasNossaEnergia,
      bgClass: "bg-[#061308]",
      gradientClass: "bg-gradient-to-r from-[#061308] via-[#061308]/92 to-[#061308]/28",
      isDark: true,
    },
  }[nextCase];

  const label = language === "en" ? "Next Case Study" : "Próximo Case";

  return (
    <motion.section
      className="flex flex-col gap-6 border-t border-border pt-10 lg:pt-16"
      variants={sectionReveal}
    >
      <p className="text-[14px] font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <motion.a
        href={data.href}
        className={[
          "group relative flex min-h-[220px] sm:min-h-[280px] md:min-h-[340px] flex-col justify-between overflow-hidden rounded-[24px] sm:rounded-[32px] border border-border p-6 sm:p-8 md:p-10 transition-colors duration-300",
          data.bgClass,
        ].join(" ")}
        whileHover={{ y: -4, borderColor: "var(--color-primary)" }}
        whileTap={TAP}
        transition={SPRING}
      >
        {/* Background image container */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src={data.coverImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
          <div className={["absolute inset-0 transition-opacity duration-300", data.gradientClass].join(" ")} />
        </div>

        {/* Content wrapper */}
        <div className="relative z-10 flex h-full min-h-[160px] sm:min-h-[200px] md:min-h-[240px] flex-col justify-between gap-8">
          <div className="flex items-start justify-between gap-4">
            <h3 className={[
              "text-[32px] font-medium leading-none tracking-[-1.6px] sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px] transition-colors duration-300",
              data.isDark ? "text-white" : "text-[#08080c]",
            ].join(" ")}>
              {data.title}
            </h3>
            <div className={[
              "grid size-12 place-items-center rounded-full border transition-all duration-300 shrink-0",
              data.isDark
                ? "border-white/20 bg-white/10 text-white group-hover:border-white group-hover:bg-white group-hover:text-black"
                : "border-black/10 bg-black/5 text-[#08080c] group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground",
            ].join(" ")}>
              <svg
                viewBox="0 0 24 24"
                className="size-5 stroke-current"
                fill="none"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
          <p className={[
            "max-w-[480px] text-[15px] font-medium leading-[1.45] tracking-[-0.3px] sm:text-[17px] sm:tracking-[-0.34px] transition-colors duration-300",
            data.isDark ? "text-white/76" : "text-[#08080c]/70",
          ].join(" ")}>
            {data.category}
          </p>
        </div>
      </motion.a>
    </motion.section>
  );
}

function PetrobrasDesignSystemCasePage({
  theme,
  onThemeChange,
  cmsCase,
}: PageProps & { cmsCase?: SanityCaseStudy }) {
  const prefersReducedMotion = useReducedMotion();
  const { language, t } = useTranslation();
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const foundations = language === "en" ? petrobrasDsFoundationsEn : petrobrasDsFoundations;
  const process = language === "en" ? petrobrasDsProcessEn : petrobrasDsProcess;
  const outcomes = language === "en" ? petrobrasDsOutcomesEn : petrobrasDsOutcomes;
  const evidence = language === "en" ? petrobrasDsEvidenceEn : petrobrasDsEvidence;
  const cmsEvidence = (cmsCase?.evidence?.length ? cmsCase.evidence : petrobrasDsCmsEvidenceFallback).filter((item) => {
    const text = `${item.title || ""} ${item.caption || ""}`.toLowerCase();
    return !text.includes("capa do petrods");
  });

  return (
    <>
      <Header activePage="projects" theme={theme} onThemeChange={onThemeChange} />
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      <motion.div
        className="flex w-full flex-col gap-10 p-5 lg:gap-20 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col items-center gap-8 text-center" variants={sectionReveal}>
          <a
            href="/petrobras"
            className="self-start text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-muted"
          >
            {t.backToPetrobras}
          </a>
          <div className="flex flex-col items-center gap-4">
            <SectionLabel>Petrobras</SectionLabel>
            <h1 className="max-w-[860px] font-display text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px] sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
              {language === "en"
                ? "Petrobras Design System, the foundation of the digital ecosystem."
                : "Design System Petrobras, a base do ecossistema digital."}
            </h1>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <CaseMeta label={language === "en" ? "Role" : "Função"} value={language === "en" ? (cmsCase?.roleEn || cmsCase?.role || "Design System, UI, UX and documentation") : (cmsCase?.role || "Design System, UI, UX e documentação")} />
              <CaseMeta label="Status" value={cmsCase?.status || "2022 - 2024"} />
              <CaseMeta label="Stack" value={language === "en" ? (cmsCase?.stackEn?.join(", ") || cmsCase?.stack?.join(", ") || "Library, specs and governance") : (cmsCase?.stack?.join(", ") || "Biblioteca, specs e governança")} />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="overflow-hidden rounded-[32px] border border-border bg-card p-2"
          variants={sectionReveal}
        >
          <button
            type="button"
            onClick={() =>
              setLightboxImage({
                src: petrobrasDsCover,
                alt: "Capa do projeto Petrobras Design System",
                caption: language === "en" ? "Cover image for the Petrobras Design System case." : "Imagem de capa do case Petrobras Design System.",
              })
            }
            className="group relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-[24px] bg-[#e4f6ed] text-left"
            aria-label={language === "en" ? "Zoom in: Petrobras Design System case cover" : "Ampliar imagem: capa do case Petrobras Design System"}
          >
            <img
              src={petrobrasDsCover}
              alt="Capa do projeto Petrobras Design System"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
            />
            <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              {t.zoom}
            </span>
          </button>
        </motion.section>

        <CmsCaseNarrative caseStudy={cmsCase} />

        <CaseTextSection eyebrow={language === "en" ? "About" : "Sobre"} title={language === "en" ? "A common language for public products." : "Uma linguagem comum para produtos públicos."}>
          {language === "en" ? (
            <>
              <p>
                The Petrobras Design System v2 was structured to bring consistency to the brand's digital ecosystem,
                connecting visual decisions, components, templates, and implementation patterns into a consultable foundation.
              </p>
              <p>
                In practice, it helped sustain Nossa Energia portal, the main site, and other digital fronts
                with the same tokens, components, sections, and usage criteria.
              </p>
              <p>
                Documentation was created manually, including specs, anatomy, examples, states,
                accessibility guidance, and recommendations to reduce noise between UX, UI, content, and development.
              </p>
            </>
          ) : (
            <>
              <p>
                O Design System Petrobras v2 foi estruturado para dar consistência ao ecossistema
                digital da marca, conectando decisões visuais, componentes, templates e padrões de
                implementação em uma base consultável.
              </p>
              <p>
                Na prática, ele ajudava a sustentar o portal Nossa Energia, o site principal e outras
                frentes digitais com os mesmos tokens, componentes, sections e critérios de uso.
              </p>
              <p>
                A documentação foi feita manualmente, incluindo specs, anatomia, exemplos, estados,
                orientações de acessibilidade e recomendações para reduzir ruído entre UX, UI,
                conteúdo e desenvolvimento.
              </p>
            </>
          )}
        </CaseTextSection>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <div className="flex flex-col gap-4">
            <SectionLabel>{language === "en" ? "Evidence" : "Evidências"}</SectionLabel>
            <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "The living documentation of Petro DS v2." : "A documentação viva do Petro DS v2."}
            </h2>
          </div>
          <div className="flex flex-col gap-10">
            {cmsEvidence.map((item) =>
              item.imageUrl ? (
                <CaseLightboxFigure
                  key={item.title}
                  image={item.imageUrl}
                  title={item.title || ""}
                  caption={item.caption || ""}
                  onOpen={setLightboxImage}
                />
              ) : null
            )}
            <DsEvidenceFigure item={evidence[0]} onOpen={setLightboxImage} />
            <DsEvidenceFigure item={evidence[1]} onOpen={setLightboxImage} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <DsEvidenceFigure item={evidence[2]} onOpen={setLightboxImage} />
              <DsEvidenceFigure item={evidence[3]} onOpen={setLightboxImage} />
            </div>
          </div>
        </motion.section>

        <CaseTextSection eyebrow={language === "en" ? "Challenge" : "Desafio"} title={language === "en" ? "Scaling consistency without blocking evolution." : "Escalar consistência sem travar a evolução."}>
          {language === "en" ? (
            <>
              <p>
                The challenge was to organize a foundation large enough to serve different types of
                pages, but clear enough to be used by diverse teams in a complex institutional context.
              </p>
              <p>
                It was also necessary to create practical documentation: not just a visual library,
                but material that helped make decisions, specify interfaces, and reduce ambiguity during implementation.
              </p>
            </>
          ) : (
            <>
              <p>
                O desafio era organizar uma base grande o suficiente para atender diferentes tipos de
                páginas, mas clara o bastante para ser usada por times diversos em um contexto
                institucional complexo.
              </p>
              <p>
                Também era necessário criar uma documentação prática: não apenas uma biblioteca visual,
                mas um material que ajudasse a tomar decisões, especificar interfaces e reduzir
                ambiguidade durante a implementação.
              </p>
            </>
          )}
        </CaseTextSection>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Foundations" : "Fundações"}</SectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {foundations.map((item) => (
              <motion.article
                key={item.title}
                className="rounded-3xl border border-border bg-card p-6"
                variants={sectionReveal}
              >
                <h2 className="text-[24px] font-medium leading-none tracking-[-1.2px] text-card-foreground">
                  {item.title}
                </h2>
                <p className="mt-4 text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Process" : "Processo"}</SectionLabel>
          <div className="flex flex-col gap-6">
            <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "From mapping to reusable editorial sections." : "Do mapeamento às seções editoriais reutilizáveis."}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {process.map((item) => (
                <motion.p
                  key={item}
                  className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                  variants={sectionReveal}
                >
                  {item}
                </motion.p>
              ))}
            </div>
            <div className="rounded-[32px] border border-border bg-card p-8">
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[1fr_1.2fr] sm:gap-8">
                <div>
                  <SectionLabel>{language === "en" ? "Manual documentation" : "Documentação manual"}</SectionLabel>
                  <h2 className="mt-4 text-[22px] font-medium leading-none tracking-[-1.1px] text-card-foreground lg:text-[32px] lg:tracking-[-1.6px]">
                    {language === "en" ? "Specs as an alignment tool." : "Specs como ferramenta de alinhamento."}
                  </h2>
                </div>
                <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                  {language === "en"
                    ? "Documentation was a central part of the case. Every decision needed to be understandable outside Figma: variations, states, composition rules, responsive behavior, and usage limits were described to guide implementation across the Petrobras ecosystem."
                    : "O trabalho de documentação foi parte central do case. Cada decisão precisava ser compreensível fora do Figma: variações, estados, regras de composição, comportamento responsivo e limites de uso eram descritos para orientar a implementação no ecossistema Petrobras."}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Results" : "Resultado"}</SectionLabel>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {outcomes.map((item) => (
                <motion.p
                  key={item}
                  className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                  variants={sectionReveal}
                >
                  {item}
                </motion.p>
              ))}
            </div>
            <motion.a
              href="https://uxdudu.notion.site/Petro-DS-v2-2d88fb2f824449078175f0599d7b0b92?pvs=73"
              target="_blank"
              rel="noreferrer"
              className="w-fit rounded-[10px] border border-border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary"
              whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
              whileTap={TAP}
              transition={SPRING}
            >
              {t.viewPetroDs}
            </motion.a>
          </div>
        </motion.section>

        <CaseTextSection eyebrow={language === "en" ? "Connection" : "Relação"} title={language === "en" ? "The design system was the bridge between the Petrobras cases." : "O design system era a ponte entre os cases Petrobras."}>
          {language === "en" ? (
            <>
              <p>
                Nossa Energia can be understood as a direct application of this foundation: an editorial portal
                built on previously defined components, sections, and templates.
              </p>
              <p>
                This relationship is the most important point of the case: the value of the design system was not
                in an isolated library, but in the ability to create a foundation for multiple digital experiences
                with more consistency and speed.
              </p>
            </>
          ) : (
            <>
              <p>
                O Nossa Energia pode ser entendido como uma aplicação direta dessa base: um portal
                editorial que se apoia em componentes, sections e templates previamente definidos.
              </p>
              <p>
                Essa relação é o ponto mais importante do case: o valor do design system não estava
                em uma biblioteca isolada, mas na capacidade de criar uma fundação para múltiplas
                experiências digitais com mais consistência e velocidade.
              </p>
            </>
          )}
        </CaseTextSection>
        <NextCaseSection nextCase="petrobras-ne" language={language} />
      </motion.div>
      <Footer />
    </>
  );
}

function PetrobrasNossaEnergiaCasePage({
  theme,
  onThemeChange,
  cmsCase,
}: PageProps & { cmsCase?: SanityCaseStudy }) {
  const prefersReducedMotion = useReducedMotion();
  const { language, t } = useTranslation();
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const process = language === "en" ? caseProcessEn : caseProcess;
  const outcomes = language === "en" ? caseOutcomesEn : caseOutcomes;
  const localEvidence = [
    {
      title: language === "en" ? "Nossa Energia home, desktop" : "Home Nossa Energia, desktop",
      caption: language === "en"
        ? "Final desktop screen for the Nossa Energia editorial portal."
        : "Tela final desktop do portal editorial Nossa Energia.",
      imageUrl: petrobrasNossaEnergiaHomeDesktop,
    },
    {
      title: language === "en" ? "Nossa Energia home, mobile" : "Home Nossa Energia, mobile",
      caption: language === "en"
        ? "Final mobile screen for the Nossa Energia editorial portal."
        : "Tela final mobile do portal editorial Nossa Energia.",
      imageUrl: petrobrasNossaEnergiaHomeMobile,
    },
  ];
  const hiddenEvidenceKeywords = ["composição", "composition", "mockup da home", "notebook"];
  const hiddenEvidenceTitleKeywords = ["post", "article", "artigo"];
  const evidence = (cmsCase?.evidence?.length ? cmsCase.evidence : localEvidence).filter((item) => {
    const title = (item.title || "").toLowerCase();
    const text = `${title} ${item.caption || ""}`.toLowerCase();
    return !hiddenEvidenceKeywords.some((keyword) => text.includes(keyword))
      && !hiddenEvidenceTitleKeywords.some((keyword) => title.includes(keyword));
  });
  const homeDesktopEvidence = evidence.find((item) => item.title?.toLowerCase().includes("desktop"));
  const homeMobileEvidence = evidence.find((item) => item.title?.toLowerCase().includes("mobile"));
  const evidenceOrder = [
    "processo",
    "process",
    "mapeamento",
    "estrutura",
    "conteúdo",
    "content",
    "structure",
    "ecossistema",
    "ecosystem",
    "review",
    "incorporação",
    "incorporation",
  ];
  const orderedEvidence = evidence
    .filter((item) => item !== homeDesktopEvidence && item !== homeMobileEvidence)
    .sort((first, second) => {
      const firstTitle = first.title?.toLowerCase() || "";
      const secondTitle = second.title?.toLowerCase() || "";
      const firstIndex = evidenceOrder.findIndex((keyword) => firstTitle.includes(keyword));
      const secondIndex = evidenceOrder.findIndex((keyword) => secondTitle.includes(keyword));
      const normalizedFirstIndex = firstIndex === -1 ? Number.MAX_SAFE_INTEGER : firstIndex;
      const normalizedSecondIndex = secondIndex === -1 ? Number.MAX_SAFE_INTEGER : secondIndex;
      return normalizedFirstIndex - normalizedSecondIndex;
    });

  return (
    <>
      <Header activePage="projects" theme={theme} onThemeChange={onThemeChange} />
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      <motion.div
        className="flex w-full flex-col gap-10 p-5 lg:gap-20 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col items-center gap-8 text-center" variants={sectionReveal}>
          <a
            href="/petrobras"
            className="self-start text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-muted"
          >
            {t.backToPetrobras}
          </a>
          <div className="flex flex-col items-center gap-4">
            <SectionLabel>Petrobras</SectionLabel>
            <h1 className="max-w-[820px] font-display text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px] sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
              {language === "en"
                ? "Nossa Energia, Petrobras's content portal."
                : "Nossa Energia, o portal de conteúdos da Petrobras."}
            </h1>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <CaseMeta label={language === "en" ? "Role" : "Função"} value={language === "en" ? (cmsCase?.roleEn || cmsCase?.role || "Design System, UX, UI and Liferay collaboration") : (cmsCase?.role || "Design System, UX, UI e colaboração com Liferay")} />
              <CaseMeta label="Status" value={cmsCase?.status || "2024"} />
              <CaseMeta label="Stack" value={language === "en" ? (cmsCase?.stackEn?.join(", ") || cmsCase?.stack?.join(", ") || "Institutional editorial portal") : (cmsCase?.stack?.join(", ") || "Portal editorial institucional")} />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="overflow-hidden rounded-[32px] border border-border bg-card p-2"
          variants={sectionReveal}
        >
          <button
            type="button"
            onClick={() =>
              setLightboxImage({
                src: petrobrasNossaEnergia,
                alt: "Nossa Energia Petrobras",
                caption: language === "en" ? "Main image of the Nossa Energia Petrobras case." : "Imagem principal do case Nossa Energia Petrobras.",
              })
            }
            className="group relative block h-[260px] w-full cursor-zoom-in overflow-hidden rounded-[24px] bg-media text-left sm:h-[420px] lg:h-[600px]"
            aria-label={language === "en" ? "Zoom in: Nossa Energia Petrobras" : "Ampliar imagem: Nossa Energia Petrobras"}
          >
            <img
              src={petrobrasNossaEnergia}
              alt="Nossa Energia Petrobras"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.015]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              {t.zoom}
            </span>
          </button>
        </motion.section>

        <CmsCaseNarrative caseStudy={cmsCase} />

        <CaseTextSection
          eyebrow={language === "en" ? "About" : "Sobre"}
          title={language === "en" ? "A hub to centralize institutional content." : "Um hub para centralizar conteúdo institucional."}
          stickyLabel
        >
          {language === "en" ? (
            <>
              <p>
                Nossa Energia was designed to centralize Petrobras content in a clearer,
                more modular, and easier-to-evolve editorial experience.
              </p>
              <p>
                The project connects directly to Petrobras's design system: the same
                tokens, components, and patterns that support the portal also serve as the foundation
                for the main site and other digital fronts.
              </p>
              <p>
                An important part of the work was transforming interface decisions into practical documentation:
                specs, component usage, sections, templates, states, and guidelines to
                maintain consistency between design and implementation.
              </p>
            </>
          ) : (
            <>
              <p>
                O Nossa Energia foi pensado para centralizar conteúdos da Petrobras em uma
                experiência editorial mais clara, modular e fácil de evoluir.
              </p>
              <p>
                O projeto se conecta diretamente ao design system da Petrobras: os mesmos
                tokens, componentes e padrões que sustentam o portal também servem como base
                para o site principal e outras frentes digitais.
              </p>
              <p>
                Parte importante do trabalho foi transformar decisões de interface em documentação
                prática: specs, uso de componentes, sections, templates, estados e orientações para
                manter consistência entre design e implementação.
              </p>
            </>
          )}
        </CaseTextSection>

        <CaseTextSection
          eyebrow={language === "en" ? "Challenge" : "Desafio"}
          title={language === "en" ? "Organizing content without losing consistency." : "Organizar conteúdo sem perder consistência."}
          stickyLabel
        >
          {language === "en" ? (
            <>
              <p>
                Petrobras had institutional content and articles spread across different structures.
                The challenge was to improve publication governance, reduce visual inconsistencies,
                and allow greater editorial autonomy.
              </p>
              <p>
                Additionally, the solution needed to respect technical constraints, integrate with
                Liferay CMS, and preserve the consistency of the existing digital ecosystem.
              </p>
            </>
          ) : (
            <>
              <p>
                A Petrobras tinha conteúdos institucionais e artigos distribuídos em diferentes
                estruturas. O desafio era dar mais governança para publicação, reduzir
                inconsistências visuais e permitir maior autonomia editorial.
              </p>
              <p>
                Além disso, a solução precisava respeitar restrições técnicas, dialogar com CMS
                Liferay e preservar a consistência do ecossistema digital existente.
              </p>
            </>
          )}
        </CaseTextSection>

        {evidence.length > 0 && (
          <motion.section
            className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={staggerChildren}
          >
            <SectionLabel sticky>Nossa Energia</SectionLabel>
            <div className="flex flex-col gap-8">
              <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
                {language === "en" ? "Process maps first, final screens after." : "Mapas de processo primeiro, telas finais depois."}
              </h2>
              {orderedEvidence.map((item) =>
                item.imageUrl ? (
                  <CaseLightboxFigure
                    key={item.title}
                    image={item.imageUrl}
                    title={item.title || ""}
                    caption={item.caption || ""}
                    onOpen={setLightboxImage}
                  />
                ) : null
              )}
              {homeDesktopEvidence?.imageUrl && homeMobileEvidence?.imageUrl ? (
                <motion.div
                  className="grid grid-cols-[minmax(0,1fr)_minmax(96px,0.36fr)] gap-4"
                  variants={sectionReveal}
                >
                  <CaseLightboxFigure
                    image={homeDesktopEvidence.imageUrl}
                    title={homeDesktopEvidence.title || ""}
                    caption={homeDesktopEvidence.caption || ""}
                    onOpen={setLightboxImage}
                  />
                  <CaseLightboxFigure
                    image={homeMobileEvidence.imageUrl}
                    title={homeMobileEvidence.title || ""}
                    caption={homeMobileEvidence.caption || ""}
                    onOpen={setLightboxImage}
                  />
                </motion.div>
              ) : null}
            </div>
          </motion.section>
        )}

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel sticky>{language === "en" ? "Process" : "Processo"}</SectionLabel>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {process.map((item) => (
                <motion.p
                  key={item}
                  className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                  variants={sectionReveal}
                >
                  {item}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel sticky>{language === "en" ? "Solution" : "Solução"}</SectionLabel>
          <div className="flex flex-col gap-6">
            <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "A modular portal built from the design system." : "Um portal modular construído a partir do design system."}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {outcomes.map((item) => (
                <motion.p
                  key={item}
                  className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                  variants={sectionReveal}
                >
                  {item}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.section>

        <CaseTextSection
          eyebrow={language === "en" ? "Connection" : "Relação"}
          title={language === "en" ? "Portal, design system and main site are the same ecosystem." : "Portal, design system e site principal são o mesmo ecossistema."}
          stickyLabel
        >
          {language === "en" ? (
            <>
              <p>
                To present this project in the portfolio, the ideal approach is to first show the
                Petrobras family: Nossa Energia, design system, and main site. This helps the viewer
                understand that the value lies not in just one page, but in creating a reusable foundation
                for multiple digital products.
              </p>
              <p>
                The Petro DS v2 documentation organized Design Tokens, Components, Sections,
                Templates, Motion, and Accessibility. This material was created manually and served
                as a reference to reduce implementation ambiguity and facilitate ecosystem evolution.
              </p>
              <a
                href="https://uxdudu.notion.site/Petro-DS-v2-2d88fb2f824449078175f0599d7b0b92?pvs=73"
                target="_blank"
                rel="noreferrer"
                className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary"
              >
                {t.viewPetroDs}
              </a>
            </>
          ) : (
            <>
              <p>
                Para contar esse projeto no portfólio, o caminho ideal é mostrar primeiro a
                família Petrobras: Nossa Energia, design system e site principal. Assim a pessoa
                entende que o valor não está só em uma página, mas na criação de uma base
                reutilizável para múltiplos produtos digitais.
              </p>
              <p>
                A documentação do Petro DS v2 organizava Design Tokens, Components, Sections,
                Templates, Motion e Acessibilidade. Esse material foi criado manualmente e serviu
                como referência para reduzir ambiguidade na implementação e facilitar evolução do
                ecossistema.
              </p>
              <a
                href="https://uxdudu.notion.site/Petro-DS-v2-2d88fb2f824449078175f0599d7b0b92?pvs=73"
                target="_blank"
                rel="noreferrer"
                className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary"
              >
                Ver documentação do Petro DS v2
              </a>
            </>
          )}
        </CaseTextSection>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Live" : "No ar"}</SectionLabel>
          <div className="flex flex-col items-start gap-5">
            <h2 className="max-w-[640px] text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "See the published Nossa Energia portal." : "Veja o portal Nossa Energia publicado."}
            </h2>
            <motion.a
              href="https://nossaenergia.petrobras.com.br/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-[10px] border border-border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary"
              whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
              whileTap={TAP}
              transition={SPRING}
            >
              {language === "en" ? "View live project" : "Ver projeto no ar"}
            </motion.a>
          </div>
        </motion.section>
        <NextCaseSection nextCase="clinia" language={language} />
      </motion.div>
      <Footer />
    </>
  );
}

function CliniaCasePage({
  theme,
  onThemeChange,
  cmsCase,
}: PageProps & { cmsCase?: SanityCaseStudy }) {
  const prefersReducedMotion = useReducedMotion();
  const { language, t } = useTranslation();
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const process = language === "en" ? cliniaProcessEn : cliniaProcess;
  const outcomes = language === "en" ? cliniaOutcomesEn : cliniaOutcomes;
  const workflow = language === "en" ? cliniaWorkflowEn : cliniaWorkflow;
  const dsEvidence = language === "en" ? cliniaDesignSystemEvidenceEn : cliniaDesignSystemEvidence;
  const v1Screens = [
    {
      image: cliniaV1Inbox,
      title: language === "en" ? "Clinia v1, inbox screen" : "Versão 1 da Clinia, tela de inbox",
      caption: language === "en"
        ? "Inbox screen from the previous version of Clinia. This foundation helped map bottlenecks, scaling limitations, and opportunities for the new platform."
        : "Tela de inbox da versão anterior da Clinia. Essa base ajudou a mapear gargalos, limitações de escala e oportunidades para a nova plataforma.",
    },
    {
      image: cliniaV1Settings,
      title: language === "en" ? "Clinia v1, settings screen" : "Versão 1 da Clinia, tela de configurações",
      caption: language === "en"
        ? "Settings screen from the previous version, used in the audit to understand density, preferences organization, and navigation patterns."
        : "Tela de configurações da versão anterior, usada na auditoria para entender densidade, organização de preferências e padrões de navegação.",
    },
    {
      image: cliniaV1Login,
      title: language === "en" ? "Clinia v1, login screen" : "Versão 1 da Clinia, tela de login",
      caption: language === "en"
        ? "Login screen from the previous version, useful for understanding the original visual language, brand hierarchy, and platform entry patterns."
        : "Tela de login da versão anterior, útil para entender a linguagem visual original, hierarquia de marca e padrões de entrada na plataforma.",
    },
  ];

  return (
    <>
      <Header activePage="projects" theme={theme} onThemeChange={onThemeChange} />
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      <motion.div
        className="flex w-full flex-col gap-10 p-5 lg:gap-20 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col items-center gap-8 text-center" variants={sectionReveal}>
          <a
            href="/clinia"
            className="self-start text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-muted"
          >
            {t.backToClinia}
          </a>
          <div className="flex flex-col items-center gap-4">
            <SectionLabel>Clinia</SectionLabel>
            <h1 className="max-w-[880px] font-display text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px] sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
              {language === "en"
                ? "Platform 2.0, design system and AI-powered design-to-code workflow."
                : "Plataforma 2.0, design system e fluxo design-to-code com IA."}
            </h1>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <CaseMeta label={language === "en" ? "Role" : "Função"} value={language === "en" ? (cmsCase?.roleEn || cmsCase?.role || "Product Design, Design System and Frontend") : (cmsCase?.role || "Product Design, Design System e Frontend")} />
              <CaseMeta label="Status" value={language === "en" ? (cmsCase?.statusEn || cmsCase?.status || "Ongoing project") : (cmsCase?.status || "Projeto em andamento")} />
              <CaseMeta label="Stack" value={language === "en" ? (cmsCase?.stackEn?.join(", ") || cmsCase?.stack?.join(", ") || "Figma, shadcn, Cursor and Claude") : (cmsCase?.stack?.join(", ") || "Figma, shadcn, Cursor e Claude")} />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="overflow-hidden rounded-[32px] border border-border bg-card p-2"
          variants={sectionReveal}
        >
          <button
            type="button"
            onClick={() =>
              setLightboxImage({
                src: cliniaCover,
                alt: "Capa do projeto Clinia Plataforma",
                caption: language === "en" ? "Cover image for the Clinia case." : "Imagem de capa do case Clinia.",
              })
            }
            className="group relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-[24px] bg-[#eef5ff] text-left"
            aria-label={language === "en" ? "Zoom in: Clinia case cover" : "Ampliar imagem: capa do case Clinia"}
          >
            <img
              src={cliniaCover}
              alt="Capa do projeto Clinia Plataforma"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
            />
            <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              {t.zoom}
            </span>
          </button>
        </motion.section>

        <CmsCaseNarrative caseStudy={cmsCase} />

        <CaseTextSection eyebrow={language === "en" ? "Context" : "Contexto"} title={language === "en" ? "Version 2.0 started with understanding the problem." : "A versão 2.0 começou pelo entendimento do problema."}>
          {language === "en" ? (
            <>
              <p>
                I joined Clinia with the goal of helping build version 2.0 of the platform,
                one of the main fronts of a product that continues to evolve.
                Before proposing screens or components, the first step was to understand the pain points, bottlenecks,
                and the reason for creating a new version of an existing product.
              </p>
              <p>
                The new Clinia is built on more modern technology, closer to what mature startups
                use to scale their products. The previous version had a visual experience less aligned
                with the company's current moment and a structure that made evolution difficult.
              </p>
              <p>
                The company also didn't have a structured design system. So the work started
                with a project audit, reading the landscape, and organizing the foundations that would allow
                creating a more consistent base.
              </p>
            </>
          ) : (
            <>
              <p>
                Entrei na Clinia com o objetivo de auxiliar na construção da versão 2.0 da plataforma,
                uma das principais frentes de um produto que segue em evolução.
                Antes de propor telas ou componentes, o primeiro passo foi entender as dores, gargalos
                e o motivo de criar uma nova versão em um produto que já existia.
              </p>
              <p>
                A nova Clinia nasce com uma tecnologia mais moderna, próxima do que startups maduras
                usam para escalar produto. A versão anterior tinha uma experiência visual menos alinhada
                ao momento atual da empresa e uma estrutura que dificultava evolução.
              </p>
              <p>
                A empresa também não tinha um design system estruturado. Por isso, o trabalho começou
                com auditoria do projeto, leitura do cenário e organização das fundações que permitiriam
                criar uma base mais consistente.
              </p>
            </>
          )}
        </CaseTextSection>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          variants={sectionReveal}
        >
          <div className="flex flex-col gap-4">
            <SectionLabel>{language === "en" ? "Version 1" : "Versão 1"}</SectionLabel>
            <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "Interfaces before the rebuild." : "Interfaces antes da reconstrução."}
            </h2>
          </div>
          <div className="flex flex-col gap-8">
            {v1Screens.map((item, index) => (
              <motion.figure
                key={item.title}
                className="flex flex-col gap-4"
                variants={sectionReveal}
              >
                <div className="overflow-hidden rounded-3xl border border-border bg-card p-2">
                  <button
                    type="button"
                    onClick={() => setLightboxImage({ src: item.image, alt: item.title, caption: item.caption })}
                    className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[20px] bg-white text-left"
                    aria-label={`${t.zoom}: ${item.title}`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className={[
                        "w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]",
                        index === 0 ? "aspect-[16/8] lg:aspect-[16/7]" : "aspect-[16/8]",
                      ].join(" ")}
                    />
                    <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      {t.zoom}
                    </span>
                  </button>
                </div>
                <figcaption className="text-[14px] leading-[1.45] tracking-[-0.42px] text-muted">
                  {item.caption}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.section>

        <CaseTextSection eyebrow={language === "en" ? "Decision" : "Decisão"} title={language === "en" ? "shadcn as the bridge between identity, Figma, and frontend." : "shadcn como ponte entre identidade, Figma e frontend."}>
          {language === "en" ? (
            <>
              <p>
                When I joined, there was already a visual direction the company wanted to follow and some
                references to frontend frameworks to accelerate development. The decision was to go with
                shadcn as the component base.
              </p>
              <p>
                From there, I adapted the Figma structure to respect Clinia's visual identity while
                maintaining proximity to the real implementation. The goal was to avoid a design system
                that looked great in Figma but was far from the code.
              </p>
            </>
          ) : (
            <>
              <p>
                Quando entrei, já existia uma linha visual que a empresa queria seguir e algumas
                referências de frameworks de frontend para acelerar a construção. A decisão foi seguir
                com shadcn como base de componentes.
              </p>
              <p>
                A partir disso, adaptei a estrutura do Figma para respeitar a identidade visual da
                Clinia e, ao mesmo tempo, manter proximidade com a implementação real. O objetivo era
                evitar um design system bonito no Figma, mas distante do código.
              </p>
            </>
          )}
        </CaseTextSection>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <div className="flex flex-col gap-4">
            <SectionLabel>{language === "en" ? "Custom shadcn" : "shadcn customizado"}</SectionLabel>
            <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "Components and tokens adapted for Clinia." : "Componentes e tokens adaptados para a Clinia."}
            </h2>
          </div>
          <div className="flex flex-col gap-8">
            <CaseLightboxFigure
              image={dsEvidence[0].image}
              title={dsEvidence[0].title}
              caption={dsEvidence[0].caption}
              onOpen={setLightboxImage}
              imageClassName="aspect-[16/10] w-full object-cover"
            />
            <div className="flex flex-col gap-8">
              {dsEvidence.slice(1).map((item) => (
                <CaseLightboxFigure
                  key={item.title}
                  image={item.image}
                  title={item.title}
                  caption={item.caption}
                  onOpen={setLightboxImage}
                  imageClassName="aspect-[16/10] w-full object-cover"
                />
              ))}
            </div>
          </div>
        </motion.section>

        <CliniaPrototypeSection onOpen={setLightboxImage} />

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Process" : "Processo"}</SectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {process.map((item) => (
              <motion.p
                key={item}
                className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                variants={sectionReveal}
              >
                {item}
              </motion.p>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <div className="flex flex-col gap-4">
            <SectionLabel>Workflow</SectionLabel>
            <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "Designers also ship code." : "Designers também entregam código."}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {workflow.map((item) => (
              <motion.article
                key={item.title}
                className="rounded-3xl border border-border bg-card p-6"
                variants={sectionReveal}
              >
                <h3 className="text-[24px] font-medium leading-none tracking-[-1.2px] text-card-foreground">
                  {item.title}
                </h3>
                <p className="mt-4 text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <CaseTextSection eyebrow={language === "en" ? "AI in the process" : "IA no processo"} title={language === "en" ? "Figma, Cursor and Claude synchronized daily." : "Figma, Cursor e Claude sincronizados no dia a dia."}>
          {language === "en" ? (
            <>
              <p>
                A differentiating aspect of Clinia is that designers use Cursor and Claude as work tools.
                After syncing Figma and code, we created a separate frontend repository that is continuously
                fed with components and patterns.
              </p>
              <p>
                With this workflow, developers can use AI tools to consume the Figma design and implement
                with more speed. The deliverable stops being just a static interface and starts to include
                code, intent, and reusable structure.
              </p>
              <p>
                Alongside this foundation, we're also working on the new onboarding, statistics, CRM areas,
                and other platform evolutions, as well as the Pricing page on the site.
              </p>
            </>
          ) : (
            <>
              <p>
                Um ponto diferencial da Clinia é que designers usam Cursor e Claude como ferramentas
                de trabalho. Depois de sincronizar Figma e código, criamos um repositório de frontend
                separado que é alimentado continuamente com componentes e padrões.
              </p>
              <p>
                Com esse fluxo, desenvolvedores conseguem usar ferramentas de IA para consumir o
                design do Figma e implementar com mais velocidade. A entrega deixa de ser apenas
                interface estática e passa a incluir código, intenção e estrutura reutilizável.
              </p>
              <p>
                Paralelamente a essa base, também estamos trabalhando no novo onboarding, nas áreas de
                estatísticas, CRM e em outras evoluções da plataforma, além da página de Pricing no site.
              </p>
            </>
          )}
        </CaseTextSection>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Partial results" : "Resultado parcial"}</SectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {outcomes.map((item) => (
              <motion.p
                key={item}
                className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                variants={sectionReveal}
              >
                {item}
              </motion.p>
            ))}
          </div>
        </motion.section>
        <NextCaseSection nextCase="talqui" language={language} />
      </motion.div>
      <Footer />
    </>
  );
}

function TalquiCasePage({
  theme,
  onThemeChange,
  cmsCase,
}: PageProps & { cmsCase?: SanityCaseStudy }) {
  const prefersReducedMotion = useReducedMotion();
  const { language, t } = useTranslation();
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const foundations = language === "en" ? talquiFoundationsEn : talquiFoundations;
  const process = language === "en" ? talquiProcessEn : talquiProcess;
  const outcomes = language === "en" ? talquiOutcomesEn : talquiOutcomes;
  const hiddenTalquiEvidenceKeywords = ["mockup da plataforma talqui", "modelos de mensagem"];
  const evidence = (cmsCase?.evidence?.length ? cmsCase.evidence : talquiEvidenceFallback).filter((item) => {
    const text = `${item.title || ""} ${item.caption || ""}`.toLowerCase();
    return !hiddenTalquiEvidenceKeywords.some((keyword) => text.includes(keyword));
  });

  return (
    <>
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      <Header activePage="projects" theme={theme} onThemeChange={onThemeChange} />
      <motion.div
        className="flex w-full flex-col gap-10 p-5 lg:gap-20 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col items-center gap-8 text-center" variants={sectionReveal}>
          <a
            href="/projetos"
            className="self-start text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-muted"
          >
            {t.backToProjects}
          </a>
          <div className="flex flex-col items-center gap-4">
            <SectionLabel>Talqui</SectionLabel>
            <h1 className="max-w-[880px] font-display text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px] sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
              {language === "en"
                ? "A new platform with its own identity and a scalable design system."
                : "Uma nova plataforma com identidade própria e design system escalável."}
            </h1>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <CaseMeta label={language === "en" ? "Role" : "Função"} value={language === "en" ? (cmsCase?.roleEn || cmsCase?.role || "Product Design, UI and Design System") : (cmsCase?.role || "Product Design, UI e Design System")} />
              <CaseMeta label="Status" value={language === "en" ? (cmsCase?.statusEn || cmsCase?.status || "AI-powered support platform") : (cmsCase?.status || "Plataforma de atendimento com IA")} />
              <CaseMeta label="Stack" value={language === "en" ? (cmsCase?.stackEn?.join(", ") || cmsCase?.stack?.join(", ") || "Design tokens, DS repository and Storybook") : (cmsCase?.stack?.join(", ") || "Design tokens, repositório DS e Storybook")} />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="overflow-hidden rounded-[32px] border border-border bg-card p-2"
          variants={sectionReveal}
        >
          <button
            type="button"
            onClick={() =>
              setLightboxImage({
                src: talquiCover,
                alt: "Capa do projeto Talqui Plataforma",
                caption: language === "en" ? "Cover image for the Talqui case." : "Imagem de capa do case Talqui.",
              })
            }
            className="group relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-[24px] bg-[#49a8ff] text-left"
            aria-label={language === "en" ? "Zoom in: Talqui case cover" : "Ampliar imagem: capa do case Talqui"}
          >
            <img
              src={talquiCover}
              alt="Capa do projeto Talqui Plataforma"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
            />
            <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              {t.zoom}
            </span>
          </button>
        </motion.section>

        <CmsCaseNarrative caseStudy={cmsCase} />

        <CaseTextSection eyebrow={language === "en" ? "Context" : "Contexto"} title={language === "en" ? "The platform needed to stop looking like a technical fork." : "A plataforma precisava deixar de parecer um fork técnico."}>
          {language === "en" ? (
            <>
              <p>
                At Talqui, I built the entire new platform, from the design system to the new screens.
                The previous version had been born as a fork of an interface created by the development team,
                which solved initial needs but limited identity and scale.
              </p>
              <p>
                The main goal was to create a platform identity for Talqui: an experience
                that fit the brand, communicated the product better, and supported new features
                without depending on loose visual decisions.
              </p>
            </>
          ) : (
            <>
              <p>
                Na Talqui, construí toda a nova plataforma, desde o design system até as novas telas.
                A versão anterior havia nascido como um fork de uma interface criada pelo time de
                desenvolvimento, o que resolvia necessidades iniciais, mas limitava identidade e escala.
              </p>
              <p>
                O grande objetivo era criar uma identidade de plataforma para a Talqui: uma experiência
                que se encaixasse com a marca, comunicasse melhor o produto e sustentasse novas features
                sem depender de decisões visuais soltas.
              </p>
            </>
          )}
        </CaseTextSection>

        <CaseTextSection eyebrow="Design System" title={language === "en" ? "Tokens, components, and documentation designed for scale." : "Tokens, componentes e documentação pensados para escala."}>
          {language === "en" ? (
            <>
              <p>
                The design system was built from the ground up with scale in mind. Variables, design
                tokens, components, and patterns were organized to work as a product foundation,
                not just a collection of screens.
              </p>
              <p>
                I created the design tokens with custom naming, bringing together brand semantics,
                interface logic, and implementation. This helps the team evolve the system with less ambiguity.
              </p>
              <p>
                Developers created a dedicated repository for the design system and keep this
                material up to date, syncing the documentation with Storybook. This makes the project
                much more scalable and ready for new updates.
              </p>
            </>
          ) : (
            <>
              <p>
                O design system foi construído desde o início com escala em mente. Variáveis, design
                tokens, componentes e padrões foram organizados para funcionar como uma base de produto,
                não apenas como uma coleção de telas.
              </p>
              <p>
                Criei os design tokens com uma nomenclatura personalizada, aproximando a semântica da
                marca, a lógica de interface e a implementação. Isso ajuda o time a evoluir o sistema
                com menos ambiguidade.
              </p>
              <p>
                Os desenvolvedores criaram um repositório específico para o design system e mantêm esse
                material atualizado, sincronizando a documentação com Storybook. Isso deixa o projeto
                muito mais escalável e preparado para novas atualizações.
              </p>
            </>
          )}
        </CaseTextSection>

        {evidence.length > 0 && (
          <motion.section
            className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={staggerChildren}
          >
            <div className="flex flex-col gap-4">
              <SectionLabel>Design System</SectionLabel>
              <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
                {language === "en" ? "Tokens, components and platform in practice." : "Tokens, componentes e plataforma em prática."}
              </h2>
            </div>
            <div className="flex flex-col gap-8">
              {evidence.map((item) =>
                item.imageUrl ? (
                  <CaseLightboxFigure
                    key={item.title}
                    image={item.imageUrl}
                    title={item.title || ""}
                    caption={item.caption || ""}
                    onOpen={setLightboxImage}
                  />
                ) : null
              )}
            </div>
          </motion.section>
        )}

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Foundations" : "Fundações"}</SectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {foundations.map((item) => (
              <motion.article
                key={item.title}
                className="rounded-3xl border border-border bg-card p-6"
                variants={sectionReveal}
              >
                <h2 className="text-[24px] font-medium leading-none tracking-[-1.2px] text-card-foreground">
                  {item.title}
                </h2>
                <p className="mt-4 text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Process" : "Processo"}</SectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {process.map((item) => (
              <motion.p
                key={item}
                className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                variants={sectionReveal}
              >
                {item}
              </motion.p>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Results" : "Resultado"}</SectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {outcomes.map((item) => (
              <motion.p
                key={item}
                className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                variants={sectionReveal}
              >
                {item}
              </motion.p>
            ))}
          </div>
        </motion.section>
        <NextCaseSection nextCase="petrobras-ds" language={language} />
      </motion.div>
      <Footer />
    </>
  );
}

export function App() {
  const prefersReducedMotion = useReducedMotion();
  const { content: sanityContent } = useSanityPortfolioContent();
  const [path, setPath] = useState(() => window.location.pathname);
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
      setPath(window.location.pathname);
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

      if (url.pathname === window.location.pathname && url.hash) {
        return;
      }

      event.preventDefault();
      window.history.pushState({}, "", `${url.pathname}${url.hash}`);
      setPath(url.pathname);
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
  ) : isCliniaHub ? (
    <CliniaHubPage {...pageProps} projectOptions={cliniaProjectOptions} />
  ) : isCliniaCase ? (
    <CliniaCasePage {...pageProps} cmsCase={cliniaCase} />
  ) : isPetrobrasDesignSystemCase ? (
    <PetrobrasDesignSystemCasePage {...pageProps} cmsCase={petrobrasDesignSystemCase} />
  ) : isPetrobrasCase ? (
    <PetrobrasNossaEnergiaCasePage {...pageProps} cmsCase={petrobrasNossaEnergiaCase} />
  ) : isPetrobrasHub ? (
    <PetrobrasHubPage {...pageProps} projectOptions={petrobrasProjectOptions} />
  ) : isContact ? (
    <ContactPage {...pageProps} />
  ) : isProjects ? (
    <ProjectsPage {...pageProps} directoryProjects={directoryProjects} />
  ) : isContent ? (
    <ContentPage {...pageProps} />
  ) : isAbout ? (
    <AboutPage {...pageProps} />
  ) : (
    <HomePage {...pageProps} homeProjects={homeProjects} />
  );

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
      <main className="mx-auto flex w-[1200px] flex-col items-center overflow-x-clip bg-background">
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
            {page}
          </motion.div>
        </AnimatePresence>
      </main>
      <SpeedInsights />
    </LanguageContext.Provider>
  );
}
