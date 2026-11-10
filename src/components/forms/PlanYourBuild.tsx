"use client";

import { useEffect, useId, useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { enquiryLink, type EnquiryRow } from "@/lib/whatsapp";
import { BUDGET_RANGES, FLOOR_OPTIONS, PROJECT_TYPES, TIMELINES } from "@content/estimate";
import { tr } from "@content/i18n";
import { ui } from "@content/ui";
import { Choices, Field, describedBy, inputClass, openWhatsApp } from "./fields";

type Answers = {
  type: string;
  location: string;
  plotSize: string;
  floors: string;
  area: string;
  budget: string;
  timeline: string;
  approvedPlan: string;
  vastu: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
};

const EMPTY: Answers = {
  type: "",
  location: "",
  plotSize: "",
  floors: "",
  area: "",
  budget: "",
  timeline: "",
  approvedPlan: "",
  vastu: "",
  name: "",
  phone: "",
  email: "",
  notes: "",
};

const c = ui.contact;
const STEPS = [c.steps.type, c.steps.plot, c.steps.size, c.steps.budget, c.steps.plan, c.steps.you];
const YES_NO = () => [
  { id: "Yes", label: tr(c.yes) },
  { id: "No", label: tr(c.no) },
  { id: "Not sure", label: tr(c.notSure) },
];

/**
 * Plan your build: six short steps. Sending opens WhatsApp with every answer
 * as one tidy message. If an email service is configured on the server, the
 * same enquiry is emailed too, but WhatsApp is always the main path.
 */
export function PlanYourBuild() {
  const id = useId();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Answers, string>>>({});
  const [sentLink, setSentLink] = useState<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  const set = (k: keyof Answers) => (v: string) => {
    setA((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  // Move focus to the new step's question, so screen readers follow along.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus();
  }, [step, sentLink]);

  const label = (list: { id: string; label: { en: string } }[], v: string) => tr(list.find((x) => x.id === v)?.label ?? { en: v });

  // Short, plain labels for the WhatsApp message.
  const rows = (): EnquiryRow[] => [
    ["Project", a.type ? label(PROJECT_TYPES, a.type) : ""],
    ["Plot location", a.location],
    ["Plot size", a.plotSize],
    ["Floors", a.floors ? label(FLOOR_OPTIONS, a.floors) : ""],
    ["Built-up area", a.area ? `${a.area.replace(/\s*sq\.?\s*ft\.?$/i, "")} sq ft` : ""],
    ["Budget", a.budget ? label(BUDGET_RANGES, a.budget) : ""],
    ["Start", a.timeline ? label(TIMELINES, a.timeline) : ""],
    ["Approved plan", a.approvedPlan],
    ["Vastu consultation", a.vastu],
    ["Name", a.name],
    ["Phone", a.phone],
    ["Email", a.email],
    ["Notes", a.notes],
  ];

  const validate = (s: number): boolean => {
    const e: Partial<Record<keyof Answers, string>> = {};
    if (s === 0 && !a.type) e.type = tr(c.chooseOne);
    if (s === 1 && !a.location.trim()) e.location = tr(c.plotError);
    if (s === 5) {
      if (!a.name.trim()) e.name = tr(c.nameError);
      if (a.phone.replace(/\D/g, "").length < 10) e.phone = tr(c.phoneError);
    }
    setErrors(e);
    const keys = Object.keys(e);
    if (keys.length) {
      const target = keys[0] === "type" ? document.querySelector<HTMLInputElement>(`input[name="${id}-type"]`) : document.getElementById(`${id}-${keys[0]}`);
      target?.focus();
      return false;
    }
    return true;
  };

  const next = () => {
    if (validate(step)) setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      next();
      return;
    }
    if (!validate(step)) return;
    const link = enquiryLink(tr(c.messageTitle), rows());
    openWhatsApp(link);
    setSentLink(link);
    // Email copy, only if the server has been set up for it. Never blocks.
    fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(rows().filter(([, v]) => v))),
      keepalive: true,
    }).catch(() => {});
  };

  const field = (k: keyof Answers, labelText: string, opts: { help?: string; required?: boolean; type?: string; autoComplete?: string; inputMode?: "numeric" | "tel" | "email" | "text"; area?: boolean } = {}) => {
    const fid = `${id}-${k}`;
    const err = errors[k];
    const common = {
      id: fid,
      value: a[k],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k)(e.target.value),
      "aria-invalid": !!err,
      "aria-describedby": describedBy(fid, opts.help, err),
      "aria-required": opts.required || undefined,
      className: inputClass,
    };
    return (
      <Field id={fid} label={labelText} help={opts.help} error={err} required={opts.required}>
        {opts.area ? <textarea rows={4} {...common} /> : <input type={opts.type ?? "text"} autoComplete={opts.autoComplete} inputMode={opts.inputMode} {...common} />}
      </Field>
    );
  };

  if (sentLink) {
    return (
      <div className="rounded-lg bg-surface p-6 sm:p-10">
        <h2 ref={heading} tabIndex={-1} className="t-h3 outline-none">
          {tr(c.review)}
        </h2>
        <p className="t-lead mt-4 measure">{tr(c.opened)}</p>
        <a
          href={sentLink}
          target="_blank"
          rel="noopener noreferrer"
          data-wa-cta=""
          className="mt-6 inline-flex min-h-13 items-center gap-2.5 rounded-full bg-whatsapp px-6 py-3.5 text-lg font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {tr(c.openAgain)}
        </a>
        <dl className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {rows()
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="border-t border-primary/15 pt-3">
                <dt className="t-tech text-gray-600">{k}</dt>
                <dd className="mt-1 font-medium">{v}</dd>
              </div>
            ))}
        </dl>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate aria-labelledby={`${id}-q`}>
      {/* progress: a construction line with six stations */}
      <div className="flex items-center gap-4">
        <p className="t-tech shrink-0 text-gray-600">
          {tr(c.step)} {step + 1} {tr(c.of)} {STEPS.length}
        </p>
        <ol aria-hidden="true" className="flex flex-1 items-center">
          {STEPS.map((s, n) => (
            <li key={s.en} className="flex flex-1 items-center last:flex-none">
              <span className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary ${n <= step ? "bg-primary" : "bg-white"}`} />
              {n < STEPS.length - 1 ? <span className={`h-0.5 flex-1 ${n < step ? "bg-primary" : "bg-primary/20"}`} /> : null}
            </li>
          ))}
        </ol>
      </div>

      <h2 id={`${id}-q`} ref={heading} tabIndex={-1} className="t-h2 mt-8 outline-none">
        {tr(STEPS[step])}
      </h2>

      <div className="mt-10 space-y-10">
        {step === 0 ? (
          <Choices name={`${id}-type`} legend={tr(STEPS[0])} options={PROJECT_TYPES.map((t) => ({ id: t.id, label: tr(t.label) }))} value={a.type} onChange={set("type")} error={errors.type} />
        ) : null}
        {step === 1 ? (
          <div className="grid gap-10 md:grid-cols-2">
            {field("location", tr(c.plotLocation), { help: tr(c.plotLocationHelp), required: true, autoComplete: "address-level2" })}
            {field("plotSize", tr(c.plotSize), { help: tr(c.plotSizeHelp) })}
          </div>
        ) : null}
        {step === 2 ? (
          <>
            <Choices name={`${id}-floors`} legend={tr(c.floors)} options={FLOOR_OPTIONS.map((f) => ({ id: f.id, label: tr(f.label) }))} value={a.floors} onChange={set("floors")} columns="grid-cols-2 sm:grid-cols-3 xl:grid-cols-5" />
            <div className="max-w-sm">{field("area", tr(c.area), { help: tr(c.areaHelp), inputMode: "numeric" })}</div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <Choices name={`${id}-budget`} legend={tr(c.budget)} options={BUDGET_RANGES.map((b) => ({ id: b.id, label: tr(b.label) }))} value={a.budget} onChange={set("budget")} />
            <Choices name={`${id}-timeline`} legend={tr(c.timeline)} options={TIMELINES.map((t) => ({ id: t.id, label: tr(t.label) }))} value={a.timeline} onChange={set("timeline")} columns="sm:grid-cols-2 xl:grid-cols-4" />
          </>
        ) : null}
        {step === 4 ? (
          <>
            <Choices name={`${id}-approved`} legend={tr(c.approvedPlan)} options={YES_NO()} value={a.approvedPlan} onChange={set("approvedPlan")} />
            <Choices name={`${id}-vastu`} legend={tr(c.vastu)} options={YES_NO()} value={a.vastu} onChange={set("vastu")} />
          </>
        ) : null}
        {step === 5 ? (
          <div className="grid gap-10 md:grid-cols-2">
            {field("name", tr(c.name), { required: true, autoComplete: "name" })}
            {field("phone", tr(c.phone), { help: tr(c.phoneHelp), required: true, type: "tel", autoComplete: "tel", inputMode: "tel" })}
            {field("email", tr(c.email), { type: "email", autoComplete: "email", inputMode: "email" })}
            <div className="md:col-span-2">{field("notes", tr(c.notes), { area: true })}</div>
          </div>
        ) : null}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-primary/15 pt-8">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="inline-flex min-h-13 items-center rounded-full border-2 border-primary/40 px-6 font-semibold hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {tr(c.back)}
          </button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <button
            type="submit"
            className="inline-flex min-h-13 items-center rounded-full bg-primary px-8 font-semibold text-white hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {tr(c.next)}
          </button>
        ) : (
          <button
            type="submit"
            data-wa-cta=""
            className="inline-flex min-h-13 items-center gap-2.5 rounded-full bg-whatsapp px-8 text-lg font-semibold text-primary hover:bg-[#3fe07a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {tr(c.send)}
          </button>
        )}
      </div>
    </form>
  );
}
