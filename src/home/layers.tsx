"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Drawing } from "@/scene/Drawing";
import { IsoBuilding } from "@/scene/Iso";
import { PLOT } from "@/scene/building";
import { C, isoPoint, sc } from "@/scene/iso-core";
import { story, subscribe } from "@/scene/store";
import {
  chapters,
  finishingTags,
  foundationTags,
  storyMedia,
  sustainableTags,
  type ChapterId,
} from "@content/home";
import { tr, type L } from "@content/i18n";
import { CENTRE_NOTE, FACINGS, LAYOUTS, ROOMS, type Facing, type RoomId } from "@content/vastu";
import { RenovationStage } from "./BeforeAfter";
import { useChoice } from "./choices";
import { SceneVideo } from "./client";
import { SCENE_SVG, Tag, TitleBlock } from "./parts";
import { FinishingScene, FoundationScene, GroundScene, SustainableScene } from "./scenes";
import { isThree, morphAt } from "./story";

const words = <T extends Record<string, L>>(o: T) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k, tr(v)])) as { [K in keyof T]: string };

/* ── The plot that becomes the Vastu plan (chapters 0 and 1) ────────── */

/** The Vastu plan square, in drawing units. */
const VX = 110;
const VY = 120;
const VS = 540;

const { x0, x1, z0, z1 } = PLOT;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** A point on the ground, part way between the iso view (e = 0) and the plan (e = 1). */
function at(x: number, z: number, e: number): [number, number] {
  const [ax, ay] = isoPoint(x, 0, z);
  const bx = VX + ((x - x0) / (x1 - x0)) * VS;
  const by = VY + ((z - z0) / (z1 - z0)) * VS;
  return [lerp(ax, bx, e), lerp(ay, by, e)];
}

const CORNERS: [number, number, string, "start" | "end"][] = [
  [x0, z0, "D", "start"],
  [x1, z0, "C", "start"],
  [x1, z1, "B", "start"],
  [x0, z1, "A", "end"],
];
const GRID_X: number[] = [];
const GRID_Z: number[] = [];
for (let x = Math.ceil(x0); x < x1; x += 2) GRID_X.push(x);
for (let z = Math.ceil(z0); z < z1; z += 2) GRID_Z.push(z);

const f = (n: number) => n.toFixed(1);

function geometry(e: number) {
  const pts = CORNERS.map(([x, z]) => at(x, z, e));
  const outline = `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L")}Z`;
  let grid = "";
  for (const x of GRID_X) {
    const [ax, ay] = at(x, z0, e);
    const [bx, by] = at(x, z1, e);
    grid += `M${f(ax)} ${f(ay)}L${f(bx)} ${f(by)}`;
  }
  for (const z of GRID_Z) {
    const [ax, ay] = at(x0, z, e);
    const [bx, by] = at(x1, z, e);
    grid += `M${f(ax)} ${f(ay)}L${f(bx)} ${f(by)}`;
  }
  return { pts, outline, grid };
}

