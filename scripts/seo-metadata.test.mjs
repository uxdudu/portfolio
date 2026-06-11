import assert from "node:assert/strict";
import test from "node:test";

import { getRouteSeo, getSiteStructuredData } from "../src/seo.mjs";

test("uses a stable trailing slash canonical for the homepage", () => {
  assert.equal(getRouteSeo("/", false).canonical, "https://eduardoamaral.me/");
});

test("removes query parameters, fragments and trailing slashes from canonicals", () => {
  assert.equal(
    getRouteSeo("/projetos/?tipo=produto#cases", false).canonical,
    "https://eduardoamaral.me/projetos",
  );
});

test("keeps internal utility pages out of the search index", () => {
  assert.equal(getRouteSeo("/styleguide", false).robots, "noindex, follow");
  assert.equal(getRouteSeo("/cv/pt", false).robots, "noindex, follow");
  assert.equal(getRouteSeo("/cv/en", true).robots, "noindex, follow");
});

test("describes case studies with specific, page-level metadata", () => {
  const seo = getRouteSeo("/cases/petrobras-design-system", false);

  assert.match(seo.description, /100 páginas/);
  assert.match(seo.description, /6 dias para meio dia/);
  assert.equal(seo.openGraphType, "article");
  assert.equal(seo.structuredData["@type"], "CreativeWork");
  assert.equal(seo.structuredData.author["@id"], "https://eduardoamaral.me/#person");
});

test("uses a relevant large image for each case instead of the generic site card", () => {
  const casePaths = [
    "/cases/clinia",
    "/cases/talqui",
    "/cases/petrobras-nossa-energia",
    "/cases/petrobras-design-system",
  ];

  for (const path of casePaths) {
    const seo = getRouteSeo(path, false);
    assert.notEqual(seo.image, "https://eduardoamaral.me/og-image.png");
    assert.equal(seo.structuredData.image, seo.image);
  }
});

test("identifies the homepage as Eduardo's profile page", () => {
  const seo = getRouteSeo("/", false);

  assert.equal(seo.structuredData["@type"], "ProfilePage");
  assert.equal(seo.structuredData.mainEntity["@id"], "https://eduardoamaral.me/#person");
});

test("declares the site and person entities referenced by page schemas", () => {
  const graph = getSiteStructuredData()["@graph"];

  assert.ok(graph.some((item) => item["@id"] === "https://eduardoamaral.me/#website"));
  assert.ok(graph.some((item) => item["@id"] === "https://eduardoamaral.me/#person"));
});

test("uses the active language in page structured data", () => {
  assert.equal(getRouteSeo("/sobre", true).structuredData.inLanguage, "en");
  assert.equal(getRouteSeo("/sobre", false).structuredData.inLanguage, "pt-BR");
});
