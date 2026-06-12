import { Children, Fragment, cloneElement, isValidElement, useEffect, useState, type ComponentProps, type ReactNode } from "react";
import { usePostHog } from "@posthog/react";
import { trackEvent } from "./lib/analytics";
import { SmoothCorners } from "@lisse/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { orderCaseStages } from "./caseNarrative.mjs";
import type { SanityCaseStudy } from "./lib/sanity";
import cliniaShadcnFoundation from "./assets/clinia-shadcn-foundation.webp";
import cliniaClaudeCursorFigmaMcp from "./assets/clinia-claude-cursor-figma-mcp.webp";
import cliniaCover from "./assets/clinia-cover.webp";
import cliniaV1Inbox from "./assets/clinia-v1-inbox.webp";
import cliniaV1Login from "./assets/clinia-v1-login.webp";
import cliniaV1Settings from "./assets/clinia-v1-settings.webp";
import petrobrasNossaEnergia from "./assets/case-petrobras-nossa-energia.webp";
import petrobrasNossaEnergiaHomeDesktop from "./assets/petrobras-nossa-energia-home-desktop.webp";
import petrobrasNossaEnergiaHomeMobile from "./assets/petrobras-nossa-energia-home-mobile.webp";
import petrobrasDsCover from "./assets/petrobras-ds-cover.webp";
import stackClaude from "./assets/stack-claude.svg";
import stackCursor from "./assets/stack-cursor.svg";
import stackFigma from "./assets/stack-figma.svg";
import stackNotion from "./assets/stack-notion.svg";
import talquiCover from "./assets/talqui-cover.webp";
import {
  Header,
  Footer,
  SectionLabel,
  useTranslation,
  SPRING,
  TAP,
  sectionReveal,
  staggerChildren,
  caseProcess,
  caseProcessEn,
  caseOutcomes,
  caseOutcomesEn,
  cliniaProcess,
  cliniaProcessEn,
  cliniaWorkflow,
  cliniaWorkflowEn,
  cliniaOutcomes,
  cliniaOutcomesEn,
  cliniaDesignSystemEvidence,
  cliniaDesignSystemEvidenceEn,
  petrobrasDsProcess,
  petrobrasDsProcessEn,
  petrobrasDsFoundations,
  petrobrasDsFoundationsEn,
  petrobrasDsEvidence,
  petrobrasDsEvidenceEn,
  petrobrasDsCmsEvidenceFallback,
  talquiProcess,
  talquiProcessEn,
  talquiFoundations,
  talquiFoundationsEn,
  talquiOutcomes,
  talquiOutcomesEn,
  talquiEvidenceFallback,
  experiences,
  projects,
} from "./App";
import type { PageProps, LightboxImage } from "./App";

type CaseNarrativeStage =
  | "intro"
  | "challenge"
  | "before"
  | "during"
  | "after"
  | "testimonial"
  | "next";

type CaseStageProps = {
  caseStage?: CaseNarrativeStage;
};

function CaseNarrativeLayout({
  children,
  className,
  ...motionProps
}: {
  children: ReactNode;
  className: string;
} & Omit<ComponentProps<typeof motion.div>, "children" | "className">) {
  const orderedChildren = orderCaseStages(
    Children.toArray(children),
    (child) =>
      isValidElement<CaseStageProps>(child)
        ? child.props.caseStage ||
          (child.props as CaseStageProps & { "data-case-stage"?: CaseNarrativeStage })[
            "data-case-stage"
          ] ||
          "intro"
        : "intro",
  );
  const keyedChildren = orderedChildren.map((child, index) =>
    isValidElement(child)
      ? cloneElement(child, { key: `${child.key ?? "case-section"}-${index}` })
      : child,
  );

  return (
    <motion.div className={className} {...motionProps}>
      {keyedChildren}
    </motion.div>
  );
}

function CaseMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-border bg-card px-4 py-2">
      <span className="text-[12px] font-medium uppercase leading-[1.45] tracking-[0.06em] text-muted">
        {label}:{" "}
      </span>
      <span className="text-[14px] leading-[1.45] tracking-[-0.42px] text-card-foreground">
        {value}
      </span>
    </div>
  );
}

type StackLogo = {
  key: string;
  name: string;
  src?: string;
  icon?: ReactNode;
};

const stackLogoIcons: Record<string, Omit<StackLogo, "name">> = {
  figma: { key: "figma", src: stackFigma },
  "figma mcp": { key: "figma", src: stackFigma },
  claude: { key: "claude", src: stackClaude },
  notion: { key: "notion", src: stackNotion },
  cursor: { key: "cursor", src: stackCursor },
  shadcn: {
    key: "shadcn",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m6 15 3-3m-1 7 11-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  storybook: {
    key: "storybook",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6.8 3.8 17.9 3l.7 18-12.5-1Z" fill="#ff4785" />
        <path d="m14.7 2.9-.1 3.2 1.4-1 .9.7-.1-3Z" fill="white" />
        <path d="M14.2 9.2c-.7-.5-1.4-.8-2.2-.8-.9 0-1.4.4-1.4 1 0 .7.7.9 1.7 1.2 1.7.5 3 1.2 3 3.2 0 1.9-1.5 3.2-3.7 3.2-1.7 0-3-.7-3.9-1.8l1.4-1.1c.7.8 1.5 1.2 2.5 1.2s1.6-.5 1.6-1.2c0-.8-.7-1-1.8-1.4-1.6-.5-2.8-1.1-2.8-3 0-1.8 1.4-3 3.5-3 1.3 0 2.5.4 3.4 1.1Z" fill="white" />
      </svg>
    ),
  },
  "liferay cms": {
    key: "liferay",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="4" fill="#0b5fff" />
        <circle cx="16" cy="8" r="4" fill="#55a8ff" />
        <circle cx="8" cy="16" r="4" fill="#55a8ff" />
        <circle cx="16" cy="16" r="4" fill="#0b5fff" />
      </svg>
    ),
  },
  "design tokens": {
    key: "design-tokens",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="7" cy="7" r="3" />
        <circle cx="17" cy="7" r="3" />
        <circle cx="12" cy="17" r="3" />
        <path d="m9.5 8.5 5 0M8.5 9.5l2 4.5m5-4.5-2 4.5" />
      </svg>
    ),
  },
  "design system": {
    key: "design-system",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  specs: {
    key: "specs",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="M7 3.5h7l3 3v14H7zM14 3.5v3h3M9.5 11h5M9.5 14.5h5M9.5 18h3" />
      </svg>
    ),
  },
  ux: {
    key: "ux",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m5 3 13 9-6 1.5L9 19Z" />
      </svg>
    ),
  },
  ia: {
    key: "ai",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3c.8 4.8 3.2 7.2 8 8-4.8.8-7.2 3.2-8 8-.8-4.8-3.2-7.2-8-8 4.8-.8 7.2-3.2 8-8Z" />
      </svg>
    ),
  },
  ai: {
    key: "ai",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3c.8 4.8 3.2 7.2 8 8-4.8.8-7.2 3.2-8 8-.8-4.8-3.2-7.2-8-8 4.8-.8 7.2-3.2 8-8Z" />
      </svg>
    ),
  },
};

const fallbackStackIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m12 3 8 4.5-8 4.5-8-4.5Zm-8 9 8 4.5 8-4.5M4 16.5l8 4.5 8-4.5" />
  </svg>
);

function CaseStackLogos({ items }: { items: string[] }) {
  const logos = items.reduce<StackLogo[]>((result, name) => {
    const definition = stackLogoIcons[name.toLowerCase()] || {
      key: name.toLowerCase(),
      icon: fallbackStackIcon,
    };

    if (!result.some((item) => item.key === definition.key)) {
      result.push({ ...definition, name });
    }

    return result;
  }, []);

  return (
    <div
      className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2.5 text-card-foreground"
      aria-label={`Stack: ${logos.map(({ name }) => name).join(", ")}`}
    >
      {logos.map(({ key, name, src, icon }) => (
        <span
          key={key}
          role="img"
          aria-label={name}
          title={name}
          className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-full"
        >
          {src ? <img src={src} alt="" className="max-h-4 max-w-4 object-contain" /> : icon}
        </span>
      ))}
    </div>
  );
}

