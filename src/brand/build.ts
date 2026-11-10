import {
  ICON_SCALE,
  ICON_TILE,
  LIME,
  MARK,
  MARK_INK,
  MARK_SIZE,
  NAVY,
  WHITE,
  WORDMARK,
  type Ink,
  type Shape,
} from "./logo-art";
import { JOST_GLYPHS, type WordmarkWeight } from "./jost-glyphs";

/**
 * Geometry for every logo arrangement: the mark, the two-line wordmark, and
 * how they sit together in the horizontal and stacked lockups.
 *
 * Pages draw these through the inline sprite in Logo.tsx. `logoSvgString`
 * flattens the same geometry into a standalone SVG file, used for the
 * exported package in /public/brand.
 */

export type LogoKind = "mark" | "horizontal" | "stacked" | "icon";
export type LogoVariant = "light" | "dark" | "mono";

/** Cap height of SRI SKANDA, in mark grid units. */
export const CAP = 24;

const round = (n: number, places = 2) => {
  const f = 10 ** places;
  return Math.round(n * f) / f;
};

/* ── Wordmark ───────────────────────────────────────────────────────── */

export type WordmarkGlyph = {
  d: string;
  transform: string;
  line: "primary" | "secondary";
};

export type Wordmark = {
  width: number;
  height: number;
  glyphs: WordmarkGlyph[];
};

type Line = {
  glyphs: { d: string; x: number }[];
  /** Ink width in output units. */
  width: number;
  scale: number;
};

/** Sets one line of the wordmark, measured from ink edge to ink edge. */
function setLine(
  text: string,
  weight: WordmarkWeight,
  capHeight: number,
  trackingEm: number,
): Line {
  const font = JOST_GLYPHS[weight];
  const scale = capHeight / font.capHeight;
  const tracking = trackingEm * font.unitsPerEm;
  const placed: { d: string; x: number }[] = [];
  let x = 0;
  let prev = "";
  let inkStart = 0;
  let inkEnd = 0;

  for (const ch of text) {
    if (ch === " ") {
      x += font.space + tracking;
      prev = "";
      continue;
    }
    const glyph = font.glyphs[ch];
    if (!glyph) throw new Error(`No outline for "${ch}" at weight ${weight}`);
    if (prev) x += font.kern[prev + ch] ?? 0;
    if (placed.length === 0) inkStart = x + glyph.lsb;
    placed.push({ d: glyph.d, x });
    inkEnd = x + glyph.adv - glyph.rsb;
    x += glyph.adv + tracking;
    prev = ch;
  }

  return {
    glyphs: placed.map((g) => ({ d: g.d, x: (g.x - inkStart) * scale })),
    width: (inkEnd - inkStart) * scale,
    scale,
  };
}

/** Sets a line, then tracks it out until its ink width equals `target`. */
function setJustifiedLine(
  text: string,
  weight: WordmarkWeight,
  capHeight: number,
  target: number,
): Line {
  const natural = setLine(text, weight, capHeight, 0);
  const gaps = text.length - 1;
  const extraUnits = (target - natural.width) / natural.scale / gaps;
  return setLine(
    text,
    weight,
    capHeight,
    extraUnits / JOST_GLYPHS[weight].unitsPerEm,
  );
}

/**
 * SRI SKANDA over CONSTRUCTIONS. The second line is tracked out so both
 * lines share exactly the same width.
 */
export function buildWordmark(): Wordmark {
  const { primary, secondary, tracking, ratio, gap } = WORDMARK;
  const subCap = CAP * ratio;
  const lineGap = CAP * gap;

  const top = setLine("SRI SKANDA", primary, CAP, tracking);
  const bottom = setJustifiedLine("CONSTRUCTIONS", secondary, subCap, top.width);

  const place = (
    l: Line,
    baseline: number,
    line: WordmarkGlyph["line"],
  ): WordmarkGlyph[] =>
    l.glyphs.map((g) => ({
      d: g.d,
      line,
      transform: `translate(${round(g.x)} ${round(baseline)}) scale(${round(l.scale, 5)})`,
    }));

  return {
    width: round(top.width),
    height: round(CAP + lineGap + subCap),
    glyphs: [
      ...place(top, CAP, "primary"),
      ...place(bottom, CAP + lineGap + subCap, "secondary"),
    ],
  };
}

/* ── Layout ─────────────────────────────────────────────────────────── */

export type Box = { x: number; y: number; width: number; height: number };

export type LogoLayout = {
  width: number;
  height: number;
  /** Where the 64-unit mark square is placed. */
  mark: Box;
  /** Absent for the mark and the favicon, which carry no lettering. */
  word?: Box;
};

/** Space between the mark and the lettering in the horizontal lockup. */
const H_GAP = 16;
/** Mark enlargement and spacing in the stacked lockup. */
const STACK_SCALE = 1.75;
const STACK_GAP = 24;

