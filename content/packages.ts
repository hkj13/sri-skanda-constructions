import type { L } from "./i18n";

/**
 * Construction packages (for example Standard, Premium, Luxury).
 *
 * The Packages page and its menu link appear only when this list has at
 * least one entry. No prices or brand names are invented: fill in only what
 * the company really offers.
 *
 * Example:
 *   {
 *     slug: "standard",
 *     name: { en: "Standard" },
 *     summary: { en: "One honest sentence about who this package suits." },
 *     price: { en: "Rs. 0,000 per sq ft" },   // leave out to hide the price
 *     specs: [
 *       { item: "structure", detail: { en: "..." } },
 *       { item: "flooring", detail: { en: "..." } },
 *     ],
 *   }
 */
export type SpecItem =
  | "structure"
  | "flooring"
  | "doorsWindows"
  | "electrical"
  | "plumbing"
  | "paint";

export const SPEC_LABELS: Record<SpecItem, L> = {
  structure: { en: "Structure" },
  flooring: { en: "Flooring" },
  doorsWindows: { en: "Doors and windows" },
  electrical: { en: "Electrical" },
  plumbing: { en: "Plumbing" },
  paint: { en: "Paint" },
};

export type Package = {
  slug: string;
  name: L;
  summary: L;
  price?: L;
  specs: { item: SpecItem; detail: L }[];
};

// TODO(client): add packages if the company offers them.
export const packages: Package[] = [];
