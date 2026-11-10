import { en, type L } from "./i18n";

/**
 * Cost estimator settings.
 *
 * With `rates` left as null the estimator shows no numbers: it collects the
 * details and sends them on WhatsApp for a free estimate.
 *
 * TODO(client): to show an indicative range, set rates per square foot of
 * built-up area for each finish level, in rupees, for example:
 *
 *   rates: {
 *     standard: { min: 0000, max: 0000 },
 *     premium:  { min: 0000, max: 0000 },
 *     luxury:   { min: 0000, max: 0000 },
 *   }
 *
 * The site then shows "area x rate" as a range, always marked indicative.
 */
export type FinishLevel = "standard" | "premium" | "luxury";
export type RateRange = { min: number; max: number };

export const rates: Record<FinishLevel, RateRange> | null = null;

export const PROJECT_TYPES: { id: string; label: L }[] = [
  { id: "home", label: en("New home") },
  { id: "villa", label: en("Villa") },
  { id: "apartment", label: en("Apartment building") },
  { id: "commercial", label: en("Commercial building") },
  { id: "renovation", label: en("Renovation") },
  { id: "other", label: en("Something else") },
];

export const FINISH_LEVELS: { id: FinishLevel; label: L; note: L }[] = [
  { id: "standard", label: en("Standard"), note: en("Sound and simple") },
  { id: "premium", label: en("Premium"), note: en("Better fittings and finishes") },
  { id: "luxury", label: en("Luxury"), note: en("Top-end finishes throughout") },
];

export const FLOOR_OPTIONS: { id: string; label: L }[] = [
  { id: "G", label: en("Ground only") },
  { id: "G+1", label: en("G+1") },
  { id: "G+2", label: en("G+2") },
  { id: "G+3", label: en("G+3") },
  { id: "G+4 or more", label: en("G+4 or more") },
];

/**
 * Budget choices in the Plan your build form.
 * TODO(client): adjust the bands to match the projects you take on.
 */
export const BUDGET_RANGES: { id: string; label: L }[] = [
  { id: "Under 25 lakh", label: en("Under ₹25 lakh") },
  { id: "25 to 50 lakh", label: en("₹25 to 50 lakh") },
  { id: "50 lakh to 1 crore", label: en("₹50 lakh to 1 crore") },
  { id: "Above 1 crore", label: en("Above ₹1 crore") },
  { id: "Not sure yet", label: en("Not sure yet") },
];

export const TIMELINES: { id: string; label: L }[] = [
  { id: "As soon as possible", label: en("As soon as possible") },
  { id: "Within 3 months", label: en("Within 3 months") },
  { id: "In 3 to 6 months", label: en("In 3 to 6 months") },
  { id: "Later, just planning", label: en("Later, just planning") },
];
