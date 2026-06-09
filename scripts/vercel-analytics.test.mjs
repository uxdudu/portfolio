import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const appSource = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");

test("loads Vercel Web Analytics in the root React application", () => {
  assert.ok(packageJson.dependencies?.["@vercel/analytics"]);
  assert.match(appSource, /from "@vercel\/analytics\/react"/);
  assert.match(appSource, /<Analytics\s*\/>/);
});
