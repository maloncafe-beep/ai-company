#!/usr/bin/env node
// bridge.js — line-harness API をポーリングし、新着メッセージで claude -p を spawn する

'use strict';

const { spawn } = require('child_process');
const https = require('https');
const path = require('path');
const fs = require('fs');

// ── 設定 ──────────────────────────────────────────────────────
const API_URL   = 'https://line-harness.maloncafe.workers.dev';
const API_KEY   = 'd7e1f198f3d55838ec55ffda56a5a8c841615259ef75744244ea6aa094ad37de';
const MEMBERS_DIR     = 'C:/Users/yyasu/ai-company/members';
const POLL_INTERVAL   = 60 * 1000;   // ポーリング間隔（ms）
const SPAWN_COOLDOWN  = 5 * 60 * 1000; // 同じ相手への spawn 最短間隔（ms）
const STATE_FILE      = path.join(__dirname, '.bridge-state.json');
const LOG_FILE        = path.join(__dirname, 'bridge.log');

// ── ログ ──────────────────────────────────────────────────────
function log(msg) {
  const line = `${new Date().toLocaleString('ja-JP')} ${msg}\n`;
  process.stdout.write(line);
  try { fs.appendFileSync(LOG_FILE, line, 'utf8'); } catch {}
}

process.on('uncaughtException', e => { log(`[bridge] UNCAUGHT: ${e.message}\n${e.stack}`); process.exit(1); });
process.on('unhandledRejection', e => { log(`[bridge] UNHANDLED REJECTION: ${e}`); });

// accountId → { name, dir }
// AI-Project 宛のメッセージは leader に routing する
const ACCOUNTS = {
  '8f6e4520-f2ad-4038-8127-d6b8d300ec38': { name: 'AI-Project', dir: 'leader'     }, // → leader が処理
  '32d65756-37d7-420c-9c66-aeb87d571e1b': { name: 'Leader',     dir: 'leader'     },
  '81454d2d-768a-46b5-b0f1-06cb665a48f0': { name: 'Designer',   dir: 'designer'   },
  '163f14c1-135d-4385-8e9f-63f6c802302c': { name: 'Writer',     dir: 'writer'     },
  'a1d98ade-771d-47d9-a3cd-534f9395e7ca': { name: 'Brunson',    dir: 'brunson'    },
  '010801fd-c4b1-4509-b311-27810e6e3ac4': { name: 'LP',         dir: 'lp'         },
  '5f972742-5c99-4c50-aebb-899725f9250c': { name: 'Video',      dir: 'video'      },
  '67bb214d-8551-4b57-a43e-d7ef1c42cf69': { name: 'Researcher', dir: 'researcher' },
  '626cb869-8b53-4320-bd47-56216a327bd7': { name: 'Analyst',    dir: 'analyst'    },
  '8e93bbf1-015c-4eb3-9c35-a119ca347251': { name: 'Product',    dir: 'product'    },
  'b9ca6664-56c8-41f2-bb03-3e0e43e0054d': { name: 'SNS',        dir: 'sns'        },
};

// 経営者(Yyasu)の friendId（各アカウントから見た送信先）
const YYASU_FRIEND_IDS = {
  '8f6e4520-f2ad-4038-8127-d6b8d300ec38': '52a2e78c-7c26-4e1d-8a28-2cdf269a7d09', // AI-Project
  '32d65756-37d7-420c-9c66-aeb87d571e1b': 'c24b0d7c-e87d-4cd1-b675-3708d467daeb',
  '81454d2d-768a-46b5-b0f1-06cb665a48f0': '9c603c72-7e8b-45cb-a14d-ada31ad325ff',
  '163f14c1-135d-4385-8e9f-63f6c802302c': '584f0b9f-3dc5-44c7-8b16-33d312a0bed1',
  'a1d98ade-771d-47d9-a3cd-534f9395e7ca': 'a7d16bc8-0df9-4b4d-8fd2-a7dbf98e752d',
  '010801fd-c4b1-4509-b311-27810e6e3ac4': 'c913028d-4fba-4098-86b6-0f409602bc00',
  '5f972742-5c99-4c50-aebb-899725f9250c': 'd338065d-1154-4c3a-a599-f7f6f8e5a444',
  '67bb214d-8551-4b57-a43e-d7ef1c42cf69': '06cb3417-f8c9-4152-baaf-92ff943a06c2',
  '626cb869-8b53-4320-bd47-56216a327bd7': '33ad6c53-8a19-4de2-97cd-9e2180dbeb34',
  '8e93bbf1-015c-4eb3-9c35-a119ca347251': '25f3d29f-7fe0-42a4-b777-8c0be6718080',
  'b9ca6664-56c8-41f2-bb03-3e0e43e0054d': 'cf7a3aa6-c25a-4d60-a304-b5028d256b72',
};

// ── 状態管理 ─────────────────────────────────────────────────
// key: "accountId:friendId" → lastSpawnedAt (ISO string)
let state = {};

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch { state = {}; }
}

function saveState() {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {
    log(`[bridge] state save failed: ${e.message}`);
  }
}

