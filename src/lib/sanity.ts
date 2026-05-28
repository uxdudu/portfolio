const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2026-05-20";
const token = import.meta.env.VITE_SANITY_READ_TOKEN;

export const isSanityConfigured = Boolean(projectId && projectId !== "your-project-id");

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

export const portfolioContentQuery = `
{
  "projects": *[_type == "portfolioProject"] | order(order asc, title asc) {
    "id": id.current,
    title,
    titleEn,
    tags,
    tagsEn,
    description,
    descriptionEn,
    href,
    featured,
    order,
    type,
    status,
    statusEn,
    summary,
    summaryEn,
    deliverables,
    group,
    eyebrow,
    eyebrowEn
  },
  "caseStudies": *[_type == "caseStudy"] | order(order asc, title asc) {
    title,
    titleEn,
    "slug": slug.current,
    client,
    role,
    roleEn,
    status,
    statusEn,
    summary,
    summaryEn,
    stack,
    stackEn,
    sections[] {
      eyebrow,
      title,
      body
    },
    sectionsEn[] {
      eyebrow,
      title,
      body
    },
    evidence[] {
      title,
      caption,
      "imageUrl": image.asset->url
    },
    testimonials[] {
      quote,
      quoteEn,
      author,
      role,
      roleEn,
      company
    }
  }
}`;

export async function getPortfolioContent(): Promise<SanityPortfolioContent | null> {
  if (!isSanityConfigured) return null;

  // Query direto na API HTTP do Sanity (sem o SDK @sanity/client, ~29KB gzip).
  // CDN quando não há token (leitura pública e cacheável); api autenticada quando há token.
  const host = token ? "api.sanity.io" : "apicdn.sanity.io";
  const url = `https://${projectId}.${host}/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(
    portfolioContentQuery,
  )}`;

  const response = await fetch(url, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  if (!response.ok) {
    throw new Error(`Sanity query failed: ${response.status} ${response.statusText}`);
  }

  const { result } = (await response.json()) as { result: SanityPortfolioContent };
  return result;
}
