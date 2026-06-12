import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const appSource = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const navStateSource = readFileSync(new URL("../src/assets/nav-state.svg", import.meta.url), "utf8");

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

test("uses an achromatic primary color across light and dark themes", () => {
  assert.match(
    stylesSource,
    /--primary-foreground: light-dark\(oklch\(0\.145 0\.01 285\), oklch\(0\.985 0\.002 285\)\)/,
  );
  assert.doesNotMatch(stylesSource, /#3e6ff3|#8eabff/i);
  assert.match(navStateSource, /#08080C/);
});
