import type { SanityPortfolioContent } from "./sanity";
import generated from "../generated/sanityContent.json";

// O conteúdo do Sanity é buscado em build-time (scripts/fetch-sanity-content.mjs)
// e embutido como JSON estático — sem requisições nem token no cliente.
const content = generated as unknown as SanityPortfolioContent;
const hasContent = Boolean(content.projects?.length || content.caseStudies?.length);

export function useSanityPortfolioContent() {
  return {
    content,
    isLoading: false,
    isReady: hasContent,
    hasError: false,
  };
}
