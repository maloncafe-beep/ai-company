/**
 * script-to-voicevox.js (shorts-pipeline-v3)
 *
 * scripts/*.md の【台本】セクションから台本テキストを抜き出し、
 *   1) input/lines/{project_folder}/{project_folder}.txt （001\tテキスト 形式）
 *   2) VOICEVOXに貼り付けるプレーンテキスト（番号なし・1行1文）
 * を生成する。2)は input/temp/voicevox-paste.txt に保存し、クリップボードにもコピーする。
 *
 * これまで「台本をVOICEVOXにコピペする前の整形」を手でやっていた工程を自動化する。
 * VOICEVOXへの貼り付け後の読み確認・修正・WAV書き出し（「テキストを繋げて書き出し」）は
 * 引き続き手動で行う。
 *
 * meta.json の project_folder を使用。MDファイルはコマンドライン引数で指定、
 * 省略時は scripts/ 内のファイル名が最も新しい（文字列として最大の） .md を使う。
 *
 * 使い方:
 *   node script-to-voicevox.js [scripts/xxx.md]
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const META_PATH = "./input/meta.json";
const SCRIPTS_DIR = "./scripts";
const PASTE_FILE = "./input/temp/voicevox-paste.txt";

function findLatestMd() {
  if (!fs.existsSync(SCRIPTS_DIR)) {
    throw new Error(`${SCRIPTS_DIR} が見つかりません`);
  }
  const files = fs.readdirSync(SCRIPTS_DIR).filter((f) => f.endsWith(".md"));
  if (files.length === 0) throw new Error(`${SCRIPTS_DIR} に.mdファイルがありません`);
  files.sort();
  return path.join(SCRIPTS_DIR, files[files.length - 1]);
}

// 見出し行かどうか判定（【台本】, ## 台本, 台本：, [台本], **台本** などの表記差を許容。
// 【台本】（補足）のように見出しの後に説明が続くケースも許容する）
function isHeadingLine(trimmed, keyword) {
  if (keyword) {
    // 行頭が #/* などの装飾を挟んで【keyword】/[keyword]/keyword： で始まっていればOK
    const re = new RegExp(`^(#+\\s*|\\*+\\s*)?([【\\[]\\s*${keyword}\\s*[】\\]]|${keyword}\\s*[:：])`);
    return re.test(trimmed);
  }
  // 任意の見出し（【...】[...] # ## **...** で始まり、本文より短い行）かどうかの簡易判定
  if (!/^[【\[#*]/.test(trimmed)) return false;
  const label = trimmed.replace(/^#+\s*/, "").replace(/^\*+/, "").replace(/^[【\[][^】\]]*[】\]]?/, (m) => m);
  return label.length > 0 && trimmed.length <= 30;
}

// 台本セクション内の空行以外の行を、そのまま1行=1画面として抜き出す
function extractScriptLines(mdText) {
  const lines = mdText.split(/\r?\n/);
  const startIdx = lines.findIndex((l) => isHeadingLine(l.trim(), "台本"));
  if (startIdx === -1) {
    throw new Error(
      "「台本」の見出しが見つかりません（【台本】/ ## 台本 / 台本： などの形式に対応。見出し行が存在するか確認してください）"
    );
  }

  const body = [];
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.length === 0) continue; // 空行はスキップ（見た目の区切りのみ）
    if (isHeadingLine(trimmed)) break; // 次の見出しで終了
    body.push(trimmed);
  }
  if (body.length === 0) throw new Error("台本セクションにテキストが見つかりません");
  return body;
}

function copyToClipboard(text) {
  const tmpFile = "./input/temp/.clipboard-src.txt";
  fs.writeFileSync(tmpFile, text, "utf8");
  try {
    execSync(
      `powershell -NoProfile -Command "Set-Clipboard -Value (Get-Content -Raw -Encoding UTF8 '${path.resolve(tmpFile)}')"`
    );
    return true;
  } catch {
    return false;
  } finally {
    fs.rmSync(tmpFile, { force: true });
  }
}

function main() {
  const mdArg = process.argv[2];
  let mdPath = mdArg ?? findLatestMd();
  if (mdArg && !fs.existsSync(mdPath)) {
    // ファイル名だけ指定された場合は scripts/ 内を探す
    const fallback = path.join(SCRIPTS_DIR, mdArg);
    if (fs.existsSync(fallback)) mdPath = fallback;
  }
  if (!fs.existsSync(mdPath)) {
    console.error(`❌ ファイルが見つかりません: ${mdPath}`);
    process.exit(1);
  }

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

  const mdText = fs.readFileSync(mdPath, "utf8");
  const sentences = extractScriptLines(mdText);

  const PROJECT_DIR = path.join("./input/lines", projectFolder);
  fs.mkdirSync(PROJECT_DIR, { recursive: true });
  fs.mkdirSync("./input/temp", { recursive: true });

  // 1) プロジェクト用テキスト（001\tテキスト）
  const numberedLines = sentences.map((text, i) => `${String(i + 1).padStart(3, "0")}\t${text}`);
  const TXT_FILE = path.join(PROJECT_DIR, `${projectFolder}.txt`);
  fs.writeFileSync(TXT_FILE, numberedLines.join("\n"), "utf8");

  // 2) VOICEVOX貼り付け用プレーンテキスト（番号なし・1行1文）
  const plainText = sentences.join("\n");
  fs.writeFileSync(PASTE_FILE, plainText, "utf8");

  const copied = copyToClipboard(plainText);

  console.log(`✓ ${sentences.length}件のセリフを抽出しました（${mdPath}）\n`);
  console.log("--- 抽出結果（必ず目視確認してください） ---");
  numberedLines.forEach((l) => console.log(`  ${l}`));
  console.log("--- ここまで ---\n");

  console.log(`✓ ${TXT_FILE} を生成しました`);
  console.log(`✓ ${PASTE_FILE} を生成しました`);
  console.log(copied ? "📋 クリップボードにコピーしました（そのままCtrl+Vで貼り付け可）" : `⚠️  クリップボードへのコピーに失敗。${PASTE_FILE} から手動でコピーしてください`);

  console.log("\n次のステップ:");
  console.log("  1. VOICEVOXにペースト（Ctrl+V）→ 1行ずつ読みを確認・修正、速度90%に設定");
  console.log(`  2.「テキストを繋げて書き出し」で ${PROJECT_DIR} にWAVを書き出す`);
  console.log(`  3. 強調したい箇所があれば ${TXT_FILE} を直接編集して [[ ]] を追加`);
  console.log("  4. npm run build-data\n");
}

main();
