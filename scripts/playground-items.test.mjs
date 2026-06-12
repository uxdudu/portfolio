import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const playgroundSource = readFileSync(
  new URL("../src/PlaygroundPage.tsx", import.meta.url),
  "utf8",
);

test("includes the input prompt questions study in the playground", () => {
  assert.match(playgroundSource, /input-prompt-questions\.webp/);
  assert.match(
    playgroundSource,
    /\{ src: inputPromptQuestions, label: "INPUT PROMPT", ar: 1\.086, span: 2 \}/,
  );
});
