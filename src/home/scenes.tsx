"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { BLOCK, VEL } from "@/brand/logo-art";
import { clamp01, watchScroll } from "@/lib/scroll";
import { PLOT } from "@/scene/building";
import { C, ISO, isoPoint, sc } from "@/scene/iso-core";
import { SCENE_SVG, Tag } from "./parts";

/**
 * Hand-drawn chapter scenes: plans, sections and elevations, which are
 * drawings by nature and so stay as SVG on every device.
 *
 * Elements carry .sc classes with --t0 / --t1, so each one arrives at its
 * moment as the chapter scrolls. With no JavaScript or with reduced motion
 * they simply show their finished state.
 */

const VB = `0 0 ${ISO.w} ${ISO.h}`;

/* ── 00 Groundbreaking: dawn and the mark ───────────────────────────── */

/**
 * The opening drawing: dawn on the horizon and the company mark standing
 * on the plot. The plot itself, with its stakes and strings, is drawn by
 * PlotMorph (layers.tsx), because it carries on into the next chapter.
 * Everything here fades as the plot turns into the Vastu plan.
 */
export function GroundScene({ label }: { label: string }) {
  const { x0, x1, z0, z1 } = PLOT;
  const [cx, cy] = isoPoint((x0 + x1) / 2, 0, (z0 + z1) / 2 + 1.5);
  const s = 4.3;
  const horizon = isoPoint(x0, 0, z0)[1] - 64;
  return (
    <svg viewBox={VB} className={SCENE_SVG} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      <g style={{ opacity: "clamp(0, calc((0.95 - var(--p)) / 0.45), 1)" }}>
        {/* dawn on the horizon, rising as the page scrolls */}
        <g style={{ transform: "translateY(calc(var(--p) * -36px))" }}>
        <g className="gb-dawn">
          <path d={`M${ISO.ox - 120} ${horizon}A120 120 0 0 1 ${ISO.ox + 120} ${horizon}`} fill={C.limeLight} fillOpacity={0.1} stroke={C.limeLight} strokeWidth={1.2} strokeOpacity={0.7} />
          <path d={`M${ISO.ox - 190} ${horizon}A190 190 0 0 1 ${ISO.ox + 190} ${horizon}`} fill="none" stroke={C.limeLight} strokeWidth={0.8} strokeOpacity={0.35} />
        </g>
        </g>
        <path d={`M0 ${horizon}H${ISO.w}`} stroke={C.navy300} strokeOpacity={0.5} strokeWidth={1} />
      </g>
      {/* the mark: drawn in blueprint strokes, then filled; lifts away as the plan forms */}
      <g style={{ opacity: "clamp(0, calc((0.66 - var(--p)) / 0.36), 1)", transform: "translateY(calc(var(--p) * -110px))" }}>
        <g transform={`translate(${cx - 32 * s} ${cy - 60 * s}) scale(${s})`}>
          <path d={`${BLOCK} ${VEL}`} fill={C.lime} fillRule="evenodd" className="gb-fill" />
          <path d={BLOCK} pathLength={1} fill="none" stroke={C.white} strokeWidth={0.45} className="gb-draw" style={{ "--d": "1.5s" } as CSSProperties} />
          <path d={VEL} pathLength={1} fill="none" stroke={C.white} strokeWidth={0.45} className="gb-draw" style={{ "--d": "2s" } as CSSProperties} />
        </g>
        <path d={`M${cx - 150} ${cy}H${cx + 150}`} stroke={C.white} strokeWidth={1.4} className="gb-fill" />
      </g>
    </svg>
  );
}

/* ── 03 Foundation: section through one footing ─────────────────────── */

