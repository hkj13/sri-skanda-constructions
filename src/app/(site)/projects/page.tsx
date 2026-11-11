import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Band, CtaBand, PageHero } from "@/components/site/Page";
import { WhatsAppButton } from "@/components/ui/Button";
import { BeforeAfter } from "@/home/BeforeAfter";
import { pageMeta } from "@/lib/seo";
import { tr } from "@content/i18n";
import { projects } from "@content/projects";
import { site, whatsappUrl } from "@content/site";
import { ui } from "@content/ui";

export const metadata: Metadata = pageMeta({
  title: "Projects by Sri Skanda Constructions",
  description: "Homes and commercial buildings by Sri Skanda Constructions, ongoing and completed.",
  path: "/projects",
  index: projects.length > 0,
});

/** Shown only once content/projects.ts has at least one project. */
export default function ProjectsPage() {
  if (!projects.length) notFound();
  const groups = (["ongoing", "completed"] as const)
    .map((status) => ({ status, items: projects.filter((p) => p.status === status) }))
    .filter((g) => g.items.length);
  const forSale = projects.some((p) => p.forSale);

  return (
    <>
      <PageHero eyebrow={tr(ui.nav.projects)} title={tr(ui.projects.title)} intro={<p>{tr(ui.projects.intro)}</p>} />
      {groups.map((g) => (
        <Band key={g.status} tone={g.status === "ongoing" ? "white" : "paper"} labelledBy={`${g.status}-t`}>
          <h2 id={`${g.status}-t`} className="t-h2">
            {tr(ui.projects[g.status])}
          </h2>
          <ul className="mt-12 space-y-20">
            {g.items.map((p) => (
              <li key={p.slug} id={p.slug} className="grid-12 gap-y-6">
                <div className="col-span-12 lg:col-span-7">
                  {p.beforeAfter ? (
                    <div className="relative aspect-[4/3]">
                      <BeforeAfter photos={{ before: p.beforeAfter.before.src, after: p.beforeAfter.after.src }} className="absolute inset-0 overflow-hidden rounded-lg" />
                    </div>
                  ) : p.photos[0] ? (
                    <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-navy-100">
                      <Image src={p.photos[0].src} alt={tr(p.photos[0].alt)} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
                    </div>
                  ) : null}
                  {p.photos.length > 1 ? (
                    <ul className="mt-3 grid grid-cols-3 gap-3">
                      {p.photos.slice(1, 4).map((ph) => (
                        <li key={ph.src} className="relative aspect-square overflow-hidden rounded-md bg-navy-100">
                          <Image src={ph.src} alt={tr(ph.alt)} fill sizes="20vw" className="object-cover" />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="col-span-12 lg:col-span-4 lg:col-start-9">
                  <p className="t-tech text-gray-600">{tr(ui.projects.types[p.type])}</p>
                  <h3 className="t-h3 mt-2">{tr(p.title)}</h3>
                  <dl className="mt-4 space-y-1">
                    <div className="flex gap-2">
                      <dt className="sr-only">Location</dt>
                      <dd>{tr(p.location)}</dd>
                    </div>
                    {p.size ? (
                      <div className="flex gap-2">
                        <dt className="sr-only">Size</dt>
                        <dd>{tr(p.size)}</dd>
                      </div>
                    ) : null}
                  </dl>
                  <p className="mt-4 text-gray-700">{tr(p.story)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Band>
      ))}
      {forSale && site.reraNumber ? (
        <Band tone="surface">
          <p className="t-tech">
            {tr(ui.footer.rera)}: {site.reraNumber}
          </p>
        </Band>
      ) : null}
      <CtaBand title="Want something like this?" body="Tell us about your plot.">
        <WhatsAppButton href={whatsappUrl(tr(ui.whatsappGreeting))}>{tr(ui.cta.whatsapp)}</WhatsAppButton>
      </CtaBand>
    </>
  );
}
