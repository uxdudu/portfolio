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

// Largura fixa de coluna; a altura de cada imagem é a natural (mantém proporção).
const COL_W = 300;
const GAP_X = 48;
const GAP_Y = 48;
const COLS = 4;
const STEP_X = COL_W + GAP_X;
const BLOCK_W = COLS * STEP_X;

export function PlaygroundPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);

  const [blockH, setBlockH] = useState(900);
  const [copies, setCopies] = useState({ x: 3, y: 3 });

  // Distribui os itens em colunas (round-robin) — alturas variam naturalmente.
  const columns = useMemo(() => {
    const cols: PlaygroundItem[][] = Array.from({ length: COLS }, () => []);
    items.forEach((item, i) => cols[i % COLS].push(item));
    return cols;
  }, []);

  // alvo (para onde vamos) e posição atual (suavizada)
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const moved = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const blockHRef = useRef(blockH);
  blockHRef.current = blockH;

  const prefersReduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // Mede a altura natural do bloco (coluna mais alta) depois das imagens carregarem.
  useLayoutEffect(() => {
    const tile = tileRef.current;
    if (!tile) return;

    const measure = () => {
      const colEls = tile.querySelectorAll<HTMLElement>("[data-col]");
      let max = 0;
      colEls.forEach((c) => (max = Math.max(max, c.offsetHeight)));
      if (max > 0) setBlockH(max + GAP_Y);
    };

    const imgs = Array.from(tile.querySelectorAll("img"));
    let pending = imgs.length;
    if (pending === 0) measure();
    imgs.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        if (--pending === 0) measure();
      } else {
        img.addEventListener(
          "load",
          () => {
            if (--pending === 0) measure();
          },
          { once: true },
        );
        img.addEventListener(
          "error",
          () => {
            if (--pending === 0) measure();
          },
          { once: true },
        );
      }
    });

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [columns]);

  // Quantas cópias do bloco cobrem a viewport + buffer.
  useLayoutEffect(() => {
    const recompute = () => {
      setCopies({
        x: Math.ceil(window.innerWidth / BLOCK_W) + 2,
        y: Math.ceil(window.innerHeight / blockH) + 2,
      });
    };
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [blockH]);

  // Loop de animação + interação.
  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    document.body.style.overflow = "hidden";

    const setX = gsap.quickSetter(surface, "x", "px");
    const setY = gsap.quickSetter(surface, "y", "px");
    const ease = prefersReduced ? 1 : 0.12;

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

      setX(gsap.utils.wrap(-BLOCK_W, 0, current.current.x));
      setY(gsap.utils.wrap(-blockHRef.current, 0, current.current.y));
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

    // Evita que um drag dispare navegação ao soltar sobre um link.
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
        offsets.push({ ox: (i - 1) * BLOCK_W, oy: (j - 1) * blockH, key: `${i}-${j}` });
      }
    }
    return offsets;
  }, [copies, blockH]);

  const renderColumns = (blockKey: string, withRef: boolean) => (
    <div
      ref={withRef ? tileRef : undefined}
      className="absolute left-0 top-0"
      style={{ width: BLOCK_W, height: blockH }}
    >
      {columns.map((col, c) => (
        <div
          key={c}
          data-col
          className="absolute top-0 flex flex-col"
          style={{ left: c * STEP_X, width: COL_W, gap: GAP_Y }}
        >
          {col.map((item, idx) => (
            <figure key={`${blockKey}-${c}-${idx}`} data-figure className="group m-0">
              <div className="overflow-hidden rounded-[6px] bg-white/5">
                <img
                  src={item.src}
                  alt={item.label}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  style={{ width: COL_W, height: "auto" }}
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
  );

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
        {blockOffsets.map(({ ox, oy, key }, index) => (
          <div
            key={key}
            className="absolute left-0 top-0"
            style={{ transform: `translate(${ox}px, ${oy}px)` }}
          >
            {renderColumns(key, index === 0)}
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
