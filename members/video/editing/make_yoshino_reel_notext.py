import datetime
from moviepy import VideoFileClip, concatenate_videoclips

INPUT_FILE = "20260913_Yoshino.mp4"
TODAY = datetime.date.today().strftime("%Y%m%d")
OUTPUT_FILE = f"20260913_Yoshino_reel_notext_{TODAY}.mp4"

# (元動画の開始, 終了, ロール種別) — make_yoshino_reel.py と同じコマ割り
SEGMENTS = [
    (0.0, 2.2, "A"),
    (5.0, 7.2, "A"),
    (10.0, 12.0, "B"),
    (12.0, 14.2, "B"),
    (17.0, 19.5, "A"),
    (22.0, 24.2, "B"),
    (27.0, 29.5, "A"),
    (32.0, 34.2, "B"),
    (37.0, 39.5, "A"),
    (42.0, 47.0, "B"),
]


def main():
    src = VideoFileClip(INPUT_FILE)
    w, h = src.size
    print(f"解像度: {w}x{h}, 長さ: {src.duration:.1f}秒")

    subclips = []
    running_t = 0.0
    for start, end, roll in SEGMENTS:
        subclips.append(src.subclipped(start, end))
        print(f"[{roll}ロール] {start:.1f}-{end:.1f}s")
        running_t += end - start

    print("結合中...")
    final = concatenate_videoclips(subclips, method="compose")
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
    print(f"\n完成: {OUTPUT_FILE} (長さ: {running_t:.1f}秒・テキストなし)")


if __name__ == "__main__":
    main()
