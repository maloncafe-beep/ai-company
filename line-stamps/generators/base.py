"""スタンプ画像生成の基底クラス（プラグイン用）"""

from abc import ABC, abstractmethod
from pathlib import Path
from typing import List


class BaseStampGenerator(ABC):
    """1枚のスタンプ画像を生成するインターフェース"""

    @abstractmethod
    def generate_sticker(self, expression: str, index: int, output_path: Path) -> Path:
        """指定したフレーズ・表情のスタンプ画像を生成し、output_path に保存する。"""
        pass

    def generate_main_image(self, output_path: Path, first_sticker_path: Path | None = None) -> Path:
        """
        メイン画像（240x240）を生成する。
        デフォルトは first_sticker_path をリサイズして使う。上書き可能。
        """
        raise NotImplementedError("メイン画像の生成はサブクラスで実装するか、first_sticker のリサイズを使う")

    def generate_thumbnail(self, output_path: Path, first_sticker_path: Path | None = None) -> Path:
        """
        チャットサムネイル（96x74）を生成する。
        デフォルトは first_sticker_path をリサイズして使う。
        """
        raise NotImplementedError("サムネイルの生成はサブクラスで実装するか、first_sticker のリサイズを使う")
