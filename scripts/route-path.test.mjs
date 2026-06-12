import assert from "node:assert/strict";
import test from "node:test";

import { normalizeRoutePath } from "../src/routePath.mjs";

test("normalizes GitHub Pages trailing slashes without changing the homepage", () => {
  assert.equal(normalizeRoutePath("/"), "/");
  assert.equal(normalizeRoutePath("/cases/clinia/"), "/cases/clinia");
  assert.equal(normalizeRoutePath("/cases/petrobras-nossa-energia///"), "/cases/petrobras-nossa-energia");
});
