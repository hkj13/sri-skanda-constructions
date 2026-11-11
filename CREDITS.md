# Credits

Third-party fonts, libraries' assets and stock media used on this site, and
what still needs to be replaced with the company's own material.

## Typefaces

- **Jost** by Owen Earl (indestructible type*). SIL Open Font License 1.1.
  The main typeface, loaded through `next/font`. The logo lettering is drawn
  from Jost outlines by `scripts/build-wordmark-glyphs.mjs`, so the logo
  files never depend on the font being installed.
- **DM Mono** by Colophon Foundry. SIL Open Font License 1.1. Technical
  labels only: dimensions, floor numbers, sheet numbers.

## Stock video (placeholders)

All five clips came with the first version of the site. Their original
sources were not recorded. They are re-encoded by
`scripts/optimize-videos.sh` into short, silent WebM and MP4 loops with a
still frame each, and are shown in their own colours. In the home story
four of them are framed "site films" beside a chapter's drawing (under the
chapter text on phones) and one plays in the windows of the wall drawing.
Each plays only while its chapter is on screen; Save-Data, very slow
connections and reduced motion get the still frame.

TODO(client): confirm the licence for each clip, or replace it with footage
from a real Sri Skanda Constructions site.

| File in `public/videos` | Shows | Used in | Source and licence |
| --- | --- | --- | --- |
| `construction-site` | Workers tying steel on a slab (starts 4 s into the original) | Home, Foundation | Not recorded. To confirm. |
| `iron-worker` | A worker setting steel props | Home, Structure | Not recorded. To confirm. |
| `glass-building` | A glass facade at golden hour | Home, Walls and finishing (in both windows) | Not recorded. To confirm. |
| `eco-city` | Glass towers behind trees | Home, Sustainable building | Not recorded. To confirm. |
| `building-landscape` | A building going up beside a tower crane | Home, Start your project | Not recorded. To confirm. |

## Stock photos (placeholders)

Four photos from Unsplash, used under the Unsplash License, from the "Why
Us" section of the first site. Local copies live in `public/images` so the
site does not depend on Unsplash's servers. The photographers were not
recorded with the originals; each original address is below. They are used
on the About page only.

TODO(client): replace each one with a photo from a real project or site.

| File in `public/images` | Used on | Original |
| --- | --- | --- |
| `planning-desk.jpg` | About: Plain talk about money | `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40` |
| `site-rebar.jpg` | About: The site is checked | `https://images.unsplash.com/photo-1504307651254-35680f356dfd` |
| `at-the-screen.jpg` | About: Drawn before it is built | `https://images.unsplash.com/photo-1581094794329-c8112a89af12` |
| `site-worker.jpg` | About: One team, one phone number | `https://images.unsplash.com/photo-1621905252507-b35492cc74b4` |

## Illustrations

All drawings (the building, plans, sections, the logo) are original to this
site and generated from code in `src/scene`, `src/home` and `src/brand`.
The renovation slider on the home page is an illustration, labelled as
such, until a real before and after pair is supplied.
