import { ButtonLink, WhatsAppButton } from "@/components/ui/Button";
import { BeforeAfter } from "@/home/BeforeAfter";
import { Chapter } from "@/home/Chapter";
import { ChapterRail, FloorCounter, SceneVideo } from "@/home/client";
import { ChapterText, SCENE_SVG, Stage } from "@/home/parts";
import { PlanningChapter } from "@/home/PlanningChapter";
import { FinishingScene, FoundationScene, GroundScene, KeyAndHand, SustainableScene } from "@/home/scenes";
import { TypesChapter } from "@/home/TypesChapter";
import { VastuChapter } from "@/home/VastuChapter";
import { telLink } from "@/lib/whatsapp";
import { IsoBuilding } from "@/scene/Iso";
import {
  chapters,
  finishingTags,
  foundationTags,
  handoverNote,
  hero,
  sustainableTags,
  type ChapterCopy,
  type ChapterId,
} from "@content/home";
import { tr, type L } from "@content/i18n";
import { addressLines, site, whatsappUrl } from "@content/site";
import { verifiedTestimonials } from "@content/testimonials";
import { ui } from "@content/ui";

const byId = Object.fromEntries(chapters.map((c) => [c.id, c])) as Record<ChapterId, ChapterCopy>;
const index = (id: ChapterId) => chapters.findIndex((c) => c.id === id);
const words = <T extends Record<string, L>>(o: T) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k, tr(v)])) as { [K in keyof T]: string };

export default function HomePage() {
  const whatsapp = whatsappUrl(tr(ui.whatsappGreeting));
  const testimonials = verifiedTestimonials();
  const c = byId;

  return (
    <div className="relative text-white">
      <ChapterRail
        label={tr(ui.nav.chapters)}
        chapters={chapters.map((ch) => ({ id: ch.id, name: tr(ch.nav), sheet: ch.sheet }))}
      />

      {/* 00 Groundbreaking */}
      <Chapter id="groundbreaking" index={0} length={50} label={tr(c.groundbreaking.nav)} className="chapter-first">
        <Stage
          copy={c.groundbreaking}
          text={
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
          }
          scene={<GroundScene label="An empty plot at dawn. Four lime survey stakes mark the corners, string lines run between them, and the Sri Skanda Constructions mark stands on the plot." />}
        />
      </Chapter>

      {/* 01 Vastu and planning */}
      <Chapter id="vastu" index={index("vastu")} length={150} label={tr(c.vastu.nav)}>
        <VastuChapter copy={c.vastu} />
      </Chapter>

      {/* 02 Architectural planning */}
      <Chapter id="planning" index={index("planning")} length={190} label={tr(c.planning.nav)}>
        <PlanningChapter copy={c.planning} />
      </Chapter>

      {/* 03 Foundation */}
      <Chapter id="foundation" index={index("foundation")} length={190} label={tr(c.foundation.nav)}>
        <Stage
          copy={c.foundation}
          text={<ChapterText copy={c.foundation} />}
          scene={
            <>
              <SceneVideo
                name="construction-site"
                className="left-[5%] top-[8%] h-[33.5%] w-[90%]"
                style={{ maskImage: "linear-gradient(transparent, #000 45%)", opacity: "clamp(0, calc((var(--p) - 0.05) * 6), 1)" }}
              />
              <FoundationScene
                tags={words(foundationTags)}
                label="Section through a foundation: a trench in tested soil, a concrete bed, a steel-reinforced footing, a column rising from it, and a plinth beam at ground level."
              />
            </>
          }
        />
      </Chapter>

      {/* 04 Structure */}
      <Chapter id="structure" index={index("structure")} length={220} label={tr(c.structure.nav)}>
        <Stage
          copy={c.structure}
          slot={4}
          text={
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
          }
          scene={
            <>
              <div data-scene-fallback="" className="absolute inset-0">
                <IsoBuilding
                  g={5}
                  chapter={4}
                  crane
                  className={SCENE_SVG}
                  label="The concrete frame of the house: columns and three floor slabs, with a tower crane behind."
                />
              </div>
            </>
          }
        />
      </Chapter>

      {/* 05 Walls and finishing */}
      <Chapter id="finishing" index={index("finishing")} length={200} label={tr(c.finishing.nav)}>
        <Stage
          copy={c.finishing}
          text={<ChapterText copy={c.finishing} />}
          scene={
            <>
              <FinishingScene
                tags={words(finishingTags)}
                label="One bay of the front wall: brick courses at the bottom, plaster above, white paint at the top, and two windows."
              />
              <SceneVideo
                name="glass-building"
                className="left-[23.75%] top-[21.67%] z-[2] h-[20.83%] w-[18.75%] border-2 border-primary"
                style={{ opacity: "clamp(0, calc((var(--p) - 0.9) * 12), 1)" }}
              />
            </>
          }
        />
      </Chapter>

      {/* 06 Homes or commercial */}
      <Chapter id="types" index={index("types")} length={140} label={tr(c.types.nav)}>
        <TypesChapter copy={c.types} />
      </Chapter>

      {/* 07 Renovation */}
      <Chapter id="renovation" index={index("renovation")} length={110} label={tr(c.renovation.nav)}>
        <Stage copy={c.renovation} text={<ChapterText copy={c.renovation} />} scene={<BeforeAfter />} />
      </Chapter>

      {/* 08 Turnkey handover */}
      <Chapter id="handover" index={index("handover")} length={200} label={tr(c.handover.nav)}>
        <Stage
          copy={c.handover}
          slot={8}
          text={
            <ChapterText copy={c.handover}>
              <p className="t-h2 mt-4 text-accent">{tr(handoverNote)}</p>
              <KeyAndHand label="A key with a lime tag dropping into an open hand." />
            </ChapterText>
          }
          scene={
            <div data-scene-fallback="" className="absolute inset-0">
              <IsoBuilding
                g={8.99}
                chapter={8}
                lit="animate"
                doorOpen="animate"
                className={SCENE_SVG}
                label="The finished house at dusk: the front door open and the windows lit, one room after another."
              />
            </div>
          }
        />
      </Chapter>

      {/* 09 Sustainable building */}
      <Chapter id="sustainable" index={index("sustainable")} length={190} label={tr(c.sustainable.nav)}>
        <Stage
          copy={c.sustainable}
          text={<ChapterText copy={c.sustainable} />}
          scene={
            <>
              <SceneVideo
                name="eco-city"
                className="left-0 top-[3%] h-[52%] w-full"
                style={{ maskImage: "linear-gradient(#000 55%, transparent)" }}
              />
              <SustainableScene
                tags={words(sustainableTags)}
                label="The house from the road with solar panels on the top roof, a garden on the terrace, and a pipe carrying rainwater down to an underground sump."
              />
            </>
          }
        />
      </Chapter>

      {/* 10 Start your project */}
      <Chapter id="start" index={index("start")} length={90} label={tr(c.start.nav)}>
        <Stage
          copy={c.start}
          slot={10}
          text={
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
          }
          scene={
            <>
              <div data-scene-fallback="" className="absolute inset-0">
                <IsoBuilding
                  g={10.9}
                  lit
                  doorOpen
                  className={SCENE_SVG}
                  label="The finished house, lit, with solar panels on the roof and a garden on the terrace."
                />
              </div>
            </>
          }
        />
      </Chapter>

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
