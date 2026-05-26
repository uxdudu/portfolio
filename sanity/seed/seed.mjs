import { createClient } from "@sanity/client";
import { caseStudies, portfolioProjects } from "./portfolioData.mjs";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN;

if (!projectId || projectId === "your-project-id") {
  throw new Error("Defina VITE_SANITY_PROJECT_ID ou SANITY_STUDIO_PROJECT_ID antes de rodar o seed.");
}

if (!token) {
  throw new Error("Defina SANITY_AUTH_TOKEN com permissão de escrita antes de rodar o seed.");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-20",
  token,
  useCdn: false,
});

const documents = [...portfolioProjects, ...caseStudies];

const transaction = documents.reduce((tx, document) => tx.createOrReplace(document), client.transaction());

await transaction.commit();

console.log(`Seed concluído: ${documents.length} documentos enviados para ${projectId}/${dataset}.`);
