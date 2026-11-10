/**
 * Timing for the home story, shared by the scroll loop, the stage layers
 * and the 3D model.
 *
 * The whole story is one line of time, g, from 0 to 11: the chapter number
 * plus the progress through it. One stage stays on screen the whole way
 * and every chapter hands over to the next at a whole number of g, where a
 * laser line sweeps down the stage and the next drawing appears above it.
 * Nothing scrolls away between chapters, so there is never a gap.
 */
export const CHAPTERS = 11;

/** Half the length of a handover between two chapters, in g. */
export const SWEEP = 0.07;

/** Chapters shown by the 3D model where it runs. The rest are drawings. */
export const THREE_CHAPTERS = [2, 4, 6, 8, 10] as const;
export const isThree = (i: number) => (THREE_CHAPTERS as readonly number[]).includes(i);

/** Extra scroll per chapter on wide screens, in % of the screen height. */
export const LENGTHS = [110, 170, 200, 200, 230, 200, 160, 140, 190, 180, 120];

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smooth = (v: number) => {
  const k = clamp01(v);
  return k * k * (3 - 2 * k);
};

/** Progress (0 to 1) of the handover into chapter k. */
export const sweep = (g: number, k: number) => clamp01((g - (k - SWEEP)) / (2 * SWEEP));

/** The 3D chapter on screen at time g (including its handovers), or -1. */
export function threeChapterAt(g: number): number {
  for (const c of THREE_CHAPTERS) if (g >= c - SWEEP && g < c + 1 + SWEEP) return c;
  return -1;
}

/**
 * Clip for something shown during chapters [from, to): revealed from the
 * top by the sweep into `from`, cut away from the top by the sweep into `to`.
 */
export function windowClip(g: number, from: number, to: number): string {
  const top = sweep(g, to) * 100;
  const bottom = (1 - sweep(g, from)) * 100;
  if (top <= 0 && bottom <= 0) return "none";
  return `inset(${top.toFixed(2)}% 0 ${bottom.toFixed(2)}% 0)`;
}

/** The handover in progress at time g, for the laser line (not 0 to 1, which morphs). */
export function activeSweep(g: number): { k: number; s: number } | null {
  const k = Math.round(g);
  if (k < 2 || k >= CHAPTERS) return null;
  const s = sweep(g, k);
  return s > 0 && s < 1 ? { k, s } : null;
}

/**
 * Drawing progress (--p) of chapter i's layer. From chapter 2 on it starts
 * with the sweep that brings the layer in, so the first lines are already
 * being drawn as the laser passes; 3D chapters follow g itself.
 */
export function layerProgress(g: number, i: number): number {
  if (i < 2) return clamp01(g - i);
  return clamp01((g - i + SWEEP) / (1 + SWEEP));
}

/** The plot turns into the Vastu plan over this part of chapter 0. */
export const MORPH = { from: 0.42, to: 1 };
export const morphAt = (g: number) => smooth((g - MORPH.from) / (MORPH.to - MORPH.from));
