"""
LINEスタンプ用ZIPパッケージの作成
Creators Market 提出用のファイル名・構成
"""

import zipfile
from pathlib import Path
from typing import List

from line_specs import MAX_ZIP_SIZE_MB


def create_stamp_zip(
    output_dir: Path,
    sticker_paths: List[Path],
    main_path: Path,
    thumbnail_path: Path,
    zip_path: Path,
) -> Path:
    """
    スタンプ画像をLINE提出用ZIPにまとめる。
    ファイル名は公式の命名に合わせる（main.png, sticker_01.png ... thumbnail.png など）。
    """
    zip_path = Path(zip_path)
    zip_path.parent.mkdir(parents=True, exist_ok=True)
    total_mb = 0
    max_mb = MAX_ZIP_SIZE_MB

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        # メイン画像
        if main_path.exists():
            zf.write(main_path, "main.png")
            total_mb += main_path.stat().st_size / (1024 * 1024)
        # スタンプ画像（01, 02, ...）
        for i, p in enumerate(sticker_paths, start=1):
            if not p.exists():
                continue
            arcname = f"sticker_{i:02d}.png"
            zf.write(p, arcname)
            total_mb += p.stat().st_size / (1024 * 1024)
            if total_mb > max_mb:
                raise ValueError(f"ZIPが{max_mb}MBを超えそうです。画像を減らすかファイルサイズを下げてください。")
        # サムネイル
        if thumbnail_path.exists():
            zf.write(thumbnail_path, "thumbnail.png")
            total_mb += thumbnail_path.stat().st_size / (1024 * 1024)

    return zip_path
