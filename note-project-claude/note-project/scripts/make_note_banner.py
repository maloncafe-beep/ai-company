#!/usr/bin/env python3
"""
Note記事バナー生成スクリプト（ZODIACアカウント用）。

既存の note-project-zodiacm/assets/banners/*.py で確立済みのフラットデザイン
（ベージュ〜セージのグラデーション背景、黒太字見出し、カード型UI図解）を
パラメータ化して再現する。AI画像生成は使わない・コストゼロ。

有料記事と無料記事はバナーで視覚的に区別する（--paid フラグ）。
有料記事には右上にPREMIUMバッジを付け、タグのアクセント色も金系に変える。

使い方の例（有料記事）:
    python scripts/make_note_banner.py --title "40代の転職準備は、AIを壁打ち相手に" --subtitle "棚卸し・書類・面接までの実務ガイド" --tag "CAREER GUIDE / AI ACTIVATION" --paid --checklist-header "やること" --checklist-items "棚卸し,書類,面接対策" --out products/20260930-40dai-tenshoku-ai/05-thumbnail/banner-01.png

使い方の例（無料記事）:
    python scripts/make_note_banner.py --title "記事タイトル" --tag "FREE ARTICLE / TOPIC" --out products/.../05-thumbnail/banner-free-01.png

図解（右側）は --checklist-* / --steps / --flow / --avatars から組み合わせて選ぶ。
何も指定しなければ --avatars のデフォルト（3人の丸アイコン）のみになる。

背景を既存のグラデーションではなく任意の画像（写真・AI生成画像）にしたい場合は
--bg <画像パス> を指定する。指定すると自動で左側に暗いスクリムがかかり、
見出し文字が白文字に切り替わる。
"""

from __future__ import annotations

import argparse
import json
import math
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
STYLE_PATH = ROOT / "config" / "banner-style.json"


