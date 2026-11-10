import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/site/Page";
import { StageIcon } from "@/components/process/StageIcon";
import { Timeline } from "@/components/process/Timeline";
import { ButtonLink, WhatsAppButton } from "@/components/ui/Button";
import { pageMeta } from "@/lib/seo";
import { tr } from "@content/i18n";
import { processIntro, processStages } from "@content/process";
import { whatsappUrl } from "@content/site";
import { ui } from "@content/ui";

export const metadata: Metadata = pageMeta({
  title: "How we build: from consultation to handover",
  description:
    "The build journey with Sri Skanda Constructions in Pondicherry: consultation, site visit and soil test, design and Vastu, plan approval, agreement and BOQ, construction, quality checks and handover.",
  path: "/process",
});

export default function ProcessPage() {
  const total = processStages.length;
  return (
    <>
      <PageHero
        eyebrow={tr(ui.nav.process)}
        title={tr(ui.process.title)}
        intro={<p>{tr(processIntro)}</p>}
        stage="structure"
        az={58}
        sheet={["G-001", "SEQUENCE", "NTS"]}
      />

      <section aria-labelledby="journey-t" className="relative pb-16 text-white lg:pb-0">
        <h2 id="journey-t" className="sr-only">
          {tr(ui.process.title)}
        </h2>
        <Timeline count={total}>
          {processStages.map((s, n) => (
            <li
              key={s.id}
              className="relative border-l-2 border-secondary pb-12 pl-8 last:pb-0 lg:w-[clamp(20rem,27vw,30rem)] lg:shrink-0 lg:border-l-0 lg:pb-0 lg:pl-0"
            >
              <span aria-hidden="true" className="absolute -left-[9px] top-1 z-[1] h-4 w-4 rounded-full border-2 border-accent bg-primary lg:relative lg:left-0 lg:top-0 lg:mb-8 lg:block" />
              <p className="t-tech text-navy-300">
                {tr(ui.process.stage)} {String(n + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </p>
              <div className="mt-4 rounded-lg bg-secondary/70 p-6 ring-1 ring-navy-700 lg:min-h-[26rem] lg:p-8">
                <StageIcon id={s.id} className="h-14 w-14 text-accent" />
                <h3 className="t-h3 mt-6">{tr(s.title)}</h3>
                <p className="mt-3 text-white/90">{tr(s.body)}</p>
                <dl className="mt-6 space-y-3 border-t border-navy-700 pt-5">
                  <div>
                    <dt className="t-tech text-accent">{tr(ui.process.you)}</dt>
                    <dd className="mt-1 text-white/90">{tr(s.you)}</dd>
                  </div>
                  <div>
                    <dt className="t-tech text-accent">{tr(ui.process.result)}</dt>
                    <dd className="mt-1 text-white/90">{tr(s.result)}</dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </Timeline>
      </section>

      <CtaBand title="Start with the first stage." body="A conversation costs nothing. Tell us about your plot and what you want to build.">
        <WhatsAppButton href={whatsappUrl(tr(ui.whatsappGreeting))}>{tr(ui.cta.whatsapp)}</WhatsAppButton>
        <ButtonLink href="/contact" variant="lime">
          {tr(ui.cta.plan)}
        </ButtonLink>
      </CtaBand>
    </>
  );
}