const mixHex = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], k))).join(",")})`;
};

/**
 * The surveyed plot from the opening chapter. As the visitor scrolls on it
 * turns, flattens and squares up into the outline of the Vastu plan, the
 * stakes are pulled and the strings come down, so the first two chapters
 * are one continuous drawing.
 */
function PlotMorph() {
  const root = useRef<SVGGElement>(null);
  const start = geometry(0);
  const i = (n: number) => ({ "--i": n }) as CSSProperties;
  const [rx, ry] = at((x0 + x1) / 2, z1, 0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = <T extends Element>(s: string) => Array.from(el.querySelectorAll<T>(s));
    const outline = q<SVGPathElement>("[data-m=outline]");
    const grid = q<SVGPathElement>("[data-m=grid]")[0];
    const strings = q<SVGGElement>("[data-m=string]");
    const stakes = q<SVGGElement>("[data-m=stake]");
    const tags = q<SVGGElement>("[data-m=tag]");
    const road = q<SVGGElement>("[data-m=road]")[0];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = -1;
    let lastFade = -1;
    const update = () => {
      const g = story.g;
      const e = reduced ? (g >= 1 ? 1 : 0) : morphAt(g);
      // The plot's grid gives way to the Vastu grid early in chapter 1.
      const fade = reduced ? (g >= 1 ? 0 : 1) : 1 - Math.min(1, Math.max(0, (g - 1) / 0.16));
      if (Math.abs(e - last) < 0.0004 && Math.abs(fade - lastFade) < 0.004) return;
      last = e;
      lastFade = fade;
      const { pts, outline: d, grid: gd } = geometry(e);
      outline.forEach((o) => o.setAttribute("d", d));
      outline[1].setAttribute("stroke", mixHex(C.lime, C.white, e));
      outline[1].setAttribute("stroke-width", f(lerp(1.2, 2.5, e)));
      grid.setAttribute("d", gd);
      grid.style.opacity = ((1 - 0.4 * e) * fade).toFixed(3);
      const lift = 15 * (1 - e);
      strings.forEach((s, n) => {
        const [ax, ay] = pts[n];
        const [bx, by] = pts[(n + 1) % 4];
        s.firstElementChild?.setAttribute("d", `M${f(ax)} ${f(ay - lift)}L${f(bx)} ${f(by - lift)}`);
        s.style.opacity = (1 - e).toFixed(3);
      });
      stakes.forEach((s, n) => {
        const [x, y] = pts[n];
        const k = 1 - e;
        s.setAttribute("transform", `translate(${f(x)} ${f(y)}) scale(${Math.max(0.001, k).toFixed(3)})`);
        s.style.visibility = k < 0.01 ? "hidden" : "";
      });
      const tagK = Math.max(0, 1 - e * 2.4).toFixed(3);
      tags.forEach((t, n) => {
        const [x, y] = pts[n];
        const side = CORNERS[n][3];
        t.setAttribute("transform", `translate(${f(x + (side === "start" ? 12 : -12))} ${f(y - 28)})`);
        t.style.opacity = tagK;
      });
      const [mx, my] = at((x0 + x1) / 2, z1, e);
      road.setAttribute("transform", `translate(${f(mx)} ${f(my + 34)})`);
      road.style.opacity = tagK;
    };
    update();
    return subscribe(update);
  }, []);

  return (
    <svg viewBox="0 0 800 720" className={SCENE_SVG} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <g ref={root}>
        <path data-m="outline" d={start.outline} fill={C.lime} fillOpacity={0.05} />
        <path data-m="grid" d={start.grid} stroke={C.navy700} strokeWidth={0.6} fill="none" />
        <path data-m="outline" d={start.outline} fill="none" stroke={C.lime} strokeWidth={1.2} />
        {/* string lines, pulled taut between the stakes */}
        {start.pts.map(([ax, ay], n) => {
          const [bx, by] = start.pts[(n + 1) % 4];
          return (
            <g key={n} data-m="string">
              <path d={`M${f(ax)} ${f(ay - 15)}L${f(bx)} ${f(by - 15)}`} pathLength={1} stroke={C.lime} strokeWidth={1.4} className="gb-string" style={i(n)} />
            </g>
          );
        })}
        {start.pts.map(([sx, sy], n) => (
          <g key={n} data-m="stake" transform={`translate(${f(sx)} ${f(sy)})`}>
            <g className="gb-stake" style={i(n)}>
              <path d="M0 3V-20" stroke={C.lime} strokeWidth={3} />
              <rect x={-4} y={-26} width={8} height={8} fill={C.lime} />
            </g>
          </g>
        ))}
        {start.pts.map(([sx, sy], n) => {
          const side = CORNERS[n][3];
          return (
            <g key={n} data-m="tag" transform={`translate(${f(sx + (side === "start" ? 12 : -12))} ${f(sy - 28)})`}>
              <Tag x={0} y={0} anchor={side} className="gb-tag" style={i(n)}>
                {`Stake ${CORNERS[n][2]}`}
              </Tag>
            </g>
          );
        })}
        <g data-m="road" transform={`translate(${f(rx)} ${f(ry + 34)})`}>
          <Tag x={0} y={0} anchor="middle" className="gb-tag" style={i(5)}>
            Road
          </Tag>
        </g>
      </g>
    </svg>
  );
}

/* ── 01 Vastu: the plan inside the plot's outline ───────────────────── */

const CELL = VS / 3;
const ZONES = ["NW", "N", "NE", "W", "", "E", "SW", "S", "SE"];
const ROOM_IDS = Object.keys(ROOMS) as RoomId[];

/** Where the entrance marker sits for a facing: position, rotation, label side. */
function entrance(facing: Facing, k: number) {
  switch (facing) {
    case "N":
      return { x: VX + k * VS, y: VY, rot: 0, lx: VX + k * VS, ly: VY - 26, anchor: "middle" as const };
    case "S":
      return { x: VX + k * VS, y: VY + VS, rot: 0, lx: VX + k * VS, ly: VY + VS + 40, anchor: "middle" as const };
    case "E":
      return { x: VX + VS, y: VY + k * VS, rot: 90, lx: VX + VS + 22, ly: VY + k * VS + 5, anchor: "start" as const };
    case "W":
      return { x: VX, y: VY + k * VS, rot: 90, lx: VX - 22, ly: VY + k * VS + 5, anchor: "end" as const };
  }
}

let mandala = "";
for (let n = 1; n < 9; n++) {
  if (n % 3 === 0) continue;
  mandala += `M${VX + (VS / 9) * n} ${VY}v${VS}M${VX} ${VY + (VS / 9) * n}h${VS}`;
}
const thirds = `M${VX + CELL} ${VY}v${VS}M${VX + 2 * CELL} ${VY}v${VS}M${VX} ${VY + CELL}h${VS}M${VX} ${VY + 2 * CELL}h${VS}`;

function VastuPlan() {
  const [facing] = useChoice("facing");
  const layout = LAYOUTS[facing];
  const e = entrance(facing, layout.entrance);
  return (
    <svg
      viewBox="0 0 800 720"
      className={SCENE_SVG}
      role="img"
      aria-label={`Indicative Vastu layout for a ${tr(FACINGS.find((x) => x.id === facing)!.label).toLowerCase()} facing plot. ${tr(layout.note)}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={mandala} stroke={C.navy700} strokeWidth={1} fill="none" className="sc" style={sc(0.04, 0.18)} />
      <path d={thirds} pathLength={1} stroke={C.lime} strokeWidth={1.5} fill="none" className="sc-draw" style={sc(0.08, 0.28)} />

      {ROOM_IDS.map((id, n) => {
        const cell = layout.rooms[id];
        const zone = ZONES[cell.row * 3 + cell.col];
        return (
          <g
            key={id}
            style={{
              transform: `translate(${VX + cell.col * CELL}px, ${VY + cell.row * CELL}px)`,
              transition: "transform 0.55s var(--ease-snap)",
            }}
          >
            <g className="sc" style={sc(0.26 + n * 0.055, 0.38 + n * 0.055, 18)}>
              <rect x={10} y={10} width={CELL - 20} height={CELL - 20} fill={C.white} />
              <text
                x={CELL / 2}
                y={CELL / 2 - 2}
                textAnchor="middle"
                fontSize={24}
                fontWeight={500}
                fill={C.navy}
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                {tr(ROOMS[id].short)}
              </text>
              <Tag x={CELL / 2} y={CELL / 2 + 26} anchor="middle" fill={C.navy} size={14}>
                {zone}
              </Tag>
            </g>
          </g>
        );
      })}

      <g className="sc" style={sc(0.82, 0.92)}>
        <circle cx={VX + VS / 2} cy={VY + VS / 2 - 8} r={5} fill={C.lime} />
        <Tag x={VX + VS / 2} y={VY + VS / 2 + 18} anchor="middle" size={11.5}>
          {tr(CENTRE_NOTE)}
        </Tag>
      </g>

      {/* entrance on the side that faces the road */}
      <g className="sc" style={sc(0.72, 0.84)}>
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
      <g transform="translate(728 70)">
        <g className="sc" style={sc(0, 0.08)}>
          <circle r={40} fill="none" stroke={C.navy300} strokeWidth={1} />
          <path d="M-40 0h8M32 0h8M0 32v8" stroke={C.navy300} strokeWidth={1} />
          <g className="sc-spin" style={sc(0.04, 0.44)}>
            <path d="M0 -36L11 8L0 0L-11 8Z" fill={C.lime} />
            <path d="M0 36L7 8L0 14L-7 8Z" fill={C.navy300} />
          </g>
          <Tag x={-54} y={5} anchor="middle" fill={C.lime}>
            N
          </Tag>
        </g>
      </g>
    </svg>
  );
}

