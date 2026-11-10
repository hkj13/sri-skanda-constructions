"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  COMMERCIAL_PARTS,
  CRANE,
  HOME_PARTS,
  PLOT,
  T,
  isPresent,
  type Part,
  type Tone,
  type Variant,
} from "./building";
import { C, FILL, ISO, isoPoint, pt, sc } from "./iso-core";


/**
 * The building as an isometric SVG drawing, generated from the same parts
 * list as the 3D model. It is server-rendered, so it is the first paint,
 * the phone version, the reduced-motion version and the fallback when 3D is
 * unavailable, all at once.
 *
 * Inside a home chapter the parts carry --t0 / --t1 and the .sc class, so
 * they arrive as the chapter scrolls (see globals.css).
 */

type Box = Part["box"];

function faces([x, y, z, w, h, d]: Box) {
  return {
    top: `M${pt(x, y + h, z)}L${pt(x + w, y + h, z)}L${pt(x + w, y + h, z + d)}L${pt(x, y + h, z + d)}Z`,
    front: `M${pt(x, y, z + d)}L${pt(x + w, y, z + d)}L${pt(x + w, y + h, z + d)}L${pt(x, y + h, z + d)}Z`,
    side: `M${pt(x + w, y, z)}L${pt(x + w, y, z + d)}L${pt(x + w, y + h, z + d)}L${pt(x + w, y + h, z)}Z`,
  };
}

/** Painter's order: lower things first, then back to front. */
const depth = (b: Box) => b[1] * 100 + (b[0] + b[3]) + (b[2] + b[5]);

function BoxShape({
  box,
  tone,
  fills,
  className,
  style,
}: {
  box: Box;
  tone: Tone;
  fills?: [string, string, string];
  className?: string;
  style?: CSSProperties;
}) {
  const f = faces(box);
  const [top, front, side] = fills ?? FILL[tone];
  return (
    <g className={className} style={style} stroke={C.navy} strokeWidth={0.8} strokeLinejoin="round">
      <path d={f.front} fill={front} />
      <path d={f.side} fill={side} />
      <path d={f.top} fill={top} />
    </g>
  );
}

/** Plot boundary, ground grid and survey stakes. */
export function IsoGround({ stakes = true }: { stakes?: boolean }) {
  const { x0, x1, z0, z1 } = PLOT;
  let grid = "";
  for (let x = Math.ceil(x0); x < x1; x += 2) grid += `M${pt(x, 0, z0)}L${pt(x, 0, z1)}`;
  for (let z = Math.ceil(z0); z < z1; z += 2) grid += `M${pt(x0, 0, z)}L${pt(x1, 0, z)}`;
  const outline = `M${pt(x0, 0, z0)}L${pt(x1, 0, z0)}L${pt(x1, 0, z1)}L${pt(x0, 0, z1)}Z`;
  const corners: [number, number][] = [
    [x0, z0],
    [x1, z0],
    [x1, z1],
    [x0, z1],
  ];
  return (
    <g>
      <path d={outline} fill={C.lime} fillOpacity={0.05} />
      <path d={grid} stroke={C.navy700} strokeWidth={0.6} fill="none" />
      <path d={outline} fill="none" stroke={C.lime} strokeWidth={1.2} />
      {stakes
        ? corners.map(([x, z]) => {
            const [sx, sy] = isoPoint(x, 0, z);
            return (
              <g key={`${x}-${z}`}>
                <path d={`M${sx} ${sy}V${sy - 15}`} stroke={C.lime} strokeWidth={2} />
                <rect x={sx - 2.5} y={sy - 19} width={5} height={5} fill={C.lime} />
              </g>
            );
          })
        : null}
    </g>
  );
}

