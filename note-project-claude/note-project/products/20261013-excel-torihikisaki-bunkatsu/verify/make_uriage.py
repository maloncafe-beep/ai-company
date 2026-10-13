import random
import openpyxl

random.seed(11)
customers = [
    "青山商事", "大和物産", "北斗エンジニアリング", "ミライ食品", "桜井工業",
    "丸三運輸", "東西/建設", "第一電機?", "グリーンファーム", "SHINEI商会",
    "太陽堂", "あおぞら薬局",
]
items = ["部品A", "部品B", "資材C", "消耗品D", "サービスE"]

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "売上"
ws.append(["日付", "取引先", "品名", "数量", "金額"])
rows = []
for c in customers:
    for _ in range(random.randint(18, 30)):
        d = random.randint(1, 30)
        q = random.randint(1, 50)
        rows.append([f"2026/09/{d:02d}", c, random.choice(items), q, q * random.choice([480, 1200, 3300, 5800])])
# 末尾に空白が付いた同じ取引先（別の取引先に見えてしまう例）
for _ in range(3):
    q = random.randint(1, 20)
    rows.append(["2026/09/15", "青山商事 ", "部品A", q, q * 480])
# 取引先が空欄の行
for _ in range(2):
    q = random.randint(1, 20)
    rows.append(["2026/09/20", None, "資材C", q, q * 1200])
random.shuffle(rows)
for r in rows:
    ws.append(r)
wb.save("売上一覧_2026-09.xlsx")
print(len(rows), "rows,", "total", sum(r[4] for r in rows))
