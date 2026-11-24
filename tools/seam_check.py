"""Seam test for tiling assets. Usage: py tools/seam_check.py <image> [--x-only] [--out tiled.png]
Measures how much the wrap-around join differs from ordinary neighbouring pixels, plus any brightness step between
opposite edges, then writes a 2x2 (or 2x1 with --x-only) tiled preview for the visual check.
seam ratio = mean |diff| across the wrap join / mean |diff| between neighbouring columns inside the image.
~1.0 = invisible join.
Owner rule (2026-11-24): SEAM_MAX and STEP_MAX are review triggers, not verdicts. Above them, the join must be
invisible in the 2x2 preview at normal contrast and at 2x zoom; a line visible only at 8x contrast is acceptable.
Exit code: 0 = pass, 2 = visual review required."""
import sys
from PIL import Image, ImageChops, ImageStat

SEAM_MAX = 1.5   # review trigger: join more than 50% rougher than ordinary texture
STEP_MAX = 3.0   # review trigger: brightness difference (0-255) between opposite 16-px edge strips (~1%; pure noise reaches ~2)


def mean_diff(a, b):
    return sum(ImageStat.Stat(ImageChops.difference(a, b)).mean) / 3


def seam(im, axis):
    """axis 'x' = left/right join, 'y' = top/bottom join."""
    w, h = im.size
    if axis == "y":
        im = im.transpose(Image.Transpose.TRANSPOSE)
        w, h = h, w
    col = lambda x: im.crop((x, 0, x + 1, h))
    inner = sum(mean_diff(col(x), col(x + 1)) for x in range(8, w - 9, max(1, w // 64))) / len(range(8, w - 9, max(1, w // 64)))
    join = mean_diff(col(w - 1), col(0))
    lum = lambda box: ImageStat.Stat(im.crop(box).convert("L")).mean[0]
    step = abs(lum((0, 0, 16, h)) - lum((w - 16, 0, w, h)))
    return join / inner, step


if __name__ == "__main__":
    im = Image.open(sys.argv[1]).convert("RGBA")
    bg = Image.new("RGBA", im.size, (245, 240, 231, 255))  # judge transparent assets as seen on the --ivory page
    bg.alpha_composite(im)
    im = bg.convert("RGB")
    axes = ["x"] if "--x-only" in sys.argv else ["x", "y"]
    ok = True
    for ax in axes:
        ratio, step = seam(im, ax)
        bad = ratio > SEAM_MAX or step > STEP_MAX
        ok &= not bad
        print(f"{'left/right' if ax == 'x' else 'top/bottom'} join: seam ratio {ratio:.2f} (max {SEAM_MAX}), edge brightness step {step:.2f} (max {STEP_MAX}) -> {'REVIEW' if bad else 'pass'}")
    if "--out" in sys.argv:
        w, h = im.size
        ny = 1 if "--x-only" in sys.argv else 2
        t = Image.new("RGB", (w * 2, h * ny))
        for i in range(2):
            for j in range(ny):
                t.paste(im, (i * w, j * h))
        t.save(sys.argv[sys.argv.index("--out") + 1])
    print("SEAM PASS" if ok else "SEAM REVIEW: check the 2x2 at normal contrast and 2x zoom (8x-contrast-only lines are acceptable)")
    sys.exit(0 if ok else 2)
