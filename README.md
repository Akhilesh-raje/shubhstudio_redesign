# Shubh Studio — redesign

Two pages built with Vite + React + TypeScript and GSAP (ScrollTrigger, ScrollTo):

| Path | What it is |
|---|---|
| `/` | Shubh Studio sales site: palace-card hero (click to enter the palace), sample-invitation gallery with a gatefold "open" interaction, how it works, templates, free monogram form, packages, WhatsApp order form, Razorpay link, partners, FAQ. |
| `/palace/` | *The Palace in Bloom*: the flagship scroll-through wedding invitation (hero, invitation card with wax seal, palace scene, story, mandap, events, venue, RSVP, closing). |

## Run

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/
```

## Structure

```
index.html, palace/index.html   page entries (multi-page build, see vite.config.ts)
src/studio/                     sales site: Studio.tsx (sections), PalaceHero, Showcase, Invite, content.ts (all copy & prices), whatsapp.ts
src/                            Palace demo: App, Hero, Scenes, content.ts (all invitation text)
src/useSiteMotion.ts            shared scroll/ambient motion, driven by data-* attributes (see header comment)
src/useHeroMotion.ts            Palace hero entrance + scroll exit
public/assets/wedding/          approved, fitted artwork served by the site
assets-src/                     untouched originals of every installed asset
references/                     style reference sheets (never shipped)
docs/                           ART_DIRECTION.md (locked style), ASSET_MANIFEST.md (every asset, size, status)
tools/                          asset pipeline: verify_assets.py, fit_asset.py, seam_check.py
```

## Asset pipeline

Every image goes through `docs/ASSET_MANIFEST.md`'s approval steps. `py tools/fit_asset.py <file> <path> <W> <H> [--bottom|--left] [--clip-faint]` keeps the original in `assets-src/`, trims empty margin, scales evenly and places it; `py tools/verify_assets.py` (or `npm run check:assets`) checks size, real transparency, edges and off-palette colour.

## Not yet connected

- Palace demo RSVP: front-end only; it tells guests nothing was sent. Wire a backend before sharing.
- All invitation names, dates, events and venue in `src/content.ts` are fictional sample data.
- Fonts load from Google Fonts; self-host before launch if you want no third-party requests.
