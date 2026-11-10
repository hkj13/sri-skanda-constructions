"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { watchScroll } from "@/lib/scroll";
import { notify, story } from "@/scene/store";
import { StageLayers } from "./layers";
import { CHAPTERS, LENGTHS, activeSweep, clamp01, layerProgress, morphAt, smooth, windowClip } from "./story";

type Meta = { id: string; label: string; sheet: string };

/**
 * The home story: one stage that stays on screen from the first stake to
 * the key, and the chapter texts scrolling past it.
 *
 * Wide screens: each chapter's text pins on the left while its drawing
 * plays on the right; the stage never moves. Phones: the stage stays at
 * the top and the texts scroll beneath it.
 *
 * The scroll loop turns the scroll position into story time g (see
 * story.ts), shows the right layers, cuts them with the laser sweep and
 * publishes g for the 3D model. With reduced motion every chapter simply
 * shows its finished drawing and changes with a short fade.
 */
export function Story({ chapters, texts }: { chapters: Meta[]; texts: ReactNode[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const sections = Array.from(el.querySelectorAll<HTMLElement>(".story-chapter"));
    const layers = Array.from(el.querySelectorAll<HTMLElement>(".story-layer"));
    const titles = layers.map((l) => l.querySelector<HTMLElement>("[data-title]"));
    const stage = el.querySelector<HTMLElement>(".story-stage")!;
    const laser = el.querySelector<HTMLElement>(".story-laser")!;
    const laserTag = laser.querySelector<HTMLElement>("[data-tag]")!;
    const wide = window.matchMedia("(min-width: 1024px)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQuery.matches;

    let bounds: number[] = [];
    let ref = 0;
    let stageH = 0;
    const measure = () => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      const sr = stage.getBoundingClientRect();
      stageH = sr.height;
      ref = wide.matches ? vh * 0.5 : stageH + 0.35 * (vh - stageH);
      const top = el.getBoundingClientRect().top + y;
      bounds = [top + ref];
      for (let i = 1; i < CHAPTERS; i++) bounds[i] = sections[i].getBoundingClientRect().top + y;
      bounds[CHAPTERS] = sections[CHAPTERS - 1].getBoundingClientRect().bottom + y;
      // Line the layers' grid up with the page grid behind them.
      stage.style.setProperty("--grid-x", `${(-sr.left).toFixed(1)}px`);
    };

    const timeAt = (scroll: number) => {
      const Y = scroll + ref;
      if (Y <= bounds[0]) return 0;
      for (let i = 0; i < CHAPTERS; i++) {
        if (Y < bounds[i + 1]) return i + (Y - bounds[i]) / Math.max(1, bounds[i + 1] - bounds[i]);
      }
      return CHAPTERS;
    };

    // Write only what changed: the loop runs every frame while scrolling.
    const memo = new Map<string, string>();
    const set = (key: string, target: HTMLElement, prop: string, value: string) => {
      if (memo.get(key) === value) return;
      memo.set(key, value);
      target.style.setProperty(prop, value);
    };
    const flag = (key: string, target: HTMLElement, name: string, on: boolean) => {
      const v = on ? "1" : "0";
      if (memo.get(key) === v) return;
      memo.set(key, v);
      target.toggleAttribute(name, on);
    };

    let lastTag = -1;
    const apply = (g: number) => {
      const cur = Math.min(CHAPTERS - 1, Math.floor(g));
      const morph = reduced ? Number(g >= 1) : morphAt(g);

      layers.forEach((layer, i) => {
        let on: boolean;
        let clip = "none";
        let p: number;
        if (reduced) {
          on = i === cur || (i === 1 && cur === 0);
          p = i === 0 || (i === 1 && cur === 0) ? 0 : 1;
        } else {
          if (i === 0) on = g < 1;
          else if (i === 1) on = g < 2.1;
          else on = g >= i - 0.07 && (i === CHAPTERS - 1 || g < i + 1.07);
          if (i >= 1) clip = windowClip(g, i === 1 ? -1 : i, i + 1);
          p = layerProgress(g, i);
        }
        flag(`off${i}`, layer, "data-off", !on);
        flag(`far${i}`, layer, "data-far", !(g > i - 1.3 && g < i + 2.3));
        if (!on) return;
        set(`p${i}`, layer, "--p", p.toFixed(4));
        set(`c${i}`, layer, "clip-path", clip);
        if (i === 1) flag("overlay", layer, "data-overlay", reduced ? cur === 0 : g < 1);
      });
      // The two title blocks swap while the plot becomes the plan.
      const swap = smooth((morph - 0.45) / 0.2);
      if (titles[0]) set("t0", titles[0], "opacity", (1 - swap).toFixed(3));
      if (titles[1]) set("t1", titles[1], "opacity", swap.toFixed(3));

      sections.forEach((s, i) => {
        if (Math.abs(g - i - 0.5) > 2) return;
        set(`s${i}`, s, "--p", reduced ? (i === 0 ? "0" : "1") : clamp01(g - i).toFixed(4));
      });

      const a = reduced ? null : activeSweep(g);
      set("laser", laser, "visibility", a ? "visible" : "hidden");
      if (a) {
        set("laserY", laser, "transform", `translate3d(0, ${(a.s * stageH).toFixed(1)}px, 0)`);
        if (a.k !== lastTag) {
          lastTag = a.k;
          laserTag.textContent = chapters[a.k].sheet;
        }
      }
    };

    let last = -1;
    const update = () => {
      const g = timeAt(window.scrollY);
      if (Math.abs(g - last) < 0.00002) return;
      last = g;
      story.g = g;
      for (let i = 0; i < CHAPTERS; i++) story.progress[i] = clamp01(g - i);
      apply(g);
      notify();
    };
    const refresh = () => {
      measure();
      last = -1;
      update();
    };

    measure();
    el.dataset.live = "";
    update();
    const stop = watchScroll(update);
    const ro = new ResizeObserver(refresh);
    ro.observe(el);
    const onMotion = () => {
      reduced = reducedQuery.matches;
      memo.clear();
      refresh();
    };
    reducedQuery.addEventListener("change", onMotion);
    wide.addEventListener("change", refresh);
    return () => {
      stop();
      ro.disconnect();
      reducedQuery.removeEventListener("change", onMotion);
      wide.removeEventListener("change", refresh);
      delete el.dataset.live;
      story.g = 0;
      story.progress.fill(0);
      notify();
    };
  }, [chapters]);

  return (
    <div ref={root} className="story">
      <div data-scene-slot="" data-story="" aria-hidden="true" className="story-backdrop">
        <div className="shell grid-12 h-full">
          <div className="story-stage col-span-12 -mx-[var(--margin)] lg:col-span-7 lg:col-start-6 lg:ml-0 2xl:col-span-8 2xl:col-start-5">
            <StageLayers />
          </div>
        </div>
        <div className="story-laser">
          <span data-tag="" className="t-tech" />
        </div>
      </div>

      {chapters.map((c, i) => (
        <section
          key={c.id}
          id={c.id}
          aria-label={c.label}
          className="story-chapter"
          style={{ gridRow: i + 1, "--len": `${100 + LENGTHS[i]}svh`, "--p": i === 0 ? 0 : 1 } as CSSProperties}
        >
          <div className="story-text shell grid-12">
            <div className="story-copy col-span-12 lg:col-span-5 2xl:col-span-4">{texts[i]}</div>
          </div>
        </section>
      ))}
    </div>
  );
}
