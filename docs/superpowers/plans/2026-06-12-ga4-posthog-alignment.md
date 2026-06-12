# GA4 and PostHog Event Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send the portfolio's existing PostHog events and SPA pageviews to GA4 with matching names and properties.

**Architecture:** Add one analytics helper that accepts the active PostHog client and mirrors custom events to `posthog.capture` and `window.gtag`. Keep GA4 bootstrap in `index.html`, disable its automatic initial pageview, and send explicit pageviews from the React router state.

**Tech Stack:** React 19, TypeScript, PostHog JS, Google Analytics 4 `gtag.js`, Node test runner

---

### Task 1: Define the shared analytics contract

**Files:**
- Create: `src/lib/analytics.ts`
- Create: `scripts/analytics-alignment.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing tests**

Add tests that require:

```js
assert.match(helperSource, /posthog\?\.capture\(eventName, properties\)/);
assert.match(helperSource, /window\.gtag\?\.\("event", eventName, properties\)/);
assert.match(helperSource, /window\.gtag\?\.\("event", "page_view"/);
```

Also require `test:analytics` to include the new test file.

- [ ] **Step 2: Run the analytics tests**

Run: `npm run test:analytics`

Expected: FAIL because `src/lib/analytics.ts` does not exist.

- [ ] **Step 3: Implement the helper**

Create:

```ts
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
```

- [ ] **Step 4: Run the analytics tests**

Run: `npm run test:analytics`

Expected: PASS.

### Task 2: Migrate custom events

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/CasePages.tsx`
- Modify: `scripts/analytics-alignment.test.mjs`

- [ ] **Step 1: Add failing migration assertions**

Require both components to import `trackEvent`, require all existing event names to remain present, and reject direct component calls matching:

```js
/posthog\?\.capture\(/
```

- [ ] **Step 2: Run the analytics tests**

Run: `npm run test:analytics`

Expected: FAIL because components still call PostHog directly.

- [ ] **Step 3: Replace direct captures**

Import `trackEvent` from `./lib/analytics` and replace every:

```ts
posthog?.capture(eventName, properties)
```

with:

```ts
trackEvent(posthog, eventName, properties)
```

Keep `usePostHog()` and all existing event names and properties unchanged.

- [ ] **Step 4: Run the analytics tests**

Run: `npm run test:analytics`

Expected: PASS.

### Task 3: Add explicit SPA pageviews

**Files:**
- Modify: `index.html`
- Modify: `src/App.tsx`
- Modify: `scripts/analytics-alignment.test.mjs`

- [ ] **Step 1: Add failing pageview assertions**

Require:

```js
/gtag\("config", "G-D491QJ3D4P", \{ send_page_view: false \}\)/
/trackPageView\(\)/
```

- [ ] **Step 2: Run the analytics tests**

Run: `npm run test:analytics`

Expected: FAIL because GA4 still sends its automatic initial pageview and React does not send route pageviews.

- [ ] **Step 3: Implement explicit pageviews**

Change the GA bootstrap to:

```html
gtag("config", "G-D491QJ3D4P", { send_page_view: false });
```

Import `trackPageView` into `App.tsx` and add:

```ts
useEffect(() => {
  trackPageView();
}, [path]);
```

Place the effect after route metadata updates so `document.title` reflects the current route.

- [ ] **Step 4: Run tests and build**

Run:

```bash
npm run test:analytics
node --test scripts/*.test.mjs
npm run build
```

Expected: all tests and build pass.

### Task 4: Verify in production

**Files:**
- No source changes expected

- [ ] **Step 1: Commit and push**

```bash
git add index.html src/App.tsx src/CasePages.tsx src/lib/analytics.ts scripts/analytics-alignment.test.mjs package.json docs/superpowers/plans/2026-06-12-ga4-posthog-alignment.md
git commit -m "Align GA4 events with PostHog"
git push origin main
```

- [ ] **Step 2: Wait for GitHub Pages**

Confirm the `Deploy GitHub Pages` workflow completes successfully for the new commit.

- [ ] **Step 3: Verify browser requests**

Open the production site, navigate to an internal route, and trigger one custom event. Confirm network requests are sent to:

- PostHog ingestion
- Google Analytics collection

Confirm the GA request includes `en=page_view` for route navigation and the custom event name for the interaction.
