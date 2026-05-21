# Services + Projects — Cinematic Behavior Fix Brief

**Scope:** This document covers ONLY the `/services`, `/projects`, and `/projects/[slug]` pages. The earlier briefs (`SUOFEIYA_ELICYON_PORT_BRIEF`, `STRICT_100_PERCENT_ADDENDUM`, `PAGE_LEVEL_ADDENDUM`) still apply elsewhere. **Where this document and any earlier brief disagree about services/projects, this document wins.**

**The problem in one sentence:** the current deploy at `suofeiya-next.vercel.app` lands on project detail pages with a flat black hero (no image, no animation, no cinematic entrance), the projects index uses a 2-column staggered grid instead of elicyon's 3-column featured-anchor masonry, and the services split-pane swap is technically working but missing the project-credit caption + the in/out crossfade timing that gives elicyon its film-edit feel.

**Bundle contents:**
- This markdown file (the brief)
- `reference_frames/` — 22 frames: 7 from the current broken state (May 21 recording) prefixed `CURRENT_*`, 15 elicyon reference frames prefixed `ELICYON_*`. Frames are explicitly named to map onto the sections below.

---

## §0 The five things to fix, in priority order

1. **Project-detail hero is broken — image never renders.** [`CURRENT_03_BROKEN_HERO_gh-apartment.jpg`, `CURRENT_04_BROKEN_HERO_with_intro.jpg`, `CURRENT_07_BROKEN_HERO_nc-apartment.jpg`] → §1
2. **No cinematic entrance on the project detail page.** Elicyon does a title-mask wipe over the already-loaded image; suofeiya does nothing. [`ELICYON_13/14/15`] → §2
3. **Projects index uses the wrong grid topology.** Elicyon = 3-column with a featured-anchor left card; suofeiya = 2-column with a hand-coded 200px right-column offset. [`CURRENT_01/02` vs `ELICYON_06/07`] → §3
4. **Services split-pane is structurally right but visually different.** The right pane is correct; the left pane is missing the bottom-left `PROJECT / NAME →` credit caption and the image swaps are too soft (opacity 0→1 over 800ms — should be ~280ms with a slight cross-blur or a directional sweep). [`ELICYON_03/04/05`] → §4
5. **Stray red debug dot leaks onto every page**, and the `CREAM` theme toggle is still floating bottom-right despite the strict addendum removing the theme system. → §5

Fix in this order. The hero bug (§1) is a 10-minute fix that single-handedly turns 80% of the "not cinematic" complaint into "OK now I can see the photo." Everything else is style work on top.

---

## §1 Project-detail hero is broken (priority 1)

### What the user sees
Click any project card on `/projects` → land on `/projects/<slug>` → top 100vh is just charcoal/black with the project title floating dead-center. The hero image does not render. Scroll a bit and the same image appears further down in the gallery, perfectly. See `CURRENT_03`, `CURRENT_04`, `CURRENT_07`.

This is reproducible on both `gh-apartment` and `nc-apartment` in the recording, and almost certainly on every project detail page in production.

### What elicyon does
Image is the hero. Image is fully visible. Title sits over the image with a soft dark scrim. See `ELICYON_08`. No exceptions.

### Diagnosis
The current code in `src/app/projects/[slug]/page.tsx` (lines 153–158):

```tsx
<section className="pd-hero">
  <Image src={heroImg} alt={project.title} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
  <div className="pd-hero__scrim" aria-hidden />
  <h1 className="pd-hero__title font-display">{project.title}</h1>
</section>
```

…is structurally correct. The issue is in `src/styles/globals.css` lines 3404–3438. Look at this rule (line 3412):

