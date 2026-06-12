import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { orderCaseStages } from "../src/caseNarrative.mjs";

const casePagesSource = readFileSync(
  new URL("../src/CasePages.tsx", import.meta.url),
  "utf8",
);

test("orders every case as challenge, before, during and after", () => {
  const sections = [
    { id: "results", stage: "after" },
    { id: "cover", stage: "intro" },
    { id: "process-2", stage: "during" },
    { id: "challenge", stage: "challenge" },
    { id: "previous-state", stage: "before" },
    { id: "process-1", stage: "during" },
    { id: "testimonial", stage: "testimonial" },
    { id: "next", stage: "next" },
  ];

  assert.deepEqual(
    orderCaseStages(sections, (section) => section.stage).map((section) => section.id),
    [
      "cover",
      "challenge",
      "previous-state",
      "process-2",
      "process-1",
      "results",
      "testimonial",
      "next",
    ],
  );
});

test("preserves the authored order inside each narrative stage", () => {
  const sections = [
    { id: "workflow", stage: "during" },
    { id: "evidence", stage: "during" },
    { id: "solution", stage: "after" },
  ];

  assert.deepEqual(
    orderCaseStages(sections, (section) => section.stage).map((section) => section.id),
    ["workflow", "evidence", "solution"],
  );
});

test("applies all four narrative stages to every project case", () => {
  const caseNames = [
    "PetrobrasDesignSystemCasePage",
    "PetrobrasNossaEnergiaCasePage",
    "CliniaCasePage",
    "TalquiCasePage",
  ];

  for (const [index, caseName] of caseNames.entries()) {
    const start = casePagesSource.indexOf(`export function ${caseName}`);
    const end =
      index === caseNames.length - 1
        ? casePagesSource.length
        : casePagesSource.indexOf(`export function ${caseNames[index + 1]}`);
    const source = casePagesSource.slice(start, end);

    for (const stage of ["challenge", "before", "during", "after"]) {
      assert.match(
        source,
        new RegExp(`(?:caseStage|data-case-stage)="${stage}"`),
        `${caseName} is missing the ${stage} stage`,
      );
    }
  }
});

test("uses logo-only stack in the Petrobras Nossa Energia hero", () => {
  const start = casePagesSource.indexOf(
    "export function PetrobrasNossaEnergiaCasePage",
  );
  const end = casePagesSource.indexOf(
    "export function CliniaCasePage",
    start,
  );
  const source = casePagesSource.slice(start, end);

  assert.match(source, /<CaseStackLogos/);
  assert.doesNotMatch(source, /<CaseMeta label="Stack"/);

  for (const name of ["Figma", "Claude", "Notion", "Cursor"]) {
    assert.match(casePagesSource, new RegExp(`name: "${name}"`));
  }

  assert.match(casePagesSource, /stack-cursor\.svg/);
  assert.match(casePagesSource, /max-h-5 max-w-5/);
  assert.doesNotMatch(casePagesSource, /name: "Notion".*dark:invert/);
});
