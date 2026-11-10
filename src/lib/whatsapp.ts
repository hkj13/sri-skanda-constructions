import { site, whatsappUrl } from "@content/site";

/** One labelled answer in an enquiry. Empty values are left out. */
export type EnquiryRow = [label: string, value: string | undefined | null];

/**
 * Lays an enquiry out as a short WhatsApp message:
 * a bold title, then one "Label: value" line per answer.
 */
export function formatEnquiry(
  title: string,
  rows: EnquiryRow[],
  closing?: string,
): string {
  const lines = rows
    .filter(([, value]) => value && value.trim())
    .map(([label, value]) => `${label}: ${value!.trim()}`);
  return [`*${title}*`, ...lines, closing ? `\n${closing}` : ""]
    .filter(Boolean)
    .join("\n");
}

export function enquiryLink(title: string, rows: EnquiryRow[], closing?: string) {
  return whatsappUrl(formatEnquiry(title, rows, closing));
}

export const telLink = `tel:${site.phone.e164}`;
