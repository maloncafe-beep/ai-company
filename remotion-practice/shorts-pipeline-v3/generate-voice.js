/**
 * generate-voice.js (shorts-pipeline-v3)
 *
 * input/lines/{project_folder}/{project_folder}.txt（001\tテキスト 形式）を読み込み、
 * ローカルで起動中のVOICEVOXエンジン（http://127.0.0.1:50021）に直接リクエストして
 * 1行ずつWAVを合成し、同フォルダに 001_話者（スタイル）_テキスト….wav として書き出す。
 *
 * これまで手動でVOICEVOXアプリにコピペ→速度90%→WAV書き出ししていた工程を自動化する。
 *
 * 事前準備: VOICEVOXアプリ（またはエンジン）を起動しておくこと。
 *
 * meta.json に以下を追加すると話者・速度を変更できる（省略時は青山龍星/ノーマル/0.9）:
 *   "voice": { "speakerName": "青山龍星", "styleName": "ノーマル", "speedScale": 0.9 }
 *
 * 使い方:
 *   node generate-voice.js
 */

import fs from "fs";
import path from "path";

const VOICEVOX_URL = process.env.VOICEVOX_URL || "http://127.0.0.1:50021";
const META_PATH = "./input/meta.json";

async function findStyleId(speakerName, styleName) {
  let res;
  try {
    res = await fetch(`${VOICEVOX_URL}/speakers`);
  } catch {
    throw new Error(
      `VOICEVOXエンジンに接続できません（${VOICEVOX_URL}）。VOICEVOXアプリを起動してください`
    );
  }
  if (!res.ok) throw new Error(`話者一覧の取得に失敗しました (status ${res.status})`);
  const speakers = await res.json();
  const speaker = speakers.find((s) => s.name === speakerName);
  if (!speaker) {
    const names = speakers.map((s) => s.name).join(", ");
    throw new Error(`話者「${speakerName}」が見つかりません。利用可能: ${names}`);
  }
  const style = speaker.styles.find((st) => st.name === styleName);
  if (!style) {
    const styleNames = speaker.styles.map((st) => st.name).join(", ");
    throw new Error(`話者「${speakerName}」にスタイル「${styleName}」がありません。利用可能: ${styleNames}`);
  }
  return style.id;
}

async function synthesize(text, styleId, speedScale) {
  const queryUrl = `${VOICEVOX_URL}/audio_query?speaker=${styleId}&text=${encodeURIComponent(text)}`;
  const queryRes = await fetch(queryUrl, { method: "POST" });
  if (!queryRes.ok) throw new Error(`audio_query失敗: ${await queryRes.text()}`);
  const query = await queryRes.json();
  query.speedScale = speedScale;

  const synthRes = await fetch(`${VOICEVOX_URL}/synthesis?speaker=${styleId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
  if (!synthRes.ok) throw new Error(`synthesis失敗: ${await synthRes.text()}`);
  return Buffer.from(await synthRes.arrayBuffer());
}

// ファイル名に使えない文字・強調記号 [[ ]] を除去
function sanitizeFilenamePart(text) {
  return text.replace(/\[\[|\]\]/g, "").replace(/[\\/:*?"<>|]/g, "");
}

async function main() {
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

  const voice = meta.voice ?? {};
  const speakerName = voice.speakerName ?? "青山龍星";
  const styleName = voice.styleName ?? "ノーマル";
  const speedScale = voice.speedScale ?? 0.9;

  const PROJECT_DIR = path.join("./input/lines", projectFolder);
  const TXT_FILE = path.join(PROJECT_DIR, `${projectFolder}.txt`);
  if (!fs.existsSync(TXT_FILE)) {
    console.error(`❌ ${TXT_FILE} が見つかりません。先に npm run split を実行してください`);
    process.exit(1);
  }

  const lines = fs
    .readFileSync(TXT_FILE, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const tab = l.indexOf("\t");
      return { num: l.slice(0, tab).padStart(3, "0"), text: l.slice(tab + 1) };
    });

  if (lines.length === 0) {
    console.error(`❌ ${TXT_FILE} に有効な行がありません`);
    process.exit(1);
  }

  console.log(`🎙️  VOICEVOX合成開始: ${speakerName}（${styleName}） speed=${speedScale}  全${lines.length}行\n`);

  const styleId = await findStyleId(speakerName, styleName);

  // 既存wavを削除してから生成（番号ズレ・古いファイルの混在防止）
  for (const f of fs.readdirSync(PROJECT_DIR)) {
    if (/^\d{3}.*\.wav$/i.test(f)) fs.unlinkSync(path.join(PROJECT_DIR, f));
  }

  for (const { num, text } of lines) {
    const wavBuffer = await synthesize(text, styleId, speedScale);
    const shortText = sanitizeFilenamePart(text).slice(0, 10);
    const fileName = `${num}_${speakerName}（${styleName}）_${shortText}….wav`;
    fs.writeFileSync(path.join(PROJECT_DIR, fileName), wavBuffer);
    console.log(`  [${num}] ${text.slice(0, 24)}…`);
  }

  console.log(`\n✅ 完了！ ${lines.length}件のWAVを ${PROJECT_DIR} に生成しました`);
  console.log("次のステップ: npm run build-data\n");
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
