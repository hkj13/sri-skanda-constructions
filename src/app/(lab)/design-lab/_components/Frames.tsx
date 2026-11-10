import type { ReactNode } from "react";
import { LogoUse } from "@/brand/Logo";
import { BLOCK, VEL } from "@/brand/logo-art";

/**
 * Rough storyboard frames. Each is a 320 x 180 (or 180 x 320 for phones)
 * sketch of one moment, drawn with the real palette and the real logo so
 * proportions and colour can be judged, but without detail.
 */

const C = {
  n: "#1a2340",
  n2: "#2a3660",
  n950: "#12182b",
  n700: "#2f3f74",
  n300: "#a4b1da",
  n100: "#e9ecf6",
  l: "#d8f060",
  ll: "#e8f5a0",
  w: "#ffffff",
  s: "#eef8c4",
  g200: "#dddfe3",
  g300: "#c1c4cd",
  g400: "#9499a8",
  g600: "#5c6170",
  wa: "#25d366",
};

const JOST = "var(--font-jost), sans-serif";
const MONO = "var(--font-dm-mono), ui-monospace, monospace";

/* ── Primitives ─────────────────────────────────────────────────────── */

function Grid({ w = 320, h = 180, step = 16, color = C.n2, opacity = 1 }) {
  let d = "";
  for (let x = step; x < w; x += step) d += `M${x} 0V${h}`;
  for (let y = step; y < h; y += step) d += `M0 ${y}H${w}`;
  return <path d={d} stroke={color} strokeWidth={0.4} strokeOpacity={opacity} fill="none" />;
}

function Header({ w = 320, light = false, compact = false }) {
  const fg = light ? C.n : C.w;
  return (
    <g className={light ? "logo-light" : "logo-dark"}>
      <rect width={w} height={14} fill={light ? C.w : C.n} fillOpacity={light ? 1 : 0.85} />
      <LogoUse kind="horizontal" variant={light ? "light" : "dark"} x={10} y={3.5} height={7} />
      {compact ? (
        <path d={`M${w - 18} 5h8M${w - 18} 7h8M${w - 18} 9h8`} stroke={fg} strokeWidth={0.7} />
      ) : (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={w - 118 + i * 20} y={6.3} width={14} height={1.6} fill={fg} fillOpacity={0.8} />
          ))}
          <rect x={w - 36} y={3.5} width={28} height={7} rx={3.5} fill={light ? C.n : C.l} />
        </g>
      )}
    </g>
  );
}

/** The laser line: scroll progress along the bottom edge of the header. */
function Laser({ p, w = 320, y = 14 }: { p: number; w?: number; y?: number }) {
  return <rect x={0} y={y} width={w * p} height={0.9} fill={C.l} />;
}

function Text({
  x,
  y,
  children,
  size = 6,
  fill = C.w,
  weight = 400,
  anchor,
  mono,
  track,
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  fill?: string;
  weight?: number;
  anchor?: "start" | "middle" | "end";
  mono?: boolean;
  track?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fill={fill}
      fontWeight={weight}
      textAnchor={anchor}
      style={{
        fontFamily: mono ? MONO : JOST,
        letterSpacing: track ? `${track}em` : undefined,
      }}
    >
      {children}
    </text>
  );
}

function Eyebrow({ x = 16, y, children, fill = C.l }: { x?: number; y: number; children: ReactNode; fill?: string }) {
  return (
    <Text x={x} y={y} size={4.6} fill={fill} weight={600} track={0.18}>
      {children}
    </Text>
  );
}

function Headline({ x = 16, y, lines, size = 13, fill = C.w }: { x?: number; y: number; lines: string[]; size?: number; fill?: string }) {
  return (
    <g>
      {lines.map((line, i) => (
        <Text key={line} x={x} y={y + i * size * 1.05} size={size} weight={300} fill={fill}>
          {line}
        </Text>
      ))}
    </g>
  );
}

function Bars({ x = 16, y, widths, fill = C.n300, h = 1.6, gap = 4 }: { x?: number; y: number; widths: number[]; fill?: string; h?: number; gap?: number }) {
  return (
    <g>
      {widths.map((w, i) => (
        <rect key={i} x={x} y={y + i * gap} width={w} height={h} fill={fill} fillOpacity={0.85} />
      ))}
    </g>
  );
}

function Pill({
  x,
  y,
  w,
  label,
  kind,
  h = 10,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  kind: "whatsapp" | "lime" | "navy" | "outline" | "outline-dark";
  h?: number;
}) {
  const styles = {
    whatsapp: { fill: C.wa, stroke: "none", text: C.n },
    lime: { fill: C.l, stroke: "none", text: C.n },
    navy: { fill: C.n, stroke: "none", text: C.w },
    outline: { fill: "none", stroke: C.w, text: C.w },
    "outline-dark": { fill: "none", stroke: C.n, text: C.n },
  }[kind];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={styles.fill} stroke={styles.stroke} strokeWidth={0.5} />
      <Text x={x + w / 2} y={y + h / 2 + 1.6} size={4.4} weight={600} fill={styles.text} anchor="middle">
        {label}
      </Text>
    </g>
  );
}

function Tag({ x, y, children, anchor, fill = C.n300 }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end"; fill?: string }) {
  return (
    <Text x={x} y={y} size={3.8} fill={fill} anchor={anchor} mono track={0.06}>
      {children}
    </Text>
  );
}

function Leader({ d, color = C.n300 }: { d: string; color?: string }) {
  return <path d={d} stroke={color} strokeWidth={0.35} fill="none" />;
}