```css
.pd-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

When you use Next.js `<Image fill>`, Next emits an `<img>` whose inline style is `position: absolute; height: 100%; width: 100%; left: 0; top: 0; right: 0; bottom: 0; object-fit: cover; color: transparent;`. The `.pd-hero img` rule above redeclares `width` and `height` which is harmless, **but the rule overwrites nothing about position or z-index, leaving the image at the default stacking position — which is BELOW siblings that have `z-index: 1` (`.pd-hero__scrim`) and `z-index: 2` (`.pd-hero__title`)**.

That's not actually the bug. The real bug is more subtle: with `fill`, Next wraps the `<img>` in nothing (it's a direct child of `.pd-hero`). For `fill` to position correctly, `.pd-hero` MUST be `position: relative | absolute | fixed`. It IS relative. So far so good.

**Test this first** — it is the actual fix in 80% of cases like this:

```bash
# In dev:
npm run dev
# Open http://localhost:3001/projects/gh-apartment
# Open devtools → inspect the <img> inside .pd-hero
# Check its computed style for `display`, `position`, `opacity`, `visibility`, `width`, `height`
```

The likely culprits, in order of probability:

1. **Most likely** — the `.scroll-zoom` ScrollReveal (in `src/components/providers/ScrollReveal.tsx` lines 79–91) is silently selecting an unintended element and applying `transform: scale(0.94)` to the wrong thing. The pd-hero figure inside the gallery has `scroll-zoom`. The hero `<Image fill>` does not have `.scroll-zoom` but the rule scopes by class so this is fine — UNLESS some preloader is wiping inline styles. Verify by temporarily commenting out the entire `ScrollReveal` component and reloading the detail page.
2. **Second most likely** — the `Preloader` (`src/components/layout/Preloader.tsx`) is a `position: fixed; inset: 0; z-index: 100` element. It sets `opacity: 0; visibility: hidden` after 1.4s via the `.is-hidden` class. But on client-side navigation (clicking a `<Link>` from `/projects` to `/projects/<slug>`), the Preloader **remounts** (because it's in the layout) and its 1400ms timer restarts. During those 1.4 seconds, the preloader is covering the entire viewport with `background: var(--bg-charcoal)`. That charcoal block IS what the user is seeing. They scroll, the preloader hides, the page is fine — but the hero is past the fold by then. The user thinks the hero is broken. **It isn't broken — the preloader is covering it.**

### The fix

In `src/components/layout/Preloader.tsx`, mount the preloader once on first paint and never again:

```tsx
'use client';

import { useEffect, useState } from 'react';

const SESSION_KEY = '__sf_preloader_shown';

export default function Preloader() {
  // Synchronously decide on the FIRST render whether the preloader
  // should appear at all. If this is a client-side nav within the
  // same session, skip it entirely so we don't re-cover the hero
  // for 1.4 seconds on every detail-page click.
  const [hidden, setHidden] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(SESSION_KEY) === '1';
  });

  useEffect(() => {
    if (hidden) return;                       // already shown this session
    const t = setTimeout(() => {
      setHidden(true);
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch {}
    }, 1400);
    return () => clearTimeout(t);
  }, [hidden]);

  return (
    <div className={`preloader${hidden ? ' is-hidden' : ''}`} aria-hidden={hidden}>
      {/* …unchanged… */}
    </div>
  );
}
```

While you're in there, also reduce `1400` to `900` — even on first load, 1.4s of charcoal block is too long for what the preloader is doing (which is just showing the logo briefly).

### Bonus belt-and-braces fix to `.pd-hero img`

After the preloader fix, the image will appear. While you're in globals.css, replace the loose `.pd-hero img` rule with a scoped one that doesn't fight `fill`:

```css
/* old, line ~3412 */
.pd-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* new — Next.js `fill` already sets width/height/position. We only
   need to enforce object-fit on the direct child, and only on the
   hero <img> (not on later gallery images that happen to be inside
   .pd-hero descendants). */