def load_style() -> dict:
    with open(STYLE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def rgb(color: list[int]) -> tuple[int, int, int]:
    return tuple(color)  # type: ignore[return-value]


def jp_font(style: dict, size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    key = "candidates_bold" if bold else "candidates_regular"
    for path_str in style["fonts"][key]:
        path = Path(path_str)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def blend(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(int(a[i] * (1 - t) + b[i] * t) for i in range(3))


def rounded(draw: ImageDraw.ImageDraw, box, radius: int, fill, outline=None, width: int = 1) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def make_background(style: dict) -> Image.Image:
    W, H = style["canvas"]["width"], style["canvas"]["height"]
    c = style["colors"]
    left, right = rgb(c["bg_left"]), rgb(c["bg_right"])

    img = Image.new("RGBA", (W, H), (*left, 255))
    px = img.load()
    for y in range(H):
        v = y / (H - 1)
        for x in range(W):
            t = x / (W - 1)
            blended = blend(left, right, t)
            warm = int(12 * (1 - v))
            px[x, y] = (
                min(255, blended[0] + warm),
                min(255, blended[1] + warm),
                min(255, blended[2] + warm),
                255,
            )

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gpx = glow.load()
    for cx, cy, radius, color, power in [
        (int(W * 0.735), int(H * 0.231), int(W * 0.258), rgb(c["glow_sage"]), 0.18),
        (int(W * 0.211), int(H * 0.821), int(W * 0.234), rgb(c["glow_terracotta"]), 0.14),
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
    for y in range(0, H, 58):
        td.line((0, y, W, y), fill=(55, 78, 82, 9))
    for x in range(0, W, 58):
        td.line((x, 0, x, H), fill=(55, 78, 82, 9))
    img.alpha_composite(texture)
    return img


def load_custom_background(path: str, size: tuple[int, int]) -> Image.Image:
    """任意の背景画像(写真・AI生成画像等)をキャンバスサイズにカバートリミングする。"""
    img = Image.open(path).convert("RGB")
    fitted = ImageOps.fit(img, size, method=Image.LANCZOS, centering=(0.5, 0.5))
    return fitted.convert("RGBA")


def apply_left_scrim(img: Image.Image, cutoff_ratio: float = 0.62) -> None:
    """写真背景の上に白文字が読めるよう、左側を暗くするグラデーションを重ねる。"""
    W, H = img.size
    scrim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = scrim.load()
    cutoff = int(W * cutoff_ratio)
    for x in range(W):
        if x < cutoff:
            a = int(185 * (1 - (x / cutoff) ** 1.3))
        else:
            a = 0
        for y in range(H):
            px[x, y] = (10, 14, 16, a)
    img.alpha_composite(scrim)


def tokenize_mixed(text: str) -> list[str]:
    """英数字の連続は1トークンとして保持し、それ以外(CJK等)は1文字ずつトークン化する。"""
    tokens: list[str] = []
    buf = ""
    for ch in text:
        if ch.isascii() and (ch.isalnum() or ch in "-_"):
            buf += ch
        else:
            if buf:
                tokens.append(buf)
                buf = ""
            tokens.append(ch)
    if buf:
        tokens.append(buf)
    return tokens


def wrap_text(text: str, max_chars: int) -> list[str]:
    if not text:
        return []
    lines: list[str] = []
    current = ""
    for token in tokenize_mixed(text):
        if len(current) + len(token) > max_chars and current:
            lines.append(current)
            current = token
        else:
            current += token
    if current:
        lines.append(current)
    return lines


def draw_header(
    img: Image.Image, style: dict, tag: str, title: str, subtitle: str, paid: bool, on_photo: bool = False
) -> None:
    draw = ImageDraw.Draw(img)
    c = style["colors"]
    accent_t = rgb(c["accent_gold"]) if paid else rgb(c["accent_terracotta"])
    accent_s = rgb(c["accent_sage"])

    if on_photo:
        dark = (255, 255, 255)
        muted = (225, 225, 220)
        title_shadow = (0, 0, 0, 200)
        subtitle_box_fill = (10, 14, 16, 150)
        subtitle_text_color = (255, 255, 255, 255)
    else:
        dark, muted = rgb(c["dark"]), rgb(c["muted"])
        title_shadow = (255, 255, 255, 160)
        subtitle_box_fill = (255, 255, 255, 178)
        subtitle_text_color = (65, 68, 63, 255)

    draw.line((78, 105, 132, 105), fill=accent_t, width=5)
    draw.line((148, 105, 204, 105), fill=accent_s, width=5)
    tag_text = ("PREMIUM NOTE / " + tag) if (paid and tag) else (tag or ("PREMIUM NOTE" if paid else ""))
    if tag_text:
        draw.text((78, 130), tag_text, font=jp_font(style, 22, bold=False), fill=muted)

    title_font = jp_font(style, 56)
    lines = title.split("|")[:3] if "|" in title else wrap_text(title, 11)[:3]  # "|" で明示改行
    y = 208
    for line in lines:
        draw.text((82, y + 4), line, font=title_font, fill=title_shadow)
        draw.text((78, y), line, font=title_font, fill=dark)
        bbox = draw.textbbox((78, y), line, font=title_font)
        y += bbox[3] - bbox[1] + 26

    if subtitle:
        box_y2 = y + 74
        rounded(draw, (78, y, 78 + 512, box_y2), 8, subtitle_box_fill, (255, 255, 255, 120), 1)
        draw.rectangle((78, y, 88, box_y2), fill=accent_t)
        draw.text((111, y + 18), subtitle, font=jp_font(style, 30), fill=subtitle_text_color)


def draw_premium_badge(img: Image.Image, style: dict) -> None:
    """有料記事であることを示す右上の小さなバッジ。無料記事には付けない。"""
    draw = ImageDraw.Draw(img)
    c = style["colors"]
    W = style["canvas"]["width"]
    gold = rgb(c["accent_gold"])
    x1, y1, x2, y2 = W - 190, 36, W - 40, 84
    rounded(draw, (x1, y1, x2, y2), 24, (*gold, 235))
    draw.text((x1 + 26, y1 + 11), "PREMIUM", font=jp_font(style, 22), fill=(255, 255, 255))


def panel(img: Image.Image, box, fill, outline=(255, 255, 255, 120), radius: int = 8) -> None:
    W, H = img.size
    x1, y1, x2, y2 = box
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((x1 + 10, y1 + 16, x2 + 10, y2 + 16), radius=radius, fill=(42, 49, 48, 36))
    shadow = shadow.filter(ImageFilter.GaussianBlur(17))
    img.alpha_composite(shadow)
    rounded(ImageDraw.Draw(img), box, radius, fill, outline, 1)


def draw_checklist_card(img: Image.Image, style: dict, x: int, y: int, header: str, items: list[str]) -> None:
    draw = ImageDraw.Draw(img)
    c = style["colors"]
    w, h = 342, 56 + max(1, len(items)) * 44 + 30
    rounded(draw, (x, y, x + w, y + h), 9, (*rgb(c["card_cream"]), 242), (255, 255, 255, 230), 1)
    draw.rectangle((x, y, x + w, y + 54), fill=rgb(c["panel_dark"]))
    draw.text((x + 24, y + 15), header, font=jp_font(style, 25), fill=rgb(c["card_cream"]))
    for i, label in enumerate(items):
        yy = y + 82 + i * 44
        draw.text((x + 26, yy - 2), label, font=jp_font(style, 22), fill=rgb(c["panel_dark"]))
        text_w = draw.textbbox((x + 26, yy - 2), label, font=jp_font(style, 22))[2]
        bar_x = max(x + 150, text_w + 20)
        draw.line((bar_x, yy + 14, x + w - 24, yy + 14), fill=(*rgb(c["panel_dark"]), 58), width=9)


def draw_steps_card(img: Image.Image, style: dict, x: int, y: int, steps: list[tuple[str, str]]) -> None:
    """steps: [(number, label), ...] — 縦に積み重ねる番号付きカード。"""
    draw = ImageDraw.Draw(img)
    c = style["colors"]
    colors = [rgb(c["accent_sage"]), rgb(c["accent_terracotta"])]
    yy = y
    for i, (num, label) in enumerate(steps):
        w, h = 330, 94
        rounded(draw, (x, yy, x + w, yy + h), 10, (*rgb(c["card_cream"]), 242), (255, 255, 255, 220), 1)
        color = colors[i % len(colors)]
        draw.ellipse((x + 20, yy + 20, x + 20 + 54, yy + 20 + 54), fill=color)
        draw.text((x + 38, yy + 32), str(num), font=jp_font(style, 28), fill=(255, 255, 255))
        draw.text((x + 92, yy + 28), label, font=jp_font(style, 24), fill=rgb(c["dark"]))
        draw.line((x + 92, yy + 64, x + 290, yy + 64), fill=(*rgb(c["panel_dark"]), 58), width=8)
        yy += h + 24


def draw_flow(img: Image.Image, style: dict, x: int, y: int, before: str, after: str) -> None:
    """「手作業 → AI」のような変化を示す矢印フロー。"""
    draw = ImageDraw.Draw(img)
    c = style["colors"]
    accent = rgb(c["accent_terracotta"])
    w, h = 340, 90
    rounded(draw, (x, y, x + w, y + h), 9, (*rgb(c["card_cream"]), 242), (255, 255, 255, 225), 1)
    draw.text((x + 24, y + 30), before, font=jp_font(style, 24), fill=rgb(c["dark"]))
    arrow_x1, arrow_x2 = x + w - 110, x + w - 30
    arrow_y = y + h // 2
    draw.line((arrow_x1, arrow_y, arrow_x2, arrow_y), fill=accent, width=7)
    draw.polygon(
        [(arrow_x2, arrow_y), (arrow_x2 - 18, arrow_y - 12), (arrow_x2 - 18, arrow_y + 12)],
        fill=accent,
    )
    draw.ellipse((x + w - 30, y + 18, x + w + 24, y + 72), fill=rgb(c["panel_dark"]))
    draw.text((x + w - 18, y + 32), after, font=jp_font(style, 22), fill=(255, 255, 255))


def draw_avatars(img: Image.Image, style: dict, x: int, y: int, count: int = 3) -> None:
    draw = ImageDraw.Draw(img)
    c = style["colors"]
    colors = [rgb(col) for col in c["avatar_colors"]]
    for i in range(count):
        cx = x + i * 78
        cy = y
        color = colors[i % len(colors)]
        draw.ellipse((cx - 28, cy - 28, cx + 28, cy + 28), fill=color)
        rounded(draw, (cx - 45, cy + 35, cx + 45, cy + 92), 12, (*color, 226))
    draw.line((x - 46, y + 64, x + (count - 1) * 78 + 46, y + 64), fill=(244, 238, 228, 92), width=4)


def main() -> None:
    parser = argparse.ArgumentParser(description="ZODIACアカウント用noteバナーを生成する")
    parser.add_argument("--title", required=True)
    parser.add_argument("--subtitle", default="")
    parser.add_argument("--tag", default="")
    parser.add_argument("--paid", action="store_true", help="有料記事バナー（PREMIUMバッジ＋金アクセント）にする")
    parser.add_argument("--bg", default=None, help="背景画像(写真/AI生成画像等)のパス。指定するとグラデーション背景の代わりに使う")
    parser.add_argument("--checklist-header", default="")
    parser.add_argument("--checklist-items", default="", help="カンマ区切り")
    parser.add_argument("--steps", default="", help="例: 1:強みを言語化,2:書類を磨く")
    parser.add_argument("--flow-before", default="")
    parser.add_argument("--flow-after", default="")
    parser.add_argument("--avatars", type=int, default=0, help="人数(0なら表示しない)")
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    style = load_style()
    size = (style["canvas"]["width"], style["canvas"]["height"])

    on_photo = bool(args.bg)
    if on_photo:
        img = load_custom_background(args.bg, size)
        apply_left_scrim(img)
    else:
        img = make_background(style)

    draw_header(img, style, args.tag, args.title, args.subtitle, args.paid, on_photo=on_photo)
    if args.paid:
        draw_premium_badge(img, style)

    right_x = 760
    right_y = 104

    if args.checklist_header and args.checklist_items:
        items = [s.strip() for s in args.checklist_items.split(",") if s.strip()]
        draw_checklist_card(img, style, right_x, right_y, args.checklist_header, items)

    if args.steps:
        steps: list[tuple[str, str]] = []
        for chunk in args.steps.split(","):
            if ":" in chunk:
                num, label = chunk.split(":", 1)
                steps.append((num.strip(), label.strip()))
        if steps:
            draw_steps_card(img, style, right_x, 360, steps)

    if args.flow_before and args.flow_after:
        draw_flow(img, style, right_x, 420, args.flow_before, args.flow_after)

    if args.avatars > 0:
        draw_avatars(img, style, right_x + 40, 560, args.avatars)
    elif not (args.checklist_header or args.steps or args.flow_before):
        draw_avatars(img, style, right_x + 40, 300, 3)

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(out_path)
    print(f"saved: {out_path}")


if __name__ == "__main__":
    main()
