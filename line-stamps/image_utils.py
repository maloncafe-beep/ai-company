"""
LINEスタンプ用の画像処理ユーティリティ
仕様に合わせたリサイズ・偶数サイズ・PNG出力
"""

import io
from pathlib import Path
from typing import Tuple

from PIL import Image

from line_specs import (
    MAIN_IMAGE_SIZE,
    STICKER_MAX_SIZE,
    CHAT_THUMBNAIL_SIZE,
    RECOMMENDED_MARGIN,
)


def ensure_even(size: Tuple[int, int]) -> Tuple[int, int]:
    """LINE仕様: 幅・高さは偶数である必要がある"""
    w, h = size
    return (w if w % 2 == 0 else w - 1, h if h % 2 == 0 else h - 1)


def resize_to_fit(img: Image.Image, max_size: Tuple[int, int]) -> Image.Image:
    """
    アスペクト比を保ったまま max_size に収まるようリサイズする。
    返す画像の幅・高さは偶数にする。
    """
    max_w, max_h = ensure_even(max_size)
    w, h = img.size
    if w <= max_w and h <= max_h:
        nw, nh = ensure_even((w, h))
        if (nw, nh) != (w, h):
            img = img.resize((nw, nh), Image.Resampling.LANCZOS)
        return img
    ratio = min(max_w / w, max_h / h)
    nw = int(w * ratio)
    nh = int(h * ratio)
    nw, nh = ensure_even((nw, nh))
    return img.resize((nw, nh), Image.Resampling.LANCZOS)


def to_rgba(img: Image.Image) -> Image.Image:
    """必要なら RGBA に変換（透過対応）"""
    if img.mode != "RGBA":
        if img.mode == "P" and "transparency" in img.info:
            img = img.convert("RGBA")
        elif img.mode == "RGB":
            img = img.convert("RGBA")
        else:
            img = img.convert("RGBA")
    return img


def save_png_constrained(
    img: Image.Image,
    path: Path,
    max_bytes: int = 1024 * 1024,
) -> bool:
    """
    PNGで保存。1MBを超える場合は品質（圧縮）を上げて再保存する。
    LINE仕様: 1枚あたり最大 1MB。
    """
    img = to_rgba(img)
    path.parent.mkdir(parents=True, exist_ok=True)
    opt = {"compress_level": 6}
    img.save(path, "PNG", **opt)
    if path.stat().st_size <= max_bytes:
        return True
    for level in range(7, 10):
        img.save(path, "PNG", compress_level=level)
        if path.stat().st_size <= max_bytes:
            return True
    return False


def prepare_main_image(img: Image.Image) -> Image.Image:
    """メイン画像 240x240 にリサイズ"""
    img = to_rgba(img)
    target = ensure_even(MAIN_IMAGE_SIZE)
    return img.resize(target, Image.Resampling.LANCZOS)


def prepare_sticker_image(img: Image.Image) -> Image.Image:
    """スタンプ画像 最大 370x320 にリサイズ"""
    return resize_to_fit(to_rgba(img), STICKER_MAX_SIZE)


def prepare_thumbnail_image(img: Image.Image) -> Image.Image:
    """チャットサムネイル 96x74 にリサイズ"""
    img = to_rgba(img)
    target = ensure_even(CHAT_THUMBNAIL_SIZE)
    return img.resize(target, Image.Resampling.LANCZOS)


def create_placeholder_image(
    size: Tuple[int, int],
    text: str = "",
    bg_rgba: Tuple[int, int, int, int] = (255, 200, 200, 230),
) -> Image.Image:
    """テスト用のプレースホルダー画像（文字付き）"""
    from PIL import ImageDraw, ImageFont

    w, h = ensure_even(size)
    img = Image.new("RGBA", (w, h), bg_rgba)
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Hiragino Sans GB.ttc", min(w, h) // 8)
    except Exception:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text(((w - tw) // 2, (h - th) // 2), text, fill=(0, 0, 0, 255), font=font)
    return img
