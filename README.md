# Sri Skanda Constructions website

The website of Sri Skanda Constructions, a residential and commercial
builder from Pondicherry: [sriskandaconstructions.com](https://www.sriskandaconstructions.com).

The home page tells one story, **Blueprint to Building**: a single house is
built as you scroll, from survey stakes on an empty plot to the key in your
hand. Every page leads to the same place: a message on WhatsApp.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4.
The 3D model uses three.js with react-three-fiber and drei. Smooth scrolling
on desktop uses Lenis.

---

## Contents

1. [Getting started](#getting-started)
2. [Editing the content](#editing-the-content)
3. [Things the client needs to supply](#things-the-client-needs-to-supply)
4. [Environment variables](#environment-variables)
5. [How the site is put together](#how-the-site-is-put-together)
6. [Logo and brand files](#logo-and-brand-files)
7. [Search engines](#search-engines)
8. [RERA](#rera)
9. [Quality checks](#quality-checks)
10. [Publishing: merging `revamp` into `main`](#publishing-merging-revamp-into-main)

---

## Getting started

Needs Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also regenerates the drawings)
npm run start      # serve the production build
npm run lint
```

Useful addresses while developing:

| Address | What it is |
| --- | --- |
| `/?3d=off` | Any page with the 3D model switched off (shows the drawings) |
| `/?3d=force` | Any page with the 3D model on, skipping the device checks |
| `/brand-lab` | The logo, every version, and the downloadable brand files. Hidden: not linked, not indexed |
| `/design-lab` | The approved design proposal and storyboard. Hidden: not linked, not indexed |

---

## Editing the content

All words, facts and lists live in typed files in `/content`. Change a file,
save, and the site updates. Nothing else needs touching.

Every piece of visitor-facing text is written as `{ en: "..." }` (or with the
`en(...)` helper). The site is in English only for now; see
[Adding Tamil](#adding-tamil).

Empty means hidden. An empty email hides every email link. An empty list of
projects hides the Projects page and its menu link. A claim with
`enabled: false` is never shown. So nothing unconfirmed appears on the site.

| File | What it controls |
| --- | --- |
| `content/site.ts` | Business name, address, phone and WhatsApp number, **email**, **RERA number**, **map coordinates**, **opening hours**, area served, **social links**, and the two claims (**experience**, **service area**) that stay hidden until confirmed |
| `content/services.ts` | The six services. Each becomes a page at `/services/<slug>`: title, summary, what is included, how it works, what the client provides, **typical timeline** (hidden while empty), questions and answers, and the opening line of its WhatsApp message |
| `content/process.ts` | The eight stages of the build journey on `/process` |
| `content/home.ts` | Words for the eleven home chapters, the hero headline (alternatives are listed at the top of the file), the labels on the drawings, and the renovation before and after photos |
| `content/vastu.ts` | The Vastu guidance and the indicative layout for each plot facing. Always labelled indicative |
| `content/estimate.ts` | Estimator settings: **rates per square foot** (empty by default), project types, finish levels, floors, and the budget and timeline choices in the Plan your build form |
| `content/packages.ts` | Construction **packages** with item-by-item specifications. The Packages page appears only when this has entries |
| `content/projects.ts` | **Projects**, ongoing and completed, with photos and an optional before and after. The Projects page appears only when this has entries |
| `content/testimonials.ts` | Client testimonials. Only entries marked `verified: true` are shown; the three from the old site are marked unverified |
| `content/about.ts` | The About page, including **founder and team** (hidden while empty) |
| `content/ui.ts` | Short interface text: menu labels, button labels, form labels and messages |
| `content/i18n.ts` | Language support (see below) |

Common edits:

- **Add the email address**: set `email` in `content/site.ts`. Email links then appear in the footer and on the contact page by themselves.
- **Show the estimator's price range**: set `rates` in `content/estimate.ts` to a minimum and maximum rupees per square foot for each finish level. The estimate page then shows an indicative range, always marked "indicative, final quote after site visit". Leave it `null` to skip numbers and go straight to WhatsApp.
- **Add a project**: add an entry to `content/projects.ts` and put its photos in `public/projects/<slug>/`. There is a worked example at the top of the file.
- **Publish a testimonial**: check with the client that the words are theirs and that they agree to be named, then set `verified: true`.
- **Turn on a claim**: edit the text in `claims` in `content/site.ts` to the exact, true figure, then set `enabled: true`.
- **Use real renovation photos on the home page**: put two photos in `public/images` and set `renovation.photos` in `content/home.ts`.

### Adding Tamil

Each piece of text is `{ en: "..." }`. To add Tamil, add a `ta` line beside
each `en` line (`{ en: "Contact", ta: "..." }`) and add `"ta"` to `LOCALES`
in `content/i18n.ts`. The structure is already there: nothing needs to move.
Please have the Tamil written by a person rather than machine-translated.

---

## Things the client needs to supply

Until each item below is supplied, the matching part of the site stays
hidden or shows a clearly labelled placeholder. Nothing has been invented.

- [ ] **Email address** (`content/site.ts`, `email`). Until then every email link is hidden.
- [ ] **Real site and project photos**, to replace the four stock photos and five stock videos listed in [`CREDITS.md`](./CREDITS.md). Confirm the licence of the five videos, which came with the old site with no recorded source.
- [ ] **Verified testimonials** (`content/testimonials.ts`). The three on the old site are unverified and hidden.
- [ ] **Experience claim**: how long the company has been building (`claims.experience` in `content/site.ts`). Hidden until confirmed.
- [ ] **Service area claim**: where the company takes on work (`claims.serviceArea`, and `areaServed` for search engines). Hidden until confirmed.
- [ ] **RERA number**, only if the company sells apartment or plotted projects (`reraNumber`). See [RERA](#rera).
- [ ] **Per-square-foot rates**, if the estimator should show a price range (`content/estimate.ts`).
- [ ] **Budget bands** for the Plan your build form, if the defaults do not fit (`BUDGET_RANGES` in `content/estimate.ts`).
- [ ] **Construction packages**, if offered (`content/packages.ts`).
- [ ] **Projects**, with real photos (`content/projects.ts`).
- [ ] **Opening hours** (`openingHours` in `content/site.ts`).
- [ ] **Map coordinates** of the office (`geo` in `content/site.ts`). Right-click the office on Google Maps to copy them.
- [ ] **Social media links** (`social` in `content/site.ts`). Each icon stays hidden until its link is set.
- [ ] **Founder or team** details and photos (`team` in `content/about.ts`).
- [ ] **A real before and after** renovation pair for the home page (`renovation.photos` in `content/home.ts`).
- [ ] **Typical timelines** for each service, if you are happy to publish them (`timeline` in `content/services.ts`).
- [ ] **A read-through** of the service descriptions, the process stages and the Vastu guidance, to correct anything that differs from how the company works. Each file has a `TODO(client)` note at the top.

---

## Environment variables

None are needed. The site works fully without any.

| Variable | Needed for | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | Optional. Also emailing each Plan your build enquiry | An API key from [resend.com](https://resend.com). Set it in Vercel under Project, Settings, Environment Variables. Never commit it |
| `RESEND_FROM` | Optional. The sender address for those emails | A sender on a domain verified in Resend, e.g. `Website <enquiries@sriskandaconstructions.com>` |

Enquiries are emailed only when **both** `RESEND_API_KEY` is set **and**
`email` is filled in `content/site.ts`. WhatsApp is always the main delivery
path: the form opens WhatsApp first and never waits for the email.

---

## How the site is put together

```
content/            all words and facts (see above)
public/brand/       logo package, favicons, share images, brand sheet
public/drawings/    still drawings of the building (generated, see below)
public/images/      local copies of the stock photos
public/videos/      optimised video loops and poster frames
scripts/            brand export, drawing export, video optimisation
src/app/(site)/     the public pages
src/app/(lab)/      the hidden brand and design review pages
src/brand/          logo geometry and the <Logo> component
src/components/     header, footer, forms, buttons, the process timeline
src/design/         design tokens and the contrast table
src/home/           the home page chapters
src/scene/          the building: one parts list, drawn as SVG and as 3D
```

### The building

The house exists once, as a list of boxes in `src/scene/building.ts`, each
with the moment in the story when it arrives. That one list is drawn two
ways:

- as an **isometric SVG drawing** (`src/scene/Iso.tsx`), which is the first
  paint, the phone version, the reduced-motion version and the fallback;
- as a **3D model** (`src/scene/Scene3D.tsx`), on capable desktops only.

The 3D model loads only after the page is idle, and only on a screen 1024 px
or wider with a mouse, WebGL 2, at least 4 GB of memory and 4 cores, no
Save-Data and no reduced-motion preference. If frames drop it lowers its
resolution, and if that is not enough it hands back to the drawings. It
pauses when off screen or in a hidden tab.

Still drawings used as images are generated into `public/drawings` by
`npm run drawings`, which runs automatically before every build.

### Motion

- **Scroll is construction progress.** Each home chapter sets a CSS variable
  `--p` from 0 to 1 as it scrolls; drawings use it to place each part.
- **Reduced motion:** every chapter shows its finished drawing with the same
  words. Switches, the slider and the forms all still work.
- **The laser line:** the lime bar at the top is the scroll progress. On a
  page change it sweeps down the screen while the new page is revealed behind
  it (browser View Transitions; other browsers change page normally).
- **Desktop cursor:** a surveyor's crosshair with coordinates, on top of the
  normal pointer. Off on touch screens and with reduced motion.

### Videos

The five clips are re-encoded by:

```bash
bash scripts/optimize-videos.sh <folder-with-original-mp4s>
```

That writes a WebM and an MP4 (at most 10 seconds, 720 px, no sound) and a
poster frame for each. Videos load only on desktop, near their chapter,
never with Save-Data or reduced motion, and pause when off screen.

---

## Logo and brand files

The logo is drawn in code (`src/brand/logo-art.ts`). After changing it,
regenerate every file with:

```bash
npm run brand:export
```

That writes the lockups (horizontal, stacked, mark), single-colour and
reversed versions, PNGs, the favicon set, the share images for every page,
and the brand sheet, to `public/brand`. See them all at `/brand-lab`.

---

## Search engines

- Canonical address: `https://www.sriskandaconstructions.com` (set in `content/site.ts`).
- Every page has its own title, description and share image.
- `sitemap.xml` and `robots.txt` are generated. The lab pages and `/api` are excluded.
- Structured data (JSON-LD): the business as a `GeneralContractor` with full address, phone, area served, opening hours and coordinates (once supplied), and its services; each service page adds `Service` and `FAQPage` data.
- Service pages are written for local searches such as "house construction in Pondicherry", with genuinely useful answers rather than keyword lists.

---

## RERA

If the company advertises **apartment or plotted projects for sale**, Indian
law (the Real Estate (Regulation and Development) Act, 2016) requires the
project's RERA registration number in every advertisement. Put the number in
`reraNumber` in `content/site.ts`, and mark those projects `forSale: true`
in `content/projects.ts`. The number then appears in the footer of every page
and on the Projects page. For individual houses built to order for a
client, it is not needed.

---

## Quality checks

Measured on the production build:

- **Lighthouse, mobile:** Performance 96 to 99, Accessibility 100, Best Practices 100, SEO 100 on the home page, a service page and the contact page.
- **Largest Contentful Paint:** 1.6 to 1.8 s with DevTools 4G and 4x CPU throttling. Lighthouse's simulated estimate is more pessimistic, 2.4 to 2.8 s, because on a fast local machine the framework scripts run before first paint and the simulation charges them to it.
- **Accessibility:** axe reports no violations on any page, at 390 px and 1440 px, with and without reduced motion. Skip link, landmarks, heading order, visible focus, keyboard access to every control.
- **Widths checked:** 360, 390, 768, 1280, 1440, 1920 and 2560 px, with no sideways scrolling.

---

## Publishing: merging `revamp` into `main`

The live site deploys from `main`. Work happens on `revamp`, which gets a
Vercel preview of its own.

1. Open the latest preview of `revamp` from the Vercel dashboard (or the
   Vercel check on the branch in GitHub) and look it over on a phone and a
   computer.
2. On GitHub, open a pull request from `revamp` into `main`, or from a
   terminal:

   ```bash
   git fetch origin
   git checkout main
   git pull origin main
   git merge --ff-only origin/revamp   # or: git merge origin/revamp
   git push origin main
   ```

3. Vercel deploys `main` to the live domain within a few minutes.
4. To undo, use Vercel's "Instant Rollback" on the previous deployment, or
   revert the merge commit on `main`.