export function FoundationScene({ label, tags }: { label: string; tags: { plinth: string; column: string; footing: string; pcc: string; soil: string } }) {
  const ground = 300;
  const cxm = 360;
  const leader = (x: number, y: number, t0: number, text: string) => (
    <g className="sc" style={sc(t0, t0 + 0.08)}>
      <path d={`M${x} ${y}H612`} stroke={C.navy300} strokeWidth={1} />
      <circle cx={x} cy={y} r={2.5} fill={C.navy300} />
      <Tag x={622} y={y + 4.5}>{text}</Tag>
    </g>
  );
  return (
    <svg viewBox={VB} className={SCENE_SVG} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="earth" width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V12" stroke={C.navy700} strokeWidth={2} />
        </pattern>
      </defs>
      {/* soil, in section */}
      <g className="sc" style={sc(0, 0.1)}>
        <rect x={40} y={ground} width={720} height={380} fill={C.navy950} />
        <rect x={40} y={ground} width={720} height={380} fill="url(#earth)" />
      </g>
      {/* the trench, dug down from ground level */}
      <rect x={cxm - 170} y={ground} width={340} height={300} fill={C.navy} fillOpacity={0.55} className="sc-fall" style={sc(0.08, 0.24)} />
      <path d={`M40 ${ground}H760`} pathLength={1} stroke={C.white} strokeWidth={2.5} className="sc-draw" style={sc(0, 0.1)} />
      {/* PCC bed */}
      <rect x={cxm - 150} y={ground + 276} width={300} height={24} fill={C.gray400} stroke={C.navy} className="sc" style={sc(0.24, 0.32, -30)} />
      {/* footing concrete, poured and levelled */}
      <g>
        <rect x={cxm - 120} y={ground + 206} width={240} height={70} fill={C.gray300} stroke={C.navy} className="sc-rise" style={sc(0.5, 0.66)} />
        <path d={`M${cxm - 120} ${ground + 218}q30 -8 60 0t60 0t60 0t60 0`} fill="none" stroke={C.white} strokeWidth={1.5} className="sc" style={sc(0.62, 0.7)} />
      </g>
      {/* column concrete rising round the cage */}
      <rect x={cxm - 22} y={ground + 6} width={44} height={200} fill={C.gray300} stroke={C.navy} className="sc-rise" style={sc(0.64, 0.8)} />
      {/* rebar: mat at the bottom, then the column cage lowered in */}
      <g stroke={C.lime} strokeWidth={1.6} fill="none" className="sc" style={sc(0.32, 0.42)}>
        <path d={`M${cxm - 106} ${ground + 258}H${cxm + 106}M${cxm - 106} ${ground + 246}H${cxm + 106}`} />
        {[-90, -60, -30, 0, 30, 60, 90].map((dx) => (
          <path key={dx} d={`M${cxm + dx} ${ground + 242}v20`} />
        ))}
      </g>
      <g stroke={C.lime} strokeWidth={1.6} fill="none" className="sc" style={sc(0.4, 0.54, -220)}>
        <path d={`M${cxm - 14} ${ground - 70}V${ground + 250}M${cxm} ${ground - 70}V${ground + 250}M${cxm + 14} ${ground - 70}V${ground + 250}`} />
        {Array.from({ length: 13 }, (_, n) => (
          <path key={n} d={`M${cxm - 18} ${ground - 60 + n * 24}h36`} />
        ))}
      </g>
      {/* plinth beam at ground level */}
      <rect x={cxm - 250} y={ground - 22} width={500} height={34} fill={C.gray200} stroke={C.navy} className="sc-wipe" style={sc(0.78, 0.9)} />

      {leader(cxm + 250, ground - 5, 0.88, tags.plinth)}
      {leader(cxm + 22, ground + 110, 0.78, tags.column)}
      {leader(cxm + 120, ground + 240, 0.66, tags.footing)}
      {leader(cxm + 150, ground + 288, 0.32, tags.pcc)}
      <g className="sc" style={sc(0.1, 0.2)}>
        <Tag x={64} y={ground + 360}>{tags.soil}</Tag>
        <Tag x={64} y={ground - 12}>GL ±0.00</Tag>
      </g>
      {/* depth dimension */}
      <g className="sc" style={sc(0.2, 0.3)} stroke={C.navy300} strokeWidth={1} fill="none">
        <path d={`M${cxm - 200} ${ground}V${ground + 300}M${cxm - 206} ${ground}h12M${cxm - 206} ${ground + 300}h12`} />
      </g>
    </svg>
  );
}

/* ── 05 Walls and finishing: one bay of the front wall ──────────────── */

