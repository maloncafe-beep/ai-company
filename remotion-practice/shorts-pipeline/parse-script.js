/**
 * parse-script.js
 *
 * 台本MDファイルを読んで input/slides/ にtxtを生成し、
 * VOICEBOXでの録音チェックリストを表示する
 *
 * 使い方:
 *   node parse-script.js "C:\path\to\台本.md"
 */

import fs from "fs";
import path from "path";

const SLIDES_DIR = "./input/slides";
const ILLUST_SRC = "C:/Users/yyasu/ai-company/youtube-short-agent/assets/illustration";
const BGM_SRC    = "C:/Users/yyasu/ai-company/youtube-short-agent/assets/bgm/Escort.mp3";
const ILLUST_DIR = "./input/illustrations";
const BGM_DEST   = "./input/bgm.mp3";

function parseMarkdown(mdPath) {
  const content = fs.readFileSync(mdPath, "utf8");
  const lines = content.split(/\r?\n/);

  let title = "";
  let inScript = false;
  const scriptLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed === "【タイトル】") continue;
    if (trimmed === "【台本】") { inScript = true; continue; }

    if (!inScript && !title) {
      title = trimmed; // 【タイトル】直後の最初の行
      continue;
    }

    if (inScript && trimmed) {
      scriptLines.push(trimmed);
    }
  }

  return { title, scriptLines };
}

function syncAssets() {
  // イラスト素材を input/illustrations/ にシンボリックリンク or コピー
  if (!fs.existsSync(ILLUST_DIR)) {
    fs.mkdirSync(ILLUST_DIR, { recursive: true });
  }

  const illusts = fs.readdirSync(ILLUST_SRC).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  let copied = 0;
  for (const f of illusts) {
    const dest = path.join(ILLUST_DIR, f);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(path.join(ILLUST_SRC, f), dest);
      copied++;
    }
  }
  if (copied > 0) console.log(`✓ イラスト素材 ${copied}件 を input/illustrations/ に同期`);
  else            console.log(`✓ イラスト素材 ${illusts.length}件 （同期済み）`);

  // BGM コピー
  if (!fs.existsSync(BGM_DEST)) {
    fs.copyFileSync(BGM_SRC, BGM_DEST);
    console.log("✓ BGM をコピー");
  } else {
    console.log("✓ BGM（コピー済み）");
  }
}

function main() {
  const mdPath = process.argv[2];
  if (!mdPath) {
    console.error("使い方: node parse-script.js <台本.mdのパス>");
    process.exit(1);
  }
  if (!fs.existsSync(mdPath)) {
    console.error(`❌ ファイルが見つかりません: ${mdPath}`);
    process.exit(1);
  }

  console.log(`\n📄 台本解析: ${path.basename(mdPath)}\n`);

  const { title, scriptLines } = parseMarkdown(mdPath);

  // input/slides/ を初期化
  fs.mkdirSync(SLIDES_DIR, { recursive: true });

  // 既存のtxt/wavをクリア
  for (const f of fs.readdirSync(SLIDES_DIR)) {
    fs.rmSync(path.join(SLIDES_DIR, f));
  }

  // txt 生成（001.txt = タイトル, 002.txt〜 = 台本行）
  const allLines = [title, ...scriptLines];
  for (let i = 0; i < allLines.length; i++) {
    const num = String(i + 1).padStart(3, "0");
    const txtPath = path.join(SLIDES_DIR, `${num}.txt`);
    fs.writeFileSync(txtPath, allLines[i], "utf8");
  }

  // 共有アセットを同期
  syncAssets();

  // VOICEBOXチェックリスト表示
  console.log("\n" + "─".repeat(60));
  console.log("🎙️  VOICEBOXで以下を順番に録音してください");
  console.log("─".repeat(60));
  for (let i = 0; i < allLines.length; i++) {
    const num = String(i + 1).padStart(3, "0");
    console.log(`  [ ] ${num}  「${allLines[i]}」`);
  }
  console.log("─".repeat(60));
  console.log(`\n  書き出し先: input/slides/`);
  console.log(`  ファイル名は VOICEBOX デフォルト（001-声優名-テキスト.wav）のままでOK`);
  console.log("\n  準備ができたら: npm run go\n");
}

main();
