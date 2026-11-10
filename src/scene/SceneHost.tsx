"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

type Nav = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
};

/**
 * Decides whether this device gets the 3D model at all.
 *
 * It loads only on a wide screen with a mouse, WebGL 2, enough memory and
 * cores, no Save-Data and no reduced-motion preference, and only after the
 * page has gone idle, so the first paint never waits for it. Everyone else
 * keeps the drawings, which show exactly the same content.
 *
 * Add ?3d=off to any address to switch it off, or ?3d=force to skip the
 * checks (useful when testing).
 */
function capable(): boolean {
  const nav = navigator as Nav;
  if (!window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && /2g/.test(nav.connection.effectiveType)) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return false;
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

export function SceneHost() {
  const [mode, setMode] = useState<"off" | "on" | "force">("off");

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("3d");
    if (param === "off") return;
    if (param !== "force" && !capable()) return;
    const start = () => setMode(param === "force" ? "force" : "on");
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 1200);
    return () => clearTimeout(id);
  }, []);

  if (mode === "off") return null;
  return <Scene3D force={mode === "force"} onGiveUp={() => setMode("off")} />;
}