export function FinishingScene({ label, tags }: { label: string; tags: { brick: string; plaster: string; paint: string; window: string } }) {
  const X = 110;
  const Y = 110;
  const W = 600;
  const H = 480;
  const rows = 16;
  const rh = H / rows;
  // One rectangle per course, filled with a brick pattern; alternate
  // courses use a pattern shifted by half a brick.
  const bricks = Array.from({ length: rows }, (_, r) => {
    const row = rows - 1 - r; // lay from the bottom up
    return (
      <rect
        key={r}
        x={X}
        y={Y + row * rh}
        width={W}
        height={rh}
        fill={`url(#brick-${row % 2})`}
        className="sc"
        style={sc(0.01 + r * 0.021, 0.06 + r * 0.021, -14)}
      />
    );
  });
  const win = (x: number, t: number, video?: boolean) => (
    <g className="sc" style={sc(t, t + 0.1, 0, 90)}>
      <rect x={x} y={Y + 46} width={150} height={150} fill={C.navy2} stroke={C.navy} strokeWidth={3} data-window={video ? "" : undefined} />
      <path d={`M${x + 75} ${Y + 46}v150M${x} ${Y + 121}h150`} stroke={C.navy} strokeWidth={3} />
      <path d={`M${x + 16} ${Y + 176}L${x + 60} ${Y + 62}`} pathLength={1} stroke={C.limeLight} strokeWidth={4} strokeOpacity={0.85} className="sc-draw" style={sc(t + 0.1, t + 0.17)} />
      <rect x={x - 10} y={Y + 196} width={170} height={10} fill={C.white} stroke={C.navy} />
    </g>
  );
  return (
    <svg viewBox={VB} className={SCENE_SVG} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      <defs>
        {[0, 1].map((n) => (
          <pattern key={n} id={`brick-${n}`} width={60} height={rh} patternUnits="userSpaceOnUse" x={X + (n ? 0 : -30)} y={Y}>
            <rect x={2} y={2} width={56} height={rh - 4} fill={C.gray300} />
          </pattern>
        ))}
      </defs>
      <rect x={X} y={Y} width={W} height={H} fill={C.navy950} />
      {bricks}
      {/* plaster over the upper wall */}
      <rect x={X} y={Y} width={W} height={H * 0.7} fill={C.gray200} className="sc-wipe" style={sc(0.38, 0.52)} />
      {/* paint: white behind a lime leading edge */}
      <rect x={X} y={Y} width={W} height={H * 0.46} fill={C.white} className="sc-wipe" style={sc(0.52, 0.68)} />
      <rect x={X - 14} y={Y} width={14} height={H * 0.46} fill={C.lime} className="sc-sweep" style={{ ...sc(0.52, 0.68), "--travel": `${W}px` } as CSSProperties} />
      {win(X + 80, 0.66, true)}
      {win(X + 370, 0.72)}
      <rect x={X} y={Y} width={W} height={H} fill="none" stroke={C.white} strokeWidth={2} />
      <path d={`M${X - 50} ${Y + H}H${X + W + 50}`} stroke={C.white} strokeWidth={2.5} />

      <g className="sc" style={sc(0.26, 0.34)}>
        <rect x={X + 16} y={Y + H - 44} width={86} height={28} fill={C.navy} />
        <Tag x={X + 28} y={Y + H - 25} fill={C.white}>{tags.brick}</Tag>
      </g>
      <g className="sc" style={sc(0.5, 0.56)}>
        <Tag x={X + 28} y={Y + H * 0.62} fill={C.navy}>{tags.plaster}</Tag>
      </g>
      <g className="sc" style={sc(0.66, 0.72)}>
        <Tag x={X + 28} y={Y + 32} fill={C.navy}>{tags.paint}</Tag>
      </g>
      <g className="sc" style={sc(0.84, 0.92)}>
        <path d={`M${X + 445} ${Y + 46}V${Y - 24}`} stroke={C.navy300} strokeWidth={1} />
        <Tag x={X + 445} y={Y - 32} anchor="middle">{tags.window}</Tag>
      </g>
    </svg>
  );
}

/* ── 08 Handover: the key, dropped into an open hand ────────────────── */

/**
 * The key falls into the hand. On wide screens it falls late in the
 * Handover chapter, while the text stays pinned. On phones the text keeps
 * moving, so the key falls while the hand itself crosses the screen, from
 * the bottom edge up towards the middle of the space under the drawing.
 */
