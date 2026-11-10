import { LIME, NAVY, WHITE, type Concept, type Ink, type Shape } from "./concepts";
import { JOST_GLYPHS, type WordmarkWeight } from "./jost-glyphs";

/**
 * Geometry for every logo arrangement: the mark, the two-line wordmark, and
 * how they sit together in the horizontal and stacked lockups.
 *
 * Pages draw these through the inline sprite in Logo.tsx. `logoSvgString`
 * flattens the same geometry into a standalone SVG file for pixel previews
 * and for export.
 */

export type LogoKind = "mark" | "horizontal" | "stacked" | "icon";
export type LogoVariant = "light" | "dark" | "mono";

export const MARK_SIZE = 64;
/** Cap height of SRI SKANDA in the wordmark's own coordinate space. */
const CAP = 24;

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
export function buildWordmark(concept: Concept): Wordmark {
  const { primary, secondary, tracking, ratio } = concept.wordmark;
  const subCap = CAP * ratio;
  const gap = CAP * 0.44;

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
    height: round(CAP + gap + subCap),
    glyphs: [
      ...place(top, CAP, "primary"),
      ...place(bottom, CAP + gap + subCap, "secondary"),
    ],
  };
}

/* ── Layout ─────────────────────────────────────────────────────────── */

export type Box = { x: number; y: number; width: number; height: number };

export type LogoLayout = {
  width: number;
  height: number;
  mark: Box;
  /** Absent for the mark and the favicon, which carry no lettering. */
  word?: Box;
};

export function layoutLogo(concept: Concept, kind: LogoKind): LogoLayout {
  if (kind === "mark" || kind === "icon") {
    return {
      width: MARK_SIZE,
      height: MARK_SIZE,
      mark: { x: 0, y: 0, width: MARK_SIZE, height: MARK_SIZE },
    };
  }

  const word = buildWordmark(concept);

  if (kind === "horizontal") {
    const gap = 18;
    return {
      width: round(MARK_SIZE + gap + word.width),
      height: MARK_SIZE,
      mark: { x: 0, y: 0, width: MARK_SIZE, height: MARK_SIZE },
      word: {
        x: MARK_SIZE + gap,
        y: round((MARK_SIZE - word.height) / 2),
        width: word.width,
        height: word.height,
      },
    };
  }

  // Stacked: the mark centred above the lettering, about half its width.
  const markSize = 104;
  const gap = 26;
  const width = Math.max(word.width, markSize);
  return {
    width: round(width),
    height: round(markSize + gap + word.height),
    mark: {
      x: round((width - markSize) / 2),
      y: 0,
      width: markSize,
      height: markSize,
    },
    word: {
      x: round((width - word.width) / 2),
      y: markSize + gap,
      width: word.width,
      height: word.height,
    },
  };
}

/* ── Artwork ────────────────────────────────────────────────────────── */

/** Rounded navy tile behind the favicon. */
export const ICON_TILE =
  "M14 0 H50 A14 14 0 0 1 64 14 V50 A14 14 0 0 1 50 64 H14 A14 14 0 0 1 0 50 V14 A14 14 0 0 1 14 0 Z";

/** The mark's shapes for a variant, or the favicon artwork with its tile. */
export function markShapes(
  concept: Concept,
  variant: LogoVariant | "icon",
): Shape[] {
  if (variant !== "icon") return concept[variant];
  const s = concept.iconScale;
  const offset = round((MARK_SIZE - MARK_SIZE * s) / 2);
  const fit = `translate(${offset} ${offset}) scale(${s})`;
  return [
    { d: ICON_TILE, ink: "navy" },
    ...concept.icon.map((shape) => ({
      ...shape,
      transform: shape.transform ? `${fit} ${shape.transform}` : fit,
    })),
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
function wordColors(variant: LogoVariant, current: string): [string, string] {
  if (variant === "dark") return [WHITE, LIME];
  if (variant === "mono") return [current, current];
  return [NAVY, NAVY];
}

export function symbolId(
  concept: Concept,
  part: "word" | "icon" | `mark-${LogoVariant}`,
): string {
  return `ssc-${concept.id}-${part}`;
}

/* ── Standalone SVG ─────────────────────────────────────────────────── */

function shapeMarkup(shape: Shape, current: string, outer?: string): string {
  const color = inkColor(shape.ink, current);
  const paint = shape.stroke
    ? `fill="none" stroke="${color}" stroke-width="${shape.stroke}" stroke-miterlimit="8"`
    : `fill="${color}"${shape.evenodd ? ' fill-rule="evenodd"' : ""}`;
  const transform = [outer, shape.transform].filter(Boolean).join(" ");
  return `<path d="${shape.d}" ${paint}${transform ? ` transform="${transform}"` : ""}/>`;
}

/**
 * A complete SVG document with fixed colours and no external references.
 * `monoColor` sets the ink for the one-colour variant.
 */
export function logoSvgString(
  concept: Concept,
  kind: LogoKind,
  options: { variant?: LogoVariant; monoColor?: string; size?: number } = {},
): string {
  const { variant = "light", monoColor = NAVY, size } = options;
  const layout = layoutLogo(concept, kind);
  const shapes = markShapes(concept, kind === "icon" ? "icon" : variant);

  const markScale = layout.mark.width / MARK_SIZE;
  const markTransform =
    layout.mark.x || layout.mark.y || markScale !== 1
      ? `translate(${layout.mark.x} ${layout.mark.y}) scale(${round(markScale, 5)})`
      : undefined;
  let body = shapes.map((s) => shapeMarkup(s, monoColor, markTransform)).join("");

  if (layout.word) {
    const word = buildWordmark(concept);
    const [primary, secondary] = wordColors(variant, monoColor);
    const offset = `translate(${layout.word.x} ${layout.word.y})`;
    body += word.glyphs
      .map(
        (g) =>
          `<path d="${g.d}" fill="${g.line === "primary" ? primary : secondary}" transform="${offset} ${g.transform}"/>`,
      )
      .join("");
  }

  const dims = size
    ? ` width="${round((size * layout.width) / layout.height)}" height="${size}"`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${layout.width} ${layout.height}"${dims}>${body}</svg>`;
}
