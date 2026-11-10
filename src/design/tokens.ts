/**
 * Design tokens for the site: colour, type, spacing and motion.
 *
 * The six brand colours are fixed. Everything else is a tint or shade of the
 * navy hue (226 degrees) or a neutral gray built on the same hue, so no new
 * hue enters the palette. WhatsApp green is used for WhatsApp actions only.
 */

export type ColorToken = {
  name: string;
  value: string;
  role: string;
  group: "brand" | "navy" | "gray" | "action";
};

export const COLORS: ColorToken[] = [
  { group: "brand", name: "navy", value: "#1a2340", role: "Primary. Blueprint paper, body text on white, main buttons." },
  { group: "brand", name: "navy-2", value: "#2a3660", role: "Secondary navy. Raised panels and grid lines on navy." },
  { group: "brand", name: "lime", value: "#d8f060", role: "Accent. Laser line, hi-vis details, buttons on navy. Never on white." },
  { group: "brand", name: "lime-light", value: "#e8f5a0", role: "Soft lime. Lit windows, highlights on navy." },
  { group: "brand", name: "surface", value: "#eef8c4", role: "Pale lime ground for calm content sections." },
  { group: "brand", name: "white", value: "#ffffff", role: "Background. Text on navy." },

  { group: "navy", name: "navy-950", value: "#12182b", role: "Dusk and night scenes, the deepest layer." },
  { group: "navy", name: "navy-700", value: "#2f3f74", role: "Dimension lines and ornaments on navy. Not for text." },
  { group: "navy", name: "navy-300", value: "#a4b1da", role: "Technical labels and captions on navy." },
  { group: "navy", name: "navy-100", value: "#e9ecf6", role: "Drawing-paper tint for light sections." },
  { group: "navy", name: "navy-50", value: "#f4f6fb", role: "Faintest tint, alternate rows and inputs." },

  { group: "gray", name: "gray-50", value: "#f7f7f8", role: "Neutral background." },
  { group: "gray", name: "gray-200", value: "#dddfe3", role: "Hairlines and borders on white." },
  { group: "gray", name: "gray-400", value: "#9499a8", role: "Disabled states and decorative strokes. Not for text." },
  { group: "gray", name: "gray-500", value: "#6e7487", role: "Smallest secondary text on white." },
  { group: "gray", name: "gray-600", value: "#5c6170", role: "Secondary text on white and pale grounds." },
  { group: "gray", name: "gray-800", value: "#373a43", role: "Neutral dark, rarely needed." },

  { group: "action", name: "whatsapp", value: "#25d366", role: "WhatsApp buttons only, always with navy text and icon." },
];

export function color(name: string): string {
  const token = COLORS.find((c) => c.name === name);
  if (!token) throw new Error(`Unknown colour token: ${name}`);
  return token.value;
}

/* ── Contrast (WCAG 2.2) ────────────────────────────────────────────── */