/** Drawing title block, bottom right, like the corner of a real drawing sheet. */
function TitleBlock({ sheet, title, scale, w = 320, h = 180, light = false }: { sheet: string; title: string; scale: string; w?: number; h?: number; light?: boolean }) {
  const x = w - 86;
  const y = h - 18;
  const fg = light ? C.n : C.n300;
  return (
    <g>
      <rect x={x} y={y} width={78} height={12} fill="none" stroke={fg} strokeWidth={0.35} />
      <path d={`M${x + 18} ${y}V${y + 12}M${x + 62} ${y}V${y + 12}`} stroke={fg} strokeWidth={0.35} />
      <Tag x={x + 9} y={y + 7.4} anchor="middle" fill={light ? C.n : C.l}>
        {sheet}
      </Tag>
      <Tag x={x + 40} y={y + 7.4} anchor="middle" fill={fg}>
        {title}
      </Tag>
      <Tag x={x + 70} y={y + 7.4} anchor="middle" fill={fg}>
        {scale}
      </Tag>
    </g>
  );
}

/** Chapter index rail on the right edge, with the active sheet in lime. */
function Rail({ active, h = 180, x = 312 }: { active: number; h?: number; x?: number }) {
  const top = 34;
  const step = (h - 70) / 10;
  return (
    <g>
      {Array.from({ length: 11 }, (_, i) => (
        <rect
          key={i}
          x={x - (i === active ? 3 : 1.5)}
          y={top + i * step}
          width={i === active ? 6 : 3}
          height={0.9}
          fill={i === active ? C.l : C.n300}
        />
      ))}
    </g>
  );
}

/** Hatched area standing in for a masked video layer. */
function VideoLayer({ x, y, w, h, name, id, labelBelow }: { x: number; y: number; w: number; h: number; name: string; id: string; labelBelow?: boolean }) {
  return (
    <g>
      <defs>
        <pattern id={id} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V4" stroke={C.n700} strokeWidth={1} />
        </pattern>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
      <Tag x={labelBelow ? x : x + 3} y={labelBelow ? y + h + 6 : y + 6}>{`VIDEO · ${name}`}</Tag>
    </g>
  );
}

function Frame({ children, label, w = 320, h = 180, bg = C.n }: { children: ReactNode; label: string; w?: number; h?: number; bg?: string }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="logo-dark block h-auto w-full" role="img" aria-label={label}>
      <rect width={w} height={h} fill={bg} />
      {children}
    </svg>
  );
}

/* ── Isometric helper ───────────────────────────────────────────────── */

type Iso = { ox: number; oy: number; s: number };

function isoPt(o: Iso, x: number, y: number, z: number): string {
  return `${(o.ox + (x - z) * 0.866 * o.s).toFixed(2)} ${(o.oy + (x + z) * 0.5 * o.s - y * o.s).toFixed(2)}`;
}

function IsoBox({
  o,
  x,
  z,
  w,
  d,
  h,
  y = 0,
  top = C.w,
  left = C.n100,
  right = C.g300,
  edge = C.n,
  windows,
}: {
  o: Iso;
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  y?: number;
  top?: string;
  left?: string;
  right?: string;
  edge?: string;
  windows?: { lit: boolean[] };
}) {
  const p = (px: number, py: number, pz: number) => isoPt(o, px, py, pz);
  const topFace = `M${p(x, y + h, z)}L${p(x + w, y + h, z)}L${p(x + w, y + h, z + d)}L${p(x, y + h, z + d)}Z`;
  const rightFace = `M${p(x + w, y, z)}L${p(x + w, y, z + d)}L${p(x + w, y + h, z + d)}L${p(x + w, y + h, z)}Z`;
  const leftFace = `M${p(x, y, z + d)}L${p(x + w, y, z + d)}L${p(x + w, y + h, z + d)}L${p(x, y + h, z + d)}Z`;
  const wins: ReactNode[] = [];
  if (windows) {
    const n = windows.lit.length;
    for (let i = 0; i < n; i++) {
      const wx = x + (w / n) * (i + 0.3);
      const ww = (w / n) * 0.4;
      const wy = y + h * 0.35;
      const wh = h * 0.35;
      wins.push(
        <path
          key={i}
          d={`M${p(wx, wy, z + d)}L${p(wx + ww, wy, z + d)}L${p(wx + ww, wy + wh, z + d)}L${p(wx, wy + wh, z + d)}Z`}
          fill={windows.lit[i] ? C.ll : C.n700}
        />,
      );
    }
  }
  return (
    <g stroke={edge} strokeWidth={0.4} strokeLinejoin="round">
      <path d={leftFace} fill={left} />
      <path d={rightFace} fill={right} />
      <path d={topFace} fill={top} />
      {wins}
    </g>
  );
}

/* ── Chapter frames ─────────────────────────────────────────────────── */

export function F0Groundbreaking() {
  return (
    <Frame label="Groundbreaking: an empty plot at dawn on navy blueprint ground, lime survey stakes and string lines, the logo outline standing on the plot, headline and WhatsApp button on the left.">
      <Grid />
      <rect y={118} width={320} height={62} fill={C.n950} />
      <path d="M0 118H320" stroke={C.n700} strokeWidth={0.6} />
      <path d="M214 118A24 24 0 0 1 262 118" stroke={C.ll} strokeWidth={0.6} strokeOpacity={0.6} fill="none" />
      <g stroke={C.n700} strokeWidth={0.35}>
        {[-80, -40, 0, 40, 80, 130].map((dx) => (
          <path key={dx} d={`M238 118L${238 + dx * 2.2} 180`} />
        ))}
      </g>
      {/* plot boundary: stakes and string */}
      <path d="M160 166L292 166L270 130L190 130Z" fill={C.l} fillOpacity={0.07} stroke={C.l} strokeWidth={0.7} />
      {(
        [
          [160, 166, "A", "start"],
          [292, 166, "B", "end"],
          [270, 130, "C", "end"],
          [190, 130, "D", "start"],
        ] as const
      ).map(([x, y, n, side]) => (
        <g key={n}>
          <path d={`M${x} ${y}V${y - 9}`} stroke={C.l} strokeWidth={1.2} />
          <rect x={x - 1.4} y={y - 11} width={2.8} height={2.8} fill={C.l} />
          <Tag x={side === "start" ? x + 3 : x - 3} y={y - 8} anchor={side}>{`STAKE ${n}`}</Tag>
        </g>
      ))}
      {/* the mark drawn in blueprint strokes, standing on the plot */}
      <g transform="translate(200 98) scale(0.82)">
        <path d={BLOCK} fill="none" stroke={C.w} strokeWidth={0.9} />
        <path d={VEL} fill="none" stroke={C.l} strokeWidth={0.9} />
      </g>
      <Header />
      <Laser p={0.02} />
      <Eyebrow y={44}>SARAM, PONDICHERRY</Eyebrow>
      <Headline y={62} lines={["From the first stake", "to the house key."]} size={15} />
      <Bars y={88} widths={[118, 96]} />
      <Pill x={16} y={104} w={92} label="Plan your build on WhatsApp" kind="whatsapp" />
      <Pill x={112} y={104} w={62} label="Get a free estimate" kind="outline" />
      <Text x={16} y={128} size={4.4} fill={C.n300} weight={500}>
        Skip the story ↓
      </Text>
      <Rail active={0} />
    </Frame>
  );
}

