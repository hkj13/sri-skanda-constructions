import type { Metadata } from "next";
import { fullAddress, site } from "@content/site";
import { services } from "@content/services";
import { tr } from "@content/i18n";

export const OG_IMAGE = {
  url: "/brand/og/og-default.png",
  width: 1200,
  height: 630,
  alt: "Sri Skanda Constructions: homes and commercial buildings, by builders from Pondicherry",
};

/** Metadata for one page: title, description, canonical URL and share card. */
export function pageMeta({
  title,
  description,
  path,
  index = true,
  image,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  /** File name in public/brand/og, without .png. Defaults to the general image. */
  image?: string;
}): Metadata {
  const img = image ? { ...OG_IMAGE, url: `/brand/og/${image}.png`, alt: title } : OG_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: index ? undefined : { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_IN",
      url: path,
      title,
      description,
      images: [img],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [img.url],
    },
  };
}

/** Schema.org description of the business, read from content/site.ts. */
export function businessJsonLd() {
  const a = site.address;
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: site.url,
    image: `${site.url}${OG_IMAGE.url}`,
    logo: `${site.url}/brand/png/mark.png`,
    telephone: site.phone.e164,
    ...(site.email ? { email: site.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${a.street}, ${a.area}, ${a.locality}`,
      addressLocality: a.city,
      addressRegion: "Puducherry",
      postalCode: a.postalCode,
      addressCountry: a.countryCode,
    },
    ...(site.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: site.geo.lat,
            longitude: site.geo.lng,
          },
        }
      : {}),
    ...(site.openingHours.length
      ? {
          openingHoursSpecification: site.openingHours.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes,
          })),
        }
      : {}),
    ...(site.areaServed.length ? { areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })) } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Construction services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: tr(s.name),
          description: tr(s.summary),
          url: `${site.url}/services/${s.slug}`,
          ...(site.areaServed.length ? { areaServed: site.areaServed } : {}),
          provider: { "@id": `${site.url}/#business` },
        },
      })),
    },
  };
}

export function serviceJsonLd(slug: string) {
  const s = services.find((x) => x.slug === slug);
  if (!s) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: tr(s.title),
    description: tr(s.summary),
    url: `${site.url}/services/${s.slug}`,
    serviceType: tr(s.name),
    ...(site.areaServed.length ? { areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })) } : {}),
    provider: { "@id": `${site.url}/#business`, "@type": "GeneralContractor", name: site.name, address: fullAddress() },
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Serialises JSON-LD safely for a <script> tag. */
export function ldScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
