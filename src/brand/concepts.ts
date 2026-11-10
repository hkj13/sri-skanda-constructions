import type { WordmarkWeight } from "./jost-glyphs";

/**
 * The four logo concept directions under review at /brand-lab.
 *
 * Every mark is drawn on a 64 x 64 grid. Key edges sit on whole or half
 * units so the shapes stay crisp at 16 px, and nothing is thinner than
 * 3 units (about 5% of the mark height), which survives paint, embroidery
 * and small print.
 */

export const NAVY = "#1a2340";
export const NAVY_2 = "#2a3660";
export const LIME = "#d8f060";
export const WHITE = "#ffffff";

export type ConceptId = "a" | "b" | "c" | "d";

export type Ink = "navy" | "white" | "lime" | "current";

export type Shape = {
  d: string;
  /** "current" takes the CSS colour of the element (one-colour artwork). */
  ink: Ink;
  /** Stroke width in grid units. Omit for a filled shape. */
  stroke?: number;
  evenodd?: boolean;
  /** Optional SVG transform, used to enlarge a mark that drops its tile. */
  transform?: string;
};

export type Concept = {
  id: ConceptId;
  letter: string;
  name: string;
  idea: string;
  carries: string[];
  watchFor: string;
  /** Artwork for white and for lime grounds. Lime only ever sits on navy. */
  light: Shape[];
  /** Artwork reversed for navy grounds. */
  dark: Shape[];
  /** One-colour artwork: every lime detail becomes a real opening. */
  mono: Shape[];
  /** Artwork for the favicon, drawn on a rounded navy tile. */
  icon: Shape[];
  /** Share of the 64-unit tile the mark fills inside the favicon. */
  iconScale: number;
  wordmark: {
    primary: WordmarkWeight;
    secondary: WordmarkWeight;
    /** Letter spacing of SRI SKANDA, in em. */
    tracking: number;
    /** Cap height of CONSTRUCTIONS relative to SRI SKANDA. */
    ratio: number;
  };
};

/* ── A. Vel and skyline ─────────────────────────────────────────────── */

const A_BLOCK = "M8 13 L32 4 V15 H56 V58 H8 Z";
const A_VEL =
  "M32 20 C34.5 26 41 32.5 41 40 C41 44.5 35 45.5 35 49.5 V58 H29 V49.5 " +
  "C29 45.5 23 44.5 23 40 C23 32.5 29.5 26 32 20 Z";

/* ── B. Structural monogram ─────────────────────────────────────────── */

const B_TILE = "M0 0 H64 V64 H0 Z";
const B_S =
  "M16 8 H48 V21 H40 V16 H24 V28 H48 V56 H16 V43 H24 V48 H40 V36 H16 Z";
const B_COLUMNS = "M16 16 H24 V28 H16 Z M40 36 H48 V48 H40 Z";
// On navy the board is the background itself, so the S grows to fill it.
const B_GROW = "translate(32 32) scale(1.3333) translate(-32 -32)";

/* ── C. Hexagonal plan ──────────────────────────────────────────────── */

// Regular hexagon, radius 28, centred on (32, 32). Isometric edges run at
// 30 degrees: 0.5774 units of rise per unit of run.
const C_ROOF =
  "M32 4 L56.25 18 L32 32 L7.75 18 Z M32 9.2 L16.75 18 L32 26.8 L47.25 18 Z";
const C_WALLS_UPPER =
  "M7.75 21.5 L30.5 34.64 V44.14 L7.75 31 Z " +
  "M56.25 21.5 L33.5 34.64 V44.14 L56.25 31 Z";
// Below the level line. The gap in the right-hand wall is the doorway.
const C_WALLS_LOWER =
  "M7.75 35 L30.5 48.14 V59.14 L7.75 46 Z " +
  "M33.5 48.14 L39 44.96 V55.96 L33.5 59.14 Z " +
  "M47 40.34 L56.25 35 V46 L47 51.34 Z";
// Favicon cut: no doorway, so the block stays clean at 16 px.
const C_WALLS_LOWER_PLAIN =
  "M7.75 35 L30.5 48.14 V59.14 L7.75 46 Z " +
  "M56.25 35 L33.5 48.14 V59.14 L56.25 46 Z";
const C_LEVEL = "M7.75 31 L32 45 L56.25 31 V35 L32 49 L7.75 35 Z";

/* ── D. Blueprint mark ──────────────────────────────────────────────── */

const D_ROOFLINE = "M10 50 V30 L32 9 A22 22 0 0 1 54 31 V50";
const D_FOUNDATION = "M3 57.5 H61";

