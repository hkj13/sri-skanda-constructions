import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/brand/Logo";
import {
  BlueprintGrid,
  Construction,
  Panel,
  SpecLabel,
  Specimens,
} from "./_components/Specimens";

export const metadata: Metadata = {
  title: "Brand lab | Sri Skanda Constructions",
  description: "Internal review page for the Sri Skanda Constructions logo.",
  robots: { index: false, follow: false },
};

const SHELL = "mx-auto w-full max-w-[2240px] px-5 sm:px-8 lg:px-12";

type Download = { label: string; href: string; note?: string };

const DOWNLOADS: { group: string; items: Download[] }[] = [
  {
    group: "Horizontal lockup",
    items: [
      { label: "Full colour", href: "/brand/logo-horizontal.svg", note: "SVG" },
      { label: "Reversed, for navy", href: "/brand/logo-horizontal-reversed.svg", note: "SVG" },
      { label: "One colour, navy", href: "/brand/logo-horizontal-navy.svg", note: "SVG" },
      { label: "One colour, black", href: "/brand/logo-horizontal-black.svg", note: "SVG" },
      { label: "One colour, white", href: "/brand/logo-horizontal-white.svg", note: "SVG" },
      { label: "Full colour", href: "/brand/png/logo-horizontal.png", note: "PNG" },
      { label: "Reversed", href: "/brand/png/logo-horizontal-reversed.png", note: "PNG" },
    ],
  },
  {
    group: "Stacked lockup",
    items: [
      { label: "Full colour", href: "/brand/logo-stacked.svg", note: "SVG" },
      { label: "Reversed, for navy", href: "/brand/logo-stacked-reversed.svg", note: "SVG" },
      { label: "One colour, navy", href: "/brand/logo-stacked-navy.svg", note: "SVG" },
      { label: "One colour, black", href: "/brand/logo-stacked-black.svg", note: "SVG" },
      { label: "One colour, white", href: "/brand/logo-stacked-white.svg", note: "SVG" },
      { label: "Full colour", href: "/brand/png/logo-stacked.png", note: "PNG" },
      { label: "Reversed", href: "/brand/png/logo-stacked-reversed.png", note: "PNG" },
    ],
  },
  {
    group: "Mark only",
    items: [
      { label: "Full colour", href: "/brand/mark.svg", note: "SVG" },
      { label: "Reversed, for navy", href: "/brand/mark-reversed.svg", note: "SVG" },
      { label: "One colour, navy", href: "/brand/mark-navy.svg", note: "SVG" },
      { label: "One colour, black", href: "/brand/mark-black.svg", note: "SVG" },
      { label: "One colour, white", href: "/brand/mark-white.svg", note: "SVG" },
      { label: "Profile picture, 640 px", href: "/brand/png/profile-picture.png", note: "PNG" },
    ],
  },
  {
    group: "Icons, social image, brand sheet",
    items: [
      { label: "Favicon", href: "/brand/favicon/favicon.ico", note: "ICO" },
      { label: "Favicon 16 px", href: "/brand/favicon/favicon-16.png", note: "PNG" },
      { label: "Favicon 32 px", href: "/brand/favicon/favicon-32.png", note: "PNG" },
      { label: "Apple touch icon, 180 px", href: "/brand/favicon/apple-touch-icon.png", note: "PNG" },
      { label: "App icon, 192 px", href: "/brand/favicon/icon-192.png", note: "PNG" },
      { label: "App icon, 512 px", href: "/brand/favicon/icon-512.png", note: "PNG" },
      { label: "Social image template", href: "/brand/og/og-template.svg", note: "SVG" },
      { label: "Social image, default", href: "/brand/og/og-default.png", note: "PNG" },
      { label: "Brand sheet", href: "/brand/brand-sheet.pdf", note: "PDF" },
      { label: "Brand sheet", href: "/brand/brand-sheet.svg", note: "SVG" },
    ],
  },
];

