import type { Metadata } from "next";
import Link from "next/link";
import { Band, CtaBand, PageHero } from "@/components/site/Page";
import { ButtonLink, WhatsAppButton } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/icons";
import { pageMeta } from "@/lib/seo";
import { StageArt } from "@/scene/StageArt";
import { tr } from "@content/i18n";
import { services } from "@content/services";
import { whatsappUrl } from "@content/site";
import { ui } from "@content/ui";

export const metadata: Metadata = pageMeta({
  title: "Construction services, from foundation to finishing",
  description:
    "House construction, commercial buildings, Vastu consultation, 2D and 3D planning, renovation and turnkey projects in Pondicherry and Hyderabad, handled by one team.",
  path: "/services",
  image: "services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow={tr(ui.nav.services)}
        title={tr(ui.services.title)}
        intro={<p>{tr(ui.services.intro)}</p>}
        stage="finished"
        az={38}
        sheet={["A-000", "SERVICES", "NTS"]}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <WhatsAppButton href={whatsappUrl(tr(ui.whatsappGreeting))}>{tr(ui.cta.whatsapp)}</WhatsAppButton>
          <ButtonLink href="/estimate" variant="outline-light">
            {tr(ui.cta.estimate)}
          </ButtonLink>
        </div>
      </PageHero>

      <Band labelledBy="services-list">
        <h2 id="services-list" className="sr-only">
          {tr(ui.services.title)}
        </h2>
        <ul className="grid gap-x-[var(--gutter)] gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group grid h-full grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-5 rounded-lg bg-primary p-4 text-white transition-colors hover:bg-secondary focus-visible:outline-primary sm:p-5"
              >
                <span className="relative block aspect-[10/9] overflow-hidden rounded-md bg-navy-950">
                  <StageArt stage={s.stage} className="absolute inset-0 h-full w-full" />
                </span>
                <span className="block">
                  <span className="t-h3 block text-white">{tr(s.name)}</span>
                  <span className="mt-2 block text-white/85">{tr(s.summary)}</span>
                  <span className="mt-4 inline-flex items-center gap-2 font-semibold text-accent">
                    {tr(ui.cta.readMore)}
                    <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      <CtaBand title="Not sure which one you need?" body="Tell us about the plot or the building. We will point you the right way.">
        <WhatsAppButton href={whatsappUrl(tr(ui.whatsappGreeting))}>{tr(ui.cta.whatsapp)}</WhatsAppButton>
        <ButtonLink href="/contact" variant="lime">
          {tr(ui.cta.plan)}
        </ButtonLink>
      </CtaBand>
    </>
  );
}
