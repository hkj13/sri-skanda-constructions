"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Facing } from "@content/vastu";

/**
 * The visitor's choices in the home story. A control sits in the text
 * column and the drawing it changes sits on the stage, so both read the
 * choice from this small store instead of passing it down.
 */
type Choices = {
  facing: Facing;
  plan: "3d" | "2d";
  kind: "home" | "commercial";
  /** Renovation slider position, 0 to 100 (share of "before" shown). */
  reno: number;
};

const INITIAL: Choices = { facing: "E", plan: "3d", kind: "home", reno: 55 };
const state: Choices = { ...INITIAL };
const listeners = new Set<() => void>();

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export function setChoice<K extends keyof Choices>(key: K, value: Choices[K]) {
  if (state[key] === value) return;
  state[key] = value;
  listeners.forEach((l) => l());
}

export function getChoice<K extends keyof Choices>(key: K): Choices[K] {
  return state[key];
}

export function useChoice<K extends keyof Choices>(key: K): [Choices[K], (v: Choices[K]) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => state[key],
    () => INITIAL[key],
  );
  const set = useCallback((v: Choices[K]) => setChoice(key, v), [key]);
  return [value, set];
}