function Crane() {
  const [bx, , bz] = CRANE.base;
  const top = CRANE.mast;
  const lattice: string[] = [];
  for (let y = 0; y < top - 1; y += 1.5) {
    lattice.push(`M${pt(bx + 0.6, y, bz + 0.6)}L${pt(bx, y + 1.5, bz + 0.6)}`);
    lattice.push(`M${pt(bx + 0.6, y, bz + 0.6)}L${pt(bx + 0.6, y + 1.5, bz)}`);
  }
  return (
    <g>
      <BoxShape box={[bx, 0, bz, 0.6, top, 0.6]} tone="slab" />
      <path d={lattice.join("")} stroke={C.navy} strokeWidth={0.6} fill="none" />
      <BoxShape box={[bx - CRANE.counterJib, top, bz + 0.1, CRANE.counterJib, 0.4, 0.4]} tone="slab" />
      <BoxShape box={[bx - CRANE.counterJib, top - 1.1, bz - 0.1, 1.6, 1.1, 0.8]} tone="dark" />
      <BoxShape box={[bx + 0.6, top, bz + 0.1, CRANE.jib, 0.4, 0.4]} tone="slab" />
      <BoxShape box={[bx - 0.1, top + 0.4, bz - 0.1, 0.8, 1.3, 0.8]} tone="white" />
      <path
        d={`M${pt(bx + 0.3, top + 3.2, bz + 0.3)}L${pt(bx + 0.6 + CRANE.jib, top + 0.4, bz + 0.3)}M${pt(bx + 0.3, top + 3.2, bz + 0.3)}L${pt(bx - CRANE.counterJib, top + 0.4, bz + 0.3)}M${pt(bx + 0.3, top + 1.7, bz + 0.3)}L${pt(bx + 0.3, top + 3.2, bz + 0.3)}`}
        stroke={C.navy300}
        strokeWidth={0.8}
        fill="none"
      />
    </g>
  );
}

export type IsoProps = {
  /** Story time shown: chapter number plus progress. */
  g: number;
  variant?: Variant;
  /**
   * When set, parts that arrive during this chapter are timed to its scroll
   * progress instead of simply being present.
   */
  chapter?: number;
  /** Windows lit: always, never, or lighting up through the chapter. */
  lit?: boolean | "animate";
  doorOpen?: boolean | "animate";
  crane?: boolean;
  ground?: boolean;
  label: string;
  className?: string;
  children?: ReactNode;
};

export function IsoBuilding({
  g,
  variant = "home",
  chapter,
  lit = false,
  doorOpen = false,
  crane = false,
  ground = true,
  label,
  className,
  children,
}: IsoProps) {
  const source = variant === "home" ? HOME_PARTS : COMMERCIAL_PARTS;
  const end = chapter === undefined ? g : chapter + 1;
  const parts = source
    .filter((p) => p.t0 < end + 0.0001 && isPresent(p, Math.max(g, p.t0)) && (p.out === undefined || p.out > g))
    .sort((a, b) => depth(a.box) - depth(b.box));

  const timed = (p: Part): { className?: string; style?: CSSProperties } => {
    if (chapter === undefined || p.t1 <= chapter) return {};
    const dy = p.anim === "drop" ? -30 : p.anim === "rise" ? 16 : 0;
    return { className: "sc", style: sc(p.t0 - chapter, p.t1 - chapter, dy) };
  };

  const litFills: [string, string, string] = [C.limeLight, C.limeLight, C.lime];
  const [l0, l1] = T.lights;
  const [d0, d1] = T.doorOpen;
  const doorPart = source.find((p) => p.kind === "door");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${ISO.w} ${ISO.h}`}
      className={className}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      {ground ? <IsoGround /> : null}
      {crane ? <Crane /> : null}
      {parts.map((p) => {
        const isGlass = p.lit !== undefined;
        const glow = isGlass && lit === true && !(p.kind === "door" && !doorOpen);
        return (
          <g key={p.id}>
            <BoxShape box={p.box} tone={p.tone} fills={glow ? litFills : undefined} {...timed(p)} />
            {isGlass && lit === "animate" && chapter !== undefined && p.kind !== "door" ? (
              <BoxShape
                box={p.box}
                tone={p.tone}
                fills={litFills}
                className="sc"
                style={sc(l0 - chapter + p.lit! * (l1 - l0 - 0.08), l0 - chapter + p.lit! * (l1 - l0 - 0.08) + 0.08)}
              />
            ) : null}
          </g>
        );
      })}
      {doorPart && doorOpen ? (
        <g
          className={doorOpen === "animate" && chapter !== undefined ? "sc" : undefined}
          style={doorOpen === "animate" && chapter !== undefined ? sc(d0 - chapter, d1 - chapter) : undefined}
        >
          {/* light falling out of the open door */}
          <path
            d={`M${pt(doorPart.box[0], 0.02, 10.3)}L${pt(doorPart.box[0] + 1.2, 0.02, 10.3)}L${pt(doorPart.box[0] + 2.4, 0.02, 13.2)}L${pt(doorPart.box[0] - 1.2, 0.02, 13.2)}Z`}
            fill={C.limeLight}
            fillOpacity={0.28}
          />
          <BoxShape box={doorPart.box} tone="glass" fills={litFills} />
          {/* the door leaf, swung open */}
          <BoxShape box={[doorPart.box[0] - 0.06, 0.5, 10.27, 0.07, 2.25, 1.05]} tone="white" />
        </g>
      ) : null}
      {children}
    </svg>
  );
}
