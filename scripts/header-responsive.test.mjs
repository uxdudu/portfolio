import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const appSource = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");

test("keeps page links inside the preferences menu through tablet widths", () => {
  assert.match(
    appSource,
    /flex flex-col gap-2 border-b border-border pb-2 xl:hidden/,
  );
});

test("shows the full horizontal navigation only on wide desktop screens", () => {
  assert.match(
    appSource,
    /hidden shrink-0 items-center justify-center rounded-\[14px\] p-1 xl:flex/,
  );
});

test("keeps the contact shortcut visible on tablet", () => {
  assert.match(
    appSource,
    /hidden rounded-\[10px\].+lg:block/,
  );
});
