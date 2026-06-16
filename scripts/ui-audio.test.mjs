import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appSource = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
const audioSource = await readFile(new URL("../src/lib/uiAudio.ts", import.meta.url), "utf8").catch(
  () => "",
);

test("installs one delegated UI audio controller for the whole application", () => {
  assert.match(appSource, /installUiAudio/);
  assert.match(audioSource, /@web-kits\/audio/);
  assert.match(audioSource, /pointerdown/);
  assert.doesNotMatch(audioSource, /pointerover/);
  assert.doesNotMatch(audioSource, /focusin/);
});

test("keeps native form fields and explicitly muted controls silent", () => {
  assert.match(audioSource, /data-ui-sound/);
  assert.match(audioSource, /disabled/);
  assert.doesNotMatch(audioSource, /textarea/);
  assert.doesNotMatch(audioSource, /input:not/);
});
