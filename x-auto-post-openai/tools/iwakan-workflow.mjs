#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: join(PROJECT_ROOT, ".env") });

const RESEARCH_DIR = join(PROJECT_ROOT, "projects", "x-research");
const RESULTS_DIR = join(RESEARCH_DIR, "results");
const DATA_DIR = join(RESEARCH_DIR, "data");
const POOL_PATH = join(RESEARCH_DIR, "iwakan-theme-pool.json");
const NOTE_POOL_PATH = join(RESEARCH_DIR, "note-theme-pool.json");
const PROFILE_PATH = join(PROJECT_ROOT, "profile", "profile.json");
const EXCLUDED_THEME_TERMS = ["違和感", "矛盾", "AI", "成長", "勉強"];

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  const options = {
    mode: "all",
    provider: "x-api",
    notePool: false,
    days: 90,
    themes: 12,
    drafts: 3,
    type: "thread",
    query: "効率化 生産性 評価制度 成果主義 役割 期待 同調圧力 世代間ギャップ 働き方改革 多様性",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--research-only") options.mode = "research";
    if (arg === "--draft-only") options.mode = "draft";
    if (arg === "--note-only") {
      options.mode = "note";
      options.notePool = true;
    }
    if (arg === "--note-pool") options.notePool = true;
    if (arg === "--days" && args[i + 1]) options.days = Number(args[++i]);
    if (arg === "--themes" && args[i + 1]) options.themes = Number(args[++i]);
    if (arg === "--drafts" && args[i + 1]) options.drafts = Number(args[++i]);
    if (arg === "--type" && args[i + 1]) options.type = String(args[++i]).toLowerCase();
    if (arg === "--provider" && args[i + 1]) options.provider = String(args[++i]).toLowerCase();
    if (arg === "--query" && args[i + 1]) options.query = args[++i];
  }

  if (!["all", "research", "draft", "note"].includes(options.mode)) {
    throw new Error("mode が不正です");
  }
  if (!["thread", "single"].includes(options.type)) {
    throw new Error("--type は thread / single のどちらかを指定してください");
  }
  if (!["x-api", "grok"].includes(options.provider)) {
    throw new Error("--provider は x-api / grok のどちらかを指定してください");
  }
  return options;
}

function printHelp() {
  console.log(`違和感収集家テーマ運用

基本:
  npm run iwakan

よく使う指定:
  npm run iwakan -- --days 90 --themes 12 --drafts 3
  npm run iwakan -- --research-only --days 60 --themes 20
  npm run iwakan -- --draft-only --drafts 3
  npm run iwakan -- --note-only
  npm run iwakan -- --note-pool --research-only

オプション:
  --research-only   Xからテーマ候補を探してプールに貯めるだけ
  --draft-only      貯めたテーマ候補から投稿文を作ってスプシに追加するだけ
  --note-only       貯めたテーマ候補からNote記事用テーマプールだけ作る
  --note-pool       テーマ候補をNote記事用テーマプールにも変換する
  --days <数値>      何日前まで見るか。初期値: 90
  --themes <数値>    ため込むテーマ候補数。初期値: 12
  --drafts <数値>    スプシに追加する投稿数。初期値: 3
  --type <種類>      thread または single。初期値: thread
  --provider <種類>  x-api または grok。初期値: x-api
  --query <語句>     探したい違和感の方向性
`);
}

function ensureDirs() {
  mkdirSync(RESEARCH_DIR, { recursive: true });
  mkdirSync(RESULTS_DIR, { recursive: true });
  mkdirSync(DATA_DIR, { recursive: true });
}

function readSimpleXaiConfig() {
  const candidates = [join(PROJECT_ROOT, "config.yaml"), join(RESEARCH_DIR, "config.yaml")];
  for (const path of candidates) {
    if (!existsSync(path)) continue;
    const text = readFileSync(path, "utf-8");
    const match = text.match(/xai:\s*[\r\n]+(?:\s+[^\r\n]*[\r\n]+)*?\s+api_key:\s*["']?([^"'\r\n#]+)["']?/);
    if (match) return match[1].trim();
  }
  return "";
}

function getXaiKey() {
  return process.env.XAI_API_KEY || readSimpleXaiConfig();
}

