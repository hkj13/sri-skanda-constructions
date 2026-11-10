"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { story, subscribe } from "@/scene/store";
import { SWEEP, sweep, threeChapterAt, windowClip } from "./story";

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
 * Moving footage only on wide screens with a mouse, without Save-Data or
 * reduced motion. Everyone else gets the clip's still frame.
 */
function playMode(): Mode {
  if (decided) return decided;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const ok =
    window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !conn?.saveData;
  decided = ok ? "video" : "still";
  return decided;
}
const never = () => () => {};
const useMode = () => useSyncExternalStore(never, playMode, () => "none" as Mode);

let pageLoaded = false;

/**
 * A stock clip shown as a tinted layer inside a drawing of the home story.
 *
 * It loads once its chapter is close, plays only while the chapter is on
 * the stage (and the tab is visible), and pauses otherwise. Phones and
 * reduced motion get the still frame instead, when `still` is set.
 */
export function SceneVideo({
  name,
  chapter,
  className = "",
  style,
  still = true,
  late = false,
  children,
}: {
  name: string;
  /** The story chapter the clip belongs to. */
  chapter: number;
  className?: string;
  style?: CSSProperties;
  /** Show the still frame where the clip does not play. */
  still?: boolean;
  /** Wait for the page to finish loading first (the opening chapter). */
  late?: boolean;
  /** Drawn over the footage, such as window bars. */
  children?: ReactNode;
}) {
  const mode = useMode();
  const video = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (mode !== "video") return;
    let ready = !late || pageLoaded || document.readyState === "complete";
    let on = false;
    let idle = 0;
    const check = () => {
      const g = story.g;
      if (ready && Math.abs(g - (chapter + 0.5)) < 1.6) setLoad(true);
      const v = video.current;
      const now = g >= chapter - SWEEP && g < chapter + 1 + SWEEP && !document.hidden;
      if (!v || now === on) return;
      on = now;
      if (on) v.play().catch(() => {});
      else v.pause();
    };
    const onLoad = () => {
      pageLoaded = true;
      // Give the first paint and the fonts the network first.
      idle = window.setTimeout(() => {
        ready = true;
        check();
      }, 600);
    };
    if (!ready) window.addEventListener("load", onLoad, { once: true });
    check();
    const stop = subscribe(check);
    document.addEventListener("visibilitychange", check);
    return () => {
      stop();
      window.clearTimeout(idle);
      window.removeEventListener("load", onLoad);
      document.removeEventListener("visibilitychange", check);
    };
  }, [mode, chapter, late, load]);

  const tint = (
    <>
      {/* tint the footage into the palette */}
      <span className="absolute inset-0 bg-primary mix-blend-color" />
      <span className="absolute inset-0 bg-primary/15" />
    </>
  );

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute overflow-hidden ${className}`} style={style}>
      {mode === "video" && load ? (
        <>
          <video
            ref={video}
            muted
            loop
            playsInline
            preload="auto"
            poster={`/videos/${name}.jpg`}
            onPlaying={() => setPlaying(true)}
            className={`h-full w-full object-cover grayscale transition-opacity duration-700 ${playing ? "opacity-95" : "opacity-80"}`}
          >
            <source src={`/videos/${name}.webm`} type="video/webm" />
            <source src={`/videos/${name}.mp4`} type="video/mp4" />
          </video>
          {tint}
        </>
      ) : mode === "still" && still ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- a small, pre-sized still frame */}
          <img src={`/videos/${name}.jpg`} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover grayscale" />
          {tint}
        </>
      ) : null}
      {children}
    </div>
  );
}

/* ── Layers under the 3D model ──────────────────────────────────────── */

/**
 * Fixed layers on the home page that sit between the navy paper and the
 * 3D model: dusk for the handover, and footage behind the model in the
 * Structure and Start chapters. They follow the story time, and are cut by
 * the same laser sweep as the model.
 */
function StoryUnder() {
  const dusk = useRef<HTMLDivElement>(null);
  const backs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => {
      const g = story.g;
      const chapter = Math.floor(g);
      if (dusk.current) {
        const k = reduced ? Number(chapter === 8) : sweep(g, 8) * (1 - sweep(g, 9));
        dusk.current.style.opacity = k.toFixed(3);
      }
      const c = threeChapterAt(g);
      for (const el of backs.current) {
        if (!el) continue;
        const mine = Number(el.dataset.chapter);
        const on = reduced ? chapter === mine : c === mine;
        el.style.visibility = on ? "visible" : "hidden";
        el.style.clipPath = on && !reduced ? windowClip(g, mine, mine + 1) : "";
      }
    };
    update();
    const stop = subscribe(update);
    return () => {
      stop();
    };
  }, []);

  const back = (chapter: number, name: string, n: number) => (
    <div
      ref={(el) => {
        backs.current[n] = el;
      }}
      data-chapter={chapter}
      aria-hidden="true"
      className="story-under pointer-events-none fixed inset-y-0 right-0 hidden w-[64vw] lg:block"
      style={{ visibility: "hidden" }}
    >
      <SceneVideo name={name} chapter={chapter} still className="inset-0 opacity-80" />
    </div>
  );

  return (
    <>
      <div
        ref={dusk}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-navy-950 opacity-0 motion-reduce:transition-opacity motion-reduce:duration-300"
      />
      {back(4, "iron-worker", 0)}
      {back(10, "building-landscape", 1)}
    </>
  );
}

/** The fixed layers that sit between the navy paper and the 3D model. */
export function UnderLayers() {
  const pathname = usePathname();
  // Keyed by page, so every layer starts fresh after a navigation.
  return pathname === "/" ? <StoryUnder key={pathname} /> : null;
}
