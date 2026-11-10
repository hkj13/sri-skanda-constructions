"use client";

import { Edges } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  COMMERCIAL_PARTS,
  CRANE,
  HOME_PARTS,
  PLOT,
  T,
  type Part,
  type Tone,
} from "./building";
import { story } from "./store";

/**
 * The building as a 3D architect's model: white massing, navy edges, lime
 * accents, soft daylight. One canvas for the whole site.
 *
 * The canvas is fixed to the screen and follows whichever "slot" element is
 * in view (a home chapter stage, or the top of an inner page), so it looks
 * like part of that section. What it shows is a pure function of the story
 * time `g` (chapter + scroll progress), read every frame from the store.
 */

const NAVY = "#1a2340";
const COLORS: Record<Tone, string> = {
  white: "#ffffff",
  slab: "#eef1f7",
  glass: "#2a3660",
  lime: "#d8f060",
  dark: "#2f3f74",
};
const LIT = new THREE.Color("#e8f5a0");
const GLASS = new THREE.Color(COLORS.glass);
const CENTRE = new THREE.Vector3(4.5, 0, 5);

/** What the active slot asks the scene to show. */
const view = {
  g: 0,
  variant: null as number | null,
  /** Fixed camera angle for inner pages, in degrees. */
  az: null as number | null,
  /** Shifts the building right, as a share of the width (home chapters). */
  shift: 0,
  home: false,
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const k = clamp01(v);
  return k * k * (3 - 2 * k);
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const span = (g: number, a: number, b: number) => clamp01((g - a) / (b - a));

/* ── Parts ──────────────────────────────────────────────────────────── */

const unitBox = new THREE.BoxGeometry(1, 1, 1);

function useMaterials() {
  return useMemo(() => {
    const make = (tone: Tone, extra: THREE.MeshStandardMaterialParameters = {}) =>
      new THREE.MeshStandardMaterial({ color: COLORS[tone], roughness: 0.95, metalness: 0, ...extra });
    return {
      white: make("white"),
      slab: make("slab"),
      glass: make("glass", { roughness: 0.4 }),
      lime: make("lime", { emissive: "#d8f060", emissiveIntensity: 0.35 }),
      dark: make("dark", { roughness: 0.5 }),
    };
  }, []);
}

type PartHandle = { part: Part; mesh: THREE.Mesh; material?: THREE.MeshStandardMaterial };

function Parts({ parts, group }: { parts: Part[]; group: React.RefObject<THREE.Group | null> }) {
  const materials = useMaterials();
  const handles = useRef<PartHandle[]>([]);
  const windowMaterials = useMemo(
    () => parts.map((p) => (p.lit !== undefined ? new THREE.MeshStandardMaterial({ color: COLORS.glass, roughness: 0.4, emissive: LIT, emissiveIntensity: 0 }) : null)),
    [parts],
  );

  useFrame(() => {
    const g = view.g;
    const [l0, l1] = T.lights;
    for (const h of handles.current) {
      if (!h) continue; // the door is drawn separately
      const { part, mesh } = h;
      const [x, y, z, w, hh, d] = part.box;
      const present = g >= part.t0 && (part.out === undefined || g < part.out);
      mesh.visible = present;
      if (!present) continue;
      const k = smooth((g - part.t0) / (part.t1 - part.t0));
      const sy = part.anim === "drop" ? 1 : Math.max(0.001, k);
      const lift = part.anim === "drop" ? (1 - k) * 5 : 0;
      mesh.scale.set(w, hh * sy, d);
      mesh.position.set(x + w / 2, y + (hh * sy) / 2 + lift, z + d / 2);
      if (h.material && part.lit !== undefined && part.kind !== "door") {
        const at = l0 + part.lit * (l1 - l0 - 0.08);
        const lit = g >= 9 ? 1 : span(g, at, at + 0.08);
        h.material.emissiveIntensity = lit * 1.15;
        h.material.color.copy(GLASS).lerp(LIT, lit);
      }
    }
  });

  return (
    <group ref={group}>
      {parts.map((p, i) =>
        p.kind === "door" ? null : (
          <mesh
            key={p.id}
            geometry={unitBox}
            material={windowMaterials[i] ?? materials[p.tone]}
            castShadow={p.kind !== "window"}
            receiveShadow
            ref={(mesh) => {
              if (mesh) handles.current[i] = { part: p, mesh, material: windowMaterials[i] ?? undefined };
            }}
          >
            <Edges color={NAVY} threshold={20} />
          </mesh>
        ),
      )}
    </group>
  );
}

/** The front door: swings open at handover, with light falling out. */
function Door() {
  const door = HOME_PARTS.find((p) => p.kind === "door")!;
  const [x, y, z, w, h] = door.box;
  const pivot = useRef<THREE.Group>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const opening = useRef<THREE.MeshStandardMaterial>(null);
  const root = useRef<THREE.Group>(null);
  const spill = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(x, -(z + 0.1));
    s.lineTo(x + w, -(z + 0.1));
    s.lineTo(x + w + 1.4, -(z + 3.2));
    s.lineTo(x - 1.4, -(z + 3.2));
    return new THREE.ShapeGeometry(s);
  }, [x, z, w]);

  useFrame(() => {
    const g = view.g;
    const v = view.variant ?? story.variant;
    if (root.current) root.current.visible = g >= T.wallsIn && v < 0.5;
    const k = g >= 9 ? 1 : smooth(span(g, T.doorOpen[0], T.doorOpen[1]));
    if (pivot.current) pivot.current.rotation.y = -k * 1.75;
    if (glow.current) glow.current.opacity = k * 0.3;
    if (opening.current) {
      opening.current.emissiveIntensity = k * 1.2;
      opening.current.color.copy(GLASS).lerp(LIT, k);
    }
  });

  return (
    <group ref={root}>
      <mesh position={[x + w / 2, y + h / 2, z + 0.02]} scale={[w, h, 0.04]} geometry={unitBox}>
        <meshStandardMaterial ref={opening} color={COLORS.glass} emissive={LIT} emissiveIntensity={0} />
      </mesh>
      <group ref={pivot} position={[x, y, z + 0.05]}>
        <mesh position={[w / 2, h / 2, 0.03]} scale={[w, h, 0.06]} geometry={unitBox} castShadow>
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
          <Edges color={NAVY} />
        </mesh>
      </group>
      <mesh geometry={spill} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <meshBasicMaterial ref={glow} color={LIT} transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ── Ground ─────────────────────────────────────────────────────────── */

function Ground() {
  const { x0, x1, z0, z1 } = PLOT;
  const grid = useMemo(() => {
    const pts: number[] = [];
    for (let x = Math.ceil(x0 - 10); x <= x1 + 10; x += 2) pts.push(x, 0, z0 - 10, x, 0, z1 + 10);
    for (let z = Math.ceil(z0 - 10); z <= z1 + 10; z += 2) pts.push(x0 - 10, 0, z, x1 + 10, 0, z);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, [x0, x1, z0, z1]);
  const boundary = useMemo(() => {
    const y = 0.02;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([x0, y, z0, x1, y, z0, x1, y, z0, x1, y, z1, x1, y, z1, x0, y, z1, x0, y, z1, x0, y, z0], 3),
    );
    return geo;
  }, [x0, x1, z0, z1]);
  // Plan lines of the ground floor, seen in the planning chapter.
  const plan = useMemo(() => {
    const y = 0.04;
    const segs = [
      [-0.2, -0.2, 9.2, -0.2], [9.2, -0.2, 9.2, 10.2], [9.2, 10.2, -0.2, 10.2], [-0.2, 10.2, -0.2, -0.2],
      [4.5, -0.2, 4.5, 6], [-0.2, 3.5, 4.5, 3.5], [3, 6, 9.2, 6], [3, 6, 3, 10.2], [6.8, -0.2, 6.8, 2.4], [6.8, 2.4, 9.2, 2.4],
    ];
    const pts: number[] = [];
    for (const [ax, az, bx, bz] of segs) pts.push(ax, y, az, bx, y, bz);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);
  const planRef = useRef<THREE.LineSegments>(null);
  useFrame(() => {
    if (planRef.current) planRef.current.visible = view.g >= 2 && view.g < T.massOut;
  });
  return (
    <group>
      <lineSegments geometry={grid}>
        <lineBasicMaterial color="#2f3f74" transparent opacity={0.75} />
      </lineSegments>
      <lineSegments geometry={boundary}>
        <lineBasicMaterial color="#d8f060" />
      </lineSegments>
      <lineSegments ref={planRef} geometry={plan}>
        <lineBasicMaterial color="#ffffff" />
      </lineSegments>
      {[
        [x0, z0],
        [x1, z0],
        [x1, z1],
        [x0, z1],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.35, z]} scale={[0.14, 0.7, 0.14]} geometry={unitBox}>
          <meshBasicMaterial color="#d8f060" />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[CENTRE.x, 0.01, CENTRE.z]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <shadowMaterial color="#070b18" opacity={0.42} />
      </mesh>
    </group>
  );
}

/* ── Crane and its load (the Structure heading) ─────────────────────── */

const tmp = new THREE.Vector3();
const tmp2 = new THREE.Vector3();
const ray = new THREE.Ray();
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -CRANE.mast);

function Crane() {
  const root = useRef<THREE.Group>(null);
  const jib = useRef<THREE.Group>(null);
  const trolley = useRef<THREE.Group>(null);
  const cable = useRef<THREE.Mesh>(null);
  const hook = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();
  const els = useRef<{ load: HTMLElement | null; cables: HTMLElement[] }>({ load: null, cables: [] });
  const angle = useRef(0);

  useEffect(() => {
    const store = els.current;
    return () => {
      // Hand the heading back to its stylesheet when 3D goes away.
      store.load?.style.removeProperty("transform");
      store.cables.forEach((c) => c.removeAttribute("style"));
    };
  }, []);

  useFrame(() => {
    const g = view.g;
    const on = view.home && g >= 3.95 && g < 5;
    if (root.current) root.current.visible = view.home && g >= 3.9 && g < T.wallsIn;
    const store = els.current;
    if (!store.load || !store.load.isConnected) {
      store.load = document.querySelector<HTMLElement>("[data-crane-load]");
      store.cables = Array.from(document.querySelectorAll<HTMLElement>(".crane-cable"));
    }
    const load = store.load;
    if (!on || !load || !jib.current || !trolley.current) {
      if (load && load.style.transform && !on) {
        load.style.removeProperty("transform");
        store.cables.forEach((c) => c.removeAttribute("style"));
      }
      return;
    }
    const p = g - 4;
    const [bx, , bz] = CRANE.base;

    // Where the heading rests on the page, ignoring any transform on it.
    const host = load.offsetParent as HTMLElement | null;
    const hostRect = host?.getBoundingClientRect();
    if (!hostRect) return;
    const canvasTop = (load.closest("[data-chapter]")?.querySelector("[data-scene-slot]") as HTMLElement | null)?.getBoundingClientRect().top ?? 0;
    const slotX = hostRect.left + load.offsetLeft + load.offsetWidth / 2;
    const slotY = hostRect.top + load.offsetTop - canvasTop;

    // The point at jib height that sits straight above the resting place.
    const full = size.width;
    const ndcX = ((slotX + view.shift * full) / full) * 2 - 1;
    tmp.set(ndcX, 0.6, 0.5).unproject(camera);
    ray.origin.copy(camera.position);
    ray.direction.copy(tmp).sub(camera.position).normalize();
    const hit = ray.intersectPlane(plane, tmp2);
    let target = angle.current;
    let reach = CRANE.jib * 0.8;
    if (hit) {
      target = Math.atan2(-(hit.z - (bz + 0.35)), hit.x - (bx + 0.35));
      reach = Math.min(CRANE.jib - 0.6, Math.max(3, Math.hypot(hit.x - bx - 0.35, hit.z - bz - 0.35)));
    }
    const swingIn = smooth(span(p, 0, 0.3));
    const swingOut = smooth(span(p, 0.62, 1));
    angle.current = target - (1 - swingIn) * 1.5 + swingOut * 1.1;
    jib.current.rotation.y = angle.current;
    trolley.current.position.x = reach;

    // Screen positions of the trolley and of the hook hanging below it.
    const project = (v: THREE.Vector3) => {
      v.project(camera);
      return { x: ((v.x + 1) / 2) * full - view.shift * full, y: ((1 - v.y) / 2) * size.height };
    };
    trolley.current.getWorldPosition(tmp);
    const top = project(tmp.clone());
    const hang = 4.2;
    const hooked = project(tmp.clone().setY(tmp.y - hang));

    const lower = smooth(span(p, 0.3, 0.56));
    const released = p >= 0.56;
    const x = released ? slotX : lerp(hooked.x, slotX, lower);
    const y = released ? slotY : lerp(hooked.y, slotY, lower);
    load.style.transform = released ? "none" : `translate(${(x - slotX).toFixed(1)}px, ${(y - slotY).toFixed(1)}px)`;

    const dx = top.x - x;
    const dy = top.y - y;
    const len = Math.hypot(dx, dy);
    const rot = (Math.atan2(dx, -dy) * 180) / Math.PI;
    const fade = 1 - span(p, 0.56, 0.62);
    store.cables.forEach((c, n) => {
      c.style.opacity = String(fade);
      if (n === 0) {
        c.style.height = `${len.toFixed(1)}px`;
        c.style.transformOrigin = "50% 100%";
        c.style.transform = `translateX(-50%) rotate(${rot.toFixed(2)}deg)`;
      }
    });
    // The model's own cable shows only once the load is set down.
    const free = released ? smooth(span(p, 0.56, 0.7)) : 0;
    if (cable.current && hook.current) {
      cable.current.visible = hook.current.visible = released;
      const l = lerp(hang, 1.6, free);
      cable.current.scale.set(0.05, l, 0.05);
      cable.current.position.y = -l / 2;
      hook.current.position.y = -l;
    }
  });

  const [bx, , bz] = CRANE.base;
  return (
    <group ref={root} position={[bx + 0.35, 0, bz + 0.35]}>
      <mesh position={[0, CRANE.mast / 2, 0]} scale={[0.7, CRANE.mast, 0.7]} geometry={unitBox} castShadow>
        <meshStandardMaterial color="#eef1f7" roughness={0.9} />
        <Edges color={NAVY} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[0, 1.2 + i * 1.6, 0]} scale={[0.74, 0.06, 0.74]} geometry={unitBox}>
          <meshBasicMaterial color={NAVY} />
        </mesh>
      ))}
      <group ref={jib} position={[0, CRANE.mast, 0]}>
        <mesh position={[0, 0.9, 0]} scale={[1, 1.6, 1]} geometry={unitBox}>
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
          <Edges color={NAVY} />
        </mesh>
        <mesh position={[CRANE.jib / 2, 0.2, 0]} scale={[CRANE.jib, 0.4, 0.45]} geometry={unitBox} castShadow>
          <meshStandardMaterial color="#eef1f7" roughness={0.9} />
          <Edges color={NAVY} />
        </mesh>
        <mesh position={[-CRANE.counterJib / 2, 0.2, 0]} scale={[CRANE.counterJib, 0.4, 0.45]} geometry={unitBox}>
          <meshStandardMaterial color="#eef1f7" roughness={0.9} />
          <Edges color={NAVY} />
        </mesh>
        <mesh position={[-CRANE.counterJib + 0.8, -0.5, 0]} scale={[1.6, 1.1, 0.9]} geometry={unitBox}>
          <meshStandardMaterial color="#2f3f74" roughness={0.6} />
          <Edges color={NAVY} />
        </mesh>
        <group ref={trolley} position={[CRANE.jib * 0.8, 0, 0]}>
          <mesh position={[0, -0.12, 0]} scale={[0.7, 0.24, 0.6]} geometry={unitBox}>
            <meshStandardMaterial color="#d8f060" emissive="#d8f060" emissiveIntensity={0.4} />
          </mesh>
          <mesh ref={cable} geometry={unitBox}>
            <meshBasicMaterial color="#a4b1da" />
          </mesh>
          <mesh ref={hook} scale={[0.36, 0.36, 0.36]} geometry={unitBox}>
            <meshBasicMaterial color="#a4b1da" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ── Camera, light and the two building variants ────────────────────── */

