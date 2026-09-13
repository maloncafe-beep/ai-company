from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


W = 1280
H = 670
HERE = Path(__file__).resolve().parent
ICON = Path(r"D:\Users\yyasu\Pictures\ICON\tmp_1781014716560_640x640.jpg")

TITLE_LINES = ["会社でAI活用が", "定着しない5つの壁"]


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


def blend(c1: tuple[int, int, int], c2: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(int(c1[i] * (1 - t) + c2[i] * t) for i in range(3))


def background(left: tuple[int, int, int], right: tuple[int, int, int], glow: tuple[int, int, int]) -> Image.Image:
    img = Image.new("RGBA", (W, H), (*left, 255))
    px = img.load()
    for y in range(H):
        for x in range(W):
            t = x / (W - 1)
            v = y / (H - 1)
            base = blend(left, right, t)
            shade = int(24 * v)
            px[x, y] = (max(0, base[0] - shade), max(0, base[1] - shade), max(0, base[2] - shade), 255)

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    opx = overlay.load()
    cx, cy, radius = 930, 165, 360
    for y in range(max(0, cy - radius), min(H, cy + radius)):
        for x in range(max(0, cx - radius), min(W, cx + radius)):
            d = math.hypot(x - cx, y - cy)
            if d <= radius:
                a = int(85 * (1 - d / radius) ** 1.8)
                opx[x, y] = (*glow, a)
    img.alpha_composite(overlay)

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


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], radius: int, fill, outline=None, width: int = 1) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def panel(img: Image.Image, box: tuple[int, int, int, int], fill, outline=(255, 255, 255, 36)) -> None:
    x1, y1, x2, y2 = box
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((x1 + 10, y1 + 18, x2 + 10, y2 + 18), radius=8, fill=(0, 0, 0, 58))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    img.alpha_composite(shadow)
    rounded(ImageDraw.Draw(img), box, 8, fill, outline, 1)


def draw_header(draw: ImageDraw.ImageDraw, color: tuple[int, int, int, int], accent: tuple[int, int, int, int]) -> None:
    draw.line((74, 92, 132, 92), fill=accent, width=5)
    draw.line((148, 92, 205, 92), fill=(159, 129, 99, 255), width=5)
    draw.text((74, 116), "PREMIUM NOTE  /  AI ADOPTION", font=jp_font(22), fill=color)


def draw_title(draw: ImageDraw.ImageDraw, x: int, y: int, size: int, fill, shadow_fill) -> None:
    title_font = jp_font(size)
    line_gap = int(size * 0.26)
    cur = y
    for line in TITLE_LINES:
        draw.text((x + 4, cur + 5), line, font=title_font, fill=shadow_fill)
        draw.text((x, cur), line, font=title_font, fill=fill)
        bbox = draw.textbbox((x, cur), line, font=title_font)
        cur += bbox[3] - bbox[1] + line_gap


def draw_subtitle(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, fill, accent) -> None:
    sub_font = jp_font(31)
    rounded(draw, (x, y, x + 540, y + 66), 8, (242, 232, 218, 232), (255, 255, 255, 72), 1)
    draw.rectangle((x, y, x + 8, y + 66), fill=accent)
    draw.text((x + 28, y + 15), text, font=sub_font, fill=fill)


