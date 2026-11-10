/**
 * Language support for the content files.
 *
 * Every piece of visitor-facing text is written as `{ en: "..." }`.
 * To add Tamil later, add a `ta` line beside each `en` line and add "ta" to
 * LOCALES. Nothing else in the content files needs to move.
 * Do not machine-translate: have the Tamil written by a person.
 */

export const LOCALES = ["en"] as const;
export type Locale = "en" | "ta";
export const DEFAULT_LOCALE: Locale = "en";

/** A piece of text in each supported language. English is required. */
export type L = { en: string; ta?: string };

/** Shorthand for English-only text. */
export const en = (text: string): L => ({ en: text });

/** Picks the text for a language, falling back to English. */
export function tr(text: L, locale: Locale = DEFAULT_LOCALE): string {
  return text[locale] ?? text.en;
}
