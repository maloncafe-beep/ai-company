from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


W = 1280
H = 670
HERE = Path(__file__).resolve().parent
ICON = HERE.parent / "icon" / "bronson" / "bro_5.png"
OUT = HERE / "proposal-ai-30min-banner-bright.png"


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


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], radius: int, fill, outline=None, width: int = 1) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def background() -> Image.Image:
    img = Image.new("RGBA", (W, H), (252, 254, 255, 255))
    draw = ImageDraw.Draw(img)
    for y in range(H):
        t = y / (H - 1)
        r = int(255 * (1 - t) + 235 * t)
        g = int(255 * (1 - t) + 246 * t)
        b = int(255 * (1 - t) + 255 * t)
        draw.line((0, y, W, y), fill=(r, g, b, 255))

    wave = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    wd = ImageDraw.Draw(wave)
    for i in range(7):
        y_base = 470 + i * 18
        points = []
        for x in range(510, W + 40, 18):
            y = y_base + int(math.sin((x + i * 22) / 80) * 18)
            points.append((x, y))
        wd.line(points, fill=(14, 118, 225, 42), width=3)
    img.alpha_composite(wave)

    dots = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dd = ImageDraw.Draw(dots)
    for x in range(760, 1180, 22):
        for y in range(28, 250, 22):
            strength = max(0, 1 - math.hypot(x - 970, y - 130) / 260)
            if strength > 0:
                dd.ellipse((x, y, x + 3, y + 3), fill=(20, 119, 227, int(50 * strength)))
    img.alpha_composite(dots)
    return img


def paste_character(img: Image.Image) -> None:
    src = Image.open(ICON).convert("RGBA")
    src = src.resize((188, 188), Image.Resampling.LANCZOS)
    mask = Image.new("L", src.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, src.width - 1, src.height - 1), radius=24, fill=255)

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((928, 344, 1116, 532), radius=24, fill=(0, 41, 100, 42))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    img.alpha_composite(shadow)

    card = Image.new("RGBA", (220, 235), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle((0, 0, 220, 235), radius=22, fill=(255, 255, 255, 255), outline=(17, 111, 220, 65), width=2)
    card.paste(src, (16, 10), mask)
    cd.text((31, 204), "プロンプト案内", font=jp_font(19), fill=(0, 55, 120, 255))
    img.alpha_composite(card, (912, 326))


def draw_title(draw: ImageDraw.ImageDraw) -> None:
    navy = (0, 38, 113, 255)
    blue = (0, 105, 216, 255)
    orange = (255, 91, 12, 255)

    draw.text((36, 34), "提案書をAIで作ったら", font=jp_font(58), fill=navy)
    draw.text((36, 119), "3日かかってた作業が", font=jp_font(40), fill=(0, 26, 88, 255))
    draw.text((461, 111), "30分", font=jp_font(58), fill=blue)
    draw.text((612, 119), "になった話", font=jp_font(40), fill=(0, 26, 88, 255))

    draw.line((36, 188, 590, 188), fill=blue, width=5)


def draw_bullets(draw: ImageDraw.ImageDraw) -> None:
    items = ["提案書のたたき台を一気に作成", "構成・見出し・要点整理まで対応", "プロンプトをそのまま使える"]
    for i, item in enumerate(items):
        y = 230 + i * 76
        draw.ellipse((44, y, 96, y + 52), fill=(0, 83, 184, 255))
        if i == 0:
            draw.rectangle((60, y + 13, 80, y + 39), outline=(255, 255, 255, 255), width=3)
            draw.line((65, y + 22, 76, y + 22), fill=(255, 255, 255, 255), width=2)
            draw.line((65, y + 30, 76, y + 30), fill=(255, 255, 255, 255), width=2)
        elif i == 1:
            for j, h in enumerate([16, 26, 36]):
                draw.rectangle((59 + j * 9, y + 41 - h, 65 + j * 9, y + 41), fill=(255, 255, 255, 255))
        else:
            for j in range(3):
                yy = y + 15 + j * 10
                draw.line((60, yy + 4, 65, yy + 9, 73, yy), fill=(255, 255, 255, 255), width=3)
        draw.text((116, y + 7), item, font=jp_font(31), fill=(0, 32, 94, 255))
        if i < len(items) - 1:
            draw.line((116, y + 62, 516, y + 62), fill=(0, 83, 184, 45), width=2)


def draw_cta(draw: ImageDraw.ImageDraw) -> None:
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((40, 538, 476, 622), radius=13, fill=(255, 91, 12, 76))
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    draw.bitmap((0, 0), shadow.split()[-1], fill=(255, 91, 12, 75))
    rounded(draw, (36, 530, 472, 612), 13, (255, 91, 12, 255), (255, 130, 47, 255), 2)
    draw.text((117, 550), "今すぐ時短する", font=jp_font(34), fill=(255, 255, 255, 255))
    draw.line((408, 558, 430, 571, 408, 584), fill=(255, 255, 255, 255), width=6)


def draw_ai_badge(draw: ImageDraw.ImageDraw) -> None:
    cx, cy = 812, 138
    for r, alpha in [(86, 36), (68, 52), (49, 80)]:
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(0, 111, 216, alpha), width=3)
    for i in range(16):
        angle = math.tau * i / 16
        x = cx + int(math.cos(angle) * 83)
        y = cy + int(math.sin(angle) * 83)
        draw.ellipse((x - 3, y - 3, x + 3, y + 3), fill=(0, 111, 216, 90))
        draw.line((cx, cy, x, y), fill=(0, 111, 216, 32), width=1)
    draw.ellipse((cx - 48, cy - 48, cx + 48, cy + 48), fill=(0, 111, 216, 255))
    draw.ellipse((cx - 39, cy - 39, cx + 39, cy + 39), fill=(24, 136, 232, 255))
    draw.text((cx - 31, cy - 32), "AI", font=jp_font(43), fill=(255, 255, 255, 255))


