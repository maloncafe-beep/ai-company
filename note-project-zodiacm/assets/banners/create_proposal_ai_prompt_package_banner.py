from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


W = 1280
H = 670
HERE = Path(__file__).resolve().parent
ICON = HERE.parent / "icon" / "bronson" / "bro_5.png"
OUT = HERE / "proposal-ai-30min-banner.png"


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
    left = (31, 36, 40)
    right = (91, 62, 43)
    img = Image.new("RGBA", (W, H), (*left, 255))
    px = img.load()
    for y in range(H):
        v = y / (H - 1)
        for x in range(W):
            t = x / (W - 1)
            c = blend(left, right, t)
            shade = int(28 * v)
            px[x, y] = (max(0, c[0] - shade), max(0, c[1] - shade), max(0, c[2] - shade), 255)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gpx = glow.load()
    for cx, cy, radius, color, power in [
        (980, 150, 360, (219, 143, 76), 0.35),
        (265, 540, 280, (88, 123, 128), 0.2),
    ]:
        for y in range(max(0, cy - radius), min(H, cy + radius)):
            for x in range(max(0, cx - radius), min(W, cx + radius)):
                d = math.hypot(x - cx, y - cy)
                if d <= radius:
                    current = gpx[x, y]
                    alpha = int(255 * power * (1 - d / radius) ** 1.75)
                    gpx[x, y] = (*color, min(255, current[3] + alpha))
    img.alpha_composite(glow)

    texture = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td = ImageDraw.Draw(texture)
    for y in range(0, H, 5):
        td.line((0, y, W, y), fill=(255, 255, 255, 7))
    for x in range(0, W, 64):
        td.line((x, 0, x, H), fill=(255, 255, 255, 8))
    for y in range(0, H, 64):
        td.line((0, y, W, y), fill=(255, 255, 255, 8))
    img.alpha_composite(texture)
    return img


def panel(img: Image.Image, box: tuple[int, int, int, int], fill, outline=(255, 255, 255, 42), radius: int = 8) -> None:
    x1, y1, x2, y2 = box
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((x1 + 12, y1 + 18, x2 + 12, y2 + 18), radius=radius, fill=(0, 0, 0, 68))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    img.alpha_composite(shadow)
    rounded(ImageDraw.Draw(img), box, radius, fill, outline, 1)


def paste_character(img: Image.Image) -> None:
    src = Image.open(ICON).convert("RGBA")
    src = src.resize((252, 252), Image.Resampling.LANCZOS)
    card = Image.new("RGBA", (304, 334), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle((0, 0, 304, 334), radius=10, fill=(244, 236, 223, 255), outline=(255, 255, 255, 110), width=1)
    card.alpha_composite(src, (26, 16))
    cd.text((38, 278), "PROMPT GUIDE", font=jp_font(23), fill=(65, 52, 43, 255))
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((900, 126, 1204, 460), radius=10, fill=(0, 0, 0, 86))
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))
    img.alpha_composite(shadow)
    img.alpha_composite(card, (886, 104))


def draw_header(draw: ImageDraw.ImageDraw) -> None:
    copper = (222, 146, 77, 255)
    muted = (166, 138, 112, 255)
    draw.line((74, 91, 132, 91), fill=copper, width=5)
    draw.line((148, 91, 206, 91), fill=muted, width=5)
    draw.text((74, 116), "NOTE PREMIUM  /  PROPOSAL AI KIT", font=jp_font(22), fill=(231, 220, 206, 236))


def draw_title(draw: ImageDraw.ImageDraw) -> None:
    title_font = jp_font(58)
    cream = (249, 241, 229, 255)
    shadow = (0, 0, 0, 125)
    lines = ["提案書をAIで作ったら", "3日かかってたのが", "30分になった話"]
    y = 184
    for i, line in enumerate(lines):
        size_font = jp_font(58 if i != 2 else 66)
        fill = cream if i != 2 else (255, 224, 172, 255)
        draw.text((78 + 4, y + 5), line, font=size_font, fill=shadow)
        draw.text((78, y), line, font=size_font, fill=fill)
        bbox = draw.textbbox((78, y), line, font=size_font)
        y += bbox[3] - bbox[1] + (19 if i != 1 else 16)


def draw_offer(draw: ImageDraw.ImageDraw) -> None:
    box = (74, 500, 682, 580)
    rounded(draw, box, 8, (242, 232, 218, 236), (255, 255, 255, 80), 1)
    draw.rectangle((74, 500, 84, 580), fill=(222, 146, 77, 255))
    draw.text((105, 516), "すぐ使えるAIプロンプトパッケージへ", font=jp_font(31), fill=(58, 47, 39, 255))


def draw_proposal_stack(img: Image.Image) -> None:
    panel(img, (720, 420, 1184, 594), (21, 22, 23, 176), (255, 255, 255, 36), 8)
    draw = ImageDraw.Draw(img)
    cards = [
        (752, 456, 930, 554, "Before", "3日"),
        (948, 456, 1152, 554, "After", "30分"),
    ]
    for x1, y1, x2, y2, label, value in cards:
        rounded(draw, (x1, y1, x2, y2), 8, (244, 236, 223, 240), (255, 255, 255, 120), 1)
        draw.text((x1 + 18, y1 + 16), label, font=jp_font(22), fill=(78, 64, 52, 255))
        draw.text((x1 + 18, y1 + 46), value, font=jp_font(36), fill=(42, 37, 34, 255))
    draw.line((918, 505, 966, 505), fill=(222, 146, 77, 255), width=6)
    draw.polygon([(966, 505), (948, 493), (948, 517)], fill=(222, 146, 77, 255))


def draw_prompt_sheet(draw: ImageDraw.ImageDraw) -> None:
    x, y = 660, 160
    rounded(draw, (x, y, x + 222, y + 178), 8, (248, 238, 222, 240), (255, 255, 255, 120), 1)
    draw.text((x + 22, y + 20), "提案書プロンプト", font=jp_font(23), fill=(58, 47, 39, 255))
    for i, width in enumerate([154, 176, 126]):
        yy = y + 66 + i * 32
        rounded(draw, (x + 24, yy, x + 24 + width, yy + 10), 99, (58, 47, 39, 180))
    rounded(draw, (x + 24, y + 146, x + 122, y + 158), 99, (222, 146, 77, 210))


def main() -> None:
    img = background()
    draw = ImageDraw.Draw(img)
    draw_header(draw)
    draw_title(draw)
    draw_offer(draw)
    draw_prompt_sheet(draw)
    paste_character(img)
    draw_proposal_stack(img)
    img.save(OUT)


if __name__ == "__main__":
    main()
