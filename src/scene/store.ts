/**
 * Shared state for the building scene. It is a plain object, written by
 * scroll handlers and read by the 3D render loop every frame, so nothing
 * here causes React to re-render. `subscribe` is for the few components
 * that do need to follow along (the floor counter, the chapter rail).
 */
export const CHAPTER_COUNT = 11;

type Listener = () => void;
const listeners = new Set<Listener>();

export const story = {
  /** Story time on the home page: chapter + progress, 0 to 11. */
  g: 0,
  /** Progress (0 to 1) through each home chapter. */
  progress: new Float32Array(CHAPTER_COUNT).fill(0),
  /** 0 = family home, 1 = commercial block. Eased towards variantTarget. */
  variant: 0,
  variantTarget: 0,
  /** 0 = 3D view, 1 = flat plan view (planning chapter). Eased towards planTarget. */
  plan: 0,
  planTarget: 0,
  /** True once the 3D model has drawn a frame. */
  ready: false,
};

export function setProgress(chapter: number, p: number) {
  if (story.progress[chapter] === p) return;
  story.progress[chapter] = p;
  listeners.forEach((l) => l());
}

export function notify() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
