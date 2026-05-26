import { useEffect, useState } from "react";
import { getPortfolioContent, isSanityConfigured, type SanityPortfolioContent } from "./sanity";

type Status = "idle" | "loading" | "ready" | "error";

export function useSanityPortfolioContent() {
  const [content, setContent] = useState<SanityPortfolioContent | null>(null);
  const [status, setStatus] = useState<Status>(isSanityConfigured ? "loading" : "idle");

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      if (!isSanityConfigured) return;

      try {
        const nextContent = await getPortfolioContent();
        if (!cancelled) {
          setContent(nextContent);
          setStatus("ready");
        }
      } catch (error) {
        console.warn("Sanity content unavailable. Using local fallback.", error);
        if (!cancelled) setStatus("error");
      }
    }

    loadContent();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    content,
    isLoading: status === "loading",
    isReady: status === "ready",
    hasError: status === "error",
  };
}
