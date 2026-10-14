import datetime, sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
from moviepy import (VideoFileClip, VideoClip, ImageClip, CompositeVideoClip,
                     concatenate_videoclips, AudioFileClip, vfx, afx)

W, H, FPS = 1080, 1920, 30
SRC = r"C:\Users\yyasu\ai-company\remotion-practice\travel-reels\projects\nuigurumijinja"
TODAY = datetime.date.today().strftime("%Y%m%d")
NOTEXT = "--notext" in sys.argv
OUTPUT = f"Instagram_Reel_ぬいぐるみ神社_{'notext_' if NOTEXT else ''}{TODAY}.mp4"
SANS = r"C:\Windows\Fonts\NotoSansJP-VF.ttf"
SERIF = r"C:\Windows\Fonts\NotoSerifJP-VF.ttf"

# (素材, 秒, テロップ, 動き)  合計111秒  動き: in/out=ズーム, up=下→上スライド, pan=左→右パン, none
S = [
    ("00_01.mp4", 4, "美山かやぶきの里から\nずっと奥へ", "pan"),
    ("00_02.mp4", 4, "山のさらに奥に", "none"),
    ("00_03.jpg", 7, "TITLE", "pan"),
    ("01_01.jpg", 5, "ぬいぐるみ神社が\nできました", "in"),
    ("01_02.jpg", 5, "運営は\n「ぬいぐるみ病院」", "in"),
    ("01_03.jpg", 6, "ぬいぐるみを\n静かに祀る場所", "in"),
    ("02_01.jpg", 5, "まずは手水舎で\n心を整えて", "in"),
    ("02_02.jpg", 4, "木の香りが残る\n新しい社", "up"),
    ("03_01.jpg", 5, "迎えてくれたのは\nフクロウとクマ", "in"),
    ("03_02.jpg", 6, "拝殿にも\nぬいぐるみさんたち", "in"),
    ("04_01.jpg", 5, "約28haの森\n「いのちの森」", "in"),
    ("04_02.mp4", 5, "川の音だけが\n聞こえる", "none"),
    ("05_01.jpg", 5, "クマの窓から\n森が見える", "out"),
    ("05_02.jpg", 5, "窓の向こうにも\nぬいぐるみさん", "in"),
    ("05_03.jpg", 4, "風に揺れる\n小さな灯り", "up"),
    ("06_01.jpg", 5, "社務所には\nやさしい授与品", "in"),
    ("06_02.jpg", 5, "授与は開所日の\n10:00〜15:00", "in"),
    ("07_01.jpg", 5, "願いをのせた\nぬいぐるみの絵馬", "up"),
    ("07_02.jpg", 4, "森のなかで\nひと息", "in"),
    ("08_01.jpg", 6, "帰り道は\nカエルが見送り", "in"),
    ("09_01.mp4", 11, "あらゆるいのちに\nありがとう|ぬいぐるみ神社\n京都府南丹市美山町", "slowpan"),
]


def ease(p):
    return p * p * (3 - 2 * p)


def load(name):
    return ImageOps.exif_transpose(Image.open(os.path.join(SRC, name))).convert("RGB")


def photo_clip(name, dur, mode):
    img = load(name)
    iw, ih = img.size
    if mode == "pan":  # 横写真：高さ基準で拡大し左→右
        base = img.resize((int(iw * H / ih) + 1, H), Image.LANCZOS)
        def frame(t):
            x = int((base.width - W) * ease(t / dur))
            return np.array(base.crop((x, 0, x + W, H)))
        return VideoClip(frame, duration=dur).with_fps(FPS)
    s = max(W / iw, H / ih) * 1.18
    base = img.resize((int(iw * s) + 1, int(ih * s) + 1), Image.LANCZOS)
    bw, bh = base.size
    def frame(t):
        p = t / dur
        if mode == "up":
            ch = H / 1.0; cw = W
            ch = bh / 1.18; cw = ch * W / H
            x = (bw - cw) / 2
            y = (bh - ch) * (1 - ease(p))
        else:
            z = 1 / 1.18 + (1 - 1 / 1.18) * ((1 - p) if mode == "in" else p)  # in: 1.0→0.85
            z = 1 - 0.15 * (p if mode == "in" else 1 - p)
            ch = bh * z; cw = ch * W / H
            x, y = (bw - cw) / 2, (bh - ch) / 2
        return np.array(base.crop((int(x), int(y), int(x + cw), int(y + ch))).resize((W, H), Image.BILINEAR))
    return VideoClip(frame, duration=dur).with_fps(FPS)


