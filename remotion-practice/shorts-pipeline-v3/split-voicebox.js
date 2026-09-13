/**
 * split-voicebox.js (shorts-pipeline-v3)
 *
 * input/temp/Voicebox.txt（「キャラ名（スタイル）,テキスト」形式、1行=1シーン）を読み込み、
 * カンマ以降のテキストのみを抽出して、v3のprepare.jsが読む
 * input/lines/{project_folder}/{project_folder}.txt （タブ区切り「001\tテキスト」形式）に書き出す。
 *
 * project_folder は input/meta.json から取得する。
 *
 * 使い方:
 *   node split-voicebox.js
 */

import fs from "fs";
import path from "path";

const VOICEBOX_TXT = "./input/temp/Voicebox.txt";
const META_PATH = "./input/meta.json";

function main() {
  if (!fs.existsSync(META_PATH)) {
    console.error(`❌ ファイルが見つかりません: ${META_PATH}`);
    process.exit(1);
  }
  const meta = JSON.parse(fs.readFileSync(META_PATH, "utf8"));
  const projectFolder = meta.project_folder;
  if (!projectFolder) {
    console.error("❌ meta.json に project_folder が必要です");
    process.exit(1);
  }

  if (!fs.existsSync(VOICEBOX_TXT)) {
    console.error(`❌ ファイルが見つかりません: ${VOICEBOX_TXT}`);
    process.exit(1);
  }

  const content = fs.readFileSync(VOICEBOX_TXT, "utf8").replace(/^﻿/, "");
  const lines = content.split(/\r?\n/).filter((l) => l.trim() !== "");

  if (lines.length === 0) {
    console.error("❌ Voicebox.txt に有効な行がありません");
    process.exit(1);
  }

  const PROJECT_DIR = path.join("./input/lines", projectFolder);
  fs.mkdirSync(PROJECT_DIR, { recursive: true });

  const outLines = lines.map((line, i) => {
    const num = String(i + 1).padStart(3, "0");
    const commaIndex = line.indexOf(",");
    const text = commaIndex === -1 ? line : line.slice(commaIndex + 1);
    return `${num}\t${text}`;
  });

  const TXT_FILE = path.join(PROJECT_DIR, `${projectFolder}.txt`);
  fs.writeFileSync(TXT_FILE, outLines.join("\n"), "utf8");

  console.log(`✓ ${lines.length}件のシーンを ${TXT_FILE} に分解しました`);

  // 既存wavの数と一致するか確認
  const wavCount = fs.existsSync(PROJECT_DIR)
    ? fs.readdirSync(PROJECT_DIR).filter((f) => /^\d{3}.*\.wav$/i.test(f)).length
    : 0;
  if (wavCount > 0 && wavCount !== lines.length) {
    console.warn(`⚠️  警告: wavファイル数（${wavCount}件）とテキスト行数（${lines.length}件）が一致しません`);
  } else if (wavCount === lines.length) {
    console.log(`✓ wavファイル数（${wavCount}件）と一致しています`);
  } else {
    console.log(`ℹ️  ${PROJECT_DIR} にまだwavファイルがありません`);
  }

  console.log("\n次のステップ: input/lines/" + projectFolder + "/ に 001_*.wav などのVOICEVOX出力を配置してください");
  console.log("その後: npm run build-data\n");
}

main();
