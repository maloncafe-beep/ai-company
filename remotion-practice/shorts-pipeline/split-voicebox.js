/**
 * split-voicebox.js
 *
 * input/temp/voicebox.txt（VOICEBOXの台本テキスト、1行=1シーン）を
 * input/slides/NNN.txt に分解する
 *
 * 使い方:
 *   node split-voicebox.js
 */

import fs from "fs";
import path from "path";

const VOICEBOX_TXT = "./input/temp/voicebox.txt";
const SLIDES_DIR = "./input/slides";

function main() {
  if (!fs.existsSync(VOICEBOX_TXT)) {
    console.error(`❌ ファイルが見つかりません: ${VOICEBOX_TXT}`);
    process.exit(1);
  }

  const content = fs.readFileSync(VOICEBOX_TXT, "utf8").replace(/^﻿/, "");
  const lines = content.split(/\r?\n/).filter((l) => l.trim() !== "");

  if (lines.length === 0) {
    console.error("❌ voicebox.txt に有効な行がありません");
    process.exit(1);
  }

  fs.mkdirSync(SLIDES_DIR, { recursive: true });

  for (let i = 0; i < lines.length; i++) {
    const num = String(i + 1).padStart(3, "0");
    const txtPath = path.join(SLIDES_DIR, `${num}.txt`);
    const commaIndex = lines[i].indexOf(",");
    const text = commaIndex === -1 ? lines[i] : lines[i].slice(commaIndex + 1);
    fs.writeFileSync(txtPath, text, "utf8");
  }

  console.log(`✓ ${lines.length}件のシーンを ${SLIDES_DIR}/001.txt〜${String(lines.length).padStart(3, "0")}.txt に分解しました`);

  // 既存wavの数と一致するか確認
  const wavCount = fs.readdirSync(SLIDES_DIR).filter((f) => /^\d+.*\.wav$/i.test(f)).length;
  if (wavCount > 0 && wavCount !== lines.length) {
    console.warn(`⚠️  警告: wavファイル数（${wavCount}件）とテキスト行数（${lines.length}件）が一致しません`);
  } else if (wavCount === lines.length) {
    console.log(`✓ wavファイル数（${wavCount}件）と一致しています`);
  }

  console.log("\n次のステップ: input/illustrations/ に台本内容に合うイラストを手動で配置してください");
  console.log("その後: npm run prepare\n");
}

main();
