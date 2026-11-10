"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clamp01, watchScroll } from "@/lib/scroll";
import { setProgress } from "@/scene/store";

/**
 * One chapter of the home story.
 *
 * On desktop the chapter is taller than the screen and its stage sticks, so
 * scrolling plays the drawing instead of moving the page. On phones the
 * chapter is ordinary content and the drawing plays as it passes through
 * the screen. Either way the progress (0 to 1) is published as the CSS
 * variable --p and to the scene store.
 *
 * With reduced motion (or no JavaScript) --p stays at 1: the finished
 * drawing, with exactly the same content.
 */
export function Chapter({
  id,
  index,
  length = 180,
  label,
  className = "",
  children,
}: {
  id: string;
  index: number;
  /** Extra scroll distance on desktop, in % of the screen height. */
  length?: number;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(index, 1);
      return;
    }
    const wide = window.matchMedia("(min-width: 1024px)");
    let last = -1;
    const update = () => {
      const vh = window.innerHeight;
      let p: number;
      if (wide.matches) {
        // Pinned: from the stage sliding in (index 0: from the very top)
        // until the chapter's bottom reaches the bottom of the screen.
        const r = el.getBoundingClientRect();
        const start = index === 0 ? 0 : vh * 0.55;
        p = (start - r.top) / (r.height - vh + start);
      } else {
        // Flowing: while the drawing travels from low on the screen to the middle.
        const scene = el.querySelector<HTMLElement>("[data-scene]") ?? el;
        const r = scene.getBoundingClientRect();
        p = index === 0 ? -r.top / r.height : (vh * 0.88 - r.top) / (vh * 0.46 + r.height / 2);
      }
      p = clamp01(p);
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      el.style.setProperty("--p", p.toFixed(4));
      setProgress(index, p);
    };
    const stop = watchScroll(update);
    wide.addEventListener("change", update);
    return () => {
      stop();
      wide.removeEventListener("change", update);
    };
  }, [index]);

  return (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      data-chapter={index}
      className={`chapter relative lg:h-[var(--len)] ${className}`}
      style={{ "--len": `${100 + length}svh` } as React.CSSProperties}
    >
      <div className="relative lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden">{children}</div>
    </section>
  );
}
