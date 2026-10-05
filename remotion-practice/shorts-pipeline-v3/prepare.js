/**
 * prepare.js (shorts-pipeline-v3)
 *
 * input/meta.json の project_folder で対象プロジェクトを指定。
 * input/lines/{project_folder}/ に以下を置く：
 *   - {project_folder}.txt  : タブ区切り「001\tテキスト」形式
 *   - 001_*.wav, 002_*.wav  : VOICEVOX 出力WAV
 *   - bg.png                : 背景画像（任意）
 * → src/lines-data.json を自動生成。
 *
 * 使い方: node prepare.js
 */

import * as mm from "music-metadata";
import fs from "fs";
import path from "path";

const META_PATH = "./input/meta.json";
const BGM_PATH = "./public/bgm.mp3";
const PUBLIC_LINES_DIR = "./public/lines";
const PUBLIC_BG_PATH = "./public/bg.png";
const OUTPUT_PATH = "./src/lines-data.json";

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

async function getWavDuration(wavPath) {
  const meta = await mm.parseFile(wavPath);
  return meta.format.duration ?? 0;
}

async function main() {
  console.log("🎬 shorts-pipeline-v3 準備開始\n");

  // meta.json 読み込み
  if (!fs.existsSync(META_PATH)) {
    console.error("❌ input/meta.json が見つかりません");
    process.exit(1);
  }
  const meta = JSON.parse(fs.readFileSync(META_PATH, "utf8"));
  const projectFolder = meta.project_folder;
  if (!projectFolder) {
    console.error("❌ meta.json に project_folder が必要です");
    process.exit(1);
  }

  const PROJECT_DIR = `./input/lines/${projectFolder}`;
  const TXT_FILE = path.join(PROJECT_DIR, `${projectFolder}.txt`);

  console.log(`  [meta] person=${meta.person}  title=${meta.title}`);
  console.log(`  [project] ${PROJECT_DIR}\n`);

  if (!fs.existsSync(TXT_FILE)) {
    console.error(`❌ ${TXT_FILE} が見つかりません`);
    process.exit(1);
  }

  // テキスト読み込み（タブ区切り: 001\tテキスト）
  const txtLines = fs.readFileSync(TXT_FILE, "utf8")
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const textMap = {};
  for (const line of txtLines) {
    const tab = line.indexOf("\t");
    if (tab === -1) continue;
    const num = line.slice(0, tab).trim().padStart(3, "0");
    textMap[num] = line.slice(tab + 1).trim();
  }

  // WAVファイル一覧（001_*.wav 形式）
  const wavFiles = fs.readdirSync(PROJECT_DIR)
    .filter(f => /^\d{3}.*\.wav$/i.test(f))
    .sort();

  if (wavFiles.length === 0) {
    console.error(`❌ ${PROJECT_DIR} に .wav ファイルが見つかりません`);
    process.exit(1);
  }

  fs.mkdirSync(PUBLIC_LINES_DIR, { recursive: true });

  const lines = [];
  const total = wavFiles.length;

  for (const wavFile of wavFiles) {
    const numMatch = wavFile.match(/^(\d{3})/);
    if (!numMatch) continue;
    const num = numMatch[1];

    const wavPath = path.join(PROJECT_DIR, wavFile);
    const duration = await getWavDuration(wavPath);
    const rawText = textMap[num] ?? num;

    // 行タイプの判定
    const idx = wavFiles.indexOf(wavFile);
    const type = idx === 0 ? "title" : idx === total - 1 ? "ending" : "body";

    console.log(`  [${num}][${type}] "${rawText.slice(0, 28)}…" (${duration.toFixed(2)}s)`);

    // public/lines/ にコピー（ファイル名はそのまま）
    fs.copyFileSync(wavPath, path.join(PUBLIC_LINES_DIR, wavFile));

    lines.push({
      num,
      text: rawText,
      duration: Math.round(duration * 100) / 100,
      audio: wavFile,
      type,
    });
  }

  // bg.png: プロジェクトフォルダ優先 → input/bg.png フォールバック
  const projectBg = path.join(PROJECT_DIR, "bg.png");
  const fallbackBg = "./input/bg.png";
  const bgSrc = fs.existsSync(projectBg) ? projectBg : fs.existsSync(fallbackBg) ? fallbackBg : null;
  if (bgSrc) {
    fs.copyFileSync(bgSrc, PUBLIC_BG_PATH);
    console.log(`\n  [bg] ${bgSrc} をコピーしました`);
  } else {
    console.warn("  ⚠️  bg.png が見つかりません（背景なしで続行）");
  }

  const hasBgm = fs.existsSync(BGM_PATH);
  const outputFilename = `${meta.person}_${todayStr()}.mp4`;

  const data = {
    lines,
    hasBgm,
    title: meta.title,
    person: meta.person,
    displayName: meta.displayName ?? meta.person,
    outputFilename,
  };

  fs.mkdirSync("./src", { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), "utf8");

  const totalSec = lines.reduce((sum, l) => sum + l.duration, 0);
  console.log(`\n✅ 完了！　行数: ${lines.length}行　本編: ${totalSec.toFixed(1)}秒（+カウントダウン3秒）`);
  console.log(`   → ${OUTPUT_PATH}`);
  console.log(`   出力ファイル名: out/${outputFilename}`);
  console.log("\n次のステップ: npm run go\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