function hasXPostKeys() {
  return Boolean(
    process.env.X_API_KEY &&
      process.env.X_API_KEY_SECRET &&
      process.env.X_ACCESS_TOKEN &&
      process.env.X_ACCESS_TOKEN_SECRET
  );
}

function getXPostClientConfig() {
  const { X_API_KEY, X_API_KEY_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET } = process.env;
  if (!X_API_KEY || !X_API_KEY_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_TOKEN_SECRET) {
    throw new Error("X_API_KEY / X_API_KEY_SECRET / X_ACCESS_TOKEN / X_ACCESS_TOKEN_SECRET が .env に必要です。");
  }
  return {
    appKey: X_API_KEY,
    appSecret: X_API_KEY_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_TOKEN_SECRET,
  };
}

function readPool() {
  if (!existsSync(POOL_PATH)) return [];
  return JSON.parse(readFileSync(POOL_PATH, "utf-8"));
}

function writePool(pool) {
  writeFileSync(POOL_PATH, `${JSON.stringify(pool, null, 2)}\n`, "utf-8");
}

function readNotePool() {
  if (!existsSync(NOTE_POOL_PATH)) return [];
  return JSON.parse(readFileSync(NOTE_POOL_PATH, "utf-8"));
}

function writeNotePool(pool) {
  writeFileSync(NOTE_POOL_PATH, `${JSON.stringify(pool, null, 2)}\n`, "utf-8");
}

function extractJsonArray(text) {
  try {
    return JSON.parse(text);
  } catch {}
  const fenced = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
  if (fenced) return JSON.parse(fenced[1]);
  const array = text.match(/\[[\s\S]*\]/);
  if (array) return JSON.parse(array[0]);
  throw new Error("応答から JSON 配列を抽出できませんでした");
}

function includesExcludedThemeTerm(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value || {});
  return EXCLUDED_THEME_TERMS.some((term) => text.includes(term));
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function buildResearchPrompt({ query, themes, fromDate, toDate }) {
  return `X（Twitter）上の日本語投稿から、「違和感収集家」アカウントの投稿テーマになりそうなネタを探してください。

# 期間
${fromDate} から ${toDate}

# 見たいもの
${query}

# 目的
正確な投稿数、いいね数、RT数、ランキングは不要です。
複数の投稿に共通する「言語化されていない違和感」「日常のズレ」「読者が自分のことだと思いやすい悩み」を抽出してください。
個人の落ち込みや弱音そのものではなく、社会・職場・家族・制度・評価・常識の中にある構造的なズレを優先してください。

# 優先するテーマ
- 仕事や生活の中で、制度や期待と実態が噛み合っていない場面
- 人間関係でよくある言葉と本音のズレ
- 制度や仕組みの言葉と、現場で起きていることのズレ
- 「よいこと」とされる施策が、別の負担や沈黙を生む場面
- 誰かを責めず、自分の内側に戻せる問いになるもの

# 避ける方向
- 感情の重さを直接テーマにするもの
- ネガティブな体験談だけで終わるもの
- 個人のメンタル不調だけに寄ったもの

# 除外
- 炎上、政治、芸能、事件、ニュース紹介
- 特定個人や会社を攻撃するもの
- AIツール紹介、稼げる系、ノウハウ販売に直結するもの
- 投稿本文の長い引用
- いいね数やRT数を根拠にした順位付け

# 出力
${themes}件。以下のJSON配列のみで返してください。

[
  {
    "theme": "短いテーマ名",
    "observed_pattern": "X上で見えた反応や会話の傾向",
    "iwakan": "中心にある違和感",
    "reader_voice": "読者が内心で言いそうな一言",
    "structure_hypothesis": "なぜそのズレが起きているかの仮説",
    "post_angle": "X投稿にするならどの角度で切り出すか",
    "generate_theme": "投稿生成に渡せる具体的なテーマ文",
    "search_keywords": ["追加で深掘りする検索語"],
    "notes": "扱うときの注意点"
  }
]`;
}