export function F1Vastu() {
  const x0 = 150;
  const y0 = 28;
  const s = 112;
  const c = s / 3;
  let mandala = "";
  for (let i = 1; i < 9; i++) mandala += `M${x0 + (s / 9) * i} ${y0}V${y0 + s}M${x0} ${y0 + (s / 9) * i}H${x0 + s}`;
  const room = (cx: number, cy: number, label: string) => (
    <g>
      <rect x={x0 + cx * c + 3} y={y0 + cy * c + 3} width={c - 6} height={c - 6} fill={C.w} fillOpacity={0.92} />
      <Tag x={x0 + cx * c + c / 2} y={y0 + cy * c + c / 2 + 1.3} anchor="middle" fill={C.n}>
        {label}
      </Tag>
    </g>
  );
  return (
    <Frame label="Vastu and planning: a nine-by-nine Vastu grid over the plot, compass pointing north, rooms in their zones, and buttons to choose the plot's facing direction.">
      <Grid />
      <path d={mandala} stroke={C.n700} strokeWidth={0.35} fill="none" />
      <rect x={x0} y={y0} width={s} height={s} fill="none" stroke={C.w} strokeWidth={0.8} />
      <path d={`M${x0 + c} ${y0}V${y0 + s}M${x0 + 2 * c} ${y0}V${y0 + s}M${x0} ${y0 + c}H${x0 + s}M${x0} ${y0 + 2 * c}H${x0 + s}`} stroke={C.l} strokeWidth={0.5} />
      {room(2, 0, "POOJA · NE")}
      {room(2, 2, "KITCHEN · SE")}
      {room(0, 2, "MASTER · SW")}
      {room(1, 0, "LIVING · N")}
      <circle cx={x0 + s / 2} cy={y0 + s / 2} r={2} fill={C.l} />
      <Tag x={x0 + s / 2} y={y0 + s / 2 + 8} anchor="middle">CENTRE KEPT OPEN</Tag>
      <path d={`M${x0 + s} ${y0 + c + 8}V${y0 + 2 * c - 8}`} stroke={C.l} strokeWidth={2.4} />
      <Tag x={x0 + s + 4} y={y0 + s / 2 + 1}>ENTRANCE · E</Tag>
      {/* compass */}
      <g transform="translate(292 40)">
        <circle r={13} fill="none" stroke={C.n300} strokeWidth={0.5} />
        <path d="M0 -11L3 2L0 0L-3 2Z" fill={C.l} />
        <Tag x={0} y={-15} anchor="middle" fill={C.l}>N</Tag>
      </g>
      <Header />
      <Laser p={0.1} />
      <Eyebrow y={44}>VASTU AND PLANNING</Eyebrow>
      <Headline y={60} lines={["Every room", "where it belongs."]} />
      <Bars y={82} widths={[112, 98, 104]} />
      <Tag x={16} y={106} fill={C.w}>YOUR PLOT FACES</Tag>
      {["N", "E", "S", "W"].map((d, i) => (
        <g key={d}>
          <rect x={16 + i * 17} y={110} width={14} height={10} rx={2} fill={d === "E" ? C.l : "none"} stroke={d === "E" ? "none" : C.n300} strokeWidth={0.5} />
          <Text x={23 + i * 17} y={116.6} size={5} weight={600} anchor="middle" fill={d === "E" ? C.n : C.w}>
            {d}
          </Text>
        </g>
      ))}
      <rect x={16} y={128} width={74} height={9} fill="none" stroke={C.l} strokeWidth={0.5} />
      <Tag x={19} y={134} fill={C.l}>INDICATIVE LAYOUT</Tag>
      <Rail active={1} />
    </Frame>
  );
}

export function F2Planning() {
  const o: Iso = { ox: 252, oy: 112, s: 1.25 };
  return (
    <Frame label="Architectural planning: a 2D floor plan lifts into a white 3D massing model, a dashed orbit path around it, and a 2D or 3D toggle.">
      <Grid />
      {/* 2D plan */}
      <g stroke={C.n300} strokeWidth={0.6} fill="none">
        <rect x={140} y={66} width={52} height={40} />
        <path d="M166 66V92M140 86H166M166 92H192" />
      </g>
      <Tag x={140} y={114}>PLAN · GROUND</Tag>
      <path d="M196 86h10" stroke={C.l} strokeWidth={0.7} markerEnd="url(#f2-arrow)" />
      <defs>
        <marker id="f2-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L6 3L0 6Z" fill={C.l} />
        </marker>
      </defs>
      <ellipse cx={252} cy={112} rx={58} ry={22} fill="none" stroke={C.n300} strokeWidth={0.4} strokeDasharray="2 2" />
      <IsoBox o={o} x={-20} z={-14} w={40} d={30} h={14} />
      <IsoBox o={o} x={-20} z={-14} w={26} d={30} h={13} y={14} />
      <IsoBox o={o} x={6} z={-14} w={14} d={16} h={8} y={14} />
      <Header />
      <Laser p={0.2} />
      <Eyebrow y={44}>ARCHITECTURAL PLANNING</Eyebrow>
      <Headline y={60} lines={["See it before", "it is built."]} />
      <Bars y={82} widths={[106, 90]} />
      <g>
        <rect x={16} y={98} width={58} height={11} rx={5.5} fill="none" stroke={C.n300} strokeWidth={0.5} />
        <rect x={45} y={99} width={28} height={9} rx={4.5} fill={C.l} />
        <Text x={30.5} y={105.2} size={4.4} weight={600} anchor="middle">2D plan</Text>
        <Text x={59} y={105.2} size={4.4} weight={600} anchor="middle" fill={C.n}>3D view</Text>
      </g>
      <TitleBlock sheet="A-102" title="MASSING" scale="1:200" />
      <Rail active={2} />
    </Frame>
  );
}

