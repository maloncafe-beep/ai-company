import re
import os
import datetime
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from moviepy import VideoFileClip, ImageClip, CompositeVideoClip

# === 設定 ===
INPUT_FILE = "2222.mp4"
CONVERTED_FILE = "temp_input.mp4"
SRT_FILE = "2222.srt"
TODAY = datetime.date.today().strftime("%Y%m%d")
OUTPUT_FILE = f"2222_{TODAY}.mp4"
FONT_PATH = r"C:\Windows\Fonts\NotoSansJP-VF.ttf"

OUTLINE_WIDTH = 6  # 縦動画用（横動画は4）
TEXT_COLOR = (255, 255, 255, 255)
OUTLINE_COLOR = (0, 0, 0, 255)


def parse_srt(srt_path):
    """SRTファイルをパースしてセグメントリストを返す"""
    with open(srt_path, "r", encoding="utf-8") as f:
        content = f.read()

    segments = []
    blocks = re.split(r"\n\n+", content.strip())
    for block in blocks:
        lines = block.strip().split("\n")
        if len(lines) < 3:
            continue
        time_match = re.match(
            r"(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})",
            lines[1],
        )
        if not time_match:
            continue
        g = time_match.groups()
        start = int(g[0]) * 3600 + int(g[1]) * 60 + int(g[2]) + int(g[3]) / 1000
        end = int(g[4]) * 3600 + int(g[5]) * 60 + int(g[6]) + int(g[7]) / 1000
        text = " ".join(lines[2:]).strip()
        if text:
            segments.append({"start": start, "end": end, "text": text})

    return segments


def create_text_image(text, video_width, video_height, font_size):
    """Pillowでテロップ画像を生成（白文字・黒縁取り）"""
    font = ImageFont.truetype(FONT_PATH, font_size)

    dummy = Image.new("RGBA", (1, 1))
    draw = ImageDraw.Draw(dummy)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]

    max_width = int(video_width * 0.9)
    if text_w > max_width:
        lines = wrap_text(text, font, max_width)
    else:
        lines = [text]

    line_bboxes = []
    for line in lines:
        bb = draw.textbbox((0, 0), line, font=font)
        line_bboxes.append(bb)

    # bb = (x0, y0, x1, y1) — y0 can be negative due to font ascent
    line_widths = [bb[2] - bb[0] for bb in line_bboxes]
    line_heights = [bb[3] - bb[1] for bb in line_bboxes]
    # Use full glyph height including descenders
    line_full_heights = [bb[3] - min(bb[1], 0) for bb in line_bboxes]

    line_spacing = 8
    total_h = sum(line_full_heights) + (len(lines) - 1) * line_spacing
    max_w = max(line_widths) if line_widths else 0

    pad_x = 20
    pad_y = 12
    img_w = max_w + OUTLINE_WIDTH * 2 + pad_x * 2
    img_h = total_h + OUTLINE_WIDTH * 2 + pad_y * 2
    img = Image.new("RGBA", (img_w, img_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 半透明黒背景ボックス（角丸16px）
    draw.rounded_rectangle(
        [(0, 0), (img_w - 1, img_h - 1)],
        radius=16,
        fill=(0, 0, 0, 140),
    )

    y_offset = pad_y + OUTLINE_WIDTH
    for idx, line in enumerate(lines):
        bb = line_bboxes[idx]
        lw = bb[2] - bb[0]
        x = (img_w - lw) // 2 - bb[0]
        y_draw = y_offset - min(bb[1], 0)

        for dx in range(-OUTLINE_WIDTH, OUTLINE_WIDTH + 1):
            for dy in range(-OUTLINE_WIDTH, OUTLINE_WIDTH + 1):
                if dx * dx + dy * dy <= OUTLINE_WIDTH * OUTLINE_WIDTH:
                    draw.text((x + dx, y_draw + dy), line, font=font, fill=OUTLINE_COLOR)
        draw.text((x, y_draw), line, font=font, fill=TEXT_COLOR)
        y_offset += line_full_heights[idx] + line_spacing

    return np.array(img)


def wrap_text(text, font, max_width):
    """テキストを最大幅で折り返し"""
    dummy = Image.new("RGBA", (1, 1))
    draw = ImageDraw.Draw(dummy)
    lines = []
    current = ""
    for char in text:
        test = current + char
        bb = draw.textbbox((0, 0), test, font=font)
        if bb[2] - bb[0] > max_width and current:
            lines.append(current)
            current = char
        else:
            current = test
    if current:
        lines.append(current)
    return lines


def convert_input(input_path, output_path):
    """MOVなどmovipyで読めない形式をMP4に変換"""
    import subprocess
    print(f"入力動画を変換中: {input_path} → {output_path}")
    subprocess.run([
        "ffmpeg", "-y", "-i", input_path,
        "-c:v", "libx264", "-crf", "18", "-preset", "fast",
        "-c:a", "aac", "-b:a", "192k", output_path,
    ], check=True, capture_output=True)


def main():
    print(f"入力: {INPUT_FILE}")
    print(f"出力: {OUTPUT_FILE}")

    # MOVファイルはmovipyで直接読めないことがあるので変換
    convert_input(INPUT_FILE, CONVERTED_FILE)

    video = VideoFileClip(CONVERTED_FILE)
    w, h = video.size
    print(f"解像度: {w}x{h}, 長さ: {video.duration:.1f}秒")

    # 縦横判定でフォントサイズ・縁取り幅決定
    global OUTLINE_WIDTH
    if h > w:
        font_size = 60
        OUTLINE_WIDTH = 6
        telop_y_ratio = 0.85  # 画面下から15%
        print("縦動画 → フォントサイズ: 60px, 縁取り: 6px, 位置: 下15%")
    else:
        font_size = 45
        OUTLINE_WIDTH = 4
        telop_y_ratio = 0.88  # 画面下から12%
        print("横動画 → フォントサイズ: 45px, 縁取り: 4px, 位置: 下12%")

    # SRTからセグメント読み込み
    segments = parse_srt(SRT_FILE)
    print(f"セグメント数: {len(segments)}")

    # テロップクリップ生成
    print("テロップ画像を生成中...")
    clips = [video]

    for i, seg in enumerate(segments):
        text_img = create_text_image(seg["text"], w, h, font_size)
        telop_y = int(h * telop_y_ratio) - text_img.shape[0] // 2
        txt_clip = (
            ImageClip(text_img, transparent=True)
            .with_start(seg["start"])
            .with_end(seg["end"])
            .with_position(("center", telop_y))
        )
        clips.append(txt_clip)

    print(f"合成中... ({len(clips)-1} テロップ)")
    final = CompositeVideoClip(clips, size=(w, h))
    final.write_videofile(
        OUTPUT_FILE,
        codec="libx264",
        audio_codec="aac",
        fps=video.fps,
        threads=4,
        preset="medium",
        bitrate="8000k",
    )

    video.close()
    final.close()

    # 中間ファイル削除
    for tmp in [SRT_FILE, CONVERTED_FILE]:
        if os.path.exists(tmp):
            os.remove(tmp)
            print(f"中間ファイル削除: {tmp}")

    print(f"\n完成: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
