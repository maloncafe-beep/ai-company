export type KenBurns = {
  fromScale: number;
  toScale: number;
  fromCX: number;
  toCX: number;
  fromCY: number;
  toCY: number;
};

export type Slide = {
  text: string;
  duration: number;
  image: string;
  audio: string;
  kenBurns: KenBurns;
};

export const slides: Slide[] = [
  {
    text: "今日からできる\n行動できる人の小さな習慣",
    duration: 3.58,
    image: "1505838e-9c1c-4e5e-9c8b-6cb94142156a.png",
    audio: "AAepezUC7Y.mp3",
    kenBurns: { fromScale: 0.97, toScale: 0.97, fromCX: 0.5, toCX: 0.5, fromCY: 0.485, toCY: 0.515 },
  },
  {
    text: "行動できる人は\n最初から完璧を目指さない",
    duration: 3.07,
    image: "99d452bc-9830-45d2-9d47-462c9302484e.png",
    audio: "Uo5mZTMKiY.mp3",
    kenBurns: { fromScale: 0.97, toScale: 0.97, fromCX: 0.485, toCX: 0.515, fromCY: 0.5, toCY: 0.5 },
  },
  {
    text: "やる気を待たず\n5分だけ先に始めている",
    duration: 2.74,
    image: "f5351596-e3a9-45cc-8f5e-f63be28fff7d.png",
    audio: "OQ7ubO-U6t.mp3",
    kenBurns: { fromScale: 0.97, toScale: 0.97, fromCX: 0.485, toCX: 0.515, fromCY: 0.5, toCY: 0.5 },
  },
  {
    text: "面倒な作業ほど\n朝一番に片づけている",
    duration: 2.95,
    image: "d4935905-ccdb-4ed8-be3b-b98d426a48b1.png",
    audio: "AAkiFxtWeP.mp3",
    kenBurns: { fromScale: 0.97, toScale: 0.97, fromCX: 0.485, toCX: 0.515, fromCY: 0.5, toCY: 0.5 },
  },
  {
    text: "迷ったら30秒以内に\n小さな一歩を選ぶ",
    duration: 3.22,
    image: "9adef349-b61e-44df-a328-62d64d9c6cb7.png",
    audio: "VsWv_W7wvk.mp3",
    kenBurns: { fromScale: 0.97, toScale: 0.97, fromCX: 0.485, toCX: 0.515, fromCY: 0.5, toCY: 0.5 },
  },
  {
    text: "目標ではなく\n今日やる行動を紙に書いている",
    duration: 2.95,
    image: "19129a67-9027-48aa-a8e4-4b7a34ead776.png",
    audio: "mMchjb2201.mp3",
    kenBurns: { fromScale: 0.97, toScale: 0.97, fromCX: 0.5, toCX: 0.5, fromCY: 0.515, toCY: 0.485 },
  },
  {
    text: "大きな仕事は\n2分でできる作業まで小さくする",
    duration: 3.29,
    image: "88ef6110-870d-4fff-912e-273a1b87691b.png",
    audio: "rBv8lxSrEt.mp3",
    kenBurns: { fromScale: 0.97, toScale: 0.97, fromCX: 0.515, toCX: 0.485, fromCY: 0.5, toCY: 0.5 },
  },
  {
    text: "失敗しない人より\n失敗を早く経験する人が動ける",
    duration: 3.77,
    image: "5c00d70a-0265-4545-8168-71b17696b819.png",
    audio: "FSEPE8seo6.mp3",
    kenBurns: { fromScale: 0.98, toScale: 0.9, fromCX: 0.5, toCX: 0.5, fromCY: 0.5, toCY: 0.5 },
  },
  {
    text: "スマホを手の届かない場所に置いて\n集中する",
    duration: 2.83,
    image: "272e0e32-4494-4be2-87ad-dc617723bfb2.png",
    audio: "3kWFdnn0mr.mp3",
    kenBurns: { fromScale: 0.97, toScale: 0.97, fromCX: 0.485, toCX: 0.515, fromCY: 0.5, toCY: 0.5 },
  },
  {
    text: "毎日同じ時間に\n最初の作業を始めている",
    duration: 3.14,
    image: "d4db82bc-8669-457b-bc0b-f3aaba5a2618.png",
    audio: "a9LHD2Pu84.mp3",
    kenBurns: { fromScale: 0.97, toScale: 0.97, fromCX: 0.485, toCX: 0.515, fromCY: 0.5, toCY: 0.5 },
  },
  {
    text: "完璧に終えるより\n途中でも一度カタチにしてみる",
    duration: 3.05,
    image: "7311c9f2-d4be-4b99-bfa2-a608eb5a0333.png",
    audio: "GnHAk8WQVz.mp3",
    kenBurns: { fromScale: 0.97, toScale: 0.97, fromCX: 0.515, toCX: 0.485, fromCY: 0.5, toCY: 0.5 },
  },
];

export const FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

export const slideFrames = slides.map((s) => Math.round(s.duration * FPS));
export const totalFrames = slideFrames.reduce((a, b) => a + b, 0);

export function getSlideAtFrame(frame: number) {
  let elapsed = 0;
  for (let i = 0; i < slides.length; i++) {
    const frames = slideFrames[i];
    if (frame < elapsed + frames) {
      return { slide: slides[i], localFrame: frame - elapsed, totalSlideFrames: frames, slideIndex: i };
    }
    elapsed += frames;
  }
  const last = slides.length - 1;
  return {
    slide: slides[last],
    localFrame: slideFrames[last] - 1,
    totalSlideFrames: slideFrames[last],
    slideIndex: last,
  };
}