function channel(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(fg: string, bg: string): number {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export type Pairing = {
  fg: string;
  bg: string;
  use: string;
  /** "never" pairings are listed to document the rule, not for use. */
  status: "use" | "large-only" | "non-text" | "never";
};

export const PAIRINGS: Pairing[] = [
  { fg: "navy", bg: "white", use: "Body text, headings", status: "use" },
  { fg: "white", bg: "navy", use: "Body text and headings on navy", status: "use" },
  { fg: "navy", bg: "surface", use: "Text in calm content sections", status: "use" },
  { fg: "navy", bg: "lime", use: "Button labels, emphasis blocks", status: "use" },
  { fg: "lime", bg: "navy", use: "Emphasis, labels, links on navy", status: "use" },
  { fg: "lime", bg: "navy-2", use: "Labels on raised navy panels", status: "use" },
  { fg: "lime", bg: "navy-950", use: "Labels in dusk scenes", status: "use" },
  { fg: "white", bg: "navy-2", use: "Text on raised navy panels", status: "use" },
  { fg: "lime-light", bg: "navy", use: "Secondary emphasis on navy", status: "use" },
  { fg: "navy-300", bg: "navy", use: "Technical labels, captions on navy", status: "use" },
  { fg: "navy", bg: "navy-100", use: "Text on drawing-paper sections", status: "use" },
  { fg: "navy-2", bg: "white", use: "Subheadings on white", status: "use" },
  { fg: "gray-600", bg: "white", use: "Secondary text", status: "use" },
  { fg: "gray-600", bg: "surface", use: "Secondary text on pale lime", status: "use" },
  { fg: "gray-500", bg: "white", use: "Small captions, minimum", status: "use" },
  { fg: "navy", bg: "whatsapp", use: "WhatsApp button label and icon", status: "use" },
  { fg: "navy-700", bg: "navy", use: "Blueprint grid and dimension lines", status: "non-text" },
  { fg: "gray-400", bg: "white", use: "Decorative strokes, disabled", status: "non-text" },
  { fg: "white", bg: "whatsapp", use: "White on WhatsApp green", status: "never" },
  { fg: "lime", bg: "white", use: "Lime on white", status: "never" },
  { fg: "lime-light", bg: "white", use: "Lime light on white", status: "never" },
];

/* ── Type ───────────────────────────────────────────────────────────── */

export type TypeStep = {
  name: string;
  /** CSS font-size, usually a clamp() between 360 px and 2560 px wide. */
  size: string;
  min: number;
  max: number;
  weight: number;
  leading: number;
  tracking: string;
  use: string;
  mono?: boolean;
  upper?: boolean;
};

/** Fluid size from `min` px at 360 px wide to `max` px at 2560 px wide. */
function fluid(min: number, max: number): string {
  const slope = (max - min) / (2560 - 360);
  const base = min - slope * 360;
  return `clamp(${min / 16}rem, ${(base / 16).toFixed(3)}rem + ${(slope * 100).toFixed(3)}vw, ${max / 16}rem)`;
}

export const TYPE: TypeStep[] = [
  { name: "display", min: 48, max: 168, size: fluid(48, 168), weight: 300, leading: 0.95, tracking: "-0.025em", use: "Chapter headlines, one per screen" },
  { name: "h1", min: 40, max: 112, size: fluid(40, 112), weight: 300, leading: 1.0, tracking: "-0.02em", use: "Page titles" },
  { name: "h2", min: 32, max: 72, size: fluid(32, 72), weight: 300, leading: 1.05, tracking: "-0.015em", use: "Section headings" },
  { name: "h3", min: 22, max: 36, size: fluid(22, 36), weight: 500, leading: 1.2, tracking: "-0.005em", use: "Card and step headings" },
  { name: "lead", min: 18, max: 26, size: fluid(18, 26), weight: 400, leading: 1.5, tracking: "0", use: "Intro paragraphs" },
  { name: "body", min: 17, max: 19, size: fluid(17, 19), weight: 400, leading: 1.65, tracking: "0", use: "Running text, never below 17 px" },
  { name: "small", min: 15, max: 16, size: fluid(15, 16), weight: 400, leading: 1.55, tracking: "0", use: "Captions, form help" },
  { name: "eyebrow", min: 12, max: 14, size: fluid(12, 14), weight: 600, leading: 1.3, tracking: "0.18em", use: "Section labels above headings", upper: true },
  { name: "tech", min: 12, max: 14, size: fluid(12, 14), weight: 400, leading: 1.3, tracking: "0.06em", use: "Dimensions, floor numbers, coordinates", mono: true, upper: true },
];

/* ── Space and layout ───────────────────────────────────────────────── */

export const LAYOUT = {
  columns: 12,
  gutter: "clamp(16px, 1.6vw, 40px)",
  margin: "clamp(16px, 4.5vw, 128px)",
  /** Longest line of running text. Scenes are never capped. */
  measure: "68ch",
  header: { height: 72, compact: 60 },
  /** Bottom-right zone kept clear for the floating WhatsApp button. */
  whatsappSafe: { size: 64, inset: 20, clearance: 96 },
  breakpoints: [360, 390, 768, 1280, 1440, 1920, 2560],
};

/* ── Motion ─────────────────────────────────────────────────────────── */

export type Ease = { name: string; css: string; gsap: string; use: string };

export const EASES: Ease[] = [
  { name: "settle", css: "cubic-bezier(0.16, 1, 0.3, 1)", gsap: "expo.out", use: "Heavy parts landing: slabs, beams, windows" },
  { name: "drop", css: "cubic-bezier(0.55, 0, 1, 0.45)", gsap: "power2.in", use: "Falling: survey stakes, the key" },
  { name: "snap", css: "cubic-bezier(0.34, 1.56, 0.64, 1)", gsap: "back.out(2)", use: "String lines pulling taut, rooms snapping to zones" },
  { name: "pour", css: "cubic-bezier(0.45, 0, 0.55, 1)", gsap: "sine.inOut", use: "Concrete, paint and light: fluid, even" },
  { name: "sweep", css: "cubic-bezier(0.65, 0, 0.35, 1)", gsap: "power3.inOut", use: "The laser line, page transitions" },
];

export const DURATIONS = [
  { name: "instant", ms: 120, use: "Hover, press, focus" },
  { name: "quick", ms: 240, use: "Toggles, small UI changes" },
  { name: "move", ms: 480, use: "Panels, the 2D/3D and home/commercial switches" },
  { name: "sweep", ms: 900, use: "Laser-line page transition, end to end" },
  { name: "scene", ms: 0, use: "Chapters: tied to scroll, no fixed duration" },
];
