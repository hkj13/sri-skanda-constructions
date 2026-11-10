import type { WordmarkWeight } from "./jost-glyphs";

/**
 * Sri Skanda Constructions logo artwork.
 *
 * The mark: a pitched-roof house and a taller flat-roofed block stand side
 * by side. The space between them is the leaf-shaped head of a Vel, rising
 * from the ground like a lit doorway.
 *
 * It is drawn on a 64 x 64 grid. Every straight edge sits on a multiple of
 * 4 units, so the outline lands on whole pixels at 16 px, and nothing is
 * thinner than 6 units, which survives paint, embroidery and small print.
 */

export const NAVY = "#1a2340";
export const NAVY_2 = "#2a3660";
export const LIME = "#d8f060";
export const WHITE = "#ffffff";

export type Ink = "navy" | "white" | "lime" | "current";

export type Shape = {
  d: string;
  /** "current" takes the CSS colour of the element (one-colour artwork). */
  ink: Ink;
  evenodd?: boolean;
  transform?: string;
};

/** House (pitched roof, left) and block (flat roof, right) as one silhouette. */
export const BLOCK = "M8 12 L32 4 V16 H56 V60 H8 Z";

/** The Vel: spearhead above, shaft running down to the ground line. */
export const VEL =
  "M32 20 C33.5 27 41.5 34 41.5 42.5 C41.5 47 35 47.5 35 52 V60 H29 V52 " +
  "C29 47.5 22.5 47 22.5 42.5 C22.5 34 30.5 27 32 20 Z";

const BLOCK_WITH_OPENING = `${BLOCK} ${VEL}`;

/** Side of the square the mark is drawn in. */
export const MARK_SIZE = 64;

/** The part of that square the artwork actually covers. */
export const MARK_INK = { x: 8, y: 4, width: 48, height: 56 };

export const MARK: Record<"light" | "dark" | "mono", Shape[]> = {
  // White and lime grounds: navy buildings, lime Vel. The lime is enclosed
  // by navy, so it never has to sit against white.
  light: [
    { d: BLOCK, ink: "navy" },
    { d: VEL, ink: "lime" },
  ],
  // Navy grounds: the buildings turn lime and the Vel is cut out of them.
  dark: [{ d: BLOCK_WITH_OPENING, ink: "lime", evenodd: true }],
  // One colour: the Vel is a real opening.
  mono: [{ d: BLOCK_WITH_OPENING, ink: "current", evenodd: true }],
};

/** Rounded navy tile behind the favicon and app icons. */
export const ICON_TILE =
  "M14 0 H50 A14 14 0 0 1 64 14 V50 A14 14 0 0 1 50 64 H14 A14 14 0 0 1 0 50 V14 A14 14 0 0 1 14 0 Z";

/** How much of the tile the mark fills in the favicon. */
export const ICON_SCALE = 0.86;

export const WORDMARK: {
  primary: WordmarkWeight;
  secondary: WordmarkWeight;
  tracking: number;
  ratio: number;
  gap: number;
} = {
  /** SRI SKANDA: Jost Medium. */
  primary: 500,
  /** CONSTRUCTIONS: Jost Regular, tracked out to the width of the line above. */
  secondary: 400,
  /** Letter spacing of SRI SKANDA, in em. */
  tracking: 0.06,
  /** Cap height of CONSTRUCTIONS relative to SRI SKANDA. */
  ratio: 0.5,
  /** Space between the two lines, relative to the cap height of SRI SKANDA. */
  gap: 1 / 3,
};
