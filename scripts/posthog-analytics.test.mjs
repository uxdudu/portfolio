import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const mainSource = readFileSync(new URL("../src/main.tsx", import.meta.url), "utf8");
const pagesWorkflow = readFileSync(
  new URL("../.github/workflows/deploy-pages.yml", import.meta.url),
  "utf8",
);

test("initializes PostHog only when the public token is configured", () => {
  assert.match(mainSource, /if \(posthogToken\) \{/);
  assert.match(mainSource, /posthog\.init\(posthogToken,/);
});

test("sends PostHog events directly when no proxy host is configured", () => {
  assert.match(
    mainSource,
    /import\.meta\.env\.VITE_PUBLIC_POSTHOG_HOST \|\| "https:\/\/us\.i\.posthog\.com"/,
  );
});

test("injects the PostHog token and host into the GitHub Pages build", () => {
  assert.match(pagesWorkflow, /VITE_PUBLIC_POSTHOG_TOKEN:/);
  assert.match(pagesWorkflow, /VITE_PUBLIC_POSTHOG_HOST: https:\/\/us\.i\.posthog\.com/);
});
