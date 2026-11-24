"""Check P1 assets against docs/ASSET_MANIFEST.md. Usage: python tools/verify_assets.py
Machine checks only (path, size, alpha, edges, off-palette colour). Visual quality is reviewed by eye before marking READY."""
import colorsys, pathlib, sys
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent / "public/assets/wedding"

# path: (w, h, alpha, clear_edges) — alpha True = must be transparent; clear_edges = subject must not touch canvas edge
P1 = {
    "textures/paper-ivory.webp":     (1024, 1024, False, False),
    "textures/paper-card.webp":      (1024, 1024, False, False),
    "backgrounds/sky-pale.webp":     (2880, 1620, False, False),
    "backgrounds/hills-distant.png": (2880, 700,  True,  False),
    "hero/pavilion-left.png":        (768,  1536, True,  False),
    "hero/arch-frame.png":           (1200, 1333, True,  False),
    "hero/wax-seal.png":             (480,  480,  True,  True),
    "ornaments/monogram-frame.png":  (480,  480,  True,  True),
    "ornaments/divider-gold.png":    (1200, 120,  True,  True),
    "palace/palace-main.png":        (2400, 1100, True,  True),
    "palace/chhatri-tall.png":       (700,  1100, True,  True),
    "palace/garden.png":             (2880, 600,  True,  False),  # tile + mirror, repeats with CSS repeat-x
    "palace/water.png":              (2880, 700,  True,  False),
    "florals/lotus-single.png":      (600,  450,  True,  True),
    "peacocks/peacock-left.png":     (1100, 1500, True,  True),
}


# P2 assets, added as they are approved (owner decisions 2026-11-24: mandap is one combined image at 1200x1200; branch 768x1536).
P2 = {
    "mandap/mandap-structure.png":   (1200, 1200, True,  True),
    "events/card-mehendi.webp":      (900,  1260, True,  True),
    "events/card-haldi.webp":      (900,  1260, True,  True),
    "events/card-wedding.webp":    (900,  1260, True,  True),
    "events/card-reception.webp":  (900,  1260, True,  True),
    "florals/branch-side-left.png":  (768,  1536, True,  False),
}

# Top-fade layers (owner-approved 2026-11-24): exempt from the ">=5% fully clear" guard; instead the top must fade in gradually.
TOP_FADE = {"palace/water.png"}
FADE_TOP_MAX = 8    # mean alpha of the top 5% of rows
FADE_STEP_MAX = 16  # max jump in row-mean alpha between neighbouring rows (a hard edge jumps ~200)


def fade_errors(a):
    rows = [sum(a.crop((0, y, a.width, y + 1)).getdata()) / a.width for y in range(a.height)]
    errs = []
    top = sum(rows[: max(1, a.height // 20)]) / max(1, a.height // 20)
    if top > FADE_TOP_MAX:
        errs.append(f"top 5% mean alpha {top:.1f}, need <= {FADE_TOP_MAX}")
    jump = max(abs(rows[i + 1] - rows[i]) for i in range(len(rows) - 1))
    if jump > FADE_STEP_MAX:
        errs.append(f"hard edge: row-mean alpha jumps {jump:.0f} between rows, max {FADE_STEP_MAX}")
    return errs


def off_palette_ratio(im):
    """Share of visible pixels that are saturated pink/magenta/purple (forbidden by ART_DIRECTION)."""
    small = im.convert("RGBA").resize((200, max(1, 200 * im.height // im.width)))
    bad = seen = 0
    for r, g, b, a in getattr(small, "get_flattened_data", small.getdata)():
        if a < 128:
            continue
        seen += 1
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        if 0.75 <= h <= 0.97 and s > 0.35 and v > 0.3:
            bad += 1
    return bad / seen if seen else 0


def check(rel, spec):
    w, h, want_alpha, clear_edges = spec
    p = ROOT / rel
    if not p.exists():
        return "MISSING", []
    im = Image.open(p)
    errs = []
    if im.size != (w, h):
        errs.append(f"size {im.size[0]}x{im.size[1]}, need {w}x{h}")
    has_alpha = im.mode in ("RGBA", "LA", "PA") or "transparency" in im.info
    if want_alpha:
        if not has_alpha:
            errs.append("no alpha channel")
        else:
            hist = im.convert("RGBA").getchannel("A").histogram()
            n = sum(hist)
            if rel in TOP_FADE:
                errs += fade_errors(im.convert("RGBA").getchannel("A"))
            elif hist[0] / n < 0.05:
                errs.append(f"only {hist[0]/n:.0%} fully transparent (painted checkerboard?)")
            if clear_edges:
                a = im.convert("RGBA").getchannel("A")
                border = [a.getpixel((x, y)) for x in range(0, a.width, 4) for y in (0, a.height - 1)]
                border += [a.getpixel((x, y)) for y in range(0, a.height, 4) for x in (0, a.width - 1)]
                touching = sum(v > 16 for v in border) / len(border)
                if touching > 0.02:
                    errs.append(f"subject touches canvas edge ({touching:.0%} of border)")
    elif has_alpha and im.convert("RGBA").getchannel("A").getextrema()[0] < 255:
        errs.append("should be opaque but has transparent pixels")
    if p.suffix.lower() != pathlib.Path(rel).suffix:
        errs.append("wrong extension")
    ratio = off_palette_ratio(im)
    if ratio > 0.01:
        errs.append(f"{ratio:.1%} pink/magenta/purple pixels")
    return ("FAIL" if errs else "PASS"), errs


if __name__ == "__main__":
    counts = {}
    for rel, spec in {**P1, **P2}.items():
        status, errs = check(rel, spec)
        counts[status] = counts.get(status, 0) + 1
        print(f"{status:7} {rel}" + "".join(f"\n        - {e}" for e in errs))
    print("\n" + "  ".join(f"{k}: {v}" for k, v in sorted(counts.items())))
    sys.exit(1 if counts.get("FAIL") else 0)
