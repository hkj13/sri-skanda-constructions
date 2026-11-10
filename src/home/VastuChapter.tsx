"use client";

import { useState } from "react";
import { C, sc } from "@/scene/Iso";
import type { ChapterCopy } from "@content/home";
import { tr } from "@content/i18n";
import {
  CENTRE_NOTE,
  FACINGS,
  INDICATIVE,
  LAYOUTS,
  ROOMS,
  type Facing,
  type RoomId,
} from "@content/vastu";
import { ChapterText, SCENE_SVG, Stage, Tag } from "./parts";

const X0 = 175;
const Y0 = 150;
const S = 450;
const CELL = S / 3;
const ZONES = ["NW", "N", "NE", "W", "", "E", "SW", "S", "SE"];
const ROOM_IDS = Object.keys(ROOMS) as RoomId[];

/** Where the entrance marker sits for a facing: position, rotation, label side. */
function entrance(facing: Facing, at: number) {
  switch (facing) {
    case "N":
      return { x: X0 + at * S, y: Y0, rot: 0, lx: X0 + at * S, ly: Y0 - 26, anchor: "middle" as const };
    case "S":
      return { x: X0 + at * S, y: Y0 + S, rot: 0, lx: X0 + at * S, ly: Y0 + S + 40, anchor: "middle" as const };
    case "E":
      return { x: X0 + S, y: Y0 + at * S, rot: 90, lx: X0 + S + 22, ly: Y0 + at * S + 5, anchor: "start" as const };
    case "W":
      return { x: X0, y: Y0 + at * S, rot: 90, lx: X0 - 22, ly: Y0 + at * S + 5, anchor: "end" as const };
  }
}

/**
 * Vastu and planning: a 3 x 3 plan of the plot. The visitor picks which way
 * the plot faces and the indicative layout rearranges.
 */
export function VastuChapter({ copy }: { copy: ChapterCopy }) {
  const [facing, setFacing] = useState<Facing>("E");
  const layout = LAYOUTS[facing];
  const e = entrance(facing, layout.entrance);

  let mandala = "";
  for (let n = 1; n < 9; n++) {
    if (n % 3 === 0) continue;
    mandala += `M${X0 + (S / 9) * n} ${Y0}v${S}M${X0} ${Y0 + (S / 9) * n}h${S}`;
  }
  const thirds = `M${X0 + CELL} ${Y0}v${S}M${X0 + 2 * CELL} ${Y0}v${S}M${X0} ${Y0 + CELL}h${S}M${X0} ${Y0 + 2 * CELL}h${S}`;

  const text = (
    <ChapterText copy={copy}>
      <fieldset className="mt-8">
        <legend className="t-tech text-white">Your plot faces</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {FACINGS.map((f) => (
            <label
              key={f.id}
              className={`relative inline-flex min-h-12 min-w-[4.75rem] cursor-pointer items-center justify-center rounded-full border px-4 font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-accent ${
                facing === f.id
                  ? "border-accent bg-accent text-primary"
                  : "border-white/50 text-white hover:border-accent"
              }`}
            >
              <input
                type="radio"
                name="facing"
                value={f.id}
                checked={facing === f.id}
                onChange={() => setFacing(f.id)}
                className="sr-only"
              />
              {tr(f.label)}
            </label>
          ))}
        </div>
      </fieldset>
      <p aria-live="polite" className="mt-5 max-w-[38ch] text-white/90">
        {tr(layout.note)}
      </p>
      <p className="t-small mt-4 max-w-[38ch] border-l-2 border-accent pl-4 text-navy-300">
        {tr(INDICATIVE)}
      </p>
    </ChapterText>
  );

  const scene = (
    <svg
      viewBox="0 0 800 720"
      className={SCENE_SVG}
      role="img"
      aria-label={`Indicative Vastu layout for a ${tr(FACINGS.find((f) => f.id === facing)!.label).toLowerCase()} facing plot. ${tr(layout.note)}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={mandala} stroke={C.navy700} strokeWidth={1} fill="none" className="sc" style={sc(0.05, 0.2)} />
      <rect x={X0} y={Y0} width={S} height={S} pathLength={1} fill="none" stroke={C.white} strokeWidth={2.5} className="sc-draw" style={sc(0, 0.14)} />
      <path d={thirds} pathLength={1} stroke={C.lime} strokeWidth={1.5} fill="none" className="sc-draw" style={sc(0.12, 0.3)} />

      {ROOM_IDS.map((id, n) => {
        const cell = layout.rooms[id];
        const zone = ZONES[cell.row * 3 + cell.col];
        return (
          <g
            key={id}
            style={{
              transform: `translate(${X0 + cell.col * CELL}px, ${Y0 + cell.row * CELL}px)`,
              transition: "transform 0.55s var(--ease-snap)",
            }}
          >
            <g className="sc" style={sc(0.3 + n * 0.05, 0.42 + n * 0.05, 18)}>
              <rect x={10} y={10} width={CELL - 20} height={CELL - 20} fill={C.white} />
              <text
                x={CELL / 2}
                y={CELL / 2 - 2}
                textAnchor="middle"
                fontSize={19}
                fontWeight={500}
                fill={C.navy}
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                {tr(ROOMS[id].short)}
              </text>
              <Tag x={CELL / 2} y={CELL / 2 + 22} anchor="middle" fill={C.navy} size={12}>
                {zone}
              </Tag>
            </g>
          </g>
        );
      })}

      <g className="sc" style={sc(0.8, 0.9)}>
        <circle cx={X0 + S / 2} cy={Y0 + S / 2 - 8} r={5} fill={C.lime} />
        <Tag x={X0 + S / 2} y={Y0 + S / 2 + 18} anchor="middle" size={11.5}>
          {tr(CENTRE_NOTE)}
        </Tag>
      </g>

      {/* entrance on the side that faces the road */}
      <g className="sc" style={sc(0.74, 0.86)}>
        <g
          style={{
            transform: `translate(${e.x}px, ${e.y}px) rotate(${e.rot}deg)`,
            transition: "transform 0.55s var(--ease-snap)",
          }}
        >
          <rect x={-38} y={-6} width={76} height={12} fill={C.lime} />
        </g>
        <Tag x={e.lx} y={e.ly} anchor={e.anchor} fill={C.lime}>
          Entrance
        </Tag>
      </g>

      {/* compass, spinning to north */}
      <g transform="translate(700 96)">
        <circle r={44} fill="none" stroke={C.navy300} strokeWidth={1} />
        <path d="M-44 0h10M34 0h10M0 34v10" stroke={C.navy300} strokeWidth={1} />
        <g className="sc-spin" style={sc(0.08, 0.46)}>
          <path d="M0 -36L11 8L0 0L-11 8Z" fill={C.lime} />
          <path d="M0 36L7 8L0 14L-7 8Z" fill={C.navy300} />
        </g>
        <Tag x={0} y={-54} anchor="middle" fill={C.lime}>
          N
        </Tag>
      </g>
    </svg>
  );

  return <Stage copy={copy} text={text} scene={scene} />;
}