/* ── 02 Planning: plan or massing (drawn where 3D is off) ───────────── */

const PX = 190;
const PY = 130;
const M = 44; // pixels per metre

function FloorPlan({ hidden }: { hidden: boolean }) {
  const w = 9 * M;
  const h = 10 * M;
  const line = (d: string, t0: number, width = 3) => (
    <path d={d} pathLength={1} fill="none" stroke={C.white} strokeWidth={width} className="sc-draw" style={sc(t0, t0 + 0.16)} />
  );
  const room = (x: number, y: number, name: string, t: number) => (
    <g className="sc" style={sc(t, t + 0.1)}>
      <Tag x={PX + x * M} y={PY + y * M} anchor="middle" fill={C.navy300}>
        {name}
      </Tag>
    </g>
  );
  return (
    <svg
      viewBox="0 0 800 720"
      className={`${SCENE_SVG} transition-opacity duration-300 ${hidden ? "opacity-0" : "opacity-100"}`}
      role="img"
      aria-hidden={hidden}
      aria-label="Ground floor plan: living room and kitchen at the front, bedrooms, pooja room and bath behind."
      preserveAspectRatio="xMidYMid meet"
    >
      {line(`M${PX} ${PY}h${w}v${h}h${-w}z`, 0.02, 5)}
      {line(`M${PX + 4.5 * M} ${PY}v${6 * M}`, 0.16)}
      {line(`M${PX} ${PY + 3.5 * M}h${4.5 * M}`, 0.22)}
      {line(`M${PX + 3 * M} ${PY + 6 * M}h${6 * M}`, 0.28)}
      {line(`M${PX + 3 * M} ${PY + 6 * M}v${4 * M}`, 0.34)}
      {line(`M${PX + 6.8 * M} ${PY}v${2.4 * M}h${2.2 * M}`, 0.4)}
      <g className="sc" style={sc(0.5, 0.6)} stroke={C.lime} strokeWidth={1.5} fill="none">
        <path d={`M${PX + 6 * M} ${PY + h}v${-1.1 * M}a${1.1 * M} ${1.1 * M} 0 0 1 ${1.1 * M} ${1.1 * M}`} />
        <path d={`M${PX + 4.5 * M} ${PY + 4.4 * M}h${1 * M}a${1 * M} ${1 * M} 0 0 1 ${-1 * M} ${1 * M}`} />
        <path d={`M${PX + 1.4 * M} ${PY + 3.5 * M}v${1 * M}a${1 * M} ${1 * M} 0 0 1 ${-1 * M} ${-1 * M}`} />
      </g>
      <g className="sc" style={sc(0.56, 0.66)} stroke={C.navy300} strokeWidth={1} fill="none">
        <path d={`M${PX} ${PY - 34}h${w}M${PX} ${PY - 42}v16M${PX + w} ${PY - 42}v16`} />
        <path d={`M${PX - 34} ${PY}v${h}M${PX - 42} ${PY}h16M${PX - 42} ${PY + h}h16`} />
      </g>
      {room(2.2, 1.9, "Bedroom", 0.6)}
      {room(5.6, 1.3, "Pooja", 0.64)}
      {room(7.9, 1.3, "Bath", 0.66)}
      {room(6.8, 4.3, "Kitchen", 0.68)}
      {room(1.5, 5, "Dining", 0.72)}
      {room(1.5, 8.2, "Stairs", 0.76)}
      {room(6, 8.2, "Living", 0.8)}
      <g className="sc" style={sc(0.84, 0.92)}>
        <Tag x={PX + w / 2} y={PY + h + 44} anchor="middle" fill={C.lime}>
          Plan · ground floor
        </Tag>
      </g>
    </svg>
  );
}

