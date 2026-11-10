"use client";

import { useId, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { enquiryLink } from "@/lib/whatsapp";
import { FINISH_LEVELS, FLOOR_OPTIONS, PROJECT_TYPES, rates, type FinishLevel } from "@content/estimate";
import { tr } from "@content/i18n";
import { ui } from "@content/ui";
import { Choices, Field, describedBy, inputClass, openWhatsApp } from "./fields";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** Rounds to a tidy figure in lakh or crore for display. */
function money(rupees: number): string {
  if (rupees >= 1e7) return `₹${(rupees / 1e7).toFixed(2)} crore`;
  if (rupees >= 1e5) return `₹${(rupees / 1e5).toFixed(1)} lakh`;
  return `₹${inr.format(rupees)}`;
}

/**
 * Cost estimator. With rates set in content/estimate.ts it shows an
 * indicative range; without them it goes straight to WhatsApp with the
 * visitor's details.
 */
export function Estimator() {
  const id = useId();
  const [area, setArea] = useState("");
  const [floors, setFloors] = useState("G+1");
  const [type, setType] = useState("home");
  const [finish, setFinish] = useState<FinishLevel>("standard");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string>();
  const [checked, setChecked] = useState(false);

  const sqft = Number(area.replace(/[, ]/g, ""));
  const valid = Number.isFinite(sqft) && sqft >= 100 && sqft <= 500000;
  const range = rates && valid ? { min: sqft * rates[finish].min, max: sqft * rates[finish].max } : null;

  const typeLabel = tr(PROJECT_TYPES.find((t) => t.id === type)!.label);
  const finishLabel = tr(FINISH_LEVELS.find((f) => f.id === finish)!.label);
  const floorLabel = tr(FLOOR_OPTIONS.find((f) => f.id === floors)!.label);

  const link = () =>
    enquiryLink(tr(ui.estimate.message), [
      [tr(ui.estimate.type), typeLabel],
      [tr(ui.estimate.area), valid ? `${inr.format(sqft)} sq ft` : area],
      [tr(ui.estimate.floors), floorLabel],
      [tr(ui.estimate.finish), finishLabel],
      [tr(ui.estimate.location), location],
      ...(range ? ([[tr(ui.estimate.rangeTitle), `${money(range.min)} to ${money(range.max)} (indicative)`]] as [string, string][]) : []),
    ]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setChecked(true);
    if (!valid) {
      setError(tr(ui.estimate.areaError));
      document.getElementById(`${id}-area`)?.focus();
      return;
    }
    setError(undefined);
    openWhatsApp(link());
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-x-[var(--gutter)] gap-y-12 lg:grid-cols-12">
      <div className="space-y-10 lg:col-span-7">
        <Field id={`${id}-area`} label={tr(ui.estimate.area)} help={tr(ui.estimate.areaHelp)} error={checked ? error : undefined} required>
          <div className="relative max-w-sm">
            <input
              id={`${id}-area`}
              inputMode="numeric"
              autoComplete="off"
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                if (checked) setError(undefined);
              }}
              aria-invalid={checked && !!error}
              aria-describedby={describedBy(`${id}-area`, "help", checked ? error : undefined)}
              className={`${inputClass} pr-20`}
              placeholder="e.g. 1800"
            />
            <span className="t-tech pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">{tr(ui.estimate.areaUnit)}</span>
          </div>
        </Field>

        <Choices
          name={`${id}-floors`}
          legend={tr(ui.estimate.floors)}
          options={FLOOR_OPTIONS.map((f) => ({ id: f.id, label: tr(f.label) }))}
          value={floors}
          onChange={setFloors}
          columns="grid-cols-2 sm:grid-cols-3 xl:grid-cols-5"
        />

        <Choices
          name={`${id}-type`}
          legend={tr(ui.estimate.type)}
          options={PROJECT_TYPES.map((t) => ({ id: t.id, label: tr(t.label) }))}
          value={type}
          onChange={setType}
        />

        <Choices
          name={`${id}-finish`}
          legend={tr(ui.estimate.finish)}
          options={FINISH_LEVELS.map((f) => ({ id: f.id, label: tr(f.label), note: tr(f.note) }))}
          value={finish}
          onChange={(v) => setFinish(v as FinishLevel)}
        />

        <Field id={`${id}-loc`} label={tr(ui.estimate.location)} help={tr(ui.estimate.locationHelp)}>
          <input
            id={`${id}-loc`}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            autoComplete="address-level2"
            aria-describedby={`${id}-loc-help`}
            className={`${inputClass} max-w-lg`}
          />
        </Field>
      </div>

      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
          <div className="rounded-lg bg-primary p-6 text-white sm:p-8">
            <p className="t-tech text-navy-300">{tr(ui.estimate.summary)}</p>
            <dl className="mt-4 divide-y divide-secondary">
              {[
                [tr(ui.estimate.type), typeLabel],
                [tr(ui.estimate.area), valid ? `${inr.format(sqft)} sq ft` : "—"],
                [tr(ui.estimate.floors), floorLabel],
                [tr(ui.estimate.finish), finishLabel],
                [tr(ui.estimate.location), location || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-2.5">
                  <dt className="text-white/80">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            <div aria-live="polite" className="mt-6">
              {rates ? (
                range ? (
                  <div className="rounded-md bg-secondary p-5">
                    <p className="t-tech text-accent">{tr(ui.estimate.rangeTitle)}</p>
                    <p className="mt-2 text-3xl font-light">
                      {money(range.min)} to {money(range.max)}
                    </p>
                    <p className="t-small mt-2 text-white/85">{tr(ui.estimate.rangeNote)}</p>
                  </div>
                ) : (
                  <p className="text-white/85">Enter the built-up area to see an indicative range.</p>
                )
              ) : (
                <p className="text-white/90">{tr(ui.estimate.noRatesNote)}</p>
              )}
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-6 py-3.5 text-lg font-semibold text-primary transition-colors hover:bg-[#3fe07a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              data-wa-cta=""
            >
              <WhatsAppIcon className="h-5 w-5" />
              {tr(ui.estimate.send)}
            </button>
            <p className="t-small mt-3 text-white/80">Opens WhatsApp with your details filled in. Nothing is sent until you press send there.</p>
          </div>
        </div>
      </aside>
    </form>
  );
}
