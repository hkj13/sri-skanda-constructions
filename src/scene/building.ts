/**
 * The building, as data.
 *
 * Every part is a box with a time on the story line (chapter number plus
 * progress through that chapter) at which it arrives. The same list feeds
 * two renderers: the 3D model (Scene3D.tsx) and the isometric drawing
 * (Iso.tsx) used on phones, as the first paint, and wherever 3D is off.
 *
 * Units are metres. x runs right, z runs towards the road, y is up.
 * The viewer stands at +x, +z, so the +z face is the front.
 */

export type Tone = "white" | "slab" | "glass" | "lime" | "dark";
export type Anim = "rise" | "drop" | "fade";
export type Variant = "home" | "commercial";

export type Part = {
  id: string;
  /** Min corner (x, y, z) and size (w, h, d). */
  box: [number, number, number, number, number, number];
  tone: Tone;
  kind: "plinth" | "column" | "slab" | "mass" | "volume" | "window" | "door" | "trim" | "extra";
  /** When it starts and finishes arriving. */
  t0: number;
  t1: number;
  /** When it is taken away again. */
  out?: number;
  anim: Anim;
  variant?: Variant;
  /** For windows: 0 to 1, the order in which they light up at handover. */
  lit?: number;
};

/** Plot corners (x, z). The road runs along the +z edge. */
export const PLOT = { x0: -2.6, x1: 11.6, z0: -2.6, z1: 13.4 };

/** Floor levels of the home: plinth, first, second, roof. */
export const LEVELS = [0.5, 3.6, 6.7, 9.8];
const SLAB = 0.22;
const COL = 0.36;
const GRID_X = [0, 4.5, 9];
const GRID_Z = [0, 5, 10];

/** Story times, so chapters and the model agree. */
export const T = {
  massIn: 2.12,
  massOut: 3.4,
  frame: 4.06,
  floorStep: 0.27,
  wallsIn: 5.9,
  doorOpen: [8.15, 8.35] as const,
  lights: [8.3, 8.8] as const,
  extras: 9.9,
};