function PlanningVisual() {
  const [view] = useChoice("plan");
  return (
    <div data-scene-fallback="" className="absolute inset-0">
      <div className={`absolute inset-0 transition-opacity duration-300 ${view === "3d" ? "opacity-100" : "opacity-0"}`}>
        <IsoBuilding
          g={3}
          chapter={2}
          className={SCENE_SVG}
          label="3D massing model of the house: three white blocks, the top one set back to leave a terrace."
        />
      </div>
      <FloorPlan hidden={view !== "2d"} />
    </div>
  );
}

/* ── 06 Types: home or commercial (drawn where 3D is off) ───────────── */

function TypesVisual() {
  const [kind] = useChoice("kind");
  return (
    <div data-scene-fallback="" className="absolute inset-0">
      {(["home", "commercial"] as const).map((k) => (
        <div key={k} className={`absolute inset-0 transition-opacity duration-500 ${kind === k ? "opacity-100" : "opacity-0"}`}>
          <Drawing name={k} className={SCENE_SVG} />
        </div>
      ))}
    </div>
  );
}

/* ── Site films and photographs on the drawing sheet ────────────────── */

const WIDE = "(min-width: 1024px)";
const NARROW = "(max-width: 1023.98px)";
const chapterOf = (id: ChapterId) => chapters.findIndex((c) => c.id === id);

