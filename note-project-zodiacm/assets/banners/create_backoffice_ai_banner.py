from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


W = 1280
H = 670
OUT = Path(__file__).with_name("backoffice-ai-automation-banner.png")


def font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    candidates = [
        Path(r"C:\Windows\Fonts\YuGothB.ttc") if bold else Path(r"C:\Windows\Fonts\YuGothM.ttc"),
        Path(r"C:\Windows\Fonts\BIZ-UDGothicB.ttc") if bold else Path(r"C:\Windows\Fonts\BIZ-UDGothicR.ttc"),
        Path(r"C:\Windows\Fonts\msgothic.ttc"),
    ]
    for path in candidates:
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def vertical_gradient() -> Image.Image:
    img = Image.new("RGB", (W, H), "#f5efe3")
    px = img.load()
    left = (245, 239, 227)
    mid = (231, 218, 199)
    right = (203, 214, 210)
    for y in range(H):
        for x in range(W):
            t = x / (W - 1)
            if t < 0.52:
                k = t / 0.52
                rgb = tuple(int(left[i] * (1 - k) + mid[i] * k) for i in range(3))
            else:
                k = (t - 0.52) / 0.48
                rgb = tuple(int(mid[i] * (1 - k) + right[i] * k) for i in range(3))
            px[x, y] = rgb
    return img


def add_radial(img: Image.Image, center: tuple[int, int], color: tuple[int, int, int], radius: int, strength: float) -> None:
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = overlay.load()
    cx, cy = center
    for y in range(max(0, cy - radius), min(H, cy + radius)):
        for x in range(max(0, cx - radius), min(W, cx + radius)):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            if d <= radius:
                a = int(255 * strength * (1 - d / radius) ** 1.6)
                px[x, y] = (*color, a)
    img.alpha_composite(overlay)


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], radius: int, fill, outline=None, width: int = 1) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def shadowed_panel(base: Image.Image, box: tuple[int, int, int, int], fill, outline) -> None:
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    x1, y1, x2, y2 = box
    sd.rounded_rectangle((x1 + 8, y1 + 20, x2 + 8, y2 + 20), radius=8, fill=(26, 39, 48, 34))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    base.alpha_composite(shadow)
    rounded(ImageDraw.Draw(base), box, 8, fill, outline, 1)


def draw_text_with_soft_shadow(draw: ImageDraw.ImageDraw, pos: tuple[int, int], text: str, fnt, fill, shadow_fill) -> None:
    x, y = pos
    draw.text((x + 3, y + 4), text, font=fnt, fill=shadow_fill)
    draw.text((x, y), text, font=fnt, fill=fill)


def main() -> None:
    img = vertical_gradient().convert("RGBA")
    add_radial(img, (990, 145), (119, 214, 198), 270, 0.28)
    add_radial(img, (270, 560), (242, 178, 74), 300, 0.24)

    texture = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td = ImageDraw.Draw(texture)
    for y in range(0, H, 7):
        td.line((0, y, W, y), fill=(25, 33, 42, 8))
    for x in range(0, W, 56):
        td.line((x, 0, x, H), fill=(37, 55, 68, 14))
    for y in range(0, H, 56):
        td.line((0, y, W, y), fill=(37, 55, 68, 14))
    img.alpha_composite(texture)

    draw = ImageDraw.Draw(img)

    # Right-side automation illustration.
    shadowed_panel(img, (850, 82, 1180, 302), (255, 255, 255, 158), (255, 255, 255, 190))
    draw = ImageDraw.Draw(img)
    rows = [
        (880, 120, 1095, 134, (49, 85, 99, 255)),
        (880, 154, 1046, 166, (49, 85, 99, 55)),
        (880, 188, 1127, 200, (49, 85, 99, 55)),
        (880, 222, 1020, 234, (240, 166, 58, 135)),
    ]
    for box in rows:
        rounded(draw, box[:4], 99, box[4])
    rounded(draw, (1029, 251, 1152, 294), 6, (240, 166, 58, 255))
    draw.text((1046, 260), "SMALL", font=font(22), fill=(23, 33, 43, 255))

    shadowed_panel(img, (745, 474, 1000, 650), (23, 33, 43, 214), (128, 202, 190, 110))
    draw = ImageDraw.Draw(img)
    rounded(draw, (772, 500, 882, 512), 99, (255, 255, 255, 195))
    for y, width, color in [
        (538, 192, (255, 255, 255, 90)),
        (572, 142, (255, 255, 255, 90)),
        (606, 112, (100, 182, 172, 184)),
    ]:
        rounded(draw, (772, y, 772 + width, y + 10), 99, color)

    shadowed_panel(img, (965, 492, 1210, 668), (255, 248, 235, 184), (255, 255, 255, 170))
    draw = ImageDraw.Draw(img)
    for y, width, color in [
        (526, 140, (49, 85, 99, 255)),
        (560, 178, (49, 85, 99, 55)),
        (594, 124, (240, 166, 58, 125)),
    ]:
        rounded(draw, (992, y, 992 + width, y + 12), 99, color)

    draw.line((800, 326, 965, 326, 965, 384), fill=(49, 85, 99, 100), width=6)
    draw.ellipse((726, 282, 798, 354), fill=(100, 182, 172, 255))
    draw.text((746, 300), "AI", font=font(28), fill=(255, 255, 255, 255))
    draw.ellipse((1000, 355, 1058, 413), fill=(49, 85, 99, 255))
    draw.arc((1014, 369, 1044, 399), start=32, end=315, fill=(240, 166, 58, 255), width=5)

    spark = Image.new("RGBA", (120, 120), (0, 0, 0, 0))
    sd = ImageDraw.Draw(spark)
    sd.rounded_rectangle((18, 18, 102, 102), radius=8, fill=(240, 166, 58, 230))
    sd.line((42, 60, 78, 60), fill=(255, 255, 255, 210), width=8)
    sd.line((60, 42, 60, 78), fill=(255, 255, 255, 210), width=8)
    spark = spark.rotate(12, expand=True, resample=Image.Resampling.BICUBIC)
    img.alpha_composite(spark, (1110, 350))

    # Title block.
    draw = ImageDraw.Draw(img)
    draw.line((82, 146, 136, 146), fill=(240, 166, 58, 255), width=6)
    draw.line((152, 146, 206, 146), fill=(100, 182, 172, 255), width=6)
    draw.text((82, 169), "BACK OFFICE × AI AUTOMATION", font=font(24), fill=(49, 85, 99, 255))

    title_font = font(70)
    draw_text_with_soft_shadow(draw, (82, 218), "バックオフィスの", title_font, (23, 33, 43, 255), (255, 255, 255, 120))
    draw_text_with_soft_shadow(draw, (82, 304), "AI自動化入門", title_font, (23, 33, 43, 255), (255, 255, 255, 120))

    subtitle_font = font(34)
    sub_box = (82, 427, 610, 548)
    rounded(draw, sub_box, 8, (255, 255, 255, 138))
    draw.rectangle((82, 427, 90, 548), fill=(233, 154, 47, 255))
    draw.text((111, 447), "小さく始めて", font=subtitle_font, fill=(45, 70, 80, 255))
    draw.text((111, 493), "業務効率を上げる方法", font=subtitle_font, fill=(45, 70, 80, 255))

    img.save(OUT)


if __name__ == "__main__":
    main()