export function F3Foundation() {
  return (
    <Frame label="Foundation: the ground cut away in section, a trench with a lean concrete bed, footing, rebar cage and column stub, concrete pouring, and technical tags for each layer.">
      <defs>
        <pattern id="f3-earth" width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V5" stroke={C.n700} strokeWidth={0.8} />
        </pattern>
      </defs>
      <Grid />
      <rect x={118} y={78} width={202} height={102} fill={C.n950} />
      <rect x={118} y={78} width={202} height={102} fill="url(#f3-earth)" />
      <rect x={166} y={78} width={84} height={84} fill={C.n} />
      <VideoLayer x={166} y={78} w={84} h={50} name="construction-site" id="f3-video" />
      <path d="M118 78H320" stroke={C.w} strokeWidth={0.8} />
      <rect x={172} y={152} width={72} height={6} fill={C.g400} />
      <rect x={180} y={136} width={56} height={16} fill={C.g300} />
      <path d="M180 139Q194 136 208 139T236 139" stroke={C.w} strokeWidth={0.5} fill="none" />
      <rect x={202} y={88} width={12} height={48} fill={C.g300} fillOpacity={0.55} />
      <g stroke={C.n300} strokeWidth={0.45}>
        <path d="M204 66V146M208 66V146M212 66V146" />
        {[72, 80, 88, 96, 104, 112, 120, 128].map((y) => (
          <path key={y} d={`M203 ${y}H213`} />
        ))}
        <path d="M184 148H232M184 144H232" />
      </g>
      <rect x={156} y={78} width={104} height={8} fill={C.g200} />
      <Leader d="M260 82H266" />
      <Tag x={268} y={83.5}>PLINTH BEAM</Tag>
      <Leader d="M214 104H266" />
      <Tag x={268} y={105.5}>COLUMN</Tag>
      <Leader d="M236 140H266" />
      <Tag x={268} y={141.5}>FOOTING</Tag>
      <Leader d="M244 155H266" />
      <Tag x={268} y={156.5}>PCC BED</Tag>
      <Header />
      <Laser p={0.3} />
      <Eyebrow y={44}>FOUNDATION</Eyebrow>
      <Headline y={60} lines={["What holds", "it all up."]} />
      <Bars y={82} widths={[104, 96, 70]} />
      <TitleBlock sheet="S-201" title="FOOTING" scale="1:25" />
      <Rail active={3} />
    </Frame>
  );
}

