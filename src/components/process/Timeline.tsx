"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clamp01, watchScroll } from "@/lib/scroll";

/**
 * Horizontal build timeline. On wide screens the section sticks and
 * vertical scrolling moves the stages sideways along the construction line.
 * On phones, with reduced motion, or without JavaScript it is a plain
 * vertical list. Every stage is ordinary text, so it reads the same either
 * way.
 */
export function Timeline({ children, count }: { children: ReactNode; count: number }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = outer.current;
    const tr = track.current;
    if (!el || !tr || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wide = window.matchMedia("(min-width: 1024px)");
    let distance = 0;

    const measure = () => {
      if (!wide.matches) {
        delete el.dataset.pinned;
        el.style.removeProperty("height");
        tr.style.removeProperty("transform");
        return false;
      }
      el.dataset.pinned = "";
      distance = Math.max(0, tr.scrollWidth - window.innerWidth);
      // Tall enough to scroll the whole track sideways while the stage sticks.
      el.style.height = `${window.innerHeight + distance}px`;
      return true;
    };
    let pinned = measure();
    let width = window.innerWidth;

    const update = () => {
      if (window.innerWidth !== width || pinned !== wide.matches) {
        width = window.innerWidth;
        pinned = measure();
      }
      if (!pinned) return;
      const r = el.getBoundingClientRect();
      const p = clamp01(-r.top / Math.max(1, r.height - window.innerHeight));
      el.style.setProperty("--p", p.toFixed(4));
      tr.style.transform = `translate3d(${(-p * distance).toFixed(1)}px, 0, 0)`;
    };
    const stop = watchScroll(update);
    return () => {
      stop();
      delete el.dataset.pinned;
      el.style.removeProperty("height");
    };
  }, []);

  return (
    <div ref={outer} className="group/tl relative" style={{ "--count": count } as React.CSSProperties}>
      <div className="relative group-data-[pinned]/tl:sticky group-data-[pinned]/tl:top-0 group-data-[pinned]/tl:flex group-data-[pinned]/tl:h-svh group-data-[pinned]/tl:flex-col group-data-[pinned]/tl:justify-center group-data-[pinned]/tl:overflow-hidden">
        <ol
          ref={track}
          className="relative grid gap-y-0 px-[var(--margin)] lg:grid-cols-2 lg:gap-x-[var(--gutter)] lg:gap-y-12 xl:grid-cols-4 group-data-[pinned]/tl:flex group-data-[pinned]/tl:w-max group-data-[pinned]/tl:pr-[calc(var(--margin)+6rem)] group-data-[pinned]/tl:will-change-transform"
        >
          {/* the construction line through the stage markers, filling in lime as you go */}
          <li aria-hidden="true" className="pointer-events-none absolute left-[var(--margin)] right-[calc(var(--margin)+6rem)] top-[7px] hidden h-0.5 bg-secondary group-data-[pinned]/tl:block">
            <span className="block h-full origin-left bg-accent" style={{ transform: "scaleX(var(--p, 0))" }} />
          </li>
          {children}
        </ol>
      </div>
    </div>
  );
}
