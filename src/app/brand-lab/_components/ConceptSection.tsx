import type { ReactNode } from "react";
import { Logo } from "@/brand/Logo";
import { logoSvgString } from "@/brand/build";
import type { Concept } from "@/brand/concepts";
import { BusinessCard, Helmet, Hoarding, WhatsAppAvatar } from "./Mockups";
import { PixelPreview } from "./PixelPreview";

/** Small heading with a dimension line, like a label on a drawing. */
function SpecLabel({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1">
      <h3 className="shrink-0 text-[13px] font-semibold uppercase tracking-[0.18em] text-primary">
        {children}
      </h3>
      <span
        aria-hidden="true"
        className="relative h-px min-w-8 flex-1 bg-primary/25 before:absolute before:left-0 before:top-[-4px] before:h-[9px] before:w-px before:bg-primary/40 after:absolute after:right-0 after:top-[-4px] after:h-[9px] after:w-px after:bg-primary/40"
      />
      {note ? (
        <p className="basis-full text-[13px] text-neutral-600 sm:basis-auto">
          {note}
        </p>
      ) : null}
    </div>
  );
}

function Panel({
  tone,
  className = "",
  children,
}: {
  tone: "white" | "navy" | "lime" | "paper";
  className?: string;
  children: ReactNode;
}) {
  const tones = {
    white: "bg-white ring-1 ring-inset ring-primary/10",
    navy: "bg-primary",
    lime: "bg-accent",
    paper: "bg-neutral-100",
  };
  return (
    <div className={`rounded-lg ${tones[tone]} ${className}`}>{children}</div>
  );
}

/** Faint navy-on-navy drawing grid. */
function BlueprintGrid() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 opacity-60"
      style={{
        backgroundImage:
          "linear-gradient(var(--secondary) 1px, transparent 1px), linear-gradient(90deg, var(--secondary) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
  );
}

function MockNav({ concept, dark }: { concept: Concept; dark?: boolean }) {
  return (
    <div
      className={`@container rounded-lg ${
        dark ? "bg-primary" : "bg-white ring-1 ring-inset ring-primary/10"
      }`}
    >
      <div className="flex h-[72px] items-center justify-between gap-6 px-5 sm:px-8">
        <Logo
          concept={concept.id}
          kind="horizontal"
          variant={dark ? "dark" : "light"}
          title={`Concept ${concept.letter} at header size on ${dark ? "navy" : "white"}`}
          className="h-10 w-auto shrink-0"
        />
        <ul
          aria-hidden="true"
          className={`flex items-center gap-8 whitespace-nowrap text-[15px] font-medium ${
            dark ? "text-white" : "text-primary"
          }`}
        >
          <li className="hidden @3xl:block">Services</li>
          <li className="hidden @3xl:block">Process</li>
          <li className="hidden @3xl:block">Estimate</li>
          <li className="hidden @3xl:block">Contact</li>
          <li
            className={`hidden rounded-full px-5 py-2 font-semibold @md:block ${
              dark ? "bg-accent text-primary" : "bg-primary text-white"
            }`}
          >
            Plan your build
          </li>
        </ul>
      </div>
    </div>
  );
}

function BrowserTab({ concept, dark }: { concept: Concept; dark?: boolean }) {
  return (
    <div
      className={`flex items-end rounded-lg px-3 pt-3 ${dark ? "bg-neutral-900" : "bg-neutral-200"}`}
    >
      <div
        className={`flex w-64 max-w-full items-center gap-2 rounded-t-lg px-3 py-2.5 ${
          dark ? "bg-neutral-700 text-white" : "bg-white text-neutral-800"
        }`}
      >
        <Logo
          concept={concept.id}
          kind="icon"
          title={`Concept ${concept.letter} favicon at 16 pixels in a ${dark ? "dark" : "light"} browser tab`}
          className="h-4 w-4 shrink-0"
        />
        <span className="truncate text-[12px]">Sri Skanda Constructions</span>
        <span aria-hidden="true" className="ml-auto text-[12px] opacity-60">
          ×
        </span>
      </div>
    </div>
  );
}

