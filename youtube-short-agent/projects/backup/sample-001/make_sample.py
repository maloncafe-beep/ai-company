"""
勝海舟 ショート動画 15秒サンプル v3
- 背景：Ken Burnsフロー（パン＋ズーム）
- テキスト：全行積み上げ表示＋ライズエフェクト（フェードイン＋スライドアップ）
- カウントダウン：セピア統一
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, json, subprocess, os, shutil

WIDTH, HEIGHT = 1080, 1920
FPS = 30
ENDING_DURATION = 2.0
COUNTDOWN_SEC   = 3
SAMPLE_BODY_DURATION = 12.0   # カウント除いた本編秒数（サンプル用）
SAMPLE_DURATION = COUNTDOWN_SEC + SAMPLE_BODY_DURATION + ENDING_DURATION
OUTPUT_PATH = "sample_20260822.mp4"
TMP_DIR     = "temp_sample_frames"
BG_PATH     = "bg_ship.png"
AUDIO_PATH  = "勝海舟の言葉01.wav"
SEG_PATH    = "whisper_segments.json"

FONT_TITLE_PATH = "C:/Windows/Fonts/HGRSGU.TTC"   # HG隷書体
FONT_BODY_PATH  = "C:/Windows/Fonts/HGRME.TTC"   # HG明朝E（超太字）
FONT_FALLBACK   = "C:/Windows/Fonts/msmincho.ttc"
TITLE_SIZE = 52
BODY_SIZE  = 68

RISE_DURATION = 0.6   # ライズアニメーション秒数
# YouTube Shorts セーフゾーン（UIボタンとかぶらない余白）
SAFE_TOP    = 200   # 上部余白（タイトル・時間表示エリア回避）
SAFE_BOTTOM = 300   # 下部余白（いいね・コメント・チャンネル登録ボタン回避）

TEXT_PAD_X    = 60
TEXT_PAD_Y    = SAFE_TOP + 20
LINE_GAP      = 22

# ===== ユーティリティ =====

def load_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.truetype(FONT_FALLBACK, size)

def add_film_noise(arr, intensity=10):
    noise = np.random.randint(-intensity, intensity, arr.shape, dtype=np.int16)
    if np.random.random() < 0.08:
        x = np.random.randint(0, WIDTH)
        noise[:, x, :] += np.random.randint(25, 55)
    return np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8)

# ===== 背景：Ken Burns（フロー効果） =====

def prepare_bg_large():
    """背景をセピア化して大きめに用意（Ken Burns用）"""
    img = Image.open(BG_PATH).convert("RGB")
    w, h = img.size
    # Ken Burns用に少し大きめ（120%）
    scale = max(WIDTH / w, HEIGHT / h) * 1.20
    nw, nh = int(w * scale), int(h * scale)
    img = img.resize((nw, nh), Image.LANCZOS)

    # セピア
    arr = np.array(img).astype(float)
    r = arr[:,:,0]*0.393 + arr[:,:,1]*0.769 + arr[:,:,2]*0.189
    g = arr[:,:,0]*0.349 + arr[:,:,1]*0.686 + arr[:,:,2]*0.168
    b = arr[:,:,0]*0.272 + arr[:,:,1]*0.534 + arr[:,:,2]*0.131
    sepia = np.clip(np.stack([r,g,b],axis=2)*0.82, 0, 255).astype(np.uint8)
    return Image.fromarray(sepia), nw, nh

def get_bg_frame(bg_large, nw, nh, t, total_t):
    """Ken Burns: 左上→右下へゆっくりパン＋ズームイン"""
    progress = t / max(total_t, 1)
    # ズーム：1.0x → 1.08x
    zoom = 1.0 + 0.08 * progress
    fw = int(WIDTH  / zoom)
    fh = int(HEIGHT / zoom)
    # パン：(0,0) → (右,下) 方向へ
    max_ox = nw - WIDTH
    max_oy = nh - HEIGHT
    ox = int(max_ox * 0.3 * progress)
    oy = int(max_oy * 0.2 * progress)
    ox = max(0, min(ox, max_ox))
    oy = max(0, min(oy, max_oy))
    # クロップ＆リサイズ
    crop_left = ox + (nw - fw) // 2 - (nw - fw) // 2
    crop_top  = oy + (nh - fh) // 2 - (nh - fh) // 2
    crop_left = max(0, min(crop_left, nw - fw))
    crop_top  = max(0, min(crop_top,  nh - fh))
    cropped = bg_large.crop((crop_left, crop_top, crop_left+fw, crop_top+fh))
    frame   = cropped.resize((WIDTH, HEIGHT), Image.LANCZOS)

    # ビネット
    arr = np.array(frame).astype(float)
    cx, cy = WIDTH/2, HEIGHT/2
    Y, X = np.ogrid[:HEIGHT, :WIDTH]
    dist = np.sqrt(((X-cx)/cx)**2 + ((Y-cy)/cy)**2)
    vig = np.clip(1.0 - dist * 0.50, 0, 1)
    arr = (arr * vig[:,:,np.newaxis]).astype(np.uint8)

    # 古紙フレーム
    img_out = Image.fromarray(arr)
    fov = Image.new("RGBA", (WIDTH, HEIGHT), (0,0,0,0))
    fd  = ImageDraw.Draw(fov)
    brd = 44
    for i in range(brd):
        a = int(180 * (1 - i/brd)**1.5)
        fd.rectangle([i, i, WIDTH-1-i, HEIGHT-1-i], outline=(15,8,3,a))
    img_out = Image.alpha_composite(img_out.convert("RGBA"), fov).convert("RGB")
    return img_out

# ===== テキスト：ライズエフェクト =====

def wrap_text(text, font, max_w):
    """テキストを最大幅で折り返し、行リストを返す"""
    dummy_img  = Image.new("RGB",(1,1))
    dummy_draw = ImageDraw.Draw(dummy_img)
    lines = []
    for para in text.split('\n'):
        line = ""
        for ch in para:
            test = line + ch
            bb = dummy_draw.textbbox((0,0), test, font=font)
            if bb[2]-bb[0] > max_w and line:
                lines.append(line)
                line = ch
            else:
                line = test
        if line:
            lines.append(line)
    return lines

def draw_text_shadow(draw, text, x, y, font,
                     color=(255,255,210), shadow=(0,0,0), sh_off=5):
    for ox,oy in [(-sh_off,sh_off),(sh_off,sh_off),(0,sh_off*2),
                  (sh_off,0),(-sh_off,0),(0,0)]:
        draw.text((x+ox,y+oy), text, font=font, fill=shadow)
    draw.text((x,y), text, font=font, fill=color)

def composite_text_frame(bg_img, segments, audio_time,
                         font_title, font_body):
    """
    積み上げ表示 + ライズエフェクト。
    過去セグメントは少し薄く表示、現在のセグメントはライズアニメーション付き。
    """
    # 表示すべきセグメント（現時刻までに始まったもの）
    visible = [s for s in segments if s['start'] <= audio_time]
    if not visible:
        return bg_img.copy()

    # 全行を収集（どのセグメントの行か、いつ始まったかも記録）
    max_w = WIDTH - TEXT_PAD_X * 2
    all_lines = []  # (text, start_time)
    for seg in visible:
        lines = wrap_text(seg['text'], font_body, max_w)
        for ln in lines:
            all_lines.append((ln, seg['start']))

    # 行の高さ
    dummy = Image.new("RGB",(1,1))
    dd = ImageDraw.Draw(dummy)
    bb = dd.textbbox((0,0), "あ", font=font_body)
    line_h = bb[3] - bb[1] + LINE_GAP

    # タイトルエリア確保
    title_h = 100

    # 画面に収まる行数
    available_h = HEIGHT - TEXT_PAD_Y - title_h - SAFE_BOTTOM
    max_lines   = int(available_h / line_h)

    # 超過分は上からスクロールアウト（最新行を下部に表示）
    display_lines = all_lines[-max_lines:] if len(all_lines) > max_lines else all_lines

    # ベース画像にタイトル描画
    img  = bg_img.copy().convert("RGBA")
    draw = ImageDraw.Draw(img)

    title_text = "勝海舟の言葉"
    tb = draw.textbbox((0,0), title_text, font=font_title)
    tw = tb[2]-tb[0]
    draw_text_shadow(draw, title_text, (WIDTH-tw)//2, 70, font_title,
                     color=(255,245,200), sh_off=3)

    # 各行を描画
    base_y = TEXT_PAD_Y + title_h
    for idx, (line_text, seg_start) in enumerate(display_lines):
        target_y = base_y + idx * line_h

        # ライズアニメーション
        elapsed = audio_time - seg_start
        rise_prog = min(elapsed / RISE_DURATION, 1.0)
        rise_prog = 1 - (1 - rise_prog)**3   # ease-out cubic

        rise_offset = int((1 - rise_prog) * 60)  # 60px下から上へ
        alpha_val   = int(rise_prog * 255)

        draw_y = target_y + rise_offset

        # 過去のセグメント（現在より古い）は少し薄く
        is_current = (seg_start == visible[-1]['start'])
        text_color = (255,255,210,alpha_val) if is_current else (200,190,160,alpha_val)

        # シャドウ付きテキストをRGBAで合成
        # シャドウ
        sh = 5
        for ox,oy in [(-sh,sh),(sh,sh),(0,sh*2),(sh,0),(-sh,0)]:
            draw.text((TEXT_PAD_X+ox, draw_y+oy), line_text,
                      font=font_body, fill=(0,0,0,alpha_val))
        draw.text((TEXT_PAD_X, draw_y), line_text,
                  font=font_body, fill=text_color)

    return img.convert("RGB")

# ===== エンディングカード =====

ENDING_TEXT_1 = "チャンネル登録と"
ENDING_TEXT_2 = "高評価をお願いします"
ENDING_DURATION = 2.0   # 秒

def draw_ending_frame(bg_img, progress):
    """エンディングカード：フェードイン＋中央テキスト"""
    img  = bg_img.copy().convert("RGBA")
    draw = ImageDraw.Draw(img)

    alpha = int(min(progress / 0.4, 1.0) * 255)  # 0.4秒でフェードイン

    font = load_font(FONT_BODY_PATH, 72)

    for line_idx, text in enumerate([ENDING_TEXT_1, ENDING_TEXT_2]):
        bb = draw.textbbox((0,0), text, font=font)
        tw = bb[2]-bb[0]; th = bb[3]-bb[1]
        cx = (WIDTH - tw) // 2
        cy = HEIGHT//2 - th + line_idx * (th + 28)
        sh = 6
        for ox,oy in [(-sh,sh),(sh,sh),(0,sh*2),(sh,0),(-sh,0)]:
            draw.text((cx+ox,cy+oy), text, font=font, fill=(0,0,0,alpha))
        draw.text((cx,cy), text, font=font, fill=(255,245,200,alpha))

    # 下部に小さいアイコン示唆テキスト
    icon_font = load_font(FONT_TITLE_PATH, 36)
    hint = "▼  ♡  ↗"
    hb = draw.textbbox((0,0), hint, font=icon_font)
    hw = hb[2]-hb[0]
    draw.text(((WIDTH-hw)//2, HEIGHT//2 + 120), hint,
              font=icon_font, fill=(220,200,150,alpha))

    arr = np.array(img.convert("RGB"))
    arr = add_film_noise(arr, intensity=8)
    return arr

# ===== カウントダウンフレーム =====

def draw_countdown_frame(count, progress):
    arr = np.full((HEIGHT, WIDTH, 3), (28,18,8), dtype=np.uint8)
    for y in range(0, HEIGHT, 4):
        arr[y,:] = np.clip(np.array([28,18,8])-8, 0, 255)
    img  = Image.fromarray(arr)
    draw = ImageDraw.Draw(img)
    cx, cy = WIDTH//2, HEIGHT//2

    r_o = 320; r_i = 265
    sc  = (160,120,70); sd = (90,65,30)
    draw.ellipse([cx-r_o,cy-r_o,cx+r_o,cy+r_o], outline=sc, width=5)
    draw.ellipse([cx-r_i,cy-r_i,cx+r_i,cy+r_i], outline=sd, width=2)

    angle = progress*360-90
    rad   = math.radians(angle)
    lx = cx+(r_o-12)*math.cos(rad); ly = cy+(r_o-12)*math.sin(rad)
    draw.line([(cx,cy),(lx,ly)], fill=sc, width=5)
    draw.line([(cx-r_o-50,cy),(cx+r_o+50,cy)], fill=sd, width=2)
    draw.line([(cx,cy-r_o-50),(cx,cy+r_o+50)], fill=sd, width=2)

    font = load_font(FONT_BODY_PATH, 280)
    text = str(count)
    bb   = draw.textbbox((0,0), text, font=font)
    tw,th = bb[2]-bb[0], bb[3]-bb[1]
    tx = cx-tw//2-bb[0]; ty = cy-th//2-bb[1]
    for ox,oy in [(-5,5),(5,5),(0,8)]:
        draw.text((tx+ox,ty+oy), text, font=font, fill=(0,0,0))
    draw.text((tx,ty), text, font=font, fill=(210,175,110))

    for i in range(9):
        yp = cy-350+i*88
        draw.rectangle([28,yp,52,yp+48], outline=(70,50,25), width=2)
        draw.rectangle([WIDTH-52,yp,WIDTH-28,yp+48], outline=(70,50,25), width=2)

    arr = np.array(img)
    arr = add_film_noise(arr, intensity=30)
    return arr

# ===== メイン =====

def main():
    print("背景準備中...")
    bg_large, nw, nh = prepare_bg_large()

    with open(SEG_PATH, encoding='utf-8') as f:
        all_segs = json.load(f)
    body_dur = SAMPLE_DURATION - COUNTDOWN_SEC
    segments = [s for s in all_segs if s['start'] < body_dur]
    print(f"使用セグメント: {len(segments)}個")
    for s in segments:
        print(f"  {s['start']:.1f}-{s['end']:.1f}: {s['text']}")

    font_title = load_font(FONT_TITLE_PATH, TITLE_SIZE)
    font_body  = load_font(FONT_BODY_PATH,  BODY_SIZE)

    os.makedirs(TMP_DIR, exist_ok=True)
    total_frames     = int(FPS * SAMPLE_DURATION)
    countdown_frames = int(FPS * COUNTDOWN_SEC)
    body_frames      = int(FPS * SAMPLE_BODY_DURATION)
    ending_frames    = int(FPS * ENDING_DURATION)
    body_total_sec   = SAMPLE_BODY_DURATION

    print(f"フレーム生成中... 合計{total_frames}フレーム")
    for i in range(total_frames):
        if i < countdown_frames:
            count_num = COUNTDOWN_SEC - (i // FPS)
            progress  = (i % FPS) / FPS
            arr = draw_countdown_frame(count_num, progress)
        elif i < countdown_frames + body_frames:
            t_body   = (i - countdown_frames) / FPS
            bg_frame = get_bg_frame(bg_large, nw, nh, t_body, body_total_sec)
            composed = composite_text_frame(bg_frame, segments, t_body,
                                            font_title, font_body)
            arr = add_film_noise(np.array(composed), intensity=8)
        else:
            # エンディングカード
            t_end    = (i - countdown_frames - body_frames) / FPS
            progress = t_end / ENDING_DURATION
            bg_frame = get_bg_frame(bg_large, nw, nh, body_total_sec, body_total_sec)
            arr      = draw_ending_frame(bg_frame, progress)

        Image.fromarray(arr).save(os.path.join(TMP_DIR, f"frame_{i:05d}.png"))
        if (i+1) % 30 == 0:
            print(f"  {i+1}/{total_frames}")

    tmp_audio = "temp_sample_audio.wav"
    subprocess.run([
        "ffmpeg","-y","-i",AUDIO_PATH,
        "-ss","0","-t",str(SAMPLE_DURATION-COUNTDOWN_SEC),
        "-af",f"adelay={COUNTDOWN_SEC*1000}|{COUNTDOWN_SEC*1000},apad=whole_dur={SAMPLE_DURATION}",
        tmp_audio
    ], check=True, capture_output=True)

    print("FFmpegで動画生成中...")
    subprocess.run([
        "ffmpeg","-y",
        "-framerate",str(FPS),
        "-i",os.path.join(TMP_DIR,"frame_%05d.png"),
        "-i",tmp_audio,
        "-c:v","libx264","-c:a","aac",
        "-pix_fmt","yuv420p","-crf","20","-shortest",
        OUTPUT_PATH
    ], check=True, capture_output=True)

    shutil.rmtree(TMP_DIR)
    os.remove(tmp_audio)
    print(f"\n完成: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
