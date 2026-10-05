"""テスト用：プレースホルダー画像でスタンプを生成"""

from pathlib import Path

from PIL import Image

from image_utils import (
    create_placeholder_image,
    prepare_main_image,
    prepare_sticker_image,
    prepare_thumbnail_image,
)
from line_specs import MAIN_IMAGE_SIZE, STICKER_MAX_SIZE, CHAT_THUMBNAIL_SIZE

from .base import BaseStampGenerator


class PlaceholderGenerator(BaseStampGenerator):
    """API不要。単色＋テキストのプレースホルダー画像を生成する。"""

    def generate_sticker(self, expression: str, index: int, output_path: Path) -> Path:
        img = create_placeholder_image(
            STICKER_MAX_SIZE,
            text=expression,
            bg_rgba=(240, 248, 255, 240),  # 薄い青
        )
        img = prepare_sticker_image(img)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        img.save(output_path, "PNG", compress_level=6)
        return output_path

    def generate_main_image(self, output_path: Path, first_sticker_path: Path | None = None) -> Path:
        if first_sticker_path and first_sticker_path.exists():
            img = Image.open(first_sticker_path).convert("RGBA")
            img = prepare_main_image(img)
        else:
            img = create_placeholder_image(MAIN_IMAGE_SIZE, text="main")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        img.save(output_path, "PNG", compress_level=6)
        return output_path

    def generate_thumbnail(self, output_path: Path, first_sticker_path: Path | None = None) -> Path:
        if first_sticker_path and first_sticker_path.exists():
            img = Image.open(first_sticker_path).convert("RGBA")
            img = prepare_thumbnail_image(img)
        else:
            img = create_placeholder_image(CHAT_THUMBNAIL_SIZE, text="thumb")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        img.save(output_path, "PNG", compress_level=6)
        return output_path
