/**
 * Renders the still building drawings to public/drawings/*.svg.
 *
 *   npx tsx scripts/export-drawings.tsx      (also runs before every build)
 *
 * The drawings come from the same parts list as the 3D model, so they can
 * never drift from it.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { IsoBuilding } from "../src/scene/Iso";
import { DRAWINGS } from "../src/scene/drawings";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "drawings");
mkdirSync(OUT, { recursive: true });

for (const [name, d] of Object.entries(DRAWINGS)) {
  const svg = renderToStaticMarkup(
    createElement(IsoBuilding, { g: d.g, variant: d.variant, lit: d.lit, doorOpen: d.door, label: d.alt }),
  );
  writeFileSync(join(OUT, `${name}.svg`), `${svg}\n`);
  console.log(`  public/drawings/${name}.svg  ${(svg.length / 1024).toFixed(1)} KB`);
}
