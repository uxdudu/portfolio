import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const helperUrl = new URL("../src/lib/analytics.ts", import.meta.url);
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const appSource = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const casePagesSource = readFileSync(new URL("../src/CasePages.tsx", import.meta.url), "utf8");
const htmlSource = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("mirrors custom events to PostHog and GA4", () => {
  assert.ok(existsSync(helperUrl), "src/lib/analytics.ts must exist");
  const helperSource = readFileSync(helperUrl, "utf8");

  assert.match(helperSource, /posthog\?\.capture\(eventName, properties\)/);
  assert.match(helperSource, /window\.gtag\?\.\("event", eventName, properties\)/);
});

test("provides explicit GA4 pageview tracking", () => {
  assert.ok(existsSync(helperUrl), "src/lib/analytics.ts must exist");
  const helperSource = readFileSync(helperUrl, "utf8");

  assert.match(helperSource, /window\.gtag\?\.\("event", "page_view"/);
  assert.match(helperSource, /page_path:/);
  assert.match(helperSource, /page_location:/);
  assert.match(helperSource, /page_title:/);
});

test("includes analytics alignment checks in the analytics test command", () => {
  assert.match(packageJson.scripts["test:analytics"], /analytics-alignment\.test\.mjs/);
});

test("routes component analytics through the shared helper", () => {
  assert.match(appSource, /import \{ trackEvent/);
  assert.match(casePagesSource, /import \{ trackEvent/);
  assert.doesNotMatch(appSource, /posthog\?\.capture\(/);
  assert.doesNotMatch(casePagesSource, /posthog\?\.capture\(/);
});

test("preserves the existing custom event taxonomy", () => {
  const sources = `${appSource}\n${casePagesSource}`;
  const eventNames = [
    "theme_changed",
    "language_changed",
    "project_card_clicked",
    "cv_downloaded",
    "youtube_video_clicked",
    "social_link_clicked",
    "contact_form_submitted",
    "whatsapp_contact_clicked",
    "project_filter_applied",
    "case_study_opened",
    "image_lightbox_opened",
  ];

  for (const eventName of eventNames) {
    assert.match(sources, new RegExp(`trackEvent\\(posthog, "${eventName}"`));
  }
});

test("tracks SPA pageviews explicitly without duplicating the initial GA4 pageview", () => {
  assert.match(
    htmlSource,
    /gtag\("config", "G-D491QJ3D4P", \{ send_page_view: false \}\)/,
  );
  assert.match(appSource, /import \{ trackEvent, trackPageView \}/);
  assert.match(
    appSource,
    /useEffect\(\(\) => \{\s*trackPageView\(\);\s*\}, \[path\]\)/,
  );
});
