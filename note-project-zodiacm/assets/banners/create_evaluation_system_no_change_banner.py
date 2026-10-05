from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


W = 1280
H = 670
HERE = Path(__file__).resolve().parent
OUT = HERE / "evaluation-system-no-change-banner.png"


def jp_font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    candidates = [
        Path(r"C:\Windows\Fonts\YuGothB.ttc") if bold else Path(r"C:\Windows\Fonts\YuGothM.ttc"),
        Path(r"C:\Windows\Fonts\BIZ-UDGothicB.ttc") if bold else Path(r"C:\Windows\Fonts\BIZ-UDGothicR.ttc"),
        Path(r"C:\Windows\Fonts\meiryob.ttc") if bold else Path(r"C:\Windows\Fonts\meiryo.ttc"),
        Path(r"C:\Windows\Fonts\msgothic.ttc"),
    ]
    for path in candidates:
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def blend(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(int(a[i] * (1 - t) + b[i] * t) for i in range(3))


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], radius: int, fill, outline=None, width: int = 1) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def background() -> Image.Image:
    left = (240, 238, 230)
    right = (214, 222, 218)
    img = Image.new("RGBA", (W, H), (*left, 255))
    px = img.load()
    for y in range(H):
        v = y / (H - 1)
        for x in range(W):
            t = x / (W - 1)
            c = blend(left, right, t)
            warm = int(12 * (1 - v))
            px[x, y] = (min(255, c[0] + warm), min(255, c[1] + warm), min(255, c[2] + warm), 255)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gpx = glow.load()
    for cx, cy, radius, color, power in [
        (940, 155, 330, (104, 132, 129), 0.18),
        (270, 550, 300, (189, 116, 83), 0.14),
    ]:
        for yy in range(max(0, cy - radius), min(H, cy + radius)):
            for xx in range(max(0, cx - radius), min(W, cx + radius)):
                d = math.hypot(xx - cx, yy - cy)
                if d <= radius:
                    a = int(255 * power * (1 - d / radius) ** 1.7)
                    gpx[xx, yy] = (*color, a)
    img.alpha_composite(glow)

    texture = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td = ImageDraw.Draw(texture)
    for y in range(0, H, 7):
        td.line((0, y, W, y), fill=(62, 66, 64, 5))
    for x in range(0, W, 58):
        td.line((x, 0, x, H), fill=(55, 78, 82, 9))
    for y in range(0, H, 58):
        td.line((0, y, W, y), fill=(55, 78, 82, 9))
    img.alpha_composite(texture)
    return img


def panel(img: Image.Image, box: tuple[int, int, int, int], fill, outline=(255, 255, 255, 120), radius: int = 8) -> None:
    x1, y1, x2, y2 = box
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((x1 + 10, y1 + 16, x2 + 10, y2 + 16), radius=radius, fill=(42, 49, 48, 36))
    shadow = shadow.filter(ImageFilter.GaussianBlur(17))
    img.alpha_composite(shadow)
    rounded(ImageDraw.Draw(img), box, radius, fill, outline, 1)


def draw_title(draw: ImageDraw.ImageDraw) -> None:
    dark = (36, 48, 51, 255)
    muted = (90, 105, 104, 255)
    accent = (178, 91, 67, 255)

    draw.line((78, 105, 132, 105), fill=accent, width=5)
    draw.line((148, 105, 204, 105), fill=(113, 137, 132, 255), width=5)
    draw.text((78, 130), "MANAGEMENT SYSTEM  /  FIELD REALITY", font=jp_font(22), fill=muted)

    title_font = jp_font(56)
    shadow = (255, 255, 255, 160)
    lines = ["評価制度を入れても", "現場が変わらない理由"]
    y = 208
    for line in lines:
        draw.text((82, y + 4), line, font=title_font, fill=shadow)
        draw.text((78, y), line, font=title_font, fill=dark)
        bbox = draw.textbbox((78, y), line, font=title_font)
        y += bbox[3] - bbox[1] + 26

    rounded(draw, (78, 450, 590, 524), 8, (255, 255, 255, 178), (255, 255, 255, 225), 1)
    draw.rectangle((78, 450, 88, 524), fill=accent)
    draw.text((111, 468), "制度と行動のあいだにあるもの", font=jp_font(30), fill=(65, 68, 63, 255))


def draw_evaluation_sheet(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    rounded(draw, (x, y, x + 342, y + 286), 9, (255, 253, 247, 242), (255, 255, 255, 230), 1)
    draw.rectangle((x, y, x + 342, y + 54), fill=(66, 83, 86, 255))
    draw.text((x + 24, y + 15), "評価シート", font=jp_font(25), fill=(255, 253, 247, 255))

    labels = ["目標", "評価", "面談", "行動"]
    for i, label in enumerate(labels):
        yy = y + 82 + i * 44
        fill = (178, 91, 67, 255) if i == 3 else (66, 83, 86, 255)
        draw.text((x + 26, yy - 2), label, font=jp_font(22), fill=fill)
        draw.line((x + 104, yy + 14, x + 294, yy + 14), fill=(66, 83, 86, 58), width=9)
    draw.text((x + 226, y + 232), "制度", font=jp_font(29), fill=(178, 91, 67, 255))


def draw_field_board(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    rounded(draw, (x, y, x + 375, y + 250), 10, (37, 45, 47, 235), (255, 255, 255, 54), 1)
    draw.text((x + 28, y + 26), "現場の毎日", font=jp_font(31), fill=(244, 238, 228, 255))
    for i, (label, width) in enumerate([("忙しい", 184), ("前のやり方", 245), ("評価と仕事が遠い", 286)]):
        yy = y + 88 + i * 46
        rounded(draw, (x + 28, yy, x + 28 + width, yy + 30), 99, (17, 21, 22, 62), (244, 238, 228, 34), 1)
        draw.text((x + 45, yy + 1), label, font=jp_font(22), fill=(250, 244, 234, 255))


def draw_stuck_arrow(draw: ImageDraw.ImageDraw) -> None:
    accent = (178, 91, 67, 255)
    draw.line((786, 386, 898, 386), fill=accent, width=9)
    draw.polygon([(898, 386), (874, 370), (874, 402)], fill=accent)
    draw.line((925, 344, 925, 428), fill=(52, 61, 64, 255), width=12)
    draw.text((802, 415), "届かない", font=jp_font(24), fill=(111, 73, 64, 255))


def draw_people(draw: ImageDraw.ImageDraw) -> None:
    colors = [(178, 91, 67, 255), (95, 112, 112, 255), (108, 83, 66, 255)]
    for i, (cx, cy) in enumerate([(1006, 550), (1084, 546), (1162, 550)]):
        color = colors[i]
        draw.ellipse((cx - 28, cy - 28, cx + 28, cy + 28), fill=color)
        rounded(draw, (cx - 45, cy + 35, cx + 45, cy + 92), 12, (*color[:3], 226))
    draw.line((960, 514, 1204, 514), fill=(244, 238, 228, 92), width=4)


def main() -> None:
    img = background()
    draw = ImageDraw.Draw(img)
    draw_title(draw)
    panel(img, (696, 104, 1080, 430), (255, 255, 255, 92), (255, 255, 255, 110), 10)
    draw = ImageDraw.Draw(img)
    draw_evaluation_sheet(draw, 726, 132)
    draw_stuck_arrow(draw)
    draw_field_board(draw, 870, 318)
    draw_people(draw)
    img.save(OUT)


if __name__ == "__main__":
    main()