type Pose = { az: number; el: number; dist: number; y: number };

function poseFor(g: number, time: number): Pose {
  const c = Math.floor(g);
  const p = g - c;
  if (c <= 2) {
    const orbit = smooth(span(p, 0.42, 1));
    return { az: 35 + orbit * 360, el: lerp(58, 27, smooth(span(p, 0.1, 0.45))), dist: lerp(54, 47, smooth(p)), y: 3.6 };
  }
  if (c <= 4) return { az: lerp(28, 50, smooth(p)), el: lerp(26, 19, smooth(p)), dist: 52, y: lerp(3, 6, smooth(p)) };
  if (c <= 7) return { az: 43 + Math.sin(time * 0.25) * 3, el: 20, dist: 47, y: 4.6 };
  if (c <= 9) return { az: lerp(52, 66, smooth(p)), el: lerp(17, 11, smooth(p)), dist: lerp(46, 38, smooth(p)), y: 4.2 };
  return { az: 44 + Math.sin(time * 0.2) * 7, el: 22, dist: 48, y: 4.8 };
}

function Rig() {
  const { camera, size } = useThree();
  const cur = useRef<Pose | null>(null);
  const home = useRef<THREE.Group>(null);
  const commercial = useRef<THREE.Group>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.HemisphereLight>(null);
  const side = useRef<THREE.DirectionalLight>(null);
  const shift = useRef(-1);

  useFrame((state, dt) => {
    const g = view.g;
    const v = view.variant ?? (g >= T.wallsIn ? story.variant : 0);
    const plan = g >= 2 && g < 3 ? story.plan : 0;

    // Two buildings on one plot: one sinks as the other rises.
    if (home.current) {
      const s = 1 - smooth(v);
      home.current.visible = s > 0.004;
      home.current.scale.y = Math.max(0.004, g >= 2 && g < T.massOut ? lerp(1, 0.012, smooth(plan)) : s);
    }
    if (commercial.current) {
      const s = smooth(v);
      commercial.current.visible = s > 0.004 && g >= T.wallsIn;
      commercial.current.scale.y = Math.max(0.004, s);
    }

    const want = poseFor(g, state.clock.elapsedTime);
    if (view.az !== null) want.az = view.az + Math.sin(state.clock.elapsedTime * 0.25) * 4;
    if (v > 0) {
      want.dist += 9 * smooth(v);
      want.y += 2.4 * smooth(v);
    }
    if (plan > 0) {
      const k = smooth(plan);
      want.az = lerp(want.az, Math.round((want.az - 90) / 360) * 360 + 90, k);
      want.el = lerp(want.el, 87, k);
      want.dist = lerp(want.dist, 62, k);
      want.y = lerp(want.y, 0, k);
    }
    const c = cur.current ?? (cur.current = { ...want });
    const k = 1 - Math.exp(-dt * 7);
    c.az = lerp(c.az, want.az, k);
    c.el = lerp(c.el, want.el, k);
    c.dist = lerp(c.dist, want.dist, k);
    c.y = lerp(c.y, want.y, k);
    const az = THREE.MathUtils.degToRad(c.az);
    const el = THREE.MathUtils.degToRad(c.el);
    camera.position.set(
      CENTRE.x + c.dist * Math.cos(el) * Math.cos(az),
      c.y + c.dist * Math.sin(el),
      CENTRE.z + c.dist * Math.cos(el) * Math.sin(az),
    );
    camera.lookAt(CENTRE.x, c.y, CENTRE.z);

    // Keep the building in the right-hand part of a home stage.
    const cam = camera as THREE.PerspectiveCamera;
    if (shift.current !== view.shift || cam.view?.fullWidth !== size.width || cam.view?.fullHeight !== size.height) {
      shift.current = view.shift;
      if (view.shift) cam.setViewOffset(size.width, size.height, -view.shift * size.width, 0, size.width, size.height);
      else cam.clearViewOffset();
    }

    // Dusk for the handover, evening for the finished building.
    const dusk = !view.home
      ? g >= 8 ? 0.35 : 0
      : g >= 10 ? 0.75 : smooth(span(g, 7.9, 8.2)) * (1 - smooth(span(g, 9, 9.4)));
    if (key.current) key.current.intensity = lerp(1.9, 0.4, dusk);
    if (fill.current) fill.current.intensity = lerp(1.95, 0.7, dusk);
    if (side.current) side.current.intensity = lerp(0.75, 0.12, dusk);
  });

  return (
    <>
      {/* Soft daylight: sky from above, sun from the front left, and a
          weak fill so the shaded side stays a light gray, like card. */}
      <hemisphereLight ref={fill} args={["#ffffff", "#c9d0e6", 1.95]} />
      <directionalLight ref={side} position={[24, 12, 4]} intensity={0.75} />
      <directionalLight
        ref={key}
        position={[-12, 26, 24]}
        intensity={1.9}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-bias={-0.0004}
      />
      <Ground />
      <Parts parts={HOME_PARTS} group={home} />
      <Door />
      <Parts parts={COMMERCIAL_PARTS} group={commercial} />
      <Crane />
    </>
  );
}

