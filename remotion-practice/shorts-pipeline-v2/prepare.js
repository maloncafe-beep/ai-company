/**
 * prepare.js (shorts-pipeline-v2)
 *
 * public/slides/ に 001a.wav, 001a.txt, 001b.wav, 001b.txt ... を置いて実行。
 * public/illustrations/ に 001.png, 002.png ... を置いておく。
 * → src/slides-data.json をセグメント形式で自動生成。
 *
 * 使い方: node prepare.js
 */

import * as mm from "music-metadata";
import fs from "fs";
import path from "path";

const INPUT_DIR = "./input";
const SLIDES_DIR = path.join(INPUT_DIR, "slides");
const ILLUST_DIR = "./public/illustrations";
const OUTPUT_PATH = "./src/slides-data.json";
const BGM_PATH = "./public/bgm/bgm.mp3";
const PUBLIC_SLIDES_DIR = "./public/slides";

async function getWavDuration(wavPath) {
  const meta = await mm.parseFile(wavPath);
  return meta.format.duration ?? 0;
}

async function main() {
  console.log("🎬 shorts-pipeline-v2 準備開始\n");

  // wav ファイル一覧（001a.wav, 001b.wav ... の形式）
  const wavFiles = fs.readdirSync(SLIDES_DIR)
    .filter((f) => /^\d{3}[a-z].*\.wav$/i.test(f))
    .sort();

  if (wavFiles.length === 0) {
    console.error("❌ public/slides/ に .wav ファイルが見つかりません");
    process.exit(1);
  }

  // イラスト一覧（001.png, 002.png ...）
  const illustFiles = fs.readdirSync(ILLUST_DIR)
    .filter((f) => /\.(png|jpg|jpeg)$/i.test(f))
    .sort();

  if (illustFiles.length === 0) {
    console.error("❌ public/illustrations/ に画像ファイルが見つかりません");
    process.exit(1);
  }

  // wav を番号（001, 002...）でグループ化
  const groups = {};
  for (const wavFile of wavFiles) {
    const numPrefix = wavFile.match(/^(\d{3})/)?.[1];
    if (!numPrefix) continue;
    if (!groups[numPrefix]) groups[numPrefix] = [];
    groups[numPrefix].push(wavFile);
  }

  const slides = [];

  for (const [numPrefix, groupWavs] of Object.entries(groups).sort()) {
    // 対応するイラストを番号で探す（001 → 001.png）
    const image = illustFiles.find((f) => f.startsWith(numPrefix))
      ?? illustFiles[(parseInt(numPrefix) - 1) % illustFiles.length];

    const segments = [];

    for (const wavFile of groupWavs.sort()) {
      const wavPath = path.join(SLIDES_DIR, wavFile);
      const duration = await getWavDuration(wavPath);

      // 対応する txt を探す（001a_長い名前.wav → 001a.txt）
      const numLetterPrefix = wavFile.match(/^(\d{3}[a-z])/i)?.[1] ?? wavFile.replace(/\.wav$/i, "");
      const txtPath = path.join(SLIDES_DIR, `${numLetterPrefix}.txt`);
      const text = fs.existsSync(txtPath)
        ? fs.readFileSync(txtPath, "utf8").trim()
        : numLetterPrefix;

      console.log(`  [${numLetterPrefix}] "${text}" (${duration.toFixed(2)}s)`);

      // public/slides/ にコピー
      fs.mkdirSync(PUBLIC_SLIDES_DIR, { recursive: true });
      fs.copyFileSync(wavPath, path.join(PUBLIC_SLIDES_DIR, wavFile));

      segments.push({
        text,
        duration: Math.round(duration * 100) / 100,
        audio: wavFile,
      });
    }

    slides.push({ image, segments });
  }

  const hasBgm = fs.existsSync(BGM_PATH);
  const data = { slides, hasBgm };

  fs.mkdirSync("./src", { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), "utf8");

  const totalSec = slides
    .flatMap((s) => s.segments)
    .reduce((sum, seg) => sum + seg.duration, 0);

  console.log(`\n✅ 完了！　スライド: ${slides.length}枚　合計: ${totalSec.toFixed(1)}秒`);
  console.log(`   → ${OUTPUT_PATH}`);
  console.log("\n次のステップ: npm run render\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
