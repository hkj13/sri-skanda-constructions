import type { ReactNode } from "react";
import { Logo, LogoUse } from "@/brand/Logo";
import { CAP, layoutLogo, logoSvgString } from "@/brand/build";
import { MARK_INK, NAVY } from "@/brand/logo-art";
import { BusinessCard, Helmet, Hoarding, WhatsAppAvatar } from "./Mockups";
import { PixelPreview } from "./PixelPreview";

/** Small heading with a dimension line, like a label on a drawing. */
export function SpecLabel({ children, note }: { children: ReactNode; note?: string }) {
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
        <p className="basis-full text-[13px] text-gray-600 sm:basis-auto">
          {note}
        </p>
      ) : null}
    </div>
  );
}

export function Panel({
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
    paper: "bg-gray-100",
  };
  return (
    <div className={`rounded-lg ${tones[tone]} ${className}`}>{children}</div>
  );
}

/** Faint navy-on-navy drawing grid. */
export function BlueprintGrid() {
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

/** How the mark and the lettering line up, drawn on the 4-unit grid. */
export function Construction() {
  const layout = layoutLogo("horizontal");
  const left = 34;
  const right = 18;
  const top = 10;
  const bottom = 10;
  const w = layout.width + left + right;
  const h = layout.height + top + bottom;
  const gridLines: string[] = [];
  for (let x = 0; x <= MARK_INK.width; x += 4)
    gridLines.push(`M${x} 0V${MARK_INK.height}`);
  for (let y = 0; y <= MARK_INK.height; y += 4)
    gridLines.push(`M0 ${y}H${MARK_INK.width}`);
  const roofline = 16 - MARK_INK.y;
  const dimX = layout.width + 6;
  return (
    <svg
      viewBox={`${-left} ${-top} ${w} ${h}`}
      className="logo-light block h-auto w-full"
      role="img"
      aria-label="Construction drawing of the logo: the name hangs from the roofline of the flat-roofed block and stands on the ground line."
    >
      <LogoUse kind="horizontal" />
      {/* 4-unit grid over the mark, visible on both navy and white */}
      <path
        d={gridLines.join("")}
        stroke="#8a91a1"
        strokeOpacity="0.55"
        strokeWidth="0.2"
        fill="none"
      />
      {/* roofline and ground line */}
      <g stroke={NAVY} strokeWidth="0.35" strokeDasharray="1.5 1.5" fill="none">
        <path d={`M-4 ${roofline}H${layout.width + 2}`} />
        <path d={`M-4 ${MARK_INK.height}H${layout.width + 2}`} />
      </g>
      {/* cap-height dimension */}
      <path
        d={`M${dimX} ${roofline}V${roofline + CAP}M${dimX - 2} ${roofline}h4M${dimX - 2} ${roofline + CAP}h4`}
        stroke={NAVY}
        strokeWidth="0.35"
        fill="none"
      />
      <g
        fill={NAVY}
        fontSize="3.4"
        style={{ fontFamily: "var(--font-jost), sans-serif", letterSpacing: "0.1em" }}
      >
        <text x={-6} y={roofline + 1.2} textAnchor="end">ROOFLINE</text>
        <text x={-6} y={MARK_INK.height + 1.2} textAnchor="end">GROUND</text>
        <text x={dimX + 4} y={roofline + CAP / 2 + 1.2}>X</text>
      </g>
    </svg>
  );
}

function MockNav({ dark }: { dark?: boolean }) {
  return (
    <div
      className={`@container rounded-lg ${
        dark ? "bg-primary" : "bg-white ring-1 ring-inset ring-primary/10"
      }`}
    >
      <div className="flex h-[72px] items-center justify-between gap-6 px-5 sm:px-8">
        <Logo
          kind="horizontal"
          variant={dark ? "dark" : "light"}
          title={`The logo at header size on ${dark ? "navy" : "white"}`}
          className="h-9 w-auto shrink-0"
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

function BrowserTab({ dark }: { dark?: boolean }) {
  return (
    <div
      className={`flex items-end rounded-lg px-3 pt-3 ${dark ? "bg-gray-900" : "bg-gray-200"}`}
    >
      <div
        className={`flex w-64 max-w-full items-center gap-2 rounded-t-lg px-3 py-2.5 ${
          dark ? "bg-gray-700 text-white" : "bg-white text-gray-800"
        }`}
      >
        <Logo
          kind="icon"
          title={`Favicon at 16 pixels in a ${dark ? "dark" : "light"} browser tab`}
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

export function Specimens() {
  const iconSvg = (px: number) => logoSvgString("icon", { size: px });
  const markSvg = (px: number) => logoSvgString("mark", { size: px });

  return (
    <div className="space-y-12">
      <div>
        <SpecLabel note="Stacked lockup on navy, white and lime">Hero size</SpecLabel>
        <div className="grid gap-4 md:grid-cols-2">
          <Panel
            tone="navy"
            className="relative flex min-h-[340px] items-center justify-center overflow-hidden py-14 md:col-span-2 lg:min-h-[460px]"
          >
            <BlueprintGrid />
            <Logo
              kind="stacked"
              variant="dark"
              title="Stacked logo reversed on navy"
              className="relative h-auto w-[min(68%,400px)]"
            />
          </Panel>
          <Panel tone="white" className="flex min-h-[300px] items-center justify-center py-12">
            <Logo
              kind="stacked"
              title="Stacked logo on white"
              className="h-auto w-[min(64%,290px)]"
            />
          </Panel>
          <Panel tone="lime" className="flex min-h-[300px] items-center justify-center py-12">
            <Logo
              kind="stacked"
              title="Stacked logo on lime"
              className="h-auto w-[min(64%,290px)]"
            />
          </Panel>
        </div>
      </div>

      <div>
        <SpecLabel note="Horizontal lockup, 36 px tall">Header size</SpecLabel>
        <div className="grid gap-4 2xl:grid-cols-2">
          <MockNav />
          <MockNav dark />
        </div>
      </div>

      <div>
        <SpecLabel note="Actual size, then enlarged pixel by pixel">Favicon size</SpecLabel>
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          <div className="space-y-4">
            <BrowserTab />
            <BrowserTab dark />
          </div>
          <Panel tone="paper" className="flex items-center justify-around gap-4 p-5">
            <figure className="text-center">
              <PixelPreview svg={iconSvg(16)} pixels={16} zoom={7} label="Favicon at 16 pixels, enlarged" />
              <figcaption className="mt-2 text-[13px] text-gray-600">Favicon, 16 px</figcaption>
            </figure>
            <figure className="text-center">
              <PixelPreview svg={iconSvg(32)} pixels={32} zoom={3.5} label="Favicon at 32 pixels, enlarged" />
              <figcaption className="mt-2 text-[13px] text-gray-600">Favicon, 32 px</figcaption>
            </figure>
          </Panel>
          <Panel tone="white" className="flex items-center justify-around gap-4 p-5">
            <figure className="text-center">
              <PixelPreview svg={markSvg(16)} pixels={16} zoom={7} label="Mark alone at 16 pixels, enlarged" />
              <figcaption className="mt-2 text-[13px] text-gray-600">Mark alone, 16 px</figcaption>
            </figure>
            <figure className="text-center">
              <PixelPreview svg={markSvg(32)} pixels={32} zoom={3.5} label="Mark alone at 32 pixels, enlarged" />
              <figcaption className="mt-2 text-[13px] text-gray-600">Mark alone, 32 px</figcaption>
            </figure>
          </Panel>
          <Panel tone="white" className="flex items-end justify-around gap-3 p-5">
            {[16, 24, 32, 48, 64].map((px) => (
              <figure key={px} className="text-center">
                <Logo
                  kind="mark"
                  title={`Mark at ${px} pixels`}
                  style={{ width: px, height: px }}
                  className="mx-auto"
                />
                <figcaption className="mt-2 text-[13px] text-gray-600">{px}</figcaption>
              </figure>
            ))}
          </Panel>
        </div>
      </div>

      <div>
        <SpecLabel note="No lime, no tints: one ink only">One colour</SpecLabel>
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {(
            [
              ["white", "text-primary", "navy on white"],
              ["white", "text-black", "black on white"],
              ["navy", "text-white", "white on navy"],
              ["lime", "text-primary", "navy on lime"],
            ] as const
          ).map(([tone, color, name]) => (
            <Panel
              key={name}
              tone={tone}
              className={`flex aspect-[5/2] items-center justify-center ${color}`}
            >
              <Logo
                kind="horizontal"
                variant="mono"
                title={`Logo in one colour, ${name}`}
                className="h-auto w-[72%]"
              />
            </Panel>
          ))}
        </div>
      </div>

      <div>
        <SpecLabel note="Hoarding, business card, helmet, WhatsApp">In use</SpecLabel>
        <div
          tabIndex={0}
          role="group"
          aria-label="The logo on a site hoarding. Scroll sideways on small screens."
          className="overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <div className="min-w-[720px]">
            <Hoarding />
          </div>
        </div>
        <Panel tone="paper" className="mt-4 p-6 sm:p-10">
          <BusinessCard />
        </Panel>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Panel tone="paper" className="flex items-center justify-center p-6">
            <div className="w-full max-w-[300px]">
              <Helmet shell="white" />
            </div>
          </Panel>
          <Panel tone="paper" className="flex items-center justify-center p-6">
            <div className="w-full max-w-[300px]">
              <Helmet shell="lime" />
            </div>
          </Panel>
          <Panel tone="paper" className="p-6">
            <WhatsAppAvatar />
          </Panel>
        </div>
      </div>
    </div>
  );
}
