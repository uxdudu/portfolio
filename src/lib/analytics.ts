import type { PostHog } from "posthog-js";

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  posthog: PostHog | undefined,
  eventName: string,
  properties: AnalyticsProperties = {},
) {
  posthog?.capture(eventName, properties);
  window.gtag?.("event", eventName, properties);
}

export function trackPageView() {
  window.gtag?.("event", "page_view", {
    page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    page_location: window.location.href,
    page_title: document.title,
  });
}
