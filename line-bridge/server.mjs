import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const PORT = 18789;
const HOME = process.env.HOME || process.env.USERPROFILE;
const INBOX_DIR = path.join(HOME, 'ai-company', 'line-bridge', 'inbox');

// inboxディレクトリ作成
fs.mkdirSync(INBOX_DIR, { recursive: true });

// lineAccountId → メンバーディレクトリ名
const MEMBER_DIRS = {
  'member-leader': 'leader',
  'member-brunson': 'brunson',
  'member-designer': 'designer',
  'member-lp': 'lp',
  'member-video': 'video',
  'member-researcher': 'researcher',
  'member-writer': 'writer',
  'member-analyst': 'analyst',
  'member-product': 'product',
  'member-sns': 'sns',
};

// 同時起動防止用ロック（ディレクトリ単位）
const spawnLocks = new Set();

function triggerClaudeSession(lineAccountId, message, friendId) {
  const memberName = MEMBER_DIRS[lineAccountId];
  if (!memberName) {
    console.log(`[SPAWN] No directory mapping for ${lineAccountId}, skipping`);
    return;
  }
  if (spawnLocks.has(lineAccountId)) {
    console.log(`[SPAWN] ${lineAccountId} already running, skipping`);
    return;
  }
  const cwd = path.join(HOME, 'ai-company', 'members', memberName);
  if (!fs.existsSync(cwd)) {
    console.log(`[SPAWN] cwd does not exist: ${cwd}`);
    return;
  }

  const isLeader = lineAccountId === 'member-leader';
  const nonLeaderRestrictions = isLeader ? '' : `

**【最重要：このセッションは実作業禁止】**
あなたは push型の自動spawnで起動された軽量セッションです。以下を守ってください：
- 実作業（成果物生成・画像生成・LP/バナー制作・projects/配下のファイル作成等）は一切しない
- やるのは「文脈把握」「ヒアリング質問送信」「task.md/task_asked.md の更新」「経営者にターミナル開いてもらうよう依頼」のみ
- 実作業は経営者がターミナルで \`cd ~/ai-company/members/${memberName} && claude\` を開いた時にやる
- 迷ったら作業せずに経営者にLINEで確認
`;

  const prompt = `LINEで新着メッセージを受信しました：

「${message}」

以下を実行してください：
1. mcp__line-harness__get_ai_conversations(lineAccountId: "${lineAccountId}", limit: 10) で文脈を確認
2. 自分の CLAUDE.md の記載手順に従って対応
3. 必要なLINE返信は必ず自分のアカウントから送信すること：
   mcp__line-harness__send_message(accountId: "${lineAccountId}", friendId: "${friendId}", content: "...")

**重要：friendId は必ず "${friendId}" を使うこと。**「owner-claude-co」等の別IDを使うとleader等の他アカウントから送信されてしまう。

**MCP失敗時のリトライ方針（重要）：**
mcp__line-harness__send_message や他のmcpツールが "Internal Server Error" 等のエラーを返した場合：
- **3回まで自動リトライする**（各リトライ間は5秒待機）
- 3回失敗したら、最後の試行の詳細エラーをこのセッションのサマリに残す
- 復旧後に再実行できるよう、送信しようとしていた内容を記録する
- 絶対に「LINE送信できなかったので諦めます」で終わらない
${nonLeaderRestrictions}
経営者からのメッセージです。`;

  spawnLocks.add(lineAccountId);
  console.log(`[SPAWN] Starting claude for ${lineAccountId} in ${cwd}`);

  const logPath = path.join(HOME, 'ai-company', 'line-bridge', `spawn-${lineAccountId}.log`);
  const logFd = fs.openSync(logPath, 'a');
  fs.writeSync(logFd, `\n=== ${new Date().toISOString()} ===\n`);

  // 不正なプレースホルダーAPIキーを除外（OAuthにフォールバックさせる）
  const cleanEnv = { ...process.env };
  delete cleanEnv.ANTHROPIC_API_KEY;

  const child = spawn('claude', [
    '-p', prompt,
    '--permission-mode', 'bypassPermissions',
  ], {
    cwd,
    detached: true,
    stdio: ['ignore', logFd, logFd],
    env: cleanEnv,
  });

  child.on('exit', (code) => {
    console.log(`[SPAWN] ${lineAccountId} exited with code ${code}`);
    spawnLocks.delete(lineAccountId);
    try { fs.closeSync(logFd); } catch {}
  });
  child.on('error', (err) => {
    console.error(`[SPAWN] ${lineAccountId} error:`, err);
    spawnLocks.delete(lineAccountId);
    try { fs.closeSync(logFd); } catch {}
  });
  child.unref();
}

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  // POST /webhook — LINE harness からのメッセージ受信
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';
    for await (const chunk of req) body += chunk;

    try {
      const payload = JSON.parse(body);
      const { lineAccountId, message, friendId } = payload;

      if (!lineAccountId || !message) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'lineAccountId and message required' }));
        return;
      }

      // メンバーごとのinboxファイルに書き込み
      const filename = `${lineAccountId}.json`;
      const filepath = path.join(INBOX_DIR, filename);

      const entry = {
        lineAccountId,
        friendId,
        message,
        timestamp: new Date().toISOString(),
        processed: false,
      };

      fs.writeFileSync(filepath, JSON.stringify(entry, null, 2));
      console.log(`[${new Date().toISOString()}] Received for ${lineAccountId}: ${message.slice(0, 50)}...`);

      // Claude Code セッションを自動起動（fire and forget）
      triggerClaudeSession(lineAccountId, message, friendId);

      res.writeHead(200);
      res.end(JSON.stringify({ success: true }));
    } catch (e) {
      console.error('Parse error:', e);
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'invalid json' }));
    }
    return;
  }

  // GET /health
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', inbox: INBOX_DIR }));
    return;
  }

  res.writeHead(404);
  res.end('not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`LINE Bridge server listening on http://127.0.0.1:${PORT}`);
  console.log(`Inbox directory: ${INBOX_DIR}`);
});
