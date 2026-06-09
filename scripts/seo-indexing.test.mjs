import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const vercelConfig = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const prerenderSource = readFileSync(new URL("./prerender.mjs", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");

const INDEXABLE_ROUTES = [
  "/",
  "/sobre",
  "/projetos",
  "/conteudos",
  "/contato",
  "/styleguide",
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
    const url = `https://eduardoamaral.me${route === "/" ? "/" : route}`;
    assert.match(sitemap, new RegExp(`<loc>${url.replaceAll("/", "\\/")}<\\/loc>`), `${route} is missing`);
  }

  assert.doesNotMatch(sitemap, /\/cv\/(?:pt|en)<\/loc>/);
});
