/**
 * Exports the logo package to public/brand and the site icons to src/app.
 *
 *   npx tsx scripts/export-brand.ts
 *
 * Everything is generated from src/brand (the same geometry the site draws),
 * so the files can never drift from the logo on the pages. All lettering is
 * converted to outlines: no file here depends on a font being installed.
 */
import { mkdirSync, readFileSync, writeFileSync, createWriteStream } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import PDFDocument from "pdfkit";
import sharp from "sharp";
import SVGtoPDF from "svg-to-pdfkit";
import {
  CAP,
  layoutLogo,
  logoSvgBody,
  logoSvgString,
  type LogoKind,
  type LogoVariant,
} from "../src/brand/build";
import { LIME, MARK, NAVY, NAVY_2, WHITE } from "../src/brand/logo-art";
import { tr } from "../content/i18n";
import { services } from "../content/services";

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "brand");
const NAME = "Sri Skanda Constructions";

const SURFACE = "#eef8c4";
const LIME_LIGHT = "#e8f5a0";
const GRAY = "#5b6070";
const RULE = "#c9ccd3";

function write(path: string, data: string | Buffer) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data);
  console.log("  " + path.replace(ROOT + "/", ""));
}

/* ── Outlined text ──────────────────────────────────────────────────── */

type Weight = 300 | 400 | 500 | 600;
const fonts = new Map<Weight, opentype.Font>();
function font(weight: Weight): opentype.Font {
  let f = fonts.get(weight);
  if (!f) {
    const buf = readFileSync(
      require.resolve(`@fontsource/jost/files/jost-latin-${weight}-normal.woff`),
    );
    f = opentype.parse(
      buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
    );
    fonts.set(weight, f);
  }
  return f;
}

/** Path commands as SVG path data, rounded to two decimals. */
function pathData(path: opentype.Path): string {
  const n = (v: number) => String(Math.round(v * 100) / 100);
  let d = "";
  for (const c of path.commands) {
    if (c.type === "M" || c.type === "L") d += `${c.type}${n(c.x)} ${n(c.y)}`;
    else if (c.type === "Q") d += `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
    else if (c.type === "C")
      d += `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
    else d += "Z";
  }
  return d;
}

type TextOptions = {
  size: number;
  weight?: Weight;
  fill?: string;
  /** Letter spacing in em. */
  tracking?: number;
  anchor?: "start" | "middle" | "end";
  opacity?: number;
};

/**
 * One line of Jost as a filled path. `y` is the baseline.
 * Glyphs are placed one by one: the font's pair kerning is applied where it
 * is a real number, and ignored where the kerning table has no usable value.
 */
function text(str: string, x: number, y: number, o: TextOptions): string {
  const f = font(o.weight ?? 400);
  const scale = o.size / f.unitsPerEm;
  const tracking = (o.tracking ?? 0) * o.size;
  const glyphs = [...str].map((ch) => f.charToGlyph(ch));

  const advances = glyphs.map((g, i) => {
    let adv = (g.advanceWidth ?? 0) * scale;
    const next = glyphs[i + 1];
    if (next) {
      const kern = f.getKerningValue(g, next);
      if (Number.isFinite(kern)) adv += kern * scale;
      adv += tracking;
    }
    return adv;
  });
  const width = advances.reduce((sum, a) => sum + a, 0);

  let cx =
    o.anchor === "end" ? x - width : o.anchor === "middle" ? x - width / 2 : x;
  let d = "";
  glyphs.forEach((g, i) => {
    d += pathData(g.getPath(cx, y, o.size));
    cx += advances[i];
  });
  if (d.includes("NaN")) throw new Error(`Could not outline "${str}"`);
  return `<path d="${d}" fill="${o.fill ?? NAVY}"${o.opacity ? ` fill-opacity="${o.opacity}"` : ""}/>`;
}

