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

const hoverSound = defineSound({
  source: { type: "triangle", frequency: { start: 760, end: 620 } },
  envelope: { attack: 0.002, decay: 0.035, sustain: 0, release: 0.015 },
  filter: { type: "lowpass", frequency: 2200 },
  gain: 0.035,
});

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
  let lastHovered: HTMLElement | null = null;

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

  const onPointerOver = (event: PointerEvent) => {
    if (event.pointerType === "touch" || !ready) return;
    const interactive = getInteractive(event.target);
    if (!interactive || interactive === lastHovered) return;
    lastHovered = interactive;
    hoverSound();
  };

  const onPointerOut = (event: PointerEvent) => {
    const interactive = getInteractive(event.target);
    if (!interactive) return;
    const next = getInteractive(event.relatedTarget);
    if (next !== interactive) lastHovered = null;
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || !getInteractive(event.target)) return;
    playPress();
  };

  const onFocusIn = (event: FocusEvent) => {
    if (!ready || !getInteractive(event.target)) return;
    hoverSound({ volume: 0.8 });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
    if (!getInteractive(event.target)) return;
    playPress();
  };

  root.addEventListener("pointerover", onPointerOver);
  root.addEventListener("pointerout", onPointerOut);
  root.addEventListener("pointerdown", onPointerDown);
  root.addEventListener("focusin", onFocusIn);
  root.addEventListener("keydown", onKeyDown);

  return () => {
    root.removeEventListener("pointerover", onPointerOver);
    root.removeEventListener("pointerout", onPointerOut);
    root.removeEventListener("pointerdown", onPointerDown);
    root.removeEventListener("focusin", onFocusIn);
    root.removeEventListener("keydown", onKeyDown);
  };
}
