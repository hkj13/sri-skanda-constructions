import { en, type L } from "./i18n";

/**
 * Words for the home page story: one building, built as you scroll.
 *
 * Hero headline options (swap `hero.headline` for any of these):
 *   "From the first stake to the house key."   (current)
 *   "Building Your Dreams"                      (the original headline)
 *   "Your plot, built right. Foundation to finishing."
 *   "Homes and businesses, built right. Based in Pondicherry."
 */
export const hero = {
  eyebrow: en("Saram, Pondicherry"),
  headline: en("From the first stake to the house key."),
  sub: en(
    "Residential and commercial builders in Pondicherry and Hyderabad. Planned with Vastu, built by one team from foundation to finishing.",
  ),
  skip: en("Skip the story"),
};

export type ChapterId =
  | "groundbreaking"
  | "vastu"
  | "planning"
  | "foundation"
  | "structure"
  | "finishing"
  | "types"
  | "renovation"
  | "handover"
  | "sustainable"
  | "start";

export type ChapterCopy = {
  id: ChapterId;
  /** Short name in the chapter index. */
  nav: L;
  eyebrow: L;
  headline: L;
  body: L;
  /** Drawing sheet number and title shown in the corner title block. */
  sheet: string;
  drawing: string;
  scale: string;
  /** Service page this chapter links to, if any. */
  service?: string;
};

export const chapters: ChapterCopy[] = [
  {
    id: "groundbreaking",
    nav: en("Groundbreaking"),
    eyebrow: hero.eyebrow,
    headline: hero.headline,
    body: hero.sub,
    sheet: "A-000",
    drawing: "SITE",
    scale: "1:200",
  },
  {
    id: "vastu",
    nav: en("Vastu and planning"),
    eyebrow: en("Vastu and planning"),
    headline: en("Every room where it belongs."),
    body: en(
      "Vastu starts with direction. Tell us which way your plot faces and see how the entrance and rooms find their places.",
    ),
    sheet: "A-101",
    drawing: "VASTU PLAN",
    scale: "1:100",
    service: "vastu-consultation",
  },
  {
    id: "planning",
    nav: en("Architectural planning"),
    eyebrow: en("Architectural planning"),
    headline: en("See it before it is built."),
    body: en(
      "2D plans show where every room goes. 3D views show how it will look from the road. Both are drawn to your vision and your budget.",
    ),
    sheet: "A-102",
    drawing: "MASSING",
    scale: "1:200",
    service: "architectural-planning",
  },
  {
    id: "foundation",
    nav: en("Foundation"),
    eyebrow: en("Foundation"),
    headline: en("What holds it all up."),
    body: en(
      "You will never see it again once the house is built, so it has to be right the first time: soil tested, steel checked, concrete poured and cured.",
    ),
    sheet: "S-201",
    drawing: "FOOTING",
    scale: "1:25",
  },
  {
    id: "structure",
    nav: en("Structure"),
    eyebrow: en("Structure"),
    headline: en("Floor by floor."),
    body: en(
      "Columns rise, a slab is cast, and the next floor begins. Each stage is checked before the next one starts.",
    ),
    sheet: "S-301",
    drawing: "FRAME",
    scale: "1:100",
    service: "house-construction-pondicherry",
  },
  {
    id: "finishing",
    nav: en("Walls and finishing"),
    eyebrow: en("Walls and finishing"),
    headline: en("Brick, plaster, paint, light."),
    body: en(
      "Brick courses go up row by row. Plaster smooths them over, paint follows, and the windows go in. The finishing is our work too.",
    ),
    sheet: "A-401",
    drawing: "ELEVATION",
    scale: "1:50",
  },
  {
    id: "types",
    nav: en("Homes and commercial"),
    eyebrow: en("Homes and commercial"),
    headline: en("One plot. Your building."),
    body: en("A family home or a place of business: the same team builds both."),
    sheet: "A-501",
    drawing: "BUILDING TYPE",
    scale: "1:200",
  },
  {
    id: "renovation",
    nav: en("Renovation"),
    eyebrow: en("Renovation and remodeling"),
    headline: en("Make the old house new."),
    body: en(
      "Cracks, damp, tired finishes, or a layout that no longer suits you. We look at the building first and tell you what is worth doing.",
    ),
    sheet: "A-601",
    drawing: "BEFORE / AFTER",
    scale: "1:50",
    service: "renovation-remodeling",
  },
  {
    id: "handover",
    nav: en("Turnkey handover"),
    eyebrow: en("Turnkey projects"),
    headline: en("Foundation to finishing."),
    body: en(
      "With a turnkey project you deal with one team from the first drawing to the day the lights come on and the key is yours.",
    ),
    sheet: "A-701",
    drawing: "HANDOVER",
    scale: "1:100",
    service: "turnkey-construction",
  },
  {
    id: "sustainable",
    nav: en("Sustainable building"),
    eyebrow: en("Sustainable building"),
    headline: en("Plan for the sun and the rain."),
    body: en(
      "Rooftop solar, rainwater harvesting and a terrace garden are easiest to add while the building is still on paper. Ask us to plan for them.",
    ),
    sheet: "A-801",
    drawing: "ROOF AND SERVICES",
    scale: "1:100",
  },
  {
    id: "start",
    nav: en("Start your project"),
    eyebrow: en("Start your project"),
    headline: en("Tell us about your plot."),
    body: en(
      "A few details are enough to begin: where the plot is, how big it is, and what you want to build.",
    ),
    sheet: "A-900",
    drawing: "KEY PLAN",
    scale: "NTS",
  },
];