def circular_icon(size: int) -> Image.Image:
    icon = Image.open(ICON).convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse((0, 0, size - 1, size - 1), fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(icon, (0, 0), mask)
    return out


def paste_with_shadow(img: Image.Image, asset: Image.Image, xy: tuple[int, int]) -> None:
    x, y = xy
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse((x + 10, y + 18, x + asset.width + 10, y + asset.height + 18), fill=(0, 0, 0, 92))
    shadow = shadow.filter(ImageFilter.GaussianBlur(22))
    img.alpha_composite(shadow)
    img.alpha_composite(asset, xy)


def draw_wall_cards(draw: ImageDraw.ImageDraw, x: int, y: int, tone: str = "dark") -> None:
    label_font = jp_font(23)
    labels = ["目的が曖昧", "現場が忙しい", "成果が見えない", "ルールがない", "小さく試せない"]
    for i, label in enumerate(labels):
        yy = y + i * 58
        fill = (20, 22, 24, 154) if tone == "dark" else (45, 38, 33, 132)
        outline = (255, 255, 255, 58) if tone == "dark" else (207, 156, 104, 92)
        rounded(draw, (x, yy, x + 330, yy + 42), 8, fill, outline, 1)
        draw.text((x + 18, yy + 7), f"{i + 1}", font=jp_font(22), fill=(214, 154, 92, 255))
        draw.text((x + 60, yy + 6), label, font=label_font, fill=(244, 237, 226, 255))


def variant_icon() -> Image.Image:
    img = background((36, 39, 42), (78, 55, 39), (218, 151, 86))
    draw = ImageDraw.Draw(img)
    draw_header(draw, (223, 211, 196, 235), (219, 146, 78, 255))
    draw_title(draw, 74, 195, 64, (245, 238, 226, 255), (0, 0, 0, 110))
    draw_subtitle(draw, 74, 426, "組織に根づかない理由をほどく", (58, 47, 39, 255), (219, 146, 78, 255))

    panel(img, (760, 92, 1188, 565), (24, 25, 27, 130), (255, 255, 255, 40))
    paste_with_shadow(img, circular_icon(252), (848, 132))
    draw = ImageDraw.Draw(img)
    draw.text((842, 420), "5つの壁", font=jp_font(54), fill=(236, 222, 205, 255))
    draw.line((842, 492, 1115, 492), fill=(219, 146, 78, 220), width=5)
    draw.text((842, 512), "AI活用が止まる場所を見つける", font=jp_font(25), fill=(218, 204, 188, 235))
    return img


def variant_walls() -> Image.Image:
    img = background((28, 31, 35), (62, 69, 72), (150, 165, 166))
    draw = ImageDraw.Draw(img)
    draw_header(draw, (223, 211, 196, 230), (187, 119, 70, 255))
    draw_title(draw, 74, 190, 65, (242, 236, 226, 255), (0, 0, 0, 120))
    draw_subtitle(draw, 74, 430, "導入よりむずかしい、定着の話", (52, 49, 45, 255), (187, 119, 70, 255))

    draw_wall_cards(draw, 840, 148)
    for i, height in enumerate([270, 220, 184, 138, 96]):
        x = 690 + i * 54
        y = 568 - height
        rounded(draw, (x, y, x + 34, 568), 5, (184, 117, 69, 185), (237, 201, 169, 60), 1)
    draw.line((666, 568, 1020, 568), fill=(240, 225, 205, 84), width=3)
    return img


def variant_boardroom() -> Image.Image:
    img = background((49, 40, 36), (83, 58, 44), (218, 151, 86))
    draw = ImageDraw.Draw(img)
    draw_header(draw, (236, 223, 207, 238), (223, 151, 84, 255))
    draw_title(draw, 74, 190, 62, (247, 238, 225, 255), (0, 0, 0, 120))
    draw_subtitle(draw, 74, 426, "現場・管理職・ルールのすれ違い", (58, 47, 39, 255), (223, 151, 84, 255))

    panel(img, (746, 122, 1188, 536), (18, 17, 17, 106), (255, 255, 255, 36))
    draw = ImageDraw.Draw(img)
    board = (802, 170, 1142, 360)
    rounded(draw, board, 8, (237, 222, 205, 230), (255, 255, 255, 120), 1)
    draw.text((830, 198), "AI活用", font=jp_font(32), fill=(58, 50, 45, 255))
    draw.line((830, 252, 1040, 252), fill=(58, 50, 45, 78), width=11)
    draw.line((830, 292, 1090, 292), fill=(58, 50, 45, 62), width=11)
    draw.line((830, 332, 1000, 332), fill=(223, 151, 84, 180), width=11)

    people = [(842, 460, (223, 151, 84, 255)), (962, 456, (91, 97, 100, 255)), (1082, 460, (122, 83, 59, 255))]
    for cx, cy, color in people:
        draw.ellipse((cx - 34, cy - 34, cx + 34, cy + 34), fill=color)
        rounded(draw, (cx - 56, cy + 44, cx + 56, cy + 112), 12, (*color[:3], 210))
    draw.line((820, 410, 1130, 410), fill=(238, 228, 213, 85), width=5)
    return img


def make_sheet(paths: list[Path]) -> None:
    sheet = Image.new("RGBA", (W, H * len(paths)), (24, 24, 24, 255))
    for i, path in enumerate(paths):
        sheet.alpha_composite(Image.open(path).convert("RGBA"), (0, i * H))
    sheet.save(HERE / "ai-adoption-walls-banners-sheet.png")


def main() -> None:
    outputs = [
        ("ai-adoption-walls-with-icon.png", variant_icon()),
        ("ai-adoption-walls-heavy.png", variant_walls()),
        ("ai-adoption-walls-boardroom.png", variant_boardroom()),
    ]
    paths: list[Path] = []
    for name, image in outputs:
        path = HERE / name
        image.save(path)
        paths.append(path)
    make_sheet(paths)


if __name__ == "__main__":
    main()
