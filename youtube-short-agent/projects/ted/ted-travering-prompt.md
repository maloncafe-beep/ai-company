固定キャラクター定義文（全カット共通・厳密に統一）

9:16 縦構図。全身ショット。ずんぐり小型サイズのぬいぐるみクマ。キャラメル/ハニー色の細かく密にカールした長いふわふわ毛並み。小さな丸い耳、つやのある小さな黒い丸い目（ハイライトの反射あり）、小さな黒い三角の鼻、シンプルな黒い縫い目の口。黒いバーシティ/レターマンジャケット（前面は黒・袖はオフホワイト/生成り色のラグラン）、リブ襟・リブ袖口・リブ裾、上半分開きのシルバージッパー、細い gold-tone のチェーンネックレス＋小さな鍵型ペンダント。胸ワッペン＝右胸に黄色いカタツムリ、左胸に富士山＋緑の小さなカエル＋青い鳥。下半身は迷彩カーゴパンツ（緑・茶・濃トーン）。腰に小さな黒いウエストポーチと90年代風の銀色ガラケー（キャンディバー型）をクリップ。絶対に画像内に文字・ロゴ・看板文字を入れない。Photorealistic plush toy photography / cinematic lighting。

シーン別 完成プロンプト（5カット）
シーン① 金剛峯寺・山門前の石段（朝霧）
上記キャラクター定義文を冒頭に挿入。 SCENE 1 — Outside the sanmon (main gate) of Kongobuji temple on Mt. Koya, Wakayama, Japan. The bear stands at the bottom of a wide stone staircase looking up at the massive traditional wooden sanmon gate flanked by ancient towering cedar trees. Soft morning mist, sacred solemn cinematic atmosphere. Calm reverent expression, paws pressed together in gassho (palms in prayer). Low camera angle for grandeur. Vertical 9:16. No text/letters/signs/watermarks.

シーン② 金剛峯寺・本堂前の合掌（荘厳・クローズ）
上記キャラクター定義文を冒頭に挿入。 SCENE 2 — In front of the imposing dark-wood hondo (main hall) of Kongobuji temple. Massive cypress bark roof, thick wooden pillars, stone lantern to one side. Late afternoon golden light filtered through cedar grove, dramatic long shadows. The bear is in gassho with eyes gently closed and head bowed — pious concentration. Slightly low angle, vertical 9:16. No text/letters/signs/watermarks.

シーン③ 鍾乳洞探検・鍾乳石と地底湖（驚きの表情）
上記キャラクター定義文を冒頭に挿入。 SCENE 3 — Inside a spectacular limestone cave (Ryusendo-style Dragon Spring Cave). Stalactites and stalagmites glow under cool teal/cobalt/soft white subterranean lighting. A vivid cobalt-blue underground lake is visible. The bear stands on a wet stone walkway, wide-eyed, mouth open in amazement, one paw raised pointing, exploring with excitement. Volumetric light rays from above, tiny cave-water droplets on fur. Vertical 9:16. No text/letters/signs/watermarks.

シーン④ 廃線ウォーク・紅葉と清流（紅葉に包まれた鉄路、隣に清流）
上記キャラクター定義文を冒頭に挿入。 SCENE 4 — Walking along the Takedao abandoned railway hiking trail (Hyogo) in peak autumn. Rusty old railway tracks run through the frame, both sides blazing with red, orange and golden Japanese maple (momiji) foliage. A clear transparent mountain stream (seiryu) flows alongside. Fallen red maple leaves on the rails. The bear is mid-stride with a bright joyful uplifted smile, eyes squinting with happiness, enjoying the breeze. Warm golden afternoon sunlight through the canopy. Vertical 9:16. No text/letters/signs/watermarks.

シーン⑤ トンネル・光の出口（振り返りのいたずら顔）
上記キャラクター定義文を冒頭に挿入。 SCENE 5 — Inside a dark atmospheric old brick railway tunnel on the Takedao line. Reddish-brown brick arch, slightly damp walls, faint puddles on the wooden walkway. A glowing circular exit of warm autumn light visible at the far end (the "tunnel of light" effect), framed by the brick arch. The bear walks toward the exit, head turned back over its shoulder toward the viewer with a curious mischievous adventure-loving grin, eyes sparkling. Volumetric mist, dramatic chiaroscuro. Vertical 9:16. No text/letters/signs/watermarks.

⚙️ 共通設定メモ
項目	設定
aspect_ratio	9:16
image_size	2k
image_urls	["https://www.genspark.ai/api/files/s/4vtQnljt"]（毎回必須）
モデル推奨	キャラ固定重視=nano-banana-pro ／ コスパ重視=nano-banana-2-flash-lite
文字	入れない（ネガティブプロンプト的に明記）
レイアウト	全身ショット・中央〜下寄り配置・縦構図
📝 未達の項目（あくまで正直に）
⚠️ 5枚の画像生成：完了していません（クレジット不足のため全弾失敗）
⚠️ 実際の画像URL：まだ存在しません
クレジットが復活したら、上記プロンプトをそのまま1枚ずつ image_generation に渡して再実行してください。その際はクレジット消費の観点で nano-banana-2-flash-lite から試すと当たりやすいはずです。生成できたら、私の方でアップロードURL取得 → Markdownインライン表示まで仕上げます。

「画像生成はせず、設計・台本のみで台本を確定したい」のでしたら、上記プロンプトをそのまま動画制作ツール（Runway / Pika / Kling）に貼って進めることもできます。どちらの進め方がいいですか？


まずtxtを書き出します（全シーン自己完結の英語プロンプト＋キャラクター共通設定＋ツール別末尾指示＋ネガティブを1ファイルに集約）。

Bash Command
mkdir -p /mnt/user-data/outputs && ls -ld /mnt/user-data/outputs
エージェントを表示
drwxr-xr-x 2 user user 4096 Sep  9 17:49 /mnt/user-data/outputs
Exit Code: 0
了解です。画像・動画生成は一切再試行せず、5シーン分のプロンプトを「コピペ1回で貼れる1ブロック形式」で整形し、txtも添付します。

📦 共通キャラ設定（全5シーンに毎回そのまま先頭にコピぺ）
CopyCharacter — Ted (must be IDENTICAL across all scenes).
9:16 vertical. Full-body shot. Chubby mid-size stuffed teddy bear.
Fur: light caramel / honey-brown, tightly curled, long, fluffy.
Ears: small, round. Eyes: glossy small round black with subtle highlight reflections. Nose: small black triangle. Mouth: simple black stitched line.
Body: plush rounded, short limbs.
Outfit: black varsity/letterman jacket with off-white cream raglan sleeves, ribbed collar / ribbed cuffs / ribbed hem. Zipper half-open (silver).
Necklace: thin gold-tone chain with a small old-keys pendant.
Jacket patches (embroidered): right chest = yellow snail; left chest = Mt Fuji + small green frog + small blue bird.
Bottom: camouflage cargo pants (green / brown / dark tones).
Waist: small black waist pouch + silver 1990s candybar mobile phone clipped to the belt.
Style: photoreal plush toy photography, cinematic lighting, NO text / letters / signs / watermarks / captions anywhere in the frame.


🎬 シーン①　高野山 金剛峯寺 山門前 合掌（朝霧）
コピペ用ブロック（共通＋シーン）
