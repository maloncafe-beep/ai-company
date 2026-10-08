"""
LINE Creators Market スタンプ仕様（公式ガイドライン準拠）
https://creator.line.me/en/guideline/sticker/
"""

# 画像サイズ（ピクセル）
MAIN_IMAGE_SIZE = (240, 240)       # メイン画像 1枚
STICKER_MAX_SIZE = (370, 320)      # スタンプ画像 最大 370×320
CHAT_THUMBNAIL_SIZE = (96, 74)     # チャット用サムネイル 1枚

# スタンプ枚数の選択肢（このいずれか）
STICKER_COUNTS = (8, 16, 24, 32, 40)

# ファイル制限
MAX_FILE_SIZE_MB = 1
MAX_ZIP_SIZE_MB = 60

# 推奨：画像と端の間に約10pxのマージン
RECOMMENDED_MARGIN = 10

# 形式
IMAGE_DPI = 72
IMAGE_MODE = "RGB"  # PNGは透過対応のため RGBA でも可
