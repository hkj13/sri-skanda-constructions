import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon } from "@/components/ui/icons";
import type { ChapterCopy } from "@content/home";
import { tr } from "@content/i18n";
import { ui } from "@content/ui";

/** Corner title block, like the one on a real drawing sheet. */
export function TitleBlock({ sheet, drawing, scale }: { sheet: string; drawing: string; scale: string }) {
  return (
    <p
      aria-hidden="true"
      className="t-tech pointer-events-none absolute right-[calc(var(--margin)+3.5rem)] top-[calc(var(--header-h)+1.25rem)] z-10 hidden border border-navy-300/70 text-[11px] text-navy-300 lg:flex"
    >
      <span className="border-r border-navy-300/70 px-3 py-1.5 text-accent">{sheet}</span>
      <span className="border-r border-navy-300/70 px-3 py-1.5">{drawing}</span>
      <span className="px-3 py-1.5">{scale}</span>
    </p>
  );
}

/** Eyebrow, headline, paragraph and any controls, in the text column. */
export function ChapterText({
  copy,
  children,
  headline,
  as: Heading = "h2",
}: {
  copy: ChapterCopy;
  children?: ReactNode;
  /** Replaces the default heading (the Structure chapter hangs it from the crane). */
  headline?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="relative z-10">
      <p className="t-eyebrow text-accent">{tr(copy.eyebrow)}</p>
      {headline ?? (
        <Heading className={`${Heading === "h1" ? "t-h1" : "t-h2"} mt-4 text-white`}>
          {tr(copy.headline)}
        </Heading>
      )}
      <p className="t-lead mt-6 max-w-[34ch] text-white/90">{tr(copy.body)}</p>
      {children}
      {copy.service ? (
        <p className="mt-8">
          <Link
            href={`/services/${copy.service}`}
            className="inline-flex items-center gap-2 font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-accent"
          >
            {tr(ui.cta.readMore)}
            <span className="sr-only">: {tr(copy.eyebrow)}</span>
            <ArrowIcon className="h-5 w-5" />
          </Link>
        </p>
      ) : null}
    </div>
  );
}

/**
 * Stage layout: text in five columns, the drawing in the other seven and
 * bleeding to the right edge, so the full width is always in use.
 */
export function Stage({
  text,
  scene,
  copy,
  slot,
}: {
  text: ReactNode;
  scene: ReactNode;
  copy: ChapterCopy;
  /** Marks this stage as a place for the 3D model, at the given chapter. */
  slot?: number;
}) {
  return (
    <>
      {slot !== undefined ? (
        <div
          data-scene-slot=""
          data-chapter={slot}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
        />
      ) : null}
      <TitleBlock sheet={copy.sheet} drawing={copy.drawing} scale={copy.scale} />
      <div className="shell grid-12 h-full items-center gap-y-10 pb-16 pt-[calc(var(--header-h)+3rem)] lg:pb-0 lg:pt-[var(--header-h)]">
        <div className="col-span-12 lg:col-span-5 2xl:col-span-4">{text}</div>
        <div
          data-scene=""
          className="scene-fit relative col-span-12 -mx-[var(--margin)] lg:col-span-7 lg:col-start-6 lg:mx-0 lg:mr-[calc(var(--margin)*-1)] lg:h-full 2xl:col-span-8 2xl:col-start-5"
        >
          {/* A 10:9 box that fits the column, so overlays line up with the drawing. */}
          <div className="scene-box">{scene}</div>
        </div>
      </div>
    </>
  );
}

/** Class for a drawing that fills the scene box. */
export const SCENE_SVG = "absolute inset-0 z-[1] block h-full w-full";

/** Mono label inside a drawing. */
export function Tag({
  x,
  y,
  children,
  anchor,
  fill = "#a4b1da",
  size = 13,
  className,
  style,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  fill?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fill={fill}
      textAnchor={anchor}
      className={className}
      style={{
        fontFamily: "var(--font-dm-mono), ui-monospace, monospace",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </text>
  );
}
