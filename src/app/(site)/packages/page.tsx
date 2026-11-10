import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Band, CtaBand, PageHero } from "@/components/site/Page";
import { WhatsAppButton } from "@/components/ui/Button";
import { pageMeta } from "@/lib/seo";
import { tr } from "@content/i18n";
import { packages, SPEC_LABELS, type SpecItem } from "@content/packages";
import { whatsappUrl } from "@content/site";
import { ui } from "@content/ui";

export const metadata: Metadata = pageMeta({
  title: "Construction packages",
  description: "What goes into the building at each package level, item by item.",
  path: "/packages",
  index: packages.length > 0,
});

/** Shown only once content/packages.ts has at least one package. */
export default function PackagesPage() {
  if (!packages.length) notFound();
  const items = Object.keys(SPEC_LABELS) as SpecItem[];
  return (
    <>
      <PageHero eyebrow={tr(ui.nav.packages)} title={tr(ui.packages.title)} intro={<p>{tr(ui.packages.intro)}</p>} />
      <Band>
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={tr(ui.packages.title)}>
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">{tr(ui.packages.title)}</caption>
            <thead>
              <tr>
                <th scope="col" className="w-48 py-4 pr-6 align-bottom" />
                {packages.map((p) => (
                  <th key={p.slug} scope="col" className="py-4 pr-6 align-bottom">
                    <span className="t-h3 block">{tr(p.name)}</span>
                    <span className="mt-2 block font-normal text-gray-700">{tr(p.summary)}</span>
                    {p.price ? <span className="t-tech mt-3 block">{tr(p.price)}</span> : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item} className="border-t border-primary/15">
                  <th scope="row" className="py-4 pr-6 font-medium">
                    {tr(SPEC_LABELS[item])}
                  </th>
                  {packages.map((p) => {
                    const spec = p.specs.find((s) => s.item === item);
                    return (
                      <td key={p.slug} className="py-4 pr-6 text-gray-700">
                        {spec ? tr(spec.detail) : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Band>
      <CtaBand title="Ask which package suits your plot.">
        <WhatsAppButton href={whatsappUrl(tr(ui.whatsappGreeting))}>{tr(ui.cta.whatsapp)}</WhatsAppButton>
      </CtaBand>
    </>
  );
}