export function layoutLogo(kind: LogoKind): LogoLayout {
  if (kind === "mark" || kind === "icon") {
    return {
      width: MARK_SIZE,
      height: MARK_SIZE,
      mark: { x: 0, y: 0, width: MARK_SIZE, height: MARK_SIZE },
    };
  }

  const word = buildWordmark();

  if (kind === "horizontal") {
    // The lockup is cropped to the artwork. The lettering hangs from the
    // roofline of the flat-roofed block and stands on the ground line:
    // 12 units of roof step + 24 cap + 8 gap + 12 cap = 56, the mark height.
    return {
      width: round(MARK_INK.width + H_GAP + word.width),
      height: MARK_INK.height,
      mark: {
        x: -MARK_INK.x,
        y: -MARK_INK.y,
        width: MARK_SIZE,
        height: MARK_SIZE,
      },
      word: {
        x: MARK_INK.width + H_GAP,
        y: MARK_INK.height - word.height,
        width: word.width,
        height: word.height,
      },
    };
  }

  // Stacked: the mark centred above the lettering.
  const inkW = MARK_INK.width * STACK_SCALE;
  const inkH = MARK_INK.height * STACK_SCALE;
  const width = Math.max(word.width, inkW);
  return {
    width: round(width),
    height: round(inkH + STACK_GAP + word.height),
    mark: {
      x: round((width - inkW) / 2 - MARK_INK.x * STACK_SCALE),
      y: round(-MARK_INK.y * STACK_SCALE),
      width: MARK_SIZE * STACK_SCALE,
      height: MARK_SIZE * STACK_SCALE,
    },
    word: {
      x: round((width - word.width) / 2),
      y: round(inkH + STACK_GAP),
      width: word.width,
      height: word.height,
    },
  };
}

/* ── Artwork ────────────────────────────────────────────────────────── */

/** The mark's shapes for a variant, or the favicon artwork on its tile. */
export function markShapes(variant: LogoVariant | "icon"): Shape[] {
  if (variant !== "icon") return MARK[variant];
  const offset = round((MARK_SIZE - MARK_SIZE * ICON_SCALE) / 2);
  const fit = `translate(${offset} ${offset}) scale(${ICON_SCALE})`;
  return [
    { d: ICON_TILE, ink: "navy" },
    ...MARK.dark.map((shape) => ({ ...shape, transform: fit })),
  ];
}

export function inkColor(ink: Ink, current = "currentColor"): string {
  switch (ink) {
    case "navy":
      return NAVY;
    case "white":
      return WHITE;
    case "lime":
      return LIME;
    case "current":
      return current;
  }
}

/** Lettering colours per variant: [SRI SKANDA, CONSTRUCTIONS]. */
export function wordColors(
  variant: LogoVariant,
  current = "currentColor",
): [string, string] {
  if (variant === "dark") return [WHITE, LIME];
  if (variant === "mono") return [current, current];
  return [NAVY, NAVY];
}

export type SymbolPart = "word" | "icon" | `mark-${LogoVariant}`;

export function symbolId(part: SymbolPart): string {
  return `ssc-logo-${part}`;
}

/* ── Standalone SVG ─────────────────────────────────────────────────── */

function shapeMarkup(shape: Shape, current: string, outer?: string): string {
  const fill = inkColor(shape.ink, current);
  const transform = [outer, shape.transform].filter(Boolean).join(" ");
  return (
    `<path d="${shape.d}" fill="${fill}"` +
    (shape.evenodd ? ' fill-rule="evenodd"' : "") +
    (transform ? ` transform="${transform}"` : "") +
    "/>"
  );
}

/** The paths of one logo arrangement, without the surrounding <svg>. */
export function logoSvgBody(
  kind: LogoKind,
  options: { variant?: LogoVariant; monoColor?: string } = {},
): string {
  const { variant = "light", monoColor = NAVY } = options;
  const layout = layoutLogo(kind);
  const shapes = markShapes(kind === "icon" ? "icon" : variant);

  const markScale = layout.mark.width / MARK_SIZE;
  const markTransform =
    layout.mark.x || layout.mark.y || markScale !== 1
      ? `translate(${layout.mark.x} ${layout.mark.y}) scale(${round(markScale, 5)})`
      : undefined;
  let body = shapes.map((s) => shapeMarkup(s, monoColor, markTransform)).join("");

  if (layout.word) {
    const word = buildWordmark();
    const [primary, secondary] = wordColors(variant, monoColor);
    const offset = `translate(${layout.word.x} ${layout.word.y})`;
    body += word.glyphs
      .map(
        (g) =>
          `<path d="${g.d}" fill="${g.line === "primary" ? primary : secondary}" transform="${offset} ${g.transform}"/>`,
      )
      .join("");
  }
  return body;
}

/**
 * A complete SVG document with fixed colours and no external references.
 * `pad` adds empty space around the artwork, in mark grid units.
 * `monoColor` sets the ink for the one-colour variant.
 */
export function logoSvgString(
  kind: LogoKind,
  options: {
    variant?: LogoVariant;
    monoColor?: string;
    size?: number;
    pad?: number;
    title?: string;
  } = {},
): string {
  const { size, pad = 0, title } = options;
  const layout = layoutLogo(kind);
  const w = round(layout.width + pad * 2);
  const h = round(layout.height + pad * 2);
  const dims = size ? ` width="${round((size * w) / h)}" height="${size}"` : "";
  const label = title ? ` role="img" aria-label="${title}"` : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${w} ${h}"${dims}${label}>` +
    (title ? `<title>${title}</title>` : "") +
    logoSvgBody(kind, options) +
    "</svg>"
  );
}
