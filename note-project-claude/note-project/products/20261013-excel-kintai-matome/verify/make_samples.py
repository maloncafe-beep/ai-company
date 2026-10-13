import os, random, openpyxl
from openpyxl.styles import Font

random.seed(7)
base = os.path.join(os.path.dirname(__file__), "kintai")
os.makedirs(base, exist_ok=True)
for f in os.listdir(base):
    os.remove(os.path.join(base, f))

members = ["山田太郎", "佐藤花子", "鈴木一郎", "高橋美咲", "田中健", "伊藤まゆ", "渡辺翔", "中村あかり"]

def make(name, fname, summary_sheet="集計", with_summary=True):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "日別"
    ws.append(["日付", "始業", "終業", "休憩(h)", "実働(h)"])
    total = 0.0
    days = 0
    for d in range(1, 21):
        work = round(random.choice([7.5, 8.0, 8.5, 9.0, 10.0]), 1)
        ws.append([f"2026/09/{d:02d}", "09:00", "18:00", 1.0, work])
        total += work
        days += 1
    if with_summary:
        s = wb.create_sheet(summary_sheet)
        s.append(["氏名", "出勤日数", "総労働時間(h)", "残業時間(h)", "有休取得(日)"])
        s.append([name, days, total, round(max(total - days * 8, 0), 1), random.choice([0, 1, 2])])
        s["A1"].font = Font(bold=True)
    wb.save(os.path.join(base, fname))

for i, m in enumerate(members):
    if m == "高橋美咲":
        make(m, f"勤務簿_{m}.xlsx", with_summary=False)          # 集計シートが無い
    elif m == "渡辺翔":
        make(m, f"勤務簿_{m}.xlsx", summary_sheet="集計 ")        # シート名の末尾に空白
    else:
        make(m, f"勤務簿_{m}.xlsx")

# 一時ファイル（Excelで開いている間にできる）。取り込み対象から外す必要がある
open(os.path.join(base, "~$勤務簿_山田太郎.xlsx"), "wb").write(b"x")
print(sorted(os.listdir(base)))