function ImageLightbox({
  image,
  onClose,
}: {
  image: LightboxImage | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const posthog = usePostHog();
  useEffect(() => {
    if (!image) return;
    trackEvent(posthog, "image_lightbox_opened", { image_alt: image.alt, image_caption: image.caption });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [image, onClose]);

  return (
    <AnimatePresence>
      {image ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 p-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
        >
          <motion.div
            className="flex max-h-full w-full max-w-[1120px] flex-col gap-4"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={SPRING}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-white">
                  {image.alt}
                </p>
                {image.caption ? (
                  <p className="mt-1 max-w-[760px] text-[14px] leading-[1.45] tracking-[-0.42px] text-white/62">
                    {image.caption}
                  </p>
                ) : null}
              </div>
              <motion.button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/18 bg-white/8 px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-white"
                whileHover={{ y: -1, borderColor: "rgba(255,255,255,0.42)" }}
                whileTap={TAP}
                transition={SPRING}
              >
                {t.close}
              </motion.button>
            </div>
            <div className="max-h-[78vh] overflow-auto rounded-[28px] border border-white/12 bg-white p-2 shadow-[0_32px_120px_rgba(0,0,0,0.42)]">
              <img loading="lazy" decoding="async" src={image.src} alt={image.alt} className="h-auto w-full rounded-[20px] object-contain" />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function CaseImage({
  label,
  image = petrobrasNossaEnergiaHomeDesktop,
  position = "top",
  onOpen,
}: {
  label: string;
  image?: string;
  position?: "top" | "center" | "bottom";
  onOpen?: (image: LightboxImage) => void;
}) {
  const { t } = useTranslation();
  const objectPosition = position === "top" ? "top" : position === "bottom" ? "bottom" : "center";

  return (
    <motion.figure
      className="flex flex-col gap-4"
      variants={sectionReveal}
      transition={SPRING}
    >
      <SmoothCorners corners={{ radius: 24, smoothing: 0.72 }} className="overflow-hidden border border-border bg-card p-2">
        <button
          type="button"
          onClick={() => onOpen?.({ src: image, alt: label, caption: label })}
          className="case-mobile-image-frame group relative block h-[240px] w-full cursor-zoom-in overflow-hidden rounded-[20px] bg-media text-left sm:h-[360px] lg:h-[460px]"
          aria-label={`${t.zoom}: ${label}`}
        >
          <img loading="lazy" decoding="async"
            src={image}
            alt={label}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
            style={{ objectPosition }}
          />
          <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            {t.zoom}
          </span>
        </button>
      </SmoothCorners>
      <figcaption className="text-[14px] leading-[1.45] tracking-[-0.42px] text-muted">
        {label}
      </figcaption>
    </motion.figure>
  );
}

function CaseTextSection({
  eyebrow,
  title,
  stickyLabel = false,
  children,
  caseStage,
}: {
  eyebrow: string;
  title: string;
  stickyLabel?: boolean;
  children: ReactNode;
} & CaseStageProps) {
  const flattenChildren = (node: ReactNode): ReactNode[] =>
    Children.toArray(node).flatMap((child) => {
      if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
        return flattenChildren(child.props.children);
      }

      return child;
    });
  let paragraphCount = 0;
  const compactChildren = flattenChildren(children).filter((child) => {
    if (isValidElement(child) && child.type === "p") {
      paragraphCount += 1;
      return paragraphCount <= 2;
    }

    return true;
  });

  return (
    <motion.section
      data-case-stage={caseStage}
      className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
      variants={sectionReveal}
    >
      <SectionLabel sticky={stickyLabel}>{eyebrow}</SectionLabel>
      <div className="flex max-w-[640px] flex-col gap-5">
        <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
          {title}
        </h2>
        <div className="flex flex-col gap-4 text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
          {compactChildren}
        </div>
      </div>
    </motion.section>
  );
}

function CaseBulletSection({
  eyebrow,
  title,
  items,
  caseStage,
}: {
  eyebrow: string;
  title: string;
  items: string[];
} & CaseStageProps) {
  return (
    <motion.section
      data-case-stage={caseStage}
      className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
      variants={sectionReveal}
    >
      <SectionLabel>{eyebrow}</SectionLabel>
      <div className="flex flex-col gap-6">
        <h2 className="max-w-[640px] text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground [text-wrap:balance] lg:text-[32px] lg:tracking-[-1.6px]">
          {title}
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <motion.li
              key={item}
              className="rounded-3xl border border-border bg-card p-6 text-[18px] font-medium leading-[1.45] tracking-[-0.54px] text-card-foreground [text-wrap:pretty]"
              variants={sectionReveal}
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}

const cliniaCaseFallback: SanityCaseStudy = {
  title: "Clinia: Plataforma 2.0",
  titleEn: "Clinia: Platform 2.0",
  slug: "clinia",
  client: "Clinia",
  role: "Product Design, Design System e Frontend",
  summary: "Construção da versão 2.0 da plataforma Clinia, conectando auditoria de UX, design system, shadcn customizado, protótipos reais com IA e fluxo design-to-code.",
  summaryEn: "Building Clinia platform 2.0, connecting UX audit, design system, custom shadcn, real AI prototypes and design-to-code workflow.",
  stack: ["Figma", "shadcn", "Cursor", "Claude", "Figma MCP"],
  sections: [
    { eyebrow: "Desafio", title: "Reconstruir a plataforma com uma base consistente.", body: ["A versão anterior tinha uma experiência visual desalinhada e uma estrutura difícil de evoluir. A empresa ainda não tinha um design system estruturado, então cada decisão era tomada de forma isolada.", "O desafio era criar uma base sólida para a versão 2.0: um DS próximo do código, alinhado à marca e pronto para escalar o produto com consistência."] },
    { eyebrow: "Solução", title: "Design system em produção, fluxo design-to-code com IA.", body: ["Estruturamos o design system com shadcn customizado no Figma e em código, criando um repositório de frontend alimentado continuamente com componentes e padrões sincronizados.", "Com Claude, Cursor e MCP do Figma no fluxo, a entrega deixou de ser interface estática e passou a incluir código funcional. O projeto está em andamento, com novas áreas da plataforma sendo construídas continuamente."] },
  ],
  sectionsEn: [
    { eyebrow: "Challenge", title: "Rebuilding the platform with a consistent foundation.", body: ["The previous version had a misaligned visual experience and a structure that was hard to evolve. The company still had no structured design system, so each decision was made in isolation.", "The challenge was to create a solid foundation for version 2.0: a DS close to the code, aligned with the brand and ready to scale the product consistently."] },
    { eyebrow: "Solution", title: "Design system in production, design-to-code workflow with AI.", body: ["We built the design system with custom shadcn in Figma and in code, creating a frontend repository continuously fed with synchronized components and patterns.", "With Claude, Cursor and Figma MCP in the flow, deliverables stopped being static interfaces and started including functional code. The project is ongoing, with new platform areas being built continuously."] },
  ],
};

const talquiCaseFallback: SanityCaseStudy = {
  title: "Talqui: Plataforma",
  titleEn: "Talqui: Platform",
  slug: "talqui",
  client: "Talqui",
  role: "Product Design e Design System",
  summary: "Reconstrução da plataforma Talqui a partir de uma interface antiga criada como fork técnico, criando identidade própria, design system, tokens personalizados e documentação em Storybook.",
  summaryEn: "Rebuilding the Talqui platform from an old interface created as a technical fork, creating its own identity, design system, custom tokens and Storybook documentation.",
  stack: ["Figma", "Design Tokens", "Storybook", "IA"],
  sections: [
    { eyebrow: "Desafio", title: "Criar identidade e escala em uma plataforma nascida como fork técnico.", body: ["A plataforma havia nascido como uma adaptação de uma interface criada pelo time de desenvolvimento. Funcionava, mas limitava a identidade visual e dificultava o crescimento do produto.", "O desafio era criar uma plataforma com identidade própria: uma experiência que comunicasse a marca, suportasse novas features e tivesse uma base de componentes consistente para evoluir."] },
    { eyebrow: "Solução", title: "Redesign completo com design system e documentação em Storybook.", body: ["Construí toda a plataforma nova, da identidade visual ao design system com tokens personalizados, componentes e padrões documentados.", "O time criou um repositório dedicado ao DS, sincronizado com Storybook. A plataforma foi redesenhada do zero e segue evoluindo com base nessa fundação."] },
  ],
  sectionsEn: [
    { eyebrow: "Challenge", title: "Creating identity and scale in a platform born as a technical fork.", body: ["The platform had been born as an adaptation of an interface created by the development team. It worked, but limited the visual identity and made product growth difficult.", "The challenge was to create a platform with its own identity: an experience that communicated the brand, supported new features and had a consistent component base to evolve from."] },
    { eyebrow: "Solution", title: "Full redesign with design system and Storybook documentation.", body: ["I built the new platform from the visual identity to the design system, with custom tokens, components and documented patterns.", "The team created a dedicated DS repository, synchronized with Storybook. The platform was redesigned from scratch and continues to evolve on this foundation."] },
  ],
};

const petrobrasNossaEnergiaCaseFallback: SanityCaseStudy = {
  title: "Petrobras: Nossa Energia",
  titleEn: "Petrobras: Nossa Energia",
  slug: "petrobras-nossa-energia",
  client: "Petrobras",
  role: "Design System, UX, UI e Liferay collaboration",
  summary: "Portal editorial para centralizar conteúdos institucionais da Petrobras, usando o Design System Petrobras v2 e uma arquitetura de informação mais clara para publicação.",
  summaryEn: "Editorial portal to centralize Petrobras institutional content, using the Petrobras Design System v2 and a clearer information architecture for publishing.",
  stack: ["Figma", "Liferay CMS", "Design System", "UX"],
  sections: [
    { eyebrow: "Desafio", title: "Centralizar conteúdos sem perder consistência.", body: ["A necessidade era centralizar conteúdos institucionais e artigos da Petrobras porque esses conteúdos estavam dispersos em canais distintos.", "Além disso, a transição tecnológica para CMS Liferay era essencial para oferecer aos publicadores uma experiência mais autônoma e eficiente."] },
    { eyebrow: "Solução", title: "Um hub editorial conectado ao design system.", body: ["Desenvolvemos um hub que centralizou conteúdos institucionais, integrou informações dos canais Fatos e Dados e do antigo Nossa Energia.", "A solução passou a permitir páginas formadas por componentes integrados de forma modular."] },
  ],
  sectionsEn: [
    { eyebrow: "Challenge", title: "Centralizing content without losing consistency.", body: ["Petrobras had institutional content and articles spread across different channels. The challenge was to centralize them in a cleaner, more governed editorial experience.", "Additionally, the transition to Liferay CMS was essential to give publishers greater autonomy and efficiency."] },
    { eyebrow: "Solution", title: "An editorial hub connected to the design system.", body: ["We developed a hub that centralized institutional content, integrating information from the Fatos e Dados and the old Nossa Energia channels.", "The solution enabled pages built from modularly integrated components, making publishing more scalable and consistent."] },
  ],
};

function CmsCaseNarrative({ caseStudy, caseStage }: { caseStudy?: SanityCaseStudy } & CaseStageProps) {
  const { language, t } = useTranslation();
  if (!caseStudy) return null;

  const title = language === "en" ? (caseStudy.titleEn || caseStudy.title) : caseStudy.title;
  const summary = language === "en" ? (caseStudy.summaryEn || caseStudy.summary) : caseStudy.summary;
  const stack = language === "en" ? (caseStudy.stackEn || caseStudy.stack) : caseStudy.stack;
  const sections = language === "en" ? (caseStudy.sectionsEn || caseStudy.sections) : caseStudy.sections;

  return (
    <motion.section
      data-case-stage={caseStage}
      className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
      variants={sectionReveal}
    >
      <SectionLabel>{t.summary}</SectionLabel>
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
                {caseStudy.client}
              </p>
              <h2 className="mt-2 text-[22px] font-medium leading-none tracking-[-1.1px] text-card-foreground lg:text-[32px] lg:tracking-[-1.6px]">
                {title}
              </h2>
            </div>
            {summary ? (
              <p className="overflow-hidden text-[16px] leading-[1.45] tracking-[-0.32px] text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                {summary}
              </p>
            ) : null}
            {stack?.length ? (
              <div className="flex flex-wrap gap-2 pt-2">
                <CaseStackLogos items={stack} />
              </div>
            ) : null}
          </div>
        </div>

        {sections?.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sections.map((section) => (
              <article key={`${section.eyebrow}-${section.title}`} className="rounded-3xl border border-border bg-card p-6">
                <p className="text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary">
                  {section.eyebrow}
                </p>
                <h3 className="mt-3 text-[24px] font-medium leading-none tracking-[-1.2px] text-card-foreground">
                  {section.title}
                </h3>
                <div className="mt-4 overflow-hidden text-[14px] leading-[1.45] tracking-[-0.42px] text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4]">
                  {section.body?.slice(0, 1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </motion.section>
  );
}

function CaseTestimonials({ caseStudy, caseStage }: { caseStudy?: SanityCaseStudy } & CaseStageProps) {
  const { language } = useTranslation();
  const testimonials = caseStudy?.testimonials?.filter((item) => item.quote && item.author) || [];

  if (!testimonials.length) return null;

  return (
    <motion.section
      data-case-stage={caseStage}
      className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
      variants={sectionReveal}
    >
      <SectionLabel>{language === "en" ? "Testimonials" : "Depoimentos"}</SectionLabel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {testimonials.map((item) => {
          const role = language === "en" ? item.roleEn || item.role : item.role;
          const quote = language === "en" ? item.quoteEn || item.quote : item.quote;

          return (
            <motion.figure
              key={`${item.author}-${item.company || ""}`}
              className="flex min-h-[240px] flex-col justify-between rounded-3xl border border-border bg-card p-6"
              variants={sectionReveal}
            >
              <blockquote className="text-[20px] font-medium leading-[1.35] tracking-[-0.6px] text-card-foreground">
                “{quote}”
              </blockquote>
              <figcaption className="mt-8 text-[14px] leading-[1.45] tracking-[-0.42px] text-muted">
                <span className="block font-medium text-card-foreground">{item.author}</span>
                {[role, item.company].filter(Boolean).join(" · ")}
              </figcaption>
            </motion.figure>
          );
        })}
      </div>
    </motion.section>
  );
}

function DsEvidenceFigure({
  item,
  onOpen,
}: {
  item: (typeof petrobrasDsEvidence)[number];
  onOpen: (image: LightboxImage) => void;
}) {
  const { t } = useTranslation();
  return (
    <motion.figure
      className="flex flex-col gap-4"
      variants={sectionReveal}
      transition={SPRING}
    >
      <SmoothCorners corners={{ radius: 24, smoothing: 0.72 }} className="overflow-hidden border border-border bg-card p-2">
        <button
          type="button"
          onClick={() => onOpen({ src: item.image, alt: item.title, caption: item.description })}
          className="case-mobile-image-frame group relative block w-full cursor-zoom-in overflow-hidden rounded-[20px] bg-white text-left"
          aria-label={`${t.zoom}: ${item.title}`}
        >
          <img loading="lazy" decoding="async" src={item.image} alt={item.title} className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]" />
          <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            {t.zoom}
          </span>
        </button>
      </SmoothCorners>
      <figcaption className="flex flex-col gap-2">
        <h3 className="text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-foreground">
          {item.title}
        </h3>
        <p className="text-[14px] leading-[1.45] tracking-[-0.42px] text-muted">
          {item.description}
        </p>
      </figcaption>
    </motion.figure>
  );
}

function CaseLightboxFigure({
  image,
  title,
  caption,
  onOpen,
  imageClassName = "h-auto w-full object-cover",
}: {
  image: string;
  title: string;
  caption: string;
  onOpen: (image: LightboxImage) => void;
  imageClassName?: string;
}) {
  const { t } = useTranslation();
  return (
    <motion.figure className="flex flex-col gap-4" variants={sectionReveal}>
      <SmoothCorners corners={{ radius: 32, smoothing: 0.72 }} className="overflow-hidden border border-border bg-card p-2">
        <button
          type="button"
          onClick={() => onOpen({ src: image, alt: title, caption })}
          className="case-mobile-image-frame group relative block w-full cursor-zoom-in overflow-hidden rounded-[24px] bg-white text-left"
          aria-label={`${t.zoom}: ${title}`}
        >
          <img loading="lazy" decoding="async"
            src={image}
            alt={title}
            className={`${imageClassName} transition-transform duration-500 group-hover:scale-[1.01]`}
          />
          <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            {t.zoom}
          </span>
        </button>
      </SmoothCorners>
      <figcaption className="text-[14px] leading-[1.45] tracking-[-0.42px] text-muted">
        {caption}
      </figcaption>
    </motion.figure>
  );
}

function CliniaPrototypeSection({
  onOpen,
  caseStage,
}: {
  onOpen: (image: LightboxImage) => void;
} & CaseStageProps) {
  const { language } = useTranslation();
  return (
    <motion.section
      data-case-stage={caseStage}
      className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
      variants={sectionReveal}
    >
      <div className="flex flex-col gap-4">
        <SectionLabel>{language === "en" ? "Real prototyping" : "Prototipação real"}</SectionLabel>
        <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
          {language === "en" ? "Claude, Cursor and Figma MCP in the flow." : "Claude, Cursor e MCP do Figma no fluxo."}
        </h2>
      </div>
      <div className="flex flex-col gap-6">
        <CaseLightboxFigure
          image={cliniaClaudeCursorFigmaMcp}
          title={language === "en" ? "Claude, Cursor and Figma MCP applied at Clinia" : "Claude, Cursor e Figma MCP aplicados na Clinia"}
          caption={language === "en"
            ? "Using Claude, Cursor and Figma MCP to create real prototypes synchronized with Figma interfaces."
            : "Uso do Claude, Cursor e MCP do Figma para criar protótipos reais e sincronizados com as interfaces do Figma."}
          onOpen={onOpen}
          imageClassName="aspect-[16/9] w-full object-cover"
        />
        <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
          {language === "en"
            ? "We use Claude, Cursor and Figma MCP to create real prototypes synchronized with Figma interfaces. The goal is to reduce the gap between design decisions, flow validation and implementation."
            : "Usamos Claude, Cursor e MCP do Figma para criar protótipos reais sincronizados com as interfaces do Figma. O objetivo é reduzir a distância entre decisão de design, validação de fluxo e implementação."}
        </p>
      </div>
    </motion.section>
  );
}

function NextCaseSection({
  nextCase,
  language,
  caseStage,
}: {
  nextCase: "clinia" | "talqui" | "petrobras-ds" | "petrobras-ne";
  language: "en" | "pt-BR";
} & CaseStageProps) {
  const data = {
    clinia: {
      title: "Clinia",
      category: language === "en" 
        ? "Platform 2.0, design system and AI-powered workflow"
        : "Plataforma 2.0, design system e fluxo com IA",
      href: "/cases/clinia/",
      coverImage: cliniaCover,
      bgClass: "bg-[#08080c]",
    },
    talqui: {
      title: "Talqui",
      category: language === "en"
        ? "AI-powered support platform, redesign, and design system"
        : "Plataforma de atendimento com IA, redesign e design system",
      href: "/cases/talqui/",
      coverImage: talquiCover,
      bgClass: "bg-[#08080c]",
    },
    "petrobras-ds": {
      title: "Petrobras DS v2",
      category: language === "en"
        ? "Component library, design tokens and documentation"
        : "Biblioteca de componentes, design tokens e documentação",
      href: "/cases/petrobras-design-system/",
      coverImage: petrobrasDsCover,
      bgClass: "bg-[#08080c]",
    },
    "petrobras-ne": {
      title: "Nossa Energia",
      category: language === "en"
        ? "Editorial content hub connected to the design system"
        : "Portal editorial de conteúdos conectado ao design system",
      href: "/cases/petrobras-nossa-energia/",
      coverImage: petrobrasNossaEnergia,
      bgClass: "bg-[#08080c]",
    },
  }[nextCase];

  const label = language === "en" ? "Next Case Study" : "Próximo Case";

  return (
    <motion.section
      data-case-stage={caseStage}
      className="flex flex-col gap-6 border-t border-border pt-10 lg:pt-16"
      variants={sectionReveal}
    >
      <p className="text-[14px] font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <motion.a
        href={data.href}
        className={[
          "group relative flex min-h-[220px] sm:min-h-[280px] md:min-h-[340px] flex-col justify-between overflow-hidden rounded-[24px] sm:rounded-[32px] border border-border p-6 sm:p-8 md:p-10 transition-colors duration-300",
          data.bgClass,
        ].join(" ")}
        whileHover={{ y: -4, borderColor: "var(--color-primary)" }}
        whileTap={TAP}
        transition={SPRING}
      >
        {/* Background image container */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img loading="lazy" decoding="async"
            src={data.coverImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/58 to-black/18 transition-opacity duration-300" />
        </div>

        {/* Content wrapper */}
        <div className="relative z-10 flex h-full min-h-[160px] sm:min-h-[200px] md:min-h-[240px] flex-col justify-between gap-8">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-[32px] font-medium leading-none tracking-[-1.6px] text-white transition-colors duration-300 sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
              {data.title}
            </h3>
            <div className={[
              "grid size-12 place-items-center rounded-full border transition-colors duration-300 shrink-0",
              "border-white/20 bg-white/10 text-white group-hover:border-white group-hover:bg-white group-hover:text-black",
            ].join(" ")}>
              <svg
                viewBox="0 0 24 24"
                className="size-5 stroke-current"
                fill="none"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
          <p className="max-w-[480px] text-[15px] font-medium leading-[1.45] tracking-[-0.3px] text-white/76 transition-colors duration-300 sm:text-[17px] sm:tracking-[-0.34px]">
            {data.category}
          </p>
        </div>
      </motion.a>
    </motion.section>
  );
}

export function PetrobrasDesignSystemCasePage({
  theme,
  onThemeChange,
  cmsCase,
}: PageProps & { cmsCase?: SanityCaseStudy }) {
  const prefersReducedMotion = useReducedMotion();
  const { language, t } = useTranslation();
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const foundations = language === "en" ? petrobrasDsFoundationsEn : petrobrasDsFoundations;
  const process = language === "en" ? petrobrasDsProcessEn : petrobrasDsProcess;
  const evidence = language === "en" ? petrobrasDsEvidenceEn : petrobrasDsEvidence;
  const impact = language === "en"
    ? [
        "More than 100 pages structured on a single visual and technical foundation.",
        "Page creation time reduced from approximately six days to half a day.",
        "Foundation used by Petrobras' institutional portal and Content Hub.",
      ]
    : [
        "Mais de 100 páginas estruturadas sobre uma única base visual e técnica.",
        "Redução do tempo de criação de páginas de aproximadamente 6 dias para meio dia.",
        "Base utilizada pelo portal institucional e Hub de Conteúdo da Petrobras.",
      ];
  const responsibilities = language === "en"
    ? [
        "Design System leadership.",
        "Definition of the Design Token architecture.",
        "Structuring base and semantic tokens.",
        "Component architecture and standardization.",
        "Documentation in Figma and Notion.",
        "Continuous alignment with the development team.",
        "Definition of usage and governance guidelines.",
        "Leadership of the system's internal adoption.",
      ]
    : [
        "Liderança do Design System.",
        "Definição da arquitetura de Design Tokens.",
        "Estruturação de tokens base e semânticos.",
        "Arquitetura e padronização dos componentes.",
        "Criação da documentação em Figma e Notion.",
        "Alinhamento contínuo com a equipe de desenvolvimento.",
        "Definição de diretrizes de uso e governança.",
        "Condução da adoção interna do sistema.",
      ];
  const finalResults = language === "en"
    ? [
        "Elimination of inconsistencies across products and areas of the ecosystem.",
        "Significant reduction in interface-related rework.",
        "Shared governance between Design and Development.",
        "Greater predictability for Design and Development.",
      ]
    : [
        "Eliminação de inconsistências entre produtos e áreas do ecossistema.",
        "Redução significativa de retrabalho relacionado à interface.",
        "Governança compartilhada entre Design e Desenvolvimento.",
        "Maior previsibilidade para Design e Desenvolvimento.",
      ];
  const cmsEvidence = (cmsCase?.evidence?.length ? cmsCase.evidence : petrobrasDsCmsEvidenceFallback).filter((item) => {
    const text = `${item.title || ""} ${item.caption || ""}`.toLowerCase();
    return !text.includes("capa do petrods");
  });

  return (
    <>
      <Header activePage="projects" theme={theme} onThemeChange={onThemeChange} />
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      <CaseNarrativeLayout
        className="flex w-full flex-col gap-10 p-5 lg:gap-20 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col items-center gap-8 text-center" variants={sectionReveal}>
          <a
            href="/petrobras/"
            className="self-start text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-muted"
          >
            {t.backToPetrobras}
          </a>
          <div className="flex flex-col items-center gap-4">
            <SectionLabel>Petrobras</SectionLabel>
            <h1 className="max-w-[860px] font-display text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px] sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
              {language === "en"
                ? "Petrobras Design System, the foundation of the digital ecosystem."
                : "Design System Petrobras, a base do ecossistema digital."}
            </h1>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <CaseMeta label={language === "en" ? "Role" : "Função"} value={language === "en" ? (cmsCase?.roleEn || cmsCase?.role || "Design System, UI, UX and documentation") : (cmsCase?.role || "Design System, UI, UX e documentação")} />
              <CaseMeta label="Status" value={cmsCase?.status || "2022 - 2024"} />
              <CaseStackLogos items={language === "en" ? (cmsCase?.stackEn || cmsCase?.stack || ["Figma", "Notion", "Design Tokens", "Specs"]) : (cmsCase?.stack || ["Figma", "Notion", "Design Tokens", "Specs"])} />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="w-full"
          variants={sectionReveal}
        >
          <SmoothCorners corners={{ radius: 32, smoothing: 0.72 }} className="overflow-hidden border border-border bg-card p-2">
            <button
              type="button"
              onClick={() =>
                setLightboxImage({
                  src: petrobrasDsCover,
                  alt: "Capa do projeto Petrobras Design System",
                  caption: language === "en" ? "Cover image for the Petrobras Design System case." : "Imagem de capa do case Petrobras Design System.",
                })
              }
              className="case-mobile-image-frame group relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-[24px] bg-[#e4f6ed] text-left"
              aria-label={language === "en" ? "Zoom in: Petrobras Design System case cover" : "Ampliar imagem: capa do case Petrobras Design System"}
            >
              <img loading="lazy" decoding="async"
                src={petrobrasDsCover}
                alt={language === "en" ? "Petrobras Design System case cover" : "Capa do projeto Petrobras Design System"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
              />
              <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                {t.zoom}
              </span>
            </button>
          </SmoothCorners>
        </motion.section>

        <CaseTestimonials caseStudy={cmsCase} caseStage="testimonial" />

        <CaseBulletSection
          caseStage="after"
          eyebrow={language === "en" ? "Impact" : "Impacto"}
          title={language === "en" ? "A shared foundation that changed the scale of delivery." : "Uma base compartilhada que mudou a escala das entregas."}
          items={impact}
        />

        <motion.section
          data-case-stage="after"
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <div className="flex flex-col gap-4">
            <SectionLabel>{language === "en" ? "Evidence" : "Evidências"}</SectionLabel>
            <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "The living documentation of Petro DS v2." : "A documentação viva do Petro DS v2."}
            </h2>
          </div>
          <div className="flex flex-col gap-10">
            {cmsEvidence.map((item) =>
              item.imageUrl ? (
                <CaseLightboxFigure
                  key={item.title}
                  image={item.imageUrl}
                  title={item.title || ""}
                  caption={item.caption || ""}
                  onOpen={setLightboxImage}
                />
              ) : null
            )}
            <DsEvidenceFigure item={evidence[0]} onOpen={setLightboxImage} />
            <DsEvidenceFigure item={evidence[1]} onOpen={setLightboxImage} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <DsEvidenceFigure item={evidence[2]} onOpen={setLightboxImage} />
              <DsEvidenceFigure item={evidence[3]} onOpen={setLightboxImage} />
            </div>
          </div>
        </motion.section>

        <CaseTextSection caseStage="challenge" eyebrow={language === "en" ? "Challenge" : "Desafio"} title={language === "en" ? "Scaling consistency without blocking evolution." : "Escalar consistência sem travar a evolução."}>
          {language === "en" ? (
            <>
              <p>
                Petrobras' digital ecosystem had more than 100 pages developed individually, without
                a shared visual language. This generated visual inconsistencies, longer production
                times, and frequent rework between designers and developers.
              </p>
              <p>
                The challenge was to create a shared foundation that could serve different products and
                teams while remaining viable within the Liferay platform.
              </p>
            </>
          ) : (
            <>
              <p>
                O ecossistema digital da Petrobras possuía mais de 100 páginas desenvolvidas
                individualmente, sem uma linguagem visual compartilhada. A ausência de um Design System
                gerava inconsistências visuais, aumento do tempo de produção e retrabalho frequente
                entre designers e desenvolvedores.
              </p>
              <p>
                O desafio era criar uma base compartilhada que atendesse diferentes produtos e equipes,
                sem perder a viabilidade dentro da plataforma Liferay.
              </p>
            </>
          )}
        </CaseTextSection>

        <CaseTextSection
          caseStage="before"
          eyebrow={language === "en" ? "Before" : "Antes"}
          title={language === "en" ? "More than 100 pages built without a shared foundation." : "Mais de 100 páginas construídas sem uma base compartilhada."}
        >
          <p>
            {language === "en"
              ? "Each product area evolved with isolated interface decisions, which increased visual inconsistency and made common page patterns expensive to reproduce."
              : "Cada área de produto evoluía com decisões de interface isoladas, o que aumentava a inconsistência visual e tornava padrões comuns de página caros de reproduzir."}
          </p>
          <p>
            {language === "en"
              ? "Design and Development lacked a common source for tokens, components, responsive behavior, and implementation guidance."
              : "Design e Desenvolvimento não tinham uma fonte comum para tokens, componentes, comportamento responsivo e orientações de implementação."}
          </p>
        </CaseTextSection>

        <CaseBulletSection
          caseStage="during"
          eyebrow={language === "en" ? "How we solved it" : "Como resolvemos"}
          title={language === "en" ? "Leadership from architecture to adoption." : "Liderança da arquitetura à adoção."}
          items={responsibilities}
        />

        <motion.section
          data-case-stage="during"
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Foundations" : "Fundações"}</SectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {foundations.map((item) => (
              <motion.article
                key={item.title}
                className="rounded-3xl border border-border bg-card p-6"
                variants={sectionReveal}
              >
                <h2 className="text-[24px] font-medium leading-none tracking-[-1.2px] text-card-foreground">
                  {item.title}
                </h2>
                <p className="mt-4 text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <CaseTextSection
          caseStage="during"
          eyebrow={language === "en" ? "Implementation" : "Desafios de implementação"}
          title={language === "en" ? "Balancing design needs and Liferay constraints." : "Equilibrar as necessidades de Design e as limitações do Liferay."}
        >
          {language === "en" ? (
            <>
              <p>
                One of the project's main challenges was balancing Design needs with the technical
                constraints imposed by the Liferay platform.
              </p>
              <p>
                Because development was handled by a third-party company, several decisions required
                negotiation to preserve the user experience without compromising technical feasibility.
                This process directly influenced the component architecture and the system's evolution.
              </p>
            </>
          ) : (
            <>
              <p>
                Um dos principais desafios do projeto foi equilibrar as necessidades de Design com as
                limitações técnicas impostas pela plataforma Liferay.
              </p>
              <p>
                Como o desenvolvimento era conduzido por uma empresa terceirizada, diversas decisões
                exigiam negociação para preservar a experiência do usuário sem comprometer a viabilidade
                técnica. Esse processo influenciou diretamente a arquitetura dos componentes e a evolução do sistema.
              </p>
            </>
          )}
        </CaseTextSection>

        <motion.section
          data-case-stage="during"
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Process" : "Processo"}</SectionLabel>
          <div className="flex flex-col gap-6">
            <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "From mapping to reusable editorial sections." : "Do mapeamento às seções editoriais reutilizáveis."}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {process.map((item) => (
                <motion.p
                  key={item}
                  className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                  variants={sectionReveal}
                >
                  {item}
                </motion.p>
              ))}
            </div>
            <div className="rounded-[32px] border border-border bg-card p-8">
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[1fr_1.2fr] sm:gap-8">
                <div>
                  <SectionLabel>{language === "en" ? "Manual documentation" : "Documentação manual"}</SectionLabel>
                  <h2 className="mt-4 text-[22px] font-medium leading-none tracking-[-1.1px] text-card-foreground lg:text-[32px] lg:tracking-[-1.6px]">
                    {language === "en" ? "Specs as an alignment tool." : "Specs como ferramenta de alinhamento."}
                  </h2>
                </div>
                <p className="text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                  {language === "en"
                    ? "Documentation was a central part of the case. Every decision needed to be understandable outside Figma: variations, states, composition rules, responsive behavior, and usage limits were described to guide implementation across the Petrobras ecosystem."
                    : "O trabalho de documentação foi parte central do case. Cada decisão precisava ser compreensível fora do Figma: variações, estados, regras de composição, comportamento responsivo e limites de uso eram descritos para orientar a implementação no ecossistema Petrobras."}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <CaseTextSection
          caseStage="during"
          eyebrow={language === "en" ? "Governance" : "Governança"}
          title={language === "en" ? "Continuous evolution without compromising stability." : "Evolução contínua sem comprometer a estabilidade."}
        >
          {language === "en" ? (
            <>
              <p>
                Any designer on the team could propose improvements or new components. Changes were
                evaluated jointly by Design and Development.
              </p>
              <p>
                Incremental changes were released as patches, while structural changes created new
                component versions to avoid large-scale impact.
              </p>
            </>
          ) : (
            <>
              <p>
                Qualquer designer da equipe podia propor melhorias ou novos componentes. As alterações
                eram avaliadas em conjunto entre Design e Desenvolvimento.
              </p>
              <p>
                Mudanças incrementais eram publicadas como patches, enquanto alterações estruturais
                geravam novas versões de componentes para evitar impactos em larga escala.
              </p>
            </>
          )}
        </CaseTextSection>

        <CaseTextSection
          caseStage="during"
          eyebrow={language === "en" ? "Adoption" : "Adoção e evangelização"}
          title={language === "en" ? "Documentation and training as alignment tools." : "Documentação e treinamento como ferramentas de alinhamento."}
        >
          {language === "en" ? (
            <>
              <p>
                Documentation was the main alignment tool between teams. Weekly presentations with
                designers, developers, and stakeholders shared updates, validated decisions, and
                reinforced the correct use of components.
              </p>
              <p>
                Accessible documentation, continuous training, and close support contributed to
                consistent adoption of the system across all new projects.
              </p>
            </>
          ) : (
            <>
              <p>
                A documentação foi utilizada como principal ferramenta de alinhamento entre equipes.
                Semanalmente eram realizadas apresentações com designers, desenvolvedores e stakeholders
                para compartilhar atualizações, validar decisões e garantir o uso correto dos componentes.
              </p>
              <p>
                A combinação entre documentação acessível, treinamento contínuo e acompanhamento próximo
                da equipe contribuiu para uma adoção consistente do sistema em todos os novos projetos.
              </p>
            </>
          )}
        </CaseTextSection>

        <CaseBulletSection
          caseStage="after"
          eyebrow={language === "en" ? "Results" : "Resultados"}
          title={language === "en" ? "A more consistent and predictable digital ecosystem." : "Um ecossistema digital mais consistente e previsível."}
          items={finalResults}
        />

        <motion.a
          data-case-stage="after"
          href="https://uxdudu.notion.site/Petro-DS-v2-2d88fb2f824449078175f0599d7b0b92?pvs=73"
          target="_blank"
          rel="noreferrer"
          className="w-fit rounded-[10px] border border-border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary"
          whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
          whileTap={TAP}
          transition={SPRING}
        >
          {t.viewPetroDs}
        </motion.a>

        <CaseTextSection caseStage="after" eyebrow={language === "en" ? "Connection" : "Relação"} title={language === "en" ? "The design system was the bridge between the Petrobras cases." : "O design system era a ponte entre os cases Petrobras."}>
          {language === "en" ? (
            <>
              <p>
                Nossa Energia can be understood as a direct application of this foundation: an editorial portal
                built on previously defined components, sections, and templates.
              </p>
              <p>
                This relationship is the most important point of the case: the design system created
                a foundation for multiple digital experiences with more consistency and speed.
              </p>
            </>
          ) : (
            <>
              <p>
                O Nossa Energia pode ser entendido como uma aplicação direta dessa base: um portal
                editorial que se apoia em componentes, sections e templates previamente definidos.
              </p>
              <p>
                Essa relação é o ponto mais importante do case: o design system criou uma fundação
                para múltiplas experiências digitais com mais consistência e velocidade.
              </p>
            </>
          )}
        </CaseTextSection>
        <NextCaseSection nextCase="petrobras-ne" language={language} caseStage="next" />
      </CaseNarrativeLayout>
      <Footer />
    </>
  );
}

export function PetrobrasNossaEnergiaCasePage({
  theme,
  onThemeChange,
  cmsCase,
}: PageProps & { cmsCase?: SanityCaseStudy }) {
  const prefersReducedMotion = useReducedMotion();
  const { language, t } = useTranslation();
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const process = language === "en" ? caseProcessEn : caseProcess;
  const outcomes = language === "en" ? caseOutcomesEn : caseOutcomes;
  const localEvidence = [
    {
      title: language === "en" ? "Nossa Energia home, desktop" : "Home Nossa Energia, desktop",
      caption: language === "en"
        ? "Final desktop screen for the Nossa Energia editorial portal."
        : "Tela final desktop do portal editorial Nossa Energia.",
      imageUrl: petrobrasNossaEnergiaHomeDesktop,
    },
    {
      title: language === "en" ? "Nossa Energia home, mobile" : "Home Nossa Energia, mobile",
      caption: language === "en"
        ? "Final mobile screen for the Nossa Energia editorial portal."
        : "Tela final mobile do portal editorial Nossa Energia.",
      imageUrl: petrobrasNossaEnergiaHomeMobile,
    },
  ];
  const hiddenEvidenceKeywords = ["composição", "composition", "mockup da home", "notebook"];
  const hiddenEvidenceTitleKeywords = ["post", "article", "artigo"];
  const evidence = (cmsCase?.evidence?.length ? cmsCase.evidence : localEvidence).filter((item) => {
    const title = (item.title || "").toLowerCase();
    const text = `${title} ${item.caption || ""}`.toLowerCase();
    return !hiddenEvidenceKeywords.some((keyword) => text.includes(keyword))
      && !hiddenEvidenceTitleKeywords.some((keyword) => title.includes(keyword));
  });
  const homeDesktopEvidence = evidence.find((item) => item.title?.toLowerCase().includes("desktop"));
  const homeMobileEvidence = evidence.find((item) => item.title?.toLowerCase().includes("mobile"));
  const evidenceOrder = [
    "processo",
    "process",
    "mapeamento",
    "estrutura",
    "conteúdo",
    "content",
    "structure",
    "ecossistema",
    "ecosystem",
    "review",
    "incorporação",
    "incorporation",
  ];
  const orderedEvidence = evidence
    .filter((item) => item !== homeDesktopEvidence && item !== homeMobileEvidence)
    .sort((first, second) => {
      const firstTitle = first.title?.toLowerCase() || "";
      const secondTitle = second.title?.toLowerCase() || "";
      const firstIndex = evidenceOrder.findIndex((keyword) => firstTitle.includes(keyword));
      const secondIndex = evidenceOrder.findIndex((keyword) => secondTitle.includes(keyword));
      const normalizedFirstIndex = firstIndex === -1 ? Number.MAX_SAFE_INTEGER : firstIndex;
      const normalizedSecondIndex = secondIndex === -1 ? Number.MAX_SAFE_INTEGER : secondIndex;
      return normalizedFirstIndex - normalizedSecondIndex;
    });

  return (
    <>
      <Header activePage="projects" theme={theme} onThemeChange={onThemeChange} />
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      <CaseNarrativeLayout
        className="flex w-full flex-col gap-10 p-5 lg:gap-20 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col items-center gap-8 text-center" variants={sectionReveal}>
          <a
            href="/petrobras/"
            className="self-start text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-muted"
          >
            {t.backToPetrobras}
          </a>
          <div className="flex flex-col items-center gap-4">
            <SectionLabel>Petrobras</SectionLabel>
            <h1 className="max-w-[820px] font-display text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px] sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
              {language === "en"
                ? "Nossa Energia, Petrobras's content portal."
                : "Nossa Energia, o portal de conteúdos da Petrobras."}
            </h1>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <CaseMeta label={language === "en" ? "Role" : "Função"} value={language === "en" ? (cmsCase?.roleEn || cmsCase?.role || "Design System, UX, UI and Liferay collaboration") : (cmsCase?.role || "Design System, UX, UI e colaboração com Liferay")} />
              <CaseMeta label="Status" value={cmsCase?.status || "2024"} />
              <CaseStackLogos items={language === "en" ? (cmsCase?.stackEn || cmsCase?.stack || ["Figma", "Liferay CMS", "Design System", "UX"]) : (cmsCase?.stack || ["Figma", "Liferay CMS", "Design System", "UX"])} />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="w-full"
          variants={sectionReveal}
        >
          <SmoothCorners corners={{ radius: 32, smoothing: 0.72 }} className="overflow-hidden border border-border bg-card p-2">
            <button
              type="button"
              onClick={() =>
                setLightboxImage({
                  src: petrobrasNossaEnergia,
                  alt: "Nossa Energia Petrobras",
                  caption: language === "en" ? "Main image of the Nossa Energia Petrobras case." : "Imagem principal do case Nossa Energia Petrobras.",
                })
              }
              className="case-mobile-image-frame group relative block h-[260px] w-full cursor-zoom-in overflow-hidden rounded-[24px] bg-media text-left sm:h-[420px] lg:h-[600px]"
              aria-label={language === "en" ? "Zoom in: Nossa Energia Petrobras" : "Ampliar imagem: Nossa Energia Petrobras"}
            >
              <img loading="lazy" decoding="async"
                src={petrobrasNossaEnergia}
                alt="Nossa Energia Petrobras"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.015]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                {t.zoom}
              </span>
            </button>
          </SmoothCorners>
        </motion.section>

        <CaseTestimonials caseStudy={cmsCase} caseStage="testimonial" />

        <CaseTextSection
          caseStage="before"
          eyebrow={language === "en" ? "Before" : "Antes"}
          title={language === "en" ? "A hub to centralize institutional content." : "Um hub para centralizar conteúdo institucional."}
          stickyLabel
        >
          {language === "en" ? (
            <>
              <p>
                Nossa Energia was designed to centralize Petrobras content in a clearer,
                more modular, and easier-to-evolve editorial experience.
              </p>
              <p>
                The project connects directly to Petrobras's design system: the same
                tokens, components, and patterns that support the portal also serve as the foundation
                for the main site and other digital fronts.
              </p>
              <p>
                An important part of the work was transforming interface decisions into practical documentation:
                specs, component usage, sections, templates, states, and guidelines to
                maintain consistency between design and implementation.
              </p>
            </>
          ) : (
            <>
              <p>
                O Nossa Energia foi pensado para centralizar conteúdos da Petrobras em uma
                experiência editorial mais clara, modular e fácil de evoluir.
              </p>
              <p>
                O projeto se conecta diretamente ao design system da Petrobras: os mesmos
                tokens, componentes e padrões que sustentam o portal também servem como base
                para o site principal e outras frentes digitais.
              </p>
              <p>
                Parte importante do trabalho foi transformar decisões de interface em documentação
                prática: specs, uso de componentes, sections, templates, estados e orientações para
                manter consistência entre design e implementação.
              </p>
            </>
          )}
        </CaseTextSection>

        <CaseTextSection
          caseStage="challenge"
          eyebrow={language === "en" ? "Challenge" : "Desafio"}
          title={language === "en" ? "Organizing content without losing consistency." : "Organizar conteúdo sem perder consistência."}
          stickyLabel
        >
          {language === "en" ? (
            <>
              <p>
                Petrobras had institutional content and articles spread across different structures.
                The challenge was to improve publication governance, reduce visual inconsistencies,
                and allow greater editorial autonomy.
              </p>
              <p>
                Additionally, the solution needed to respect technical constraints, integrate with
                Liferay CMS, and preserve the consistency of the existing digital ecosystem.
              </p>
            </>
          ) : (
            <>
              <p>
                A Petrobras tinha conteúdos institucionais e artigos distribuídos em diferentes
                estruturas. O desafio era dar mais governança para publicação, reduzir
                inconsistências visuais e permitir maior autonomia editorial.
              </p>
              <p>
                Além disso, a solução precisava respeitar restrições técnicas, dialogar com CMS
                Liferay e preservar a consistência do ecossistema digital existente.
              </p>
            </>
          )}
        </CaseTextSection>

        {evidence.length > 0 && (
          <motion.section
            data-case-stage="during"
            className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={staggerChildren}
          >
            <SectionLabel sticky>{language === "en" ? "How we solved it" : "Como resolvemos"}</SectionLabel>
            <div className="flex flex-col gap-8">
              <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
                {language === "en" ? "Process maps first, final screens after." : "Mapas de processo primeiro, telas finais depois."}
              </h2>
              {orderedEvidence.map((item) =>
                item.imageUrl ? (
                  <CaseLightboxFigure
                    key={item.title}
                    image={item.imageUrl}
                    title={item.title || ""}
                    caption={item.caption || ""}
                    onOpen={setLightboxImage}
                  />
                ) : null
              )}
              {homeDesktopEvidence?.imageUrl && homeMobileEvidence?.imageUrl ? (
                <motion.div
                  className="grid grid-cols-[minmax(0,1fr)_minmax(96px,0.36fr)] gap-4"
                  variants={sectionReveal}
                >
                  <CaseLightboxFigure
                    image={homeDesktopEvidence.imageUrl}
                    title={homeDesktopEvidence.title || ""}
                    caption={homeDesktopEvidence.caption || ""}
                    onOpen={setLightboxImage}
                  />
                  <CaseLightboxFigure
                    image={homeMobileEvidence.imageUrl}
                    title={homeMobileEvidence.title || ""}
                    caption={homeMobileEvidence.caption || ""}
                    onOpen={setLightboxImage}
                  />
                </motion.div>
              ) : null}
            </div>
          </motion.section>
        )}

        <motion.section
          data-case-stage="during"
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel sticky>{language === "en" ? "Process" : "Processo"}</SectionLabel>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {process.map((item) => (
                <motion.p
                  key={item}
                  className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                  variants={sectionReveal}
                >
                  {item}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          data-case-stage="after"
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel sticky>{language === "en" ? "Solution" : "Solução"}</SectionLabel>
          <div className="flex flex-col gap-6">
            <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "A modular portal built from the design system." : "Um portal modular construído a partir do design system."}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {outcomes.map((item) => (
                <motion.p
                  key={item}
                  className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                  variants={sectionReveal}
                >
                  {item}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.section>

        <CaseTextSection
          caseStage="after"
          eyebrow={language === "en" ? "Connection" : "Relação"}
          title={language === "en" ? "Portal, design system and main site are the same ecosystem." : "Portal, design system e site principal são o mesmo ecossistema."}
          stickyLabel
        >
          {language === "en" ? (
            <>
              <p>
                This project is part of the Petrobras digital family: Nossa Energia, design system,
                and main site. Together, they show a reusable foundation for multiple products.
              </p>
              <p>
                The Petro DS v2 documentation organized Design Tokens, Components, Sections,
                Templates, Motion, and Accessibility. This material was created manually and served
                as a reference to reduce implementation ambiguity and facilitate ecosystem evolution.
              </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <motion.a
                href="https://uxdudu.notion.site/Petro-DS-v2-2d88fb2f824449078175f0599d7b0b92?pvs=73"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-[10px] border border-border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary"
                whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
                whileTap={TAP}
                transition={SPRING}
              >
                {t.viewPetroDs}
              </motion.a>
              <motion.a
                href="/cases/petrobras-design-system/"
                className="inline-flex items-center justify-center rounded-[10px] border border-border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary"
                whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
                whileTap={TAP}
                transition={SPRING}
              >
                View PetroDS v2 Case
              </motion.a>
            </div>
            </>
          ) : (
            <>
              <p>
                Este projeto faz parte da família digital Petrobras: Nossa Energia, design system
                e site principal. Juntos, eles mostram uma base reutilizável para múltiplos produtos.
              </p>
              <p>
                A documentação do Petro DS v2 organizava Design Tokens, Components, Sections,
                Templates, Motion e Acessibilidade. Esse material foi criado manualmente e serviu
                como referência para reduzir ambiguidade na implementação e facilitar evolução do
                ecossistema.
              </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <motion.a
                href="https://uxdudu.notion.site/Petro-DS-v2-2d88fb2f824449078175f0599d7b0b92?pvs=73"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-[10px] border border-border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary"
                whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
                whileTap={TAP}
                transition={SPRING}
              >
                Ver documentação do Petro DS v2
              </motion.a>
              <motion.a
                href="/cases/petrobras-design-system/"
                className="inline-flex items-center justify-center rounded-[10px] border border-border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary"
                whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
                whileTap={TAP}
                transition={SPRING}
              >
                Ver case PetroDS v2
              </motion.a>
            </div>
            </>
          )}
        </CaseTextSection>

        <motion.section
          data-case-stage="after"
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Live" : "No ar"}</SectionLabel>
          <div className="flex flex-col items-start gap-5">
            <h2 className="max-w-[640px] text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "See the published Nossa Energia portal." : "Veja o portal Nossa Energia publicado."}
            </h2>
            <motion.a
              href="https://nossaenergia.petrobras.com.br/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-[10px] border border-border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary"
              whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
              whileTap={TAP}
              transition={SPRING}
            >
              {language === "en" ? "View live project" : "Ver projeto no ar"}
            </motion.a>
          </div>
        </motion.section>
        <NextCaseSection nextCase="clinia" language={language} caseStage="next" />
      </CaseNarrativeLayout>
      <Footer />
    </>
  );
}

export function CliniaCasePage({
  theme,
  onThemeChange,
  cmsCase,
}: PageProps & { cmsCase?: SanityCaseStudy }) {
  const prefersReducedMotion = useReducedMotion();
  const { language, t } = useTranslation();
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const process = language === "en" ? cliniaProcessEn : cliniaProcess;
  const outcomes = language === "en" ? cliniaOutcomesEn : cliniaOutcomes;
  const workflow = language === "en" ? cliniaWorkflowEn : cliniaWorkflow;
  const dsEvidence = language === "en" ? cliniaDesignSystemEvidenceEn : cliniaDesignSystemEvidence;
  const v1Screens = [
    {
      image: cliniaV1Inbox,
      title: language === "en" ? "Clinia v1, inbox screen" : "Versão 1 da Clinia, tela de inbox",
      caption: language === "en"
        ? "Inbox screen from the previous version of Clinia. This foundation helped map bottlenecks, scaling limitations, and opportunities for the new platform."
        : "Tela de inbox da versão anterior da Clinia. Essa base ajudou a mapear gargalos, limitações de escala e oportunidades para a nova plataforma.",
    },
    {
      image: cliniaV1Settings,
      title: language === "en" ? "Clinia v1, settings screen" : "Versão 1 da Clinia, tela de configurações",
      caption: language === "en"
        ? "Settings screen from the previous version, used in the audit to understand density, preferences organization, and navigation patterns."
        : "Tela de configurações da versão anterior, usada na auditoria para entender densidade, organização de preferências e padrões de navegação.",
    },
    {
      image: cliniaV1Login,
      title: language === "en" ? "Clinia v1, login screen" : "Versão 1 da Clinia, tela de login",
      caption: language === "en"
        ? "Login screen from the previous version, useful for understanding the original visual language, brand hierarchy, and platform entry patterns."
        : "Tela de login da versão anterior, útil para entender a linguagem visual original, hierarquia de marca e padrões de entrada na plataforma.",
    },
  ];

  return (
    <>
      <Header activePage="projects" theme={theme} onThemeChange={onThemeChange} />
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      <CaseNarrativeLayout
        className="flex w-full flex-col gap-10 p-5 lg:gap-20 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col items-center gap-8 text-center" variants={sectionReveal}>
          <a
            href="/projetos/"
            className="self-start text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-muted"
          >
            {t.backToProjects}
          </a>
          <div className="flex flex-col items-center gap-4">
            <SectionLabel>Clinia</SectionLabel>
            <h1 className="max-w-[880px] font-display text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px] sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
              {language === "en"
                ? "Platform 2.0, design system and AI-powered design-to-code workflow."
                : "Plataforma 2.0, design system e fluxo design-to-code com IA."}
            </h1>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <CaseMeta label={language === "en" ? "Role" : "Função"} value={language === "en" ? (cmsCase?.roleEn || cmsCase?.role || "Product Design, Design System and Frontend") : (cmsCase?.role || "Product Design, Design System e Frontend")} />
              <CaseMeta label="Status" value={language === "en" ? (cmsCase?.statusEn || cmsCase?.status || "Ongoing project") : (cmsCase?.status || "Projeto em andamento")} />
              <CaseStackLogos items={language === "en" ? (cmsCase?.stackEn || cmsCase?.stack || ["Figma", "shadcn", "Cursor", "Claude", "Figma MCP"]) : (cmsCase?.stack || ["Figma", "shadcn", "Cursor", "Claude", "Figma MCP"])} />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="w-full"
          variants={sectionReveal}
        >
          <SmoothCorners corners={{ radius: 32, smoothing: 0.72 }} className="overflow-hidden border border-border bg-card p-2">
            <button
              type="button"
              onClick={() =>
                setLightboxImage({
                  src: cliniaCover,
                  alt: "Capa do projeto Clinia Plataforma",
                  caption: language === "en" ? "Cover image for the Clinia case." : "Imagem de capa do case Clinia.",
                })
              }
              className="case-mobile-image-frame group relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-[24px] bg-[#eef5ff] text-left"
              aria-label={language === "en" ? "Zoom in: Clinia case cover" : "Ampliar imagem: capa do case Clinia"}
            >
              <img loading="lazy" decoding="async"
                src={cliniaCover}
                alt={language === "en" ? "Clinia Platform case cover" : "Capa do projeto Clinia Plataforma"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
              />
              <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                {t.zoom}
              </span>
            </button>
          </SmoothCorners>
        </motion.section>

        <CaseTestimonials caseStudy={cmsCase} caseStage="testimonial" />

        <CaseTextSection caseStage="challenge" eyebrow={language === "en" ? "Challenge" : "Desafio"} title={language === "en" ? "Version 2.0 started with understanding the problem." : "A versão 2.0 começou pelo entendimento do problema."}>
          {language === "en" ? (
            <>
              <p>
                I joined Clinia with the goal of helping build version 2.0 of the platform,
                one of the main fronts of a product that continues to evolve.
                Before proposing screens or components, the first step was to understand the pain points, bottlenecks,
                and the reason for creating a new version of an existing product.
              </p>
              <p>
                The new Clinia is built on more modern technology, closer to what mature startups
                use to scale their products. The previous version had a visual experience less aligned
                with the company's current moment and a structure that made evolution difficult.
              </p>
              <p>
                The company also didn't have a structured design system. So the work started
                with a project audit, reading the landscape, and organizing the foundations that would allow
                creating a more consistent base.
              </p>
            </>
          ) : (
            <>
              <p>
                Entrei na Clinia com o objetivo de auxiliar na construção da versão 2.0 da plataforma,
                uma das principais frentes de um produto que segue em evolução.
                Antes de propor telas ou componentes, o primeiro passo foi entender as dores, gargalos
                e o motivo de criar uma nova versão em um produto que já existia.
              </p>
              <p>
                A nova Clinia nasce com uma tecnologia mais moderna, próxima do que startups maduras
                usam para escalar produto. A versão anterior tinha uma experiência visual menos alinhada
                ao momento atual da empresa e uma estrutura que dificultava evolução.
              </p>
              <p>
                A empresa também não tinha um design system estruturado. Por isso, o trabalho começou
                com auditoria do projeto, leitura do cenário e organização das fundações que permitiriam
                criar uma base mais consistente.
              </p>
            </>
          )}
        </CaseTextSection>

        <motion.section
          data-case-stage="before"
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          variants={sectionReveal}
        >
          <div className="flex flex-col gap-4">
            <SectionLabel>{language === "en" ? "Before" : "Antes"}</SectionLabel>
            <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "Interfaces before the rebuild." : "Interfaces antes da reconstrução."}
            </h2>
          </div>
          <div className="flex flex-col gap-8">
            {v1Screens.map((item, index) => (
              <motion.figure
                key={item.title}
                className="flex flex-col gap-4"
                variants={sectionReveal}
              >
                <SmoothCorners corners={{ radius: 32, smoothing: 0.72 }} className="overflow-hidden border border-border bg-card p-2">
                  <button
                    type="button"
                    onClick={() => setLightboxImage({ src: item.image, alt: item.title, caption: item.caption })}
                    className="case-mobile-image-frame group relative block w-full cursor-zoom-in overflow-hidden rounded-[24px] bg-white text-left"
                    aria-label={`${t.zoom}: ${item.title}`}
                  >
                    <img loading="lazy" decoding="async"
                      src={item.image}
                      alt={item.title}
                      className={[
                        "w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]",
                        index === 0 ? "aspect-[16/8] lg:aspect-[16/7]" : "aspect-[16/8]",
                      ].join(" ")}
                    />
                    <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      {t.zoom}
                    </span>
                  </button>
                </SmoothCorners>
                <figcaption className="text-[14px] leading-[1.45] tracking-[-0.42px] text-muted">
                  {item.caption}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.section>

        <CaseTextSection caseStage="during" eyebrow={language === "en" ? "How we solved it" : "Como resolvemos"} title={language === "en" ? "shadcn as the bridge between identity, Figma, and frontend." : "shadcn como ponte entre identidade, Figma e frontend."}>
          {language === "en" ? (
            <>
              <p>
                When I joined, there was already a visual direction the company wanted to follow and some
                references to frontend frameworks to accelerate development. The decision was to go with
                shadcn as the component base.
              </p>
              <p>
                From there, I adapted the Figma structure to respect Clinia's visual identity while
                maintaining proximity to the real implementation. The goal was to avoid a design system
                that looked great in Figma but was far from the code.
              </p>
            </>
          ) : (
            <>
              <p>
                Quando entrei, já existia uma linha visual que a empresa queria seguir e algumas
                referências de frameworks de frontend para acelerar a construção. A decisão foi seguir
                com shadcn como base de componentes.
              </p>
              <p>
                A partir disso, adaptei a estrutura do Figma para respeitar a identidade visual da
                Clinia e, ao mesmo tempo, manter proximidade com a implementação real. O objetivo era
                evitar um design system bonito no Figma, mas distante do código.
              </p>
            </>
          )}
          <CaseLightboxFigure
            image={cliniaShadcnFoundation}
            title="shadcn: The Foundation for your Design System"
            caption={language === "en" ? "Open source component base used as the starting point for Clinia's design system, adapted to the brand's visual identity." : "Base de componentes open source usada como ponto de partida para o design system da Clinia, adaptada à identidade visual da marca."}
            onOpen={setLightboxImage}
            imageClassName="aspect-[16/10] w-full object-cover"
          />
        </CaseTextSection>

        <motion.section
          data-case-stage="during"
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <div className="flex flex-col gap-4">
            <SectionLabel>{language === "en" ? "Custom shadcn" : "shadcn customizado"}</SectionLabel>
            <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "Components and tokens adapted for Clinia." : "Componentes e tokens adaptados para a Clinia."}
            </h2>
          </div>
          <div className="flex flex-col gap-8">
            <CaseLightboxFigure
              image={dsEvidence[0].image}
              title={dsEvidence[0].title}
              caption={dsEvidence[0].caption}
              onOpen={setLightboxImage}
              imageClassName="aspect-[16/10] w-full object-cover"
            />
            <div className="flex flex-col gap-8">
              {dsEvidence.slice(1).map((item) => (
                <CaseLightboxFigure
                  key={item.title}
                  image={item.image}
                  title={item.title}
                  caption={item.caption}
                  onOpen={setLightboxImage}
                  imageClassName="aspect-[16/10] w-full object-cover"
                />
              ))}
            </div>
          </div>
        </motion.section>

        <CliniaPrototypeSection onOpen={setLightboxImage} caseStage="during" />

        <motion.section
          data-case-stage="during"
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Process" : "Processo"}</SectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {process.map((item) => (
              <motion.p
                key={item}
                className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                variants={sectionReveal}
              >
                {item}
              </motion.p>
            ))}
          </div>
        </motion.section>

        <motion.section
          data-case-stage="during"
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <div className="flex flex-col gap-4">
            <SectionLabel>Workflow</SectionLabel>
            <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
              {language === "en" ? "Designers also ship code." : "Designers também entregam código."}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {workflow.map((item) => (
              <motion.article
                key={item.title}
                className="rounded-3xl border border-border bg-card p-6"
                variants={sectionReveal}
              >
                <h3 className="text-[24px] font-medium leading-none tracking-[-1.2px] text-card-foreground">
                  {item.title}
                </h3>
                <p className="mt-4 text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <CaseTextSection caseStage="during" eyebrow={language === "en" ? "AI in the process" : "IA no processo"} title={language === "en" ? "Figma, Cursor and Claude synchronized daily." : "Figma, Cursor e Claude sincronizados no dia a dia."}>
          {language === "en" ? (
            <>
              <p>
                A differentiating aspect of Clinia is that designers use Cursor and Claude as work tools.
                After syncing Figma and code, we created a separate frontend repository that is continuously
                fed with components and patterns.
              </p>
              <p>
                With this workflow, developers can use AI tools to consume the Figma design and implement
                with more speed. The deliverable stops being just a static interface and starts to include
                code, intent, and reusable structure.
              </p>
              <p>
                Alongside this foundation, we're also working on the new onboarding, statistics, CRM areas,
                and other platform evolutions, as well as the Pricing page on the site.
              </p>
            </>
          ) : (
            <>
              <p>
                Um ponto diferencial da Clinia é que designers usam Cursor e Claude como ferramentas
                de trabalho. Depois de sincronizar Figma e código, criamos um repositório de frontend
                separado que é alimentado continuamente com componentes e padrões.
              </p>
              <p>
                Com esse fluxo, desenvolvedores conseguem usar ferramentas de IA para consumir o
                design do Figma e implementar com mais velocidade. A entrega deixa de ser apenas
                interface estática e passa a incluir código, intenção e estrutura reutilizável.
              </p>
              <p>
                Paralelamente a essa base, também estamos trabalhando no novo onboarding, nas áreas de
                estatísticas, CRM e em outras evoluções da plataforma, além da página de Pricing no site.
              </p>
            </>
          )}
        </CaseTextSection>

        <motion.section
          data-case-stage="after"
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Solution" : "Solução"}</SectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {outcomes.map((item) => (
              <motion.p
                key={item}
                className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                variants={sectionReveal}
              >
                {item}
              </motion.p>
            ))}
          </div>
        </motion.section>
        <NextCaseSection nextCase="talqui" language={language} caseStage="next" />
      </CaseNarrativeLayout>
      <Footer />
    </>
  );
}

export function TalquiCasePage({
  theme,
  onThemeChange,
  cmsCase,
}: PageProps & { cmsCase?: SanityCaseStudy }) {
  const prefersReducedMotion = useReducedMotion();
  const { language, t } = useTranslation();
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const foundations = language === "en" ? talquiFoundationsEn : talquiFoundations;
  const process = language === "en" ? talquiProcessEn : talquiProcess;
  const outcomes = language === "en" ? talquiOutcomesEn : talquiOutcomes;
  const hiddenTalquiEvidenceKeywords = ["mockup da plataforma talqui", "modelos de mensagem"];
  const evidence = (cmsCase?.evidence?.length ? cmsCase.evidence : talquiEvidenceFallback).filter((item) => {
    const text = `${item.title || ""} ${item.caption || ""}`.toLowerCase();
    return !hiddenTalquiEvidenceKeywords.some((keyword) => text.includes(keyword));
  });

  return (
    <>
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      <Header activePage="projects" theme={theme} onThemeChange={onThemeChange} />
      <CaseNarrativeLayout
        className="flex w-full flex-col gap-10 p-5 lg:gap-20 lg:p-20"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={staggerChildren}
      >
        <motion.section className="flex flex-col items-center gap-8 text-center" variants={sectionReveal}>
          <a
            href="/projetos/"
            className="self-start text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-muted"
          >
            {t.backToProjects}
          </a>
          <div className="flex flex-col items-center gap-4">
            <SectionLabel>Talqui</SectionLabel>
            <h1 className="max-w-[880px] font-display text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px] sm:text-[44px] sm:tracking-[-2.2px] lg:text-[56px] lg:tracking-[-2.8px]">
              {language === "en"
                ? "A new platform with its own identity and a scalable design system."
                : "Uma nova plataforma com identidade própria e design system escalável."}
            </h1>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <CaseMeta label={language === "en" ? "Role" : "Função"} value={language === "en" ? (cmsCase?.roleEn || cmsCase?.role || "Product Design, UI and Design System") : (cmsCase?.role || "Product Design, UI e Design System")} />
              <CaseMeta label="Status" value={language === "en" ? (cmsCase?.statusEn || cmsCase?.status || "AI-powered support platform") : (cmsCase?.status || "Plataforma de atendimento com IA")} />
              <CaseStackLogos items={language === "en" ? (cmsCase?.stackEn || cmsCase?.stack || ["Figma", "Design Tokens", "Storybook", "AI"]) : (cmsCase?.stack || ["Figma", "Design Tokens", "Storybook", "IA"])} />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="w-full"
          variants={sectionReveal}
        >
          <SmoothCorners corners={{ radius: 32, smoothing: 0.72 }} className="overflow-hidden border border-border bg-card p-2">
            <button
              type="button"
              onClick={() =>
                setLightboxImage({
                  src: talquiCover,
                  alt: "Capa do projeto Talqui Plataforma",
                  caption: language === "en" ? "Cover image for the Talqui case." : "Imagem de capa do case Talqui.",
                })
              }
              className="case-mobile-image-frame group relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-[24px] bg-[#49a8ff] text-left"
              aria-label={language === "en" ? "Zoom in: Talqui case cover" : "Ampliar imagem: capa do case Talqui"}
            >
              <img loading="lazy" decoding="async"
                src={talquiCover}
                alt={language === "en" ? "Talqui Platform case cover" : "Capa do projeto Talqui Plataforma"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
              />
              <span className="absolute bottom-4 right-4 rounded-full bg-black/52 px-3 py-1 text-[13px] font-medium leading-[1.45] tracking-[-0.39px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                {t.zoom}
              </span>
            </button>
          </SmoothCorners>
        </motion.section>

        <CaseTestimonials caseStudy={cmsCase} caseStage="testimonial" />

        <CaseTextSection caseStage="challenge" eyebrow={language === "en" ? "Challenge" : "Desafio"} title={language === "en" ? "The platform needed to stop looking like a technical fork." : "A plataforma precisava deixar de parecer um fork técnico."}>
          {language === "en" ? (
            <>
              <p>
                At Talqui, I built the entire new platform, from the design system to the new screens.
                The previous version had been born as a fork of an interface created by the development team,
                which solved initial needs but limited identity and scale.
              </p>
              <p>
                The main goal was to create a platform identity for Talqui: an experience
                that fit the brand, communicated the product better, and supported new features
                without depending on loose visual decisions.
              </p>
            </>
          ) : (
            <>
              <p>
                Na Talqui, construí toda a nova plataforma, desde o design system até as novas telas.
                A versão anterior havia nascido como um fork de uma interface criada pelo time de
                desenvolvimento, o que resolvia necessidades iniciais, mas limitava identidade e escala.
              </p>
              <p>
                O grande objetivo era criar uma identidade de plataforma para a Talqui: uma experiência
                que se encaixasse com a marca, comunicasse melhor o produto e sustentasse novas features
                sem depender de decisões visuais soltas.
              </p>
            </>
          )}
        </CaseTextSection>

        <CaseTextSection
          caseStage="before"
          eyebrow={language === "en" ? "Before" : "Antes"}
          title={language === "en" ? "A functional base without a product identity." : "Uma base funcional, mas sem identidade de produto."}
        >
          <p>
            {language === "en"
              ? "The previous interface originated from a technical fork and solved the first operational needs, but it inherited patterns that did not express Talqui's brand."
              : "A interface anterior nasceu de um fork técnico e resolvia as primeiras necessidades operacionais, mas herdava padrões que não expressavam a marca Talqui."}
          </p>
          <p>
            {language === "en"
              ? "Without shared tokens, components, and documentation, each new feature increased visual fragmentation and implementation ambiguity."
              : "Sem tokens, componentes e documentação compartilhados, cada nova feature aumentava a fragmentação visual e a ambiguidade de implementação."}
          </p>
        </CaseTextSection>

        <CaseTextSection caseStage="during" eyebrow={language === "en" ? "How we solved it" : "Como resolvemos"} title={language === "en" ? "Tokens, components, and documentation designed for scale." : "Tokens, componentes e documentação pensados para escala."}>
          {language === "en" ? (
            <>
              <p>
                The design system was built from the ground up with scale in mind. Variables, design
                tokens, components, and patterns were organized as a product foundation.
              </p>
              <p>
                I created the design tokens with custom naming, bringing together brand semantics,
                interface logic, and implementation. This helps the team evolve the system with less ambiguity.
              </p>
              <p>
                Developers created a dedicated repository for the design system and keep this
                material up to date, syncing the documentation with Storybook. This makes the project
                much more scalable and ready for new updates.
              </p>
            </>
          ) : (
            <>
              <p>
                O design system foi construído desde o início com escala em mente. Variáveis, design
                tokens, componentes e padrões foram organizados como uma base de produto.
              </p>
              <p>
                Criei os design tokens com uma nomenclatura personalizada, aproximando a semântica da
                marca, a lógica de interface e a implementação. Isso ajuda o time a evoluir o sistema
                com menos ambiguidade.
              </p>
              <p>
                Os desenvolvedores criaram um repositório específico para o design system e mantêm esse
                material atualizado, sincronizando a documentação com Storybook. Isso deixa o projeto
                muito mais escalável e preparado para novas atualizações.
              </p>
            </>
          )}
        </CaseTextSection>

        {evidence.length > 0 && (
          <motion.section
            data-case-stage="during"
            className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={staggerChildren}
          >
            <div className="flex flex-col gap-4">
              <SectionLabel>Design System</SectionLabel>
              <h2 className="text-[22px] font-medium leading-none tracking-[-1.1px] text-foreground lg:text-[32px] lg:tracking-[-1.6px]">
                {language === "en" ? "Tokens, components and platform in practice." : "Tokens, componentes e plataforma em prática."}
              </h2>
            </div>
            <div className="flex flex-col gap-8">
              {evidence.map((item) =>
                item.imageUrl ? (
                  <CaseLightboxFigure
                    key={item.title}
                    image={item.imageUrl}
                    title={item.title || ""}
                    caption={item.caption || ""}
                    onOpen={setLightboxImage}
                  />
                ) : null
              )}
            </div>
          </motion.section>
        )}

        <motion.section
          data-case-stage="during"
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Foundations" : "Fundações"}</SectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {foundations.map((item) => (
              <motion.article
                key={item.title}
                className="rounded-3xl border border-border bg-card p-6"
                variants={sectionReveal}
              >
                <h2 className="text-[24px] font-medium leading-none tracking-[-1.2px] text-card-foreground">
                  {item.title}
                </h2>
                <p className="mt-4 text-[16px] leading-[1.45] tracking-[-0.32px] text-muted">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          data-case-stage="during"
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Process" : "Processo"}</SectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {process.map((item) => (
              <motion.p
                key={item}
                className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                variants={sectionReveal}
              >
                {item}
              </motion.p>
            ))}
          </div>
        </motion.section>

        <motion.section
          data-case-stage="after"
          className="flex flex-col gap-8 border-t border-border pt-10 lg:grid lg:grid-cols-[320px_1fr] lg:gap-20"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren}
        >
          <SectionLabel>{language === "en" ? "Solution" : "Solução"}</SectionLabel>
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {outcomes.map((item) => (
                <motion.p
                  key={item}
                  className="rounded-3xl border border-border bg-card p-6 text-[20px] font-medium leading-[1.45] tracking-[-0.6px] text-card-foreground"
                  variants={sectionReveal}
                >
                  {item}
                </motion.p>
              ))}
            </div>
            <motion.a
              href="https://design-system.talqui.dev/"
              target="_blank"
              rel="noreferrer"
              className="w-fit rounded-[10px] border border-border px-4 py-2 text-[14px] font-medium leading-[1.45] tracking-[-0.42px] text-primary"
              whileHover={{ y: -1, borderColor: "var(--color-primary)" }}
              whileTap={TAP}
              transition={SPRING}
            >
              {language === "en" ? "View Storybook" : "Ver Storybook no ar"}
            </motion.a>
          </div>
        </motion.section>
        <NextCaseSection nextCase="petrobras-ds" language={language} caseStage="next" />
      </CaseNarrativeLayout>
      <Footer />
    </>
  );
}
