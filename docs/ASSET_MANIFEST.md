# Asset Manifest — The Palace in Bloom

Root: `public/assets/wedding/`. Style rules: [ART_DIRECTION.md](ART_DIRECTION.md).

**Status key:** `READY` = file in place and usable · `MISSING` = generate it; the site shows a labelled placeholder until then.

**Priority key:** P1 = needed for the first screens (Scenes 01–03) · P2 = needed for the remaining scenes · P3 = optional.

## Why the sheets are not cut up

Every sheet is 1536–1672 px wide and holds 20–40 elements. Each element is only about **200–700 px wide**. For example, the palace facade is ~500 px and each peacock is ~200 px. Most placements below need **1,400–2,900 px**. The sheets' transparency is also a soft, blurry mask rather than a real cutout, so extracted pieces would carry halos.

Each element must therefore be **regenerated individually at full size**, using the sheet listed in its **Ref** column as the style match. The **Ref** column says where to look:
- **B3** = Asset Board-3
- **P2** = Pack-2
- **P4** = Pack-4
- **M** = the master hero mockup

## Generation rules (apply to every asset)

> Hand-crafted luxury Indian wedding stationery illustration. The look is embossed paper-cut relief with fine watercolour detail. Use warm ivory and cream bodies, dusty blue (#7894B1) and powder blue florals, sage leaves (#879482) and antique gold (#B59A68) accents. Soft, even light from the upper left with soft contact shadows. **No text, letters or numbers. No pink, magenta, purple or saturated colours.** Match the style of the attached reference sheet exactly.

- Use a **transparent background** (real alpha, clean edges, no halo) unless the Alpha column says opaque. Request a downloadable PNG with a true transparent background. If it arrives without alpha, stop and ask the owner before trying a white-background cleanup.
- **Resolution ceiling (owner decision 2026-11-24):** the generator delivers at most ~1536 px on the long side. Sky, hills and water may be evenly upscaled ~1.9× (still subject to the step 4 sharpness check). The garden is a 2880-wide tile made of the artwork plus its mirror. Arch and pavilion targets were lowered to fit, and their CSS display size must not exceed the stated maximum. AI upscaling is **not** an approved fix.
- Centre the subject with ~4% empty margin. Nothing may be cropped by the canvas edge, unless the Placement column says the asset runs off-edge.
- Any `*-left` asset is drawn facing or leaning right, so the site can mirror it for the right side.
- **Registered layers** (marked ⧉) must use the identical canvas size and position, so that they stack exactly.

## Manifest

### Textures & backgrounds

| File | Scene | Placement / purpose | Size (px) | Alpha | Ref | Pri | Status |
|---|---|---|---|---|---|---|---|
| `textures/paper-ivory.webp` | All | Seamless tiling paper grain for the page background. Subtle, with no motifs. | 1024×1024 tile | Opaque | B3 "paper-ivory" | P1 | **READY** (owner-approved 2026-11-24). From `Warm Ivory Textured Paper Background.png` (even 0.817× downscale, lossless WebP). Mean RGB (245,235,223), b* +2 vs `--ivory`. Seams: top/bottom 1.10; left/right 1.61, invisible at normal contrast and 2× zoom, faint only at 8× contrast. |
| `textures/paper-card.webp` | 02, 06, 08 | Tiling heavier cardstock with faint emboss, for invitation and event card surfaces. | 1024×1024 tile | Opaque | P2 swatches | P1 | **READY** (owner-approved 2026-11-24). From `Ivory Cardstock Texture.png` (requested #EEE8DE to offset the generator's warm bias; judged against `--cream`). Even 0.817× downscale, lossless WebP. Mean RGB (238,228,218), b* −2 vs `--cream` (edge of tolerance); reads slightly cooler than the page paper. Seams: top/bottom 1.10; left/right 1.76, invisible at normal contrast and 2× zoom. |
| `backgrounds/sky-pale.webp` | 03, 05 | Pale powder-blue to ivory sky with a few soft clouds in the upper third. Generated at ~1536 wide; even ~1.9× upscale allowed if gradients stay smooth. | 2880×1620 | Opaque | P2 "Distant Hills & Sky" | P1 | **READY** (owner-approved 2026-11-24). From `Pastel Watercolor Sky Gradient.png` (1672×941): even 1.7225× upscale, 1 bottom row cropped (owner-approved), lossless WebP. Top b* −2 vs `--powder`, bottom +1 vs `--ivory`. Clouds in top 29%. No banding at 10× contrast. |
| `backgrounds/hills-distant.png` | 01 (faint), 03, 05 | Misty dusty-blue hill range that sits on the bottom edge. The far parallax layer. Even ~1.9× upscale allowed if the mist stays soft with no artifacts. | 2880×700 | Transparent | P2, M | P1 | **READY** (owner-approved 2026-11-24). From `Misty Layered Blue Hills.png` (1672×941): even 1.7225× upscale, bottom 700 rows kept (only empty transparency trimmed, max alpha 1). Art 565 px tall, runs off left/right/bottom. b* −12, between `--powder` and `--dusty-blue`. |

### Scene 01–02 · Invitation & opening

| File | Scene | Placement / purpose | Size (px) | Alpha | Ref | Pri | Status |
|---|---|---|---|---|---|---|---|
| `hero/floral-corner-left.png` | 01, 04, 08 | Top-left corner branch with lanterns. Mirrored with CSS for the top-right corner. Max display about 640 px wide. | 1448×1086 | Transparent | — | P1 | **READY** (from `Blue Ivory Floral Branch with Golden Lanterns.png`) |
| `hero/pavilion-left.png` | 01 | Tall chhatri tower with jharokha and blue floral inlay panel. Stands at the left edge, mirrored for the right. Runs off the bottom edge. **Max display 384×768 CSS px.** | 768×1536 | Transparent | M sides, B3 "pavilion-left" | P1 | **READY** (owner-approved 2026-11-24). From `Ornate Ivory Chhatri Tower with Blue Vines.png` (fit with `--bottom`, ~1.0× scale, base runs off bottom; stone b* 10.6, cooler than arch). |
| `hero/arch-frame.png` | 02 | Scalloped Mughal arch with blue floral inlay and pillars. The **interior must be transparent**, because the palace is revealed through it. **Max display 600×666 CSS px.** | 1200×1333 | Transparent | P2 "Arch Frame", P4 arches | P1 | **READY** (owner-approved 2026-11-24). From `Ornate Blue Floral Arch Frame.png` (margin crop, even 0.938× downscale, centred; opening verified fully transparent). |
| `hero/wax-seal.png` | 02 | Ivory wax seal with gold and blue lotus motif and no letters. Sits on the card, then moves away. | 480×480 | Transparent | B3 "wax-seal" | P1 | **READY** (owner-approved 2026-11-24). From `Botanical Lotus Wax Seal Emblem.png` (even 0.382× downscale, centred). |
| `ornaments/monogram-frame.png` | 01, 08 | Small gold ornamental lozenge frame with an empty centre. The initials are HTML. | 480×480 | Transparent | M top centre | P1 | **READY** (owner-approved 2026-11-24). From `Dusty Blue Floral Gold Frame.png` (even 0.398× downscale, centred; centre 0% visible; gold line 2–3 px). |
| `ornaments/divider-gold.png` | All | Thin gold filigree line with a small blue flower in the centre. | 1200×120 | Transparent | B3 "Ornaments & Dividers" | P1 | **READY** (owner-approved 2026-11-24). From `Golden Floral Scrollwork Divider.png` (`--clip-faint` haze cleanup, even 0.534× downscale, centred). |

### Scene 03 · Palace (depth order: far → near)

| File | Scene | Placement / purpose | Size (px) | Alpha | Ref | Pri | Status |
|---|---|---|---|---|---|---|---|
| `palace/palace-back.png` | 03 | Paler, simpler distant palace wings behind the main palace. Horizontally centred. | 2880×900 | Transparent | P4 palace | P2 | MISSING |
| `palace/palace-main.png` | 03, 05 (faded), 08 (faded) | Symmetrical ivory palace with a central dome, warm-lit arches and steps. **No trees in front and no pink.** | 2400×1100 | Transparent | P2 "Palace – Main Facade" | P1 | **READY** (owner-approved 2026-11-24). From `Watercolor Mughal Palace Facade.png` (lighting regeneration): even 1.101× upscale, centred. Stone b* 10.8 (was 22.9 amber). Earlier version kept as `assets-src/palace/palace-main.v1.png`. |
| `palace/chhatri-tall.png` | 03 | Single domed chhatri. Placed left and right of the palace (mirrored) and revealed one at a time. | 700×1100 | Transparent | B3 "chhatri" | P1 | **READY** (owner-approved 2026-11-24). From `Watercolor Ivory Rajasthani Chhatri Pavilion.png` (lighting regeneration): even 0.684× downscale, centred; arch openings see-through. Stone b* 13.1 (was 18.1). Earlier version kept as `assets-src/palace/chhatri-tall.v1.png`. |
| `palace/chhatri-small.png` | 03 | Smaller open pavilion for the outer flanks. | 600×800 | Transparent | P2, P4 | P2 | MISSING |
| `palace/garden.png` | 03 | Formal garden band with clipped hedges and white-flowering shrubs at the palace base. Tile = artwork + its mirror (owner-approved 2026-11-24), shown with CSS `background-repeat: repeat-x`; both joins mathematically seamless. No stretching. | 2880×600 | Transparent | P4 garden base | P1 | **READY** (owner-approved 2026-11-24). From `Watercolor Sage Garden Border.png`: even 0.862× downscale to 1440 wide, bottom 600 rows kept (only empty transparency trimmed), then joined with its mirror. Delivered tile failed seam (3.78); mirrored tile 0.00. |
| `palace/tree-white-blossom.png` | 03 | Rounded tree with white blossom. Used 2–4 times, scaled and mirrored. | 800×1000 | Transparent | B3 trees (white one) | P2 | MISSING |
| `palace/water.png` | 03, 05 | Reflecting pool band with soft gold reflections. The top edge fades out. Even ~1.9× upscale allowed if the reflections and gold stay crisp enough. | 2880×700 | Transparent (top fade) | B3 "water-pool", P2 "Water Pool" | P1 | **READY** (owner-approved 2026-11-24). From `Antique Gold Reflections on Water.png` (1671×941): even 1.7235× upscale, bottom 700 rows kept (only empty transparency trimmed, max alpha 2). Validated under the top-fade rule. Water body b* −11. Gold reflections soft but legible at 1:1. |
| `florals/lotus-single.png` | 03, 05 | One **ivory** lotus on its own pad. Placed several times individually. | 600×450 | Transparent | B3 "lotus" | P1 | **READY** (owner-approved 2026-11-24). From `Ivory Lotus on a Sage Lily Pad.png` (margin crop, even 0.391× downscale, centred on transparent canvas). |
| `florals/lotus-cluster.png` | 03, 05 | Ivory lotus group with lily pads, for the water corners. | 1100×550 | Transparent | B3 "lotus-cluster" | P2 | MISSING |
| `peacocks/peacock-left.png` | 03, 01 (optional) | Peacock standing on a short ivory balustrade, facing right, with its tail draping down. Mirrored for the right side. | 1100×1500 | Transparent | M, P2 "Peacock Pair" | P1 | **READY** (owner-approved 2026-11-24). From `Elegant Peacock on Ornate Ivory Balustrade.png` (0.996× fit, centred). Faces right; teal 0%; ivory paper-cut wing. |
| `palace/foreground-florals.png` | 03 | Bottom foreground band of ivory flowers and sage leaves. Lowest in the stack, with the fastest parallax. Must stay low so the centre remains clear. | 2880×500 | Transparent | M bottom corners | P2 | MISSING |

### Scene 04 · Garden of blooms

| File | Scene | Placement / purpose | Size (px) | Alpha | Ref | Pri | Status |
|---|---|---|---|---|---|---|---|
| `florals/branch-side-left.png` | 04, 08 | Flowering branch entering from the left edge, curving up and to the right (diagonal, owner-approved). Frames the top-left of the story scene; mirrored for the right. | 768×1536 | Transparent | B3 "floral-corner", P2 "Floral Clusters" | P2 | **READY** (owner-approved 2026-11-24). From `Watercolor Botanical Corner Branch.png`: fit `--left`, 0.731× downscale. b* 12.8. |
| `florals/cluster-blue.png` | 04 | Small dusty-blue flower cluster that reveals with a stagger. | 700×600 | Transparent | P2 left cluster | P2 | MISSING |
| `florals/cluster-ivory.png` | 04 | Small ivory flower cluster. | 700×600 | Transparent | P2 right cluster | P2 | MISSING |
| `florals/petal-01.png` … `petal-03.png` | 04, 08 | Three single ivory petals at different angles, for 3–6 drifting petals. | 200×200 each | Transparent | P2 "Petals" | P2 | MISSING |
| `peacocks/peacock-feather.png` | 04 | Single peacock feather, upright and slightly curved. | 500×1400 | Transparent | B3 "peacock-feather" | P3 | MISSING |

### Scene 05 · Mandap

| File | Scene | Placement / purpose | Size (px) | Alpha | Ref | Pri | Status |
|---|---|---|---|---|---|---|---|
| `mandap/mandap-structure.png` | 05 | Complete mandap **with its florals** (owner decision 2026-11-24: generators cannot make registered layers, so structure and florals are one image and reveal together). Stepped ivory platform, gold pillars, dome canopy, cream and dusty-blue drapes, two seats. No people. | 1200×1200 | Transparent | P2 "Mandap", B3 mandap | P2 | **READY** (owner-approved 2026-11-24). From `Ornate Blue and Gold Wedding Mandap.png`: 0.922× downscale, centred; pillar openings transparent. b* 14.1. |
| `mandap/mandap-florals.png` | 05 | Not needed: merged into `mandap-structure.png` (owner decision 2026-11-24). | — | — | — | — | **DROPPED** |
| `mandap/diya.png` | 05 | One small lit brass diya. Repeated 5–7 times, and they light one by one. The glow is a CSS fade. | 240×200 | Transparent | B3 "diya", P4 | P2 | MISSING |

The mandap scene reuses sky, hills, `palace-main` (faded), water and lotus. It needs no extra background asset.

### Scene 06 · Events (no text on the cards; titles, dates and venue are HTML)

| File | Scene | Placement / purpose | Size (px) | Alpha | Ref | Pri | Status |
|---|---|---|---|---|---|---|---|
| `events/card-mehendi.webp` | 06 | Arched-top ivory card with a fine gold border; mehendi bowl, henna cones and florals in the top 30%; lower part plain for HTML text. **Master silhouette for the other three cards.** | 900×1260 (5:7) | Transparent outside the card | P2 "Event Cards" | P2 | **READY** (owner-approved 2026-11-24). From `Elegant Mehendi Invitation Card.png`: 0.796× downscale, lossless WebP. b* 8.6. |
| `events/card-haldi.webp` | 06 | Same card shape. Vignette: brass haldi bowls with marigold, kept soft and muted gold. | 900×1260 | same | same | P2 | **READY** (owner-approved 2026-11-24). From `Ornate Haldi Ceremony Arch Invitation.png`: lossless WebP, silhouette matches the Mehendi card. Owner accepted its brighter turmeric yellow. |
| `events/card-wedding.webp` | 06 | Same card shape. Vignette: a tiny palace or mandap. | 900×1260 | same | same | P2 | **READY** (owner-approved 2026-11-24). From `Watercolor Mughal Wedding Mandap Card.png`: lossless WebP, silhouette matches the Mehendi card. |
| `events/card-reception.webp` | 06 | Same card shape. Vignette: hanging lanterns and vines. | 900×1260 | same | same | P2 | **READY** (owner-approved 2026-11-24). From `Ornate Watercolor Lantern Invitation Frame.png`: lossless WebP, silhouette matches the Mehendi card. |

### Scene 07 · Venue

| File | Scene | Placement / purpose | Size (px) | Alpha | Ref | Pri | Status |
|---|---|---|---|---|---|---|---|
| `venue/venue-main.webp` | 07 | Large photo inside a cream frame. Shown at up to ~1200 px wide. | 1672×941 | Opaque | — | P2 | **READY (stand-in)**, from `Golden Sunrise Over Misty Mountain Lake-5.png` with its stray alpha removed. Replace with a real venue photo (≥2400 px wide). |

### Scene 08–09 · RSVP & closing

These scenes need no new assets. They reuse `paper-ivory`, `paper-card`, `floral-corner-left`, `branch-side-left`, `palace-main` (faded), `monogram-frame`, `divider-gold` and the petals.

## Totals

- **Ready:** 17. The floral corner, `lotus-single`, `arch-frame`, `pavilion-left`, `wax-seal`, `divider-gold`, `monogram-frame`, `paper-ivory`, `paper-card`, `sky-pale`, `hills-distant`, `garden`, `water`, `peacock-left`, `palace-main` and `chhatri-tall` are usable now. The venue photo is a stand-in. **P1 READY: 15 of 15** (lotus, arch-frame, pavilion-left, wax-seal, divider-gold, monogram-frame, paper-ivory, paper-card, sky-pale, hills-distant, garden, water, peacock-left, palace-main, chhatri-tall). **All P1 assets READY — website implementation may begin.**
- **P1 to generate first:** 15 files (paper-ivory, paper-card, sky-pale, hills-distant, pavilion-left, arch-frame, wax-seal, monogram-frame, divider-gold, palace-main, chhatri-tall, garden, water, lotus-single, peacock-left). Together these complete Scenes 01–03.
- **P2:** 18 files. **P3:** 1 file.

## Approval pipeline (locked)

An asset becomes READY only after every step passes. A failed asset never enters production, and the standards are never lowered to make the manifest look complete.

1. **File validation**: run `python tools/verify_assets.py` to check the path, extension, exact size, real alpha (not a painted checkerboard), canvas edges and pink/magenta screening.
2. **Visual inspection**: style match, composition, paper material, light from the upper left, level of detail, and no text.
3. **Edge inspection**: composite the asset over ivory `#F5F0E7` and deep blue `#254A69`, and look for halos, fringes and cutout defects.
4. **Resolution check**: the asset is still sharp after resizing or upscaling. It is resized evenly and only empty margin is cropped. **Never stretch.**
5. **Batch review**: lay out all assets in the batch on one sheet and compare them with Board-3, Pack-2 and the hero mockup.
6. **READY**: set the row's status. While assets are incomplete, list exactly which are still missing.

Website implementation does not start until all 15 P1 assets are READY.

### Texture & tile tolerances (owner decision 2026-11-24)

- **Colour:** average yellowness within **±2 b\*** of the target design token.
- **Seams:** run `py tools/seam_check.py <file> --out tiled.png`. A seam ratio above 1.5, or an edge brightness step above 3, triggers visual review instead of failing automatically. The join must be invisible in the 2×2 preview at normal contrast and at 2× zoom. A line visible only at 8× contrast is acceptable. Record the numbers in the row.
- Repairing seams by blending or offsetting is still an artistic change and needs explicit owner approval.
- **Top-fade layers** (`TOP_FADE` in the checker, currently only `palace/water.png`): exempt from the "≥5% fully clear pixels" guard. Instead, the top 5% of rows must average alpha ≤ 8, and row-average alpha may not jump more than 16 between neighbouring rows (no hard edge). All other checks still apply. Every other transparent asset keeps the original guard.
- **WebP:** convert losslessly. The conversion is verified pixel-identical to the PNG.

### Verdicts (locked)

- **PASS**: the asset meets every standard as delivered.
- **PASS + FIX**: the asset is good, and only these technical fixes are allowed: crop empty margin, resize evenly, upscale, and clean up transparent edges or halos. The aspect ratio must be kept. Adding transparent canvas margin is also allowed (owner-approved 2026-11-24), provided only transparency is added and no artwork pixel is stretched or repainted. Removing invisible haze (alpha ≤16, outside the visible art) with `fit_asset.py --clip-faint` is also allowed (owner-approved 2026-11-24), once the haze has been confirmed invisible on ivory.
- **FAIL**: anything artistic is wrong, such as needing to repaint, retouch, recolour, add or remove elements, or change the composition or style. The asset is regenerated from scratch.

Delivered originals are kept untouched in `assets-src/<same path>`, which is not served to the site. The "From `…png`" names in the tables are the generator's download names; those downloads are kept locally in `generations/` (not in the repo), and the identical originals live in `assets-src/`. Fixes are applied to a copy at the `public/assets/wedding/` path. Use `py tools/fit_asset.py <delivered.png> <path> <W> <H> [--bottom]`, which archives the original, crops margin, scales evenly and centres the visible art.