export const handoverNote = en("One team.");

export const typeLists: Record<"home" | "commercial", { label: L; items: L[]; service: string }> = {
  home: {
    label: en("Home"),
    items: [en("Custom homes"), en("Villas"), en("Apartments")],
    service: "house-construction-pondicherry",
  },
  commercial: {
    label: en("Commercial"),
    items: [en("Offices"), en("Retail spaces"), en("Showrooms"), en("Commercial complexes")],
    service: "commercial-construction-pondicherry",
  },
};

/** Labels on the foundation section drawing, top to bottom. */
export const foundationTags = {
  plinth: en("Plinth beam"),
  column: en("Column"),
  footing: en("Footing"),
  pcc: en("PCC bed"),
  soil: en("Tested soil"),
};

export const finishingTags = {
  brick: en("Brick"),
  plaster: en("Plaster"),
  paint: en("Paint"),
  window: en("Window"),
};

export const sustainableTags = {
  solar: en("Rooftop solar"),
  garden: en("Terrace garden"),
  rain: en("Rainwater to sump"),
};

/**
 * Renovation slider. Until real photos exist it shows a drawing, labelled
 * as an illustration. To use real photos, put them in public/images and set
 * `photos` to { before: "/images/your-before.jpg", after: "/images/your-after.jpg" }.
 * TODO(client): supply a real before and after pair.
 */
export const renovation: {
  before: L;
  after: L;
  hint: L;
  illustrationNote: L;
  photos: { before: string; after: string; alt: L } | null;
} = {
  before: en("Before"),
  after: en("After"),
  hint: en("Drag the handle, or use the arrow keys"),
  illustrationNote: en("Illustration, not a real project"),
  photos: null,
};

export type StoryMedia = { caption: L } & (
  | {
      kind: "film";
      /** Clip name in public/videos (name.webm, name.mp4 and the still name.jpg). */
      video: string;
      orientation: "landscape" | "portrait";
    }
  | { kind: "photo"; src: string; alt: L }
);

/**
 * One site film or photograph for every chapter after the opening. On
 * phones it sits straight under the chapter's headline; on wide screens it
 * is pinned beside the drawing where there is room. All of it is stock
 * (see CREDITS.md), and none of it repeats the About page.
 * TODO(client): replace each one with footage or a photo from a real site.
 */
export const storyMedia: Partial<Record<ChapterId, StoryMedia>> = {
  vastu: {
    kind: "photo",
    src: "/images/plan-pencil.jpg",
    alt: en("A pencil resting on a dimensioned building plan"),
    caption: en("Every room is placed on the plan first"),
  },
  planning: {
    kind: "photo",
    src: "/images/plan-drawing.jpg",
    alt: en("Hands drawing a floor plan with a scale rule"),
    caption: en("Drawn and agreed before work starts"),
  },
  foundation: {
    kind: "film",
    video: "construction-site",
    orientation: "landscape",
    caption: en("Steel is tied and checked before the pour"),
  },
  structure: {
    kind: "film",
    video: "iron-worker",
    orientation: "portrait",
    caption: en("Props hold each slab until it can stand on its own"),
  },
  finishing: {
    kind: "photo",
    src: "/images/paint-roller.jpg",
    alt: en("A paint roller laying a band of paint on a white wall"),
    caption: en("Paint goes on last, over finished plaster"),
  },
  types: {
    kind: "photo",
    src: "/images/site-team.jpg",
    alt: en("A site team in helmets standing on a slab, seen from above"),
    caption: en("One site team, whatever the building"),
  },
  renovation: {
    kind: "photo",
    src: "/images/renovation-room.jpg",
    alt: en("A room being renovated, with walls stripped back to brick"),
    caption: en("Old walls opened up, then made good"),
  },
  handover: {
    kind: "photo",
    src: "/images/house-keys.jpg",
    alt: en("A set of keys beside a small model house on a table"),
    caption: en("The day the key is yours"),
  },
  sustainable: {
    kind: "film",
    video: "eco-city",
    orientation: "landscape",
    caption: en("Trees and shade belong in the plan too"),
  },
  start: {
    kind: "film",
    video: "building-landscape",
    orientation: "landscape",
    caption: en("Every building starts with a conversation"),
  },
};