export default function BrandLabPage() {
  return (
    <>
      <a
        href="#logo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-primary"
      >
        Skip to the logo
      </a>

      <header className="relative overflow-hidden bg-primary text-white">
        <BlueprintGrid />
        <div className={`${SHELL} relative grid items-center gap-12 py-16 lg:grid-cols-12 lg:py-24`}>
          <div className="lg:col-span-7">
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-accent">
              Brand lab · Internal review · Not linked, not indexed
            </p>
            <h1 className="mt-5 text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
              The Sri Skanda Constructions logo
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
              A house with a pitched roof and a taller flat-roofed block stand
              side by side. The space between them is the leaf-shaped head of a
              Vel, rising from the ground like a lit doorway. Home and
              commercial building in one silhouette, with Skanda at its centre.
            </p>
            <ul className="mt-10 flex flex-wrap gap-3 text-[15px] font-semibold">
              <li>
                <a
                  href="#downloads"
                  className="inline-block rounded-full bg-accent px-6 py-3 text-primary transition-colors hover:bg-accent-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Download the files
                </a>
              </li>
              <li>
                <a
                  href="/brand/brand-sheet.pdf"
                  className="inline-block rounded-full border border-white/40 px-6 py-3 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Brand sheet (PDF)
                </a>
              </li>
              <li>
                <Link
                  href="/design-lab"
                  className="inline-block rounded-full border border-white/40 px-6 py-3 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Design proposal and storyboard
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex justify-center lg:col-span-5">
            <Logo
              kind="stacked"
              variant="dark"
              title="Sri Skanda Constructions"
              className="h-auto w-[min(80%,420px)]"
            />
          </div>
        </div>
      </header>

      <main id="logo" className={SHELL}>
        <section
          aria-labelledby="construction-title"
          className="grid gap-x-12 gap-y-10 py-14 lg:grid-cols-12 lg:py-20"
        >
          <div className="min-w-0 lg:col-span-4 xl:col-span-3">
            <h2
              id="construction-title"
              className="text-4xl font-light tracking-tight text-primary xl:text-5xl"
            >
              How it is built
            </h2>
            <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-primary/85">
              <li className="border-l-2 border-primary pl-4">
                Drawn on a 4-unit grid, so every straight edge lands on a whole
                pixel at favicon size.
              </li>
              <li className="border-l-2 border-primary pl-4">
                The name hangs from the roofline of the flat-roofed block and
                stands on the same ground line as the buildings.
              </li>
              <li className="border-l-2 border-primary pl-4">
                Nothing is thinner than the Vel&apos;s shaft, which is wide
                enough to paint on a hoarding or stitch on a uniform.
              </li>
              <li className="border-l-2 border-primary pl-4">
                Lime only ever sits on navy. On white the Vel is lime inside
                navy; on navy the buildings turn lime and the Vel is cut out.
              </li>
            </ul>
          </div>
          <div className="min-w-0 lg:col-span-8 xl:col-span-9">
            <SpecLabel note="Roofline, ground line and the height X used for clear space">
              Construction
            </SpecLabel>
            <Panel tone="white" className="p-6 sm:p-12">
              <Construction />
            </Panel>
          </div>
        </section>

        <section
          aria-labelledby="specimens-title"
          className="grid gap-x-12 gap-y-10 border-t border-primary/15 py-14 lg:grid-cols-12 lg:py-20"
        >
          <div className="min-w-0 lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-8">
              <h2
                id="specimens-title"
                className="text-4xl font-light tracking-tight text-primary xl:text-5xl"
              >
                Sizes, grounds and uses
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-primary/85">
                The same checks as the concept round, now on the refined logo:
                hero, header and favicon sizes; white, navy and lime; one
                colour; and on a hoarding, a business card, a helmet and a
                WhatsApp picture.
              </p>
              <h3 className="mt-8 text-[13px] font-semibold uppercase tracking-[0.18em] text-primary">
                What changed since the concept
              </h3>
              <ul className="mt-3 space-y-3 text-[15px] leading-relaxed text-primary/85">
                <li className="border-l-2 border-primary pl-4">
                  The spearhead is longer and sharper, with its widest point
                  lower, so it reads as a Vel before it reads as a leaf.
                </li>
                <li className="border-l-2 border-primary pl-4">
                  Roof, eaves and ground were moved onto the pixel grid.
                </li>
                <li className="border-l-2 border-primary pl-4">
                  CONSTRUCTIONS is a little larger, so it stays readable at
                  header size.
                </li>
              </ul>
            </div>
          </div>
          <div className="min-w-0 lg:col-span-8 xl:col-span-9">
            <Specimens />
          </div>
        </section>

        <section
          id="downloads"
          aria-labelledby="downloads-title"
          className="scroll-mt-6 border-t border-primary/15 py-14 lg:py-20"
        >
          <h2
            id="downloads-title"
            className="text-4xl font-light tracking-tight text-primary xl:text-5xl"
          >
            Files
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-primary/85">
            Everything lives in <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[0.9em]">public/brand</code>.
            Use SVG wherever you can: it stays sharp at any size. All lettering
            is outlined, so no file needs a font installed.
          </p>
          <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
            {DOWNLOADS.map(({ group, items }) => (
              <div key={group}>
                <h3 className="border-b border-primary/25 pb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {group}
                </h3>
                <ul>
                  {items.map((item) => (
                    <li key={item.href} className="border-b border-primary/10">
                      <a
                        href={item.href}
                        download
                        className="flex items-baseline justify-between gap-4 py-3 text-[15px] text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <span>{item.label}</span>
                        <span className="text-[12px] font-semibold tracking-[0.14em] text-neutral-600">
                          {item.note}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-primary text-white">
        <div className={`${SHELL} py-10`}>
          <p className="max-w-3xl text-[15px] leading-relaxed text-white/85">
            To regenerate every file after a change to the artwork, run{" "}
            <code className="rounded bg-secondary px-1.5 py-0.5 text-[0.9em]">npm run brand:export</code>.
          </p>
        </div>
      </footer>
    </>
  );
}
