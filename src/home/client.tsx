"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { story, subscribe } from "@/scene/store";

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

/* ── Video layer ────────────────────────────────────────────────────── */

/**
 * A stock clip used as a moody layer inside a drawing, tinted navy.
 *
 * It is loaded only on wide screens with a mouse, never with Save-Data or
 * reduced motion, and only once its chapter is near the screen. It pauses
 * whenever it scrolls away or the tab is hidden. Everyone else gets
 * nothing here: the drawing is complete without it.
 */
export function SceneVideo({ name, className = "", style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const ok =
      window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !conn?.saveData;
    if (!ok) return;
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          near.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    near.observe(el);
    return () => near.disconnect();
  }, []);

  useEffect(() => {
    const el = box.current;
    const v = video.current;
    if (!load || !el || !v) return;
    let onScreen = false;
    const sync = () => {
      if (onScreen && !document.hidden) v.play().catch(() => {});
      else v.pause();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [load]);

  return (
    <div ref={box} aria-hidden="true" className={`pointer-events-none absolute overflow-hidden ${className}`} style={style}>
      {load ? (
        <>
          <video ref={video} muted loop playsInline preload="none" poster={`/videos/${name}.jpg`} className="h-full w-full object-cover opacity-70 grayscale">
            <source src={`/videos/${name}.webm`} type="video/webm" />
            <source src={`/videos/${name}.mp4`} type="video/mp4" />
          </video>
          {/* tint the footage into the palette */}
          <span className="absolute inset-0 bg-primary mix-blend-color" />
          <span className="absolute inset-0 bg-primary/35" />
        </>
      ) : null}
    </div>
  );
}

/* ── Layers under the 3D model ──────────────────────────────────────── */

/** Darkens the paper while the handover chapter is on screen. */
function DuskLayer({ target }: { target: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOn(entry.isIntersecting), {
      rootMargin: "-45% 0px -45% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 bg-navy-950 transition-opacity duration-700 motion-reduce:transition-none ${on ? "opacity-100" : "opacity-0"}`}
    />
  );
}

/**
 * A video layer for chapters that use the 3D model. It sits behind the
 * model, fixed to the right-hand side of the screen, exists only on pages
 * that have its chapter, and fades in while that chapter is in view.
 */
function BackdropVideo({ target, name }: { target: string; name: string }) {
  const [present, setPresent] = useState(false);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setPresent(true);
        setOn(entry.isIntersecting);
      },
      { rootMargin: "-35% 0px -35% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  if (!present) return null;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-y-0 right-0 hidden w-[62vw] transition-opacity duration-700 lg:block ${on ? "opacity-100" : "opacity-0"}`}
      style={{ maskImage: "radial-gradient(ellipse 55% 55% at 55% 42%, #000 20%, transparent 75%)" }}
    >
      <SceneVideo name={name} className="inset-0" />
    </div>
  );
}

/** The fixed layers that sit between the navy paper and the 3D model. */
export function UnderLayers() {
  const pathname = usePathname();
  // Keyed by page, so every layer starts fresh after a navigation.
  return (
    <div key={pathname} className="contents">
      <DuskLayer target="handover" />
      <BackdropVideo target="structure" name="iron-worker" />
      <BackdropVideo target="start" name="building-landscape" />
    </div>
  );
}
