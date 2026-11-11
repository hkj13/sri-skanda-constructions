import type { Metadata } from "next";
import { Band, PageHero } from "@/components/site/Page";
import { Estimator } from "@/components/forms/Estimator";
import { pageMeta } from "@/lib/seo";
import { tr } from "@content/i18n";
import { ui } from "@content/ui";

export const metadata: Metadata = pageMeta({
  title: "Free construction estimate from Pondicherry builders",
  description:
    "Get a free estimate for a house or commercial building from Sri Skanda Constructions, Pondicherry. Enter the built-up area, floors, project type and finish, and we reply on WhatsApp.",
  path: "/estimate",
  image: "estimate",
});

export default function EstimatePage() {
  return (
    <>
      <PageHero eyebrow={tr(ui.nav.estimate)} title={tr(ui.estimate.title)} intro={<p>{tr(ui.estimate.intro)}</p>} stage="massing" az={30} compact sheet={["Q-001", "ESTIMATE", "NTS"]} />
      <Band>
        <Estimator />
      </Band>
    </>
  );
}
