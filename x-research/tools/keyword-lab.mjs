#!/usr/bin/env node

import { spawn } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RESULTS_DIR = join(ROOT, "results");
const PROFILE_PATH = join(ROOT, "keyword-profiles.json");
const IWAKAN_POOL_PATH = join(ROOT, "iwakan-theme-pool.json");
const NOTE_POOL_PATH = join(ROOT, "note-theme-pool.json");

const NOTE_SIGNALS = [
  "構造",
  "制度",
  "評価",
  "職場",
  "空気",
  "同調圧力",
  "心理的安全性",
  "属人化",
  "本音",
  "建前",
  "普通",
  "役割",
  "責任",
  "納得",
  "疲弊",
  "言えない",
  "助けて",
  "わからない",
  "正論",
  "共感",
  "見えない仕事",
  "やって当たり前",
  "便利屋",
  "裏方",
  "雑務",
  "感謝されない",
  "報われない",
  "仕事が増える",
  "できる人",
  "放置",
  "ほったらかし",
];

const WEAK_SIGNALS = [
  "健康診断",
  "副業",
  "投資",
  "稼げる",
  "AIツール",
  "ニュース",
  "政治",
  "芸能",
  "病気",
  "医療",
];

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    profiles: PROFILE_PATH,
    days: 90,
    themes: 8,
    skip: 0,
    limit: 5,
    provider: "x-api",
    dryRun: false,
    notePool: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if ((arg === "--help" || arg === "-h" || arg === "help")) {
      printHelp();
      process.exit(0);
    }
    if (arg === "--profiles" && args[i + 1]) options.profiles = resolve(ROOT, args[++i]);
    if (arg === "--days" && args[i + 1]) options.days = Number(args[++i]);
    if (arg === "--themes" && args[i + 1]) options.themes = Number(args[++i]);
    if (arg === "--skip" && args[i + 1]) options.skip = Number(args[++i]);
    if (arg === "--limit" && args[i + 1]) options.limit = Number(args[++i]);
    if (arg === "--provider" && args[i + 1]) options.provider = String(args[++i]).toLowerCase();
    if (arg === "--dry-run") options.dryRun = true;
    if (arg === "--note-pool") options.notePool = true;
  }

  if (!Number.isFinite(options.days) || options.days <= 0) throw new Error("--days は1以上の数値で指定してください。");
  if (!Number.isFinite(options.themes) || options.themes <= 0) throw new Error("--themes は1以上の数値で指定してください。");
  if (!Number.isFinite(options.skip) || options.skip < 0) throw new Error("--skip は0以上の数値で指定してください。");
  if (!Number.isFinite(options.limit) || options.limit <= 0) throw new Error("--limit は1以上の数値で指定してください。");
  if (!["x-api", "grok"].includes(options.provider)) throw new Error("--provider は x-api / grok のどちらかです。");
  return options;
}

function printHelp() {
  console.log(`キーワード実験ランナー

基本:
  npm run keyword:lab -- --dry-run
  npm run keyword:lab -- --limit 5 --themes 8

オプション:
  --profiles <path>  検索軸JSON。初期値: keyword-profiles.json
  --limit <数値>     実行する検索軸数。初期値: 5
  --skip <数値>      先頭からスキップする検索軸数。初期値: 0
  --days <数値>      X検索の対象日数。初期値: 90
  --themes <数値>    1軸ごとの抽出テーマ数。初期値: 8
  --provider <種類>  x-api または grok。初期値: x-api
  --note-pool        research:to-note 相当でNoteテーマプール化まで行う
  --dry-run          X APIは叩かず、検索計画レポートだけ作る
`);
}

function readJsonArray(path) {
  if (!existsSync(path)) return [];
  const parsed = JSON.parse(readFileSync(path, "utf-8"));
  if (!Array.isArray(parsed)) throw new Error(`${path} はJSON配列である必要があります。`);
  return parsed;
}

function idSet(items) {
  return new Set(items.map((item) => item.id).filter(Boolean));
}