/** Watches the frame rate and reports when the device cannot keep up. */
function Watchdog({ onSlow, onFirstFrame }: { onSlow: () => void; onFirstFrame: () => void }) {
  const frames = useRef(0);
  const elapsed = useRef(0);
  const strikes = useRef(0);
  const first = useRef(false);
  useFrame((_, dt) => {
    if (!first.current) {
      first.current = true;
      onFirstFrame();
    }
    frames.current++;
    elapsed.current += dt;
    if (elapsed.current >= 2) {
      const fps = frames.current / elapsed.current;
      frames.current = 0;
      elapsed.current = 0;
      strikes.current = fps < 22 ? strikes.current + 1 : 0;
      if (strikes.current >= 3) onSlow();
    }
  });
  return null;
}

/* ── Host: follows the active slot ──────────────────────────────────── */

export default function Scene3D({ force, onGiveUp }: { force: boolean; onGiveUp: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const [dpr, setDpr] = useState(() => Math.min(1.75, window.devicePixelRatio || 1));
  const slow = useRef(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    let wasOn = false;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const vh = window.innerHeight;
      let best: HTMLElement | null = null;
      let bestArea = 0;
      for (const slot of document.querySelectorAll<HTMLElement>("[data-scene-slot]")) {
        const r = slot.getBoundingClientRect();
        if (r.width === 0) continue;
        const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if (visible > bestArea) {
          bestArea = visible;
          best = slot;
        }
      }
      const on = !!best && bestArea > 4 && !document.hidden;
      if (on !== wasOn) {
        wasOn = on;
        setRunning(on);
        el.style.visibility = on ? "visible" : "hidden";
      }
      if (!best || !on) return;
      const r = best.getBoundingClientRect();
      el.style.width = `${r.width}px`;
      el.style.height = `${r.height}px`;
      el.style.transform = `translate3d(${r.left}px, ${r.top}px, 0)`;
      const chapter = best.dataset.chapter;
      if (chapter !== undefined) {
        const c = Number(chapter);
        view.g = c + Math.min(0.9999, story.progress[c]);
        view.variant = null;
        view.az = null;
        view.shift = 0.2;
        view.home = true;
      } else {
        view.g = Number(best.dataset.g ?? 6.5);
        view.variant = best.dataset.variant === "commercial" ? 1 : 0;
        view.az = best.dataset.az ? Number(best.dataset.az) : 45;
        view.shift = 0;
        view.home = false;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      delete document.documentElement.dataset.scene3d;
    };
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 h-svh w-screen"
      style={{ visibility: "hidden" }}
    >
      <Canvas
        frameloop={running ? "always" : "never"}
        dpr={dpr}
        shadows="percentage"
        flat
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 27, near: 1, far: 400, position: [40, 20, 40] }}
      >
        <Rig />
        <Watchdog
          onFirstFrame={() => {
            story.ready = true;
            document.documentElement.dataset.scene3d = "on";
          }}
          onSlow={() => {
            if (force) return;
            // First drop the resolution; if that is not enough, hand over to the drawings.
            slow.current++;
            if (slow.current === 1) setDpr(1);
            else onGiveUp();
          }}
        />
      </Canvas>
    </div>
  );
}
