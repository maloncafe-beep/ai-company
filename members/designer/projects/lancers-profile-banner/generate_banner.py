from pathlib import Path
import math

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "lancers-profile-banner-yoshimura-yasunobu.png"
W, H = 1200, 300


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    names = [
        "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf",
        "Arial.ttf",
    ]
    for name in names:
        try:
            return ImageFont.truetype(name, size=size)
        except OSError:
            continue
    return ImageFont.load_default(size=size)


def text_size(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.ImageFont):
    box = draw.textbbox((0, 0), text, font=face)
    return box[2] - box[0], box[3] - box[1]


img = Image.new("RGB", (W, H), "#f7f7f7")
draw = ImageDraw.Draw(img)

# Soft left-side office-inspired background, kept abstract to match the portfolio mood.
left = Image.new("RGBA", (520, H), (232, 232, 232, 255))
ld = ImageDraw.Draw(left)
for y in range(H):
    shade = int(230 - y * 0.10)
    ld.line([(0, y), (520, y)], fill=(shade, shade, shade, 255))

ld.polygon([(0, 0), (520, 0), (370, 85), (0, 42)], fill=(214, 214, 214, 150))
ld.rounded_rectangle((-36, 64, 205, 245), radius=10, fill=(188, 188, 188, 115))
ld.rounded_rectangle((38, 176, 255, 280), radius=14, fill=(204, 204, 204, 155))
ld.line([(18, 226), (268, 198)], fill=(145, 145, 145, 150), width=5)
ld.line([(18, 231), (268, 203)], fill=(247, 247, 247, 120), width=2)
for i in range(8):
    x = 44 + i * 40
    ld.rounded_rectangle((x, 12, x + 28, 26), radius=3, fill=(178, 178, 178, 115))
left = left.filter(ImageFilter.GaussianBlur(2.2))
img.alpha_composite(left.convert("RGBA"), (0, 0)) if img.mode == "RGBA" else img.paste(left.convert("RGB"), (0, 0))

overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
od = ImageDraw.Draw(overlay)
od.rectangle((0, 0, 520, H), fill=(245, 245, 245, 132))

# Large diagonal white plane, echoing the supplied portfolio cover.
od.polygon([(338, 300), (642, 0), (1200, 0), (1200, 300)], fill=(250, 250, 250, 255))
od.polygon([(0, 300), (338, 300), (642, 0), (0, 0)], fill=(246, 246, 246, 58))
img = Image.alpha_composite(img.convert("RGBA"), overlay)
draw = ImageDraw.Draw(img)

# Minimal technical grid and wave motif on the right.
grid_color = (214, 214, 214, 120)
for x in range(862, 1130, 64):
    draw.line([(x, 36), (x, 205)], fill=grid_color, width=1)
for y in range(58, 205, 56):
    draw.line([(832, y), (1142, y)], fill=grid_color, width=1)

wave_color = (222, 222, 222, 185)
for row_y in [106, 178]:
    points = []
    for x in range(760, 1136):
        yy = row_y + math.sin((x - 760) / 48 * math.pi) * 23
        points.append((x, yy))
    draw.line(points, fill=wave_color, width=18, joint="curve")

# Quiet geometric accents only. The banner is intended as a background header.
draw.line([(92, 114), (362, 114)], fill=(56, 56, 56, 185), width=4)
draw.line([(92, 138), (256, 138)], fill=(134, 134, 134, 150), width=2)
draw.line([(92, 162), (316, 162)], fill=(200, 200, 200, 130), width=2)

draw.rectangle((846, 228, 1108, 232), fill=(230, 230, 230, 160))
draw.rectangle((930, 246, 1108, 249), fill=(206, 206, 206, 145))

# Hairline frame for crisp upload preview without looking boxed-in.
draw.rectangle((0, 0, W - 1, H - 1), outline=(236, 236, 236, 255), width=1)

img.convert("RGB").save(OUT, quality=95)
print(OUT)
