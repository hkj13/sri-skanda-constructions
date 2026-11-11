/**
 * Core business facts for Sri Skanda Constructions.
 *
 * Everything on the site that states a fact about the company reads it from
 * here. Empty strings and empty lists hide the matching piece of the site,
 * so nothing unconfirmed is ever shown.
 */

export type Claim = {
  /** Shown on the site only when true. */
  enabled: boolean;
  text: string;
};

export type OpeningHours = {
  /** Schema.org day names, e.g. ["Monday", "Tuesday"]. */
  days: string[];
  /** 24-hour times, e.g. "09:00". */
  opens: string;
  closes: string;
};

export type SiteConfig = {
  name: string;
  shortName: string;
  url: string;
  address: {
    street: string;
    area: string;
    locality: string;
    city: string;
    postalCode: string;
    country: string;
    countryCode: string;
  };
  /** Latitude and longitude of the office. null = left out of search data. */
  geo: { lat: number; lng: number } | null;
  phone: {
    /** As printed: +91 94880 84277 */
    display: string;
    /** For tel: links */
    e164: string;
    /** For wa.me links (digits only, with country code) */
    whatsapp: string;
  };
  /** Empty = every email link and email mention is hidden site-wide. */
  email: string;
  /**
   * RERA registration number. Required by law if the company advertises
   * apartment or plotted projects for sale. Empty = not shown.
   */
  reraNumber: string;
  /** Empty list = opening hours are not shown or published. */
  openingHours: OpeningHours[];
  /** Places named in search data as the area served. */
  areaServed: string[];
  /** Empty URL = that icon is hidden. */
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  claims: {
    experience: Claim;
    serviceArea: Claim;
  };
};

export const site: SiteConfig = {
  name: "Sri Skanda Constructions",
  shortName: "Sri Skanda",
  url: "https://www.sriskandaconstructions.com",

  address: {
    street: "51, 3rd Cross Street",
    area: "Thirumudi Sethuraman Nagar",
    locality: "Saram",
    city: "Pondicherry",
    postalCode: "605011",
    country: "India",
    countryCode: "IN",
  },

  // TODO(client): right-click the office on Google Maps, copy the two
  // numbers, and put them here as { lat: 11.0, lng: 79.0 }.
  geo: null,

  phone: {
    display: "+91 94880 84277",
    e164: "+919488084277",
    whatsapp: "919488084277",
  },

  // TODO(client): add the business email address.
  email: "",

  // TODO(client): add only if the company sells apartment or plotted projects.
  reraNumber: "",

  // TODO(client): add the office hours, for example
  // { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:00", closes: "18:00" }
  openingHours: [],

  // Where the company takes on work, for search engines. Left empty so the
  // site does not say the work is limited to Pondicherry: the office is in
  // Pondicherry, the work is not confined to it.
  // TODO(client): list the real places, for example ["Pondicherry", "Tamil Nadu"].
  areaServed: [],

  // TODO(client): paste the real profile URLs. Empty ones stay hidden.
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  },

  claims: {
    // TODO(client): confirm how long the company has been building, edit the
    // text to the exact figure, then set enabled to true.
    experience: {
      enabled: false,
      text: "Decades of experience",
    },
    // TODO(client): confirm where the company actually takes on projects,
    // edit the text to match, then set enabled to true.
    serviceArea: {
      enabled: false,
      text: "Serving all over India",
    },
  },
};

export function addressLines(s: SiteConfig = site): string[] {
  const a = s.address;
  return [
    `${a.street}, ${a.area}`,
    `${a.locality}, ${a.city} ${a.postalCode}`,
  ];
}

export function fullAddress(s: SiteConfig = site): string {
  const a = s.address;
  return `${a.street}, ${a.area}, ${a.locality}, ${a.city} ${a.postalCode}, ${a.country}`;
}

export function whatsappUrl(message?: string, s: SiteConfig = site): string {
  const base = `https://wa.me/${s.phone.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Google Maps links for the office. No API key needed. */
export function mapLinks(s: SiteConfig = site) {
  const q = encodeURIComponent(`${s.name}, ${fullAddress(s)}`);
  return {
    embed: `https://www.google.com/maps?q=${q}&output=embed`,
    directions: `https://www.google.com/maps/dir/?api=1&destination=${q}`,
    view: `https://www.google.com/maps/search/?api=1&query=${q}`,
  };
}