export function F4Structure() {
  const ground = 150;
  const cols = [128, 164, 200];
  return (
    <Frame label="Structure: columns and slabs stack floor by floor with a floor counter reading Floor 02 of 03, while a tower crane in the background carries the section heading into place on its hook.">
      <Grid />
      <VideoLayer x={236} y={40} w={64} h={92} name="iron-worker" id="f4-video" />
      {/* crane */}
      <g stroke={C.n300} strokeWidth={0.6} fill="none">
        <path d={`M262 ${ground}V28M270 ${ground}V28`} />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M262 ${ground - i * 10.2}L270 ${ground - (i + 1) * 10.2}`} />
        ))}
        <path d="M140 28H296M140 32H270M270 28L266 18L262 28" />
        <rect x={284} y={32} width={10} height={8} fill={C.n300} />
        <path d="M184 32V54" strokeWidth={0.4} />
      </g>
      <rect x={180} y={30} width={8} height={4} fill={C.n300} />
      <rect x={142} y={54} width={86} height={18} fill={C.n} stroke={C.l} strokeWidth={0.7} />
      <Text x={185} y={65.6} size={7.5} weight={300} anchor="middle">
        Floor by floor.
      </Text>
      {/* frame */}
      {[0, 1].map((f) => (
        <g key={f}>
          {cols.map((x) => (
            <rect key={x} x={x} y={ground - (f + 1) * 22} width={4} height={22} fill={C.w} />
          ))}
          <rect x={122} y={ground - (f + 1) * 22 - 3} width={88} height={3.5} fill={C.w} />
        </g>
      ))}
      {cols.map((x) => (
        <rect key={x} x={x} y={ground - 66} width={4} height={22} fill="none" stroke={C.w} strokeWidth={0.5} strokeDasharray="1.5 1.5" />
      ))}
      <path d={`M100 ${ground}H320`} stroke={C.w} strokeWidth={0.8} />
      <Header />
      <Laser p={0.4} />
      <Eyebrow y={44}>STRUCTURE</Eyebrow>
      <Bars y={54} widths={[90, 96, 80]} />
      <Text x={16} y={128} size={9} mono fill={C.l}>
        FLOOR 02 / 03
      </Text>
      <Tag x={16} y={136}>LEVEL +6.00 · SLAB CURING</Tag>
      <TitleBlock sheet="S-301" title="FRAME" scale="1:100" />
      <Rail active={4} />
    </Frame>
  );
}

export function F5Walls() {
  const bricks: ReactNode[] = [];
  for (let r = 0; r < 7; r++) {
    for (let i = -1; i < 10; i++) {
      const x = 120 + i * 20 + (r % 2 ? 10 : 0);
      bricks.push(<rect key={`${r}-${i}`} x={x} y={120 + r * 4.6} width={18.5} height={3.6} fill={C.g300} />);
    }
  }
  return (
    <Frame label="Walls and finishing: a facade with brick courses at the bottom, smooth plaster above, a lime-to-white paint sweep at the top, and windows sliding in to catch the light.">
      <defs>
        <clipPath id="f5-facade">
          <rect x={120} y={30} width={170} height={122} />
        </clipPath>
      </defs>
      <Grid />
      <g clipPath="url(#f5-facade)">
        <rect x={120} y={30} width={170} height={122} fill={C.n950} />
        {bricks}
        <rect x={120} y={78} width={170} height={40} fill={C.g200} />
        <rect x={120} y={30} width={84} height={48} fill={C.w} />
        <rect x={200} y={30} width={10} height={48} fill={C.l} />
        <rect x={210} y={30} width={80} height={48} fill={C.g200} />
      </g>
      {/* windows */}
      <rect x={136} y={40} width={30} height={28} fill={C.n700} stroke={C.n} strokeWidth={0.6} />
      <path d="M140 66L162 42" stroke={C.ll} strokeWidth={1.2} strokeOpacity={0.8} />
      <rect x={246} y={40} width={30} height={28} fill="none" stroke={C.n} strokeWidth={0.6} strokeDasharray="2 1.5" />
      <path d="M288 54h-8" stroke={C.n} strokeWidth={0.6} />
      <Tag x={136} y={75} fill={C.n}>PAINT · GLASS</Tag>
      <Tag x={214} y={100} fill={C.n}>PLASTER</Tag>
      <rect x={124} y={141} width={24} height={8} fill={C.n} />
      <Tag x={127} y={146.6} fill={C.w}>BRICK</Tag>
      <Tag x={120} y={162}>VIDEO · glass-building in window</Tag>
      <Header />
      <Laser p={0.5} />
      <Eyebrow y={44}>WALLS AND FINISHING</Eyebrow>
      <Headline y={60} lines={["Brick, plaster,", "paint, light."]} />
      <Bars y={82} widths={[100, 92]} />
      <TitleBlock sheet="A-401" title="ELEVATION" scale="1:50" />
      <Rail active={5} />
    </Frame>
  );
}

export function F6ResCom() {
  return (
    <Frame label="Residential or commercial: a toggle on the same plot switches between a family villa and a commercial block with shopfronts and office floors, with the matching service list beside it.">
      <Grid />
      {/* commercial ghost */}
      <g stroke={C.n300} strokeWidth={0.5} strokeDasharray="2 1.5" fill="none">
        <rect x={150} y={36} width={146} height={124} />
        <path d="M150 66H296M150 96H296M150 126H296" />
        <path d="M168 136V160M204 136V160M240 136V160M276 136V160" />
      </g>
      <Tag x={296} y={32} anchor="end">COMMERCIAL · G+3</Tag>
      {/* villa */}
      <path d="M160 160V104L206 74L252 104V160Z" fill={C.w} />
      <path d="M154 106L206 70L258 106" stroke={C.n} strokeWidth={1.2} fill="none" />
      <rect x={196} y={130} width={18} height={30} fill={C.n2} />
      <rect x={170} y={114} width={16} height={14} fill={C.ll} />
      <rect x={226} y={114} width={16} height={14} fill={C.ll} />
      <path d={`M120 160H320`} stroke={C.w} strokeWidth={0.8} />
      <Header />
      <Laser p={0.6} />
      <Eyebrow y={44}>HOMES AND COMMERCIAL</Eyebrow>
      <Headline y={60} lines={["One plot.", "Your building."]} />
      <g>
        <rect x={16} y={80} width={70} height={11} rx={5.5} fill="none" stroke={C.n300} strokeWidth={0.5} />
        <rect x={17} y={81} width={30} height={9} rx={4.5} fill={C.l} />
        <Text x={32} y={87.2} size={4.4} weight={600} anchor="middle" fill={C.n}>Home</Text>
        <Text x={66} y={87.2} size={4.4} weight={600} anchor="middle">Commercial</Text>
      </g>
      {["Custom homes", "Villas", "Apartments"].map((t, i) => (
        <g key={t}>
          <rect x={16} y={100 + i * 10} width={3} height={3} fill={C.l} />
          <Text x={23} y={102.8 + i * 10} size={5}>
            {t}
          </Text>
        </g>
      ))}
      <Rail active={6} />
    </Frame>
  );
}

export function F7Renovation() {
  return (
    <Frame label="Renovation: a drag slider over a facade photo, the left side old with cracks and stains, the right side renovated and clean.">
      <Grid />
      <rect x={120} y={26} width={92} height={136} fill={C.g600} />
      <g stroke={C.n950} strokeWidth={0.7} fill="none">
        <path d="M140 40L146 52L141 61L150 74" />
        <path d="M180 90L172 104L178 118L170 132" />
      </g>
      <ellipse cx={160} cy={130} rx={18} ry={9} fill={C.n700} fillOpacity={0.6} />
      <ellipse cx={192} cy={56} rx={9} ry={14} fill={C.n700} fillOpacity={0.5} />
      <rect x={212} y={26} width={92} height={136} fill={C.n100} />
      <rect x={232} y={48} width={22} height={26} fill={C.n2} />
      <rect x={266} y={48} width={22} height={26} fill={C.n2} />
      <rect x={244} y={110} width={30} height={52} fill={C.n} />
      <path d="M212 26V162" stroke={C.l} strokeWidth={1.4} />
      <circle cx={212} cy={94} r={8} fill={C.l} />
      <Text x={212} y={96} size={6} weight={600} anchor="middle" fill={C.n}>
        ‹ ›
      </Text>
      <Tag x={124} y={34} fill={C.w}>BEFORE</Tag>
      <Tag x={300} y={34} anchor="end" fill={C.n}>AFTER</Tag>
      <Header />
      <Laser p={0.7} />
      <Eyebrow y={44}>RENOVATION</Eyebrow>
      <Headline y={60} lines={["Make the old", "house new."]} />
      <Bars y={82} widths={[98, 86]} />
      <Tag x={16} y={104} fill={C.w}>DRAG, OR USE ← →</Tag>
      <Rail active={7} />
    </Frame>
  );
}

export function F8Handover() {
  return (
    <Frame label="Turnkey handover at dusk: the front door open, windows lighting up room by room, and a key with a lime tag dropping into an open hand." bg={C.n950}>
      <Grid opacity={0.5} />
      <path d="M156 160V96L220 60L284 96V160Z" fill={C.n2} />
      <path d="M150 98L220 56L290 98" stroke={C.n300} strokeWidth={0.8} fill="none" />
      {[
        [170, 104, true],
        [198, 104, true],
        [230, 104, false],
        [258, 104, true],
        [170, 130, true],
        [258, 130, false],
      ].map(([x, y, lit], i) => (
        <rect key={i} x={x as number} y={y as number} width={14} height={14} fill={lit ? C.ll : C.n700} />
      ))}
      <rect x={210} y={128} width={20} height={32} fill={C.ll} />
      <path d="M210 128L202 132V164L210 160Z" fill={C.n700} />
      <path d="M120 160H320" stroke={C.n300} strokeWidth={0.6} />
      {/* key and hand */}
      <g transform="translate(120 112) rotate(-20)">
        <circle cx={0} cy={0} r={4} fill="none" stroke={C.w} strokeWidth={1.2} />
        <path d="M4 0H18M14 0V3M17 0V3" stroke={C.w} strokeWidth={1.2} />
        <path d="M-3 3L-6 12" stroke={C.l} strokeWidth={0.5} />
        <rect x={-10} y={11} width={8} height={5} fill={C.l} />
      </g>
      <path d="M116 100V92M124 102V96" stroke={C.n300} strokeWidth={0.4} strokeDasharray="1.5 1.5" />
      <path d="M112 146C116 136 124 134 128 138L132 132C134 130 137 132 136 135L134 140C140 138 148 138 150 142C152 147 144 152 134 154C124 156 114 154 112 146Z" fill="none" stroke={C.w} strokeWidth={0.7} />
      <Header />
      <Laser p={0.8} />
      <Eyebrow y={44}>TURNKEY HANDOVER</Eyebrow>
      <Headline y={60} lines={["Foundation", "to finishing."]} />
      <Text x={16} y={92} size={9} weight={300} fill={C.l}>
        One team.
      </Text>
      <Rail active={8} />
    </Frame>
  );
}

export function F9Sustainable() {
  return (
    <Frame label="Sustainable building: solar panels slide onto the roof, rainwater arrows trace down to an underground sump, and terrace greenery grows in lime, with the eco-city video behind the building.">
      <Grid />
      <VideoLayer x={120} y={20} w={200} h={64} name="eco-city" id="f9-video" />
      <rect x={160} y={84} width={120} height={72} fill={C.n100} />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          {[0, 1, 2, 3].map((c) => (
            <rect key={c} x={172 + c * 26} y={94 + r * 20} width={12} height={12} fill={C.n2} />
          ))}
        </g>
      ))}
      <path d="M156 84H284" stroke={C.n} strokeWidth={1.4} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${218 + i * 20} 82L${230 + i * 20} 70H${244 + i * 20}L${232 + i * 20} 82Z`} fill={C.n700} stroke={C.n300} strokeWidth={0.4} />
      ))}
      {[166, 174, 182, 190, 200].map((x, i) => (
        <circle key={x} cx={x} cy={80 - (i % 2) * 2} r={4 + (i % 3)} fill={C.l} />
      ))}
      <path d="M156 160H320" stroke={C.w} strokeWidth={0.8} />
      <rect x={292} y={164} width={22} height={10} fill="none" stroke={C.l} strokeWidth={0.6} />
      <path d="M284 86H296V168" stroke={C.l} strokeWidth={0.7} strokeDasharray="2 1.5" fill="none" />
      <path d="M293 160L296 166L299 160" stroke={C.l} strokeWidth={0.7} fill="none" />
      <Tag x={240} y={66}>SOLAR</Tag>
      <Tag x={164} y={70}>TERRACE GARDEN</Tag>
      <Tag x={288} y={171} anchor="end">RAINWATER TO SUMP</Tag>
      <Header />
      <Laser p={0.9} />
      <Eyebrow y={44}>SUSTAINABLE BUILDING</Eyebrow>
      <Headline y={60} lines={["Built to use", "less."]} />
      <Bars y={82} widths={[100, 94, 76]} />
      <Rail active={9} />
    </Frame>
  );
}

