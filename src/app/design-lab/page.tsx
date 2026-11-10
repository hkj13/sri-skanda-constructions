import type { Metadata } from "next";
import { DM_Mono, IBM_Plex_Mono, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/brand/Logo";
import {
  COLORS,
  DURATIONS,
  EASES,
  LAYOUT,
  PAIRINGS,
  TYPE,
  color,
  contrast,
  type Pairing,
} from "@/design/tokens";
import {
  M0Groundbreaking,
  M2ServicePhone,
  M4Structure,
  S1Hero,
  S2Content,
  T1Click,
  T2Sweep,
  T3Built,
} from "./_components/Frames";
import { CHAPTERS, HEADLINES, SUBLINE } from "./_components/storyboard";

const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });
const jetMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-jet-mono" });

export const metadata: Metadata = {
  title: "Design proposal | Sri Skanda Constructions",
  description: "Internal review: design system and storyboard for the new site.",
  robots: { index: false, follow: false },
};

const SHELL = "mx-auto w-full max-w-[2240px] px-5 sm:px-8 lg:px-12";

const SECTIONS = [
  ["decisions", "Decisions to approve"],
  ["colour", "Colour and contrast"],
  ["type", "Type"],
  ["layout", "Grid and layout"],
  ["motion", "Motion"],
  ["rendering", "3D, 2D and speed"],
  ["headline", "Hero headline"],
  ["storyboard", "Home storyboard"],
  ["transition", "Page transition"],
  ["service", "Service page"],
  ["mobile", "Phones"],
] as const;

/* ── Small parts ────────────────────────────────────────────────────── */

function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-6 border-t border-primary/15 py-14 lg:py-20"
    >
      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-4 xl:col-span-3">
          <h2
            id={`${id}-title`}
            className="text-4xl font-light tracking-tight text-primary xl:text-5xl"
          >
            {title}
          </h2>
          {intro ? (
            <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-primary/85">
              {intro}
            </div>
          ) : null}
        </div>
        <div className="min-w-0 lg:col-span-8 xl:col-span-9">{children}</div>
      </div>
    </section>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-primary">
      {children}
    </p>
  );
}

function Mono({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-[family-name:var(--font-dm-mono)] tracking-[0.04em] ${className}`}>
      {children}
    </span>
  );
}

/** Colour sample drawn as SVG, so deliberately failing pairs can be shown. */
function Swatch({ fg, bg, line }: { fg: string; bg: string; line?: boolean }) {
  return (
    <svg viewBox="0 0 80 36" className="block h-9 w-20" aria-hidden="true">
      <rect x="0.5" y="0.5" width="79" height="35" rx="4" fill={bg} stroke={bg === "#ffffff" ? "#dddfe3" : bg} />
      {line ? (
        <path d="M12 12H68M12 24H68M24 6V30M56 6V30" stroke={fg} strokeWidth="1.5" />
      ) : (
        <text x="40" y="24" textAnchor="middle" fontSize="16" fontWeight="500" fill={fg} style={{ fontFamily: "var(--font-jost), sans-serif" }}>
          Aa
        </text>
      )}
    </svg>
  );
}

function verdict(p: Pairing, ratio: number): { text: string; ok: boolean } {
  if (p.status === "never") return { text: "Never use", ok: false };
  if (p.status === "non-text") return { text: ratio >= 3 ? "Ornament, 3:1+" : "Ornament only", ok: true };
  if (ratio >= 7) return { text: "AAA", ok: true };
  if (ratio >= 4.5) return { text: "AA", ok: true };
  if (ratio >= 3) return { text: "AA large only", ok: true };
  return { text: "Fails", ok: false };
}

function EaseCurve({ css }: { css: string }) {
  const nums = css.match(/-?\d*\.?\d+/g)!.map(Number);
  const [x1, y1, x2, y2] = nums;
  const S = 56;
  const P = 8;
  const px = (x: number) => P + x * S;
  const py = (y: number) => P + S - y * S;
  return (
    <svg viewBox={`0 0 ${S + P * 2} ${S + P * 2}`} className="h-16 w-16 shrink-0" aria-hidden="true">
      <rect x={P} y={P} width={S} height={S} fill="none" stroke="currentColor" strokeOpacity={0.2} />
      <path
        d={`M${px(0)} ${py(0)}C${px(x1)} ${py(y1)} ${px(x2)} ${py(y2)} ${px(1)} ${py(1)}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  );
}

