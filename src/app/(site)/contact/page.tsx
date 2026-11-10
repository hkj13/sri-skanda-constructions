import type { Metadata } from "next";
import { PageHero } from "@/components/site/Page";
import { PlanYourBuild } from "@/components/forms/PlanYourBuild";
import { ButtonLink } from "@/components/ui/Button";
import { PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/icons";
import { pageMeta } from "@/lib/seo";
import { telLink } from "@/lib/whatsapp";
import { tr } from "@content/i18n";
import { addressLines, mapLinks, site, whatsappUrl } from "@content/site";
import { ui } from "@content/ui";

export const metadata: Metadata = pageMeta({
  title: "Plan your build: contact Sri Skanda Constructions",
  description:
    "Tell us about your plot in six short steps and we reply on WhatsApp. Call +91 94880 84277 or visit us at 51, 3rd Cross Street, Thirumudi Sethuraman Nagar, Saram, Pondicherry.",
  path: "/contact",
});

const c = ui.contact;

export default function ContactPage() {
  const maps = mapLinks();
  const [line1, line2] = addressLines();
  return (
    <>
      <PageHero eyebrow={tr(ui.nav.contact)} title={tr(c.title)} intro={<p>{tr(c.intro)}</p>} stage="location" compact sheet={["C-001", "KEY PLAN", "NTS"]}>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink href={telLink} variant="outline-light">
            <span className="inline-flex items-center gap-2">
              <PhoneIcon className="h-5 w-5" />
              {tr(ui.cta.call)} {site.phone.display}
            </span>
          </ButtonLink>
        </div>
      </PageHero>

      <div className="relative bg-white text-primary">
        <div className="shell grid-12 gap-y-16 py-16 lg:py-24">
          <div className="col-span-12 lg:col-span-8">
            <PlanYourBuild />
          </div>

          <aside aria-labelledby="other-ways" className="col-span-12 lg:col-span-4">
            <div className="rounded-lg bg-navy-50 p-6 sm:p-8 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <h2 id="other-ways" className="t-h3">
                {tr(c.otherWays)}
              </h2>
              <dl className="mt-6 space-y-6">
                <div>
                  <dt className="t-tech text-gray-600">{tr(c.phoneLabel)}</dt>
                  <dd className="mt-2 space-y-2">
                    <a href={telLink} className="flex items-center gap-2 text-lg font-semibold underline-offset-4 hover:underline focus-visible:outline-primary">
                      <PhoneIcon className="h-5 w-5" />
                      {site.phone.display}
                    </a>
                    <a
                      href={whatsappUrl(tr(ui.whatsappGreeting))}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-wa-cta=""
                      className="flex items-center gap-2 font-medium underline-offset-4 hover:underline focus-visible:outline-primary"
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                      {tr(ui.cta.whatsapp)}
                    </a>
                  </dd>
                </div>
                {site.email ? (
                  <div>
                    <dt className="t-tech text-gray-600">{tr(c.emailLabel)}</dt>
                    <dd className="mt-2">
                      <a href={`mailto:${site.email}`} className="font-medium underline-offset-4 hover:underline">
                        {site.email}
                      </a>
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="t-tech text-gray-600">{tr(c.address)}</dt>
                  <dd className="mt-2">
                    <address className="not-italic">
                      {site.name}
                      <br />
                      {line1}
                      <br />
                      {line2}
                    </address>
                    <a href={maps.directions} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline focus-visible:outline-primary">
                      <PinIcon className="h-5 w-5" />
                      {tr(ui.cta.directions)}
                    </a>
                  </dd>
                </div>
                {site.openingHours.length ? (
                  <div>
                    <dt className="t-tech text-gray-600">{tr(c.hours)}</dt>
                    <dd className="mt-2 space-y-1">
                      {site.openingHours.map((h) => (
                        <p key={h.days.join()}>
                          {h.days.length > 1 ? `${h.days[0]} to ${h.days[h.days.length - 1]}` : h.days[0]}: {h.opens} to {h.closes}
                        </p>
                      ))}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </aside>
        </div>
      </div>

      <section aria-labelledby="map-t" className="relative bg-white pb-16 text-primary lg:pb-24">
        <div className="shell">
          <h2 id="map-t" className="sr-only">
            {tr(c.address)}
          </h2>
          <div className="relative overflow-hidden rounded-lg ring-1 ring-primary/15">
            <iframe
              title={tr(c.mapTitle)}
              src={maps.embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[min(70svh,560px)] w-full border-0"
            />
          </div>
          <p className="mt-4">
            <a href={maps.view} target="_blank" rel="noopener noreferrer" className="font-medium underline-offset-4 hover:underline focus-visible:outline-primary">
              Open in Google Maps
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