function lines(
  rows: string[],
  x: number,
  y: number,
  leading: number,
  o: TextOptions,
): string {
  return rows.map((row, i) => text(row, x, y + i * leading, o)).join("");
}

const label = (str: string, x: number, y: number, fill = NAVY) =>
  text(str.toUpperCase(), x, y, { size: 11, weight: 600, tracking: 0.18, fill });

/* ── Helpers ────────────────────────────────────────────────────────── */

/** A logo placed inside a larger SVG at (x, y), scaled to `height`. */
function place(
  kind: LogoKind,
  x: number,
  y: number,
  height: number,
  options: { variant?: LogoVariant; monoColor?: string } = {},
): string {
  const layout = layoutLogo(kind);
  const s = height / layout.height;
  return `<g transform="translate(${x} ${y}) scale(${s.toFixed(5)})">${logoSvgBody(kind, options)}</g>`;
}

function logoWidth(kind: LogoKind, height: number): number {
  const layout = layoutLogo(kind);
  return (layout.width * height) / layout.height;
}

function grid(w: number, h: number, step: number, color = NAVY_2): string {
  let d = "";
  for (let x = step; x < w; x += step) d += `M${x} 0V${h}`;
  for (let y = step; y < h; y += step) d += `M0 ${y}H${w}`;
  return `<path d="${d}" stroke="${color}" stroke-width="1" fill="none"/>`;
}