function Caption({ children, tone = "text-white" }: { children: ReactNode; tone?: string }) {
  return (
    <figcaption className={`t-tech mt-2.5 flex items-start gap-2 text-[11px] leading-snug ${tone}`}>
      <span aria-hidden="true" className="mt-[3px] h-2 w-2 shrink-0 bg-accent" />
      {children}
    </figcaption>
  );
}

/**
 * The chapter's film or photograph pinned to the drawing sheet, like a
 * reference print. A film plays while its chapter is on the stage. Wide
 * screens only; phones get the same thing under the headline (MediaInText).
 */
function Pinned({ id, style, t0 = 0.2 }: { id: ChapterId; style: CSSProperties; t0?: number }) {
  const m = storyMedia[id]!;
  const frame = "relative overflow-hidden bg-navy-700 ring-1 ring-white/70 shadow-[0_24px_48px_-16px_rgb(7_11_24/0.85)]";
  return (
    <figure className="sc absolute z-[3] hidden lg:block" style={{ ...sc(t0, t0 + 0.14, 30), ...style }}>
      {m.kind === "film" ? (
        <div className={`${frame} ${m.orientation === "portrait" ? "aspect-[9/16]" : "aspect-video"}`}>
          <SceneVideo name={m.video} chapter={chapterOf(id)} media={WIDE} className="story-film-clip inset-0" />
        </div>
      ) : (
        <div className={`${frame} aspect-[3/2]`}>
          <Image src={m.src} alt="" fill sizes="(min-width: 1536px) 380px, 280px" quality={75} className="story-film-clip object-cover" />
        </div>
      )}
      <Caption>{tr(m.caption)}</Caption>
    </figure>
  );
}

/** Window bars drawn over the footage, so the glass keeps its frame. */
function WindowBars() {
  return (
    <svg viewBox="0 0 150 150" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect x={1.5} y={1.5} width={147} height={147} fill="none" stroke={C.navy} strokeWidth={3} />
      <path d="M75 0v150M0 75h150" stroke={C.navy} strokeWidth={3} />
      <path d="M16 130L60 16" stroke={C.limeLight} strokeWidth={4} strokeOpacity={0.7} />
    </svg>
  );
}

/* ── The layers ─────────────────────────────────────────────────────── */

/** What each chapter puts on the stage, inside its 10:9 drawing box. */
function scene(i: number): ReactNode {
  switch (i) {
    case 0:
      return (
        <>
          <GroundScene label="An empty plot at dawn. Four lime survey stakes mark the corners, string lines run between them, and the Sri Skanda Constructions mark stands on the plot." />
        </>
      );
    case 1:
      return (
        <>
          <PlotMorph />
          <VastuPlan />
        </>
      );
    case 2:
      return (
        <>
          <PlanningVisual />
          <Pinned id="planning" style={{ left: "0%", top: "1%", width: "25%" }} t0={0.3} />
        </>
      );
    case 3:
      return (
        <>
          <FoundationScene
            tags={words(foundationTags)}
            label="Section through a foundation: a trench in tested soil, a concrete bed, a steel-reinforced footing, a column rising from it, and a plinth beam at ground level."
          />
          <Pinned id="foundation" style={{ left: "2%", top: "2%", width: "38%" }} t0={0.3} />
        </>
      );
    case 4:
      return (
        <>
          <Pinned id="structure" style={{ left: "72%", top: "5%", width: "15%" }} t0={0.12} />
          <div data-scene-fallback="" className="absolute inset-0">
            <IsoBuilding
              g={5}
              chapter={4}
              crane
              className={SCENE_SVG}
              label="The concrete frame of the house: columns and three floor slabs, with a tower crane behind."
            />
          </div>
        </>
      );
    case 5:
      return (
        <>
          <FinishingScene
            tags={words(finishingTags)}
            label="One bay of the front wall: brick courses at the bottom, plaster above, white paint at the top, and two windows."
          />
          {/* footage in the glass, once the windows are in */}
          {(
            [
              ["left-[23.75%]", "(var(--p) - 0.78) * 12"],
              ["left-[60%]", "(var(--p) - 0.84) * 12"],
            ] as const
          ).map(([left, k]) => (
            <SceneVideo
              key={left}
              name="glass-building"
              chapter={5}
              className={`${left} top-[21.67%] z-[2] h-[20.83%] w-[18.75%]`}
              style={{ opacity: `clamp(0, calc(${k}), 1)` }}
            >
              <WindowBars />
            </SceneVideo>
          ))}
        </>
      );
    case 6:
      return (
        <>
          <TypesVisual />
          <Pinned id="types" style={{ left: "0%", top: "1%", width: "23%" }} t0={0.16} />
        </>
      );
    case 7:
      return <RenovationStage />;
    case 8:
      return (
        <>
          <div data-scene-fallback="" className="absolute inset-0">
            <IsoBuilding
              g={8.99}
              chapter={8}
              lit="animate"
              doorOpen="animate"
              className={SCENE_SVG}
              label="The finished house at dusk: the front door open and the windows lit, one room after another."
            />
          </div>
          <Pinned id="handover" style={{ left: "0%", top: "1%", width: "24%" }} t0={0.22} />
        </>
      );
    case 9:
      return (
        <>
          <SustainableScene
            tags={words(sustainableTags)}
            label="The house from the road with solar panels on the top roof, a garden on the terrace, and a pipe carrying rainwater down to an underground sump."
          />
          <Pinned id="sustainable" style={{ left: "70.5%", top: "34%", width: "23%" }} t0={0.46} />
        </>
      );
    default:
      return (
        <>
          <Pinned id="start" style={{ left: "0%", top: "1%", width: "30%" }} t0={0.12} />
          <div data-scene-fallback="" className="absolute inset-0">
            <Drawing name="finished-lit" className={SCENE_SVG} />
          </div>
        </>
      );
  }
}

