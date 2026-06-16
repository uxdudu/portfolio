import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const playgroundSource = await readFile(
  new URL("../src/PlaygroundPage.tsx", import.meta.url),
  "utf8",
);
const stylesSource = await readFile(
  new URL("../src/styles.css", import.meta.url),
  "utf8",
);

test("uses a single CSS pixel reveal instead of a rerunnable GSAP entrance", () => {
  assert.doesNotMatch(
    playgroundSource,
    /gsap\.fromTo\(\s*figures/,
    "the GSAP figure entrance can restart after the canvas copy count changes",
  );
  assert.match(playgroundSource, /playground-pixel-reveal/);
  assert.match(playgroundSource, /playground-dither-frame/);
  assert.match(playgroundSource, /data-loaded/);
  assert.match(stylesSource, /@keyframes playground-pixel-reveal/);
  assert.match(stylesSource, /@keyframes playground-dither-field/);
  assert.match(stylesSource, /\.playground-dither-frame\[data-loaded="false"\] img/);
  assert.doesNotMatch(stylesSource, /playground-image-resolve/);
});

test("disables the pixel reveal when reduced motion is requested", () => {
  assert.match(
    stylesSource,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.playground-pixel-reveal/,
  );
  assert.match(
    stylesSource,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.playground-dither-frame::before/,
  );
});
