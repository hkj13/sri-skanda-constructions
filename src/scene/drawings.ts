/**
 * Still drawings of the building, pre-rendered to SVG files in
 * public/drawings by scripts/export-drawings.tsx (run automatically before
 * every build). Loading them as images keeps the pages light: the same
 * drawing inline would add hundreds of elements to the page.
 */
export type DrawingName =
  | "massing"
  | "structure"
  | "home"
  | "commercial"
  | "home-lit"
  | "finished-lit";

export const DRAWINGS: Record<DrawingName, { g: number; variant: "home" | "commercial"; lit?: boolean; door?: boolean; alt: string }> = {
  massing: { g: 3, variant: "home", alt: "A white massing model of a three-storey house on its plot." },
  structure: { g: 5, variant: "home", alt: "The concrete frame of a house: columns and three floor slabs." },
  home: { g: 6.5, variant: "home", alt: "A finished three-storey family home with a terrace." },
  commercial: { g: 6.5, variant: "commercial", alt: "A four-storey commercial block with shopfronts at street level." },
  "home-lit": { g: 8.99, variant: "home", lit: true, door: true, alt: "The finished house at dusk, door open and windows lit." },
  "finished-lit": { g: 10.9, variant: "home", lit: true, door: true, alt: "The finished house, lit, with solar panels on the roof and a garden on the terrace." },
};

export const DRAWING_SIZE = { width: 800, height: 720 };
