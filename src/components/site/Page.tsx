import type { ReactNode } from "react";
import Link from "next/link";
import { LocationArt, StageArt, STAGE_VIEW } from "@/scene/StageArt";
import type { ServiceStage } from "@content/services";

type HeroStage = ServiceStage | "location";

/**
 * Hero for inner pages: navy drawing paper, the title on the left and, when
 * given, the building at a matching stage on the right. The right-hand box
 * is also a slot for the 3D model.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  stage,
  az,
  children,
  crumbs,
  sheet,
  compact,
}: {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  stage?: HeroStage;
  /** Shorter hero, for pages where a form should show without scrolling. */
  compact?: boolean;
  /** Camera angle for the 3D model on this page. */
  az?: number;
  children?: ReactNode;
  crumbs?: { href: string; label: string }[];
  /** Drawing title block, e.g. ["S-301", "FRAME", "1:100"]. */
  sheet?: [string, string, string];
}) {
  const view = stage && stage !== "plan" && stage !== "location" ? STAGE_VIEW[stage] : null;
  return (
    <section className="relative text-white">
      <div
        className={`shell grid-12 items-center gap-y-8 pt-[calc(var(--header-h)+var(--laser-h)+2.5rem)] ${
          compact ? "pb-10 lg:min-h-[min(60svh,620px)] lg:pb-12" : "min-h-[min(80svh,880px)] pb-14 lg:pb-20"
        }`}
      >
        <div className={stage ? "col-span-12 lg:col-span-6 xl:col-span-5" : "col-span-12 lg:col-span-9 xl:col-span-8"}>
          {crumbs?.length ? (
            <nav aria-label="Breadcrumb" className="t-tech mb-6 text-navy-300">
              <ol className="flex flex-wrap gap-x-2">
                {crumbs.map((c, i) => (
                  <li key={c.href} className="flex gap-x-2">
                    {i > 0 ? <span aria-hidden="true">/</span> : null}
                    <Link href={c.href} className="underline-offset-4 hover:text-accent hover:underline focus-visible:outline-accent">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <p className="t-eyebrow text-accent">{eyebrow}</p>
          <h1 className="t-h1 mt-4 text-balance">{title}</h1>
          {intro ? <div className="t-lead mt-6 max-w-[42ch] space-y-4 text-white/90">{intro}</div> : null}
          {children ? <div className="mt-9">{children}</div> : null}
        </div>
        {stage ? (
          <div className="relative col-span-12 -mx-[var(--margin)] lg:col-span-6 lg:col-start-7 lg:mx-0 xl:col-span-7 xl:col-start-6">
            <div className={`relative mx-auto aspect-[10/9] w-full ${compact ? "max-w-[560px]" : "max-w-[880px]"}`}>
              {view ? (
                <div
                  data-scene-slot=""
                  data-g={view.g}
                  data-variant={view.variant}
                  data-az={az ?? 42}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 hidden lg:block"
                />
              ) : null}
              <div data-scene-fallback={view ? "" : undefined} className="absolute inset-0">
                {stage === "location" ? (
                  <LocationArt className="absolute inset-0 h-full w-full" />
                ) : (
                  <StageArt stage={stage} className="absolute inset-0 h-full w-full" />
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {sheet ? (
        <p aria-hidden="true" className="t-tech pointer-events-none absolute right-[var(--margin)] top-[calc(var(--header-h)+var(--laser-h)+1.25rem)] hidden border border-navy-300/70 text-[11px] text-navy-300 lg:flex">
          <span className="border-r border-navy-300/70 px-3 py-1.5 text-accent">{sheet[0]}</span>
          <span className="border-r border-navy-300/70 px-3 py-1.5">{sheet[1]}</span>
          <span className="px-3 py-1.5">{sheet[2]}</span>
        </p>
      ) : null}
    </section>
  );
}

/** A calm content band on a light ground. */
export function Band({
  children,
  tone = "white",
  className = "",
  id,
  labelledBy,
}: {
  children: ReactNode;
  tone?: "white" | "surface" | "paper";
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  const bg = { white: "bg-white", surface: "bg-surface", paper: "bg-navy-50" }[tone];
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative ${bg} text-primary ${className}`}>
      <div className="shell py-16 lg:py-24">{children}</div>
    </section>
  );
}

/** Section heading with a dimension line, like a label on a drawing. */
export function SectionTitle({ id, children, eyebrow }: { id?: string; children: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-10 lg:mb-14">
      {eyebrow ? <p className="t-eyebrow text-primary">{eyebrow}</p> : null}
      <div className="mt-3 flex items-end gap-6">
        <h2 id={id} className="t-h2 shrink-0 text-balance">
          {children}
        </h2>
        <span aria-hidden="true" className="relative mb-4 hidden h-px flex-1 bg-primary/25 before:absolute before:-top-1 before:left-0 before:h-[9px] before:w-px before:bg-primary/40 after:absolute after:-top-1 after:right-0 after:h-[9px] after:w-px after:bg-primary/40 md:block" />
      </div>
    </div>
  );
}

/** Closing call to action on navy, used at the foot of inner pages. */
export function CtaBand({ title, body, children }: { title: string; body?: string; children: ReactNode }) {
  return (
    <section className="relative bg-primary text-white">
      <div aria-hidden="true" className="bp-grid absolute inset-0 opacity-50" />
      <div className="shell grid-12 relative items-center gap-y-8 py-16 lg:py-24">
        <div className="col-span-12 lg:col-span-6">
          <h2 className="t-h2 text-balance">{title}</h2>
          {body ? <p className="t-lead mt-5 max-w-[44ch] text-white/90">{body}</p> : null}
        </div>
        <div className="col-span-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-6 lg:justify-end">{children}</div>
      </div>
    </section>
  );
}
