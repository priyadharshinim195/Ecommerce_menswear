#!/usr/bin/env python3
"""
Generate clearly labelled PLACEHOLDER images for MAISON NOIR.

Nothing produced here is a photograph of a model. Customizer and product
images are flat garment silhouettes so that colour and outfit switching can
be seen working. Replace any file in public/ with a final asset that keeps
the same path (or change the paths in src/data or src/config).

Usage:
    python3 scripts/generate_placeholders.py --frames 259
"""
import argparse
import json
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUB = os.path.join(ROOT, "public")
DATA = os.path.join(ROOT, "src", "data")
GOLD = (201, 165, 74)
BG = (12, 12, 12)


def font(size):
    for p in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/TTF/DejaVuSans.ttf",
    ]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def glow_bg(w, h, gx=0.5, gy=0.3, strength=110):
    """Dark background with a soft gold light source (cheap: blur at 1/6 scale)."""
    sw, sh = max(1, w // 6), max(1, h // 6)
    g = Image.new("L", (sw, sh), 0)
    d = ImageDraw.Draw(g)
    cx, cy = gx * sw, gy * sh
    r = max(sw, sh) * 0.45
    d.ellipse((cx - r, cy - r * 0.6, cx + r, cy + r * 0.6), fill=strength)
    g = g.filter(ImageFilter.GaussianBlur(max(2, sw // 8)))
    g = g.resize((w, h), Image.BILINEAR)
    base = Image.new("RGB", (w, h), BG)
    gold = Image.new("RGB", (w, h), GOLD)
    return Image.composite(gold, base, g)


def label(img, lines):
    w, h = img.size
    d = ImageDraw.Draw(img)
    fs = max(14, w // 60)
    f_big, f_small = font(fs), font(max(11, int(fs * 0.75)))
    pad = fs
    heights = [fs * 1.4] + [fs * 1.15] * (len(lines) - 1)
    bar_h = sum(heights) + pad * 2
    d.rectangle((0, h - bar_h, w, h), fill=(8, 8, 8))
    d.line((0, h - bar_h, w, h - bar_h), fill=GOLD, width=2)
    y = h - bar_h + pad
    for i, text in enumerate(lines):
        f = f_big if i == 0 else f_small
        fill = GOLD if i == 0 else (235, 235, 235)
        d.text((pad, y), text, font=f, fill=fill)
        y += heights[i]


def shade(c, f):
    return tuple(max(0, min(255, int(v * f))) for v in c)


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def garment(img, shape, rgb):
    """Draw a flat garment silhouette on a 800x1000 design grid."""
    W, H = img.size
    d = ImageDraw.Draw(img)
    sx, sy = W / 800, H / 1000

    def S(pts):
        return [(x * sx, y * sy) for x, y in pts]

    def B(x0, y0, x1, y1):  # scaled bounding box for ellipse/rectangle
        return (x0 * sx, y0 * sy, x1 * sx, y1 * sy)

    def M(pts):  # mirror across x = 400
        return [(800 - x, y) for x, y in pts]

    dark = shade(rgb, 0.45)
    light = shade(rgb, 1.35)
    lw = max(2, int(W / 260))

    if shape == "trouser":
        d.polygon(S([(262, 300), (538, 300), (530, 400), (270, 400)]), fill=rgb)
        d.polygon(S([(270, 390), (398, 390), (388, 935), (292, 935)]), fill=rgb)
        d.polygon(S([(402, 390), (530, 390), (508, 935), (412, 935)]), fill=rgb)
        d.line(S([(334, 420), (338, 930)]), fill=dark, width=lw)
        d.line(S([(466, 420), (462, 930)]), fill=dark, width=lw)
        return

    sleeves_map = {
        "tee": [(300, 330), (200, 360), (168, 478), (246, 500), (300, 430)],
        "shirt": [(300, 330), (196, 364), (166, 520), (244, 540), (300, 440)],
        "formal": [(310, 330), (220, 360), (190, 520), (256, 535), (310, 430)],
        "hoodie": [(290, 360), (190, 400), (160, 560), (230, 585), (290, 450)],
        "coat": [(280, 300), (170, 330), (140, 740), (204, 760), (262, 450)],
        "bomber": [(290, 330), (190, 360), (165, 640), (236, 660), (290, 450)],
    }
    body_map = {
        "tee": [(300, 330), (500, 330), (510, 790), (290, 790)],
        "shirt": [(300, 330), (500, 330), (506, 840), (294, 840)],
        "formal": [(312, 330), (488, 330), (494, 850), (306, 850)],
        "hoodie": [(290, 330), (510, 330), (512, 800), (288, 800)],
        "coat": [(282, 300), (518, 300), (524, 930), (276, 930)],
        "bomber": [(290, 330), (510, 330), (512, 800), (288, 800)],
    }

    for pts in (sleeves_map[shape], M(sleeves_map[shape])):
        d.polygon(S(pts), fill=rgb)
    d.polygon(S(body_map[shape]), fill=rgb)

    if shape == "tee":
        d.ellipse(B(362, 302, 438, 352), fill=dark)
    elif shape == "shirt":
        d.polygon(S([(372, 334), (400, 402), (360, 334)]), fill=light)
        d.polygon(S([(428, 334), (400, 402), (440, 334)]), fill=light)
        d.line(S([(400, 402), (400, 840)]), fill=dark, width=lw)
    elif shape == "formal":
        d.polygon(S([(372, 334), (400, 410), (364, 334)]), fill=light)
        d.polygon(S([(428, 334), (400, 410), (436, 334)]), fill=light)
        d.line(S([(400, 410), (400, 850)]), fill=dark, width=lw)
    elif shape == "hoodie":
        d.ellipse(B(320, 190, 480, 370), fill=rgb)
        d.ellipse(B(346, 230, 454, 340), fill=dark)
        d.polygon(S([(340, 640), (460, 640), (470, 722), (330, 722)]), fill=dark)
    elif shape == "coat":
        d.polygon(S([(340, 300), (400, 520), (322, 300)]), fill=light)
        d.polygon(S([(460, 300), (400, 520), (478, 300)]), fill=light)
        for y in (580, 660, 740):
            r = 6 * sx
            cx, cy = 400 * sx, y * sy
            d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=dark)
    elif shape == "bomber":
        d.rectangle(B(340, 300, 460, 346), fill=dark)
        d.line(S([(400, 346), (400, 800)]), fill=dark, width=lw)


def save(img, path, quality=86):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "JPEG", quality=quality, optimize=True)


def make_hero_frames(count):
    out_dir = os.path.join(PUB, "frames", "hero")
    W, H = 1280, 720
    for i in range(1, count + 1):
        t = (i - 1) / max(1, count - 1)
        img = glow_bg(W, H, gx=0.15 + 0.7 * t, gy=0.35, strength=120)
        label(img, [
            "PLACEHOLDER HERO FRAME",
            f"{i:03d} / {count}  ·  replace in public/frames/hero/",
        ])
        save(img, os.path.join(out_dir, f"frame-{i:03d}.jpg"), quality=80)


def make_outfits(outfits):
    for o in outfits:
        for c in o["colors"]:
            img = glow_bg(800, 1000, gx=0.5, gy=0.25, strength=70)
            garment(img, o["shape"], hex_rgb(c["hex"]))
            label(img, [
                "PLACEHOLDER · SILHOUETTE, NOT A MODEL",
                f"{o['name']} · {c['name']}",
                "Replace with matching same-model photo",
            ])
            save(img, os.path.join(PUB, "customizer", f"{o['id']}-{c['id']}.jpg"))


def make_products(products):
    for p in products:
        for c in p["colors"]:
            img = glow_bg(800, 1000, gx=0.5, gy=0.25, strength=70)
            garment(img, p["shape"], hex_rgb(c["hex"]))
            label(img, [
                "PLACEHOLDER PRODUCT · DEMO DATA",
                f"{p['name']} · {c['name']}",
            ])
            save(img, os.path.join(PUB, "products", f"{p['id']}-{c['id']}.jpg"))


def make_plain(path, title, lines, w, h, gx=0.5):
    img = glow_bg(w, h, gx=gx, gy=0.35, strength=110)
    label(img, [title] + lines)
    save(img, os.path.join(PUB, path))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--frames", type=int, default=259)
    args = ap.parse_args()

    with open(os.path.join(DATA, "outfits.json")) as f:
        outfits = json.load(f)
    with open(os.path.join(DATA, "products.json")) as f:
        products = json.load(f)

    make_hero_frames(args.frames)
    make_outfits(outfits)
    make_products(products)

    collections = ["coats", "tees", "shirts", "formal", "trousers", "hoodies"]
    for cid in collections:
        make_plain(f"collections/{cid}.jpg", "PLACEHOLDER · COLLECTION",
                   [f"{cid} tile image"], 1000, 1000, gx=0.5)

    for i in range(1, 7):
        make_plain(f"campaign/campaign-{i:02d}.jpg", "PLACEHOLDER · CAMPAIGN LOOK",
                   [f"Look {i:02d} · replace with approved campaign photograph"],
                   1600, 1000, gx=0.3 + 0.08 * i)

    make_plain("story/story.jpg", "PLACEHOLDER · BRAND STORY",
               ["Replace with brand atelier or studio photograph"], 1000, 1250)
    make_plain("banner/banner.jpg", "PLACEHOLDER · EDITORIAL BANNER",
               ["Replace with editorial campaign photograph"], 1920, 900)

    print(f"Wrote {args.frames} hero frames, "
          f"{sum(len(o['colors']) for o in outfits)} customizer images, "
          f"{sum(len(p['colors']) for p in products)} product images, "
          f"plus collection, campaign, story and banner placeholders.")


if __name__ == "__main__":
    main()