async function png(svg: string, width: number, height: number): Promise<Buffer> {
  return sharp(Buffer.from(svg), { density: 384 })
    .resize(width, height, { fit: "fill" })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** Packs PNG images into a .ico container. */
function ico(images: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries: Buffer[] = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

/* ── 1. Logo files ──────────────────────────────────────────────────── */

const VERSIONS: {
  suffix: string;
  variant: LogoVariant;
  monoColor?: string;
  note: string;
}[] = [
  { suffix: "", variant: "light", note: "for white and lime grounds" },
  { suffix: "-reversed", variant: "dark", note: "reversed, for navy grounds" },
  { suffix: "-navy", variant: "mono", monoColor: NAVY, note: "one colour, navy" },
  { suffix: "-black", variant: "mono", monoColor: "#000000", note: "one colour, black" },
  { suffix: "-white", variant: "mono", monoColor: WHITE, note: "one colour, white" },
];

const KINDS: { kind: LogoKind; file: string; label: string }[] = [
  { kind: "horizontal", file: "logo-horizontal", label: "horizontal lockup" },
  { kind: "stacked", file: "logo-stacked", label: "stacked lockup" },
  { kind: "mark", file: "mark", label: "mark" },
];

function exportLogos() {
  console.log("Logo files");
  for (const { kind, file, label: kindLabel } of KINDS) {
    for (const v of VERSIONS) {
      write(
        join(OUT, `${file}${v.suffix}.svg`),
        logoSvgString(kind, {
          variant: v.variant,
          monoColor: v.monoColor,
          // A sliver of room so round letters are never cut at the edge.
          pad: kind === "mark" ? 0 : 2,
          title: `${NAME} ${kindLabel}, ${v.note}`,
        }) + "\n",
      );
    }
  }
}

async function exportPngs() {
  console.log("PNG copies");
  const jobs: [LogoKind, string, LogoVariant, number][] = [
    ["horizontal", "logo-horizontal", "light", 240],
    ["horizontal", "logo-horizontal-reversed", "dark", 240],
    ["stacked", "logo-stacked", "light", 600],
    ["stacked", "logo-stacked-reversed", "dark", 600],
    ["mark", "mark", "light", 512],
    ["mark", "mark-reversed", "dark", 512],
  ];
  for (const [kind, file, variant, height] of jobs) {
    const pad = kind === "mark" ? 0 : 2;
    const layout = layoutLogo(kind);
    const w = Math.round(((layout.width + pad * 2) * height) / (layout.height + pad * 2));
    const svg = logoSvgString(kind, { variant, pad });
    write(join(OUT, "png", `${file}.png`), await png(svg, w, height));
  }

  // Square navy picture for WhatsApp, Google Business and social profiles.
  // The mark sits inside the circle those apps crop to.
  const profile =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">` +
    `<rect width="640" height="640" fill="${NAVY}"/>` +
    place("mark", 140, 140, 360, { variant: "dark" }) +
    `</svg>`;
  write(join(OUT, "png", "profile-picture.png"), await png(profile, 640, 640));
}

/* ── 2. Favicon and app icons ───────────────────────────────────────── */

async function exportIcons() {
  console.log("Favicon and app icons");
  const icon = logoSvgString("icon", { title: NAME });
  write(join(OUT, "favicon", "icon.svg"), icon + "\n");

  const sizes: Record<number, Buffer> = {};
  for (const size of [16, 32, 48]) sizes[size] = await png(icon, size, size);
  write(join(OUT, "favicon", "favicon-16.png"), sizes[16]);
  write(join(OUT, "favicon", "favicon-32.png"), sizes[32]);
  const icoFile = ico([16, 32, 48].map((size) => ({ size, data: sizes[size] })));
  write(join(OUT, "favicon", "favicon.ico"), icoFile);

  // Phones round or mask the corners themselves, so these are full squares
  // with the mark inside the central safe area.
  const square = (size: number) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">` +
    `<rect width="${size}" height="${size}" fill="${NAVY}"/>` +
    place("mark", size * 0.2, size * 0.2, size * 0.6, { variant: "dark" }) +
    `</svg>`;
  const apple = await png(square(180), 180, 180);
  write(join(OUT, "favicon", "apple-touch-icon.png"), apple);
  write(join(OUT, "favicon", "icon-192.png"), await png(square(192), 192, 192));
  write(join(OUT, "favicon", "icon-512.png"), await png(square(512), 512, 512));

  // Next.js picks these up by file name and writes the <link> tags.
  console.log("Site icons");
  write(join(ROOT, "src", "app", "favicon.ico"), icoFile);
  write(join(ROOT, "src", "app", "icon.svg"), icon + "\n");
  write(join(ROOT, "src", "app", "apple-icon.png"), apple);
}

/* ── 3. Social image template ───────────────────────────────────────── */

function ogSvg(title: string[] | null): string {
  const W = 1200;
  const H = 630;
  const logoH = 96;
  let body =
    `<rect width="${W}" height="${H}" fill="${NAVY}"/>` +
    grid(W, H, 60) +
    // survey stakes and string line marking the title area
    `<path d="M80 468H1120" stroke="${LIME}" stroke-width="3"/>` +
    `<path d="M80 452v32M1120 452v32" stroke="${LIME}" stroke-width="3"/>` +
    place("horizontal", 80, 80, logoH, { variant: "dark" });
  if (title) {
    body += lines(title, 80, 318, 84, { size: 68, weight: 300, fill: WHITE });
    body +=
      text("RESIDENTIAL · COMMERCIAL · TURNKEY", 80, 540, {
        size: 22,
        weight: 500,
        tracking: 0.18,
        fill: LIME,
      }) +
      text("Saram, Pondicherry", 1120, 540, {
        size: 24,
        fill: WHITE,
        anchor: "end",
      });
  } else {
    body +=
      `<!-- Title: Jost Light 68 px, white, left edge x=80, first baseline y=318, ` +
      `line height 84 px, two lines at most. Keep it above the lime line. -->` +
      `<!-- Footer row: baseline y=540. -->`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${body}</svg>`;
}

/** Breaks a title into lines that fit `max` pixels of Jost Light at `size`. */
function wrap(str: string, size: number, max: number): string[] {
  const f = font(300);
  const width = (s: string) => f.getAdvanceWidth(s, size, { kerning: true });
  const lines: string[] = [];
  let line = "";
  for (const word of str.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (line && width(next) > max) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Share images for the main pages and each service, in public/brand/og. */
const SHARE_PAGES: { file: string; title: string }[] = [
  { file: "services", title: "Construction services in Pondicherry." },
  { file: "process", title: "How a building gets built, stage by stage." },
  { file: "estimate", title: "Get a free construction estimate." },
  { file: "contact", title: "Plan your build with us." },
  { file: "about", title: "A builder from Saram, Pondicherry." },
  ...services.map((s) => ({ file: `service-${s.slug}`, title: `${tr(s.title)}.` })),
];

async function exportOg() {
  console.log("Social image");
  write(join(OUT, "og", "og-template.svg"), ogSvg(null) + "\n");
  const filled = ogSvg(["Homes and commercial buildings,", "built in Pondicherry."]);
  write(join(OUT, "og", "og-default.svg"), filled + "\n");
  write(join(OUT, "og", "og-default.png"), await png(filled, 1200, 630));
  for (const page of SHARE_PAGES) {
    const lines = wrap(page.title, 68, 1040).slice(0, 2);
    write(join(OUT, "og", `${page.file}.png`), await png(ogSvg(lines), 1200, 630));
  }
}

/* ── 4. Brand sheet ─────────────────────────────────────────────────── */

/** A4 landscape at 4 units per millimetre. */
const SHEET_W = 1188;
const SHEET_H = 840;

function brandSheetSvg(): string {
  const side = 356;
  const x0 = side + 56;
  const right = SHEET_W - 56;
  const colW = (right - x0 - 40) / 2;
  const x1 = x0 + colW + 40;
  let s = `<rect width="${SHEET_W}" height="${SHEET_H}" fill="${WHITE}"/>`;

  /* Side panel */
  s += `<rect width="${side}" height="${SHEET_H}" fill="${NAVY}"/>`;
  s += `<g>${grid(side, SHEET_H, 44)}</g>`;
  const stackH = 250;
  s += place("stacked", (side - logoWidth("stacked", stackH)) / 2, 150, stackH, {
    variant: "dark",
  });
  s += `<path d="M56 560H${side - 56}" stroke="${LIME}" stroke-width="2"/>`;
  s += text("Brand sheet", 56, 620, { size: 44, weight: 300, fill: WHITE });
  s += lines(
    [
      "The logo, its colours and the few rules",
      "that keep it looking the same on a",
      "hoarding, a uniform and a phone.",
    ],
    56,
    660,
    22,
    { size: 15, fill: WHITE, opacity: 0.85 },
  );
  s += label("Version 1", 56, 784, LIME);

  /* 1. Versions */
  let y = 72;
  s += label("1  Logo versions", x0, y);
  s += `<path d="M${x0} ${y + 12}H${right}" stroke="${RULE}"/>`;
  const boxH = 104;
  const boxW = (right - x0 - 3 * 16) / 4;
  const boxes: [string, string, LogoVariant, string | undefined, string][] = [
    [WHITE, "Full colour", "light", undefined, "White and pale grounds"],
    [NAVY, "Reversed", "dark", undefined, "Navy grounds"],
    [LIME, "On lime", "light", undefined, "Lime grounds"],
    [WHITE, "One colour", "mono", NAVY, "Stamp, embroidery, single ink"],
  ];
  boxes.forEach(([bg, name, variant, monoColor, use], i) => {
    const bx = x0 + i * (boxW + 16);
    const by = y + 28;
    s += `<rect x="${bx}" y="${by}" width="${boxW}" height="${boxH}" fill="${bg}"${bg === WHITE ? ` stroke="${RULE}"` : ""}/>`;
    const h = 27;
    s += place("horizontal", bx + (boxW - logoWidth("horizontal", h)) / 2, by + (boxH - h) / 2, h, {
      variant,
      monoColor,
    });
    s += text(name, bx, by + boxH + 20, { size: 13, weight: 600 });
    s += text(use, bx, by + boxH + 37, { size: 12, fill: GRAY });
  });

  /* 2. Clear space */
  y = 300;
  s += label("2  Clear space", x0, y);
  s += `<path d="M${x0} ${y + 12}H${x0 + colW}" stroke="${RULE}"/>`;
  {
    const h = 56;
    const scale = h / layoutLogo("horizontal").height;
    const X = CAP * scale;
    const w = logoWidth("horizontal", h);
    const lx = x0 + X + 8;
    const ly = y + 36 + X;
    s += `<rect x="${lx - X}" y="${ly - X}" width="${w + 2 * X}" height="${h + 2 * X}" fill="${SURFACE}"/>`;
    s += `<rect x="${lx}" y="${ly}" width="${w}" height="${h}" fill="none" stroke="${NAVY}" stroke-width="0.75" stroke-dasharray="3 3"/>`;
    s += place("horizontal", lx, ly, h);
    // X markers
    s += `<path d="M${lx - X} ${ly + h / 2}H${lx}M${lx - X} ${ly + h / 2 - 5}v10M${lx} ${ly + h / 2 - 5}v10" stroke="${NAVY}" stroke-width="1"/>`;
    s += text("X", lx - X / 2, ly + h / 2 - 8, { size: 12, weight: 600, anchor: "middle" });
    s += `<path d="M${lx + w / 2} ${ly - X}V${ly}M${lx + w / 2 - 5} ${ly - X}h10M${lx + w / 2 - 5} ${ly}h10" stroke="${NAVY}" stroke-width="1"/>`;
    s += text("X", lx + w / 2 + 10, ly - X / 2 + 4, { size: 12, weight: 600 });
    s += lines(
      [
        "X is the height of the S in SRI SKANDA.",
        "Keep at least X clear on every side: no text,",
        "photo edge or other logo inside the tinted area.",
      ],
      x0,
      ly + h + X + 30,
      18,
      { size: 13 },
    );
  }

  /* 3. Minimum sizes */
  s += label("3  Minimum sizes", x1, y);
  s += `<path d="M${x1} ${y + 12}H${right}" stroke="${RULE}"/>`;
  {
    const specimens: [LogoKind, number, string, string, string][] = [
      ["horizontal", 28, "Horizontal", "28 px high", "9 mm in print"],
      ["stacked", 80, "Stacked", "80 px high", "26 mm in print"],
      ["mark", 16, "Mark", "16 px", "5 mm in print"],
    ];
    const base = y + 36 + 80;
    let sx = x1;
    for (const [kind, px, name, screen, print] of specimens) {
      const w = logoWidth(kind, px);
      s += place(kind, sx, base - px, px);
      s += text(name, sx, base + 22, { size: 13, weight: 600 });
      s += text(screen, sx, base + 39, { size: 12, fill: GRAY });
      s += text(print, sx, base + 55, { size: 12, fill: GRAY });
      sx += Math.max(w, 78) + 16;
    }
    s += lines(
      [
        "Shown at their smallest on-screen size.",
        "Below 28 px high, use the mark or the favicon.",
      ],
      x1,
      base + 90,
      18,
      { size: 13 },
    );
  }

  /* 4. Colour */
  y = 548;
  s += label("4  Colour", x0, y);
  s += `<path d="M${x0} ${y + 12}H${x0 + colW}" stroke="${RULE}"/>`;
  {
    const swatches: [string, string, string, string, string][] = [
      [NAVY, "Navy", "#1A2340", "26 35 64", "59 45 0 75"],
      [LIME, "Lime", "#D8F060", "216 240 96", "10 0 60 6"],
      [NAVY_2, "Navy 2", "#2A3660", "42 54 96", "56 44 0 62"],
      [LIME_LIGHT, "Lime light", "#E8F5A0", "232 245 160", "5 0 35 4"],
      [SURFACE, "Surface", "#EEF8C4", "238 248 196", "4 0 21 3"],
    ];
    const cols = [x0 + 44, x0 + 122, x0 + 192, x0 + 274];
    const head = y + 36;
    ["HEX", "RGB", "CMYK"].forEach((h, i) => {
      s += text(h, cols[i + 1], head, { size: 10, weight: 600, tracking: 0.14, fill: GRAY });
    });
    swatches.forEach(([c, name, hex, rgb, cmyk], i) => {
      const ry = head + 24 + i * 25;
      s += `<rect x="${x0}" y="${ry - 14}" width="34" height="18" fill="${c}"${c === SURFACE || c === LIME_LIGHT ? ` stroke="${RULE}" stroke-width="0.5"` : ""}/>`;
      s += text(name, cols[0], ry, { size: 13, weight: 600 });
      s += text(hex, cols[1], ry, { size: 13 });
      s += text(rgb, cols[2], ry, { size: 13 });
      s += text(cmyk, cols[3], ry, { size: 13 });
    });
    s += lines(
      [
        "Navy and lime are the brand. The other three are tints for",
        "backgrounds. CMYK figures are screen conversions: ask the",
        "printer for a proof before a large run.",
      ],
      x0,
      head + 24 + 5 * 25 + 14,
      17,
      { size: 12, fill: GRAY },
    );
  }

  /* 5. Rules */
  s += label("5  Rules", x1, y);
  s += `<path d="M${x1} ${y + 12}H${right}" stroke="${RULE}"/>`;
  {
    const rules = [
      "On white or pale grounds, use the navy logo. The lime",
      "Vel always sits inside navy.",
      "On navy, use the reversed logo: lime mark, white name.",
      "On lime, use the navy logo.",
      "Never put the lime logo, or lime text, on white.",
      "Never stretch, rotate, outline or recolour the logo.",
      "Never reset the name in another typeface.",
    ];
    const bullets = [0, 2, 3, 4, 5, 6];
    rules.forEach((row, i) => {
      const ry = y + 42 + i * 19;
      if (bullets.includes(i))
        s += `<rect x="${x1}" y="${ry - 8}" width="6" height="6" fill="${NAVY}"/>`;
      s += text(row, x1 + 16, ry, { size: 13 });
    });
    s += label("Typeface", x1, y + 196);
    s += lines(
      [
        "Jost. SRI SKANDA is Jost Medium, letter-spaced 60.",
        "CONSTRUCTIONS is Jost Regular, spaced to the same width.",
      ],
      x1,
      y + 218,
      17,
      { size: 12, fill: GRAY },
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SHEET_W} ${SHEET_H}" width="297mm" height="210mm"><title>${NAME} brand sheet</title>${s}</svg>`;
}

async function exportBrandSheet() {
  console.log("Brand sheet");
  const svg = brandSheetSvg();
  write(join(OUT, "brand-sheet.svg"), svg + "\n");

  const A4: [number, number] = [841.89, 595.28];
  const doc = new PDFDocument({
    size: A4,
    margin: 0,
    info: { Title: `${NAME} brand sheet`, Author: NAME, Subject: "Logo usage" },
  });
  const file = join(OUT, "brand-sheet.pdf");
  const stream = createWriteStream(file);
  doc.pipe(stream);
  // Without the millimetre size the viewBox maps straight onto the page.
  const fluid = svg.replace(' width="297mm" height="210mm"', "");
  SVGtoPDF(doc, fluid, 0, 0, {
    width: A4[0],
    height: A4[1],
    preserveAspectRatio: "xMidYMid meet",
  });
  doc.end();
  await new Promise<void>((resolve, reject) => {
    stream.on("finish", () => resolve());
    stream.on("error", reject);
  });
  console.log("  " + file.replace(ROOT + "/", ""));
}

/* ── Run ────────────────────────────────────────────────────────────── */

async function main() {
  if (MARK.light.length === 0) throw new Error("Logo artwork is empty");
  exportLogos();
  await exportPngs();
  await exportIcons();
  await exportOg();
  await exportBrandSheet();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
