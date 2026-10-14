// ===================================================
// 台本データ — ここを書き換えるだけで新しい動画が作れる
// ===================================================
//
// 音声ファイルの対応：
//   001〜003 → 項目1（3文）
//   004〜006 → 項目2（3文）
//   007〜009 → 項目3（3文）
//   010〜012 → 項目4（3文）
//   013〜015 → 項目5（3文）
//   016      → アウトロ
//
// durationInFrames は ffprobe/WAVヘッダから計測した実測値
//   PRE=15フレーム(0.5秒) + 音声合計 + POST=15フレーム(0.5秒)
// ===================================================

const PRE = 15;
const POST = 15;

export type AudioClip = {
  file: string;
  durationInFrames: number;
};

export type ScriptItem = {
  number: number;
  title: string;        // 縦書き大字（大きく表示）
  body: string;         // 本文テキスト（縦書き小字）
  audioClips: AudioClip[];
  durationInFrames: number; // PRE + sum(clips) + POST
};

export type VideoScript = {
  title: string;
  titleAudio: string;
  titleDurationInFrames: number;
  items: ScriptItem[];
  outro: string;
  outroClips: AudioClip[];
  outroDurationInFrames: number;
};

export const videoScript: VideoScript = {
  title: "６０代の賢者が\n「時間の無駄だ」と\nやめた、５つの口癖",
  titleAudio: "audio/000.wav",
  titleDurationInFrames: 166, // 5.02秒 + PRE15f

  items: [
    {
      number: 1,
      title: "「どうせ自分には無理だ」",
      body: "この言葉を口にするたびに、可能性の扉が閉まっていく。\n賢者はこう気づいた。\n「無理」という言葉は、挑戦する前に自分を諦めさせる呪文だと。",
      audioClips: [
        { file: "audio/001.wav", durationInFrames: 119 },
        { file: "audio/002.wav", durationInFrames: 45 },
        { file: "audio/003.wav", durationInFrames: 153 },
      ],
      durationInFrames: PRE + 119 + 45 + 153 + POST, // 347f ≈ 11.6秒
    },
    {
      number: 2,
      title: "「昔はよかった」",
      body: "過去を美化するほど、現在が色あせていく。\n今この瞬間に価値を見出せない人は、未来も輝かせることができない。\n賢者は今日に全力を注いだ。",
      audioClips: [
        { file: "audio/004.wav", durationInFrames: 91 },
        { file: "audio/005.wav", durationInFrames: 141 },
        { file: "audio/006.wav", durationInFrames: 66 },
      ],
      durationInFrames: PRE + 91 + 141 + 66 + POST, // 328f ≈ 10.9秒
    },
    {
      number: 3,
      title: "「あの人のせいだ」",
      body: "他人に責任を押しつけた瞬間、自分の成長が止まる。\n賢者は知っていた。\n何が起きても、次にどう動くかは自分で決められると。",
      audioClips: [
        { file: "audio/007.wav", durationInFrames: 122 },
        { file: "audio/008.wav", durationInFrames: 41 },
        { file: "audio/009.wav", durationInFrames: 112 },
      ],
      durationInFrames: PRE + 122 + 41 + 112 + POST, // 305f ≈ 10.2秒
    },
    {
      number: 4,
      title: "「いつかやろう」",
      body: "「いつか」という日はカレンダーに存在しない。\n賢者は小さくてもいい、今日できることを今日やることにした。\nそれだけで人生は変わり始めた。",
      audioClips: [
        { file: "audio/010.wav", durationInFrames: 94 },
        { file: "audio/011.wav", durationInFrames: 118 },
        { file: "audio/012.wav", durationInFrames: 68 },
      ],
      durationInFrames: PRE + 94 + 118 + 68 + POST, // 310f ≈ 10.3秒
    },
    {
      number: 5,
      title: "「もう年だから」",
      body: "年齢を言い訳にした瞬間、本当に老いが始まる。\n賢者は８０歳で新しいことを学んだ。\n人生に「遅すぎる」はない、と自ら証明し続けた。",
      audioClips: [
        { file: "audio/013.wav", durationInFrames: 114 },
        { file: "audio/014.wav", durationInFrames: 87 },
        { file: "audio/015.wav", durationInFrames: 145 },
      ],
      durationInFrames: PRE + 114 + 87 + 145 + POST, // 376f ≈ 12.5秒
    },
  ],

  outro: "チャンネル登録・高評価\nよろしくお願いします",
  outroClips: [
    { file: "audio/016.wav", durationInFrames: 103 },
  ],
  outroDurationInFrames: PRE + 103 + POST, // 133f ≈ 4.4秒
};
