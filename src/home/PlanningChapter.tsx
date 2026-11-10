"use client";

import { useEffect, useState } from "react";
import { IsoBuilding } from "@/scene/Iso";
import { C, sc } from "@/scene/iso-core";
import { story } from "@/scene/store";
import type { ChapterCopy } from "@content/home";
import { ChapterText, SCENE_SVG, Stage, Tag } from "./parts";

const X = 190;
const Y = 130;
const M = 44; // pixels per metre

/** A simple ground floor plan, drawn line by line. */
function FloorPlan({ hidden }: { hidden: boolean }) {
  const w = 9 * M;
  const h = 10 * M;
  const line = (d: string, t0: number, width = 3) => (
    <path d={d} pathLength={1} fill="none" stroke={C.white} strokeWidth={width} className="sc-draw" style={sc(t0, t0 + 0.16)} />
  );
  const room = (x: number, y: number, name: string, t: number) => (
    <g className="sc" style={sc(t, t + 0.1)}>
      <Tag x={X + x * M} y={Y + y * M} anchor="middle" fill={C.navy300}>
        {name}
      </Tag>
    </g>
  );
  return (
    <svg
      viewBox="0 0 800 720"
      className={`${SCENE_SVG} transition-opacity duration-300 ${hidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
      role="img"
      aria-hidden={hidden}
      aria-label="Ground floor plan: living room and kitchen at the front, bedrooms, pooja room and bath behind."
      preserveAspectRatio="xMidYMid meet"
    >
      {line(`M${X} ${Y}h${w}v${h}h${-w}z`, 0.02, 5)}
      {line(`M${X + 4.5 * M} ${Y}v${6 * M}`, 0.16)}
      {line(`M${X} ${Y + 3.5 * M}h${4.5 * M}`, 0.22)}
      {line(`M${X + 3 * M} ${Y + 6 * M}h${6 * M}`, 0.28)}
      {line(`M${X + 3 * M} ${Y + 6 * M}v${4 * M}`, 0.34)}
      {line(`M${X + 6.8 * M} ${Y}v${2.4 * M}h${2.2 * M}`, 0.4)}
      {/* door swings */}
      <g className="sc" style={sc(0.5, 0.6)} stroke={C.lime} strokeWidth={1.5} fill="none">
        <path d={`M${X + 6 * M} ${Y + h}v${-1.1 * M}a${1.1 * M} ${1.1 * M} 0 0 1 ${1.1 * M} ${1.1 * M}`} />
        <path d={`M${X + 4.5 * M} ${Y + 4.4 * M}h${1 * M}a${1 * M} ${1 * M} 0 0 1 ${-1 * M} ${1 * M}`} />
        <path d={`M${X + 1.4 * M} ${Y + 3.5 * M}v${1 * M}a${1 * M} ${1 * M} 0 0 1 ${-1 * M} ${-1 * M}`} />
      </g>
      {/* dimension lines */}
      <g className="sc" style={sc(0.56, 0.66)} stroke={C.navy300} strokeWidth={1} fill="none">
        <path d={`M${X} ${Y - 34}h${w}M${X} ${Y - 42}v16M${X + w} ${Y - 42}v16`} />
        <path d={`M${X - 34} ${Y}v${h}M${X - 42} ${Y}h16M${X - 42} ${Y + h}h16`} />
      </g>
      {room(2.2, 1.9, "Bedroom", 0.6)}
      {room(5.6, 1.3, "Pooja", 0.64)}
      {room(7.9, 1.3, "Bath", 0.66)}
      {room(6.8, 4.3, "Kitchen", 0.68)}
      {room(1.5, 5, "Dining", 0.72)}
      {room(1.5, 8.2, "Stairs", 0.76)}
      {room(6, 8.2, "Living", 0.8)}
      <g className="sc" style={sc(0.84, 0.92)}>
        <Tag x={X + w / 2} y={Y + h + 44} anchor="middle" fill={C.lime}>
          Plan · ground floor
        </Tag>
      </g>
    </svg>
  );
}

/** Architectural planning: the same building as a 2D plan or a 3D view. */
export function PlanningChapter({ copy }: { copy: ChapterCopy }) {
  const [view, setView] = useState<"3d" | "2d">("3d");

  useEffect(() => {
    story.planTarget = view === "2d" ? 1 : 0;
  }, [view]);

  const option = (id: "2d" | "3d", label: string) => (
    <label
      className={`relative inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full px-5 font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-accent ${
        view === id ? "bg-accent text-primary" : "text-white hover:text-accent"
      }`}
    >
      <input type="radio" name="plan-view" value={id} checked={view === id} onChange={() => setView(id)} className="sr-only" />
      {label}
    </label>
  );

  const text = (
    <ChapterText copy={copy}>
      <fieldset className="mt-8">
        <legend className="sr-only">Show the building as</legend>
        <div className="inline-flex rounded-full border border-white/50 p-1">
          {option("2d", "2D plan")}
          {option("3d", "3D view")}
        </div>
      </fieldset>
    </ChapterText>
  );

  const scene = (
    <div data-scene-fallback="" className="absolute inset-0">
      <div className={`absolute inset-0 transition-opacity duration-300 ${view === "3d" ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={view !== "3d"}>
        <IsoBuilding
          g={3}
          chapter={2}
          className={`${SCENE_SVG} transition-opacity duration-300`}
          label="3D massing model of the house: three white blocks, the top one set back to leave a terrace."
        />
      </div>
      <div className={`absolute inset-0 ${view === "2d" ? "" : "pointer-events-none"}`}>
        <FloorPlan hidden={view !== "2d"} />
      </div>
    </div>
  );

  return <Stage copy={copy} text={text} scene={scene} slot={2} />;
}
