#!/usr/bin/env node

/**
 * register-thread16-18.mjs — スレッド16〜18・リメイク26〜28 をスプシに一括登録
 *
 * Usage:
 *   node tools/register-thread16-18.mjs
 */

import { readSheet, appendRows } from "./lib/sheets.mjs";

const POST_SHEET = "投稿管理";

const POSTS = [
  {
    scheduledAt: "2026/05/08 21:00",
    text: [
      "失敗のあとに「次から気をつけます」と言った。翌月、同じミスをした。その場でまた「次から気をつけます」と言った。何年か同じことを繰り返している。",
      "反省したなら、次は変わるはずだ。「気をつける」と宣言した。意識も高まったはず。なのに同じところで躓く。",
      "「気をつける」は行動の変化ではなく、注意の増加を約束している。でも注意を増やすだけでは行動のパターンは変わらない。反省した瞬間に安心感が生まれ、具体的な対策を考えるエネルギーが消える。「次から気をつける」と言った瞬間に、反省は完了している。",
      "「次から気をつける」の代わりに「〇〇の状況になったら△△する」と決めてみる。例：「急いでいるときはダブルチェックを使う」。意志ではなく仕組みで解決する。",
    ].join("\n---\n"),
    note: "",
  },
  {
    scheduledAt: "2026/05/09 12:00",
    text: "「次から気をつける」は行動の変化じゃなく、安心の確保だ。反省した瞬間にエネルギーが消えて、対策を考えなくなる。何年も同じミスを繰り返すのは意志が弱いからじゃない。「気をつける」が完了形になっているからだ。",
    noteTemplate: "リメイク版（{threadId}-{remixId}）",
  },
  {
    scheduledAt: "2026/05/09 21:00",
    text: [
      "気になる記事をブックマーク。「後で読む」フォルダに追加。気づけば500件が積み上がっている。読んだのは5件以下。今日も新しい記事を「後で読む」に追加した。",
      "保存したなら読むはずだ。「後で」と言ったが、「後で」は必ず来る。なのに500件は消えない。「後で」とはいつなのか。",
      "「保存する」行為が「情報を得た」という疑似体験を与える。脳は保存と読書を区別しにくい。積み上がるほど「いつでも読める」安心感が強まり、「今読む」動機が下がる。保存することで、読まない理由が生まれている。",
      "「後で読む」ボタンを押す前に「今すぐ3分で読めるか」を確認する。読めるなら今読む。読めないなら保存しない。「後で」という逃げ道をなくすと、本当に読む価値があるものだけが残る。",
    ].join("\n---\n"),
    note: "",
  },
  {
    scheduledAt: "2026/05/10 12:00",
    text: "「後で読む」に500件積み上がっているのは意志が弱いからじゃない。保存が読書の疑似体験になっているからだ。積めば積むほど「いつでも読める」安心感が強まり、今読む理由がなくなる。",
    noteTemplate: "リメイク版（{threadId}-{remixId}）",
  },
  {
    scheduledAt: "2026/05/10 21:00",
    text: [
      "「あと1話だけ」と言って再生ボタンを押した。気づいたら3話終わっていた。「あと少しだけ仕事して寝る」と言ったのに、気づいたら1時を過ぎていた。「もう少しだけ」は毎回裏切る。",
      "「もう少し」は少しのはずだ。時間にして15分か30分。なのに実際は2時間になる。「少し」の感覚がそんなにズレているのか。",
      "「もう少しだけ」は終了の意思表示ではなく、終了を先送りする許可証だ。終了条件を「もう少し」という曖昧な基準にすると、「もう少し」は常に満たされ続ける。明確な終了点がなければ、人は都合のいい「もう少し」を繰り返す。意志の問題ではなく、終了条件の設計の問題だ。",
      "「もう少しだけ」と思ったとき、先にアラームを15分後にセットしてから続ける。外部の強制終了点を作れば、自分の意志に頼らなくていい。アラームが鳴った時点で本当にやめられるなら、「意志」じゃなく「設計」が足りなかったということ。",
    ].join("\n---\n"),
    note: "",
  },
  {
    scheduledAt: "2026/05/11 12:00",
    text: "「もう少しだけ」が2時間になるのは意志が弱いからじゃない。終了条件を「もう少し」という曖昧な基準にしているからだ。「もう少し」は常に達成され続ける。外から終わりを設計しない限り、人は終われない。",
    noteTemplate: "リメイク版（{threadId}-{remixId}）",
  },
];

async function main() {
  console.log("=== スレッド16〜18・リメイク26〜28 登録 ===\n");

  const existingRows = await readSheet(POST_SHEET);
  const ids = existingRows.slice(1).map((r) => parseInt(r[0], 10)).filter((n) => !isNaN(n));
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  console.log(`現在の最大ID: ${maxId}`);

  let nextId = maxId + 1;

  // ID を事前に計算して備考を確定させる
  const assignments = [];
  let threadIds = [];
  for (const post of POSTS) {
    const id = nextId++;
    if (post.noteTemplate) {
      // リメイク：直前のスレッドIDを参照
      const threadId = threadIds[threadIds.length - 1];
      const note = post.noteTemplate
        .replace("{threadId}", threadId)
        .replace("{remixId}", id);
      assignments.push({ ...post, id, note });
    } else {
      threadIds.push(id);
      assignments.push({ ...post, id });
    }
  }

  const newRows = assignments.map((post) => [
    post.id,
    "承認済み",
    post.scheduledAt,
    post.text,
    post.text.length,
    "",
    "",
    post.note || "",
  ]);

  await appendRows(POST_SHEET, newRows);

  console.log("\n✓ 登録完了\n");
  assignments.forEach((p) => {
    const label = p.noteTemplate ? "リメイク" : "スレッド";
    const noteStr = p.note ? `  備考: ${p.note}` : "";
    console.log(`  ID=${p.id}  [${label}]  ${p.scheduledAt}  ${String(p.text).slice(0, 25)}...${noteStr}`);
  });

  console.log("\n=== Writer への通知用 ===");
  const remixes = assignments.filter((p) => p.noteTemplate);
  remixes.forEach((p) => {
    console.log(`  ${p.note}`);
  });
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
