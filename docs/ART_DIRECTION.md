# The Palace in Bloom — Locked Art Direction

This file records decisions. Do not change them without the owner's approval.
Asset list and status: [ASSET_MANIFEST.md](ASSET_MANIFEST.md).

## Canonical style references (in `references/`, never shipped)

| File | Role |
|---|---|
| `Royal Udaipur Wedding Invitation.png` | **Master composition reference** for Scene 01 and the overall look. Contains baked text, so it is never used as an asset. |
| `Luxury Wedding Invitation Asset Board-3.png` | **Primary element style**: paper-cut relief, ivory lotus, dusty-blue florals, gold accents. |
| `Palace in Bloom_ Rajasthani Wedding Asset Pack-2.png` | **Primary element style**: palace facade, mandap, peacock pair, petals, hills. |
| `Royal Rajasthani Wedding Asset Pack-4.png` | Secondary reference: arch variations, chhatris, jharokha. |
| `Rajasthani Wedding Invitation Asset Pack.png`, `Royal Palace Wedding Asset Collage.png`, `Luxury Indian Wedding Design Assets.png`, `Royal Blue and Gold Wedding Heritage Set.png` | Secondary references for layout ideas only. Their **pink lotus, pink-blossom trees, lavender wisteria and green/yellow vignettes are off-palette**. Do not match those parts. |
| `Misty Mountain Lake at Sunrise-1.png` | Spare photo. Not in use. |

Excluded from scope unless the owner asks: wedding procession figures (elephant, horse, musicians, dancers) and the envelope set. Both appear on the sheets, but neither is in the brief.

## Style lock (owner decision, 2026-11-24)

Target is **Style B**: the invitation's pale, airy, handcrafted paper-and-watercolour look. `florals/lotus-single.png` is the approved style benchmark. `palace-main` and `chhatri-tall` were regenerated with this lighting on 2026-11-24 (stone b* 10.8 and 13.1). All P1 architecture now sits in the b* ~10–15 range.

Add this line to every generation prompt:

> Match the invitation's pale ivory paper-and-watercolor aesthetic. Soft, diffused upper-left illumination, low contrast, cool airy tones, subtle paper relief, matte finish. Avoid saturated amber lighting, strong glow, glossy surfaces, dark shadows, and photorealistic CGI.

## Rules

- All artwork comes from image files. No SVG, CSS-drawn, emoji or vector artwork. SVG is allowed only for tiny functional icons (for example, a menu or arrow).
- All text is HTML. No text may be baked into images.
- Mirroring an asset with `transform: scaleX(-1)` is allowed. It reuses existing artwork and does not invent new artwork.
- A missing asset gets a clearly labelled placeholder box at the correct aspect ratio. It is never replaced with substitute artwork.

## Design tokens

```
--ivory:      #F5F0E7   (dominant)
--cream:      #EDE4D5
--champagne:  #E6D3B4
--gold:       #B59A68   (sparingly)
--powder:     #D9E5EF
--dusty-blue: #7894B1   (accent)
--royal-blue: #254A69
--sage:       #879482
--green:      #627A62   (comes from artwork only)
--ink:        #453B32   (body text)
```

## Typography

- **Cormorant Garamond**: names (italic, 300–400), headings, event and venue names.
- **Manrope**: navigation, labels, dates and buttons. Uppercase labels use letter-spacing 0.2–0.3em.
- No third family. Script accents are not used.

## Stack

Vite + React + TypeScript, plain CSS with custom properties (no Tailwind), and GSAP + ScrollTrigger. Lenis is off by default. The RSVP backend is still an open decision, to be made in Phase 4.

## Responsive

- Desktop design width is 1440. Image assets are sized for 2× density at their largest on-screen size.
- At 390px mobile: drop the side pavilions, use one floral corner, remove the palace back layer, use no pinning in Scene 02 (fade instead), and halve parallax distances.
