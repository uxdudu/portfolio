// Prerender (SSG) — renderiza cada rota num Chrome headless e salva HTML estático
// em dist/<rota>/index.html. A Vercel serve somente esses caminhos; URLs
// desconhecidas permanecem 404 em vez de retornarem a home como soft 404.
import { createServer } from "node:http";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import chromium from "@sparticuz/chromium";
import sirv from "sirv";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");
const PORT = 4180;

// Rotas públicas mais páginas de impressão, que são servidas com noindex.
const ROUTES = [
  "/",
  "/sobre",
  "/projetos",
  "/conteudos",
  "/contato",
  "/bio",
  "/styleguide",
  "/mapa-do-site",
  "/clinia",
  "/petrobras",
  "/playground",
  "/cases/clinia",
  "/cases/talqui",
  "/cases/petrobras-nossa-energia",
  "/cases/petrobras-design-system",
  "/cv/pt",
  "/cv/en",
  "/404",
];

function outPathFor(route) {
  if (route === "/") return join(distDir, "index.html");
  return join(distDir, route.replace(/^\//, ""), "index.html");
}

async function run() {
  const serve = sirv(distDir, { single: true, dev: false });
  const server = createServer((req, res) => serve(req, res));
  await new Promise((resolve) => server.listen(PORT, resolve));

  const isVercel = Boolean(process.env.VERCEL);
  const browser = await puppeteer.launch({
    headless: true,
    args: isVercel ? chromium.args : ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: isVercel ? await chromium.executablePath() : undefined,
  });

  // Renderiza TODAS as rotas em memória primeiro (servindo o dist intacto),
  // depois grava — assim sobrescrever index.html não afeta o fallback SPA.
  const rendered = [];
  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const url = req.url();
        if (url.includes("/ingest") || url.includes("posthog")) req.abort();
        else req.continue();
      });

      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: "networkidle0",
        timeout: 45000,
      });
      await page.waitForSelector("#root > *", { timeout: 20000 });
      // pequena folga para a meta da rota (title/og) ser aplicada
      await new Promise((r) => setTimeout(r, 250));

      const html = "<!doctype html>\n" + (await page.evaluate(() => document.documentElement.outerHTML));
      rendered.push({ route, html });
      console.log(`• render ${route} (${(html.length / 1024).toFixed(0)} KB)`);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  for (const { route, html } of rendered) {
    const out = outPathFor(route);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html, "utf8");
    console.log(`✓ ${route} → ${out.replace(distDir, "dist")}`);
    if (route === "/404") {
      const notFoundOut = join(distDir, "404.html");
      writeFileSync(notFoundOut, html, "utf8");
      console.log(`✓ ${route} → dist/404.html`);
    }
  }
}

run().catch((err) => {
  console.error("Prerender falhou:", err);
  process.exit(1);
});
