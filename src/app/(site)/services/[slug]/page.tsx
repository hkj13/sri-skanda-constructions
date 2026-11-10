import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Band, CtaBand, PageHero, SectionTitle } from "@/components/site/Page";
import { ButtonLink, WhatsAppButton } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/icons";
import { faqJsonLd, ldScript, pageMeta, serviceJsonLd } from "@/lib/seo";
import { telLink } from "@/lib/whatsapp";
import { tr } from "@content/i18n";
import { getService, services } from "@content/services";
import { site, whatsappUrl } from "@content/site";
import { ui } from "@content/ui";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMeta({
    title: tr(s.title),
    description: `${tr(s.summary)} ${tr(s.intro[0])}`.slice(0, 158),
    path: `/services/${s.slug}`,
    image: `service-${s.slug}`,
  });
}

const SHEETS: Record<string, [string, string, string]> = {
  plan: ["A-101", "VASTU PLAN", "1:100"],
  massing: ["A-102", "MASSING", "1:200"],
  structure: ["S-301", "FRAME", "1:100"],
  finished: ["A-601", "RENOVATION", "1:100"],
  commercial: ["A-501", "COMMERCIAL", "1:200"],
  handover: ["A-701", "HANDOVER", "1:100"],
};

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const wa = whatsappUrl(tr(s.whatsapp));
  const others = services.filter((o) => o.slug !== s.slug);
  const toc = [
    ["included", tr(ui.services.included)],
    ["how", tr(ui.services.how)],
    ["provide", tr(ui.services.youProvide)],
    ...(s.timeline ? [["timeline", tr(ui.services.timeline)]] : []),
    ["questions", tr(ui.services.questions)],
  ] as [string, string][];

  return (
    <>
      <PageHero
        eyebrow={tr(s.name)}
        title={tr(s.title)}
        intro={<p>{tr(s.summary)}</p>}
        stage={s.stage}
        crumbs={[
          { href: "/services", label: tr(ui.nav.services) },
          { href: `/services/${s.slug}`, label: tr(s.name) },
        ]}
        sheet={SHEETS[s.stage]}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <WhatsAppButton href={wa}>{tr(s.cta)}</WhatsAppButton>
          <ButtonLink href="/estimate" variant="outline-light">
            {tr(ui.cta.estimate)}
          </ButtonLink>
        </div>
      </PageHero>

      <div className="relative bg-white text-primary">
        <div className="shell grid-12 gap-y-12 py-16 lg:py-24">
          {/* side index */}
          <nav aria-label={tr(ui.services.onThisPage)} className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <p className="t-tech text-gray-600">{tr(ui.services.onThisPage)}</p>
              <ol className="mt-4 flex flex-wrap gap-x-5 gap-y-2 lg:block lg:space-y-2">
                {toc.map(([id, label]) => (
                  <li key={id}>
                    <a href={`#${id}`} className="font-medium underline-offset-4 hover:underline focus-visible:outline-primary">
                      {label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="col-span-12 space-y-20 lg:col-span-9 xl:col-span-8">
            <div className="t-lead measure space-y-5">
              {s.intro.map((p) => (
                <p key={p.en}>{tr(p)}</p>
              ))}
            </div>

            <section id="included" aria-labelledby="included-t">
              <SectionTitle id="included-t">{tr(ui.services.included)}</SectionTitle>
              <ul className="grid gap-x-10 gap-y-5 md:grid-cols-2">
                {s.included.map((item) => (
                  <li key={item.en} className="flex gap-4 border-t border-primary/15 pt-5">
                    <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 bg-primary" />
                    <span className="t-lead">{tr(item)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="how" aria-labelledby="how-t">
              <SectionTitle id="how-t">{tr(ui.services.how)}</SectionTitle>
              {/* A construction line with stations, not a numbered list */}
              <ol className="relative grid gap-y-10 md:grid-flow-col md:auto-cols-fr md:gap-x-6">
                <span aria-hidden="true" className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-0.5 bg-primary md:left-0 md:top-[7px] md:h-0.5 md:w-full" />
                {s.steps.map((step, n) => (
                  <li key={step.title.en} className="relative pl-10 md:pl-0 md:pt-10">
                    <span aria-hidden="true" className={`absolute left-0 top-0.5 h-4 w-4 rounded-full border-2 border-primary md:top-0 ${n === 0 ? "bg-primary" : "bg-white"}`} />
                    <h3 className="text-xl font-medium">{tr(step.title)}</h3>
                    <p className="mt-2 text-gray-700">{tr(step.body)}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-10">
                <Link href="/process" className="inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline focus-visible:outline-primary">
                  The full build journey
                  <ArrowIcon className="h-5 w-5" />
                </Link>
              </p>
            </section>

            <section id="provide" aria-labelledby="provide-t" className="rounded-lg bg-surface p-6 sm:p-10">
              <h2 id="provide-t" className="t-h3">
                {tr(ui.services.youProvide)}
              </h2>
              <ul className="mt-6 grid gap-x-10 gap-y-4 md:grid-cols-2">
                {s.youProvide.map((item) => (
                  <li key={item.en} className="flex gap-3">
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-1 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
                      <rect x={1.5} y={1.5} width={17} height={17} />
                      <path d="M5.5 10.5l3 3 6-7" />
                    </svg>
                    <span>{tr(item)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {s.timeline ? (
              <section id="timeline" aria-labelledby="timeline-t">
                <SectionTitle id="timeline-t">{tr(ui.services.timeline)}</SectionTitle>
                <p className="t-lead measure">{tr(s.timeline)}</p>
              </section>
            ) : null}

            <section id="questions" aria-labelledby="questions-t">
              <SectionTitle id="questions-t">{tr(ui.services.questions)}</SectionTitle>
              <div className="border-b border-primary/15">
                {s.faqs.map((f) => (
                  <details key={f.q.en} className="group border-t border-primary/15">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-xl font-medium focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                      <span>{tr(f.q)}</span>
                      <span aria-hidden="true" className="mt-1 text-2xl leading-none transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="measure pb-6 text-gray-700">{tr(f.a)}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <CtaBand title={tr(s.cta)} body={`Send us a message and we will reply on WhatsApp. Or call ${site.phone.display}.`}>
        <WhatsAppButton href={wa}>{tr(s.cta)}</WhatsAppButton>
        <ButtonLink href={telLink} variant="outline-light">
          {tr(ui.cta.call)} {site.phone.display}
        </ButtonLink>
      </CtaBand>

      <Band tone="paper" labelledBy="others-t">
        <h2 id="others-t" className="t-h3">
          {tr(ui.services.others)}
        </h2>
        <ul className="mt-6 grid gap-x-[var(--gutter)] gap-y-3 sm:grid-cols-2 xl:grid-cols-5">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/services/${o.slug}`} className="group flex h-full items-center justify-between gap-4 border-t-2 border-primary py-4 font-medium hover:text-secondary focus-visible:outline-primary">
                {tr(o.name)}
                <ArrowIcon className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript(serviceJsonLd(s.slug)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldScript(faqJsonLd(s.faqs.map((f) => ({ q: tr(f.q), a: tr(f.a) })))) }}
      />
    </>
  );
}
