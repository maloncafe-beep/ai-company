"""
映画風クラシックカウントダウン動画生成
縦動画 1080x1920 / 10→0 / 白黒 / BGMなし
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont
import math
import os
from datetime import date

WIDTH, HEIGHT = 1080, 1920
FPS = 30
DURATION_PER_COUNT = 1.0  # 各数字の表示秒数
COUNTS = list(range(10, -1, -1))  # 10→0
TOTAL_FRAMES = int(FPS * len(COUNTS) * DURATION_PER_COUNT)

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PATH = os.path.join(OUTPUT_DIR, f"countdown_{date.today().strftime('%Y%m%d')}.mp4")


def add_grain(img_array, intensity=18):
    noise = np.random.randint(-intensity, intensity, img_array.shape, dtype=np.int16)
    result = np.clip(img_array.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    return result


def add_vignette(img_array):
    h, w = img_array.shape[:2]
    cx, cy = w / 2, h / 2
    Y, X = np.ogrid[:h, :w]
    dist = np.sqrt(((X - cx) / cx) ** 2 + ((Y - cy) / cy) ** 2)
    vignette = np.clip(1.0 - dist * 0.65, 0, 1)
    result = (img_array * vignette[:, :, np.newaxis]).astype(np.uint8)
    return result


def draw_frame(count, frame_in_count, total_frames_in_count):
    img = Image.new("RGB", (WIDTH, HEIGHT), (10, 10, 10))
    draw = ImageDraw.Draw(img)

    cx, cy = WIDTH // 2, HEIGHT // 2
    progress = frame_in_count / max(total_frames_in_count - 1, 1)

    # --- 外側の大円 ---
    outer_r = 380
    draw.ellipse(
        [cx - outer_r, cy - outer_r, cx + outer_r, cy + outer_r],
        outline=(200, 200, 200), width=6
    )

    # --- 内側の円 ---
    inner_r = 320
    draw.ellipse(
        [cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r],
        outline=(160, 160, 160), width=3
    )

    # --- 回転ライン（秒針風） ---
    angle = progress * 360 - 90  # -90度スタート（上から）
    rad = math.radians(angle)
    line_len = outer_r - 10
    lx = cx + line_len * math.cos(rad)
    ly = cy + line_len * math.sin(rad)
    draw.line([(cx, cy), (lx, ly)], fill=(220, 220, 220), width=5)

    # --- クロスライン（水平・垂直） ---
    cross_len = outer_r + 60
    draw.line([(cx - cross_len, cy), (cx + cross_len, cy)], fill=(120, 120, 120), width=2)
    draw.line([(cx, cy - cross_len), (cx, cy + cross_len)], fill=(120, 120, 120), width=2)

    # --- 数字 ---
    font_size = 340
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", font_size)
    except Exception:
        font = ImageFont.load_default()

    text = str(count)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = cx - tw // 2 - bbox[0]
    ty = cy - th // 2 - bbox[1]
    draw.text((tx, ty), text, font=font, fill=(240, 240, 240))

    # --- フレーム番号（映画風の小テキスト） ---
    try:
        small_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 36)
    except Exception:
        small_font = ImageFont.load_default()

    frame_num = f"{count:02d}"
    draw.text((80, 80), frame_num, font=small_font, fill=(100, 100, 100))
    draw.text((WIDTH - 160, 80), frame_num, font=small_font, fill=(100, 100, 100))
    draw.text((80, HEIGHT - 120), frame_num, font=small_font, fill=(100, 100, 100))
    draw.text((WIDTH - 160, HEIGHT - 120), frame_num, font=small_font, fill=(100, 100, 100))

    # --- フィルムパーフォレーション風の小四角 ---
    perf_w, perf_h = 28, 52
    perf_margin = 30
    for i in range(8):
        yp = HEIGHT // 2 - 300 + i * 90
        draw.rectangle([perf_margin, yp, perf_margin + perf_w, yp + perf_h], outline=(80, 80, 80), width=2)
        draw.rectangle([WIDTH - perf_margin - perf_w, yp, WIDTH - perf_margin, yp + perf_h], outline=(80, 80, 80), width=2)

    arr = np.array(img)
    arr = add_vignette(arr)
    arr = add_grain(arr)
    return arr


def main():
    import subprocess, tempfile, struct, zlib

    frames_per_count = int(FPS * DURATION_PER_COUNT)

    # フレームをpng連番で書き出してFFmpegで結合
    tmp_dir = os.path.join(OUTPUT_DIR, "temp_frames")
    os.makedirs(tmp_dir, exist_ok=True)

    print(f"フレーム生成中... 合計{TOTAL_FRAMES}フレーム")
    frame_idx = 0
    for count in COUNTS:
        for f in range(frames_per_count):
            arr = draw_frame(count, f, frames_per_count)
            img = Image.fromarray(arr)
            img.save(os.path.join(tmp_dir, f"frame_{frame_idx:05d}.png"))
            frame_idx += 1
            if frame_idx % 30 == 0:
                print(f"  {frame_idx}/{TOTAL_FRAMES} フレーム完了")

    print("FFmpegで動画生成中...")
    cmd = [
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", os.path.join(tmp_dir, "frame_%05d.png"),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "18",
        OUTPUT_PATH
    ]
    subprocess.run(cmd, check=True)

    # 中間ファイル削除
    import shutil
    shutil.rmtree(tmp_dir)
    print(f"\n完成: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