.pd-hero > img {
  object-fit: cover;
}
```

### Acceptance test for §1
1. `npm run build && npm start` (or deploy to Vercel)
2. Open `/projects` in an incognito tab
3. Click "GH Apartment · Kuala Lumpur"
4. The detail page should land with the foggy tower image as a full-bleed hero behind a soft scrim, with "GH Apartment · Kuala Lumpur" centered in white serif over it
5. Click the next-project card at the bottom — the new detail page should also land with its hero image visible immediately
6. Refresh the page — preloader appears once, hero appears underneath after ~900ms

If frame 1 of the loaded page still shows charcoal, the preloader is still the culprit — try setting `display: none` on `.preloader.is-hidden` instead of `visibility: hidden`, in case the visibility transition is fighting paint timing.

---

## §2 Add the cinematic title-reveal animation (priority 2)

### What elicyon does
Compare `ELICYON_13` (t=0ms, image only) → `ELICYON_14` (t≈300ms, title clipping in from left edge — note partial "THE" visible) → `ELICYON_15` (t≈600ms, title fully revealed: "THE BROADWAY MARKETING SUITE"). The image is **already visible** at t=0. What animates is the **title**, which reveals via a left-to-right clip-path mask over ~600ms with a slight ease-out. The image itself does NOT animate (no scale, no fade, no clip).

This is the "cinematic entrance" the user keeps describing.

### What to add

In `src/app/projects/[slug]/page.tsx`, mark the title so it can be animated:

```tsx
<h1 className="pd-hero__title font-display pd-hero__title--reveal">{project.title}</h1>
```

In `src/styles/globals.css`, add (next to the existing `.pd-hero__title` rule around line 3423):

```css
/* Title clip-in. Mirrors elicyon's left→right wipe on hero titles.
   We animate clip-path rather than opacity so the letters reveal
   *progressively* edge-by-edge, not as a fade. */