function homeParts(): Part[] {
  const parts: Part[] = [];
  const add = (p: Omit<Part, "variant">) => parts.push({ ...p, variant: "home" });

  /* Massing model for the planning chapter */
  const volumes: [number, number, number, number, number, number][] = [
    [-0.2, 0.5, -0.2, 9.4, 3.1, 10.4],
    [-0.2, 3.6, -0.2, 9.4, 3.1, 10.4],
    [-0.2, 6.7, -0.2, 9.4, 3.1, 5.4],
  ];
  volumes.forEach((box, f) =>
    add({ id: `mass-${f}`, box, tone: "white", kind: "mass", anim: "rise", t0: T.massIn + f * 0.09, t1: T.massIn + 0.2 + f * 0.09, out: T.massOut }),
  );

  /* Structure: plinth, then columns and a slab for each floor */
  add({ id: "plinth", box: [-0.4, 0.14, -0.4, 9.8, 0.36, 10.8], tone: "slab", kind: "plinth", anim: "fade", t0: 3.9, t1: 4.0 });
  for (let f = 0; f < 3; f++) {
    const base = T.frame + f * T.floorStep;
    const zs = f < 2 ? GRID_Z : GRID_Z.slice(0, 2);
    let i = 0;
    for (const z of zs) {
      for (const x of GRID_X) {
        add({
          id: `col-${f}-${x}-${z}`,
          box: [x - COL / 2, LEVELS[f], z - COL / 2, COL, 3.1 - SLAB, COL],
          tone: "white",
          kind: "column",
          anim: "rise",
          t0: base + i * 0.007,
          t1: base + 0.1 + i * 0.007,
          out: T.wallsIn,
        });
        i++;
      }
    }
    const depth = f < 2 ? 10.8 : 5.8;
    add({
      id: `slab-${f}`,
      box: [-0.4, LEVELS[f + 1] - SLAB, -0.4, 9.8, SLAB, depth],
      tone: "slab",
      kind: "slab",
      anim: "drop",
      t0: base + 0.14,
      t1: base + 0.24,
    });
  }

  /* Walls: each floor as one white volume, closing around the frame */
  volumes.forEach((box, f) =>
    add({ id: `vol-${f}`, box: [box[0], box[1], box[2], box[3], box[4] - SLAB, box[5]], tone: "white", kind: "volume", anim: "rise", t0: T.wallsIn, t1: T.wallsIn + 0.06 }),
  );

  /* Parapets around the terrace and the top roof */
  const trim = (id: string, box: Part["box"]) =>
    add({ id, box, tone: "white", kind: "trim", anim: "fade", t0: T.wallsIn, t1: T.wallsIn + 0.06 });
  trim("terrace-front", [-0.4, 6.7, 10.28, 9.8, 0.9, 0.12]);
  trim("terrace-left", [-0.4, 6.7, 5.4, 0.12, 0.9, 4.9]);
  trim("terrace-right", [9.28, 6.7, 5.4, 0.12, 0.9, 4.9]);
  trim("roof-front", [-0.4, 9.8, 5.28, 9.8, 0.55, 0.12]);
  trim("roof-back", [-0.4, 9.8, -0.4, 9.8, 0.55, 0.12]);
  trim("roof-left", [-0.4, 9.8, -0.28, 0.12, 0.55, 5.56]);
  trim("roof-right", [9.28, 9.8, -0.28, 0.12, 0.55, 5.56]);
  add({ id: "canopy", box: [5.1, 2.95, 10.2, 2.8, 0.14, 1.4], tone: "slab", kind: "trim", anim: "fade", t0: T.wallsIn, t1: T.wallsIn + 0.06 });

  /* Door and windows: thin panels on the two faces the viewer sees */
  add({ id: "door", box: [5.9, 0.5, 10.2, 1.2, 2.25, 0.07], tone: "glass", kind: "door", anim: "fade", t0: T.wallsIn, t1: T.wallsIn + 0.06, lit: 0 });
  const win = (id: string, box: Part["box"], lit: number) =>
    add({ id, box, tone: "glass", kind: "window", anim: "fade", t0: T.wallsIn, t1: T.wallsIn + 0.06, lit });
  win("w-g-front", [1.0, 1.35, 10.2, 3.3, 1.5, 0.07], 0.15);
  win("w-1-front-a", [1.0, 4.45, 10.2, 2.5, 1.55, 0.07], 0.45);
  win("w-1-front-b", [5.5, 4.45, 10.2, 2.5, 1.55, 0.07], 0.3);
  win("w-2-front-a", [1.2, 7.3, 5.2, 2.6, 1.8, 0.07], 0.9);
  win("w-2-front-b", [5.4, 7.3, 5.2, 2.6, 1.8, 0.07], 0.75);
  win("w-g-side-a", [9.2, 1.35, 1.2, 0.07, 1.5, 2.7], 0.6);
  win("w-g-side-b", [9.2, 1.35, 6.1, 0.07, 1.5, 2.7], 0.25);
  win("w-1-side-a", [9.2, 4.45, 1.2, 0.07, 1.55, 2.7], 0.55);
  win("w-1-side-b", [9.2, 4.45, 6.1, 0.07, 1.55, 2.7], 0.7);
  win("w-2-side", [9.2, 7.5, 1.2, 0.07, 1.55, 2.7], 1);

  /* Solar panels and terrace garden, planned in the sustainable chapter */
  for (let i = 0; i < 3; i++)
    add({ id: `solar-${i}`, box: [0.7 + i * 2.8, 10.0, 0.8, 2.4, 0.1, 3.4], tone: "dark", kind: "extra", anim: "drop", t0: T.extras, t1: T.extras + 0.08 });
  add({ id: "garden-front", box: [0.2, 6.7, 8.9, 8.6, 1.25, 0.9], tone: "lime", kind: "extra", anim: "rise", t0: T.extras, t1: T.extras + 0.08 });
  add({ id: "garden-side", box: [0.2, 6.7, 5.9, 0.9, 1.25, 2.6], tone: "lime", kind: "extra", anim: "rise", t0: T.extras, t1: T.extras + 0.08 });

  return parts;
}

