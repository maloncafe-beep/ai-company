import datetime
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from moviepy import VideoFileClip, ImageClip, CompositeVideoClip, concatenate_videoclips

INPUT_FILE = "20260913_Yoshino.mp4"
TODAY = datetime.date.today().strftime("%Y%m%d")
OUTPUT_FILE = f"20260913_Yoshino_reel_{TODAY}.mp4"
FONT_PATH = r"C:\Windows\Fonts\NotoSansJP-VF.ttf"

FONT_SIZE = 60          # 縦動画
OUTLINE_WIDTH = 6       # 縦動画
TEXT_COLOR = (255, 255, 255, 255)
OUTLINE_COLOR = (0, 0, 0, 255)
TELOP_Y_RATIO = 0.85    # 画面下から15%

# (元動画の開始, 終了, キャプション, ロール種別)
SEGMENTS = [
    (0.0, 2.2, "蔵王堂への石段", "A"),
    (5.0, 7.2, "世界遺産 金峯山寺", "A"),
    (10.0, 12.0, "国宝 蔵王堂", "B"),
    (12.0, 14.2, "出迎えてくれた狛グマ", "B"),
    (17.0, 19.5, "吉野山ロープウェイ", "A"),
    (22.0, 24.2, "クマの郵便ポスト", "B"),
    (27.0, 29.5, "老舗の甘味処 芳魂庵", "A"),
    (32.0, 34.2, "名物くずきり", "B"),
    (37.0, 39.5, "日帰り温泉 吉野の湯", "A"),
    (42.0, 47.0, "HAYASHI TOFUで一休み", "B"),
]


def wrap_text(text, font, max_width):
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


def create_text_image(text, video_width):
    font = ImageFont.truetype(FONT_PATH, FONT_SIZE)
    dummy = Image.new("RGBA", (1, 1))
    draw = ImageDraw.Draw(dummy)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]

    max_width = int(video_width * 0.9)
    lines = wrap_text(text, font, max_width) if text_w > max_width else [text]

    line_bboxes = [draw.textbbox((0, 0), line, font=font) for line in lines]
    line_widths = [bb[2] - bb[0] for bb in line_bboxes]
    line_full_heights = [bb[3] - min(bb[1], 0) for bb in line_bboxes]

    line_spacing = 8
    total_h = sum(line_full_heights) + (len(lines) - 1) * line_spacing
    max_w = max(line_widths) if line_widths else 0

    pad_x, pad_y = 20, 12
    img_w = max_w + OUTLINE_WIDTH * 2 + pad_x * 2
    img_h = total_h + OUTLINE_WIDTH * 2 + pad_y * 2
    img = Image.new("RGBA", (img_w, img_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([(0, 0), (img_w - 1, img_h - 1)], radius=16, fill=(0, 0, 0, 140))

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


def main():
    src = VideoFileClip(INPUT_FILE)
    w, h = src.size
    print(f"解像度: {w}x{h}, 長さ: {src.duration:.1f}秒")

    subclips = []
    running_t = 0.0
    caption_times = []  # (start, end, text)

    for start, end, text, roll in SEGMENTS:
        sc = src.subclipped(start, end)
        dur = end - start
        subclips.append(sc)
        caption_times.append((running_t, running_t + dur, text))
        print(f"[{roll}ロール] {start:.1f}-{end:.1f}s → {text}")
        running_t += dur

    print("結合中...")
    concat = concatenate_videoclips(subclips, method="compose")

    print("テロップ生成中...")
    clips = [concat]
    for cstart, cend, text in caption_times:
        text_img = create_text_image(text, w)
        telop_y = int(h * TELOP_Y_RATIO) - text_img.shape[0] // 2
        txt_clip = (
            ImageClip(text_img, transparent=True)
            .with_start(cstart)
            .with_end(cend)
            .with_position(("center", telop_y))
        )
        clips.append(txt_clip)

    final = CompositeVideoClip(clips, size=(w, h))
    final.write_videofile(
        OUTPUT_FILE,
        codec="libx264",
        audio_codec="aac",
        fps=src.fps,
        threads=4,
        preset="medium",
        bitrate="8000k",
    )

    src.close()
    final.close()
    print(f"\n完成: {OUTPUT_FILE} (長さ: {running_t:.1f}秒)")


if __name__ == "__main__":
    main()
