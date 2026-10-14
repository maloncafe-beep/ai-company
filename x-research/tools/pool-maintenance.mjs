#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ARCHIVES_DIR = join(ROOT, "archives");
const SNAPSHOTS_DIR = join(ARCHIVES_DIR, "snapshots");

const POOLS = {
  iwakan: {
    path: join(ROOT, "iwakan-theme-pool.json"),
    dateField: "researchedAt",
    archivePrefix: "iwakan-theme-pool",
    defaultEligible: (item) => item.status !== "new" || Boolean(item.notePoolExportedAt),
  },
  note: {
    path: join(ROOT, "note-theme-pool.json"),
    dateField: "createdAt",
    archivePrefix: "note-theme-pool",
    defaultEligible: (item) => item.status !== "idea" || Boolean(item.articlePath),
  },
};

function parseArgs() {
  const [command = "summary", ...rest] = process.argv.slice(2);
  const options = {
    command,
    pool: "all",
    before: "",
    apply: false,
    includeNew: false,
    includeIdeas: false,
    status: "",
  };

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg === "--pool" && rest[i + 1]) options.pool = rest[++i];
    if (arg === "--before" && rest[i + 1]) options.before = rest[++i];
    if (arg === "--apply") options.apply = true;
    if (arg === "--include-new") options.includeNew = true;
    if (arg === "--include-ideas") options.includeIdeas = true;
    if (arg === "--status" && rest[i + 1]) options.status = rest[++i];
    if (arg === "--help" || arg === "-h" || arg === "help") {
      printHelp();
      process.exit(0);
    }
  }

  if (!["summary", "archive"].includes(options.command)) {
    throw new Error("command は summary / archive のどちらかを指定してください。");
  }
  if (!["all", "iwakan", "note"].includes(options.pool)) {
    throw new Error("--pool は all / iwakan / note のどれかを指定してください。");
  }
  if (options.before && Number.isNaN(Date.parse(options.before))) {
    throw new Error("--before は YYYY-MM-DD 形式で指定してください。");
  }
  return options;
}

function printHelp() {
  console.log(`Xリサーチ プール整理

基本:
  npm run pool:summary
  npm run pool:archive -- --before 2026-09-01
  npm run pool:archive -- --before 2026-09-01 --apply

オプション:
  --pool <種類>       all / iwakan / note。初期値: all
  --before <日付>     指定日より前の項目を対象にする
  --apply             実際にアーカイブする。省略時はドライラン
  --include-new       iwakan の status:new も対象に含める
  --include-ideas     note の status:idea も対象に含める
  --status <状態>     指定statusだけを対象にする
`);
}

function readJsonArray(path) {
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, "utf-8"));
}

function writeJsonArray(path, items) {
  writeFileSync(path, `${JSON.stringify(items, null, 2)}\n`, "utf-8");
}

function uniqueById(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = item.id || JSON.stringify(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function monthKey(value) {
  const text = String(value || "unknown");
  const match = text.match(/^(\d{4})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}` : "unknown";
}

function selectedPools(pool) {
  return pool === "all" ? Object.entries(POOLS) : [[pool, POOLS[pool]]];
}

function summarizePool(name, config, items, options) {
  const byStatus = {};
  for (const item of items) {
    const status = item.status || "(none)";
    byStatus[status] = (byStatus[status] || 0) + 1;
  }
  const eligible = findArchiveCandidates(name, config, items, options);
  console.log(`${name}: total=${items.length} eligible=${eligible.length}`);
  console.log(`  status=${JSON.stringify(byStatus)}`);
}

function findArchiveCandidates(name, config, items, options) {
  const beforeTime = options.before ? Date.parse(options.before) : null;
  return items.filter((item) => {
    if (options.status && item.status !== options.status) return false;

    const itemTime = Date.parse(item[config.dateField] || "");
    if (beforeTime !== null && !(itemTime < beforeTime)) return false;

    if (name === "iwakan" && options.includeNew) return true;
    if (name === "note" && options.includeIdeas) return true;
    return config.defaultEligible(item);
  });
}

function archivePool(name, config, items, candidates, options) {
  if (!candidates.length) return;

  mkdirSync(ARCHIVES_DIR, { recursive: true });
  mkdirSync(SNAPSHOTS_DIR, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const snapshotPath = join(SNAPSHOTS_DIR, `${stamp}_${config.archivePrefix}.before.json`);
  writeJsonArray(snapshotPath, items);

  const candidateIds = new Set(candidates.map((item) => item.id || JSON.stringify(item)));
  const remaining = items.filter((item) => !candidateIds.has(item.id || JSON.stringify(item)));
  const groups = new Map();
  for (const item of candidates) {
    const key = monthKey(item[config.dateField]);
    groups.set(key, [...(groups.get(key) || []), item]);
  }

  for (const [key, group] of groups) {
    const archivePath = join(ARCHIVES_DIR, `${config.archivePrefix}-${key}.json`);
    const archived = readJsonArray(archivePath);
    writeJsonArray(archivePath, uniqueById([...archived, ...group]));
    console.log(`  archived ${group.length}: ${archivePath}`);
  }

  writeJsonArray(config.path, remaining);
  console.log(`  snapshot: ${snapshotPath}`);
  console.log(`  remaining: ${remaining.length}`);
}

function main() {
  const options = parseArgs();
  for (const [name, config] of selectedPools(options.pool)) {
    const items = readJsonArray(config.path);
    if (options.command === "summary") {
      summarizePool(name, config, items, options);
      continue;
    }

    const candidates = findArchiveCandidates(name, config, items, options);
    console.log(`${name}: archive candidates=${candidates.length} total=${items.length}`);
    if (!options.apply) {
      console.log("  dry-run: 実行するには --apply を付けてください。");
      continue;
    }
    archivePool(name, config, items, candidates, options);
  }
}

main();
