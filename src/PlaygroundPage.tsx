import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
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
import vellooBusca from "./assets/playground/velloo-busca.png";
import vellooHome from "./assets/playground/velloo-home.png";
import waiterappHome from "./assets/playground/waiterapp-home.webp";

// ── Conteúdo do canvas infinito ───────────────────────────────────────────────
// ar = largura/altura natural do print. Prints landscape (web/desktop) ganham
// span 2 (largura dupla); prints portrait (apps mobile) ficam em span 1.
type PlaygroundItem = { src: string; label: string; ar: number; span: 1 | 2 };

const items: PlaygroundItem[] = [
  { src: talquiConversas, label: "TALQUI", ar: 1.475, span: 2 },
  { src: dietaryHome, label: "DIETARY", ar: 0.462, span: 1 },
  { src: orcamaisWorkspaces, label: "ORÇAMAIS", ar: 1.5, span: 2 },
  { src: vellooHome, label: "VELLOO", ar: 0.46, span: 1 },
  { src: docomplianceHome, label: "DOCOMPLIANCE", ar: 1.5, span: 2 },
  { src: foodiaryPlano, label: "FOODIARY", ar: 0.462, span: 1 },
  { src: orcamaisCpu, label: "ORÇAMAIS", ar: 1.244, span: 2 },
  { src: fincheckHome, label: "FINCHECK", ar: 0.462, span: 1 },
  { src: marmarisFooter, label: "MARMARIS", ar: 1.266, span: 2 },
  { src: finclassJornada, label: "FINCLASS", ar: 0.462, span: 1 },
  { src: docomplianceAdd, label: "DOCOMPLIANCE", ar: 1.411, span: 2 },
  { src: vellooBusca, label: "VELLOO", ar: 0.46, span: 1 },
  { src: orcamaisBadge, label: "ORÇAMAIS DS", ar: 1.07, span: 2 },
  { src: foodiaryHome, label: "FOODIARY", ar: 0.462, span: 1 },
  { src: waiterappHome, label: "WAITERAPP", ar: 0.462, span: 1 },
];

// ── Geometria do bloco que se repete ──────────────────────────────────────────
const UNIT = 230; // largura de 1 coluna-base
const GAP = 44;
const COLS = 6; // colunas-base; span 2 ocupa duas
const CAPTION_H = 34; // espaço da legenda abaixo de cada print
const COL_STEP = UNIT + GAP;
const BLOCK_W = COLS * COL_STEP; // inclui gap final → tiles horizontais espaçados

const itemWidth = (span: number) => span * UNIT + (span - 1) * GAP;

// Masonry determinístico com spanning de colunas (shortest-column packing).
type Placed = PlaygroundItem & { x: number; y: number; w: number; h: number };

function buildBlock(): { placed: Placed[]; blockH: number } {
  const colHeights = new Array<number>(COLS).fill(0);
  const placed: Placed[] = [];

  for (const item of items) {
    const span = item.span;
    let bestCol = 0;
    let bestTop = Infinity;
    for (let c = 0; c <= COLS - span; c++) {
      let top = 0;
      for (let k = c; k < c + span; k++) top = Math.max(top, colHeights[k]);
      if (top < bestTop) {
        bestTop = top;
        bestCol = c;
      }
    }

    const w = itemWidth(span);
    const h = w / item.ar + CAPTION_H;
    const x = bestCol * COL_STEP;
    const y = bestTop;
    placed.push({ ...item, x, y, w, h });

    const bottom = y + h + GAP;
    for (let k = bestCol; k < bestCol + span; k++) colHeights[k] = bottom;
  }

  const blockH = Math.max(...colHeights);
  return { placed, blockH };
}

const { placed, blockH: BLOCK_H } = buildBlock();

export function PlaygroundPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState({ x: 3, y: 3 });

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const moved = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const prefersReduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // Quantas cópias do bloco cobrem a viewport + buffer.
  useLayoutEffect(() => {
    const recompute = () => {
      setCopies({
        x: Math.ceil(window.innerWidth / BLOCK_W) + 2,
        y: Math.ceil(window.innerHeight / BLOCK_H) + 2,
      });
    };
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);

  // Loop de animação + interação.
  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    document.body.style.overflow = "hidden";

    const setX = gsap.quickSetter(surface, "x", "px");
    const setY = gsap.quickSetter(surface, "y", "px");
    const ease = prefersReduced ? 1 : 0.12;
    const wrapX = gsap.utils.wrap(-BLOCK_W, 0);
    const wrapY = gsap.utils.wrap(-BLOCK_H, 0);

    const tick = () => {
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

    const onPointerDown = (e: PointerEvent) => {
      dragging.current = true;
      moved.current = false;
      velocity.current = { x: 0, y: 0 };
      lastPointer.current = { x: e.clientX, y: e.clientY };
      surface.setPointerCapture?.(e.pointerId);
      document.body.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true;
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

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target.current.x -= e.deltaX;
      target.current.y -= e.deltaY;
      velocity.current = { x: -e.deltaX * 0.2, y: -e.deltaY * 0.2 };
    };

    // Evita navegação acidental ao soltar um drag sobre um link.
    const onClickCapture = (e: MouseEvent) => {
      if (moved.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    surface.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    surface.addEventListener("wheel", onWheel, { passive: false });
    surface.addEventListener("click", onClickCapture, true);

    return () => {
      gsap.ticker.remove(tick);
      surface.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      surface.removeEventListener("wheel", onWheel);
      surface.removeEventListener("click", onClickCapture, true);
      document.body.style.overflow = "";
      document.body.style.cursor = "";
    };
  }, [prefersReduced]);

  // Entrada suave do conteúdo.
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
            {placed.map((item, index) => (
              <figure
                key={`${key}-${index}`}
                data-figure
                className="group absolute m-0"
                style={{ left: item.x, top: item.y, width: item.w }}
              >
                <div className="overflow-hidden rounded-[6px] bg-white/5">
                  <img
                    src={item.src}
                    alt={item.label}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    style={{ width: item.w, height: "auto" }}
                    className="block transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="pt-3 text-[11px] font-medium uppercase tracking-[0.26em] text-white/45 transition-colors duration-300 group-hover:text-white">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>

      {/* Título central fixo */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <h1 className="text-[clamp(2rem,6vw,4.5rem)] font-semibold tracking-[-0.02em] text-white drop-shadow-[0_2px_40px_rgba(0,0,0,0.85)]">
          Playground
        </h1>
      </div>

      {/* Voltar */}
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
