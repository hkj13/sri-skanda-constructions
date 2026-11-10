import { en, type L } from "./i18n";

/**
 * The About page.
 *
 * Nothing here states how old the company is, how many projects it has
 * built, or who has certified it. Add such facts only when they are true
 * and can be backed up (see `claims` in site.ts).
 *
 * TODO(client): confirm the four "approach" statements describe how you
 * really work, and add the founder or team.
 */
export const about = {
  title: en("A builder from Saram, Pondicherry"),
  intro: [
    en("Sri Skanda Constructions builds homes and commercial buildings. Our office is in Saram, Pondicherry, and the work is what you would expect of a builder: custom homes, villas and apartments; offices, shops, showrooms and commercial complexes; renovation of buildings that need it."),
    en("Two things shape how we plan. The first is Vastu, which we treat as part of the drawing, not an afterthought. The second is turnkey delivery: one team takes the job from foundation to finishing, so you are never left carrying messages between contractors."),
  ],
  approachTitle: en("How we work"),
  approach: [
    {
      title: en("Plain talk about money"),
      body: en("You get a written estimate before work begins, and the agreement and bill of quantities set out what is covered. If something will cost more, you hear it before it is done, not after."),
      image: "/images/planning-desk.jpg",
      alt: en("Two people going through a drawing and figures at a desk"),
    },
    {
      title: en("The site is checked, stage by stage"),
      body: en("Steel is checked before concrete is poured. Levels are checked before walls go up. It is slower than hoping for the best, and it is how mistakes stay small."),
      image: "/images/site-rebar.jpg",
      alt: en("Workers tying steel on a construction site, seen from above"),
    },
    {
      title: en("Drawn before it is built"),
      body: en("2D plans and 3D views let you change your mind while changing it is still cheap."),
      image: "/images/at-the-screen.jpg",
      alt: en("A person working at a screen"),
    },
    {
      title: en("One team, one phone number"),
      body: en("From the first site visit to handover you deal with the same people. Call or message us on WhatsApp and you reach someone who knows your project."),
      image: "/images/site-worker.jpg",
      alt: en("A site worker in a yellow helmet"),
    },
  ] as { title: L; body: L; image: string; alt: L }[],
  baseTitle: en("Where to find us"),
  base: en("We work from Saram, in the heart of Pondicherry. Come by, or ask us to visit your plot."),

  /**
   * Founder and team. Shown only when the list has entries.
   * Example: { name: "Full name", role: { en: "Founder" }, bio: { en: "Two true sentences." }, photo: "/images/team/name.jpg" }
   */
  team: [] as { name: string; role: L; bio: L; photo?: string }[],
  teamTitle: en("The people"),
};
