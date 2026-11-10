import type { Tone } from "./building";
import type { CSSProperties } from "react";

/**
 * Shared constants for the isometric drawings. Kept apart from the drawing
 * components so server code (and the export scripts) can use them too.
 */

export const ISO = { w: 800, h: 720, ox: 410, oy: 418, u: 23 };
const COS30 = 0.8660254;

export function isoPoint(x: number, y: number, z: number): [number, number] {
  return [
    ISO.ox + (x - z) * COS30 * ISO.u,
    ISO.oy + (x + z) * 0.5 * ISO.u - y * ISO.u,
  ];
}

export const pt = (x: number, y: number, z: number) => {
  const [a, b] = isoPoint(x, y, z);
  return `${a.toFixed(1)} ${b.toFixed(1)}`;
};

export const C = {
  navy: "#1a2340",
  navy2: "#2a3660",
  navy950: "#12182b",
  navy700: "#2f3f74",
  navy300: "#a4b1da",
  navy100: "#e9ecf6",
  lime: "#d8f060",
  limeLight: "#e8f5a0",
  white: "#ffffff",
  gray200: "#dddfe3",
  gray300: "#c1c4cd",
  gray400: "#9499a8",
};

/** Face colours per tone: [top, front (+z), side (+x)]. Light comes from the front left. */
export const FILL: Record<Tone, [string, string, string]> = {
  white: ["#ffffff", "#eef0f7", "#d3d8e6"],
  slab: ["#f4f6fb", "#dfe3ee", "#c3c9da"],
  glass: ["#2a3660", "#2a3660", "#222c50"],
  lime: ["#d8f060", "#c8e04e", "#b3ca3e"],
  dark: ["#2f3f74", "#2a3660", "#222c50"],
};

/** Inline custom properties for a scroll-timed element. */
export function sc(t0: number, t1: number, dy = 0, dx = 0): CSSProperties {
  return {
    "--t0": Math.max(0, Math.min(0.999, t0)).toFixed(3),
    "--t1": Math.max(0.001, Math.min(1, t1)).toFixed(3),
    "--dy": `${dy}px`,
    "--dx": `${dx}px`,
  } as CSSProperties;
}

