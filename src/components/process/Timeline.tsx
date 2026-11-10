"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Horizontal build timeline. On wide screens the section pins and vertical
 * scrolling moves the stages sideways along the construction line. On
 * phones, with reduced motion, or without JavaScript it is a plain vertical
 * list. Every stage is ordinary text, so it reads the same either way.
 */
export function Timeline({ children, count }: { children: ReactNode; count: number }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      el.dataset.pinned = "";
      const distance = () => Math.max(0, tr.scrollWidth - window.innerWidth);
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.4,
          invalidateOnRefresh: true,
          onUpdate: (self) => el.style.setProperty("--p", self.progress.toFixed(4)),
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        delete el.dataset.pinned;
        el.style.removeProperty("--p");
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={root}
      className="group/tl relative overflow-hidden lg:flex lg:h-svh lg:flex-col lg:justify-center"
      style={{ "--count": count } as React.CSSProperties}
    >
      <ol
        ref={track}
        className="relative grid gap-y-0 px-[var(--margin)] lg:flex lg:w-max lg:gap-x-[var(--gutter)] lg:pr-[calc(var(--margin)+6rem)] lg:group-data-[pinned]/tl:will-change-transform"
      >
        {/* the construction line through the stage markers, filling in lime as you go */}
        <li aria-hidden="true" className="pointer-events-none absolute left-[var(--margin)] right-[calc(var(--margin)+6rem)] top-[7px] hidden h-0.5 bg-secondary group-data-[pinned]/tl:block">
          <span className="block h-full origin-left bg-accent" style={{ transform: "scaleX(var(--p, 0))" }} />
        </li>
        {children}
      </ol>
    </div>
  );
}
