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
poster frame each, and are shown as navy-tinted layers in the home story's
drawings. They play on wide screens with a mouse; phones, Save-Data and
reduced motion see the still frame.

TODO(client): confirm the licence for each clip, or replace it with footage
from a real Sri Skanda Constructions site.

| File in `public/videos` | Shows | Used in | Source and licence |
| --- | --- | --- | --- |
| `construction-site` | Construction site | Home, Groundbreaking (the dawn sky; wide screens only) and Foundation (inside the trench) | Not recorded. To confirm. |
| `building-landscape` | Building in a landscape | Home, Start your project (behind the building) | Not recorded. To confirm. |
| `glass-building` | Glass facade | Home, Walls and finishing (in both windows) | Not recorded. To confirm. |
| `iron-worker` | Worker tying steel | Home, Structure (behind the frame and crane) | Not recorded. To confirm. |
| `eco-city` | Green city | Home, Sustainable building (sky) | Not recorded. To confirm. |

## Stock photos (placeholders)

Four photos from Unsplash, used under the Unsplash License, from the "Why
Us" section of the first site. Local copies live in `public/images` so the
site does not depend on Unsplash's servers. The photographers were not
recorded with the originals; each original address is below. On the home
page each one is pinned to a chapter's drawing (on phones it sits under the
chapter text); the captions are in `content/home.ts` (`storyPhotos`).

TODO(client): replace each one with a photo from a real project or site.

| File in `public/images` | Used on | Original |
| --- | --- | --- |
| `planning-desk.jpg` | About: Plain talk about money. Home: Sustainable building | `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40` |
| `site-rebar.jpg` | About: The site is checked. Home: Foundation | `https://images.unsplash.com/photo-1504307651254-35680f356dfd` |
| `at-the-screen.jpg` | About: Drawn before it is built. Home: Architectural planning | `https://images.unsplash.com/photo-1581094794329-c8112a89af12` |
| `site-worker.jpg` | About: One team, one phone number. Home: Turnkey handover | `https://images.unsplash.com/photo-1621905252507-b35492cc74b4` |

## Illustrations

All drawings (the building, plans, sections, the logo) are original to this
site and generated from code in `src/scene`, `src/home` and `src/brand`.
The renovation slider on the home page is an illustration, labelled as
such, until a real before and after pair is supplied.
