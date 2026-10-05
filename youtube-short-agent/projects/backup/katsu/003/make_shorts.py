"""
勝海舟の言葉 katsu-003 動画生成
ページ切り替え方式：段落ごとに画面クリア＋ライズエフェクト
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont
import math, json, subprocess, os, shutil
from datetime import date

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
AUDIO_PATH  = os.path.join(PROJECT_DIR, "assets/003katsukaisyu.wav")
BG_PATH     = os.path.join(PROJECT_DIR, "assets/bg.png")
SEG_PATH    = os.path.join(PROJECT_DIR, "work/whisper_segments.json")
SCRIPT_PATH = os.path.join(PROJECT_DIR, "inbox/script.txt")
OUTPUT_PATH = os.path.join(PROJECT_DIR, f"output/katsu-003_{date.today().strftime('%Y%m%d')}.mp4")
TMP_DIR     = os.path.join(PROJECT_DIR, "work/temp_frames")

WIDTH, HEIGHT = 1080, 1920
FPS           = 30
COUNTDOWN_SEC = 3

SAFE_TOP    = 180
SAFE_BOTTOM = 280

FONT_TITLE_PATH = "C:/Windows/Fonts/HGRSGU.TTC"
FONT_BODY_PATH  = "C:/Windows/Fonts/HGRME.TTC"
FONT_FALLBACK   = "C:/Windows/Fonts/msmincho.ttc"
TITLE_SIZE = 52
BODY_SIZE  = 76

TEXT_PAD_X    = 60
RISE_DURATION = 0.5

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

# ===== 台本をページ（段落）に分割してセグメントと対応付け =====

def build_page_segments(segments):
    script = open(SCRIPT_PATH, encoding='utf-8').read()
    body   = script.split('【台本】')[1].strip()

    page_line_groups = []
    for para in body.split('\n\n'):
        lines = [l.strip() for l in para.strip().split('\n') if l.strip()]
        if lines:
            page_line_groups.append(lines)

    page_segs = []
    seg_idx   = 0
    for page_lines in page_line_groups:
        page_data = []
        for line in page_lines:
            if seg_idx < len(segments):
                s = segments[seg_idx]
                page_data.append((line, float(s['start']), float(s['end'])))
                seg_idx += 1
        if page_data:
            page_segs.append({
                'page_start': page_data[0][1],
                'page_end':   page_data[-1][2],
                'lines':      page_data,
            })

    return page_segs


def find_current_page(page_segs, t):
    for i, p in enumerate(page_segs):
        is_last = (i == len(page_segs) - 1)
        if is_last:
            if p['page_start'] <= t:
                return p
        else:
            if p['page_start'] <= t < page_segs[i + 1]['page_start']:
                return p
    return None

# ===== 背景：Ken Burns =====

def prepare_bg_large():
    img = Image.open(BG_PATH).convert("RGB")
    w, h = img.size
    scale = max(WIDTH / w, HEIGHT / h) * 1.20
    nw, nh = int(w * scale), int(h * scale)
    img = img.resize((nw, nh), Image.LANCZOS)
    arr = np.array(img).astype(float)
    r = arr[:,:,0]*0.393 + arr[:,:,1]*0.769 + arr[:,:,2]*0.189
    g = arr[:,:,0]*0.349 + arr[:,:,1]*0.686 + arr[:,:,2]*0.168
    b = arr[:,:,0]*0.272 + arr[:,:,1]*0.534 + arr[:,:,2]*0.131
    sepia = np.clip(np.stack([r,g,b],axis=2)*0.82, 0, 255).astype(np.uint8)
    return Image.fromarray(sepia), nw, nh

def get_bg_frame(bg_large, nw, nh, t, total_t):
    progress = t / max(total_t, 1)
    zoom = 1.0 + 0.08 * progress
    fw = int(WIDTH / zoom); fh = int(HEIGHT / zoom)
    max_ox = nw - WIDTH; max_oy = nh - HEIGHT
    ox = max(0, min(int(max_ox * 0.3 * progress), max_ox))
    oy = max(0, min(int(max_oy * 0.2 * progress), max_oy))
    crop_left = max(0, min(ox, nw - fw))
    crop_top  = max(0, min(oy, nh - fh))
    frame = bg_large.crop((crop_left, crop_top, crop_left+fw, crop_top+fh))
    frame = frame.resize((WIDTH, HEIGHT), Image.LANCZOS)
    arr = np.array(frame).astype(float)
    cx, cy = WIDTH/2, HEIGHT/2
    Y, X = np.ogrid[:HEIGHT, :WIDTH]
    dist = np.sqrt(((X-cx)/cx)**2 + ((Y-cy)/cy)**2)
    vig = np.clip(1.0 - dist*0.50, 0, 1)
    arr = (arr * vig[:,:,np.newaxis]).astype(np.uint8)
    img_out = Image.fromarray(arr)
    fov = Image.new("RGBA", (WIDTH, HEIGHT), (0,0,0,0))
    fd = ImageDraw.Draw(fov)
    for i in range(44):
        a = int(180 * (1 - i/44)**1.5)
        fd.rectangle([i, i, WIDTH-1-i, HEIGHT-1-i], outline=(15,8,3,a))
    return Image.alpha_composite(img_out.convert("RGBA"), fov).convert("RGB")

# ===== テキスト描画 =====

def wrap_text(text, font, max_w):
    dummy = Image.new("RGB",(1,1))
    d = ImageDraw.Draw(dummy)
    lines = []
    line = ""
    for ch in text:
        test = line + ch
        bb = d.textbbox((0,0), test, font=font)
        if bb[2]-bb[0] > max_w and line:
            lines.append(line)
            line = ch
        else:
            line = test
    if line:
        lines.append(line)
    return lines

# ===== ページ描画 =====

def draw_page_frame(bg_img, page, audio_time, font_title, font_body):
    img  = bg_img.copy().convert("RGBA")
    draw = ImageDraw.Draw(img)

    title_text = "勝海舟の言葉"
    tb = draw.textbbox((0,0), title_text, font=font_title)
    tw = tb[2]-tb[0]
    title_alpha = 255
    for ox,oy in [(-3,3),(3,3),(0,6)]:
        draw.text(((WIDTH-tw)//2+ox, 80+oy), title_text, font=font_title, fill=(0,0,0,title_alpha))
    draw.text(((WIDTH-tw)//2, 80), title_text, font=font_title, fill=(255,245,200,title_alpha))

    all_lines = page['lines']
    if not all_lines:
        return img.convert("RGB")

    page_elapsed = audio_time - page['page_start']
    rise_prog = min(page_elapsed / RISE_DURATION, 1.0)
    rise_prog = 1 - (1 - rise_prog) ** 3
    rise_offset = int((1 - rise_prog) * 70)
    alpha_val   = int(rise_prog * 255)

    max_w = WIDTH - TEXT_PAD_X * 2
    dummy = Image.new("RGB",(1,1))
    dd = ImageDraw.Draw(dummy)
    bb = dd.textbbox((0,0), "あ", font=font_body)
    line_h = bb[3]-bb[1] + 28

    wrapped_groups = [wrap_text(lt, font_body, max_w) for (lt, _, _) in all_lines]
    total_display_rows = sum(len(g) for g in wrapped_groups)

    available_h = HEIGHT - SAFE_TOP - 120 - SAFE_BOTTOM
    content_h = total_display_rows * line_h
    start_y = SAFE_TOP + 120 + max(0, (available_h - content_h) // 2)

    BOX_PAD_X, BOX_PAD_Y = 20, 12
    box_x1 = TEXT_PAD_X - BOX_PAD_X
    box_y1 = start_y + rise_offset - BOX_PAD_Y
    box_x2 = WIDTH - TEXT_PAD_X + BOX_PAD_X
    box_y2 = start_y + rise_offset + total_display_rows * line_h + BOX_PAD_Y
    box_alpha = int(alpha_val * 0.65)
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.rounded_rectangle([box_x1, box_y1, box_x2, box_y2],
                         radius=16, fill=(0, 0, 0, box_alpha))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    tb = draw.textbbox((0,0), title_text, font=font_title)
    tw = tb[2]-tb[0]
    for ox,oy in [(-3,3),(3,3),(0,6)]:
        draw.text(((WIDTH-tw)//2+ox, 80+oy), title_text, font=font_title, fill=(0,0,0,255))
    draw.text(((WIDTH-tw)//2, 80), title_text, font=font_title, fill=(255,245,200,255))

    display_row = 0
    for wrapped in wrapped_groups:
        for wline in wrapped:
            draw_y = start_y + display_row * line_h + rise_offset
            draw.text((TEXT_PAD_X, draw_y), wline, font=font_body,
                      fill=(255, 255, 255, alpha_val))
            display_row += 1

    return img.convert("RGB")

# ===== カウントダウン =====

def draw_countdown_frame(count, progress):
    arr = np.full((HEIGHT, WIDTH, 3), (28,18,8), dtype=np.uint8)
    for y in range(0, HEIGHT, 4):
        arr[y,:] = np.clip(np.array([28,18,8])-8, 0, 255)
    img  = Image.fromarray(arr)
    draw = ImageDraw.Draw(img)
    cx, cy = WIDTH//2, HEIGHT//2
    r_o=320; r_i=265; sc=(160,120,70); sd=(90,65,30)
    draw.ellipse([cx-r_o,cy-r_o,cx+r_o,cy+r_o], outline=sc, width=5)
    draw.ellipse([cx-r_i,cy-r_i,cx+r_i,cy+r_i], outline=sd, width=2)
    rad = math.radians(progress*360-90)
    lx = cx+(r_o-12)*math.cos(rad); ly = cy+(r_o-12)*math.sin(rad)
    draw.line([(cx,cy),(lx,ly)], fill=sc, width=5)
    draw.line([(cx-r_o-50,cy),(cx+r_o+50,cy)], fill=sd, width=2)
    draw.line([(cx,cy-r_o-50),(cx,cy+r_o+50)], fill=sd, width=2)
    font = load_font(FONT_BODY_PATH, 280)
    text = str(count)
    bb = draw.textbbox((0,0), text, font=font)
    tw,th = bb[2]-bb[0], bb[3]-bb[1]
    tx = cx-tw//2-bb[0]; ty = cy-th//2-bb[1]
    for ox,oy in [(-5,5),(5,5),(0,8)]:
        draw.text((tx+ox,ty+oy), text, font=font, fill=(0,0,0))
    draw.text((tx,ty), text, font=font, fill=(210,175,110))
    for i in range(9):
        yp = cy-350+i*88
        draw.rectangle([28,yp,52,yp+48], outline=(70,50,25), width=2)
        draw.rectangle([WIDTH-52,yp,WIDTH-28,yp+48], outline=(70,50,25), width=2)
    return add_film_noise(np.array(img), intensity=30)

# ===== メイン =====

def main():
    print("背景・データ準備中...")
    bg_large, nw, nh = prepare_bg_large()

    with open(SEG_PATH, encoding='utf-8') as f:
        segments = json.load(f)
    audio_duration = segments[-1]['end']
    total_duration = COUNTDOWN_SEC + audio_duration

    page_segs = build_page_segments(segments)

    print(f"音声: {audio_duration:.1f}秒 / 合計: {total_duration:.1f}秒 / ページ数: {len(page_segs)}")
    for i, p in enumerate(page_segs):
        print(f"  Page{i+1} {p['page_start']:.1f}-{p['page_end']:.1f}: {[l[0][:15]+'...' for l in p['lines']]}")

    font_title = load_font(FONT_TITLE_PATH, TITLE_SIZE)
    font_body  = load_font(FONT_BODY_PATH,  BODY_SIZE)

    os.makedirs(TMP_DIR, exist_ok=True)
    total_frames     = int(FPS * total_duration)
    countdown_frames = int(FPS * COUNTDOWN_SEC)

    print(f"フレーム生成中... 合計{total_frames}フレーム")
    for i in range(total_frames):
        if i < countdown_frames:
            count_num = COUNTDOWN_SEC - (i // FPS)
            progress  = (i % FPS) / FPS
            arr = draw_countdown_frame(count_num, progress)
        else:
            t_body   = (i - countdown_frames) / FPS
            bg_frame = get_bg_frame(bg_large, nw, nh, t_body, audio_duration)

            current_page = find_current_page(page_segs, t_body)
            if current_page:
                composed = draw_page_frame(bg_frame, current_page, t_body, font_title, font_body)
            else:
                composed = bg_frame
            arr = add_film_noise(np.array(composed), intensity=8)

        Image.fromarray(arr).save(os.path.join(TMP_DIR, f"frame_{i:05d}.png"))
        if (i+1) % 300 == 0:
            print(f"  {i+1}/{total_frames} ({(i+1)/total_frames*100:.0f}%)")

    print("FFmpegで動画生成中...")
    tmp_audio = os.path.join(PROJECT_DIR, "work/tmp_audio.wav")
    subprocess.run([
        "ffmpeg","-y","-i", AUDIO_PATH,
        "-af", f"adelay={COUNTDOWN_SEC*1000}|{COUNTDOWN_SEC*1000},apad=whole_dur={total_duration}",
        tmp_audio
    ], check=True, capture_output=True)

    subprocess.run([
        "ffmpeg","-y",
        "-framerate", str(FPS),
        "-i", os.path.join(TMP_DIR, "frame_%05d.png"),
        "-i", tmp_audio,
        "-c:v","libx264","-c:a","aac",
        "-pix_fmt","yuv420p","-crf","18","-shortest",
        OUTPUT_PATH
    ], check=True, capture_output=True)

    shutil.rmtree(TMP_DIR)
    os.remove(tmp_audio)
    print(f"\n完成: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
