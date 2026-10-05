/**
 * prepare.js
 *
 * 使い方:
 *   node prepare.js
 *
 * ANTHROPIC_API_KEY があればClaudeでイラストを自動マッチング。
 * なくても自動ローテーションでレンダリングまで完走する。
 */

import { config as dotenvConfig } from "dotenv";
import * as mm from "music-metadata";
import fs from "fs";
import path from "path";

// .env を複数の場所から探して読み込む
const ENV_CANDIDATES = [
  "./.env",
  "C:/Users/yyasu/ai-zodiacm/ai-company-kit/server/.env",
  "C:/Users/yyasu/ai-company/.env",
];
for (const envPath of ENV_CANDIDATES) {
  if (fs.existsSync(envPath)) {
    dotenvConfig({ path: envPath, override: true });
    if (process.env.ANTHROPIC_API_KEY) break;
  }
}

const INPUT_DIR = "./input";
const SLIDES_DIR = path.join(INPUT_DIR, "slides");
const ILLUST_DIR = path.join(INPUT_DIR, "illustrations");
const BGM_PATH = path.join(INPUT_DIR, "bgm.mp3");
const PUBLIC_DIR = "./public";
const CACHE_PATH = "./illustrations-cache.json";
const OUTPUT_PATH = "./src/slides-data.json";

// ── Claudeクライアント（APIキーがある場合のみ） ──────────────────────
let claudeClient = null;
async function tryInitClaude() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return false;
  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: key });
    // 疎通確認
    await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 5,
      messages: [{ role: "user", content: "hi" }],
    });
    claudeClient = client;
    console.log("✓ Claude API 接続OK（AIマッチングモード）");
    return true;
  } catch {
    console.log("⚠️  Claude API 無効 → 自動ローテーションモードで続行");
    return false;
  }
}

// ── 1. イラストキャッシュ（Claude利用時のみ） ────────────────────────
async function buildIllustrationCache(illustFiles) {
  let cache = {};
  if (fs.existsSync(CACHE_PATH)) {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  }

  const needAnalysis = illustFiles.filter((f) => !cache[f]);
  if (needAnalysis.length === 0) {
    console.log(`✓ イラストキャッシュ使用（${illustFiles.length}件）`);
    return cache;
  }

  console.log(`📷 イラスト解析中（${needAnalysis.length}件）...`);
  for (const file of needAnalysis) {
    const imgPath = path.join(ILLUST_DIR, file);
    const imgData = fs.readFileSync(imgPath).toString("base64");
    const ext = path.extname(file).slice(1).toLowerCase();
    const mediaType = ext === "jpg" ? "image/jpeg" : `image/${ext}`;

    const res = await claudeClient.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: imgData } },
          { type: "text", text: "このイラストの内容を20字以内の日本語で説明してください。例：「女性がノートに書いている」" },
        ],
      }],
    });

    cache[file] = res.content[0].text.trim();
    console.log(`  ${file} → ${cache[file]}`);
  }

  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
  return cache;
}

// ── 2. イラストマッチング ────────────────────────────────────────────
// Claudeあり：テキスト内容で最適なものを選ぶ
// Claudeなし：スライド番号に応じて均等ローテーション
async function matchIllustration(text, illustFiles, illustCache, slideIndex) {
  if (claudeClient && illustCache) {
    const list = Object.entries(illustCache)
      .map(([file, desc], i) => `${i + 1}. ${file}｜${desc}`)
      .join("\n");
    const res = await claudeClient.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 50,
      messages: [{
        role: "user",
        content: `スライドテキスト「${text}」に最も合うイラストのファイル名だけを返してください。\n\n${list}\n\nファイル名のみ:`,
      }],
    });
    const matched = res.content[0].text.trim();
    // 返ってきたファイル名がリストに存在すれば採用、なければローテーション
    if (illustFiles.includes(matched)) return matched;
  }

  // ローテーション（スライド番号で均等に割り当て）
  return illustFiles[slideIndex % illustFiles.length];
}

