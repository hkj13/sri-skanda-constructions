"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { C } from "@/scene/Iso";
import { renovation } from "@content/home";
import { tr } from "@content/i18n";
import { Tag } from "./parts";

/** The same two-storey front, drawn tired or renovated. */
function Facade({ old }: { old: boolean }) {
  const wall = old ? "#9499a8" : C.white;
  const trim = old ? "#6e7487" : C.navy100;
  const glass = old ? "#494d5a" : C.navy2;
  return (
    <svg viewBox="0 0 800 720" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width={800} height={720} fill={old ? "#5c6170" : C.navy100} />
      <rect y={610} width={800} height={110} fill={old ? "#494d5a" : C.gray300} />
      <rect x={120} y={130} width={560} height={480} fill={wall} stroke={C.navy} strokeWidth={3} />
      <rect x={100} y={110} width={600} height={26} fill={trim} stroke={C.navy} strokeWidth={3} />
      <path d="M120 370H680" stroke={C.navy} strokeWidth={3} />
      {[170, 470].map((x) => (
        <g key={x}>
          <rect x={x} y={190} width={150} height={120} fill={glass} stroke={C.navy} strokeWidth={3} />
          <path d={`M${x + 75} 190v120`} stroke={C.navy} strokeWidth={3} />
        </g>
      ))}
      <rect x={170} y={430} width={150} height={120} fill={glass} stroke={C.navy} strokeWidth={3} />
      <rect x={470} y={410} width={120} height={200} fill={old ? "#373a43" : C.navy} stroke={C.navy} strokeWidth={3} />
      <rect x={440} y={388} width={180} height={16} fill={trim} stroke={C.navy} strokeWidth={3} />
      {old ? (
        <g>
          {/* cracks */}
          <g fill="none" stroke={C.navy950} strokeWidth={3} strokeLinejoin="round">
            <path d="M360 136l14 46-18 30 22 52-10 34" />
            <path d="M640 372l-22 40 12 34-26 44" />
            <path d="M150 560l34-22 12-38" />
          </g>
          {/* damp stains */}
          <ellipse cx={250} cy={590} rx={130} ry={34} fill={C.navy2} fillOpacity={0.5} />
          <ellipse cx={640} cy={180} rx={46} ry={70} fill={C.navy2} fillOpacity={0.4} />
          <path d="M320 310v54M470 310v38" stroke={C.navy2} strokeOpacity={0.6} strokeWidth={8} />
          {/* fallen plaster, brick showing */}
          <path d="M380 440h70v60h-30v34h-52v-50h12z" fill="#6e7487" stroke={C.navy} strokeWidth={2} />
          <path d="M380 470h70M368 502h52M400 440v30M424 470v32M392 502v32" stroke={C.navy} strokeWidth={1.5} />
          {/* window bars */}
          <path d="M190 430v120M215 430v120M240 430v120M265 430v120M290 430v120" stroke={C.navy} strokeWidth={2} />
        </g>
      ) : (
        <g>
          <path d="M184 296L226 204M484 296L526 204M184 536L226 444" stroke={C.limeLight} strokeWidth={5} strokeOpacity={0.85} />
          <rect x={150} y={556} width={190} height={22} fill={C.lime} stroke={C.navy} strokeWidth={3} />
          <rect x={120} y={370} width={560} height={10} fill={C.navy100} stroke={C.navy} strokeWidth={2} />
        </g>
      )}
      <path d="M0 610H800" stroke={C.navy} strokeWidth={3} />
    </svg>
  );
}

/**
 * Before and after slider. The handle is a real range input, so it works
 * with a mouse, a finger, or the arrow keys.
 */
export function BeforeAfter() {
  const [pos, setPos] = useState(55);
  const wrap = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  // One small nudge the first time it comes into view, to show it moves.
  useEffect(() => {
    const el = wrap.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || touched.current) return;
        io.disconnect();
        const steps = [55, 44, 62, 55];
        steps.forEach((value, n) => window.setTimeout(() => !touched.current && setPos(value), 350 + n * 320));
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const photos = renovation.photos;
  return (
    <div
      ref={wrap}
      className="absolute inset-x-[4%] inset-y-[9%] z-[1] overflow-hidden lg:left-0 lg:right-[10%]"
      style={{ "--pos": `${pos}%` } as React.CSSProperties}
    >
      <div className="absolute inset-0">
        {photos ? <Image src={photos.after} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" /> : <Facade old={false} />}
      </div>
      <div className="absolute inset-0 transition-[clip-path] duration-300 ease-out motion-reduce:transition-none" style={{ clipPath: "inset(0 calc(100% - var(--pos)) 0 0)" }}>
        {photos ? <Image src={photos.before} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" /> : <Facade old />}
      </div>

      <svg viewBox="0 0 100 20" className="pointer-events-none absolute left-4 top-4 h-7 w-auto" aria-hidden="true">
        <rect width={100} height={20} fill={C.navy} />
        <Tag x={50} y={14} anchor="middle" fill={C.white} size={10}>{tr(renovation.before)}</Tag>
      </svg>
      <svg viewBox="0 0 100 20" className="pointer-events-none absolute right-4 top-4 h-7 w-auto" aria-hidden="true">
        <rect width={100} height={20} fill={C.navy} />
        <Tag x={50} y={14} anchor="middle" fill={C.lime} size={10}>{tr(renovation.after)}</Tag>
      </svg>
      {!photos ? (
        <p className="t-tech pointer-events-none absolute bottom-3 left-4 bg-primary px-2 py-1 text-[11px] text-navy-300">
          {tr(renovation.illustrationNote)}
        </p>
      ) : null}

      {/* handle */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-primary transition-[left] duration-300 ease-out motion-reduce:transition-none" style={{ left: "var(--pos)" }}>
        <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-accent" />
        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-xl font-semibold text-primary ring-4 ring-primary">
          ‹ ›
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => {
          touched.current = true;
          setPos(Number(e.target.value));
        }}
        aria-label="Compare before and after renovation"
        aria-valuetext={`${Math.round(pos)}% before, ${Math.round(100 - pos)}% after`}
        className="peer absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 outline-offset-[-4px] outline-accent peer-focus-visible:outline-4" />
    </div>
  );
}
