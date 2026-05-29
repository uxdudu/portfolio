// Tipos do conteúdo vindo do Sanity. A leitura acontece em build-time
// (scripts/fetch-sanity-content.mjs) e é embutida como JSON estático —
// não há requisição nem token no cliente. Ver useSanityPortfolioContent.ts.

export type SanityProject = {
  id: string;
  title: string;
  titleEn?: string;
  tags?: string[];
  tagsEn?: string[];
  description?: string;
  descriptionEn?: string;
  href?: string;
  featured?: boolean;
  order?: number;
  type?: string;
  status?: string;
  statusEn?: string;
  summary?: string;
  summaryEn?: string;
  deliverables?: string[];
  group?: "clinia" | "petrobras" | "portfolio";
  eyebrow?: string;
  eyebrowEn?: string;
};

export type SanityCaseStudy = {
  title: string;
  titleEn?: string;
  slug: string;
  client?: string;
  role?: string;
  roleEn?: string;
  status?: string;
  statusEn?: string;
  summary?: string;
  summaryEn?: string;
  stack?: string[];
  stackEn?: string[];
  sections?: Array<{
    eyebrow?: string;
    title?: string;
    body?: string[];
  }>;
  sectionsEn?: Array<{
    eyebrow?: string;
    title?: string;
    body?: string[];
  }>;
  evidence?: Array<{
    title?: string;
    caption?: string;
    imageUrl?: string;
  }>;
  testimonials?: Array<{
    quote?: string;
    quoteEn?: string;
    author?: string;
    role?: string;
    roleEn?: string;
    company?: string;
  }>;
};

export type SanityPortfolioContent = {
  projects: SanityProject[];
  caseStudies: SanityCaseStudy[];
};
