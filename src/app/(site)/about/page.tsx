import type { Metadata } from "next";
import Image from "next/image";
import { Band, CtaBand, PageHero, SectionTitle } from "@/components/site/Page";
import { ButtonLink, WhatsAppButton } from "@/components/ui/Button";
import { PinIcon } from "@/components/ui/icons";
import { pageMeta } from "@/lib/seo";
import { about } from "@content/about";
import { tr } from "@content/i18n";
import { addressLines, mapLinks, site, whatsappUrl } from "@content/site";
import { ui } from "@content/ui";

export const metadata: Metadata = pageMeta({
  title: "About Sri Skanda Constructions, builders based in Pondicherry",
  description:
    "Sri Skanda Constructions, based in Pondicherry, builds homes and commercial buildings: Vastu-led planning and turnkey delivery by one team.",
  path: "/about",
  image: "about",
});

export default function AboutPage() {
  const claims = [site.claims.experience, site.claims.serviceArea].filter((c) => c.enabled);
  return (
    <>
      <PageHero
        eyebrow={tr(ui.about.title)}
        title={tr(about.title)}
        intro={about.intro.map((p) => (
          <p key={p.en}>{tr(p)}</p>
        ))}
        stage="handover"
        az={60}
        sheet={["A-000", "PRACTICE", "NTS"]}
      >
        {claims.length ? (
          <ul className="flex flex-wrap gap-3">
            {claims.map((c) => (
              <li key={c.text} className="t-tech rounded-full border border-accent px-4 py-2 text-accent">
                {c.text}
              </li>
            ))}
          </ul>
        ) : null}
      </PageHero>

      <Band labelledBy="approach-t">
        <SectionTitle id="approach-t">{tr(about.approachTitle)}</SectionTitle>
        <ul className="grid gap-x-[var(--gutter)] gap-y-14 md:grid-cols-2">
          {about.approach.map((item, n) => (
            <li key={item.title.en} className={`grid gap-6 lg:grid-cols-2 lg:items-center ${n % 2 ? "md:mt-24" : ""}`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-navy-100">
                <Image src={item.image} alt={tr(item.alt)} fill sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw" quality={60} className="object-cover" />
                <span aria-hidden="true" className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
              </div>
              <div>
                <h3 className="t-h3">{tr(item.title)}</h3>
                <p className="mt-3 text-gray-700">{tr(item.body)}</p>
              </div>
            </li>
          ))}
        </ul>
      </Band>

      {about.team.length ? (
        <Band tone="paper" labelledBy="team-t">
          <SectionTitle id="team-t">{tr(about.teamTitle)}</SectionTitle>
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {about.team.map((m) => (
              <li key={m.name}>
                {m.photo ? (
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-navy-100">
                    <Image src={m.photo} alt={m.name} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
                  </div>
                ) : null}
                <h3 className="t-h3 mt-5">{m.name}</h3>
                <p className="t-tech mt-1 text-gray-600">{tr(m.role)}</p>
                <p className="mt-3 text-gray-700">{tr(m.bio)}</p>
              </li>
            ))}
          </ul>
        </Band>
      ) : null}

      <Band tone="surface" labelledBy="base-t">
        <div className="grid-12 items-center gap-y-8">
          <div className="col-span-12 lg:col-span-6">
            <h2 id="base-t" className="t-h2">
              {tr(about.baseTitle)}
            </h2>
            <p className="t-lead mt-5 measure">{tr(about.base)}</p>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <address className="t-lead not-italic">
              {site.name}
              <br />
              {addressLines().join(", ")}
            </address>
            <a href={mapLinks().directions} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline focus-visible:outline-primary">
              <PinIcon className="h-5 w-5" />
              {tr(ui.cta.directions)}
            </a>
          </div>
        </div>
      </Band>

      <CtaBand title="Have a plot in mind?" body="Tell us where it is and what you want to build.">
        <WhatsAppButton href={whatsappUrl(tr(ui.whatsappGreeting))}>{tr(ui.cta.whatsapp)}</WhatsAppButton>
        <ButtonLink href="/contact" variant="lime">
          {tr(ui.cta.plan)}
        </ButtonLink>
      </CtaBand>
    </>
  );
}
