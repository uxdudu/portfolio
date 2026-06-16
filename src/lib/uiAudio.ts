import { defineSound, ensureReady } from "@web-kits/audio";

const interactiveSelector = [
  "button",
  "a[href]",
  '[role="button"]',
  '[role="link"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  "select",
  "summary",
].join(",");

const pressSound = defineSound({
  layers: [
    {
      source: { type: "sine", frequency: { start: 420, end: 260 } },
      envelope: { attack: 0.001, decay: 0.055, sustain: 0, release: 0.02 },
      gain: 0.055,
    },
    {
      source: { type: "noise", color: "pink" },
      filter: { type: "bandpass", frequency: 1500, resonance: 0.8 },
      envelope: { attack: 0.001, decay: 0.022, sustain: 0, release: 0.01 },
      gain: 0.025,
    },
  ],
});

const getInteractive = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return null;
  const interactive = target.closest<HTMLElement>(interactiveSelector);
  if (!interactive || interactive.closest('[data-ui-sound="off"]')) return null;
  if (
    interactive.matches(":disabled") ||
    interactive.getAttribute("aria-disabled") === "true"
  ) {
    return null;
  }
  return interactive;
};

export function installUiAudio(root: Document = document) {
  let ready = false;
  let preparing: Promise<void> | null = null;

  const prepare = () => {
    if (ready) return Promise.resolve();
    if (!preparing) {
      preparing = ensureReady({ latencyHint: "interactive" })
        .then(() => {
          ready = true;
        })
        .catch(() => undefined);
    }
    return preparing;
  };

  const playPress = () => {
    void prepare().then(() => {
      if (ready) pressSound();
    });
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || !getInteractive(event.target)) return;
    playPress();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
    if (!getInteractive(event.target)) return;
    playPress();
  };

  root.addEventListener("pointerdown", onPointerDown);
  root.addEventListener("keydown", onKeyDown);

  return () => {
    root.removeEventListener("pointerdown", onPointerDown);
    root.removeEventListener("keydown", onKeyDown);
  };
}
