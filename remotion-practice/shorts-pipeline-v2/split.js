/**
 * split.js
 *
 * Voicebox.txt を読み込み、input/slides/ に1行1ファイルで書き出す。
 *
 * 形式（1行1エントリ  プレフィックス,テキスト）:
 *   int,タイトルのテキスト        → int_000.txt
 *   out,コメント誘導のテキスト    → out.txt
 *   001a,テーマのテキスト         → 001a.txt
 *   001b,詳細説明のテキスト       → 001b.txt
 *
 * 実行: npm run split
 */

import fs from "fs";
import path from "path";

const CANDIDATES = ["./input/temp/Voicebox.txt", "./input/wav/voicebox.txt"];
const OUTPUT_DIR = "./input/slides";

const inputFile = CANDIDATES.find((p) => fs.existsSync(p));
if (!inputFile) {
  console.error(`❌ Voicebox.txt が見つかりません: ${CANDIDATES.join(" / ")}`);
  process.exit(1);
}

const lines = fs.readFileSync(inputFile, "utf8")
  .replace(/^﻿/, "")
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.length > 0);

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
console.log(`入力: ${inputFile}\n`);

let count = 0;
for (const line of lines) {
  const comma = line.indexOf(",");
  if (comma === -1) {
    console.warn(`⚠️  スキップ（カンマなし）: ${line}`);
    continue;
  }

  const prefix = line.slice(0, comma).trim();
  const text = line.slice(comma + 1).trim();

  let fileName;
  if (/^int(_000)?$/i.test(prefix)) fileName = "int_000";
  else if (/^out$/i.test(prefix)) fileName = "out";
  else if (/^\d{3}[a-z]$/i.test(prefix)) fileName = prefix;
  else {
    console.warn(`⚠️  スキップ（プレフィックス不正）: ${line}`);
    continue;
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, `${fileName}.txt`), text, "utf8");
  console.log(`  ✓ ${fileName}.txt → "${text}"`);
  count++;
}

console.log(`\n✅ ${count}件 書き出し完了 → ${OUTPUT_DIR}/`);