def draw_clock(draw: ImageDraw.ImageDraw) -> None:
    cx, cy = 1083, 118
    draw.ellipse((cx - 76, cy - 76, cx + 76, cy + 76), outline=(0, 111, 216, 255), width=9)
    draw.arc((cx - 92, cy - 92, cx + 92, cy + 92), 210, 40, fill=(0, 132, 231, 255), width=11)
    draw.polygon([(cx + 73, cy - 86), (cx + 102, cy - 88), (cx + 87, cy - 62)], fill=(0, 132, 231, 255))
    for i in range(12):
        angle = math.tau * i / 12
        x1 = cx + int(math.sin(angle) * 58)
        y1 = cy - int(math.cos(angle) * 58)
        x2 = cx + int(math.sin(angle) * 65)
        y2 = cy - int(math.cos(angle) * 65)
        draw.line((x1, y1, x2, y2), fill=(0, 38, 113, 255), width=2)
    draw.line((cx, cy, cx + 34, cy - 26), fill=(0, 38, 113, 255), width=5)
    draw.line((cx, cy, cx - 32, cy - 28), fill=(0, 38, 113, 255), width=4)
    rounded(draw, (1018, 210, 1147, 292), 7, (0, 83, 184, 255))
    draw.text((1043, 220), "時短", font=jp_font(30), fill=(255, 255, 255, 255))
    draw.text((1030, 253), "効率化", font=jp_font(30), fill=(255, 255, 255, 255))


def paste_documents(img: Image.Image) -> None:
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse((690, 553, 1240, 629), fill=(0, 59, 130, 42))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    img.alpha_composite(shadow)

    def make_doc(title: str, accent: tuple[int, int, int], rotate_hint: int) -> Image.Image:
        card = Image.new("RGBA", (176, 232), (0, 0, 0, 0))
        cd = ImageDraw.Draw(card)
        cd.rectangle((0, 0, 176, 232), fill=(255, 255, 255, 255), outline=(194, 210, 231, 255), width=2)
        cd.rectangle((0, 0, 176, 44), fill=(0, 83, 184, 255))
        cd.text((20, 10), title, font=jp_font(18), fill=(255, 255, 255, 255))
        for i, w in enumerate([112, 136, 82]):
            cd.rounded_rectangle((20, 64 + i * 24, 20 + w, 74 + i * 24), radius=99, fill=(0, 83, 184, 72))
        cd.rectangle((25, 176, 41, 205), fill=(0, 111, 216, 176))
        cd.rectangle((54, 154, 70, 205), fill=(0, 111, 216, 136))
        cd.rectangle((83, 134, 99, 205), fill=(*accent, 210))
        cd.pieslice((112, 130, 158, 176), 32, 330, fill=(0, 83, 184, 185))
        return card.rotate(rotate_hint, expand=True, resample=Image.Resampling.BICUBIC)

    docs = [
        (make_doc("提案書", (255, 91, 12), -2), (610, 310)),
        (make_doc("構成案", (255, 91, 12), 7), (746, 322)),
        (make_doc("見積り", (255, 91, 12), -6), (876, 312)),
    ]
    for card, xy in docs:
        img.alpha_composite(card, xy)


def paste_laptop(img: Image.Image) -> None:
    draw = ImageDraw.Draw(img)
    panel = (944, 392, 1208, 542)
    rounded(draw, panel, 10, (22, 28, 36, 255), (78, 110, 154, 255), 2)
    rounded(draw, (960, 408, 1192, 524), 4, (255, 255, 255, 255))
    draw.rectangle((960, 408, 1192, 442), fill=(0, 83, 184, 255))
    draw.text((984, 416), "ROIシミュレーション", font=jp_font(17), fill=(255, 255, 255, 255))
    for i, w in enumerate([132, 156, 108]):
        draw.rounded_rectangle((984, 464 + i * 22, 984 + w, 473 + i * 22), radius=99, fill=(0, 83, 184, 68))
    draw.line((1090, 506, 1172, 474), fill=(255, 91, 12, 255), width=4)
    draw.polygon([(1172, 474), (1154, 471), (1162, 488)], fill=(255, 91, 12, 255))
    draw.rectangle((914, 542, 1230, 564), fill=(54, 63, 75, 255))
    draw.polygon([(914, 564), (1230, 564), (1192, 586), (948, 586)], fill=(35, 42, 52, 255))


def main() -> None:
    img = background()
    draw = ImageDraw.Draw(img)
    draw_title(draw)
    draw_bullets(draw)
    draw_cta(draw)
    draw_ai_badge(draw)
    draw_clock(draw)
    paste_documents(img)
    paste_laptop(img)
    paste_character(img)
    img.save(OUT)


if __name__ == "__main__":
    main()
