import { readFileSync } from "fs";
import { resolve } from "path";

import { createArticleDoc } from "./lib/docs.mjs";
import { appendArticleLog } from "./lib/sheets.mjs";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = value;
    i += 1;
  }
  return args;
}

function extractTitle(markdown) {
  const firstLine = markdown.split(/\r?\n/, 1)[0] || "";
  if (firstLine.startsWith("# ")) return firstLine.slice(2).trim();
  return "";
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.file || !args.keyword) {
    console.error("Usage: node tools/publish-draft.mjs --file <path> --keyword <keyword>");
    process.exit(1);
  }

  const filePath = resolve(args.file);
  const markdown = readFileSync(filePath, "utf-8");
  const title = extractTitle(markdown);

  if (!title) {
    console.error("Error: Could not extract title from the first Markdown heading.");
    process.exit(1);
  }

  const folderId = process.env.GOOGLE_DOCS_FOLDER_ID || undefined;
  const { url } = await createArticleDoc(title, markdown, folderId);
  await appendArticleLog({
    keyword: args.keyword,
    title,
    articleUrl: url,
    charCount: markdown.length,
  });

  console.log(JSON.stringify({ title, url, charCount: markdown.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
