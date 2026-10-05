/**
 * prepare.js — travel-reels
 *
 * 使い方: node prepare.js <プロジェクト名>
 * 例:     node prepare.js 2026-08-tokyo
 *
 * projects/<プロジェクト名>/clips/ に素材を置く。
 * config.json で設定を記述する。
 * → src/clips-data.json と public/ へのコピーを自動生成。
 *
 * clips/ のファイル形式:
 *   001.mp4 (or .jpg/.png) + 001.txt
 *
 * 001.txt の例:
 *   location: 浅草寺
 *   comment: 400年の歴史を感じる朝の空気
 *   ai_generated: true
 *   duration: 5.5    ← 動画は自動検出。写真はconfig.jsonのデフォルトを使用
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const PROJECT_NAME = process.argv[2];
if (!PROJECT_NAME) {
  console.error("❌ プロジェクト名を指定してください: node prepare.js <プロジェクト名>");
  process.exit(1);
}

const PROJECT_DIR = path.resolve(`./projects/${PROJECT_NAME}`);
const CLIPS_DIR = path.join(PROJECT_DIR, "clips");
const CONFIG_PATH = path.join(PROJECT_DIR, "config.json");
const OUTPUT_PATH = "./src/clips-data.json";
const PUBLIC_CLIPS_DIR = "./public/clips";
const PUBLIC_BGM_PATH = "./public/bgm.mp3";

const VIDEO_EXTS = new Set([".mp4", ".mov", ".webm"]);
const PHOTO_EXTS = new Set([".jpg", ".jpeg", ".png"]);

// デフォルト設定
const DEFAULT_CONFIG = {
  title: PROJECT_NAME,
  bgm: null,
  duration_per_photo: 4,
  style: "standard",
};

function parseTxt(txtPath) {
  if (!fs.existsSync(txtPath)) return {};
  const result = {};
  for (const line of fs.readFileSync(txtPath, "utf8").split("\n")) {
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) continue;
    const k = key.trim();
    const v = rest.join(":").trim();
    if (k === "ai_generated") result[k] = v === "true";
    else if (k === "duration") result[k] = parseFloat(v);
    else result[k] = v;
  }
  return result;
}

function getVideoDuration(filePath) {
  try {
    const out = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
      { encoding: "utf8" }
    );
    return parseFloat(out.trim());
  } catch {
    return null;
  }
}

async function main() {
  console.log(`🎬 travel-reels 準備開始: ${PROJECT_NAME}\n`);

  if (!fs.existsSync(PROJECT_DIR)) {
    console.error(`❌ projects/${PROJECT_NAME}/ が見つかりません`);
    process.exit(1);
  }

  const config = fs.existsSync(CONFIG_PATH)
    ? { ...DEFAULT_CONFIG, ...JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8")) }
    : { ...DEFAULT_CONFIG };

  console.log(`  タイトル: ${config.title}`);

  // 素材ファイル一覧（番号順）
  const mediaFiles = fs.readdirSync(CLIPS_DIR)
    .filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return VIDEO_EXTS.has(ext) || PHOTO_EXTS.has(ext);
    })
    .sort();

  if (mediaFiles.length === 0) {
    console.error(`❌ ${CLIPS_DIR} に素材ファイルが見つかりません`);
    process.exit(1);
  }

  fs.mkdirSync(PUBLIC_CLIPS_DIR, { recursive: true });

  const clips = [];

  for (const file of mediaFiles) {
    const ext = path.extname(file).toLowerCase();
    const type = VIDEO_EXTS.has(ext) ? "video" : "photo";
    const srcPath = path.join(CLIPS_DIR, file);

    // txt メタデータ読み込み
    const numPrefix = file.match(/^(\d+)/)?.[1] ?? file.replace(/\.[^.]+$/, "");
    const txtPath = path.join(CLIPS_DIR, `${numPrefix}.txt`);
    const meta = parseTxt(txtPath);

    // 尺の決定
    let duration = meta.duration ?? null;
    if (duration === null) {
      if (type === "video") {
        duration = getVideoDuration(srcPath);
        if (duration === null) {
          console.warn(`  ⚠️  ${file}: 尺を自動検出できません。5秒で代用します`);
          duration = 5;
        }
      } else {
        duration = config.duration_per_photo;
      }
    }

    // public/clips/ にコピー
    fs.copyFileSync(srcPath, path.join(PUBLIC_CLIPS_DIR, file));

    const clip = {
      file,
      type,
      location: meta.location ?? "",
      comment: meta.comment ?? "",
      duration: Math.round(duration * 100) / 100,
      ai_generated: meta.ai_generated ?? false,
    };

    console.log(`  [${numPrefix}] ${clip.type} "${clip.location}" (${clip.duration}s)${clip.ai_generated ? " [AI]" : ""}`);
    clips.push(clip);
  }

  // BGMのコピー
  let hasBgm = false;
  const bgmCandidates = [
    config.bgm ? path.resolve(config.bgm) : null,
    path.join(PROJECT_DIR, "bgm.mp3"),
  ].filter(Boolean);

  for (const bgmPath of bgmCandidates) {
    if (bgmPath && fs.existsSync(bgmPath)) {
      fs.copyFileSync(bgmPath, PUBLIC_BGM_PATH);
      hasBgm = true;
      console.log(`\n  BGM: ${bgmPath}`);
      break;
    }
  }
  if (!hasBgm) console.log("\n  BGM: なし");

  // clips-data.json 出力
  const data = { project: PROJECT_NAME, title: config.title, hasBgm, clips };
  fs.mkdirSync("./src", { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), "utf8");

  const totalSec = clips.reduce((s, c) => s + c.duration, 0);
  console.log(`\n✅ 完了！  クリップ: ${clips.length}個  合計: ${totalSec.toFixed(1)}秒`);
  console.log(`   → ${OUTPUT_PATH}`);
  console.log("\n次のステップ: npm run dev でプレビュー確認\n");
}

main().catch((e) => { console.error(e); process.exit(1); });