function commercialParts(): Part[] {
  const parts: Part[] = [];
  const add = (p: Omit<Part, "variant" | "t0" | "t1" | "anim"> & { anim?: Anim }) =>
    parts.push({ anim: "rise", ...p, t0: T.wallsIn, t1: T.wallsIn + 0.06, variant: "commercial" });
  const X0 = -1.4;
  const W = 11.8;
  const H = 3.3;
  add({ id: "c-plinth", box: [X0 - 0.2, 0.14, -0.4, W + 0.4, 0.36, 10.8], tone: "slab", kind: "plinth" });
  for (let f = 0; f < 4; f++) {
    const y = 0.5 + f * H;
    add({ id: `c-vol-${f}`, box: [X0, y, -0.2, W, H - SLAB, 10.4], tone: "white", kind: "volume" });
    add({ id: `c-slab-${f}`, box: [X0 - 0.2, y + H - SLAB, -0.4, W + 0.4, SLAB, 10.8], tone: "slab", kind: "slab" });
    if (f === 0) {
      // Shopfronts
      [0, 1, 2].forEach((i) =>
        add({ id: `c-shop-${i}`, box: [X0 + 0.6 + i * 3.7, 0.6, 10.2, 3.1, 2.4, 0.07], tone: "glass", kind: "window", lit: i * 0.2 }),
      );
      add({ id: "c-side-g", box: [X0 + W, 0.9, 1.0, 0.07, 2.0, 8.0], tone: "glass", kind: "window", lit: 0.5 });
    } else {
      add({ id: `c-strip-f-${f}`, box: [X0 + 0.7, y + 0.95, 10.2, W - 1.4, 1.45, 0.07], tone: "glass", kind: "window", lit: 0.3 + f * 0.2 });
      add({ id: `c-strip-s-${f}`, box: [X0 + W, y + 0.95, 0.9, 0.07, 1.45, 8.2], tone: "glass", kind: "window", lit: 0.4 + f * 0.2 });
    }
  }
  // Signboard band above the shopfronts, in lime like a hi-vis stripe
  add({ id: "c-fascia", box: [X0 - 0.1, 3.02, 10.2, W + 0.2, 0.5, 0.28], tone: "lime", kind: "trim", anim: "fade" });
  const top = 0.5 + 4 * H;
  add({ id: "c-par-front", box: [X0 - 0.2, top, 10.28, W + 0.4, 0.6, 0.12], tone: "white", kind: "trim", anim: "fade" });
  add({ id: "c-par-back", box: [X0 - 0.2, top, -0.4, W + 0.4, 0.6, 0.12], tone: "white", kind: "trim", anim: "fade" });
  add({ id: "c-par-left", box: [X0 - 0.2, top, -0.28, 0.12, 0.6, 10.56], tone: "white", kind: "trim", anim: "fade" });
  add({ id: "c-par-right", box: [X0 + W + 0.08, top, -0.28, 0.12, 0.6, 10.56], tone: "white", kind: "trim", anim: "fade" });
  add({ id: "c-core", box: [X0 + 1.0, top, 0.6, 3.2, 2.3, 3.6], tone: "white", kind: "volume" });
  return parts;
}

export const HOME_PARTS = homeParts();
export const COMMERCIAL_PARTS = commercialParts();

/** A tower crane, for the structure chapter. Mast at the back-left corner. */
export const CRANE = {
  base: [-1.9, 0, -1.9] as const,
  mast: 16.5,
  jib: 13,
  counterJib: 4.2,
};

/** Is this part standing at story time g? */
export function isPresent(part: Part, g: number): boolean {
  return g >= part.t0 && (part.out === undefined || g < part.out);
}

/** Height of the tallest part present at g: the camera looks at its middle. */
export function heightAt(parts: Part[], g: number): number {
  let h = 0.5;
  for (const p of parts) if (isPresent(p, g)) h = Math.max(h, p.box[1] + p.box[4]);
  return h;
}
