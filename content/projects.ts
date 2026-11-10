import type { L } from "./i18n";

/**
 * Ongoing and completed projects.
 *
 * The Projects page and its menu link appear only when this list has at
 * least one entry. Add real projects only: real photos, real sizes.
 *
 * Photos go in public/projects/<slug>/ and are listed by file name.
 *
 * Example:
 *   {
 *     slug: "villa-in-pondicherry",
 *     title: { en: "Four-bedroom villa" },
 *     type: "residential",
 *     location: { en: "Pondicherry" },
 *     size: { en: "2,400 sq ft, G+1" },
 *     status: "completed",
 *     photos: [{ src: "/projects/villa-in-pondicherry/front.jpg", alt: { en: "Front of the finished villa" }, width: 1600, height: 1067 }],
 *     story: { en: "A short, true paragraph about the project." },
 *   }
 */
export type ProjectPhoto = { src: string; alt: L; width: number; height: number };

export type Project = {
  slug: string;
  title: L;
  type: "residential" | "commercial" | "renovation";
  location: L;
  size?: L;
  status: "ongoing" | "completed";
  photos: ProjectPhoto[];
  story: L;
  /** Optional before and after pair, shown with a drag slider. */
  beforeAfter?: { before: ProjectPhoto; after: ProjectPhoto };
  /** Set to true only for apartment or plotted projects offered for sale. */
  forSale?: boolean;
};

// TODO(client): add real projects.
export const projects: Project[] = [];
