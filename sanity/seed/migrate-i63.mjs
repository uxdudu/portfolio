// Migração one-shot: sobe imagens dos cases e cria os documentos caseStudy
// no projeto i63tkihc (novo CMS). Reaproveita o token do Sanity CLI logado.
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, "..", "..", "src", "assets");

const projectId = "i63tkihc";
const dataset = "production";

// Token: env SANITY_AUTH_TOKEN ou o authToken do CLI logado.
let token = process.env.SANITY_AUTH_TOKEN;
if (!token) {
  const cfg = JSON.parse(readFileSync(join(homedir(), ".config", "sanity", "config.json"), "utf8"));
  token = cfg.authToken;
}
if (!token) throw new Error("Sem token de escrita (SANITY_AUTH_TOKEN ou CLI login).");

const client = createClient({ projectId, dataset, apiVersion: "2026-05-20", token, useCdn: false });

async function upload(filename) {
  const buf = readFileSync(join(assetsDir, filename));
  const asset = await client.assets.upload("image", buf, { filename });
  console.log(`  ↑ ${filename} -> ${asset._id}`);
  return asset._id;
}

function imageField(assetId) {
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

console.log("1) Subindo imagens...");
const img = {};
for (const f of [
  "talqui-figma-variables.png",
  "talqui-figma-doc.webp",
  "talqui-storybook.webp",
  "talqui-figma0interface.webp",
  "petrods-cover.webp",
  "petrods-colors.webp",
  "petrods-template-pagina.webp",
  "petrods-variables.webp",
]) {
  img[f] = await upload(f);
}

const talqui = {
  _id: "caseStudy.talqui",
  _type: "caseStudy",
  title: "Talqui: Plataforma",
  titleEn: "Talqui: Platform",
  slug: { _type: "slug", current: "talqui" },
  client: "Talqui",
  role: "Product Design e Design System",
  roleEn: "Product Design and Design System",
  status: "Projeto em andamento",
  statusEn: "Ongoing project",
  order: 20,
  stack: ["Figma", "Design Tokens", "Storybook", "IA"],
  stackEn: ["Figma", "Design Tokens", "Storybook", "AI"],
  summary:
    "Reconstrução da plataforma Talqui a partir de uma interface antiga criada como fork técnico, criando identidade própria, design system, tokens personalizados e documentação em Storybook.",
  summaryEn:
    "Rebuilding the Talqui platform from an old interface created as a technical fork, creating its own identity, design system, custom tokens and Storybook documentation.",
  sections: [
    {
      _key: "desafio",
      eyebrow: "Desafio",
      title: "Criar identidade e escala em uma plataforma nascida como fork técnico.",
      body: [
        "A plataforma havia nascido como uma adaptação de uma interface criada pelo time de desenvolvimento. Funcionava, mas limitava a identidade visual e dificultava o crescimento do produto.",
        "O desafio era criar uma plataforma com identidade própria: uma experiência que comunicasse a marca, suportasse novas features e tivesse uma base de componentes consistente para evoluir.",
      ],
    },
    {
      _key: "solucao",
      eyebrow: "Solução",
      title: "Redesign completo com design system e documentação em Storybook.",
      body: [
        "Construí toda a plataforma nova, da identidade visual ao design system com tokens personalizados, componentes e padrões documentados.",
        "O time criou um repositório dedicado ao DS, sincronizado com Storybook. A plataforma foi redesenhada do zero e segue evoluindo com base nessa fundação.",
      ],
    },
  ],
  sectionsEn: [
    {
      _key: "challenge",
      eyebrow: "Challenge",
      title: "Creating identity and scale in a platform born as a technical fork.",
      body: [
        "The platform had been born as an adaptation of an interface created by the development team. It worked, but limited the visual identity and made product growth difficult.",
        "The challenge was to create a platform with its own identity: an experience that communicated the brand, supported new features and had a consistent component base to evolve from.",
      ],
    },
    {
      _key: "solution",
      eyebrow: "Solution",
      title: "Full redesign with design system and Storybook documentation.",
      body: [
        "I built the new platform from the visual identity to the design system, with custom tokens, components and documented patterns.",
        "The team created a dedicated DS repository, synchronized with Storybook. The platform was redesigned from scratch and continues to evolve on this foundation.",
      ],
    },
  ],
  evidence: [
    {
      _key: "talqui-design-tokens",
      title: "Variáveis e tokens do Talqui DS",
      caption:
        "Coleções de variáveis no Figma com grupos Theme, Style, Typography e Extensions organizando os tokens semânticos da plataforma Talqui.",
      image: imageField(img["talqui-figma-variables.png"]),
    },
    {
      _key: "talqui-badge-doc",
      title: "Componente Badge documentado no Figma",
      caption:
        "Componente Base Badge documentado no Figma com property table, variantes e exemplos de uso da plataforma Talqui.",
      image: imageField(img["talqui-figma-doc.webp"]),
    },
    {
      _key: "talqui-storybook",
      title: "Documentação no Storybook",
      caption:
        "Storybook do Talqui DS em design-system.talqui.dev com variantes do componente Badge: cores, outline e ícones.",
      image: imageField(img["talqui-storybook.webp"]),
    },
    {
      _key: "talqui-onboarding-button",
      title: "Fluxo de onboarding e componente Button",
      caption: "Tela de cadastro da plataforma Talqui com o componente t-base-button em uso.",
      image: imageField(img["talqui-figma0interface.webp"]),
    },
  ],
};

const petrods = {
  _id: "caseStudy.petrobras-design-system",
  _type: "caseStudy",
  title: "Petrobras: Design System",
  titleEn: "Petrobras: Design System",
  slug: { _type: "slug", current: "petrobras-design-system" },
  client: "Petrobras",
  role: "Design System e documentação",
  roleEn: "Design System and documentation",
  status: "Finalizado",
  statusEn: "Completed",
  order: 40,
  stack: ["Figma", "Notion", "Design Tokens", "Specs"],
  stackEn: ["Figma", "Notion", "Design Tokens", "Specs"],
  summary:
    "Design System Petrobras v2 com tokens, componentes, seções, templates, motion, acessibilidade e documentação manual de specs para sustentar o ecossistema digital.",
  summaryEn:
    "Petrobras Design System v2 with tokens, components, sections, templates, motion, accessibility and manual spec documentation to sustain the digital ecosystem.",
  sections: [
    {
      _key: "desafio",
      eyebrow: "Desafio",
      title: "Dar consistência a um ecossistema digital diverso e complexo.",
      body: [
        "O desafio era organizar uma base grande o suficiente para atender diferentes tipos de páginas e times, mas clara o bastante para ser usada com autonomia em um contexto institucional complexo.",
        "Também era necessário criar documentação prática que ajudasse a tomar decisões e reduzir ambiguidade durante a implementação.",
      ],
    },
    {
      _key: "solucao",
      eyebrow: "Solução",
      title: "Uma biblioteca visual e uma documentação prática.",
      body: [
        "O DS v2 conectou tokens, componentes, sections e templates em uma base consultável que sustentou o portal Nossa Energia, o site principal e outras frentes digitais.",
        "A documentação foi criada manualmente com specs, anatomia, estados e orientações de acessibilidade para manter consistência entre design e desenvolvimento.",
      ],
    },
  ],
  sectionsEn: [
    {
      _key: "challenge",
      eyebrow: "Challenge",
      title: "Bringing consistency to a diverse and complex digital ecosystem.",
      body: [
        "The challenge was to organize a foundation large enough to serve different types of pages and teams, but clear enough to be used autonomously in a complex institutional context.",
        "It was also necessary to create practical documentation that helped make decisions and reduce ambiguity during implementation.",
      ],
    },
    {
      _key: "solution",
      eyebrow: "Solution",
      title: "A visual library and practical documentation.",
      body: [
        "DS v2 connected tokens, components, sections and templates into a consultable foundation that supported the Nossa Energia portal, the main site and other digital fronts.",
        "Documentation was created manually with specs, anatomy, states and accessibility guidelines to maintain consistency between design and development.",
      ],
    },
  ],
  evidence: [
    {
      _key: "petro-ds-figma-cover",
      title: "Arquivo PetroDS v2 no Figma",
      caption: "Visão da capa do arquivo PetroDS v2 no Figma, com navegação lateral de tokens e componentes.",
      image: imageField(img["petrods-cover.webp"]),
    },
    {
      _key: "petro-ds-colors",
      title: "Tokens de cores",
      caption: "Documentação dos tokens de cores da marca no PetroDS v2.",
      image: imageField(img["petrods-colors.webp"]),
    },
    {
      _key: "petro-ds-template",
      title: "Template de página",
      caption: "Template de página do PetroDS v2 documentado em variações default e high contrast.",
      image: imageField(img["petrods-template-pagina.webp"]),
    },
    {
      _key: "petro-ds-theme-variables",
      title: "Variáveis de tema",
      caption: "Coleções de variáveis do PetroDS v2 organizadas por temas default e high contrast.",
      image: imageField(img["petrods-variables.webp"]),
    },
  ],
};

console.log("2) Criando documentos caseStudy (talqui, petrobras-design-system)...");
await client.createOrReplace(talqui);
await client.createOrReplace(petrods);
console.log("  ✓ documentos gravados");

console.log("3) Removendo docs antigos do tipo `project`...");
const oldIds = await client.fetch('*[_type=="project"]._id');
if (oldIds.length) {
  let tx = client.transaction();
  for (const id of oldIds) {
    tx = tx.delete(id);
    tx = tx.delete(`drafts.${id}`);
  }
  await tx.commit();
  console.log(`  ✓ ${oldIds.length} docs project removidos`);
} else {
  console.log("  (nenhum doc project encontrado)");
}

console.log("\nMigração concluída em " + projectId + "/" + dataset + ".");
