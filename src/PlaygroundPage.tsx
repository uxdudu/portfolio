import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import logo from "./assets/logo.svg";
import dietaryHome from "./assets/playground/dietary-home.webp";
import docomplianceAdd from "./assets/playground/docompliance-adicionar-documento.webp";
import docomplianceHome from "./assets/playground/docompliance-home.webp";
import fincheckHome from "./assets/playground/fincheck-home.webp";
import finclassJornada from "./assets/playground/finclass-mapa-da-jornada.webp";
import foodiaryHome from "./assets/playground/foodiary-home.webp";
import foodiaryPlano from "./assets/playground/foodiary-plano.webp";
import marmarisFooter from "./assets/playground/marmaris-travel-footer.webp";
import orcamaisBadge from "./assets/playground/orcamais-badge-documentation.webp";
import orcamaisCpu from "./assets/playground/orcamais-editar-cpu.webp";
import orcamaisWorkspaces from "./assets/playground/orcamais-workspaces.webp";
import talquiConversas from "./assets/playground/talqui-conversas.webp";
import waiterappHome from "./assets/playground/waiterapp-home.webp";

// ── Conteúdo do canvas infinito ───────────────────────────────────────────────
type PlaygroundItem = { src: string; label: string };

const items: PlaygroundItem[] = [
  { src: talquiConversas, label: "TALQUI" },
  { src: orcamaisWorkspaces, label: "ORÇAMAIS" },
  { src: docomplianceHome, label: "DOCOMPLIANCE" },
  { src: foodiaryPlano, label: "FOODIARY" },
  { src: finclassJornada, label: "FINCLASS" },
  { src: orcamaisCpu, label: "ORÇAMAIS" },
  { src: marmarisFooter, label: "MARMARIS" },
  { src: fincheckHome, label: "FINCHECK" },
  { src: docomplianceAdd, label: "DOCOMPLIANCE" },
  { src: foodiaryHome, label: "FOODIARY" },
  { src: orcamaisBadge, label: "ORÇAMAIS DS" },
  { src: waiterappHome, label: "WAITERAPP" },
  { src: dietaryHome, label: "DIETARY" },
];

// ── Geometria do bloco que se repete ──────────────────────────────────────────
const CELL_W = 320;
const IMG_H = 280;
const LABEL_H = 44;
const CELL_H = IMG_H + LABEL_H;
const GAP = 56;
const COLS = 4;
const STEP_X = CELL_W + GAP;
const STEP_Y = CELL_H + GAP;
const ROWS = Math.ceil(items.length / COLS);
const BLOCK_W = COLS * STEP_X;
const BLOCK_H = ROWS * STEP_Y;

const wrapX = gsap.utils.wrap(-BLOCK_W, 0);
const wrapY = gsap.utils.wrap(-BLOCK_H, 0);