export function F10Start() {
  const o: Iso = { ox: 246, oy: 120, s: 1.35 };
  return (
    <Frame label="Start your project: the finished building lit at night, with buttons to plan the build on WhatsApp, get a free estimate, or call.">
      <Grid />
      <IsoBox o={o} x={-20} z={-14} w={40} d={30} h={14} windows={{ lit: [true, true, false, true] }} />
      <IsoBox o={o} x={-20} z={-14} w={26} d={30} h={13} y={14} windows={{ lit: [true, false, true] }} />
      <IsoBox o={o} x={6} z={-14} w={14} d={16} h={8} y={14} />
      {[230, 246, 262].map((x) => (
        <circle key={x} cx={x} cy={84} r={3} fill={C.l} />
      ))}
      <Header />
      <Laser p={1} />
      <Eyebrow y={44}>START YOUR PROJECT</Eyebrow>
      <Headline y={60} lines={["Tell us about", "your plot."]} />
      <Pill x={16} y={84} w={100} label="Plan your build on WhatsApp" kind="whatsapp" />
      <Pill x={16} y={98} w={100} label="Get a free estimate" kind="lime" />
      <Pill x={16} y={112} w={100} label="Call +91 94880 84277" kind="outline" />
      <Tag x={16} y={136}>51, 3RD CROSS ST, SARAM, PONDICHERRY</Tag>
      <Rail active={10} />
    </Frame>
  );
}

/* ── Laser-line route transition ────────────────────────────────────── */

