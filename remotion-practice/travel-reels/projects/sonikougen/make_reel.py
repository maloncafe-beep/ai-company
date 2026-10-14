import datetime, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from moviepy import VideoFileClip, VideoClip, ImageClip, CompositeVideoClip, concatenate_videoclips

W, H = 1080, 1920
FPS = 30
TODAY = datetime.date.today().strftime("%Y%m%d")
NOTEXT = "--notext" in sys.argv
OUTPUT = f"Instagram_Reel_曽爾高原_{'notext_' if NOTEXT else ''}{TODAY}.mp4"
FONT = r"C:\Windows\Fonts\NotoSansJP-VF.ttf"

# (素材, 秒, テロップ, ズーム方向)  合計30秒
SCENES = [
    ("001.jpg", 2.9, "奈良・曽爾高原\n秋の絶景を歩く", "in"),
    ("002.jpg", 2.9, "秋、高原は\n銀色のススキに染まる", "in"),
    ("003.mp4", 3.9, "風が吹くたび\n波のように揺れる", None),
    ("004.jpg", 2.9, "倶留尊山 標高1,038m\n亀山 標高849m", "out"),
    ("005.jpg", 2.9, "2つの山の西斜面に広がる\n約38ヘクタールの高原", "in"),
    ("006.jpg", 2.9, "春は山焼き\n草原を守る伝統の火", "in"),
    ("007.jpg", 2.9, "焼かれた野に\nススキが育つ", "out"),
    ("008.jpg", 2.9, "「曽爾」の由来は諸説\n古語で赤土を指す「そに」とも", "in"),
    ("009.jpg", 2.9, "山を渡る風\n光る銀の穂", "out"),
    ("010.jpg", 2.9, "また、ススキの頃に", "in"),
]


def cover(img, scale=1.0):
    iw, ih = img.size
    s = max(W / iw, H / ih) * scale
    return img.resize((int(iw * s) + 1, int(ih * s) + 1), Image.LANCZOS)


def photo_clip(path, dur, mode):
    base = cover(Image.open(path).convert("RGB"), 1.15)
    bw, bh = base.size
    def frame(t):
        p = t / dur
        z = 1 - 0.13 * (p if mode == "in" else 1 - p)  # 1.0→0.87 of base
        cw, ch = bw * z * (W / bw) / (W / bw), bh * z
        cw = ch * W / H
        x, y = (bw - cw) / 2, (bh - ch) / 2
        return np.array(base.crop((int(x), int(y), int(x + cw), int(y + ch))).resize((W, H), Image.BILINEAR))
    return VideoClip(frame, duration=dur).with_fps(FPS)


def video_clip(path, dur):
    v = VideoFileClip(path, audio=False).subclipped(0, dur)
    s = max(W / v.w, H / v.h)
    return v.resized(s).cropped(x_center=v.w * s / 2, y_center=v.h * s / 2, width=W, height=H)


def telop(text):
    font = ImageFont.truetype(FONT, 64)
    try:
        font.set_variation_by_name("Bold")
    except Exception:
        pass
    lines = text.split("\n")
    d = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    lh = 64 + 22
    pad = 40
    img = Image.new("RGBA", (W, lh * len(lines) + pad * 2), (0, 0, 0, 0))
    def draw_lines(im, fill, dx=0, dy=0):
        dr = ImageDraw.Draw(im)
        for i, ln in enumerate(lines):
            w = dr.textlength(ln, font=font)
            dr.text(((W - w) / 2 + dx, pad + i * lh + dy), ln, font=font, fill=fill)
    # 影4層（背景ボックスなし）
    for blur, dy, a in [(14, 6, 150), (8, 4, 190), (4, 3, 220), (1, 2, 255)]:
        sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
        draw_lines(sh, (0, 0, 0, a), 0, dy)
        img = Image.alpha_composite(img, sh.filter(ImageFilter.GaussianBlur(blur)))
    fg = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw_lines(fg, (255, 255, 255, 255))
    return np.array(Image.alpha_composite(img, fg))


clips, t0 = [], 0.0
for src, dur, text, mode in SCENES:
    base = video_clip(src, dur) if src.endswith(".mp4") else photo_clip(src, dur, mode)
    img = telop(text)
    y = int(H * 0.80) - img.shape[0] // 2
    tx = ImageClip(img, transparent=True).with_duration(dur).with_position((0, y))
    clips.append(base if NOTEXT else CompositeVideoClip([base, tx], size=(W, H)).with_duration(dur))

final = concatenate_videoclips(clips, method="compose")
final.write_videofile(OUTPUT, codec="libx264", audio=False, fps=FPS, preset="medium", bitrate="8000k", threads=4)
print("完成", OUTPUT, final.duration)
