import { C } from "./iso-core";
import { Drawing } from "./Drawing";
import type { DrawingName } from "./drawings";
import { LAYOUTS, ROOMS, type RoomId } from "@content/vastu";
import { tr } from "@content/i18n";
import type { ServiceStage } from "@content/services";

/** Story time and variant shown for each service stage. */
export const STAGE_VIEW: Record<Exclude<ServiceStage, "plan">, { g: number; variant: "home" | "commercial"; drawing: DrawingName }> = {
  massing: { g: 3, variant: "home", drawing: "massing" },
  structure: { g: 5, variant: "home", drawing: "structure" },
  finished: { g: 6.5, variant: "home", drawing: "home" },
  commercial: { g: 6.5, variant: "commercial", drawing: "commercial" },
  handover: { g: 8.99, variant: "home", drawing: "home-lit" },
};

/** A small Vastu plan: nine zones, rooms in their traditional corners. */
export function VastuPlanArt({ className }: { className?: string }) {
  const layout = LAYOUTS.E;
  const X = 175;
  const Y = 150;
  const S = 450;
  const cell = S / 3;
  return (
    <svg viewBox="0 0 800 720" className={className} role="img" aria-label="Indicative Vastu plan for an east-facing plot: pooja room north-east, kitchen south-east, master bedroom south-west, centre kept open.">
      <rect x={X} y={Y} width={S} height={S} fill="none" stroke={C.white} strokeWidth={2.5} />
      <path d={`M${X + cell} ${Y}v${S}M${X + 2 * cell} ${Y}v${S}M${X} ${Y + cell}h${S}M${X} ${Y + 2 * cell}h${S}`} stroke={C.lime} strokeWidth={1.5} />
      {(Object.keys(ROOMS) as RoomId[]).map((id) => {
        const c = layout.rooms[id];
        return (
          <g key={id} transform={`translate(${X + c.col * cell} ${Y + c.row * cell})`}>
            <rect x={10} y={10} width={cell - 20} height={cell - 20} fill={C.white} />
            <text x={cell / 2} y={cell / 2 + 6} textAnchor="middle" fontSize={19} fontWeight={500} fill={C.navy} style={{ fontFamily: "var(--font-jost), sans-serif" }}>
              {tr(ROOMS[id].short)}
            </text>
          </g>
        );
      })}
      <circle cx={X + S / 2} cy={Y + S / 2} r={5} fill={C.lime} />
      <rect x={X + S - 6} y={Y + layout.entrance * S - 38} width={12} height={76} fill={C.lime} />
      <g transform="translate(700 96)">
        <circle r={44} fill="none" stroke={C.navy300} strokeWidth={1} />
        <path d="M0 -36L11 8L0 0L-11 8Z" fill={C.lime} />
      </g>
    </svg>
  );
}

/**
 * The drawing for a service's stage. Where 3D runs, the model takes over
 * the same box (see the data attributes on the slot in PageHero).
 */
export function StageArt({ stage, className, eager }: { stage: ServiceStage; className?: string; eager?: boolean }) {
  if (stage === "plan") return <VastuPlanArt className={className} />;
  return <Drawing name={STAGE_VIEW[stage].drawing} className={className} eager={eager} />;
}

/** Key plan for the contact page: the street, the office, north. */
export function LocationArt({ className }: { className?: string }) {
  const road = C.navy700;
  return (
    <svg viewBox="0 0 800 720" className={className} role="img" aria-label="Key plan: the Sri Skanda Constructions office on 3rd Cross Street, Thirumudi Sethuraman Nagar, Pondicherry.">
      {/* streets */}
      <g stroke={road} strokeWidth={26} strokeLinecap="square" fill="none">
        <path d="M60 470H740" />
        <path d="M250 110V690" />
        <path d="M560 110V690" />
      </g>
      <g stroke={C.navy} strokeWidth={2} strokeDasharray="14 12" fill="none">
        <path d="M60 470H740M250 110V690M560 110V690" />
      </g>
      {/* blocks */}
      {[
        [90, 140, 130, 300],
        [280, 140, 250, 300],
        [590, 140, 130, 300],
        [90, 500, 130, 160],
        [280, 500, 250, 160],
        [590, 500, 130, 160],
      ].map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill="none" stroke={C.navy300} strokeOpacity={0.5} strokeWidth={1.5} />
      ))}
      {/* the plot */}
      <rect x={330} y={330} width={110} height={110} fill={C.lime} fillOpacity={0.12} stroke={C.lime} strokeWidth={2} />
      {[
        [330, 330],
        [440, 330],
        [440, 440],
        [330, 440],
      ].map(([x, y]) => (
        <rect key={`${x}${y}`} x={x - 5} y={y - 5} width={10} height={10} fill={C.lime} />
      ))}
      <g transform="translate(385 385)">
        <circle r={34} fill={C.navy} stroke={C.lime} strokeWidth={3} />
        <path d="M0 -20C2 -12 12 -6 12 4C12 10 4 10 4 15V22H-4V15C-4 10 -12 10 -12 4C-12 -6 -2 -12 0 -20Z" fill={C.lime} />
      </g>
      <g style={{ fontFamily: "var(--font-dm-mono), monospace", letterSpacing: "0.06em", textTransform: "uppercase" }} fontSize={14} fill={C.navy300}>
        <text x={400} y={500} textAnchor="middle">3rd Cross Street</text>
        <text x={385} y={302} textAnchor="middle" fill={C.lime}>No. 51</text>
        <text x={268} y={640} transform="rotate(-90 268 640)">Thirumudi Sethuraman Nagar</text>
        <text x={90} y={96}>Pondicherry 605011</text>
      </g>
      <g transform="translate(700 96)">
        <circle r={44} fill="none" stroke={C.navy300} strokeWidth={1} />
        <path d="M0 -36L11 8L0 0L-11 8Z" fill={C.lime} />
        <text y={-54} textAnchor="middle" fontSize={14} fill={C.lime} style={{ fontFamily: "var(--font-dm-mono), monospace" }}>N</text>
      </g>
      <text x={60} y={700} fontSize={12} fill={C.navy300} style={{ fontFamily: "var(--font-dm-mono), monospace", letterSpacing: "0.06em" }}>
        KEY PLAN · NOT TO SCALE · ILLUSTRATIVE
      </text>
    </svg>
  );
}