// ── 3. WAV duration取得 ──────────────────────────────────────────────
async function getWavDuration(wavPath) {
  const meta = await mm.parseFile(wavPath);
  return meta.format.duration ?? 0;
}

// ── 4. publicにコピー ────────────────────────────────────────────────
function copyToPublic(src, destRel) {
  const dest = path.join(PUBLIC_DIR, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

// ── メイン ────────────────────────────────────────────────────────────
async function main() {
  console.log("🎬 shorts-pipeline 準備開始\n");

  // Claude接続試行
  const useAI = await tryInitClaude();

  // スライドファイル一覧（先頭3桁の番号順）
  // VOICEBOXのデフォルト出力名 "001-声優名-テキスト.wav" にも対応
  const wavFiles = fs.readdirSync(SLIDES_DIR)
    .filter((f) => /^\d+.*\.wav$/i.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b));

  if (wavFiles.length === 0) {
    console.error("❌ input/slides/ に .wav ファイルが見つかりません");
    process.exit(1);
  }

  // イラスト一覧
  const illustFiles = fs.readdirSync(ILLUST_DIR)
    .filter((f) => /\.(png|jpg|jpeg)$/i.test(f))
    .sort();

  if (illustFiles.length === 0) {
    console.error("❌ input/illustrations/ に画像ファイルが見つかりません");
    process.exit(1);
  }

  // キャッシュ構築（Claudeあり時のみ）
  const illustCache = useAI ? await buildIllustrationCache(illustFiles) : null;

  // イラストをpublicにコピー
  for (const f of illustFiles) {
    copyToPublic(path.join(ILLUST_DIR, f), `illustrations/${f}`);
  }

  // BGMコピー
  let hasBgm = false;
  if (fs.existsSync(BGM_PATH)) {
    copyToPublic(BGM_PATH, "bgm/bgm.mp3");
    hasBgm = true;
    console.log("✓ BGM コピー完了");
  }

  // スライドごとに処理
  console.log(`\n📝 スライド処理中（${wavFiles.length}枚）...\n`);
  const slides = [];

  for (let i = 0; i < wavFiles.length; i++) {
    const wavFile = wavFiles[i];
    const wavPath = path.join(SLIDES_DIR, wavFile);

    // 先頭3桁の番号で対応するtxtを探す（例: "001" → "001.txt" or "001-*.txt"）
    const numPrefix = wavFile.match(/^(\d+)/)?.[1] ?? String(i + 1).padStart(2, "0");
    const allInDir = fs.readdirSync(SLIDES_DIR);
    const matchedTxt = allInDir.find((f) => new RegExp(`^${numPrefix}.*\\.txt$`, "i").test(f));
    const txtPath = matchedTxt ? path.join(SLIDES_DIR, matchedTxt) : null;

    const text = txtPath && fs.existsSync(txtPath)
      ? fs.readFileSync(txtPath, "utf8").trim()
      : wavFile.replace(/^\d{3}[-_]?/, "").replace(/\.wav$/i, "");

    const duration = await getWavDuration(wavPath);
    const illust = await matchIllustration(text, illustFiles, illustCache, i);

    console.log(`  [${numPrefix}] "${text}"`);
    console.log(`         → ${illust} (${duration.toFixed(2)}s)`);

    copyToPublic(wavPath, `slides/${wavFile}`);

    slides.push({
      text,
      duration: Math.round(duration * 100) / 100,
      audio: wavFile,
      image: illust,
    });
  }

  // slides-data.json出力
  const data = { slides, hasBgm };
  fs.mkdirSync("./src", { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), "utf8");

  const total = slides.reduce((s, sl) => s + sl.duration, 0);
  console.log(`\n✅ 完了！　スライド: ${slides.length}枚　合計: ${total.toFixed(1)}秒`);
  console.log(`   → ${OUTPUT_PATH}`);
  console.log("\n次のステップ: npx remotion render ShortsVideo\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
