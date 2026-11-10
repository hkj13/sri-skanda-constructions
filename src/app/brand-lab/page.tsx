import type { Metadata } from "next";
import { Logo, LogoSprite } from "@/brand/Logo";
import { CONCEPTS } from "@/brand/concepts";
import { ConceptSection } from "./_components/ConceptSection";

export const metadata: Metadata = {
  title: "Brand lab | Sri Skanda Constructions",
  description: "Internal review page for the Sri Skanda Constructions logo concepts.",
  robots: { index: false, follow: false },
};

const SHELL = "mx-auto w-full max-w-[2240px] px-5 sm:px-8 lg:px-12";

export default function BrandLabPage() {
  return (
    <>
      <LogoSprite />
      <a
        href="#concepts"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-primary"
      >
        Skip to the concepts
      </a>

      <header className="relative overflow-hidden bg-primary text-white">
        {/* blueprint grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(var(--secondary) 1px, transparent 1px), linear-gradient(90deg, var(--secondary) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className={`${SHELL} relative py-16 lg:py-24`}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-accent">
            Brand lab · Internal review · Not linked, not indexed
          </p>
          <h1 className="mt-5 max-w-5xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
            Four directions for the Sri Skanda Constructions mark
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/85">
            Each concept is shown the same way: at hero, header and favicon
            sizes; on white, navy and lime; in one colour; and on a site
            hoarding, a helmet, a business card and a WhatsApp profile picture.
            Pick the one that feels like the company. Details can still be
            refined after you choose.
          </p>

          <nav aria-label="Concepts" className="mt-12">
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {CONCEPTS.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#concept-${c.id}`}
                    className="group flex h-full items-center gap-5 rounded-lg border border-white/20 bg-primary p-5 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <Logo
                      concept={c.id}
                      kind="mark"
                      variant="dark"
                      className="h-16 w-16 shrink-0"
                    />
                    <span>
                      <span className="block text-[13px] font-semibold uppercase tracking-[0.18em] text-accent">
                        Concept {c.letter}
                      </span>
                      <span className="mt-1 block text-xl font-medium">
                        {c.name}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="concepts" className={SHELL}>
        {CONCEPTS.map((c) => (
          <ConceptSection key={c.id} concept={c} />
        ))}

        <section
          aria-labelledby="compare-title"
          className="border-t border-primary/15 py-14 lg:py-20"
        >
          <h2
            id="compare-title"
            className="text-4xl font-light tracking-tight text-primary xl:text-5xl"
          >
            Side by side
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-primary/85">
            The same four marks at the sizes where logos usually fail. A good
            test: glance away, glance back, and see which one you can still
            name.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {CONCEPTS.map((c) => (
              <div key={c.id} className="overflow-hidden rounded-lg ring-1 ring-inset ring-primary/10">
                <div className="flex items-center justify-between bg-primary px-5 py-3">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-accent">
                    {c.letter} · {c.name}
                  </span>
                </div>
                <div className="flex h-24 items-center justify-center gap-5 bg-white">
                  {[16, 24, 32, 48].map((px) => (
                    <Logo
                      key={px}
                      concept={c.id}
                      kind="icon"
                      title={`Concept ${c.letter} favicon at ${px} pixels`}
                      style={{ width: px, height: px }}
                    />
                  ))}
                </div>
                <div className="flex h-24 items-center justify-center bg-neutral-100 px-6">
                  <Logo
                    concept={c.id}
                    kind="horizontal"
                    title={`Concept ${c.letter} horizontal lockup, small`}
                    className="h-8 w-auto"
                  />
                </div>
                <div className="flex h-24 items-center justify-center bg-primary px-6">
                  <Logo
                    concept={c.id}
                    kind="horizontal"
                    variant="dark"
                    title={`Concept ${c.letter} horizontal lockup on navy, small`}
                    className="h-8 w-auto"
                  />
                </div>
                <div className="flex h-40 items-center justify-center bg-accent px-6">
                  <Logo
                    concept={c.id}
                    kind="stacked"
                    title={`Concept ${c.letter} stacked lockup on lime`}
                    className="h-28 w-auto"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-primary text-white">
        <div className={`${SHELL} py-10`}>
          <p className="max-w-3xl text-[15px] leading-relaxed text-white/85">
            Next step: reply with A, B, C or D, plus anything you would change.
            The chosen concept is then refined and exported as a full package:
            lockups, single-colour and reversed versions, favicon set, social
            image template and a one-page brand sheet.
          </p>
        </div>
      </footer>
    </>
  );
}