function loadProfiles(path) {
  return readJsonArray(path)
    .map((profile, index) => ({
      name: String(profile.name || `profile-${index + 1}`).trim(),
      query: String(profile.query || "").trim(),
    }))
    .filter((profile) => profile.query);
}

function scoreTheme(theme) {
  const text = [
    theme.theme,
    theme.observed_pattern,
    theme.iwakan,
    theme.reader_voice,
    theme.structure_hypothesis,
    theme.post_angle,
    theme.generate_theme,
    ...(Array.isArray(theme.search_keywords) ? theme.search_keywords : []),
  ].join(" ");

  let score = 0;
  const reasons = [];
  for (const signal of NOTE_SIGNALS) {
    if (!text.includes(signal)) continue;
    score += 1;
    if (reasons.length < 4) reasons.push(signal);
  }
  for (const signal of WEAK_SIGNALS) {
    if (!text.includes(signal)) continue;
    score -= 2;
    reasons.push(`弱:${signal}`);
  }

  const rank = score >= 5 ? "A" : score >= 3 ? "B" : score >= 1 ? "C" : "D";
  return { score, rank, reasons };
}

function summarizeProfile(profile, themes) {
  const scored = themes.map((theme) => ({ ...theme, keywordLab: scoreTheme(theme) }));
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const item of scored) counts[item.keywordLab.rank] += 1;
  const average = scored.length
    ? scored.reduce((sum, item) => sum + item.keywordLab.score, 0) / scored.length
    : 0;
  const recommendation = counts.A >= 2 || average >= 4 ? "残す" : counts.A + counts.B >= 2 ? "様子見" : "外す候補";
  return { profile, themes: scored, counts, average, recommendation, materialCount: null };
}

function runResearch(profile, options) {
  const command = process.execPath;
  const args = [
    join(ROOT, "tools", "x-research.mjs"),
    "--research-only",
    "--days",
    String(options.days),
    "--themes",
    String(options.themes),
    "--provider",
    options.provider,
    "--no-base-queries",
    "--query",
    profile.query,
  ];
  if (options.notePool) args.splice(2, 0, "--note-pool");

  return new Promise((resolveRun) => {
    const child = spawn(command, args, { cwd: ROOT, shell: false, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdout += text;
      process.stdout.write(text);
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      process.stderr.write(text);
    });
    child.on("close", (code) => resolveRun({ code, stdout, stderr }));
  });
}

function newItems(path, beforeIds) {
  const items = readJsonArray(path);
  return items.filter((item) => item.id && !beforeIds.has(item.id));
}

function extractMaterialCount(output) {
  const match = String(output || "").match(/OpenAIで違和感テーマに整理中:\s*(\d+)\s*件の投稿材料/);
  return match ? Number(match[1]) : null;
}