.pd-hero__title--reveal {
  clip-path: inset(0 100% 0 0);
  animation: pdHeroTitleReveal 760ms 200ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
}
@keyframes pdHeroTitleReveal {
  to { clip-path: inset(0 0 0 0); }
}
@media (prefers-reduced-motion: reduce) {
  .pd-hero__title--reveal {
    clip-path: none;
    animation: none;
  }
}
```

The 200ms initial delay gives the preloader (now 900ms total, see §1) time to fade out so the wipe isn't competing with another animation. The 760ms duration matches elicyon's ~600-800ms based on the 3 sample frames. Cubic-bezier `0.65, 0, 0.35, 1` is the standard "smooth in/out" — feel free to tune to `cubic-bezier(0.83, 0, 0.17, 1)` (`expo.inOut`) for a snappier in / softer out.

### Add the same wipe to the services hero title

The services hero (`/services`, `CURRENT_*` not captured but you can verify on the live deploy) currently has the title appearing instantly with no animation. Add the same class:

```tsx
// src/app/services/page.tsx — line 32
<h1 className="services-hero__title font-display services-hero__title--reveal">SERVICES</h1>
```

```css
/* CSS — alongside the .services-hero__title rule at line ~2807 */
.services-hero__title--reveal {
  clip-path: inset(0 100% 0 0);
  animation: pdHeroTitleReveal 760ms 200ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
}
```

(The keyframe is shared — defined once in §2 above, reused here.)

### Acceptance test for §2
1. Open `/services`. The image is full-bleed immediately; "SERVICES" wipes in from left → right over ~0.8s after a 0.2s pause
2. Open `/projects/gh-apartment`. The KL tower image is immediately visible; "GH Apartment · Kuala Lumpur" wipes in over ~0.8s after a 0.2s pause
3. Click the next-project card. The new image is immediately visible; the new title wipes in
4. Toggle "Reduce motion" in OS preferences and reload — title appears instantly, no animation

---

## §3 Rebuild the projects index as a 3-column featured-anchor masonry

### What's there now
`src/app/projects/ProjectsClient.tsx` builds a 2-column grid with the right column shifted down 200px via `.pmasonry__col--right { margin-top: 200px; }` (globals.css line 3232). Cards are distributed alternately: index 0 → left, index 1 → right, index 2 → left, etc. Card variants rotate through a hand-tuned pattern of `['tall','standard','standard','wide','landscape','standard','tall','standard','wide','standard','landscape','standard']`.

See `CURRENT_01` and `CURRENT_02` — the result is two parallel columns with no card actually serving as a featured anchor; everything is approximately the same width.

### What elicyon does
See `ELICYON_06` (top of `/projects`) and `ELICYON_07` (one row of the grid). The structure is:

- **3 columns** at desktop, not 2
- **The leftmost column card is consistently FEATURED**: it occupies ~45% of viewport width and is significantly taller than the two cards to its right
- The right two columns hold normal-sized cards (~25% of viewport width each)
- **Each row repeats this pattern** with the featured anchor alternating sides (row 1: left featured | small | small. Row 2: small | small | right featured. Etc.) — though it's possible elicyon just always anchors left. The 22-frame reference set isn't conclusive on whether anchors alternate; the safer choice for v1 is **always anchor left, alternate the small-pair layout** on the right.
- **Vertical gap between rows** is around 100–140px
- **The "view more" hover overlay** is a small mouse-cursor arrow + the words "VIEW MORE" centered on the image — see `ELICYON_07`

### The rewrite

Replace the entire grid rendering block in `ProjectsClient.tsx` (lines 134–146) with a row-based renderer:

```tsx
{view === 'grid' ? (
  <section className="pf-rows">
    {(() => {
      const rows: Array<{ featured: typeof filtered[0]; small: typeof filtered }> = [];
      let i = 0;
      while (i < filtered.length) {
        const featured = filtered[i++];
        const small = filtered.slice(i, i + 2);  // up to 2 small cards next to featured
        i += small.length;
        rows.push({ featured, small });
      }
      return rows.map((row, rIdx) => (
        <div key={rIdx} className="pf-row">
          <ProjectCardCmp project={{ ...row.featured, variant: 'featured' }} index={rIdx * 3} />
          <div className="pf-row__pair">
            {row.small.map((p, sIdx) => (
              <ProjectCardCmp key={p.slug} project={{ ...p, variant: 'small' }} index={rIdx * 3 + sIdx + 1} />
            ))}
          </div>
        </div>
      ));
    })()}
  </section>
) : (
  // ...keep existing list view block...
)}
```

Update the `cardVariant` type to `'featured' | 'small'` (drop `standard|wide|tall|landscape`). The featured/small distinction is the only one that matters now — variant is geometry-driven by the row layout, not by index.

CSS to add (replace the existing `.pmasonry*` block around lines 3219–3398):

```css
/* ===================== Projects index 3-column masonry ===================== */
.pf-rows {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 var(--gutter) 140px;
  display: flex;
  flex-direction: column;
  gap: 120px;
}
.pf-row {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 24px;
  align-items: start;
}
.pf-row__pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
/* The featured card aspect-ratio dominates the row visual rhythm.
   Tall = 3/4 portrait is the elicyon default. */
.pcard--featured .pcard__media { aspect-ratio: 4/5; }
.pcard--small .pcard__media    { aspect-ratio: 3/4; }

/* Stagger the small-pair vertically so they don't bottom-align
   with the bottom of the featured card — gives elicyon's offset
   rhythm. Apply on the right child of the pair. */
.pf-row__pair > .pcard:nth-child(2) {
  margin-top: 120px;
}

@media (max-width: 900px) {
  .pf-row,
  .pf-row__pair {
    grid-template-columns: 1fr;
    gap: 56px;
  }
  .pf-row__pair > .pcard:nth-child(2) { margin-top: 0; }
  .pf-rows { gap: 56px; }
}
```

You can keep the existing `.pcard__*` rules (media, hover, eyebrow, title) as-is — only the layout and variant classes change.

### Hover overlay refinement

Elicyon's `VIEW MORE` overlay is paired with a small mouse-cursor arrow icon. The current `.pcard__hover` is text-only. Update:

```tsx
// In ProjectCardCmp, inside the figure:
<span className="pcard__hover">
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
    <path d="M0 0 L14 5 L6 7 L4 14 Z" fill="currentColor" />
  </svg>
  View more
