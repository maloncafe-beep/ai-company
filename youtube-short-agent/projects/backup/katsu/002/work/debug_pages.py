import json, os

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
SEG_PATH    = os.path.join(PROJECT_DIR, "../work/whisper_segments.json")
SCRIPT_PATH = os.path.join(PROJECT_DIR, "../inbox/script.txt")

with open(SEG_PATH, encoding='utf-8') as f:
    segments = json.load(f)

script = open(SCRIPT_PATH, encoding='utf-8').read()
body = script.split('【台本】')[1].strip()
page_line_groups = []
for para in body.split('\n\n'):
    lines = [l.strip() for l in para.strip().split('\n') if l.strip()]
    if lines:
        page_line_groups.append(lines)

page_segs = []
seg_idx = 0
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
            'lines':      page_data
        })

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

test_times = [7.0, 7.4, 7.59, 7.60, 7.61, 9.82, 9.83, 9.84, 17.1, 17.13, 17.15]
for t in test_times:
    p = find_current_page(page_segs, t)
    if p:
        visible = [line for (line, s, e) in p['lines'] if s <= t]
        ps = p['page_start']
        pe = p['page_end']
        print(f"t={t:.2f}: Page[{ps:.2f}-{pe:.2f}] visible={len(visible)}行: {[v[:10] for v in visible]}")
    else:
        print(f"t={t:.2f}: None (画面なし)")
