"""Approved PASS + FIX: keep original in assets-src/, crop empty margin, scale evenly, centre visible art on a transparent canvas.
Usage: py tools/fit_asset.py <delivered.png> <manifest path e.g. hero/arch-frame.png> <W> <H> [--bottom | --left] [--clip-faint]
--bottom: art runs off the bottom edge (no bottom margin), for assets marked "runs off the bottom edge".
--left: art runs off the left edge (no left margin), placed at the top with ~4% margin; for side branches.
A .webp target is saved lossless.
--clip-faint: drop near-invisible haze (alpha<=16) outside the visible art so it cannot limit the scale. Edge cleanup only; check the haze is invisible on ivory first."""
import pathlib, shutil, sys
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
MARGIN = 0.92  # ~4% empty margin per side


def fit(im, W, H, bottom=False, clip_faint=False, left=False):
    a = im.getchannel("A")
    f = a.getbbox()                                  # every non-empty pixel, incl. faint glow remnants: never clipped
    v = a.point(lambda q: 255 if q > 16 else 0).getbbox()  # visible art: used for size and centring
    if clip_faint:
        f = v
    vcx, vcy = (v[0] + v[2]) / 2, (v[1] + v[3]) / 2
    if left:  # art enters from the left edge: size by visible art; faint remnants may clip
        s = min(W * (1 + MARGIN) / 2 / (v[2] - v[0]), H * MARGIN / (v[3] - v[1]))
    elif bottom:  # art is clipped at the bottom anyway; size by visible art and let faint (alpha<=16) remnants clip at the sides
        s = min(W * MARGIN / (v[2] - v[0]), H * (1 + MARGIN) / 2 / (v[3] - v[1]))
    else:
        s = min(W * MARGIN / (v[2] - v[0]), (W / 2) / (vcx - f[0]), (W / 2) / (f[2] - vcx),
                H * MARGIN / (v[3] - v[1]), (H / 2) / (vcy - f[1]), (H / 2) / (f[3] - vcy))
    art = im.crop(f).resize((round((f[2] - f[0]) * s), round((f[3] - f[1]) * s)), Image.LANCZOS)
    x = round(-(v[0] - f[0]) * s) if left else round(W / 2 - (vcx - f[0]) * s)
    if left:
        y = round(H * (1 - MARGIN) / 2 - (v[1] - f[1]) * s)
    else:
        y = round(H - (v[3] - f[1]) * s) if bottom else round(H / 2 - (vcy - f[1]) * s)
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.paste(art, (x, y))  # in --bottom mode, pixels below the visible base fall off-canvas by design
    return out, s


if __name__ == "__main__":
    src, rel, W, H = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
    orig = ROOT / "assets-src" / rel
    orig.parent.mkdir(parents=True, exist_ok=True)
    if not orig.exists():
        shutil.copy2(src, orig)  # original is kept untouched; never overwritten
    im = Image.open(orig).convert("RGBA")
    out, s = fit(im, W, H, "--bottom" in sys.argv, "--clip-faint" in sys.argv, "--left" in sys.argv)
    dst = ROOT / "public/assets/wedding" / rel
    out.save(dst, lossless=True) if dst.suffix == ".webp" else out.save(dst)
    b = out.getchannel("A").point(lambda q: 255 if q > 16 else 0).getbbox()
    print(f"{rel}: scale {s:.3f}, margins L{b[0]} R{W-b[2]} T{b[1]} B{H-b[3]}")
    if "--left" not in sys.argv:
        assert abs(b[0] - (W - b[2])) <= 2, "visible art not centred"
