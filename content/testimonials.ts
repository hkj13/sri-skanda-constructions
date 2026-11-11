import { en, type L } from "./i18n";

/**
 * Client testimonials.
 *
 * Only entries with `verified: true` are shown. When none are verified the
 * whole section is hidden.
 *
 * TODO(client): these three came from the first version of the site and
 * have not been confirmed. For each one, check with the client that the
 * words are theirs and that they agree to be named, then set verified to
 * true. Delete any that cannot be confirmed.
 */
export type Testimonial = {
  name: string;
  quote: L;
  /** e.g. "Home owner, Saram". Optional. */
  context?: L;
  verified: boolean;
};

export const testimonials: Testimonial[] = [
  {
    name: "Rajesh Kumar",
    quote: en(
      "I'm incredibly impressed with the professionalism and quality of their construction. They built our dream home exactly as we envisioned. Highly recommend!",
    ),
    verified: false,
  },
  {
    name: "Priya Shanmugam",
    quote: en(
      "Their Vastu consultation and construction quality were exceptional. Our commercial space is thriving thanks to Sri Skanda Constructions.",
    ),
    verified: false,
  },
  {
    name: "Anand & Meera",
    quote: en(
      "We feel so blessed with our Vastu-compliant home. The team delivered on time and within budget. Exceptional work!",
    ),
    verified: false,
  },
];

export const verifiedTestimonials = () => testimonials.filter((t) => t.verified);
