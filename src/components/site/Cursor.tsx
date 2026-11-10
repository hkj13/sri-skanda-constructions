"use client";

import { useEffect, useRef } from "react";

/**
 * Surveyor's crosshair for mouse users: two hairlines and live coordinates.
 * Over a link or button it snaps to the corners of that element.
 * It sits on top of the normal pointer, never replaces it, and is off on
 * touch screens and for visitors who prefer reduced motion.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = root.current;
    if (!fine || reduced || !el || window.innerWidth < 1024) return;

    let x = -100;
    let y = -100;
    let target: Element | null = null;
    let raf = 0;
    let shown = false;

    const draw = () => {
      raf = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (label.current)
        label.current.textContent = `X ${String(Math.round(x)).padStart(4, "0")} · Y ${String(Math.round(y + window.scrollY)).padStart(5, "0")}`;
      const f = frame.current;
      if (!f) return;
      if (target && target.isConnected) {
        const r = target.getBoundingClientRect();
        f.style.opacity = "1";
        f.style.transform = `translate3d(${r.left - 6}px, ${r.top - 6}px, 0)`;
        f.style.width = `${r.width + 12}px`;
        f.style.height = `${r.height + 12}px`;
      } else {
        f.style.opacity = "0";
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      target = (e.target as Element | null)?.closest?.("a, button, [role=slider], summary, label") ?? null;
      if (!shown) {
        shown = true;
        el.style.opacity = "1";
      }
      schedule();
    };
    const onLeave = () => {
      shown = false;
      el.style.opacity = "0";
      if (frame.current) frame.current.style.opacity = "0";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const corner = "absolute h-2.5 w-2.5 border-white";
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] hidden mix-blend-difference lg:block">
      <div ref={root} className="absolute left-0 top-0 opacity-0 transition-opacity duration-150">
        <span className="absolute -left-4 top-0 h-px w-8 bg-white/80" />
        <span className="absolute -top-4 left-0 h-8 w-px bg-white/80" />
        <span ref={label} className="t-tech absolute left-4 top-4 whitespace-nowrap text-[11px] text-white/90" />
      </div>
      <div ref={frame} className="absolute left-0 top-0 opacity-0 transition-[opacity,width,height] duration-150">
        <span className={`${corner} left-0 top-0 border-l border-t`} />
        <span className={`${corner} right-0 top-0 border-r border-t`} />
        <span className={`${corner} bottom-0 left-0 border-b border-l`} />
        <span className={`${corner} bottom-0 right-0 border-b border-r`} />
      </div>
    </div>
  );
}
