from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


W = 1280
H = 670
OUT = Path(__file__).with_name("sme-automation-hands-on-banner.png")


def font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
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


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], radius: int, fill, outline=None, width: int = 1) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def add_radial(img: Image.Image, center: tuple[int, int], color: tuple[int, int, int], radius: int, strength: float) -> None:
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = overlay.load()
    cx, cy = center
    for y in range(max(0, cy - radius), min(H, cy + radius)):
        for x in range(max(0, cx - radius), min(W, cx + radius)):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            if d <= radius:
                a = int(255 * strength * (1 - d / radius) ** 1.7)
                px[x, y] = (*color, a)
    img.alpha_composite(overlay)


def gradient_background() -> Image.Image:
    img = Image.new("RGB", (W, H), "#f6f0e5")
    px = img.load()
    left = (246, 240, 229)
    mid = (228, 239, 231)
    right = (218, 232, 236)
    for y in range(H):
        vertical = y / (H - 1)
        for x in range(W):
            t = x / (W - 1)
            if t < 0.58:
                k = t / 0.58
                rgb = tuple(int(left[i] * (1 - k) + mid[i] * k) for i in range(3))
            else:
                k = (t - 0.58) / 0.42
                rgb = tuple(int(mid[i] * (1 - k) + right[i] * k) for i in range(3))
            warm = int(10 * (1 - vertical))
            px[x, y] = (min(255, rgb[0] + warm), min(255, rgb[1] + warm), min(255, rgb[2] + warm))
    return img.convert("RGBA")


def shadowed_panel(base: Image.Image, box: tuple[int, int, int, int], fill, outline) -> None:
    x1, y1, x2, y2 = box
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((x1 + 8, y1 + 16, x2 + 8, y2 + 16), radius=8, fill=(35, 58, 64, 35))
    shadow = shadow.filter(ImageFilter.GaussianBlur(16))
    base.alpha_composite(shadow)
    rounded(ImageDraw.Draw(base), box, 8, fill, outline, 1)


def draw_checklist(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    title_font = font(25)
    item_font = font(21, bold=False)
    draw.text((x, y), "手作業", font=title_font, fill=(40, 68, 71, 255))
    for i, label in enumerate(["転記", "確認", "集計"]):
        yy = y + 54 + i * 44
        rounded(draw, (x, yy, x + 28, yy + 28), 5, (255, 255, 255, 210), (63, 139, 126, 145), 2)
        draw.line((x + 7, yy + 15, x + 13, yy + 22, x + 23, yy + 8), fill=(63, 139, 126, 255), width=4)
        draw.text((x + 44, yy - 1), label, font=item_font, fill=(58, 78, 81, 255))


def draw_flow_card(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], label: str, accent, icon: str) -> None:
    x1, y1, x2, y2 = box
    rounded(draw, box, 8, (255, 255, 255, 215), (255, 255, 255, 235), 1)
    draw.ellipse((x1 + 20, y1 + 22, x1 + 76, y1 + 78), fill=accent)
    draw.text((x1 + 36, y1 + 31), icon, font=font(27), fill=(255, 255, 255, 255))
    draw.text((x1 + 96, y1 + 29), label, font=font(26), fill=(38, 63, 70, 255))
    rounded(draw, (x1 + 98, y1 + 68, x2 - 26, y1 + 80), 99, (38, 63, 70, 45))
    rounded(draw, (x1 + 98, y1 + 95, x2 - 68, y1 + 106), 99, (38, 63, 70, 32))


def draw_arrow(draw: ImageDraw.ImageDraw, start: tuple[int, int], end: tuple[int, int], color) -> None:
    sx, sy = start
    ex, ey = end
    draw.line((sx, sy, ex, ey), fill=color, width=8)
    draw.polygon([(ex, ey), (ex - 20, ey - 13), (ex - 20, ey + 13)], fill=color)


def draw_title(draw: ImageDraw.ImageDraw) -> None:
    dark = (31, 45, 52, 255)
    teal = (52, 120, 111, 255)
    orange = (226, 139, 48, 255)
    draw.line((78, 126, 128, 126), fill=orange, width=6)
    draw.line((144, 126, 198, 126), fill=(78, 174, 158, 255), width=6)
    draw.text((78, 150), "SMALL BUSINESS AUTOMATION", font=font(24), fill=teal)

    title_font = font(62)
    shadow = (255, 255, 255, 140)
    draw.text((81, 213), "中小企業の自動化は、", font=title_font, fill=shadow)
    draw.text((78, 209), "中小企業の自動化は、", font=title_font, fill=dark)
    draw.text((81, 292), "もっと身近に始められる。", font=title_font, fill=shadow)
    draw.text((78, 288), "もっと身近に始められる。", font=title_font, fill=dark)

    sub_font = font(38)
    rounded(draw, (78, 418, 622, 492), 8, (255, 255, 255, 156), (255, 255, 255, 230), 1)
    draw.rectangle((78, 418, 88, 492), fill=orange)
    draw.text((110, 433), "手作業を減らす話", font=sub_font, fill=(42, 70, 74, 255))


def main() -> None:
    img = gradient_background()
    add_radial(img, (965, 120), (94, 190, 174), 280, 0.24)
    add_radial(img, (1050, 530), (236, 171, 78), 300, 0.21)
    add_radial(img, (270, 590), (255, 216, 148), 320, 0.18)

    texture = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td = ImageDraw.Draw(texture)
    for x in range(0, W, 56):
        td.line((x, 0, x, H), fill=(42, 75, 80, 12))
    for y in range(0, H, 56):
        td.line((0, y, W, y), fill=(42, 75, 80, 12))
    for y in range(0, H, 9):
        td.line((0, y, W, y), fill=(60, 60, 50, 6))
    img.alpha_composite(texture)

    draw = ImageDraw.Draw(img)
    draw_title(draw)

    shadowed_panel(img, (760, 84, 1148, 248), (255, 255, 255, 178), (255, 255, 255, 225))
    draw = ImageDraw.Draw(img)
    draw_checklist(draw, 792, 116)

    draw_arrow(draw, (954, 170), (1088, 170), (226, 139, 48, 230))
    draw.ellipse((1088, 132, 1164, 208), fill=(52, 120, 111, 255))
    draw.text((1108, 151), "AI", font=font(30), fill=(255, 255, 255, 255))

    draw_flow_card(draw, (720, 330, 1048, 454), "入力を整理", (78, 174, 158, 255), "1")
    draw_flow_card(draw, (858, 502, 1210, 626), "毎日を短縮", (226, 139, 48, 255), "2")
    draw.line((884, 454, 984, 502), fill=(52, 120, 111, 160), width=7)
    draw.polygon([(984, 502), (958, 499), (970, 476)], fill=(52, 120, 111, 160))

    rounded(draw, (1116, 286, 1215, 385), 8, (226, 139, 48, 232))
    plus_font = font(52)
    draw.text((1146, 300), "+", font=plus_font, fill=(255, 255, 255, 250))

    rounded(draw, (656, 544, 770, 610), 8, (31, 45, 52, 226))
    draw.text((681, 560), "まず1つ", font=font(24), fill=(255, 255, 255, 255))

    img.save(OUT)


if __name__ == "__main__":
    main()
