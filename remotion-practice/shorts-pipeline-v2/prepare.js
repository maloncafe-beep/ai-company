/**
 * prepare.js (shorts-pipeline-v2)
 *
 * input/slides/ に int_*.wav + int_000.txt（タイトル）、
 *   001a.wav, 001a.txt, 001b.wav, 001b.txt ... を置いて実行。
 * input/illustrations/ に 000.png（タイトル用・省略可）, 001.png, 002.png ... を置く。
 * → src/slides-data.json をセグメント形式で自動生成。
 *
 * 使い方: node prepare.js
 */

import * as mm from "music-metadata";
import fs from "fs";
import path from "path";

const INPUT_DIR = "./input";
const SLIDES_DIR = path.join(INPUT_DIR, "slides");
const ILLUST_DIR = fs.existsSync(path.join(INPUT_DIR, "illustrations"))
  ? path.join(INPUT_DIR, "illustrations")
  : "./public/illustrations";
const OUTPUT_PATH = "./src/slides-data.json";
const BGM_PATH = "./public/bgm/bgm.mp3";
const PUBLIC_SLIDES_DIR = "./public/slides";
const PUBLIC_ILLUST_DIR = "./public/illustrations";

async function getWavDuration(wavPath) {
  const meta = await mm.parseFile(wavPath);
  return meta.format.duration ?? 0;
}

function readText(candidates, fallback) {
  for (const name of candidates) {
    const p = path.join(SLIDES_DIR, `${name}.txt`);
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, "utf8").replace(/^﻿/, "").trim();
    }
  }
  return fallback;
}

async function buildSegment(wavFile, txtCandidates, label) {
  const duration = await getWavDuration(path.join(SLIDES_DIR, wavFile));
  const text = readText(txtCandidates, label);
  console.log(`  [${label}] "${text}" (${duration.toFixed(2)}s)`);

  fs.mkdirSync(PUBLIC_SLIDES_DIR, { recursive: true });
  fs.copyFileSync(
    path.join(SLIDES_DIR, wavFile),
    path.join(PUBLIC_SLIDES_DIR, wavFile),
  );

  return { text, duration: Math.round(duration * 100) / 100, audio: wavFile };
}

function copyIllust(image) {
  fs.mkdirSync(PUBLIC_ILLUST_DIR, { recursive: true });
  const dest = path.join(PUBLIC_ILLUST_DIR, image);
  const src = path.join(ILLUST_DIR, image);
  if (path.resolve(src) !== path.resolve(dest)) fs.copyFileSync(src, dest);
}

async function main() {
  console.log("🎬 shorts-pipeline-v2 準備開始\n");
  console.log(`  イラスト入力: ${ILLUST_DIR}\n`);

  const allWavs = fs.readdirSync(SLIDES_DIR).filter((f) => /\.wav$/i.test(f));

  // タイトル（int_*.wav）と本編（001a_*.wav ...）
  const introWav = allWavs.filter((f) => /^int[_-]/i.test(f)).sort()[0];
  const wavFiles = allWavs.filter((f) => /^\d{3}[a-z]/i.test(f)).sort();

  if (wavFiles.length === 0) {
    console.error("❌ input/slides/ に 001a_*.wav 形式の .wav ファイルが見つかりません");
    process.exit(1);
  }

  const illustFiles = fs.readdirSync(ILLUST_DIR)
    .filter((f) => /\.(png|jpg|jpeg)$/i.test(f))
    .sort();

  if (illustFiles.length === 0) {
    console.error(`❌ ${ILLUST_DIR} に画像ファイルが見つかりません`);
    process.exit(1);
  }

  const slides = [];

  // タイトル画面（独立1枚）
  if (introWav) {
    const image = illustFiles.find((f) => f.startsWith("000")) ?? illustFiles[0];
    copyIllust(image);
    const seg = await buildSegment(introWav, ["int_000", "int"], "int_000");
    slides.push({ image, segments: [seg] });
  } else {
    console.log("  （int_*.wav なし → タイトル画面なし）");
  }

  // wav を番号（001, 002...）でグループ化
  const groups = {};
  for (const wavFile of wavFiles) {
    const numPrefix = wavFile.match(/^(\d{3})/)[1];
    (groups[numPrefix] ??= []).push(wavFile);
  }

  for (const [numPrefix, groupWavs] of Object.entries(groups).sort()) {
    const image = illustFiles.find((f) => f.startsWith(numPrefix))
      ?? illustFiles[(parseInt(numPrefix) - 1) % illustFiles.length];
    copyIllust(image);

    const segments = [];
    for (const wavFile of groupWavs.sort()) {
      // 001a_長い名前.wav → 001a.txt
      const label = wavFile.match(/^(\d{3}[a-z])/i)[1];
      segments.push(await buildSegment(wavFile, [label], label));
    }
    slides.push({ image, segments });
  }

  // アウトロ画面（コメント誘導・独立1枚）
  const outroWav = allWavs.filter((f) => /^out[_-]/i.test(f)).sort()[0];
  if (outroWav) {
    const image = illustFiles.find((f) => f.startsWith("999"))
      ?? illustFiles[illustFiles.length - 1];
    copyIllust(image);
    const seg = await buildSegment(outroWav, ["out"], "out");
    slides.push({ image, segments: [seg] });
  } else {
    console.log("  （out_*.wav なし → アウトロ画面なし）");
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
