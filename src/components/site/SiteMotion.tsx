"use client";

import type Lenis from "lenis";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useEffect, useRef } from "react";

declare global {
  interface Window {
    /** The smooth scroller, when it is running. */
    __lenis?: Lenis;
  }
}

const canHover = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Site-wide motion that is not tied to any one page:
 *
 * 1. Smooth wheel scrolling on desktop (Lenis). Touch scrolling is native.
 * 2. The laser line: a lime bar under the top edge showing scroll progress.
 * 3. The page change: the line sweeps down the screen while the new page is
 *    revealed behind it, using the browser's View Transitions. Browsers
 *    without them, and visitors who prefer reduced motion, get a plain,
 *    instant page change.
 */
export function SiteMotion() {
  const pathname = usePathname();
  const router = useRouter();
  const pending = useRef<(() => void) | null>(null);

  /* Smooth scroll, desktop only, loaded on demand so phones never fetch it */
  useEffect(() => {
    if (!canHover() || reducedMotion()) return;
    let lenis: Lenis | undefined;
    let raf = 0;
    let cancelled = false;
    import("lenis").then(({ default: L }) => {
      if (cancelled) return;
      lenis = new L({ duration: 1.05, anchors: true });
      window.__lenis = lenis;
      const tick = (time: number) => {
        lenis!.raf(time);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      delete window.__lenis;
    };
  }, []);

  /* Laser line as scroll progress */
  useEffect(() => {
    const root = document.documentElement;
    let ticking = false;
    const update = () => {
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty("--laser", max > 0 ? String(Math.min(1, window.scrollY / max)) : "0");
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  /* After every page change: finish the sweep and start from the top. */
  useEffect(() => {
    pending.current?.();
    pending.current = null;
    delete document.documentElement.dataset.nav;
    window.__lenis?.scrollTo(0, { immediate: true, force: true });
    window.__lenis?.resize();
  }, [pathname]);

  /* Page change: wrap same-site link clicks in a view transition. */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return;
      if (!("startViewTransition" in document) || reducedMotion()) return;

      e.preventDefault();
      document.documentElement.dataset.nav = "1";
      const done = new Promise<void>((resolve) => {
        pending.current = resolve;
        // Never leave the screen frozen if a page is slow to arrive.
        window.setTimeout(resolve, 2500);
      });
      document.startViewTransition(() => {
        startTransition(() => {
          router.push(url.pathname + url.search + url.hash);
        });
        return done;
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <div
      aria-hidden="true"
      className="laser pointer-events-none fixed inset-x-0 top-0 z-[60] h-[var(--laser-h)] bg-primary"
    >
      <div className="laser-fill h-full origin-left bg-accent will-change-transform" />
    </div>
  );
}
