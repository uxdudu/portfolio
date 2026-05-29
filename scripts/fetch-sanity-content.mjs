// Build-time: busca o conteúdo do Sanity e grava um JSON estático que o cliente
// importa. Mantém o token fora do bundle (server-side apenas). Se a busca falhar,
// preserva o JSON existente (ou grava vazio) para nunca derrubar o build.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "src", "generated");
const outFile = join(outDir, "sanityContent.json");

// --- env (carrega .env local se existir; em produção vem do ambiente Vercel) ---
function loadDotEnv() {
  const p = join(root, ".env");
  if (!existsSync(p)) return {};
  const env = {};
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}
const dotenv = loadDotEnv();
const get = (k) => process.env[k] || dotenv[k];

const projectId = get("SANITY_STUDIO_PROJECT_ID") || get("VITE_SANITY_PROJECT_ID") || "i63tkihc";
const dataset = get("SANITY_STUDIO_DATASET") || get("VITE_SANITY_DATASET") || "production";
const apiVersion = get("VITE_SANITY_API_VERSION") || "2026-05-20";

// Token server-side (nunca VITE_ em produção). Ordem: SANITY_READ_TOKEN, SANITY_AUTH_TOKEN,
// VITE_SANITY_READ_TOKEN (dev local), authToken do CLI logado.
let token = get("SANITY_READ_TOKEN") || get("SANITY_AUTH_TOKEN") || get("VITE_SANITY_READ_TOKEN");
if (!token) {
  try {
    token = JSON.parse(readFileSync(join(homedir(), ".config", "sanity", "config.json"), "utf8")).authToken;
  } catch {}
}

// Fonte de verdade da query (espelha o shape consumido pelo App).
const portfolioContentQuery = `
{
  "projects": *[_type == "portfolioProject"] | order(order asc, title asc) {
    "id": id.current, title, titleEn, tags, tagsEn, description, descriptionEn,
    href, featured, order, type, status, statusEn, summary, summaryEn,
    deliverables, group, eyebrow, eyebrowEn
  },
  "caseStudies": *[_type == "caseStudy"] | order(order asc, title asc) {
    title, titleEn, "slug": slug.current, client, role, roleEn, status, statusEn,
    summary, summaryEn, stack, stackEn,
    sections[] { eyebrow, title, body },
    sectionsEn[] { eyebrow, title, body },
    evidence[] { title, caption, "imageUrl": image.asset->url },
    testimonials[] { quote, quoteEn, author, role, roleEn, company }
  }
}`;

function writeOut(data) {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, JSON.stringify(data, null, 2) + "\n");
}

async function main() {
  if (!token) {
    console.warn("[sanity] Sem token de leitura — mantendo JSON existente / vazio.");
    if (!existsSync(outFile)) writeOut({ projects: [], caseStudies: [] });
    return;
  }

  const host = "api.sanity.io";
  const url = `https://${projectId}.${host}/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(
    portfolioContentQuery,
  )}`;

  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const { result } = await res.json();
    writeOut(result || { projects: [], caseStudies: [] });
    console.log(
      `[sanity] Conteúdo gravado: ${result?.projects?.length ?? 0} projetos, ${result?.caseStudies?.length ?? 0} cases -> src/generated/sanityContent.json`,
    );
  } catch (err) {
    console.warn(`[sanity] Falha ao buscar (${err.message}). Mantendo JSON existente / vazio.`);
    if (!existsSync(outFile)) writeOut({ projects: [], caseStudies: [] });
  }
}

await main();