function PageSketch({ y0 = 14, h = 166, blueprint = false }: { y0?: number; h?: number; blueprint?: boolean }) {
  const stroke = blueprint ? C.n300 : "none";
  const fill = (c: string) => (blueprint ? "none" : c);
  return (
    <g strokeWidth={0.5} stroke={stroke} strokeDasharray={blueprint ? "2 1.5" : undefined}>
      <rect x={0} y={y0} width={320} height={h} fill={fill(C.w)} />
      <rect x={16} y={y0 + 22} width={70} height={4} fill={fill(C.l)} />
      <rect x={16} y={y0 + 32} width={150} height={12} fill={fill(C.n)} />
      <rect x={16} y={y0 + 48} width={110} height={12} fill={fill(C.n)} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={16 + i * 100} y={y0 + 80} width={92} height={56} fill={fill(C.n100)} />
      ))}
    </g>
  );
}

export function T1Click() {
  return (
    <Frame label="Transition, step one: on the home page, the visitor clicks Services in the header. The laser line sits under the header as the scroll progress bar.">
      <Grid />
      <Headline y={60} lines={["Floor by floor."]} />
      <Header />
      <Laser p={0.42} />
      <path d="M216 4L216 13L218.5 10.8L220.4 14.6L222 13.8L220.1 10.2L223.4 9.8Z" fill={C.w} stroke={C.n} strokeWidth={0.4} />
      <Tag x={226} y={26} fill={C.l}>CLICK: SERVICES</Tag>
    </Frame>
  );
}

export function T2Sweep() {
  return (
    <Frame label="Transition, step two: the lime line detaches and sweeps down the screen like a laser level. Above it the new page appears as blueprint outlines, below it the old page is still visible.">
      <Grid />
      <Headline y={140} lines={["Floor by floor."]} />
      <rect x={0} y={0} width={320} height={96} fill={C.n} />
      <PageSketch y0={0} h={96} blueprint />
      <rect x={0} y={95.2} width={320} height={1.6} fill={C.l} />
      <rect x={0} y={93.5} width={320} height={5} fill={C.l} fillOpacity={0.18} />
      <Tag x={316} y={90} anchor="end" fill={C.l}>NEW PAGE BUILDS UP BEHIND THE LINE</Tag>
      <Tag x={316} y={106} anchor="end">OLD PAGE</Tag>
    </Frame>
  );
}

export function T3Built() {
  return (
    <Frame label="Transition, step three: the new page is fully built and the line returns to the top as the progress bar, starting from zero." bg={C.w}>
      <PageSketch />
      <Header light />
      <Laser p={0.015} />
      <Tag x={316} y={26} anchor="end" fill={C.n}>LINE BACK AT THE TOP · 0%</Tag>
    </Frame>
  );
}

/* ── Service page ───────────────────────────────────────────────────── */

export function S1Hero() {
  const ground = 112;
  return (
    <Frame label="Service page hero: breadcrumb, the heading House construction in Pondicherry, a WhatsApp button prefilled for this service, and the building shown at the structure stage. Calm content starts below.">
      <Grid />
      {[0, 1].map((f) => (
        <g key={f}>
          {[210, 240, 270].map((x) => (
            <rect key={x} x={x} y={ground - (f + 1) * 22} width={3.5} height={22} fill={C.w} />
          ))}
          <rect x={204} y={ground - (f + 1) * 22 - 3} width={76} height={3} fill={C.w} />
        </g>
      ))}
      <path d={`M190 ${ground}H300`} stroke={C.w} strokeWidth={0.8} />
      <Header />
      <Laser p={0.05} />
      <Tag x={16} y={28}>SERVICES / RESIDENTIAL</Tag>
      <Headline y={46} lines={["House construction", "in Pondicherry."]} size={12} />
      <Bars y={68} widths={[130, 118]} />
      <Pill x={16} y={84} w={104} label="Ask about your house on WhatsApp" kind="whatsapp" />
      <rect x={0} y={120} width={320} height={60} fill={C.w} />
      <Eyebrow y={136} fill={C.n}>WHAT IS INCLUDED</Eyebrow>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={16} y={144 + i * 9} width={3} height={3} fill={C.n} />
          <rect x={23} y={144.6 + i * 9} width={90 - i * 12} height={1.8} fill={C.g400} />
          <rect x={166} y={144 + i * 9} width={3} height={3} fill={C.n} />
          <rect x={173} y={144.6 + i * 9} width={80 - i * 10} height={1.8} fill={C.g400} />
        </g>
      ))}
    </Frame>
  );
}

export function S2Content() {
  const stations = ["Consult", "Site visit", "Design", "Approval", "Build", "Handover"];
  return (
    <Frame label="Service page content: a side index, the process for this service drawn as a line with stations, what the client provides, a timeline block that only shows when set in the content file, and frequently asked questions." bg={C.w}>
      <Header light />
      <rect x={0} y={14} width={86} height={166} fill={C.n100} />
      {["Included", "How it works", "You provide", "Timeline", "Questions"].map((t, i) => (
        <Text key={t} x={14} y={34 + i * 10} size={5} fill={C.n} weight={i === 1 ? 600 : 400}>
          {t}
        </Text>
      ))}
      <rect x={10} y={40} width={1.2} height={6} fill={C.n} />
      <Eyebrow x={100} y={30} fill={C.n}>HOW IT WORKS</Eyebrow>
      <path d="M104 46H304" stroke={C.n} strokeWidth={0.7} />
      {stations.map((t, i) => (
        <g key={t}>
          <circle cx={104 + i * 40} cy={46} r={2.6} fill={i < 2 ? C.n : C.w} stroke={C.n} strokeWidth={0.7} />
          <Text x={104 + i * 40} y={56} size={4.2} fill={C.n} anchor="middle">
            {t}
          </Text>
        </g>
      ))}
      <Eyebrow x={100} y={76} fill={C.n}>YOU PROVIDE</Eyebrow>
      <Bars x={100} y={82} widths={[120, 104, 112]} fill={C.g400} />
      <rect x={100} y={100} width={204} height={16} fill="none" stroke={C.g400} strokeWidth={0.5} strokeDasharray="2 1.5" />
      <Tag x={104} y={110} fill={C.g600}>TIMELINE · SHOWN ONLY WHEN SET IN CONTENT</Tag>
      <Eyebrow x={100} y={130} fill={C.n}>QUESTIONS</Eyebrow>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path d={`M100 ${138 + i * 12}H304`} stroke={C.g200} strokeWidth={0.5} />
          <rect x={100} y={142 + i * 12} width={130 - i * 14} height={2} fill={C.n} fillOpacity={0.8} />
          <Text x={302} y={145.5 + i * 12} size={6} fill={C.n} anchor="end">
            +
          </Text>
        </g>
      ))}
    </Frame>
  );
}