</span>
```

```css
.pcard__hover {
  /* keep all existing properties */
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.pcard__hover svg { transform: translateY(-1px); }
```

### Eyebrow format

Elicyon eyebrow is `LOCATION • CATEGORY` with a centered-dot bullet `•` (U+2022) and the city in all-caps. The current code uses `·` (interpunct, U+00B7) and renders the city in normal case. From `src/app/projects/ProjectsClient.tsx`:

```tsx
// Change line 186 from:
<p className="pcard__eyebrow">{project.city} <span aria-hidden>·</span> {project.category.toUpperCase()}</p>
// to:
<p className="pcard__eyebrow">{project.city.toUpperCase()} <span aria-hidden>•</span> {project.category.toUpperCase()}</p>
```

(Same change for the `.plist__row` eyebrow on line 157.)

### Acceptance test for §3
1. Open `/projects`. The grid should show: featured-left tall card, then two smaller cards stacked on the right
2. The right two cards should be vertically offset from each other (second card ~120px lower than first)
3. Card hover: image scales 1.03, "← VIEW MORE" overlay fades in centered
4. Eyebrow reads `KUALA LUMPUR, MALAYSIA • APARTMENT` not `Kuala Lumpur, Malaysia · APARTMENT`
5. Filter switching (APARTMENT, HOTEL, etc) still works and re-flows the grid cleanly
6. Mobile (≤900px) collapses to single column with no offsets

---

## §4 Services split-pane refinements

### What's there
`ServicesClient.tsx` already implements the split-pane correctly: left column sticky-pinned, right column with 5 service blocks (`INTERIOR DESIGN`, `ARCHITECTURE`, etc), IntersectionObserver swaps the active left image. CSS in globals.css 2054–2127 handles the layout. **Don't rebuild this.** Three small refinements:

### Refinement 1: Add the bottom-left project credit caption

See `ELICYON_03/04/05` — bottom-left of every left image has white text:

```
PROJECT
WESTMINSTER VIEW FAMILY HOME →
```

The current code already renders this via `<figcaption>` (line 63) but the CSS scopes it as a single line at the bottom-left. Elicyon stacks "PROJECT" (small caps eyebrow) above the name. Update:

```tsx
// ServicesClient.tsx, around line 62-66:
<div className={`sp-image${i === active ? ' is-active' : ''}`}>
  <Image src={s.image} alt={s.title} fill sizes="50vw" style={{ objectFit: 'cover' }} />
  <div className="sp-image__credit">
    <span className="sp-image__eyebrow">Project</span>
    <span className="sp-image__name">{s.project} <span aria-hidden>→</span></span>
  </div>
</div>
```

```css
/* Replace .sp-image figcaption rule (line ~2079) with: */
.sp-image__credit {
  position: absolute;
  bottom: 36px;
  left: 36px;
  color: var(--text-cream);
  z-index: 2;
  pointer-events: none;
  text-shadow: 0 1px 16px rgba(0,0,0,0.35);
}
.sp-image__eyebrow {
  display: block;
  font-family: var(--font-sans);
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-weight: 600;
  opacity: 0.85;
  margin-bottom: 8px;
}
.sp-image__name {
  display: block;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(20px, 2vw, 28px);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.sp-image__name span {
  margin-left: 12px;
  display: inline-block;
  transition: transform 0.4s var(--ease-out);
}
.sp-image.is-active .sp-image__name span {
  /* tiny arrow nudge to draw the eye to the active block */
  transform: translateX(4px);
}
```

### Refinement 2: Tighten the image crossfade

Current crossfade (line 2069): `transition: opacity 0.8s var(--ease)` — too slow. Elicyon's swap reads as ~250–300ms with very slight overlap. Change:

```css
.sp-image {
  /* keep position: absolute, inset: 0 */
  opacity: 0;
  transition: opacity 320ms cubic-bezier(0.4, 0, 0.2, 1);
}
.sp-image.is-active {
  opacity: 1;
}
```

### Refinement 3: Fade the section title on enter

Already implemented at line 2908–2910 of globals.css (`.sp-title { opacity: 0.3; transition: opacity 0.8s var(--ease-out); }` + `.is-in` class). Keep it. Verify it's still wired in `ServicesClient.tsx` lines 33–43.

### Acceptance test for §4
1. Open `/services`, scroll into the split-pane section
2. First block: left image shows INTERIOR DESIGN's living room with `PROJECT / GH APARTMENT →` in bottom-left
3. Scroll one block: left image fades to ARCHITECTURE's exterior in ~300ms, caption text updates atomically with the image
4. Right column scrolls through 5 blocks (INTERIOR DESIGN, ARCHITECTURE, PROJECT MANAGEMENT, PROCUREMENT, CUSTOM CABINETRY)
5. Each right-column title is at 30% opacity until 35% in view, then animates to 100% opacity over ~800ms

---

## §5 Two cleanup tasks

### 5.1 Find and remove the stray red debug dot

Every frame of the current recording (see `CURRENT_01` through `CURRENT_07`) shows a small red dot at the same screen position (~`x=107` on /projects, ~`x=303` on /projects/[slug]). This is a leak from a custom cursor implementation or a CMS edit-mode indicator.

Search:
```bash
grep -rn "position.*fixed\|position.*absolute" src/ | grep -i "cursor\|dot\|indicator\|red\|burgundy"
```

Likely candidates:
- `src/components/layout/Cursor.tsx` — a custom cursor follower that's rendering even when the cursor is off-screen (recording captures it without the mouse)
- A leftover CMS "edit" pin from `src/app/cms/`
- A `<div>` from a removed Theme/Settings popover that was reduced to just its anchor dot

If it's the Cursor component, gate it behind `(pointer: fine)` and hide it during screen recording:
```css
.cursor {
  display: none;
}
@media (hover: hover) and (pointer: fine) {
  .cursor { display: block; }
}
```
…and make sure it has `pointer-events: none` so it doesn't intercept clicks.

### 5.2 Remove the CREAM theme toggle

Per `STRICT_100_PERCENT_ADDENDUM.md` (which is authoritative), the theme system was supposed to be removed entirely. The pill labeled `◑ CREAM` floating bottom-right of every page (see `CURRENT_*`) is leaking.

In `src/app/layout.tsx`, find and remove:
```tsx
import ThemeToggle from '@/components/layout/ThemeToggle';
// ... and the <ThemeToggle /> render
```

In `src/components/providers/ThemeProvider.tsx` — delete the file or convert it to a pass-through `{children}` wrapper. Remove the import from layout.tsx.

In `src/styles/globals.css` — search for `data-theme="cream"` and either delete those rules entirely (if the site is light-only per addendum) or merge their values into `:root`. The "cream" theme IS the only theme, so promote its color values to defaults.

After removal, verify no page imports ThemeToggle and that `document.documentElement.dataset.theme` is never read.

### 5.3 Fix article agreement on project intro copy

In `src/app/projects/[slug]/page.tsx` line 168, the JSX renders:
```tsx
<em>a</em> {project.category.toUpperCase()} PROGRAM
```

For Apartment, this prints `a APARTMENT PROGRAM` — wrong article. See `CURRENT_04`.

Two options:

**Option A — simple but slightly less elegant**: drop the `<em>a</em>` line entirely:
```tsx
{project.category.toUpperCase()} PROGRAM
```

**Option B — correct article**:
```tsx
const article = /^[AEIOU]/.test(project.category) ? 'an' : 'a';
// ...
<em>{article}</em> {project.category.toUpperCase()} PROGRAM
```

I'd go with Option B — keeps the italic-connector cadence elicyon uses ("a LUXURY 5 STAR RETREAT" — see `ELICYON_09`).

---

## §6 Order of operations (do these in this order)

1. **§1 — Preloader session-storage gate** (10 min). This single change makes the hero image appear and resolves 80% of the "not cinematic" complaint by itself. Test by clicking around the project pages.
2. **§5.1 + §5.2 + §5.3 cleanup** (15 min). The red dot, the CREAM toggle, and the article agreement — all small, all visible, all gone in one pass.
3. **§2 — Title clip-in reveal** (15 min). Add the keyframe + the `--reveal` modifier class on both heroes. The cinematic feel is now there.
4. **§4 — Services split-pane refinements** (30 min). Caption stack, faster crossfade, title fade — all in one edit pass through ServicesClient + globals.css.
5. **§3 — Projects 3-column masonry** (60 min). Bigger refactor. Replace the two-column rendering with row-based, update CSS, retest filter switching and mobile collapse. Do last because it's the most invasive.

Total: ~2 hours of focused work. Don't try to do §3 first — if §1/§2 aren't done, you'll keep getting distracted by the broken hero.

---

## §7 Reference frame index

All frames are in the `reference_frames/` folder shipped alongside this brief. Frames are full-screen 1080p JPEGs ~150KB each.

| File | Shows |
|---|---|
| `CURRENT_01_projects_index_top.jpg` | Current /projects top with 2-col grid + filter labels APARTMENT/HOTEL/VILLA/OFFICE (should be DEVELOPMENT/RESIDENTIAL/COMMERCIAL) + stray red dot |
| `CURRENT_02_projects_masonry.jpg` | Current 2-column staggered masonry with right column offset down ~200px (wrong topology — should be 3-col featured-anchor) |
| `CURRENT_03_BROKEN_HERO_gh-apartment.jpg` | The hero bug. Click GH Apartment → land on black-only hero with title floating |
| `CURRENT_04_BROKEN_HERO_with_intro.jpg` | Scrolled slightly — dark hero above, "CRAFTED by ONE STUDIO, a APARTMENT PROGRAM" intro below (note broken article "a APARTMENT") |
| `CURRENT_05_gallery_works_below.jpg` | Same project, scrolled down — the tower image renders perfectly here, confirming the asset path is fine. The hero is the only break. |
| `CURRENT_06_next_project_card.jpg` | Next-project card at the bottom of detail page — works, looks reasonable |
| `CURRENT_07_BROKEN_HERO_nc-apartment.jpg` | Confirms the bug repeats on a different project (NC Apartment) — it's not project-specific |
| `ELICYON_01_services_hero.jpg` | Elicyon services hero — full-bleed video/image of Mediterranean balcony with centered "SERVICES" white serif |
| `ELICYON_02_services_statement.jpg` | Elicyon services left-aligned 3-line poetic statement — `REALISATION of EXTRAORDINARY / DETAIL and an UNRIVALLED / DEDICATION to MATERIAL.` |
| `ELICYON_03_services_split_interior.jpg` | Split-pane INTERIOR DESIGN block — left: full-bleed living room with `PROJECT / WESTMINSTER VIEW FAMILY HOME →`; right: title + secondary image + body + VIEW PROJECTS underlined link |
| `ELICYON_04_services_split_architecture.jpg` | Split-pane ARCHITECTURE block — same template, different content, demonstrates left image swap |
| `ELICYON_05_services_split_procurement.jpg` | Split-pane PROCUREMENT block — confirms template repeats identically |
| `ELICYON_06_projects_hero_filter.jpg` | Elicyon /projects hero — centered "PROJECT PORTFOLIO", below it `FILTER PROJECTS / DEVELOPMENT RESIDENTIAL COMMERCIAL` left-aligned, grid/list view toggle far right |
| `ELICYON_07_projects_3col_masonry.jpg` | The 3-column masonry — large featured Monaco Retreat card on left, Dubai Penthouse + Lancaster Residence smaller cards stacked on right |
| `ELICYON_08_project_detail_hero.jpg` | Singapore Botanical Hotel detail hero — full-bleed warm lobby image, centered "SINGAPORE BOTANICAL HOTEL" in white serif, soft scrim |
| `ELICYON_09_project_detail_statement.jpg` | 4-line poetic intro statement on cream below the hero |
| `ELICYON_10_project_detail_gallery_open.jpg` | TYPE / LOCATION metadata + first gallery slot (large image left + small portrait positioned high-right) |
| `ELICYON_11_project_detail_asymmetric_pair.jpg` | The signature asymmetric pair — small portrait left, large landscape right, generous vertical spacing |
| `ELICYON_12_next_project_footer.jpg` | Next project card centered + footer in periwinkle blue with JOIN the WORLD / page links / social links |
| `ELICYON_13_reveal_t000ms_image_only.jpg` | Reveal sequence start — old project image still visible (user just clicked new project) |
| `ELICYON_14_reveal_t300ms_title_clipping_in.jpg` | Reveal sequence mid — partial "THE" visible as left-edge mask exposes title |
| `ELICYON_15_reveal_t600ms_title_full.jpg` | Reveal sequence end — "THE BROADWAY MARKETING SUITE" fully revealed |

---

## §8 What's intentionally NOT in this brief

- **Home page.** Not in scope — the SUOFEIYA_ELICYON_PORT_BRIEF and STRICT_100_PERCENT_ADDENDUM cover it.
- **Studio, Insights, Contact, Careers, FAQ pages.** Out of scope.
- **The signature statement animation** (per-word fade + line collapse from the home page). Out of scope here — already specified in §6.2 of the original brief.
- **Cookie banner, navigation, header.** Out of scope — see STRICT_100_PERCENT_ADDENDUM.
- **Project detail asymmetric gallery rhythm.** The current `buildGallerySlots` function in `/projects/[slug]/page.tsx` (lines 46-80) produces a reasonable asymmetric layout already. It does NOT match elicyon exactly (elicyon uses a higher-contrast pairing — see `ELICYON_10` and `ELICYON_11`), but the current implementation is close enough for v1. **Revisit only if §1 + §2 + §3 + §4 + §5 don't satisfy.** A future addendum can tune the slot rhythm.
- **Mid-page second statement on project detail.** Currently hardcoded to "A NEW CHAPTER / in WHOLE-HOUSE / LUXURY". The intent is that each `caseStudy` has its own `feature` copy that drives this — and it does, but the heading above is fixed. Elicyon varies the heading per project (see `ELICYON_09` for Singapore Hotel's "INSPIRED by NATURE..." statement). To match elicyon exactly you'd add a `midStatement` field to each `CaseStudy` record. Defer to v2.

---

## §9 One-screen cheat sheet for the engineer

1. `Preloader.tsx`: gate behind `sessionStorage`. Reduce 1400 → 900.
2. Add `.pd-hero__title--reveal` keyframe and class. Add `.services-hero__title--reveal` class (shares keyframe).
3. Delete `<ThemeToggle />` and Theme provider. Promote `data-theme="cream"` rules to `:root`.
4. `ProjectsClient.tsx`: replace 2-col rendering with row-based `pf-row` (featured + pair). Update `cardVariant` type. Update eyebrow format to `CITY • CATEGORY` with `•`.
5. `globals.css`: replace `.pmasonry*` block with `.pf-rows / .pf-row / .pf-row__pair` block. Replace `.pd-hero img` with `.pd-hero > img`. Tighten `.sp-image` transition from 800ms → 320ms.
6. `ServicesClient.tsx`: replace `<figcaption>` with `.sp-image__credit` two-line block.
7. `[slug]/page.tsx`: fix `a APARTMENT` → `an APARTMENT` (or drop the article). Add `--reveal` class to `pd-hero__title`.
8. Hunt down and kill the stray red dot (probably `Cursor.tsx` or a CMS pin).

Done. The site should now feel like elicyon for these three pages.