export const CONCEPTS: Concept[] = [
  {
    id: "a",
    letter: "A",
    name: "Vel and skyline",
    idea:
      "A house with a pitched roof and a taller flat-roofed block stand side by side. The space between them is the leaf-shaped head of a Vel, rising from the ground like a lit doorway.",
    carries: [
      "Skanda, quietly: the Vel is there for those who know it, and reads as a doorway or a leaf for those who do not.",
      "Residential and commercial in one silhouette: pitched roof beside flat roof.",
      "A solid block with one opening, so it stencils onto a hoarding or stitches onto a uniform easily. On navy the block turns lime and the Vel is cut out of it.",
    ],
    watchFor:
      "The spearhead can read as a leaf or a flame at first glance. That suits the sustainable positioning, but it is the least literal of the four about construction.",
    light: [
      { d: A_BLOCK, ink: "navy" },
      { d: A_VEL, ink: "lime" },
    ],
    dark: [{ d: `${A_BLOCK} ${A_VEL}`, ink: "lime", evenodd: true }],
    mono: [{ d: `${A_BLOCK} ${A_VEL}`, ink: "current", evenodd: true }],
    icon: [{ d: `${A_BLOCK} ${A_VEL}`, ink: "lime", evenodd: true }],
    iconScale: 0.8,
    wordmark: { primary: 500, secondary: 400, tracking: 0.06, ratio: 0.46 },
  },
  {
    id: "b",
    letter: "B",
    name: "Structural monogram",
    idea:
      "An S built the way a frame is built: three floor slabs carried on two columns, set on a strict 8-unit grid inside a square site board.",
    carries: [
      "The initial of Sri Skanda, made from slab and column.",
      "The strongest of the four at very small sizes. The square board is already a favicon and a WhatsApp picture.",
      "Lime columns on navy use the palette the way a hi-vis vest does on site. On navy grounds the board is the background, so the S grows to fill the space.",
    ],
    watchFor:
      "It is the most conventional idea: a letter in a square. Its character comes from the columns being picked out in lime, so the one-colour version is plainer.",
    light: [
      { d: B_TILE, ink: "navy" },
      { d: B_S, ink: "white" },
      { d: B_COLUMNS, ink: "lime" },
    ],
    dark: [
      { d: B_S, ink: "white", transform: B_GROW },
      { d: B_COLUMNS, ink: "lime", transform: B_GROW },
    ],
    mono: [{ d: `${B_TILE} ${B_S}`, ink: "current", evenodd: true }],
    icon: [
      { d: B_S, ink: "white" },
      { d: B_COLUMNS, ink: "lime" },
    ],
    iconScale: 1,
    wordmark: { primary: 700, secondary: 500, tracking: 0.05, ratio: 0.46 },
  },
  {
    id: "c",
    letter: "C",
    name: "Hexagonal plan",
    idea:
      "A hexagon that is also a building seen from the corner: an open terrace on top, two walls, a doorway, and a lime line wrapping both walls at lintel height like a laser level.",
    carries: [
      "Six sides for Shanmukha, the six-faced, with no religious imagery.",
      "Plan and building in one figure: the roof is drawn as an outline, the walls as solid mass.",
      "The lime level line is the same motif the site uses for scroll progress and page transitions. On navy, everything below the line turns lime instead.",
    ],
    watchFor:
      "Isometric blocks are common in logos generally. The open terrace, doorway and level line are what make this one a building rather than a box. It has the most parts of the four, so the favicon uses a simpler cut without the doorway.",
    light: [
      { d: C_ROOF, ink: "navy", evenodd: true },
      { d: `${C_WALLS_UPPER} ${C_WALLS_LOWER}`, ink: "navy" },
      { d: C_LEVEL, ink: "lime" },
    ],
    // On navy the level line is the gap, and everything below it turns lime,
    // so lime never has to sit against white.
    dark: [
      { d: C_ROOF, ink: "white", evenodd: true },
      { d: C_WALLS_UPPER, ink: "white" },
      { d: C_WALLS_LOWER, ink: "lime" },
    ],
    mono: [
      { d: C_ROOF, ink: "current", evenodd: true },
      { d: `${C_WALLS_UPPER} ${C_WALLS_LOWER}`, ink: "current" },
    ],
    icon: [
      { d: C_ROOF, ink: "white", evenodd: true },
      { d: C_WALLS_UPPER, ink: "white" },
      { d: C_WALLS_LOWER_PLAIN, ink: "lime" },
    ],
    iconScale: 0.82,
    wordmark: { primary: 600, secondary: 400, tracking: 0.06, ratio: 0.46 },
  },
  {
    id: "d",
    letter: "D",
    name: "Blueprint mark",
    idea:
      "One line, one weight, drawn like a blueprint: a wall rises, becomes a pitched roof, then turns into an arch and comes back down. A longer foundation line runs beneath.",
    carries: [
      "Home and commercial in a single stroke: the pitch of a house roof on one side, the arch of a shopfront or portico on the other.",
      "The foundation line is the laser level: lime on navy, and it can extend to underline the name.",
      "No religious reference. Light, modern, and closest in spirit to Jost itself.",
    ],
    watchFor:
      "Line marks are the most delicate. At 16 px it needs the heavier favicon cut shown here, and on a hoarding the stroke must never be drawn thinner than the minimum.",
    light: [
      { d: D_ROOFLINE, ink: "navy", stroke: 4.5 },
      { d: D_FOUNDATION, ink: "navy", stroke: 4.5 },
    ],
    dark: [
      { d: D_ROOFLINE, ink: "white", stroke: 4.5 },
      { d: D_FOUNDATION, ink: "lime", stroke: 4.5 },
    ],
    mono: [
      { d: D_ROOFLINE, ink: "current", stroke: 4.5 },
      { d: D_FOUNDATION, ink: "current", stroke: 4.5 },
    ],
    // Heavier cut so the line holds at 16 px.
    icon: [
      { d: D_ROOFLINE, ink: "white", stroke: 6.5 },
      { d: D_FOUNDATION, ink: "lime", stroke: 6.5 },
    ],
    iconScale: 0.78,
    wordmark: { primary: 400, secondary: 400, tracking: 0.08, ratio: 0.46 },
  },
];

export function getConcept(id: ConceptId): Concept {
  const concept = CONCEPTS.find((c) => c.id === id);
  if (!concept) throw new Error(`Unknown logo concept: ${id}`);
  return concept;
}