// ── API 呼び出し ──────────────────────────────────────────────
function apiGet(path) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}${path}`;
    const req = https.get(url, { headers: { 'Authorization': `Bearer ${API_KEY}` } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('Parse error: ' + body.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function fetchConversations(lineAccountId) {
  return apiGet(`/api/conversations?lineAccountId=${lineAccountId}&limit=50`);
}

// 直近の incoming メッセージ本文を最大 N 件取得
async function fetchRecentMessages(friendId, limit = 5) {
  try {
    const res = await apiGet(`/api/conversations/${friendId}?limit=20`);
    const messages = res?.data?.messages ?? [];
    return messages
      .filter(m => m.direction === 'incoming')
      .slice(-limit)
      .map(m => m.content ?? '')
      .filter(Boolean);
  } catch { return []; }
}

// ── claude spawn ──────────────────────────────────────────────
function spawnClaude(dir, prompt) {
  const cwd = path.join(MEMBERS_DIR, dir).replace(/\//g, '\\');
  const child = spawn('claude', ['-p', prompt], {
    cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  });

  child.stdout.on('data', d => log(`[claude/${dir}] ${String(d).trimEnd()}`));
  child.stderr.on('data', d => log(`[claude/${dir}] ${String(d).trimEnd()}`));
  child.on('error', e => log(`[bridge] spawn error (${dir}): ${e.message}`));
  child.on('exit', code => log(`[bridge] claude/${dir} exited (code=${code})`));
}

// ── ポーリング ────────────────────────────────────────────────
async function poll() {
  const now = Date.now();
  log(`[bridge] poll at ${new Date(now).toLocaleString('ja-JP')}`);

  for (const [accountId, account] of Object.entries(ACCOUNTS)) {
    let res;
    try {
      res = await fetchConversations(accountId);
    } catch (e) {
      log(`[bridge] ${account.name} fetch error: ${e.message}`);
      continue;
    }

    const items = res?.data?.items;
    if (!Array.isArray(items)) {
      log(`[bridge] ${account.name}: unexpected response`);
      continue;
    }

    log(`[bridge] ${account.name}: ${items.length} unread`);

    for (const item of items) {
      const { friendId, displayName, lastIncomingAt, lastIncomingPreview } = item;
      if (!friendId || !lastIncomingAt) continue;

      const stateKey = `${accountId}:${friendId}`;
      const lastSpawnedAt = state[stateKey] ? new Date(state[stateKey]).getTime() : 0;
      const lastIncomingMs = new Date(lastIncomingAt).getTime();

      // spawn 条件: 最終 spawn より後にメッセージが来た、かつ SPAWN_COOLDOWN 経過
      if (lastIncomingMs <= lastSpawnedAt) continue;
      if (now - lastSpawnedAt < SPAWN_COOLDOWN) continue;

      // AI-Project 宛メッセージ → leader/inbox/task.md を作成してから spawn
      const AI_PROJECT_ID = '8f6e4520-f2ad-4038-8127-d6b8d300ec38';
      const LEADER_ACCOUNT_ID = '32d65756-37d7-420c-9c66-aeb87d571e1b';

      // AI-Project → leader 経由の場合、返信は @Leader から行うので Leader 視点の friendId を使う
      const replyAccountId = (accountId === AI_PROJECT_ID) ? LEADER_ACCOUNT_ID : accountId;
      const yyasuFriendId = YYASU_FRIEND_IDS[replyAccountId] ?? '';

      // フルメッセージ取得（80文字切り捨て回避）
      const recentMsgs = await fetchRecentMessages(friendId, 5);
      const messageText = recentMsgs.length > 0
        ? recentMsgs.map((m, i) => `[${i + 1}] ${m}`).join('\n')
        : (lastIncomingPreview ?? '(メッセージ内容なし)');

      if (accountId === AI_PROJECT_ID) {
        const inboxDir = path.join(MEMBERS_DIR, 'leader', 'inbox');
        const taskPath = path.join(inboxDir, 'task.md');
        const taskAskedPath = path.join(inboxDir, 'task_asked.md');
        if (fs.existsSync(taskAskedPath)) {
          log(`[bridge] task_asked.md exists, skipping spawn`);
          continue;
        }
        const taskContent =
          `# タスク依頼（@AI-Project 経由）\n\n` +
          `依頼元: ${displayName ?? 'Unknown'} (friendId: ${friendId})\n` +
          `受信: ${lastIncomingAt}\n\n` +
          `## メッセージ内容\n\n${messageText}\n\n` +
          `## 完了条件\n` +
          `- 担当メンバーを選定し、members/{担当}/inbox/task.md を作成する\n` +
          `- @Leader から経営者に担当と方針を返信する\n`;
        try {
          fs.mkdirSync(inboxDir, { recursive: true });
          fs.writeFileSync(taskPath, taskContent, 'utf8');
          log(`[bridge] wrote leader/inbox/task.md`);
          fs.renameSync(taskPath, taskAskedPath);
          log(`[bridge] renamed task.md → task_asked.md`);
        } catch (e) {
          log(`[bridge] failed to write/rename task.md: ${e.message}`);
          continue;
        }
      }

      const prompt =
        `push型の自動spawn / 軽量セッション\n` +
        `送信者: ${displayName ?? 'Unknown'} (friendId: ${friendId})\n` +
        `accountId: ${accountId}\n` +
        `経営者のfriendId（返信先）: ${yyasuFriendId}\n` +
        `直近メッセージ（古い順）:\n${messageText}\n\n` +
        `CLAUDE.mdのpush spawnモードに従って行動してください。`;

      log(`[bridge] spawning claude/${account.dir} for ${displayName ?? friendId}`);
      state[stateKey] = new Date(now).toISOString();
      saveState();
      spawnClaude(account.dir, prompt);
    }
  }
}

// ── 起動 ─────────────────────────────────────────────────────
loadState();
log(`[bridge] started. poll every ${POLL_INTERVAL / 1000} sec`);
poll();
setInterval(poll, POLL_INTERVAL);
