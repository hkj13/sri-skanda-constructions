"use client";

import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import { story } from "@/scene/store";
import { typeLists } from "@content/home";
import { tr } from "@content/i18n";
import { FACINGS, INDICATIVE, LAYOUTS } from "@content/vastu";
import { useChoice } from "./choices";

/**
 * The story's controls. They sit in the text column, next to what they
 * explain, and change the drawing (or the 3D model) on the stage.
 */

const pill = (on: boolean) =>
  `relative inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full px-5 font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-accent ${
    on ? "bg-accent text-primary" : "text-white hover:text-accent"
  }`;

/** Vastu: which way the plot faces. */
export function FacingControl() {
  const [facing, setFacing] = useChoice("facing");
  const layout = LAYOUTS[facing];
  return (
    <>
      <fieldset className="mt-8">
        <legend className="t-tech text-white">Your plot faces</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {FACINGS.map((f) => (
            <label
              key={f.id}
              className={`relative inline-flex min-h-12 min-w-[4.75rem] cursor-pointer items-center justify-center rounded-full border px-4 font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-accent ${
                facing === f.id ? "border-accent bg-accent text-primary" : "border-white/50 text-white hover:border-accent"
              }`}
            >
              <input
                type="radio"
                name="facing"
                value={f.id}
                checked={facing === f.id}
                onChange={() => setFacing(f.id)}
                className="sr-only"
              />
              {tr(f.label)}
            </label>
          ))}
        </div>
      </fieldset>
      <p aria-live="polite" className="mt-5 max-w-[38ch] text-white/90">
        {tr(layout.note)}
      </p>
      <p className="t-small mt-4 max-w-[38ch] border-l-2 border-accent pl-4 text-navy-300">{tr(INDICATIVE)}</p>
    </>
  );
}

/** Planning: the building as a flat plan or in 3D. */
export function PlanViewControl() {
  const [view, setView] = useChoice("plan");
  const option = (id: "2d" | "3d", label: string) => (
    <label className={pill(view === id)}>
      <input
        type="radio"
        name="plan-view"
        value={id}
        checked={view === id}
        onChange={() => {
          setView(id);
          story.planTarget = id === "2d" ? 1 : 0;
        }}
        className="sr-only"
      />
      {label}
    </label>
  );
  return (
    <fieldset className="mt-8">
      <legend className="sr-only">Show the building as</legend>
      <div className="inline-flex rounded-full border border-white/50 p-1">
        {option("2d", "2D plan")}
        {option("3d", "3D view")}
      </div>
    </fieldset>
  );
}

/** Homes or commercial: one switch changes the building on the same plot. */
export function TypeControl() {
  const [kind, setKind] = useChoice("kind");
  const list = typeLists[kind];
  return (
    <>
      <fieldset className="mt-8">
        <legend className="sr-only">Type of building</legend>
        <div className="inline-flex rounded-full border border-white/50 p-1">
          {(["home", "commercial"] as const).map((id) => (
            <label key={id} className={pill(kind === id)}>
              <input
                type="radio"
                name="building-type"
                value={id}
                checked={kind === id}
                onChange={() => {
                  setKind(id);
                  story.variantTarget = id === "commercial" ? 1 : 0;
                }}
                className="sr-only"
              />
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
    </>
  );
}
