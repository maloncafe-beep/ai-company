from PIL import Image, ImageDraw, ImageFont
F = "C:/Windows/Fonts/"
# icon: note版を流用（400x400、Xの最小サイズ）
Image.open("icon_src.jpg").convert("RGB").resize((400, 400), Image.LANCZOS).save("icon_400.png")

# header 1500x500
W, H = 1500, 500
im = Image.new("RGB", (W, H), (22, 32, 48))
d = ImageDraw.Draw(im)
for x in range(W):  # 横グラデーション
    t = x / W
    d.line([(x, 0), (x, H)], fill=(int(22 + 20 * t), int(32 + 28 * t), int(48 + 40 * t)))
d.rectangle([0, H - 6, W, H], fill=(214, 168, 90))
f_big = ImageFont.truetype(F + "YuGothB.ttc", 70)
f_mid = ImageFont.truetype(F + "YuGothM.ttc", 34)
f_sm = ImageFont.truetype(F + "YuGothM.ttc", 26)
x0 = 560  # 左下のアイコンと被らない位置
d.text((x0, 120), "AIを、現場の", font=f_big, fill=(255, 255, 255))
d.text((x0, 205), "仕事道具にする。", font=f_big, fill=(214, 168, 90))
d.text((x0, 320), "業務効率化・評価・転職 ─ 25年のIT現場感覚で", font=f_mid, fill=(220, 226, 236))
d.text((x0, 380), "note で実践ガイドを公開中", font=f_sm, fill=(160, 172, 190))
im.save("header_1500x500.png")