/**
 * All eleven chapters' drawings, stacked on one stage. The story's scroll
 * loop (Story.tsx) decides which are showing, sets each one's --p and cuts
 * them with the laser sweep. Chapters drawn by the 3D model are see-through
 * on wide screens, so the model (behind the page) shows in their place.
 */
export function StageLayers() {
  return (
    <>
      {chapters.map((copy, i) => (
        <div
          key={copy.id}
          className="story-layer"
          data-layer={i}
          data-three={isThree(i) ? "" : undefined}
          data-dusk={copy.id === "handover" ? "" : undefined}
          data-overlay={i === 1 ? "" : undefined}
          data-off={i > 1 ? "" : undefined}
          data-far={i > 2 ? "" : undefined}
          style={{ zIndex: i + 1, "--p": i <= 1 ? 0 : 1 } as CSSProperties}
        >
          <TitleBlock sheet={copy.sheet} drawing={copy.drawing} scale={copy.scale} />
          <div className="story-fit">
            <div className="story-box">{scene(i)}</div>
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * The chapter's film or photograph inside the text column. On phones and
 * tablets it comes straight after the headline, at full width, so it shares
 * the screen with the drawing above. With `desktop` it also shows in the
 * text column on wide screens that are tall enough (for chapters whose
 * drawing leaves no room to pin it).
 */
export function MediaInText({ id, desktop = false }: { id: ChapterId; desktop?: boolean }) {
  const m = storyMedia[id];
  if (!m) return null;
  const show = desktop
    ? "hidden max-w-[22rem] lg:block [@media(max-height:859px)]:lg:hidden"
    : "max-w-[28rem] lg:hidden";
  const frame = "relative overflow-hidden bg-navy-700 ring-1 ring-white/40";
  return (
    <figure className={`mt-6 ${show}`}>
      {m.kind === "film" ? (
        // An upright clip fills the same width as the others, cropped square around its subject.
        <div className={`${frame} ${m.orientation === "portrait" ? "aspect-square" : "aspect-video"}`}>
          <SceneVideo
            name={m.video}
            media={NARROW}
            className={`inset-0 ${m.orientation === "portrait" ? "[&>img]:object-[50%_54%] [&>video]:object-[50%_54%]" : ""}`}
          />
        </div>
      ) : (
        <div className={`${frame} aspect-video`}>
          <Image
            src={m.src}
            alt={tr(m.alt)}
            fill
            // A little under the real width on phones: a 2x image is sharp enough and half the weight.
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 28rem, 70vw"
            quality={60}
            className="object-cover"
          />
        </div>
      )}
      <Caption tone="text-navy-300">{tr(m.caption)}</Caption>
    </figure>
  );
}
