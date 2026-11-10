import { en, type L } from "./i18n";

/**
 * The six services. Each one becomes a page at /services/<slug>.
 *
 * `stage` picks how far along the building is shown at the top of the page
 * (see src/scene/stages.ts). `timeline` is hidden while it is empty.
 *
 * TODO(client): read each "included" list and the answers, and correct
 * anything that does not match how you work. Add a typical timeline only if
 * you are comfortable publishing one.
 */
export type ServiceStage =
  | "plan"
  | "massing"
  | "structure"
  | "finished"
  | "commercial"
  | "handover";

export type Service = {
  slug: string;
  /** Short name for menus and cards. */
  name: L;
  /** Page heading, written for local search. */
  title: L;
  /** One line for cards and search results. */
  summary: L;
  intro: L[];
  included: L[];
  steps: { title: L; body: L }[];
  youProvide: L[];
  /** Empty = the timeline block is not shown. */
  timeline: L | null;
  faqs: { q: L; a: L }[];
  stage: ServiceStage;
  /** Opening line of the WhatsApp message sent from this page. */
  whatsapp: L;
  cta: L;
};

export const services: Service[] = [
  {
    slug: "house-construction-pondicherry",
    name: en("Residential construction"),
    title: en("House construction in Pondicherry"),
    summary: en("Custom homes, villas and apartments, built from foundation to finishing."),
    intro: [
      en("We build custom homes, villas and apartment buildings in and around Pondicherry. You bring the plot and what your family needs. We plan it with you, draw it, and build it."),
      en("If Vastu matters to you, it is part of the plan from the first drawing, not something fitted in afterwards."),
    ],
    included: [
      en("Custom homes, villas and apartment buildings"),
      en("2D plans and 3D views, so you see the house before work starts"),
      en("Vastu-compliant planning, if you want it"),
      en("Construction from foundation to finishing by one team"),
    ],
    steps: [
      { title: en("Talk"), body: en("Tell us about your plot, your family and your budget.") },
      { title: en("Site visit"), body: en("We see the plot and check the soil before anything is drawn.") },
      { title: en("Design"), body: en("Plans and 3D views, revised with you until the layout is right.") },
      { title: en("Approval and agreement"), body: en("Building plan approval, then a written agreement and bill of quantities.") },
      { title: en("Build and hand over"), body: en("Foundation, structure, walls and finishing, checked at each stage.") },
    ],
    youProvide: [
      en("Your land documents and a plot sketch with measurements"),
      en("How many bedrooms and floors you want"),
      en("Any approved plan or drawings you already have"),
      en("A rough budget, even if it is only a range"),
    ],
    timeline: null,
    faqs: [
      {
        q: en("How much does it cost to build a house in Pondicherry?"),
        a: en("It depends on the built-up area, the number of floors, the soil and the finish you choose. Send us your details on the estimate page and we will give you a quote after a site visit."),
      },
      {
        q: en("Can I see my house before it is built?"),
        a: en("Yes. We prepare 2D floor plans and 3D views, so you can check the layout and the look, and ask for changes, before construction starts."),
      },
      {
        q: en("Do I need an approved plan before construction starts?"),
        a: en("Yes. Work can begin only after the building plan is approved by the local planning authority. If you already have an approved plan, share it with us. If not, planning and approval come first."),
      },
      {
        q: en("Can the house follow Vastu?"),
        a: en("Yes. Tell us at the start and the plan is drawn around it: which way the plot faces, where the entrance goes, and where each room sits."),
      },
    ],
    stage: "structure",
    whatsapp: en("Hello, I would like to build a house."),
    cta: en("Ask about your house on WhatsApp"),
  },
  {
    slug: "commercial-construction-pondicherry",
    name: en("Commercial construction"),
    title: en("Commercial construction in Pondicherry"),
    summary: en("Offices, retail spaces, showrooms and commercial complexes."),
    intro: [
      en("We build offices, retail spaces, showrooms and commercial complexes. A commercial building has to earn its keep, so we start with how you will use it: frontage, parking, floor loads, and how customers and staff move through it."),
    ],
    included: [
      en("Offices, retail spaces, showrooms and commercial complexes"),
      en("Planning around frontage, access and how the space will be used"),
      en("2D plans and 3D views before construction starts"),
      en("Construction from foundation to finishing by one team"),
    ],
    steps: [
      { title: en("Talk"), body: en("Tell us what the building is for and what you need from it.") },
      { title: en("Site visit"), body: en("We study the plot, the road and the soil.") },
      { title: en("Design"), body: en("Layouts and 3D views for the use you have in mind.") },
      { title: en("Approval and agreement"), body: en("Building plan approval, then a written agreement and bill of quantities.") },
      { title: en("Build and hand over"), body: en("Structure, walls, services and finishing, checked at each stage.") },
    ],
    youProvide: [
      en("Your land documents and a plot sketch with measurements"),
      en("What the building will be used for"),
      en("The floor area or number of floors you have in mind"),
      en("A rough budget and when you need to open"),
    ],
    timeline: null,
    faqs: [
      {
        q: en("What kinds of commercial buildings do you take on?"),
        a: en("Offices, retail spaces, showrooms and commercial complexes. If yours is something else, send us the details and we will tell you honestly whether it suits us."),
      },
      {
        q: en("Can Vastu be applied to a shop or an office?"),
        a: en("Yes. Entrance, cash counter and owner's seat are the usual questions. We look at them while planning, when they are easy to get right."),
      },
      {
        q: en("How do I get a quote?"),
        a: en("Share the plot size, the number of floors and the use on the estimate page or on WhatsApp. We quote after seeing the site."),
      },
    ],
    stage: "commercial",
    whatsapp: en("Hello, I would like to build a commercial building."),
    cta: en("Ask about your building on WhatsApp"),
  },
  {
    slug: "vastu-consultation",
    name: en("Vastu consultation"),
    title: en("Vastu consultation in Pondicherry"),
    summary: en("Vastu-compliant designs for homes and commercial buildings."),
    intro: [
      en("Vastu is about direction: which way the plot faces, where you enter, and where each room sits. It is far easier to get right on paper than after the walls are up, so we bring it in at the planning stage."),
      en("What you see on this site is general guidance. The real plan comes from a consultation about your plot."),
    ],
    included: [
      en("A look at your plot: its shape, its facing and the road"),
      en("Placement of the entrance, kitchen, pooja room and bedrooms"),
      en("Vastu-compliant designs drawn into the building plan"),
      en("Vastu for both homes and commercial buildings"),
    ],
    steps: [
      { title: en("Tell us about the plot"), body: en("Which way it faces, its measurements, and what you want to build.") },
      { title: en("Consultation"), body: en("We go through entrance, room placement and anything you are unsure about.") },
      { title: en("Into the plan"), body: en("The agreed placements are drawn into your 2D plan.") },
    ],
    youProvide: [
      en("A plot sketch with measurements and the direction of north"),
      en("Which side the road is on"),
      en("Any existing plan you would like checked"),
    ],
    timeline: null,
    faqs: [
      {
        q: en("Which facing is best for a house?"),
        a: en("North and east facing plots are the ones people ask for most, but a house can be planned well on a plot facing any direction. What matters is where the entrance and rooms are placed."),
      },
      {
        q: en("Where should the kitchen and pooja room go?"),
        a: en("By tradition the pooja room sits in the north-east and the kitchen in the south-east. Your plot may call for something different, which is what the consultation is for."),
      },
      {
        q: en("Is Vastu only for new buildings?"),
        a: en("It is simplest when planning a new building. In an existing building the choices are narrower. Tell us what you have and we will say what is practical."),
      },
    ],
    stage: "plan",
    whatsapp: en("Hello, I would like a Vastu consultation."),
    cta: en("Ask about Vastu on WhatsApp"),
  },
  {
    slug: "architectural-planning",
    name: en("Architectural planning"),
    title: en("Architectural planning: 2D and 3D designs"),
    summary: en("2D plans and 3D views drawn to your vision and your budget."),
    intro: [
      en("Before a single brick is laid, the building should already make sense on paper. We draw 2D plans and 3D views to your vision and your budget, so you can see where every room goes and how the building will look from the road."),
    ],
    included: [
      en("2D floor plans for every floor"),
      en("3D views of the building"),
      en("Designs shaped by your budget, not just your wish list"),
      en("Vastu-compliant layouts, if you want them"),
    ],
    steps: [
      { title: en("Brief"), body: en("You tell us what you need and what you can spend.") },
      { title: en("Site visit"), body: en("We measure and look at the plot, the road and the neighbours.") },
      { title: en("2D plan"), body: en("Room layouts for each floor, revised with you.") },
      { title: en("3D view"), body: en("The building as it will look, so you can decide with confidence.") },
    ],
    youProvide: [
      en("A plot sketch with measurements"),
      en("A list of rooms and anything you feel strongly about"),
      en("Photos or references of buildings you like"),
      en("A rough budget"),
    ],
    timeline: null,
    faqs: [
      {
        q: en("What is the difference between a 2D plan and a 3D view?"),
        a: en("A 2D plan is the layout seen from above: rooms, doors, sizes. A 3D view shows the building as it will look when built. You need the first to build and the second to decide."),
      },
      {
        q: en("Can I ask for changes?"),
        a: en("Yes. Changing a line on paper costs very little. Changing a wall on site does not. This is the stage to ask."),
      },
      {
        q: en("Can you design to a fixed budget?"),
        a: en("Yes. Tell us the figure at the start and the design is shaped around it."),
      },
    ],
    stage: "massing",
    whatsapp: en("Hello, I would like 2D and 3D plans for my building."),
    cta: en("Ask about plans on WhatsApp"),
  },
  {
    slug: "renovation-remodeling",
    name: en("Renovation and remodeling"),
    title: en("Renovation and remodeling in Pondicherry"),
    summary: en("Repair, rework or extend the building you already have."),
    intro: [
      en("Not every project starts with an empty plot. If your house or shop is showing its age, or no longer fits the way you live or work, we renovate and remodel existing buildings."),
      en("We look at the building first and tell you plainly what is worth repairing and what is better rebuilt."),
    ],
    included: [
      en("Renovation of existing homes and commercial buildings"),
      en("Remodeling: changing layouts to suit how you use the space now"),
      en("A visit and assessment before any quote"),
      en("Finishing work to match the rest of the building"),
    ],
    steps: [
      { title: en("Tell us what is wrong"), body: en("Photos on WhatsApp are a good start.") },
      { title: en("Visit"), body: en("We look at the structure and what you want changed.") },
      { title: en("Scope and quote"), body: en("A written list of the work and what it will cost.") },
      { title: en("Work and hand over"), body: en("Carried out in an agreed order, checked before we leave.") },
    ],
    youProvide: [
      en("Photos of the areas you want changed"),
      en("The age of the building, if you know it"),
      en("Any old plans or drawings"),
      en("What you want it to be like when it is done"),
    ],
    timeline: null,
    faqs: [
      {
        q: en("Can we stay in the house while the work goes on?"),
        a: en("Sometimes. It depends on what is being changed. We will tell you after seeing the house."),
      },
      {
        q: en("Should I renovate or rebuild?"),
        a: en("It depends on the condition of the structure. We look at it first and give you an honest answer either way."),
      },
      {
        q: en("Do you take on small jobs?"),
        a: en("Send us the details on WhatsApp. If it is not a fit for us, we will say so quickly."),
      },
    ],
    stage: "finished",
    whatsapp: en("Hello, I would like to renovate a building."),
    cta: en("Ask about renovation on WhatsApp"),
  },
  {
    slug: "turnkey-construction",
    name: en("Turnkey projects"),
    title: en("Turnkey construction: foundation to finishing"),
    summary: en("One team takes the project from foundation to finishing and hands you the key."),
    intro: [
      en("Turnkey means you deal with one team from the first drawing to the day you get the key. Planning, structure, walls and finishing are all ours to deliver, so there is no gap between one contractor's work and the next."),
    ],
    included: [
      en("Planning: 2D plans and 3D views"),
      en("Foundation and structure"),
      en("Walls and finishing"),
      en("One team and one point of contact throughout"),
    ],
    steps: [
      { title: en("Talk and site visit"), body: en("Your needs, your plot, your budget.") },
      { title: en("Design and approval"), body: en("Plans, Vastu if you want it, and building plan approval.") },
      { title: en("Agreement"), body: en("A written agreement and bill of quantities before work starts.") },
      { title: en("Build"), body: en("Foundation to finishing, with checks at each stage.") },
      { title: en("Handover"), body: en("A finished building and the key.") },
    ],
    youProvide: [
      en("Your land documents and a plot sketch with measurements"),
      en("What you want built and roughly how big"),
      en("A budget range"),
      en("Decisions at each stage, when we ask for them"),
    ],
    timeline: null,
    faqs: [
      {
        q: en("What does turnkey include?"),
        a: en("The whole build, from foundation to finishing. The exact list is written into the agreement and bill of quantities, so you know what is covered before work starts."),
      },
      {
        q: en("Is turnkey right for me if I live outside Pondicherry?"),
        a: en("It suits anyone who cannot be on site every day, because one team is answerable for the whole job."),
      },
      {
        q: en("How do I start?"),
        a: en("Send us your plot details on WhatsApp or through the Plan your build form."),
      },
    ],
    stage: "handover",
    whatsapp: en("Hello, I am interested in a turnkey project."),
    cta: en("Ask about turnkey on WhatsApp"),
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