export function PlaygroundPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState({ x: 3, y: 3 });

  // alvo (para onde estamos indo) e posição atual (suavizada)
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const prefersReduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // Quantas cópias do bloco precisamos para cobrir a viewport + buffer
  useLayoutEffect(() => {
    const recompute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setCopies({
        x: Math.ceil(vw / BLOCK_W) + 2,
        y: Math.ceil(vh / BLOCK_H) + 2,
      });
    };
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);

  // Loop de animação + interação
  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    document.body.style.overflow = "hidden";

    const setX = gsap.quickSetter(surface, "x", "px");
    const setY = gsap.quickSetter(surface, "y", "px");

    const ease = prefersReduced ? 1 : 0.12;

    const tick = () => {
      // momentum quando não está arrastando
      if (!dragging.current && !prefersReduced) {
        target.current.x += velocity.current.x;
        target.current.y += velocity.current.y;
        velocity.current.x *= 0.94;
        velocity.current.y *= 0.94;
        if (Math.abs(velocity.current.x) < 0.05) velocity.current.x = 0;
        if (Math.abs(velocity.current.y) < 0.05) velocity.current.y = 0;
      }

      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;

      setX(wrapX(current.current.x));
      setY(wrapY(current.current.y));
    };

    gsap.ticker.add(tick);

    // ── Pointer (drag) ──
    const onPointerDown = (e: PointerEvent) => {
      dragging.current = true;
      velocity.current = { x: 0, y: 0 };
      lastPointer.current = { x: e.clientX, y: e.clientY };
      surface.setPointerCapture?.(e.pointerId);
      document.body.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      target.current.x += dx;
      target.current.y += dy;
      velocity.current = { x: dx, y: dy };
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      dragging.current = false;
      surface.releasePointerCapture?.(e.pointerId);
      document.body.style.cursor = "";
    };

    // ── Wheel / trackpad pan ──
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target.current.x -= e.deltaX;
      target.current.y -= e.deltaY;
      velocity.current = { x: -e.deltaX * 0.2, y: -e.deltaY * 0.2 };
    };

    surface.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    surface.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      gsap.ticker.remove(tick);
      surface.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      surface.removeEventListener("wheel", onWheel);
      document.body.style.overflow = "";
      document.body.style.cursor = "";
    };
  }, [prefersReduced]);

  // Entrada suave do conteúdo
  useEffect(() => {
    if (prefersReduced || !containerRef.current) return;
    const figures = containerRef.current.querySelectorAll("[data-figure]");
    gsap.fromTo(
      figures,
      { opacity: 0, scale: 0.94 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: { amount: 0.6, from: "random" },
      },
    );
  }, [prefersReduced, copies]);

  // Monta as cópias do bloco
  const blockOffsets = useMemo(() => {
    const offsets: { ox: number; oy: number; key: string }[] = [];
    for (let i = 0; i < copies.x; i++) {
      for (let j = 0; j < copies.y; j++) {
        offsets.push({ ox: (i - 1) * BLOCK_W, oy: (j - 1) * BLOCK_H, key: `${i}-${j}` });
      }
    }
    return offsets;
  }, [copies]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden bg-[#0a0a0a] text-white select-none"
      style={{ touchAction: "none" }}
    >
      {/* Superfície arrastável */}
      <div
        ref={surfaceRef}
        className="absolute left-0 top-0 h-full w-full cursor-grab"
        style={{ willChange: "transform" }}
      >
        {blockOffsets.map(({ ox, oy, key }) => (
          <div
            key={key}
            className="absolute left-0 top-0"
            style={{ transform: `translate(${ox}px, ${oy}px)`, width: BLOCK_W, height: BLOCK_H }}
          >
            {items.map((item, index) => {
              const col = index % COLS;
              const row = Math.floor(index / COLS);
              return (
                <figure
                  key={`${key}-${index}`}
                  data-figure
                  className="group absolute m-0"
                  style={{ left: col * STEP_X, top: row * STEP_Y, width: CELL_W }}
                >
                  <div
                    className="overflow-hidden rounded-[4px] bg-white/5"
                    style={{ height: IMG_H }}
                  >
                    <img
                      src={item.src}
                      alt={item.label}
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <figcaption className="pt-4 text-[12px] font-medium uppercase tracking-[0.28em] text-white/45 transition-colors duration-300 group-hover:text-white">
                    {item.label}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        ))}
      </div>

      {/* Título central fixo */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <h1 className="text-[clamp(2rem,6vw,4.5rem)] font-semibold tracking-[-0.02em] text-white drop-shadow-[0_2px_40px_rgba(0,0,0,0.8)]">
          Playground
        </h1>
      </div>

      {/* Logo / voltar */}
      <a
        href="/"
        aria-label="Voltar para a home"
        className="pointer-events-auto absolute left-6 top-6 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[13px] font-medium text-white/80 backdrop-blur transition-colors hover:border-white/40 hover:text-white"
      >
        <img src={logo} alt="" className="h-4 w-[21px] invert" />
        <span>Voltar</span>
      </a>

      {/* Dica */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-white/35">
        Arraste para explorar
      </div>
    </div>
  );
}
