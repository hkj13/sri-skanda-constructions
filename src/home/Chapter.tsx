"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";
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
    gsap.registerPlugin(ScrollTrigger);
    const set = (p: number) => {
      el.style.setProperty("--p", p.toFixed(4));
      setProgress(index, p);
    };
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const st = ScrollTrigger.create({
        trigger: el,
        // Begin while the stage is still sliding in, so it never arrives empty.
        start: index === 0 ? "top top" : "top 55%",
        end: "bottom bottom",
        onUpdate: (self) => set(self.progress),
        onRefresh: (self) => set(self.progress),
      });
      return () => st.kill();
    });
    mm.add("(max-width: 1023.98px)", () => {
      const scene = el.querySelector<HTMLElement>("[data-scene]") ?? el;
      const st = ScrollTrigger.create({
        trigger: scene,
        start: index === 0 ? "top top" : "top 88%",
        end: index === 0 ? "bottom top" : "center 42%",
        onUpdate: (self) => set(self.progress),
        onRefresh: (self) => set(self.progress),
      });
      return () => st.kill();
    });
    return () => mm.revert();
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
