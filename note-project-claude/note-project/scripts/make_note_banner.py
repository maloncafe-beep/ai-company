#!/usr/bin/env python3
"""
Note記事バナー ローカル合成スクリプト。
文字なし背景(assets/banner_bases/)を再利用し、タイトル/サブタイトルだけを
ローカルでテキスト合成する。Higgsfield等の画像生成クレジットを消費しない。

使い方:
    python scripts/make_note_banner.py \
        --title "40代の転職準備はAIを壁打ち相手に。" \
        --subtitle "同調圧力とAI時代のズレ" \
        --theme ai,tenshoku \
        --out products/20260930-40dai-tenshoku-ai/05-thumbnail/thumbnail-local-01.png

背景が1枚も無い場合は単色グラデーションのプレースホルダー背景で代用する。
新しい背景が欲しくなったら --bg で任意のPNGを直接指定するか、
assets/banner_bases/ に追加して config/banner-style.json の themes に登録する。
"""

import argparse
import json
import random
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
STYLE_PATH = ROOT / "config" / "banner-style.json"
BASES_DIR = ROOT / "assets" / "banner_bases"


def load_style() -> dict:
    with open(STYLE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def pick_background(theme_keys: list[str], style: dict, explicit_bg: str | None) -> Image.Image:
    size = (style["canvas"]["width"], style["canvas"]["height"])

    if explicit_bg:
        img = Image.open(explicit_bg).convert("RGB")
        return img.resize(size)

    candidates: list[str] = []
    for key in theme_keys:
        candidates.extend(style["themes"].get(key, []))
    if not candidates:
        candidates = style["themes"].get("default", [])

    for name in candidates:
        path = BASES_DIR / name
        if path.exists():
            return Image.open(path).convert("RGB").resize(size)

    existing = sorted(BASES_DIR.glob("*.png")) + sorted(BASES_DIR.glob("*.jpg"))
    if existing:
        return Image.open(random.choice(existing)).convert("RGB").resize(size)

    return make_placeholder_background(size)


def make_placeholder_background(size: tuple[int, int]) -> Image.Image:
    """背景素材が1枚も無いときのための簡易グラデーション。"""
    width, height = size
    top = (30, 41, 59)
    bottom = (15, 23, 42)
    img = Image.new("RGB", size, top)
    draw = ImageDraw.Draw(img)
    for y in range(height):
        t = y / height
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    return img.filter(ImageFilter.GaussianBlur(1))


def wrap_text(text: str, max_chars: int, max_lines: int) -> list[str]:
    lines = textwrap.wrap(text, width=max_chars, break_long_words=True)
    if len(lines) > max_lines:
        lines = lines[: max_lines - 1] + ["".join(lines[max_lines - 1 :])]
    return lines


def draw_text_block(
    draw: ImageDraw.ImageDraw,
    lines: list[str],
    font: ImageFont.FreeTypeFont,
    box_x: int,
    start_y: int,
    line_height: int,
    color: str,
    stroke_color: str,
    stroke_width: int,
) -> int:
    y = start_y
    for line in lines:
        draw.text(
            (box_x, y),
            line,
            font=font,
            fill=color,
            stroke_width=stroke_width,
            stroke_fill=stroke_color,
        )
        y += line_height
    return y


def main() -> None:
    parser = argparse.ArgumentParser(description="Note記事バナーをローカル合成する")
    parser.add_argument("--title", required=True, help="バナーに入れるタイトル")
    parser.add_argument("--subtitle", default="", help="サブタイトル(任意)")
    parser.add_argument("--theme", default="", help="テーマキー(カンマ区切り、例: ai,tenshoku)")
    parser.add_argument("--bg", default=None, help="背景PNG/JPGを直接指定(省略時はテーマから自動選択)")
    parser.add_argument("--out", required=True, help="出力PNGパス")
    args = parser.parse_args()

    style = load_style()
    theme_keys = [t.strip() for t in args.theme.split(",") if t.strip()]

    bg = pick_background(theme_keys, style, args.bg)
    draw = ImageDraw.Draw(bg)

    title_cfg = style["title"]
    title_font = ImageFont.truetype(style["fonts"]["title"], title_cfg["size"])
    title_lines = wrap_text(args.title, title_cfg["max_chars_per_line"], title_cfg["max_lines"])
    line_height = int(title_cfg["size"] * title_cfg["line_spacing"])

    next_y = draw_text_block(
        draw,
        title_lines,
        title_font,
        title_cfg["box"]["x"],
        title_cfg["box"]["y"],
        line_height,
        title_cfg["color"],
        title_cfg["stroke_color"],
        title_cfg["stroke_width"],
    )

    if args.subtitle:
        sub_cfg = style["subtitle"]
        sub_font = ImageFont.truetype(style["fonts"]["subtitle"], sub_cfg["size"])
        sub_lines = wrap_text(args.subtitle, sub_cfg["max_chars_per_line"], 2)
        sub_line_height = int(sub_cfg["size"] * 1.2)
        draw_text_block(
            draw,
            sub_lines,
            sub_font,
            title_cfg["box"]["x"],
            next_y + sub_cfg["offset_from_title"],
            sub_line_height,
            sub_cfg["color"],
            sub_cfg["stroke_color"],
            sub_cfg["stroke_width"],
        )

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    bg.save(out_path)
    print(f"saved: {out_path}")


if __name__ == "__main__":
    main()
