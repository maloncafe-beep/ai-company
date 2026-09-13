#!/usr/bin/env python3
"""
LINEスタンプ自動生成のメインスクリプト。

使い方:
  python run.py                    # config.yaml を読んで生成
  python run.py --config my.yaml   # 指定した設定ファイルで生成
"""

import argparse
from pathlib import Path

import yaml

from line_specs import STICKER_COUNTS
from image_utils import prepare_main_image, prepare_thumbnail_image
from pack_stamp import create_stamp_zip
from generators.placeholder import PlaceholderGenerator


def load_config(config_path: Path) -> dict:
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def get_generator(config: dict):
    kind = config.get("generator")
    legacy_kind = config.get("generators")
    if kind is None and legacy_kind is not None:
        kind = legacy_kind
        print("注意: config.yaml の 'generators' は古い/誤ったキーです。'generator' に直してください。今回はその値を使います。")
    kind = str(kind or "placeholder").lower()
    if kind == "placeholder":
        return PlaceholderGenerator()
    if kind == "openai":
        try:
            from generators.openai_gen import OpenAIGenerator
            return OpenAIGenerator(config.get("openai", {}))
        except ImportError:
            raise ImportError(
                "generator: openai はまだ使える状態ではありません。"
                "まず generator: placeholder に戻して動作確認するか、"
                "openai パッケージと generators/openai_gen.py を追加してください。"
            )
    raise ValueError(f"未対応の generator: {kind}")


def main():
    parser = argparse.ArgumentParser(description="LINEスタンプを自動生成")
    parser.add_argument("--config", "-c", default="config.yaml", help="設定YAMLのパス")
    parser.add_argument("--output-dir", "-o", default="output", help="出力ディレクトリ")
    parser.add_argument("--zip", action="store_true", help="Creators Market提出用ZIPも作成する")
    args = parser.parse_args()

    config_path = Path(args.config)
    if not config_path.exists():
        config_path = Path("config.example.yaml")
        if not config_path.exists():
            print("config.yaml がありません。config.example.yaml をコピーして config.yaml を作成してください。")
            return 1
        print(f"config.yaml がないため {config_path} を使用します。")

    config = load_config(config_path)
    n = config.get("sticker_count", 16)
    if n not in STICKER_COUNTS:
        print(f"sticker_count は {STICKER_COUNTS} のいずれかにしてください。")
        return 1

    expressions = config.get("expressions", [])
    if len(expressions) < n:
        print(f"expressions の数が {n} 未満です。{n} 件以上用意してください。")
        return 1
    expressions = expressions[:n]

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    stickers_dir = out_dir / "stickers"
    stickers_dir.mkdir(parents=True, exist_ok=True)

    generator = get_generator(config)
    sticker_paths = []

    for i, expr in enumerate(expressions):
        path = stickers_dir / f"sticker_{i+1:02d}.png"
        generator.generate_sticker(expr, i + 1, path)
        sticker_paths.append(path)
        print(f"  生成: {path.name} ({expr})")

    first_sticker = sticker_paths[0] if sticker_paths else None
    main_path = out_dir / "main.png"
    generator.generate_main_image(main_path, first_sticker)
    print(f"  メイン画像: {main_path}")

    thumb_path = out_dir / "thumbnail.png"
    generator.generate_thumbnail(thumb_path, first_sticker)
    print(f"  サムネイル: {thumb_path}")

    if args.zip:
        zip_path = out_dir / "line_stamp_submit.zip"
        create_stamp_zip(out_dir, sticker_paths, main_path, thumb_path, zip_path)
        print(f"  ZIP: {zip_path}")

    print("完了しました。")
    return 0


if __name__ == "__main__":
    exit(main())
