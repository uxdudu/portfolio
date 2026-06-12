import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const vercelConfig = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const prerenderSource = readFileSync(new URL("./prerender.mjs", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const pagesWorkflow = readFileSync(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8");
const pagesCname = readFileSync(new URL("../public/CNAME", import.meta.url), "utf8").trim();
const appSource = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const casePagesSource = readFileSync(new URL("../src/CasePages.tsx", import.meta.url), "utf8");

const INDEXABLE_ROUTES = [
  "/",
  "/sobre",
  "/projetos",
  "/conteudos",
  "/contato",
  "/mapa-do-site",
  "/clinia",
  "/petrobras",
  "/playground",
  "/cases/clinia",
  "/cases/talqui",
  "/cases/petrobras-nossa-energia",
  "/cases/petrobras-design-system",
];

test("does not rewrite every request to the homepage", () => {
  const catchAllHomepageRewrite = vercelConfig.rewrites?.find(
    ({ source, destination }) => source === "/(.*)" && destination === "/index.html",
  );

  assert.equal(
    catchAllHomepageRewrite,
    undefined,
    "The catch-all rewrite serves the homepage for unknown URLs and bypasses prerendered pages.",
  );
});

test("redirects trailing-slash variants to the canonical route", () => {
  assert.equal(vercelConfig.trailingSlash, false);
});

test("uses a serverless Chromium binary for Vercel prerendering", () => {
  assert.ok(packageJson.devDependencies?.["@sparticuz/chromium"]);
  assert.match(prerenderSource, /chromium\.executablePath\(\)/);
  assert.match(prerenderSource, /process\.env\.VERCEL/);
});

test("prerenders every public route and both CV routes", () => {
  for (const route of [...INDEXABLE_ROUTES, "/cv/pt", "/cv/en"]) {
    assert.match(prerenderSource, new RegExp(`"${route.replaceAll("/", "\\/")}"`), `${route} is not prerendered`);
  }
});

test("lists every indexable route in the sitemap and excludes CV routes", () => {
  for (const route of INDEXABLE_ROUTES) {
    const url = `https://eduardoamaral.me${route === "/" ? "/" : `${route}/`}`;
    assert.match(sitemap, new RegExp(`<loc>${url.replaceAll("/", "\\/")}<\\/loc>`), `${route} is missing`);
  }

  assert.doesNotMatch(sitemap, /\/cv\/(?:pt|en)<\/loc>/);
  assert.doesNotMatch(sitemap, /\/styleguide<\/loc>/);
});

test("sitemap only contains final URLs instead of redirecting directory URLs", () => {
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  for (const location of locations) {
    assert.match(location, /\/$/, `${location} must end with a slash`);
  }
});

test("internal page links point directly to final GitHub Pages URLs", () => {
  const sources = `${appSource}\n${casePagesSource}`;
  const redirectingLinks = [
    ...sources.matchAll(/href(?::\s*|=)["'](\/(?!$|#)[^"'?#]*[^/])["']/g),
  ].map((match) => match[1]);

  assert.deepEqual(redirectingLinks, []);
});

test("publishes the production build to GitHub Pages with the custom domain", () => {
  assert.match(pagesWorkflow, /actions\/configure-pages@v5/);
  assert.match(pagesWorkflow, /actions\/upload-pages-artifact@v4/);
  assert.match(pagesWorkflow, /actions\/deploy-pages@v4/);
  assert.match(pagesWorkflow, /run: npm run build/);
  assert.match(pagesWorkflow, /path: \.\/dist/);
  assert.equal(pagesCname, "eduardoamaral.me");
});
