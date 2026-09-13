import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Audio,
  Sequence,
  Img,
} from "remotion";
import slidesData from "./slides-data.json";

type SlideData = {
  text: string;
  duration: number;
  audio: string;
  image: string;
};

const FPS = 30;

// [[テキスト]] を強調チャンクとして解析
type Chunk = { text: string; highlight: boolean };
function parseChunks(text: string): Chunk[] {
  const chunks: Chunk[] = [];
  const regex = /\[\[(.+?)\]\]/g;
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last)
      chunks.push({ text: text.slice(last, match.index), highlight: false });
    chunks.push({ text: match[1], highlight: true });
    last = match.index + match[0].length;
  }
  if (last < text.length)
    chunks.push({ text: text.slice(last), highlight: false });
  return chunks;
}

// [[]] の内側の。では分割しない行分割
function splitLines(text: string): string[] {
  const lines: string[] = [];
  let current = "";
  let inBracket = false;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "[" && text[i + 1] === "[") {
      inBracket = true;
      current += "[[";
      i++;
      continue;
    }
    if (text[i] === "]" && text[i + 1] === "]") {
      inBracket = false;
      current += "]]";
      i++;
      continue;
    }
    if (text[i] === "。" && !inBracket) {
      if (current) lines.push(current);
      current = "";
    } else {
      current += text[i];
    }
  }
  if (current) lines.push(current);
  return lines;
}
const BGM_VOLUME = 0.30;
const BGM_FADE_FRAMES = 60;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getSlideFrames(slides: SlideData[]) {
  return slides.map((s) => Math.round(s.duration * FPS));
}

function getSlideAtFrame(
  frame: number,
  slides: SlideData[],
  slideFrames: number[]
) {
  let elapsed = 0;
  for (let i = 0; i < slides.length; i++) {
    if (frame < elapsed + slideFrames[i]) {
      return {
        slide: slides[i],
        localFrame: frame - elapsed,
        totalSlideFrames: slideFrames[i],
        slideIndex: i,
      };
    }
    elapsed += slideFrames[i];
  }
  const last = slides.length - 1;
  return {
    slide: slides[last],
    localFrame: slideFrames[last] - 1,
    totalSlideFrames: slideFrames[last],
    slideIndex: last,
  };
}

// Ken Burns パターン（スライドインデックスで循環）
const KB_PATTERNS = [
  { fromCX: 0.5,   toCX: 0.5,   fromCY: 0.485, toCY: 0.515, fromScale: 0.97, toScale: 0.97 },
  { fromCX: 0.485, toCX: 0.515, fromCY: 0.5,   toCY: 0.5,   fromScale: 0.97, toScale: 0.97 },
  { fromCX: 0.515, toCX: 0.485, fromCY: 0.5,   toCY: 0.5,   fromScale: 0.97, toScale: 0.97 },
  { fromCX: 0.5,   toCX: 0.5,   fromCY: 0.515, toCY: 0.485, fromScale: 0.97, toScale: 0.97 },
  { fromCX: 0.5,   toCX: 0.5,   fromCY: 0.5,   toCY: 0.5,   fromScale: 0.98, toScale: 0.90 },
];

export const ShortsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const slides = slidesData.slides as SlideData[];
  const hasBgm = slidesData.hasBgm;

  const slideFrames = getSlideFrames(slides);
  const totalFrames = slideFrames.reduce((a, b) => a + b, 0);
  const { slide, localFrame, totalSlideFrames, slideIndex } =
    getSlideAtFrame(frame, slides, slideFrames);

  // Ken Burns
  const kb = KB_PATTERNS[slideIndex % KB_PATTERNS.length];
  const kbProgress = localFrame / Math.max(totalSlideFrames - 1, 1);
  const scale = lerp(kb.fromScale, kb.toScale, kbProgress);
  const centerX = lerp(kb.fromCX, kb.toCX, kbProgress);
  const centerY = lerp(kb.fromCY, kb.toCY, kbProgress);
  const renderScale = 1 / scale;
  const translateX = (0.5 - centerX) * width;
  const translateY = (0.5 - centerY) * height;

  // テキスト ポッピンイン
  const popScale = spring({
    fps,
    frame: localFrame,
    config: { damping: 14, stiffness: 220, mass: 0.7 },
    from: 0,
    to: 1,
    durationInFrames: 27,
  });

  // フェード（画像とテキストのみ、白背景は常時表示）
  const fadeIn = interpolate(localFrame, [0, 4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    localFrame,
    [totalSlideFrames - 5, totalSlideFrames - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = fadeIn * fadeOut;

  // BGM ボリューム フェード
  const bgmVolume = hasBgm
    ? interpolate(
        frame,
        [0, BGM_FADE_FRAMES, totalFrames - BGM_FADE_FRAMES, totalFrames - 1],
        [0, BGM_VOLUME, BGM_VOLUME, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  // スライド開始フレーム一覧
  const startFrames = slideFrames.reduce<number[]>((acc, f, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + slideFrames[i - 1]);
    return acc;
  }, []);

  const lines = splitLines(slide.text);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        background: "#ffffff",
      }}
    >
      {/* BGM */}
      {hasBgm && (
        <Audio src={staticFile("bgm/bgm.mp3")} volume={bgmVolume} />
      )}

      {/* TTS 音声 */}
      {slides.map((s, i) => (
        <Sequence key={i} from={startFrames[i]} durationInFrames={slideFrames[i]}>
          <Audio src={staticFile(`slides/${s.audio}`)} />
        </Sequence>
      ))}

      {/* 背景イラスト */}
      <div
        key={`illust-${slideIndex}`}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          opacity,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img
          src={staticFile(`illustrations/${slide.image}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: `scale(${renderScale}) translate(${translateX}px, ${translateY}px)`,
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* クレジット表記 */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          fontSize: 22,
          color: "rgba(255,255,255,0.7)",
          fontFamily: "'Noto Sans JP', sans-serif",
          textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
          lineHeight: 1.6,
          textAlign: "right",
        }}
      >
        <div>音声：VOICEVOX 青山龍星</div>
        <div>BGM：Escortもっぴーさうんど</div>
      </div>

      {/* 字幕テキスト（上部・白文字+黒アウトライン） */}
      <div
        key={`text-${slideIndex}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "220px 42px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity,
          transform: `scale(${popScale})`,
          transformOrigin: "top center",
        }}
      >
        <div style={{ width: "100%", textAlign: "center" }}>
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: 82,
                fontWeight: 800,
                fontFamily:
                  "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
                lineHeight: 1.45,
                letterSpacing: "0.02em",
                textShadow: "1px 1px 3px rgba(255, 255, 255, 0.8)",
              }}
            >
              {parseChunks(line).map((chunk, j) => (
                <span
                  key={j}
                  style={{ color: chunk.highlight ? "#E53500" : "#111111" }}
                >
                  {chunk.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