export function KeyAndHand({ label, className = "mt-8 h-auto w-[min(60%,240px)]" }: { label: string; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const narrow = window.matchMedia("(max-width: 1023.98px)");
    let last = "";
    const update = () => {
      if (!narrow.matches) {
        if (last) el.style.removeProperty("--kp");
        last = "";
        return;
      }
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const stage = document.querySelector(".story-backdrop")?.getBoundingClientRect().bottom ?? 0;
      const from = vh - r.height * 0.9;
      const to = Math.min(from - 40, stage + (vh - stage) * 0.25);
      const k = clamp01((from - r.top) / (from - to)).toFixed(3);
      if (k === last) return;
      last = k;
      el.style.setProperty("--kp", k);
    };
    return watchScroll(update);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 220 170"
      className={className}
      role="img"
      aria-label={label}
      style={{ "--kp": "clamp(0, calc((var(--p) - 0.58) / 0.24), 1)" } as CSSProperties}
    >
      <g className="sc" style={{ ...sc(0, 1, -90), "--p": "var(--kp)" } as CSSProperties}>
        <g transform="rotate(-18 96 60)">
          <circle cx={78} cy={60} r={15} fill="none" stroke={C.white} strokeWidth={5} />
          <path d="M93 60h62M134 60v13M148 60v13" fill="none" stroke={C.white} strokeWidth={5} />
          <path d="M70 72l-9 26" stroke={C.lime} strokeWidth={2} />
          <rect x={44} y={96} width={30} height={20} fill={C.lime} />
        </g>
      </g>
      <path
        d="M30 138c6-22 24-30 40-22l14-18c5-6 14-1 11 7l-6 13c18-5 46-5 54 6 7 12-12 26-44 31-30 5-62 3-69-17z"
        fill="none"
        stroke={C.white}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── 09 Sustainable building: front elevation with roof and services ── */

export function SustainableScene({ label, tags }: { label: string; tags: { solar: string; garden: string; rain: string } }) {
  const ground = 560;
  const L = 96;
  const W = 440;
  const fh = 130;
  const windows = (y: number, xs: number[]) =>
    xs.map((x) => <rect key={`${x}-${y}`} x={L + x} y={y} width={70} height={66} fill={C.navy2} stroke={C.navy} strokeWidth={2} />);
  const top = ground - 3 * fh;
  const half = L + W * 0.56;
  return (
    <svg viewBox={VB} className={SCENE_SVG} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      {/* the house, seen from the road */}
      <rect x={L} y={ground - 2 * fh} width={W} height={2 * fh} fill={C.white} stroke={C.navy} strokeWidth={2} />
      <rect x={L} y={top} width={W * 0.56} height={fh} fill={C.white} stroke={C.navy} strokeWidth={2} />
      <path d={`M${L} ${ground - fh}H${L + W}`} stroke={C.navy} strokeWidth={2} />
      {windows(ground - fh + 30, [40, 150])}
      <rect x={L + 300} y={ground - 100} width={62} height={100} fill={C.navy2} stroke={C.navy} strokeWidth={2} />
      {windows(ground - 2 * fh + 30, [40, 150, 300])}
      {windows(top + 32, [40, 150])}
      {/* parapets */}
      <rect x={half} y={ground - 2 * fh - 26} width={W * 0.44 + 8} height={26} fill={C.navy100} stroke={C.navy} strokeWidth={2} />
      <rect x={L - 8} y={top - 16} width={W * 0.56 + 16} height={16} fill={C.navy100} stroke={C.navy} strokeWidth={2} />
      <path d={`M40 ${ground}H760`} stroke={C.white} strokeWidth={2.5} />

      {/* solar panels slide onto the top roof */}
      {[0, 1, 2].map((n) => (
        <g key={n} className="sc" style={sc(0.08 + n * 0.07, 0.22 + n * 0.07, 0, 120)}>
          <path d={`M${L + 18 + n * 78} ${top - 16}l22 -40h56l-22 40z`} fill={C.navy700} stroke={C.navy300} strokeWidth={1.5} />
          <path d={`M${L + 46 + n * 78} ${top - 16}l22 -40M${L + 29 + n * 78} ${top - 36}h56`} stroke={C.navy300} strokeWidth={1} />
        </g>
      ))}
      <g className="sc" style={sc(0.3, 0.38)}>
        <path d={`M${L + 130} ${top - 64}V${top - 96}H${L + 280}`} fill="none" stroke={C.navy300} strokeWidth={1} />
        <Tag x={L + 288} y={top - 91.5}>{tags.solar}</Tag>
      </g>

      {/* terrace garden grows */}
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <circle key={n} cx={half + 26 + n * 31} cy={ground - 2 * fh - 26 - 16 - (n % 2) * 6} r={17 + (n % 3) * 4} fill={C.lime} className="sc-grow" style={sc(0.4 + n * 0.035, 0.54 + n * 0.035)} />
      ))}
      <g className="sc" style={sc(0.6, 0.68)}>
        <path d={`M${half + 150} ${ground - 2 * fh - 70}V${ground - 2 * fh - 100}H${L + W + 40}`} fill="none" stroke={C.navy300} strokeWidth={1} />
        <Tag x={L + W + 48} y={ground - 2 * fh - 95.5}>{tags.garden}</Tag>
      </g>

      {/* rainwater: down the pipe and into the sump */}
      <g className="sc" style={sc(0.66, 0.74)}>
        <rect x={L + W + 46} y={ground + 26} width={120} height={76} fill={C.navy950} stroke={C.navy300} strokeWidth={1.5} />
      </g>
      <rect x={L + W + 48} y={ground + 56} width={116} height={44} fill={C.limeLight} fillOpacity={0.85} className="sc-rise" style={sc(0.86, 1)} />
      <path
        d={`M${L + W + 4} ${ground - 2 * fh - 26}H${L + W + 22}V${ground + 44}H${L + W + 46}`}
        pathLength={1}
        fill="none"
        stroke={C.lime}
        strokeWidth={3}
        className="sc-draw"
        style={sc(0.7, 0.88)}
      />
      <g className="sc" style={sc(0.9, 0.97)}>
        <Tag x={L + W + 106} y={ground + 126} anchor="middle">{tags.rain}</Tag>
      </g>
    </svg>
  );
}
