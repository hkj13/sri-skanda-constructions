"use client";

import type { ReactNode } from "react";

/** Shared form controls: large touch targets, visible labels, inline errors. */

export function Field({
  id,
  label,
  help,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-lg font-medium">
        {label}
        {required ? <span className="t-tech ml-2 text-gray-600">Required</span> : null}
      </label>
      {help ? (
        <p id={`${id}-help`} className="t-small mt-1 text-gray-600">
          {help}
        </p>
      ) : null}
      <div className="mt-3">{children}</div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 font-medium text-primary">
          <span aria-hidden="true" className="mr-2 inline-block h-2.5 w-2.5 bg-primary" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "block w-full min-h-13 rounded-md border-2 border-primary/30 bg-white px-4 py-3 text-lg text-primary placeholder:text-gray-500 focus:border-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-[invalid=true]:border-primary";

export function describedBy(id: string, help?: string, error?: string) {
  return [help ? `${id}-help` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
}

/** A set of large radio choices drawn as chips. */
export function Choices({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  help,
  columns = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  name: string;
  legend: string;
  options: { id: string; label: string; note?: string }[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  help?: string;
  columns?: string;
}) {
  return (
    <fieldset aria-describedby={[help ? `${name}-help` : "", error ? `${name}-error` : ""].filter(Boolean).join(" ") || undefined}>
      <legend className="text-lg font-medium">{legend}</legend>
      {help ? (
        <p id={`${name}-help`} className="t-small mt-1 text-gray-600">
          {help}
        </p>
      ) : null}
      <div className={`mt-3 grid gap-3 ${columns}`}>
        {options.map((o) => {
          const on = value === o.id;
          return (
            <label
              key={o.id}
              className={`relative flex min-h-13 cursor-pointer flex-col justify-center rounded-md border-2 px-4 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                on ? "border-primary bg-primary text-white" : "border-primary/30 bg-white text-primary hover:border-primary"
              }`}
            >
              <input type="radio" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)} className="sr-only" />
              <span className="font-semibold">{o.label}</span>
              {o.note ? <span className={`t-small ${on ? "text-white/85" : "text-gray-600"}`}>{o.note}</span> : null}
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={`${name}-error`} role="alert" className="mt-2 font-medium text-primary">
          <span aria-hidden="true" className="mr-2 inline-block h-2.5 w-2.5 bg-primary" />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/** Opens a WhatsApp link from a click, with a fallback if it is blocked. */
export function openWhatsApp(url: string): boolean {
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (win) return true;
  window.location.href = url;
  return false;
}
