"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { story, subscribe } from "@/scene/store";
import { SWEEP, sweep } from "./story";

/* ── Floor counter for the Structure chapter ────────────────────────── */

const LEVEL = ["+3.60", "+6.70", "+9.80"];

function floorNow(): number {
  const p = story.progress[4];
  return p < 0.33 ? 0 : p < 0.6 ? 1 : 2;
}

export function FloorCounter() {
  // The server (and reduced motion) show the finished frame: 03 / 03.
  const floor = useSyncExternalStore(subscribe, floorNow, () => 2);
  return (
    <p className="mt-10" aria-hidden="true">
      <span className="block font-mono text-[clamp(1.75rem,2.6vw,3.25rem)] leading-none tracking-[0.04em] text-accent">
        FLOOR {String(floor + 1).padStart(2, "0")} / 03
      </span>
      <span className="t-tech mt-3 block text-navy-300">Slab level {LEVEL[floor]} m</span>
    </p>
  );
}

/* ── Chapter rail: the sheet index down the right edge ──────────────── */

export function ChapterRail({ chapters, label }: { chapters: { id: string; name: string; sheet: string }[]; label: string }) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(sections.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    // Step aside once the footer arrives.
    const footer = document.querySelector("footer");
    const fo = new IntersectionObserver(([e]) => setShown(!e.isIntersecting), { threshold: 0.05 });
    if (footer) fo.observe(footer);
    return () => {
      io.disconnect();
      fo.disconnect();
    };
  }, [chapters]);

  return (
    <nav
      aria-label={label}
      className={`fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-200 lg:block ${shown ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <ol>
        {chapters.map((c, n) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              aria-current={n === active ? "step" : undefined}
              className="group relative flex h-6 w-10 items-center justify-end focus-visible:outline-accent"
            >
              <span className="sr-only">{c.name}</span>
              <span
                aria-hidden="true"
                className={`block h-0.5 transition-all duration-200 group-hover:w-8 group-hover:bg-accent group-focus-visible:w-8 group-focus-visible:bg-accent ${
                  n === active ? "w-8 bg-accent" : "w-4 bg-navy-300"
                }`}
              />
              <span
                aria-hidden="true"
                className="t-tech pointer-events-none absolute right-12 whitespace-nowrap bg-primary px-2 py-1 text-[11px] text-white opacity-0 ring-1 ring-navy-700 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <span className="text-accent">{c.sheet}</span> {c.name}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ── Footage ────────────────────────────────────────────────────────── */

type Mode = "none" | "video" | "still";
let decided: Mode | null = null;

/**
 * Moving footage everywhere, except with reduced motion, Save-Data or a
 * very slow connection, where each clip shows its still frame.
 */
function playMode(): Mode {
  if (decided) return decided;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  decided = calm || conn?.saveData || /2g/.test(conn?.effectiveType ?? "") ? "still" : "video";
  return decided;
}
const never = () => () => {};
const useMode = () => useSyncExternalStore(never, playMode, () => "none" as Mode);

/** Whether a media query matches; false on the server. */
function useMedia(query?: string): boolean {
  return useSyncExternalStore(
    (change) => {
      if (!query) return () => {};
      const m = window.matchMedia(query);
      m.addEventListener("change", change);
      return () => m.removeEventListener("change", change);
    },
    () => (query ? window.matchMedia(query).matches : true),
    () => false,
  );
}

/**
 * A stock clip in the home story, in its own colours.
 *
 * With a `chapter` it loads once that chapter is close and plays only while
 * the chapter is on the stage. Without one it follows its own place on the
 * screen. Either way it pauses when out of sight or when the tab is hidden.
 * With `media` it exists only where that media query matches, so a clip
 * shown in two places (beside the drawing, or under the text on phones)
 * is only ever downloaded once.
 */
export function SceneVideo({
  name,
  chapter,
  media,
  className = "",
  style,
  children,
}: {
  name: string;
  chapter?: number;
  media?: string;
  className?: string;
  style?: CSSProperties;
  /** Drawn over the footage, such as window bars. */
  children?: ReactNode;
}) {
  const mode = useMode();
  const allowed = useMedia(media);
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [playing, setPlaying] = useState(false);
  const active = mode === "video" && allowed;

  useEffect(() => {
    const el = box.current;
    if (!active || !el) return;
    let on = false;
    let seen = false;
    const sync = (now: boolean) => {
      const v = video.current;
      now = now && !document.hidden;
      if (!v || now === on) return;
      on = now;
      if (on) v.play().catch(() => {});
      else v.pause();
    };
    if (chapter !== undefined) {
      const check = () => {
        const g = story.g;
        if (Math.abs(g - (chapter + 0.5)) < 1.6) setLoad(true);
        sync(g >= chapter - SWEEP && g < chapter + 1 + SWEEP);
      };
      check();
      const stop = subscribe(check);
      const vis = () => check();
      document.addEventListener("visibilitychange", vis);
      return () => {
        stop();
        document.removeEventListener("visibilitychange", vis);
      };
    }
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { rootMargin: "60% 0px" });
    const view = new IntersectionObserver(
      ([e]) => {
        seen = e.isIntersecting;
        sync(seen);
      },
      { threshold: 0.2 },
    );
    near.observe(el);
    view.observe(el);
    const vis = () => sync(seen);
    document.addEventListener("visibilitychange", vis);
    return () => {
      near.disconnect();
      view.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, [active, chapter, load]);

  return (
    <div ref={box} aria-hidden="true" className={`pointer-events-none absolute overflow-hidden ${className}`} style={style}>
      {mode !== "none" && allowed ? (
        // eslint-disable-next-line @next/next/no-img-element -- a small, pre-sized still frame
        <img src={`/videos/${name}.jpg`} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      {active && load ? (
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
        >
          <source src={`/videos/${name}.webm`} type="video/webm" />
          <source src={`/videos/${name}.mp4`} type="video/mp4" />
        </video>
      ) : null}
      {children}
    </div>
  );
}

/* ── Layers under the 3D model ──────────────────────────────────────── */

/** Darkens the paper on the home page while the handover is on the stage. */
function StoryDusk() {
  const dusk = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => {
      const g = story.g;
      if (!dusk.current) return;
      const k = reduced ? Number(Math.floor(g) === 8) : sweep(g, 8) * (1 - sweep(g, 9));
      dusk.current.style.opacity = k.toFixed(3);
    };
    update();
    return subscribe(update);
  }, []);

  return (
    <div
      ref={dusk}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 bg-navy-950 opacity-0 motion-reduce:transition-opacity motion-reduce:duration-300"
    />
  );
}

/** The fixed layers that sit between the navy paper and the 3D model. */
export function UnderLayers() {
  const pathname = usePathname();
  // Keyed by page, so every layer starts fresh after a navigation.
  return pathname === "/" ? <StoryDusk key={pathname} /> : null;
}