function buildMarkdown({ options, profiles, summaries, failures, dryRun }) {
  const now = new Date().toISOString();
  const lines = [
    "# キーワード実験レポート",
    "",
    `- createdAt: ${now}`,
    `- mode: ${dryRun ? "dry-run" : "run"}`,
    `- profiles: ${profiles.length}`,
    `- days: ${options.days}`,
    `- themesPerProfile: ${options.themes}`,
    `- provider: ${options.provider}`,
    `- notePool: ${options.notePool}`,
    "",
    "## 今回試した検索軸",
    "",
  ];

  for (const [index, profile] of profiles.entries()) {
    lines.push(`${index + 1}. ${profile.name}`);
    lines.push(`   - query: ${profile.query}`);
  }

  if (dryRun) {
    lines.push("", "## 次の操作", "", "dry-run のためX API検索は実行していません。実行する場合は `--dry-run` を外してください。");
    return lines.join("\n") + "\n";
  }

  lines.push("", "## 検索軸ごとの判定", "");
  for (const summary of summaries) {
    lines.push(`### ${summary.profile.name}`);
    lines.push("");
    lines.push(`- query: ${summary.profile.query}`);
    lines.push(`- themes: ${summary.themes.length}`);
    lines.push(`- materialPosts: ${summary.materialCount ?? "unknown"}`);
    lines.push(`- rankCounts: A=${summary.counts.A} / B=${summary.counts.B} / C=${summary.counts.C} / D=${summary.counts.D}`);
    lines.push(`- averageScore: ${summary.average.toFixed(1)}`);
    lines.push(`- recommendation: ${summary.recommendation}`);
    lines.push("");

    for (const theme of summary.themes.slice(0, 8)) {
      const reasons = theme.keywordLab.reasons.length ? theme.keywordLab.reasons.join(", ") : "signalなし";
      lines.push(`- [${theme.keywordLab.rank}] ${theme.theme || "(no theme)"}`);
      lines.push(`  - 違和感: ${theme.iwakan || ""}`);
      lines.push(`  - 構造仮説: ${theme.structure_hypothesis || ""}`);
      lines.push(`  - 判定理由: ${reasons}`);
    }
    lines.push("");
  }

  const keep = summaries.filter((summary) => summary.recommendation === "残す");
  const watch = summaries.filter((summary) => summary.recommendation === "様子見");
  const lowMaterial = summaries.filter((summary) => summary.recommendation === "材料不足");
  const drop = summaries.filter((summary) => summary.recommendation === "外す候補");

  lines.push("## 次回残す候補", "");
  for (const summary of keep) lines.push(`- ${summary.profile.name}: ${summary.profile.query}`);
  if (!keep.length) lines.push("- なし");

  lines.push("", "## 次回様子見", "");
  for (const summary of watch) lines.push(`- ${summary.profile.name}: ${summary.profile.query}`);
  if (!watch.length) lines.push("- なし");

  lines.push("", "## 材料不足", "");
  for (const summary of lowMaterial) lines.push(`- ${summary.profile.name}: ${summary.profile.query}`);
  if (!lowMaterial.length) lines.push("- なし");

  lines.push("", "## 次回外す候補", "");
  for (const summary of drop) lines.push(`- ${summary.profile.name}: ${summary.profile.query}`);
  if (!drop.length) lines.push("- なし");

  if (failures.length) {
    lines.push("", "## 実行失敗", "");
    for (const failure of failures) {
      lines.push(`- ${failure.profile.name}: exit=${failure.result.code}`);
      const message = (failure.result.stderr || failure.result.stdout || "").trim().split(/\r?\n/).slice(-3).join(" / ");
      if (message) lines.push(`  - message: ${message}`);
    }
  }

  return lines.join("\n") + "\n";
}

async function main() {
  const options = parseArgs();
  const profiles = loadProfiles(options.profiles).slice(options.skip, options.skip + options.limit);
  if (!profiles.length) throw new Error("実行できる検索軸がありません。");

  mkdirSync(RESULTS_DIR, { recursive: true });

  const summaries = [];
  const failures = [];
  const dryRun = options.dryRun;

  if (!dryRun) {
    for (const profile of profiles) {
      console.log(`\n=== keyword profile: ${profile.name} ===`);
      const beforeIwakanIds = idSet(readJsonArray(IWAKAN_POOL_PATH));
      const beforeNoteIds = idSet(readJsonArray(NOTE_POOL_PATH));
      const result = await runResearch(profile, options);
      if (result.code !== 0) {
        failures.push({ profile, result });
        continue;
      }
      const themes = newItems(IWAKAN_POOL_PATH, beforeIwakanIds);
      const noteThemes = options.notePool ? newItems(NOTE_POOL_PATH, beforeNoteIds) : [];
      const summary = summarizeProfile(profile, themes);
      summary.materialCount = extractMaterialCount(result.stdout);
      if (summary.materialCount !== null && summary.materialCount < 5 && summary.recommendation !== "外す候補") {
        summary.recommendation = "材料不足";
      }
      summary.noteThemes = noteThemes;
      summaries.push(summary);
    }
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const reportPath = join(RESULTS_DIR, `${stamp}_keyword_lab.md`);
  const markdown = buildMarkdown({ options, profiles, summaries, failures, dryRun });
  writeFileSync(reportPath, markdown, "utf-8");
  console.log(`\nキーワード実験レポート: ${reportPath}`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
