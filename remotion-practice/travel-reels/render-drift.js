/**
 * render-drift.js — travel-reels
 *
 * 横向き（4:3等）の元写真を、縦（1080x1920）のドリフト（パン）動画に
 * 直接書き出す。Canvaでの手動パン動画作成を代替するツール。
 *
 * 使い方:
 *   node render-drift.js <プロジェクト名> <NNN> <元画像パス> [秒数] [方向]
 *
 * 例:
 *   node render-drift.js hananoiwaya 007 "C:\photos\iwaya-wide.jpg" 5 left-to-right
 *
 * 出力: projects/<プロジェクト名>/clips/<NNN>.mp4
 *   → あとは NNN.txt を通常どおり作成し、node prepare.js <プロジェクト名> で
 *     いつもの動画クリップと同じように取り込まれる。
 */

import fs from "fs";
import path from "path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const FPS = 30;
const DIRECTIONS = new Set(["left-to-right", "right-to-left"]);

const [, , project, num, sourcePath, durationArg, directionArg] = process.argv;

if (!project || !num || !sourcePath) {
  console.error(
    "❌ 使い方: node render-drift.js <プロジェクト名> <NNN> <元画像パス> [秒数=5] [方向=left-to-right]"
  );
  process.exit(1);
}

const duration = durationArg ? parseFloat(durationArg) : 5;
const direction = directionArg ?? "left-to-right";

if (!DIRECTIONS.has(direction)) {
  console.error(`❌ 方向は left-to-right か right-to-left のいずれかにしてください（指定値: ${direction}）`);
  process.exit(1);
}

const resolvedSource = path.resolve(sourcePath);
if (!fs.existsSync(resolvedSource)) {
  console.error(`❌ 元画像が見つかりません: ${resolvedSource}`);
  process.exit(1);
}

const OUT_DIR = path.resolve(`./projects/${project}/clips`);
const OUT_PATH = path.join(OUT_DIR, `${num}.mp4`);
const PUBLIC_WIDE_DIR = path.resolve("./public/wide");
const staticFileName = `${num}${path.extname(resolvedSource).toLowerCase()}`;
const publicWidePath = path.join(PUBLIC_WIDE_DIR, staticFileName);

async function main() {
  console.log(`🎬 ドリフト素材を作成: ${project}/${num}（${duration}秒・${direction}）\n`);

  fs.mkdirSync(PUBLIC_WIDE_DIR, { recursive: true });
  fs.copyFileSync(resolvedSource, publicWidePath);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log("  バンドル中...");
  const bundleLocation = await bundle({
    entryPoint: path.resolve("./src/index.ts"),
  });

  console.log("  コンポジション選択中...");
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "DriftClip",
    inputProps: { file: `wide/${staticFileName}`, direction },
  });
  composition.durationInFrames = Math.round(duration * FPS);

  console.log("  レンダリング中...");
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: OUT_PATH,
    inputProps: { file: `wide/${staticFileName}`, direction },
  });

  console.log(`\n✅ 完了！ → ${OUT_PATH}`);
  console.log(`\n次のステップ: projects/${project}/clips/${num}.txt を作成してから node prepare.js ${project}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