function buildThemeSynthesisPrompt({ query, themes, fromDate, toDate, posts }) {
  return `以下はX APIで取得した日本語投稿の抜粋です。
この投稿群を材料にして、「違和感収集家」アカウントの投稿テーマになりそうなネタを抽出してください。

# 検索期間の目安
${fromDate} から ${toDate}

# 検索語
${query}

# 投稿抜粋
${JSON.stringify(posts, null, 2)}

# 目的
正確な投稿数、いいね数、RT数、ランキングは不要です。
複数の投稿に共通する「言語化されていない違和感」「日常のズレ」「読者が自分のことだと思いやすい悩み」を抽出してください。
個人の落ち込みや弱音そのものではなく、社会・職場・家族・制度・評価・常識の中にある構造的なズレを優先してください。

# 優先するテーマ
- 仕事や生活の中で、制度や期待と実態が噛み合っていない場面
- 人間関係でよくある言葉と本音のズレ
- 制度や仕組みの言葉と、現場で起きていることのズレ
- 「よいこと」とされる施策が、別の負担や沈黙を生む場面
- 誰かを責めず、自分の内側に戻せる問いになるもの

# 避ける方向
- 感情の重さを直接テーマにするもの
- ネガティブな体験談だけで終わるもの
- 個人のメンタル不調だけに寄ったもの

# 除外
- 炎上、政治、芸能、事件、ニュース紹介
- 特定個人や会社を攻撃するもの
- AIツール紹介、稼げる系、ノウハウ販売に直結するもの
- 投稿本文の長い引用

# 出力
${themes}件。以下のJSON配列のみで返してください。

[
  {
    "theme": "短いテーマ名",
    "observed_pattern": "X上で見えた反応や会話の傾向",
    "iwakan": "中心にある違和感",
    "reader_voice": "読者が内心で言いそうな一言",
    "structure_hypothesis": "なぜそのズレが起きているかの仮説",
    "post_angle": "X投稿にするならどの角度で切り出すか",
    "generate_theme": "投稿生成に渡せる具体的なテーマ文",
    "search_keywords": ["追加で深掘りする検索語"],
    "notes": "扱うときの注意点"
  }
]`;
}

