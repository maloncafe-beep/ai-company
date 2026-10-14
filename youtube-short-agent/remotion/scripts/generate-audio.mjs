/**
 * VOICEVOX音声生成スクリプト
 *
 * 使い方：
 *   1. VOICEVOXアプリを起動する
 *   2. node scripts/generate-audio.mjs
 *
 * 生成先：public/audio/
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VOICEVOX_URL = "http://localhost:50021";
const OUTPUT_DIR = path.join(__dirname, "../public/audio");

// ===== 台本（script.tsと内容を合わせること） =====
const segments = [
  {
    file: "intro.wav",
    text: "60代の賢者が「時間の無駄だ」とやめた、5つの口癖をご紹介します。",
  },
  {
    file: "item-1.wav",
    text: "1つ目。「どうせ自分には無理だ」。この言葉を口にするたびに、可能性の扉が閉まっていく。賢者はこう気づいた。「無理」という言葉は、挑戦する前に自分を諦めさせる呪文だと。",
  },
  {
    file: "item-2.wav",
    text: "2つ目。「昔はよかった」。過去を美化するほど、現在が色あせていく。今この瞬間に価値を見出せない人は、未来も輝かせることができない。賢者は今日に全力を注いだ。",
  },
  {
    file: "item-3.wav",
    text: "3つ目。「あの人のせいだ」。他人に責任を押しつけた瞬間、自分の成長が止まる。賢者は知っていた。何が起きても、次にどう動くかは自分で決められると。",
  },
  {
    file: "item-4.wav",
    text: "4つ目。「いつかやろう」。「いつか」という日はカレンダーに存在しない。賢者は小さくてもいい、今日できることを今日やることにした。それだけで人生は変わり始めた。",
  },
  {
    file: "item-5.wav",
    text: "5つ目。「もう年だから」。年齢を言い訳にした瞬間、本当に老いが始まる。賢者は80歳で新しいことを学んだ。人生に「遅すぎる」はない、と自ら証明し続けた。",
  },
  {
    file: "outro.wav",
    text: "最後までご視聴いただきありがとうございます。チャンネル登録・高評価よろしくお願いします。",
  },
];

async function findSpeakerId(speakerName, styleName = "ノーマル") {
  const res = await fetch(`${VOICEVOX_URL}/speakers`);
  if (!res.ok) throw new Error("VOICEVOXに接続できません。アプリが起動しているか確認してください。");
  const speakers = await res.json();

  for (const speaker of speakers) {
    if (speaker.name === speakerName) {
      const style = speaker.styles.find((s) => s.name === styleName);
      if (style) return style.id;
    }
  }
  throw new Error(`話者「${speakerName}（${styleName}）」が見つかりません`);
}

async function synthesize(text, speakerId, outputPath) {
  // Step 1: audio_query
  const queryRes = await fetch(
    `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
    { method: "POST" }
  );
  if (!queryRes.ok) throw new Error(`audio_query失敗: ${await queryRes.text()}`);
  const query = await queryRes.json();

  // 話速を少し遅くする（朗読向け）
  query.speedScale = 0.95;
  query.prePhonemeLength = 0.1;
  query.postPhonemeLength = 0.2;

  // Step 2: synthesis
  const synthRes = await fetch(
    `${VOICEVOX_URL}/synthesis?speaker=${speakerId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    }
  );
  if (!synthRes.ok) throw new Error(`synthesis失敗: ${await synthRes.text()}`);

  const buffer = await synthRes.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));

  // 音声の長さを計算（WAVヘッダから）
  const view = new DataView(buffer);
  const sampleRate = view.getUint32(24, true);
  const numSamples = (buffer.byteLength - 44) / 2; // 16bit mono
  const durationSec = numSamples / sampleRate;
  const durationFrames = Math.ceil(durationSec * 30) + 15; // 30fps + 余白0.5秒

  console.log(`✓ ${path.basename(outputPath)} — ${durationSec.toFixed(1)}秒 → ${durationFrames}フレーム`);
  return durationFrames;
}

async function main() {
  console.log("VOICEVOX音声生成を開始します...\n");

  const speakerId = await findSpeakerId("青山龍星");
  console.log(`話者ID: ${speakerId} (青山龍星 ノーマル)\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const results = [];
  for (const seg of segments) {
    const outputPath = path.join(OUTPUT_DIR, seg.file);
    const frames = await synthesize(seg.text, speakerId, outputPath);
    results.push({ file: seg.file, frames });
  }

  console.log("\n=== 完了 ===");
  console.log("以下の値を src/data/script.ts の durationInFrames に反映してください:\n");
  console.log(`titleDurationInFrames: ${results[0].frames},`);
  results.slice(1, -1).forEach((r, i) => {
    console.log(`items[${i}].durationInFrames: ${r.frames},`);
  });
  console.log(`outroDurationInFrames: ${results[results.length - 1].frames},`);
}

main().catch((err) => {
  console.error("\n❌ エラー:", err.message);
  process.exit(1);
});
