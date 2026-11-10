"use client";

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowIcon } from "@/components/ui/icons";
import { IsoBuilding } from "@/scene/Iso";
import { story } from "@/scene/store";
import { typeLists, type ChapterCopy } from "@content/home";
import { tr } from "@content/i18n";
import { ChapterText, SCENE_SVG, Stage } from "./parts";

type Kind = "home" | "commercial";

/** Homes or commercial: one switch morphs the building on the same plot. */
export function TypesChapter({ copy }: { copy: ChapterCopy }) {
  const [kind, setKind] = useState<Kind>("home");
  const list = typeLists[kind];

  useEffect(() => {
    const tween = gsap.to(story, { variant: kind === "commercial" ? 1 : 0, duration: 1.1, ease: "power3.inOut" });
    return () => {
      tween.kill();
    };
  }, [kind]);

  const text = (
    <ChapterText copy={copy}>
      <fieldset className="mt-8">
        <legend className="sr-only">Type of building</legend>
        <div className="inline-flex rounded-full border border-white/50 p-1">
          {(["home", "commercial"] as const).map((id) => (
            <label
              key={id}
              className={`relative inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full px-5 font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-accent ${
                kind === id ? "bg-accent text-primary" : "text-white hover:text-accent"
              }`}
            >
              <input type="radio" name="building-type" value={id} checked={kind === id} onChange={() => setKind(id)} className="sr-only" />
              {tr(typeLists[id].label)}
            </label>
          ))}
        </div>
      </fieldset>
      <div aria-live="polite">
        <ul className="mt-6 space-y-2">
          {list.items.map((item) => (
            <li key={item.en} className="t-lead flex items-center gap-3 text-white">
              <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 bg-accent" />
              {tr(item)}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-8">
        <Link
          href={`/services/${list.service}`}
          className="inline-flex items-center gap-2 font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-accent"
        >
          {kind === "home" ? "Residential construction" : "Commercial construction"}
          <ArrowIcon className="h-5 w-5" />
        </Link>
      </p>
    </ChapterText>
  );

  const scene = (
    <div data-scene-fallback="" className="absolute inset-0">
      <div className={`absolute inset-0 transition-opacity duration-500 ${kind === "home" ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={kind !== "home"}>
        <IsoBuilding g={6.5} className={SCENE_SVG} label="A three-storey family home with a terrace on the plot." />
      </div>
      <div className={`absolute inset-0 transition-opacity duration-500 ${kind === "commercial" ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={kind !== "commercial"}>
        <IsoBuilding g={6.5} variant="commercial" className={SCENE_SVG} label="A four-storey commercial block with shopfronts at street level, on the same plot." />
      </div>
    </div>
  );

  return <Stage copy={copy} text={text} scene={scene} slot={6} />;
}