function buildThemeMarkdown(themes, title) {
  const lines = [`# ${title}`, "", `- count: ${themes.length}`, ""];
  for (const [index, theme] of themes.entries()) {
    lines.push(`## ${index + 1}. ${theme.theme || "N/A"}`, "");
    lines.push(`- 状態: ${theme.status || "new"}`);
    lines.push(`- 違和感: ${theme.iwakan || ""}`);
    lines.push(`- 読者の内心: ${theme.reader_voice || ""}`);
    lines.push(`- 投稿化の角度: ${theme.post_angle || ""}`);
    lines.push("");
    lines.push("### generate-posts用テーマ");
    lines.push(theme.generate_theme || theme.theme || "");
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

function buildNotePoolPrompt(themes) {
  return `以下はX上の反応から抽出した「違和感収集家」向けテーマ候補です。
これを note-project-maloncafe の記事制作時に使える「Note記事用テーマプール」に変換してください。

# テーマ候補
${JSON.stringify(themes, null, 2)}

# 方針
- note記事の本編候補として使える粒度にする
- X投稿より深く、「違和感の代弁」と「違和感の解体」に分ける
- AIツール紹介、ノウハウ販売、煽り、断定口調に寄せない
- 読者が「自分のことかもしれない」と感じる入口を優先する
- 有料記事にする場合も、無料部分だけで違和感の代弁として価値がある形にする

# 出力
JSON配列のみで返してください。

[
  {
    "sourceThemeId": "元テーマのid",
    "articleTheme": "Note記事テーマ",
    "workingTitle": "仮タイトル",
    "reader": "想定読者",
    "openingIwakan": "冒頭で代弁する違和感",
    "freePart": "無料部分で扱うこと",
    "paidPart": "有料部分に広げるなら扱うこと",
    "outline": ["見出し案"],
    "xAnnouncement": "記事公開時のX告知文の種",
    "keywords": ["関連キーワード"],
    "notes": "扱うときの注意点"
  }
]`;
}

function buildNotePoolMarkdown(items, title) {
  const lines = [`# ${title}`, "", `- count: ${items.length}`, ""];
  for (const [index, item] of items.entries()) {
    lines.push(`## ${index + 1}. ${item.workingTitle || item.articleTheme || "N/A"}`, "");
    lines.push(`- sourceThemeId: ${item.sourceThemeId || ""}`);
    lines.push(`- 想定読者: ${item.reader || ""}`);
    lines.push("");
    lines.push("### 冒頭の違和感");
    lines.push(item.openingIwakan || "");
    lines.push("");
    lines.push("### 無料部分");
    lines.push(item.freePart || "");
    lines.push("");
    if (item.paidPart) {
      lines.push("### 有料部分に広げるなら");
      lines.push(item.paidPart);
      lines.push("");
    }
    if (Array.isArray(item.outline) && item.outline.length) {
      lines.push("### 構成案");
      for (const heading of item.outline) {
        lines.push(`- ${heading}`);
      }
      lines.push("");
    }
    if (item.xAnnouncement) {
      lines.push("### X告知文の種");
      lines.push(item.xAnnouncement);
      lines.push("");
    }
  }
  return `${lines.join("\n")}\n`;
}

async function researchThemes(options) {
  if (options.provider === "x-api") {
    return researchThemesWithXApi(options);
  }

  const xaiKey = getXaiKey();
  if (!xaiKey) {
    const suffix = hasXPostKeys()
      ? "なお、.env の X_API_KEY はX投稿用のOAuthキーで、Grok x_search には使えません。"
      : "";
    throw new Error(`XAI_API_KEY が .env にありません。${suffix}`);
  }

  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - options.days);
  const fromDate = formatDate(from);
  const toDate = formatDate(to);
  const prompt = buildResearchPrompt({ ...options, fromDate, toDate });

  console.log(`Xテーマリサーチ中: ${fromDate} - ${toDate}`);
  const response = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${xaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-4-1-fast",
      input: [{ role: "user", content: prompt }],
      tools: [{ type: "x_search", from_date: fromDate, to_date: toDate }],
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message || `xAI API request failed with status ${response.status}`);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const rawPath = join(DATA_DIR, `${stamp}_iwakan_raw.json`);
  writeFileSync(rawPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");

  let content = "";
  for (const item of payload.output || []) {
    if (item.type !== "message") continue;
    for (const part of item.content || []) {
      if (part.type === "output_text") content += part.text || "";
    }
  }

  const themes = extractJsonArray(content).filter((theme) => !includesExcludedThemeTerm(theme)).map((theme, index) => ({
    id: `iwakan-${Date.now()}-${String(index + 1).padStart(2, "0")}`,
    researchedAt: new Date().toISOString(),
    sourceRange: `${fromDate}..${toDate}`,
    query: options.query,
    status: "new",
    draftedAt: "",
    postIds: [],
    ...theme,
  }));

  const pool = readPool();
  pool.push(...themes);
  writePool(pool);

  const mdPath = join(RESULTS_DIR, `${stamp}_iwakan_theme_research.md`);
  writeFileSync(mdPath, buildThemeMarkdown(themes, "違和感収集家 Xテーマリサーチ"), "utf-8");

  console.log(`テーマ候補を ${themes.length} 件ため込みました`);
  console.log(`テーマプール: ${POOL_PATH}`);
  console.log(`今回のレポート: ${mdPath}`);
  console.log(`Raw: ${rawPath}`);
  return themes;
}

function buildSearchQueries(query) {
  const seeds = String(query)
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const pairs = [];
  for (let i = 0; i < seeds.length && pairs.length < 6; i += 2) {
    pairs.push(seeds.slice(i, i + 2).join(" "));
  }
  const baseQueries = [
    "働き方改革 現場",
    "多様性 同調圧力",
    "生産性 余白",
    "評価制度 納得感",
  ];
  return [...pairs, ...baseQueries]
    .filter(Boolean)
    .slice(0, 8)
    .map((item) => `${item} lang:ja -is:retweet`);
}

async function collectTweetsWithXApi(options) {
  const { TwitterApi } = await import("twitter-api-v2");
  const client = new TwitterApi(getXPostClientConfig());
  const queries = buildSearchQueries(options.query);
  const posts = [];

  for (const query of queries) {
    console.log(`  検索: ${query}`);
    const result = await client.v2.search(query, {
      max_results: 10,
      "tweet.fields": ["created_at", "public_metrics", "lang"],
    });
    const tweets = result.tweets || [];
    for (const tweet of tweets) {
      if (!tweet.text || posts.some((post) => post.id === tweet.id)) continue;
      posts.push({
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at || "",
        source_query: query,
      });
    }
  }

  return posts;
}

async function researchThemesWithXApi(options) {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - options.days);
  const fromDate = formatDate(from);
  const toDate = formatDate(to);

  console.log(`X APIで投稿の材料を検索中: ${fromDate} - ${toDate}`);
  console.log("注: X APIの契約プランにより、実際に検索できる過去期間は制限される場合があります。");
  const posts = await collectTweetsWithXApi(options);
  if (!posts.length) {
    throw new Error("X APIから投稿を取得できませんでした。検索語を変えるか、X APIの利用プランを確認してください。");
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const rawPath = join(DATA_DIR, `${stamp}_x_api_posts.json`);
  writeFileSync(rawPath, `${JSON.stringify(posts, null, 2)}\n`, "utf-8");

  const { createOpenAITextResponse } = await import("./lib/openai.mjs");
  const prompt = buildThemeSynthesisPrompt({
    ...options,
    fromDate,
    toDate,
    posts,
  });
  console.log(`OpenAIで違和感テーマに整理中: ${posts.length} 件の投稿材料`);
  const content = await createOpenAITextResponse(prompt, { maxOutputTokens: 8192 });
  const themes = extractJsonArray(content).filter((theme) => !includesExcludedThemeTerm(theme)).map((theme, index) => ({
    id: `iwakan-${Date.now()}-${String(index + 1).padStart(2, "0")}`,
    researchedAt: new Date().toISOString(),
    sourceRange: `${fromDate}..${toDate}`,
    query: options.query,
    provider: "x-api",
    status: "new",
    draftedAt: "",
    postIds: [],
    ...theme,
  }));

  const pool = readPool();
  pool.push(...themes);
  writePool(pool);

  const mdPath = join(RESULTS_DIR, `${stamp}_iwakan_theme_research.md`);
  writeFileSync(mdPath, buildThemeMarkdown(themes, "違和感収集家 Xテーマリサーチ"), "utf-8");

  console.log(`テーマ候補を ${themes.length} 件ため込みました`);
  console.log(`テーマプール: ${POOL_PATH}`);
  console.log(`今回のレポート: ${mdPath}`);
  console.log(`取得投稿: ${rawPath}`);
  return themes;
}

function buildDraftPrompt(profile, themes, type) {
  return `あなたはX投稿の企画と文案を作る編集者です。

以下の「違和感テーマ候補」を、@maloncafe の「違和感収集家」向けX投稿にしてください。

# profile.json
${JSON.stringify(profile, null, 2)}

# 投稿タイプ
${type}

# テーマ候補
${JSON.stringify(themes, null, 2)}

# 投稿ルール
- 営業色、ノウハウ販売、AIツール紹介に寄せない
- 誰かを責めず、自分の内側に戻せる問いにする
- 断定しすぎず、日常のズレを観察する文にする
- type が "thread" の場合は、必ず2ツイートにする
- thread は「現象 → ズレ → 構造仮説 → 次の実験」の流れを2ツイートに圧縮する
- thread の text は "---" 区切りで返す
- 1ツイート目: 【現象】本文 + 【ズレ】本文 + #違和感 #気づき
- 2ツイート目: 【構造仮説】本文 + 【次の実験】本文
- type が "single" の場合は1ツイートで完結し、末尾に #違和感 を付ける
- 各ツイートは280文字以内

# 出力
JSON配列のみで返してください。

[
  {
    "themeId": "元テーマのid",
    "type": "${type}",
    "title": "短い識別用タイトル",
    "text": "投稿本文"
  }
]`;
}

async function draftFromPool(options) {
  if (!existsSync(PROFILE_PATH)) {
    throw new Error("profile/profile.json が見つかりません。先に profile を作成してください。");
  }

  const pool = readPool();
  const candidates = pool
    .filter((theme) => theme.status === "new")
    .filter((theme) => !includesExcludedThemeTerm(theme))
    .slice(0, options.drafts);
  if (!candidates.length) {
    console.log("未使用のテーマ候補がありません。先にテーマリサーチを実行してください。");
    return [];
  }

  const profile = JSON.parse(readFileSync(PROFILE_PATH, "utf-8"));
  const prompt = buildDraftPrompt(profile, candidates, options.type);
  const [{ createOpenAITextResponse }, { addPost }] = await Promise.all([
    import("./lib/openai.mjs"),
    import("./lib/sheets.mjs"),
  ]);

  console.log(`投稿文に変換中: ${candidates.length} 件`);
  const text = await createOpenAITextResponse(prompt, { maxOutputTokens: 8192 });
  const posts = extractJsonArray(text);

  console.log("スプレッドシートへ下書き追加中...");
  const results = [];
  for (const post of posts) {
    const { id, scheduledAt, postKey } = await addPost(post.text, {
      postType: post.type || options.type,
      note: `iwakan:${post.title || ""} / theme:${post.themeId || ""}`,
    });
    results.push({ ...post, id, scheduledAt, postKey });
    console.log(`  [ID ${id}] ${scheduledAt} (${post.type || options.type}${postKey ? ` / ${postKey}` : ""})`);
  }

  const draftedAt = new Date().toISOString();
  const byTheme = new Map(results.map((post) => [post.themeId, post]));
  for (const theme of pool) {
    const post = byTheme.get(theme.id);
    if (!post) continue;
    theme.status = "drafted";
    theme.draftedAt = draftedAt;
    theme.postIds = [...(theme.postIds || []), post.id];
  }
  writePool(pool);

  const stamp = draftedAt.replace(/[:.]/g, "-");
  const mdPath = join(RESULTS_DIR, `${stamp}_iwakan_drafted_posts.md`);
  const lines = ["# 違和感収集家 下書き化済み投稿", "", `- count: ${results.length}`, ""];
  for (const post of results) {
    lines.push(`## ID ${post.id}: ${post.title || ""}`, "");
    lines.push(post.text || "");
    lines.push("");
    lines.push(`- scheduledAt: ${post.scheduledAt}`);
    lines.push(`- themeId: ${post.themeId || ""}`);
    lines.push("");
  }
  writeFileSync(mdPath, `${lines.join("\n")}\n`, "utf-8");
  console.log(`下書きレポート: ${mdPath}`);
  return results;
}

async function createNoteThemePool(options) {
  const pool = readPool();
  const candidates = pool
    .filter((theme) => !theme.notePoolExportedAt)
    .filter((theme) => !includesExcludedThemeTerm(theme))
    .slice(0, options.themes);

  if (!candidates.length) {
    console.log("Note記事用に変換できる未処理テーマがありません。先にテーマリサーチを実行してください。");
    return [];
  }

  const { createOpenAITextResponse } = await import("./lib/openai.mjs");
  const prompt = buildNotePoolPrompt(candidates);
  console.log(`Note記事用テーマプールへ変換中: ${candidates.length} 件`);
  const text = await createOpenAITextResponse(prompt, { maxOutputTokens: 8192 });
  const noteItems = extractJsonArray(text).map((item, index) => ({
    id: `note-theme-${Date.now()}-${String(index + 1).padStart(2, "0")}`,
    createdAt: new Date().toISOString(),
    status: "idea",
    articlePath: "",
    ...item,
  }));

  const notePool = readNotePool();
  notePool.push(...noteItems);
  writeNotePool(notePool);

  const exportedAt = new Date().toISOString();
  const sourceIds = new Set(noteItems.map((item) => item.sourceThemeId).filter(Boolean));
  for (const theme of pool) {
    if (sourceIds.has(theme.id)) {
      theme.notePoolExportedAt = exportedAt;
    }
  }
  writePool(pool);

  const stamp = exportedAt.replace(/[:.]/g, "-");
  const mdPath = join(RESULTS_DIR, `${stamp}_note_theme_pool.md`);
  writeFileSync(mdPath, buildNotePoolMarkdown(noteItems, "Note記事用テーマプール追加分"), "utf-8");

  console.log(`Note記事用テーマを ${noteItems.length} 件ため込みました`);
  console.log(`Noteテーマプール: ${NOTE_POOL_PATH}`);
  console.log(`今回のレポート: ${mdPath}`);
  return noteItems;
}

async function main() {
  ensureDirs();
  const options = parseArgs();
  if (options.mode === "all" || options.mode === "research") {
    await researchThemes(options);
  }
  if (options.notePool) {
    await createNoteThemePool(options);
  }
  if (options.mode === "all" || options.mode === "draft") {
    await draftFromPool(options);
  }
  console.log("完了しました");
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