export function ConceptSection({ concept }: { concept: Concept }) {
  const id = concept.id;
  const iconSvg = (px: number) => logoSvgString(concept, "icon", { size: px });
  const markSvg = (px: number) => logoSvgString(concept, "mark", { size: px });

  return (
    <section
      id={`concept-${id}`}
      aria-labelledby={`concept-${id}-title`}
      className="scroll-mt-6 border-t border-primary/15 py-14 lg:py-20"
    >
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-8">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-accent">
                {concept.letter}
              </span>
              <Logo concept={id} kind="mark" className="h-14 w-14" />
            </div>
            <h2
              id={`concept-${id}-title`}
              className="mt-6 text-4xl font-light tracking-tight text-primary xl:text-5xl"
            >
              {concept.name}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-primary/85">
              {concept.idea}
            </p>
            <h3 className="mt-8 text-[13px] font-semibold uppercase tracking-[0.18em] text-primary">
              What it carries
            </h3>
            <ul className="mt-3 space-y-3 text-[15px] leading-relaxed text-primary/85">
              {concept.carries.map((line) => (
                <li key={line} className="border-l-2 border-primary pl-4">
                  {line}
                </li>
              ))}
            </ul>
            <h3 className="mt-8 text-[13px] font-semibold uppercase tracking-[0.18em] text-primary">
              Watch for
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-primary/85">
              {concept.watchFor}
            </p>
          </div>
        </div>

        <div className="min-w-0 space-y-12 lg:col-span-8 xl:col-span-9">
          <div>
            <SpecLabel note="Stacked lockup on navy, white and lime">Hero size</SpecLabel>
            <div className="grid gap-4 md:grid-cols-2">
              <Panel
                tone="navy"
                className="relative flex min-h-[340px] items-center justify-center overflow-hidden py-14 md:col-span-2 lg:min-h-[440px]"
              >
                <BlueprintGrid />
                <Logo
                  concept={id}
                  kind="stacked"
                  variant="dark"
                  title={`Concept ${concept.letter} stacked lockup reversed on navy`}
                  className="relative h-auto w-[min(68%,380px)]"
                />
              </Panel>
              <Panel tone="white" className="flex min-h-[300px] items-center justify-center py-12">
                <Logo
                  concept={id}
                  kind="stacked"
                  title={`Concept ${concept.letter} stacked lockup on white`}
                  className="h-auto w-[min(64%,280px)]"
                />
              </Panel>
              <Panel tone="lime" className="flex min-h-[300px] items-center justify-center py-12">
                <Logo
                  concept={id}
                  kind="stacked"
                  title={`Concept ${concept.letter} stacked lockup on lime`}
                  className="h-auto w-[min(64%,280px)]"
                />
              </Panel>
            </div>
          </div>

          <div>
            <SpecLabel note="Horizontal lockup, 40 px tall">Header size</SpecLabel>
            <div className="grid gap-4 2xl:grid-cols-2">
              <MockNav concept={concept} />
              <MockNav concept={concept} dark />
            </div>
          </div>

          <div>
            <SpecLabel note="Actual size, then enlarged pixel by pixel">
              Favicon size
            </SpecLabel>
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              <div className="space-y-4">
                <BrowserTab concept={concept} />
                <BrowserTab concept={concept} dark />
              </div>
              <Panel tone="paper" className="flex items-center justify-around gap-4 p-5">
                <figure className="text-center">
                  <PixelPreview
                    svg={iconSvg(16)}
                    pixels={16}
                    zoom={7}
                    label={`Concept ${concept.letter} favicon at 16 pixels, enlarged`}
                  />
                  <figcaption className="mt-2 text-[13px] text-neutral-600">
                    Favicon, 16 px
                  </figcaption>
                </figure>
                <figure className="text-center">
                  <PixelPreview
                    svg={iconSvg(32)}
                    pixels={32}
                    zoom={3.5}
                    label={`Concept ${concept.letter} favicon at 32 pixels, enlarged`}
                  />
                  <figcaption className="mt-2 text-[13px] text-neutral-600">
                    Favicon, 32 px
                  </figcaption>
                </figure>
              </Panel>
              <Panel tone="white" className="flex items-center justify-around gap-4 p-5">
                <figure className="text-center">
                  <PixelPreview
                    svg={markSvg(16)}
                    pixels={16}
                    zoom={7}
                    label={`Concept ${concept.letter} mark alone at 16 pixels, enlarged`}
                  />
                  <figcaption className="mt-2 text-[13px] text-neutral-600">
                    Mark alone, 16 px
                  </figcaption>
                </figure>
                <figure className="text-center">
                  <PixelPreview
                    svg={markSvg(32)}
                    pixels={32}
                    zoom={3.5}
                    label={`Concept ${concept.letter} mark alone at 32 pixels, enlarged`}
                  />
                  <figcaption className="mt-2 text-[13px] text-neutral-600">
                    Mark alone, 32 px
                  </figcaption>
                </figure>
              </Panel>
              <Panel tone="white" className="flex items-end justify-around gap-3 p-5">
                {[16, 24, 32, 48, 64].map((px) => (
                  <figure key={px} className="text-center">
                    <Logo
                      concept={id}
                      kind="mark"
                      title={`Concept ${concept.letter} mark at ${px} pixels`}
                      style={{ width: px, height: px }}
                      className="mx-auto"
                    />
                    <figcaption className="mt-2 text-[13px] text-neutral-600">
                      {px}
                    </figcaption>
                  </figure>
                ))}
              </Panel>
            </div>
          </div>

          <div>
            <SpecLabel note="No lime, no tints: one ink only">One colour</SpecLabel>
            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              <Panel tone="white" className="flex aspect-[5/2] items-center justify-center text-primary">
                <Logo
                  concept={id}
                  kind="horizontal"
                  variant="mono"
                  title={`Concept ${concept.letter} in one colour, navy on white`}
                  className="h-auto w-[72%]"
                />
              </Panel>
              <Panel tone="white" className="flex aspect-[5/2] items-center justify-center text-black">
                <Logo
                  concept={id}
                  kind="horizontal"
                  variant="mono"
                  title={`Concept ${concept.letter} in one colour, black on white`}
                  className="h-auto w-[72%]"
                />
              </Panel>
              <Panel tone="navy" className="flex aspect-[5/2] items-center justify-center text-white">
                <Logo
                  concept={id}
                  kind="horizontal"
                  variant="mono"
                  title={`Concept ${concept.letter} in one colour, white on navy`}
                  className="h-auto w-[72%]"
                />
              </Panel>
              <Panel tone="lime" className="flex aspect-[5/2] items-center justify-center text-primary">
                <Logo
                  concept={id}
                  kind="horizontal"
                  variant="mono"
                  title={`Concept ${concept.letter} in one colour, navy on lime`}
                  className="h-auto w-[72%]"
                />
              </Panel>
            </div>
          </div>

          <div>
            <SpecLabel note="Hoarding, helmet, business card, WhatsApp">In use</SpecLabel>
            <div
              tabIndex={0}
              role="group"
              aria-label={`Concept ${concept.letter} on a site hoarding. Scroll sideways on small screens.`}
              className="overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="min-w-[720px]">
                <Hoarding concept={id} />
              </div>
            </div>
            <Panel tone="paper" className="mt-4 p-6 sm:p-10">
              <BusinessCard concept={id} />
            </Panel>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Panel tone="paper" className="flex items-center justify-center p-6">
                <div className="w-full max-w-[300px]">
                  <Helmet concept={id} shell="white" />
                </div>
              </Panel>
              <Panel tone="paper" className="flex items-center justify-center p-6">
                <div className="w-full max-w-[300px]">
                  <Helmet concept={id} shell="lime" />
                </div>
              </Panel>
              <Panel tone="paper" className="p-6">
                <WhatsAppAvatar concept={id} />
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
