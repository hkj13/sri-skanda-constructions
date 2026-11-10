/**
 * One shared, passive scroll loop for everything that follows scroll
 * progress. Each watcher is called at most once per animation frame, only
 * when the page has scrolled or resized.
 */
type Watcher = () => void;

const watchers = new Set<Watcher>();
let scheduled = false;
let listening = false;

function run() {
  scheduled = false;
  watchers.forEach((w) => w());
}

function schedule() {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(run);
  }
}

export function watchScroll(w: Watcher): () => void {
  watchers.add(w);
  if (!listening) {
    listening = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  schedule();
  return () => {
    watchers.delete(w);
    if (!watchers.size && listening) {
      listening = false;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    }
  };
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