def video_clip(name, dur, mode):
    v = VideoFileClip(os.path.join(SRC, name), audio=False)
    sd, speed = v.duration - 0.05, 1.0
    if mode == "slowpan":
        speed = 0.5
    landscape = v.w > v.h
    def frame(t):
        ts = min(t * speed, sd)
        f0 = v.get_frame(ts).astype(np.float32)
        f1 = v.get_frame(min(ts + 1 / v.fps, sd)).astype(np.float32)
        a = (ts * v.fps) % 1
        im = Image.fromarray(((1 - a) * f0 + a * f1).astype(np.uint8))
        if landscape:
            im = im.resize((int(v.w * H / v.h) + 1, H), Image.LANCZOS)
            x = int((im.width - W) * ease(t / dur)) if mode in ("pan", "slowpan") else (im.width - W) // 2
            return np.array(im.crop((x, 0, x + W, H)))
        s = max(W / v.w, H / v.h)
        im = im.resize((int(v.w * s) + 1, int(v.h * s) + 1), Image.LANCZOS)
        x, y = (im.width - W) // 2, (im.height - H) // 2
        return np.array(im.crop((x, y, x + W, y + H)))
    return VideoClip(frame, duration=dur).with_fps(FPS)


def shadowed(size, draw_fn):
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    for blur, dy, a in [(14, 6, 150), (8, 4, 190), (4, 3, 220), (1, 2, 255)]:
        sh = Image.new("RGBA", size, (0, 0, 0, 0))
        draw_fn(ImageDraw.Draw(sh), (0, 0, 0, a), dy)
        img = Image.alpha_composite(img, sh.filter(ImageFilter.GaussianBlur(blur)))
    fg = Image.new("RGBA", size, (0, 0, 0, 0))
    draw_fn(ImageDraw.Draw(fg), (255, 255, 255, 255), 0)
    return Image.alpha_composite(img, fg)


def font(path, size):
    f = ImageFont.truetype(path, size)
    try:
        f.set_variation_by_name("Bold" if path == SANS else "SemiBold")
    except Exception:
        pass
    return f


def telop(text, fpath=SANS, size=64):
    f = font(fpath, size)
    lines = text.split("\n")
    lh, pad = size + 22, 40
    def fn(d, fill, dy):
        for i, ln in enumerate(lines):
            d.text(((W - d.textlength(ln, font=f)) / 2, pad + i * lh + dy), ln, font=f, fill=fill)
    return np.array(shadowed((W, lh * len(lines) + pad * 2), fn))


def title_card():
    f1, f2, f3 = font(SERIF, 112), font(SERIF, 46), font(SERIF, 40)
    def fn(d, fill, dy):
        for txt, f, y in [("ぬいぐるみ神社", f1, 40), ("Nuigurumi Jinja", f2, 190), ("京都府南丹市美山町", f3, 270)]:
            d.text(((W - d.textlength(txt, font=f)) / 2, y + dy), txt, font=f, fill=fill)
    return np.array(shadowed((W, 380), fn))


def overlay(base, arr, dur, y, fade=0.5, start=0):
    c = ImageClip(arr, transparent=True).with_duration(dur - start).with_start(start).with_position((0, y))
    return c.with_effects([vfx.CrossFadeIn(fade), vfx.CrossFadeOut(fade)])


clips = []
for src, dur, text, mode in S:
    base = video_clip(src, dur, mode) if src.endswith(".mp4") else photo_clip(src, dur, mode)
    layers = [base]
    if not NOTEXT:
        if text == "TITLE":
            arr = title_card(); layers.append(overlay(base, arr, dur, int(H * 0.40), 0.8, 0.6))
        elif "|" in text:
            a, b = text.split("|")
            layers.append(overlay(base, telop(a), 6, int(H * 0.80) - 110, 0.5))
            arr = telop(b, SANS, 52)
            layers.append(overlay(base, arr, dur, int(H * 0.80) - 110, 0.8, 6))
        else:
            arr = telop(text)
            layers.append(overlay(base, arr, dur, int(H * 0.80) - arr.shape[0] // 2, 0.4, 0.3))
    clips.append(CompositeVideoClip(layers, size=(W, H)).with_duration(dur))

final = concatenate_videoclips(clips, method="compose")
total = final.duration
final = final.with_effects([vfx.FadeOut(3.0)])
bgm = AudioFileClip(os.path.join(SRC, "a calm afterglow.mp3")).subclipped(0, total)
bgm = bgm.with_effects([afx.AudioFadeIn(1.5), afx.AudioFadeOut(4.0)])
final = final.with_audio(bgm)
final.write_videofile(OUTPUT, codec="libx264", audio_codec="aac", fps=FPS, preset="medium", bitrate="8000k", threads=4)
print("完成", OUTPUT, total)