/* ── Phone frames ───────────────────────────────────────────────────── */

function Phone({ children, label, bg = C.n }: { children: ReactNode; label: string; bg?: string }) {
  return (
    <svg viewBox="0 0 180 320" className="logo-dark block h-auto w-full" role="img" aria-label={label}>
      <rect width={180} height={320} rx={10} fill={bg} />
      {children}
    </svg>
  );
}

export function M0Groundbreaking() {
  return (
    <Phone label="Phone, groundbreaking: headline, WhatsApp and estimate buttons stacked full width, the plot with stakes below, and no 3D.">
      <Grid w={180} h={320} />
      <Header w={180} compact />
      <Laser p={0.02} w={180} />
      <Eyebrow x={14} y={40}>SARAM, PONDICHERRY</Eyebrow>
      <Headline x={14} y={60} lines={["From the first", "stake to the", "house key."]} size={16} />
      <Bars x={14} y={104} widths={[150, 132, 90]} />
      <Pill x={14} y={124} w={152} h={16} label="Plan your build on WhatsApp" kind="whatsapp" />
      <Pill x={14} y={146} w={152} h={16} label="Get a free estimate" kind="outline" />
      <rect y={196} width={180} height={124} rx={0} fill={C.n950} />
      <path d="M0 196H180" stroke={C.n700} strokeWidth={0.6} />
      <path d="M22 290L158 290L136 236L44 236Z" fill={C.l} fillOpacity={0.07} stroke={C.l} strokeWidth={0.7} />
      {[
        [22, 290],
        [158, 290],
        [136, 236],
        [44, 236],
      ].map(([x, y]) => (
        <g key={`${x}`}>
          <path d={`M${x} ${y}V${y - 10}`} stroke={C.l} strokeWidth={1.4} />
          <rect x={x - 1.6} y={y - 12} width={3.2} height={3.2} fill={C.l} />
        </g>
      ))}
      <g transform="translate(64 216) scale(0.95)">
        <path d={BLOCK} fill="none" stroke={C.w} strokeWidth={0.8} />
        <path d={VEL} fill="none" stroke={C.l} strokeWidth={0.8} />
      </g>
      <Text x={14} y={180} size={5.4} fill={C.n300} weight={500}>
        Skip the story ↓
      </Text>
    </Phone>
  );
}

export function M4Structure() {
  const ground = 250;
  return (
    <Phone label="Phone, structure: a flat elevation with floors stacking, the floor counter, a static crane silhouette, and the heading set as text below the scene.">
      <Grid w={180} h={320} />
      <g stroke={C.n300} strokeWidth={0.6} fill="none">
        <path d={`M140 ${ground}V60M146 ${ground}V60M40 60H160M146 60L143 50L140 60`} />
        <path d="M70 60V96" strokeWidth={0.4} />
      </g>
      {[0, 1, 2].map((f) => (
        <g key={f}>
          {[30, 62, 94].map((x) => (
            <rect key={x} x={x} y={ground - (f + 1) * 34} width={5} height={34} fill={f === 2 ? "none" : C.w} stroke={f === 2 ? C.w : "none"} strokeWidth={0.5} strokeDasharray="1.5 1.5" />
          ))}
          {f < 2 ? <rect x={24} y={ground - (f + 1) * 34 - 4} width={80} height={4} fill={C.w} /> : null}
        </g>
      ))}
      <path d={`M10 ${ground}H170`} stroke={C.w} strokeWidth={0.8} />
      <Header w={180} compact />
      <Laser p={0.4} w={180} />
      <Text x={14} y={40} size={8} mono fill={C.l}>
        FLOOR 02 / 03
      </Text>
      <Headline x={14} y={276} lines={["Floor by floor."]} size={15} />
      <Bars x={14} y={290} widths={[150, 120]} />
    </Phone>
  );
}

export function M2ServicePhone() {
  return (
    <Phone label="Phone, service page: compact header, heading, content, and a WhatsApp button at the end of the content. The floating WhatsApp button hides while this button is on screen so they never overlap." bg={C.w}>
      <Header w={180} light compact />
      <Tag x={14} y={30} fill={C.g600}>SERVICES / RESIDENTIAL</Tag>
      <Headline x={14} y={50} lines={["House", "construction in", "Pondicherry."]} size={14} fill={C.n} />
      <Bars x={14} y={96} widths={[150, 140, 120]} fill={C.g400} />
      <Eyebrow x={14} y={126} fill={C.n}>WHAT IS INCLUDED</Eyebrow>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={14} y={134 + i * 10} width={3} height={3} fill={C.n} />
          <rect x={21} y={134.6 + i * 10} width={120 - i * 14} height={1.8} fill={C.g400} />
        </g>
      ))}
      <Eyebrow x={14} y={188} fill={C.n}>QUESTIONS</Eyebrow>
      {[0, 1].map((i) => (
        <g key={i}>
          <path d={`M14 ${196 + i * 14}H166`} stroke={C.g200} strokeWidth={0.5} />
          <rect x={14} y={200 + i * 14} width={120} height={2} fill={C.n} fillOpacity={0.8} />
        </g>
      ))}
      <rect x={0} y={250} width={180} height={70} fill={C.s} />
      <Pill x={14} y={266} w={152} h={16} label="Ask about your house on WhatsApp" kind="whatsapp" />
      <Pill x={14} y={288} w={152} h={16} label="Call +91 94880 84277" kind="outline-dark" />
      <circle cx={158} cy={236} r={9} fill="none" stroke={C.g400} strokeWidth={0.5} strokeDasharray="1.5 1.5" />
      <Tag x={146} y={238} anchor="end" fill={C.g600}>FLOATING BUTTON HIDDEN HERE</Tag>
    </Phone>
  );
}