function Figure({ children, caption }: { children: ReactNode; caption: ReactNode }) {
  return (
    <figure className="min-w-0">
      <div className="overflow-hidden rounded-lg ring-1 ring-primary/10">{children}</div>
      <figcaption className="mt-3 text-[15px] leading-relaxed text-primary/85">{caption}</figcaption>
    </figure>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default function DesignLabPage() {
  return (
    <div className={`${dmMono.variable} ${plexMono.variable} ${jetMono.variable}`}>
      <a
        href="#decisions"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-primary"
      >
        Skip to the proposal
      </a>

      <header className="relative overflow-hidden bg-primary text-white">
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(var(--secondary) 1px, transparent 1px), linear-gradient(90deg, var(--secondary) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className={`${SHELL} relative py-14 lg:py-20`}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <Logo kind="horizontal" variant="dark" title="Sri Skanda Constructions" className="h-10 w-auto" />
            <Link
              href="/brand-lab"
              className="text-[15px] font-medium text-white underline decoration-accent underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Logo package
            </Link>
          </div>
          <p className="mt-14 text-[13px] font-semibold uppercase tracking-[0.22em] text-accent">
            Design proposal · Internal review · Awaiting approval
          </p>
          <h1 className="mt-5 max-w-5xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
            Blueprint to Building
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/85">
            The design system and the storyboard for the new site, as rough
            frames. Nothing on the live pages changes until you approve. After
            approval, chapter 0 (Groundbreaking) and chapter 4 (Structure) are
            built first as a working prototype.
          </p>
          <nav aria-label="Proposal sections" className="mt-10">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
              {SECTIONS.map(([id, name]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-white/90 underline-offset-4 hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className={SHELL}>
        {/* ── Decisions ── */}
        <Section
          id="decisions"
          title="Decisions to approve"
          intro={<p>Reply with yes, or with what to change for any of these.</p>}
        >
          <ol className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {[
              ["Technical label font", "DM Mono for dimensions, floor numbers and coordinates. Jost stays for everything else."],
              ["Hero headline", "“From the first stake to the house key.” with “Building Your Dreams” kept as an option."],
              ["Colour additions", "Five navy tints and shades and one cool gray scale, all on the navy hue. No new hues."],
              ["3D where it earns it", "react-three-fiber for the massing, structure, home and commercial morph, handover and final scene. Plans, sections and elevations stay as SVG drawings."],
              ["Chapters as drawing sheets", "Each chapter carries a small title block (sheet number, drawing name, scale) like a real drawing set, and the right-hand rail is the sheet index."],
              ["New libraries", "three, @react-three/fiber, @react-three/drei, gsap with ScrollTrigger, lenis. React ViewTransition (experimental flag in Next 16) for the laser-line route change."],
            ].map(([title, body]) => (
              <li key={title} className="rounded-lg bg-surface p-6">
                <h3 className="text-xl font-medium text-primary">{title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-primary/85">{body}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* ── Colour ── */}
        <Section
          id="colour"
          title="Colour and contrast"
          intro={
            <>
              <p>
                The six brand colours stay exactly as they are. The additions
                are tints and shades of the same navy, plus one cool gray built
                on the navy hue, so the palette still reads as two colours.
              </p>
              <p>
                Lime is for navy grounds only. Lime on white is 1.27:1 and is
                never used for text, icons or thin lines.
              </p>
            </>
          }
        >
          {(["brand", "navy", "gray", "action"] as const).map((group) => (
            <div key={group} className="mb-10">
              <Label>
                {{ brand: "Brand, unchanged", navy: "Navy tints and shades", gray: "Neutral gray", action: "WhatsApp only" }[group]}
              </Label>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
                {COLORS.filter((c) => c.group === group).map((c) => (
                  <li key={c.name} className="overflow-hidden rounded-lg ring-1 ring-primary/10">
                    <div className="h-20" style={{ background: c.value }} />
                    <div className="p-4">
                      <p className="font-medium text-primary">
                        {c.name} <Mono className="text-[13px] text-neutral-600">{c.value}</Mono>
                      </p>
                      <p className="mt-1 text-[14px] leading-snug text-primary/80">{c.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <Label>Contrast table (WCAG 2.2, computed from the tokens)</Label>
          <div className="overflow-x-auto rounded-lg ring-1 ring-primary/10" tabIndex={0} role="region" aria-label="Contrast table, scrolls sideways on small screens">
            <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
              <caption className="sr-only">Contrast ratios for every colour pairing used on the site</caption>
              <thead className="bg-primary text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Sample</th>
                  <th scope="col" className="px-4 py-3 font-medium">Text on ground</th>
                  <th scope="col" className="px-4 py-3 font-medium">Ratio</th>
                  <th scope="col" className="px-4 py-3 font-medium">Result</th>
                  <th scope="col" className="px-4 py-3 font-medium">Used for</th>
                </tr>
              </thead>
              <tbody>
                {PAIRINGS.map((p) => {
                  const fg = color(p.fg);
                  const bg = color(p.bg);
                  const ratio = contrast(fg, bg);
                  const v = verdict(p, ratio);
                  return (
                    <tr key={`${p.fg}-${p.bg}`} className="border-t border-primary/10">
                      <td className="px-4 py-2">
                        <Swatch fg={fg} bg={bg} line={p.status === "non-text"} />
                      </td>
                      <td className="px-4 py-2 text-primary">
                        {p.fg} on {p.bg}
                      </td>
                      <td className="px-4 py-2">
                        <Mono className="text-primary">{ratio.toFixed(2)}:1</Mono>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[13px] font-semibold ${
                            p.status === "never" || !v.ok ? "bg-primary text-white" : "bg-surface text-primary"
                          }`}
                        >
                          {v.text}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-primary/85">{p.use}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── Type ── */}
        <Section
          id="type"
          title="Type"
          intro={
            <>
              <p>
                Jost does all the talking. Display sizes are light (300) and
                large, the way an architect letters a drawing title; body text
                is regular (400) and never smaller than 17 px.
              </p>
              <p>
                Sizes scale smoothly between a 360 px phone and a 2560 px
                screen, so large monitors get large type, not a narrow column.
              </p>
            </>
          }
        >
          <ul className="divide-y divide-primary/10 rounded-lg ring-1 ring-primary/10">
            {TYPE.filter((t) => !t.mono).map((t) => (
              <li key={t.name} className="grid items-baseline gap-4 p-5 md:grid-cols-[180px_1fr]">
                <div>
                  <p className="font-medium text-primary">{t.name}</p>
                  <p className="text-[14px] text-neutral-600">
                    <Mono>
                      {t.min}–{t.max} px · {t.weight}
                    </Mono>
                  </p>
                  <p className="text-[14px] text-neutral-600">{t.use}</p>
                </div>
                <p
                  className="min-w-0 break-words text-primary"
                  style={{
                    fontSize: t.size,
                    fontWeight: t.weight,
                    lineHeight: t.leading,
                    letterSpacing: t.tracking,
                    textTransform: t.upper ? "uppercase" : undefined,
                  }}
                >
                  {t.name === "body" || t.name === "small" || t.name === "lead"
                    ? "We build homes, villas, apartments and commercial buildings in and around Pondicherry, and handle every stage ourselves."
                    : t.name === "eyebrow"
                      ? "Foundation"
                      : "Floor by floor."}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <Label>Technical label font: three candidates</Label>
            <p className="mb-6 max-w-3xl text-[17px] leading-relaxed text-primary/85">
              Used only for measurements and labels: dimensions, floor numbers,
              levels, sheet numbers and the cursor coordinates. Uppercase,
              small, slightly tracked. Shown here on navy, where most of them
              will live.
            </p>
            <div className="grid gap-4 xl:grid-cols-3">
              {[
                { name: "DM Mono", v: "--font-dm-mono", pick: true, note: "Recommended. Round, low-contrast letters that sit naturally next to Jost’s geometric shapes. Calm, not techy." },
                { name: "IBM Plex Mono", v: "--font-plex-mono", note: "More engineered and industrial. A good second choice if you want the labels to feel stricter." },
                { name: "JetBrains Mono", v: "--font-jet-mono", note: "Very clear, but reads like a code editor rather than a drawing." },
              ].map((f) => (
                <div key={f.name} className={`rounded-lg p-6 ${f.pick ? "bg-primary text-white ring-2 ring-accent" : "bg-primary text-white"}`}>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-accent">
                    {f.name}
                    {f.pick ? " · recommended" : ""}
                  </p>
                  <div className="mt-5 space-y-2 uppercase" style={{ fontFamily: `var(${f.v}), monospace`, letterSpacing: "0.06em" }}>
                    <p className="text-3xl text-accent">Floor 02 / 03</p>
                    <p className="text-[15px]">Level +6.00 · Slab curing</p>
                    <p className="text-[15px]">Plinth beam 230 × 450</p>
                    <p className="text-[15px]">Room 12&apos;0&quot; × 14&apos;6&quot; · Sheet S-301</p>
                    <p className="text-[15px] text-[#a4b1da]">X 0482 · Y 1290</p>
                  </div>
                  <p className="mt-5 text-[15px] leading-relaxed text-white/85">{f.note}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Layout ── */}
        <Section
          id="layout"
          title="Grid and layout"
          intro={
            <>
              <p>
                Scenes are full-bleed and use the whole width from 1280 to 2560
                px. Text never sits in a narrow column beside empty space: it
                takes four or five of twelve columns and the scene takes the
                rest, so the space always holds the building or its motion.
              </p>
            </>
          }
        >
          <div className="overflow-hidden rounded-lg bg-primary p-5 sm:p-8">
            <div className="grid grid-cols-12 gap-[clamp(8px,1.6vw,40px)]">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="h-28 rounded-sm bg-secondary" aria-hidden="true" />
              ))}
            </div>
            <div className="mt-[-112px] grid h-28 grid-cols-12 gap-[clamp(8px,1.6vw,40px)]">
              <div className="col-span-5 flex items-end rounded-sm border border-white/60 p-3 text-[14px] text-white">Text: 5 columns</div>
              <div className="col-span-7 flex items-end rounded-sm border border-accent p-3 text-[14px] text-accent">Scene: 7 columns, bleeds to the edge</div>
            </div>
          </div>
          <ul className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {[
              ["Columns", `${LAYOUT.columns} columns. Gutter ${LAYOUT.gutter}. Outer margin ${LAYOUT.margin}.`],
              ["Reading width", `Running text stops at ${LAYOUT.measure}. Scenes have no maximum width.`],
              ["Header", `72 px, 60 px once scrolled. Hides on scroll down, returns on scroll up, and takes a solid navy or white ground as soon as anything scrolls under it, so it never sits on display type.`],
              ["WhatsApp button", `64 px, 20 px from the corner. A 96 px zone around it is kept clear of buttons and pinned content, and it hides while a page’s own WhatsApp button is on screen.`],
              ["Chapter rail", "Right edge on desktop, inside the margin, never under the WhatsApp button. On phones it becomes the chapter index behind “Skip the story”."],
              ["Breakpoints checked", LAYOUT.breakpoints.map((b) => `${b}`).join(", ") + " px, with screenshots at each."],
            ].map(([title, body]) => (
              <li key={title} className="rounded-lg ring-1 ring-primary/10 p-5">
                <h3 className="font-medium text-primary">{title}</h3>
                <p className="mt-1 text-[16px] leading-relaxed text-primary/85">{body}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── Motion ── */}
        <Section
          id="motion"
          title="Motion"
          intro={
            <>
              <p>
                Every movement is a construction step: drop, snap, extrude,
                pour, stack, lay, sweep. Nothing moves just to decorate.
              </p>
              <p>
                Scroll is construction progress. Chapters are scrubbed by
                scroll, so the visitor is always in control and can stop
                halfway through a pour.
              </p>
            </>
          }
        >
          <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-5">
            {EASES.map((e) => (
              <li key={e.name} className="flex items-center gap-4 rounded-lg bg-primary p-5 text-white">
                <span className="text-accent">
                  <EaseCurve css={e.css} />
                </span>
                <span>
                  <span className="block font-medium">{e.name}</span>
                  <span className="block text-[14px] leading-snug text-white/85">{e.use}</span>
                  <Mono className="mt-1 block text-[12px] text-[#a4b1da]">{e.gsap}</Mono>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-8 xl:grid-cols-2">
            <div>
              <Label>Durations</Label>
              <ul className="divide-y divide-primary/10 rounded-lg ring-1 ring-primary/10">
                {DURATIONS.map((d) => (
                  <li key={d.name} className="flex items-baseline justify-between gap-4 px-5 py-3">
                    <span className="text-primary">
                      <span className="font-medium">{d.name}</span> · {d.use}
                    </span>
                    <Mono className="shrink-0 text-primary">{d.ms ? `${d.ms} ms` : "scroll"}</Mono>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Label>Rules</Label>
              <ul className="space-y-3 text-[16px] leading-relaxed text-primary/85">
                <li className="border-l-2 border-primary pl-4">Only transform and opacity animate. No layout thrash, no animated blur.</li>
                <li className="border-l-2 border-primary pl-4">One WebGL canvas for the whole site, paused when off screen or the tab is hidden.</li>
                <li className="border-l-2 border-primary pl-4">Reduced motion: every chapter shows its finished frame with the same content; transitions become 200 ms fades; every switch, slider and the estimator still work.</li>
                <li className="border-l-2 border-primary pl-4">Anything that runs on its own for more than five seconds has a pause button.</li>
                <li className="border-l-2 border-primary pl-4">Desktop cursor: a small surveyor’s crosshair with live X and Y in the technical font, snapping to buttons and links. Off on touch and with reduced motion.</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* ── Rendering ── */}
        <Section
          id="rendering"
          title="3D, 2D and speed"
          intro={
            <>
              <p>
                The building is a white architect’s model with navy edges and
                lime accents, made of simple, well-proportioned boxes. It lives
                in one layer above the pages and moves to a new angle on each
                page.
              </p>
              <p>
                Plans, sections and elevations are drawings by nature, so they
                stay as crisp SVG. If a 3D scene does not look premium, it falls
                back to its drawing.
              </p>
            </>
          }
        >
          <div className="overflow-x-auto rounded-lg ring-1 ring-primary/10" tabIndex={0} role="region" aria-label="Rendering plan per chapter, scrolls sideways on small screens">
            <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
              <caption className="sr-only">How each chapter is rendered</caption>
              <thead className="bg-primary text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Sheet</th>
                  <th scope="col" className="px-4 py-3 font-medium">Chapter</th>
                  <th scope="col" className="px-4 py-3 font-medium">Desktop</th>
                  <th scope="col" className="px-4 py-3 font-medium">Phone and fallback</th>
                  <th scope="col" className="px-4 py-3 font-medium">Video</th>
                </tr>
              </thead>
              <tbody>
                {CHAPTERS.map((c) => (
                  <tr key={c.sheet} className="border-t border-primary/10 text-primary">
                    <td className="px-4 py-2"><Mono>{c.sheet}</Mono></td>
                    <td className="px-4 py-2">{c.title}</td>
                    <td className="px-4 py-2">{c.render[0] === "3D" ? "3D model" : c.render[0] === "SVG" ? "SVG drawing" : "Photos in the page"}</td>
                    <td className="px-4 py-2">{c.render.includes("SVG") ? "SVG drawing" : "Same"}</td>
                    <td className="px-4 py-2 text-primary/85">{c.media ?? "None"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {[
              ["First paint", "Headline as real text plus an inline SVG of the plot. That is the largest element, so it paints before any script, 3D or video."],
              ["When 3D loads", "After the page is idle, only with WebGL 2, at least 4 GB memory and 4 cores, a window 1024 px or wider, and no Save-Data. Quality steps down if frames drop."],
              ["Video", "Re-encoded to WebM and MP4 at 720p with poster frames. Loaded only near its chapter, never on phones or with Save-Data, paused off screen."],
              ["Budget", "Under 150 KB of script before the 3D chunk. Lighthouse mobile 85+, LCP under 2.5 s on throttled 4G."],
            ].map(([title, body]) => (
              <li key={title} className="rounded-lg bg-surface p-5">
                <h3 className="font-medium text-primary">{title}</h3>
                <p className="mt-1 text-[16px] leading-relaxed text-primary/85">{body}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── Headline ── */}
        <Section
          id="headline"
          title="Hero headline"
          intro={<p>“Building Your Dreams” stays available. Three sharper options, set as they would appear on the first screen.</p>}
        >
          <ul className="grid gap-4 xl:grid-cols-2">
            {HEADLINES.map((h) => (
              <li key={h.text} className={`relative overflow-hidden rounded-lg bg-primary p-8 text-white ${h.recommended ? "ring-2 ring-accent" : ""}`}>
                {h.recommended ? (
                  <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-accent">Recommended</p>
                ) : null}
                <p className="mt-3 text-[clamp(2rem,3.4vw,3.75rem)] font-light leading-[1.02] tracking-tight">{h.text}</p>
                <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/85">{SUBLINE}</p>
                <p className="mt-6 border-t border-white/20 pt-4 text-[15px] leading-relaxed text-[#a4b1da]">{h.note}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── Storyboard ── */}
        <Section
          id="storyboard"
          title="Home storyboard"
          intro={
            <>
              <p>
                One building, constructed as you scroll. Eleven chapters, each
                a full screen, each a sheet in the drawing set.
              </p>
              <p>
                Frames are rough on purpose: they fix composition, order and
                what each chapter must say, not the final drawing.
              </p>
            </>
          }
        >
          <ol className="space-y-14">
            {CHAPTERS.map((c) => {
              const FrameArt = c.frame;
              return (
                <li key={c.sheet} className="grid gap-6 2xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                  <div className="overflow-hidden rounded-lg ring-1 ring-primary/10">
                    <FrameArt />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-primary">
                      Sheet <Mono>{c.sheet}</Mono> · {c.render.join(" / ")}
                    </p>
                    <h3 className="mt-2 text-3xl font-light tracking-tight text-primary">{c.title}</h3>
                    <p className="mt-3 text-[17px] leading-relaxed text-primary">{c.learns}</p>
                    <dl className="mt-5 space-y-3 text-[16px] leading-relaxed">
                      {(
                        [
                          ["On scroll", c.scroll],
                          ["Visitor can", c.interaction],
                          ["Reduced motion", c.reduced],
                          ["Phone", c.mobile],
                          ["Video", c.media],
                        ] as const
                      )
                        .filter(([, v]) => v)
                        .map(([k, v]) => (
                          <div key={k} className="grid gap-1 sm:grid-cols-[140px_1fr]">
                            <dt className="font-medium text-primary">{k}</dt>
                            <dd className="text-primary/85">{v}</dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                </li>
              );
            })}
          </ol>
        </Section>

        {/* ── Transition ── */}
        <Section
          id="transition"
          title="Page transition"
          intro={
            <>
              <p>
                The lime line under the header is the scroll progress bar. When
                you change page it becomes a laser level: it sweeps down the
                screen, and the new page builds up behind it.
              </p>
              <p>
                Built with React’s ViewTransition, which Next 16 supports behind
                an experimental flag. Where the browser has no View Transitions,
                the line still sweeps and the page swaps under it.
              </p>
            </>
          }
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <Figure caption="1. Click. The line is the progress bar, here at 42%.">
              <T1Click />
            </Figure>
            <Figure caption="2. The line sweeps down in 900 ms. Above it, the new page appears in blueprint outline, then fills.">
              <T2Sweep />
            </Figure>
            <Figure caption="3. The new page is built. The line returns to the top at 0%. With reduced motion this is a 200 ms fade.">
              <T3Built />
            </Figure>
          </div>
        </Section>

        {/* ── Service page ── */}
        <Section
          id="service"
          title="Service page"
          intro={
            <>
              <p>
                One page per service, from the services content file. A short
                animated hero shows the building at that service’s stage, then
                the page goes calm: plain sections a family can read in a
                minute.
              </p>
              <p>
                Headings target local searches with useful content, for example
                “House construction in Pondicherry”, never keyword lists.
              </p>
            </>
          }
        >
          <div className="grid gap-6 xl:grid-cols-2">
            <Figure caption="Hero, about 70% of the screen: breadcrumb, local heading, WhatsApp prefilled with this service, and the model at the matching stage (structure for residential, shopfronts for commercial, the grid for Vastu).">
              <S1Hero />
            </Figure>
            <Figure caption="Calm content: what is included, how it works as a drawn line of stations, what you provide, timeline (only if set), and questions as plain expandable rows.">
              <S2Content />
            </Figure>
          </div>
        </Section>

        {/* ── Mobile ── */}
        <Section
          id="mobile"
          title="Phones"
          intro={
            <p>
              Phones get a simplified build sequence, not a shrunken desktop
              scene: SVG and CSS only, no 3D and no video, buttons stacked full
              width, and nothing pinned that could cover a button.
            </p>
          }
        >
          <div className="grid gap-6 sm:grid-cols-3 2xl:max-w-[1200px]">
            <Figure caption="Groundbreaking: words and buttons first, the plot below.">
              <M0Groundbreaking />
            </Figure>
            <Figure caption="Structure: floors stack in a flat elevation; the heading is plain text.">
              <M4Structure />
            </Figure>
            <Figure caption="Service page: the floating WhatsApp button steps aside while the page’s own button is on screen.">
              <M2ServicePhone />
            </Figure>
          </div>
        </Section>
      </main>

      <footer className="bg-primary text-white">
        <div className={`${SHELL} py-12`}>
          <h2 className="text-3xl font-light tracking-tight">Next step after approval</h2>
          <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-white/85">
            Build chapter 0 (Groundbreaking) and chapter 4 (Structure, with the
            crane) for real, including the reduced-motion, phone and no-3D
            versions, then stop for your verdict before anything else is built.
          </p>
        </div>
      </footer>
    </div>
  );
}
