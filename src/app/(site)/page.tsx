import { ButtonLink, WhatsAppButton } from "@/components/ui/Button";
import { RenovationControl } from "@/home/BeforeAfter";
import { ChapterRail, FloorCounter } from "@/home/client";
import { FacingControl, PlanViewControl, TypeControl } from "@/home/controls";
import { PhotoInText } from "@/home/layers";
import { ChapterText } from "@/home/parts";
import { KeyAndHand } from "@/home/scenes";
import { Story } from "@/home/Story";
import { telLink } from "@/lib/whatsapp";
import { chapters, handoverNote, hero, type ChapterCopy, type ChapterId } from "@content/home";
import { tr } from "@content/i18n";
import { addressLines, site, whatsappUrl } from "@content/site";
import { verifiedTestimonials } from "@content/testimonials";
import { ui } from "@content/ui";

const byId = Object.fromEntries(chapters.map((c) => [c.id, c])) as Record<ChapterId, ChapterCopy>;

export default function HomePage() {
  const whatsapp = whatsappUrl(tr(ui.whatsappGreeting));
  const testimonials = verifiedTestimonials();
  const c = byId;

  // The words for each chapter, in story order. The drawings they go with
  // live on the story stage (src/home/layers.tsx).
  const texts: Record<ChapterId, React.ReactNode> = {
    groundbreaking: (
      <ChapterText copy={c.groundbreaking} as="h1">
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <WhatsAppButton href={whatsapp}>{tr(ui.cta.whatsapp)}</WhatsAppButton>
          <ButtonLink href="/estimate" variant="outline-light">
            {tr(ui.cta.estimate)}
          </ButtonLink>
        </div>
        <p className="mt-8">
          <a href="#start" className="font-medium text-white underline decoration-accent underline-offset-4 hover:text-accent focus-visible:outline-accent">
            {tr(hero.skip)} <span aria-hidden="true">↓</span>
          </a>
        </p>
        <details className="mt-4 lg:hidden">
          <summary className="t-tech cursor-pointer text-navy-300 focus-visible:outline-accent">{tr(ui.nav.chapters)}</summary>
          <ol className="mt-3 space-y-1">
            {chapters.slice(1).map((ch) => (
              <li key={ch.id}>
                <a href={`#${ch.id}`} className="inline-block py-1.5 text-white underline-offset-4 hover:underline">
                  {tr(ch.nav)}
                </a>
              </li>
            ))}
          </ol>
        </details>
      </ChapterText>
    ),
    vastu: (
      <ChapterText copy={c.vastu}>
        <FacingControl />
      </ChapterText>
    ),
    planning: (
      <ChapterText copy={c.planning}>
        <PlanViewControl />
        <PhotoInText id="planning" />
      </ChapterText>
    ),
    foundation: (
      <ChapterText copy={c.foundation}>
        <PhotoInText id="foundation" />
      </ChapterText>
    ),
    structure: (
      <ChapterText
        copy={c.structure}
        headline={
          <div data-crane-load="" className="crane-load relative mt-5 inline-block">
            <span data-crane-cable="" aria-hidden="true" className="crane-cable absolute bottom-full left-1/2 hidden h-[90svh] w-px bg-navy-300 lg:block" />
            <span aria-hidden="true" className="crane-cable absolute bottom-full left-1/2 hidden h-3 w-3 -translate-x-1/2 bg-navy-300 lg:block" />
            <h2 className="t-h2 border-2 border-accent bg-primary px-5 py-3 text-white">{tr(c.structure.headline)}</h2>
          </div>
        }
      >
        <FloorCounter />
      </ChapterText>
    ),
    finishing: <ChapterText copy={c.finishing} />,
    types: (
      <ChapterText copy={c.types}>
        <TypeControl />
      </ChapterText>
    ),
    renovation: (
      <ChapterText copy={c.renovation}>
        <RenovationControl />
      </ChapterText>
    ),
    handover: (
      <ChapterText copy={c.handover}>
        <p className="t-h2 mt-4 text-accent">{tr(handoverNote)}</p>
        <KeyAndHand label="A key with a lime tag dropping into an open hand." className="mt-6 h-auto w-[min(50%,200px)]" />
        <PhotoInText id="handover" />
      </ChapterText>
    ),
    sustainable: (
      <ChapterText copy={c.sustainable}>
        <PhotoInText id="sustainable" />
      </ChapterText>
    ),
    start: (
      <ChapterText copy={c.start}>
        <div className="mt-8 flex max-w-md flex-col gap-3">
          <WhatsAppButton href={whatsapp}>{tr(ui.cta.whatsapp)}</WhatsAppButton>
          <ButtonLink href="/estimate" variant="lime">
            {tr(ui.cta.estimate)}
          </ButtonLink>
          <ButtonLink href={telLink} variant="outline-light">
            {tr(ui.cta.call)} {site.phone.display}
          </ButtonLink>
        </div>
        <p className="t-tech mt-8 text-navy-300">{addressLines().join(", ")}</p>
      </ChapterText>
    ),
  };

  return (
    <div className="relative text-white">
      <ChapterRail
        label={tr(ui.nav.chapters)}
        chapters={chapters.map((ch) => ({ id: ch.id, name: tr(ch.nav), sheet: ch.sheet }))}
      />

      <Story
        chapters={chapters.map((ch) => ({ id: ch.id, label: tr(ch.nav), sheet: ch.sheet }))}
        texts={chapters.map((ch) => texts[ch.id])}
      />

      {testimonials.length ? (
        <section aria-labelledby="testimonials-title" className="relative bg-surface text-primary">
          <div className="shell py-20 lg:py-28">
            <h2 id="testimonials-title" className="t-h2">
              {tr(ui.testimonials.title)}
            </h2>
            <ul className="mt-10 grid gap-10 lg:grid-cols-3">
              {testimonials.map((t) => (
                <li key={t.name}>
                  <blockquote className="t-lead">“{tr(t.quote)}”</blockquote>
                  <p className="mt-4 font-semibold">{t.name}</p>
                  {t.context ? <p className="t-small text-gray-600">{tr(t.context)}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
