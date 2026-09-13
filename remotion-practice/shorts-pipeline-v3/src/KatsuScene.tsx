import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Audio,
  Sequence,
} from "remotion";
import linesData from "./lines-data.json";

type LineData = {
  num: string;
  text: string;
  duration: number;
  audio: string;
  type: "title" | "body" | "ending";
};

type LinesData = {
  lines: LineData[];
  hasBgm: boolean;
  title?: string;
  displayName?: string;
};

const FPS = 30;
const COUNTDOWN_FRAMES = 0;
const BGM_VOLUME = 0.25;
const BGM_FADE_FRAMES = 60;

// フォント定義
const FONT_REISHO =
  "'HG隷書E', 'HGS隷書体', 'DF隷書体StdN', 'Yu Mincho', 'MS Mincho', serif";
const FONT_MINCHO =
  "'Hiragino Mincho ProN', 'Yu Mincho', 'MS PMincho', 'MS Mincho', serif";

// テキストシャドウ
const SHADOW_BODY = "2px 3px 0 rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.7)";
const SHADOW_GOLD = "2px 3px 0 rgba(0,0,0,0.95), 0 0 24px rgba(0,0,0,0.8), 0 0 48px rgba(0,0,0,0.5)";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getLineAtFrame(frame: number, lines: LineData[], lineFrames: number[]) {
  let elapsed = 0;
  for (let i = 0; i < lines.length; i++) {
    if (frame < elapsed + lineFrames[i]) {
      return { line: lines[i], localFrame: frame - elapsed, lf: lineFrames[i], index: i };
    }
    elapsed += lineFrames[i];
  }
  const last = lines.length - 1;
  return { line: lines[last], localFrame: lineFrames[last] - 1, lf: lineFrames[last], index: last };
}

// [[text]] を強調スパンに変換
type Segment = { text: string; emphasis: boolean };
function parseEmphasis(text: string): Segment[] {
  const segments: Segment[] = [];
  const re = /\[\[([^\]]+)\]\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) segments.push({ text: text.slice(last, m.index), emphasis: false });
    segments.push({ text: m[1], emphasis: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last), emphasis: false });
  return segments;
}

// 。で行分割 → 強調レンダリング（本文用）
function renderLines(text: string, emphasisColor = "#ffd97a") {
  const sentences = text.split("。").map(s => s.trimStart()).filter(s => s.length > 0);
  return sentences.map((sentence, si) => {
    const full = si < sentences.length - 1 ? sentence + "。" : sentence;
    const segs = parseEmphasis(full);
    return (
      <div key={si} style={{ marginBottom: si < sentences.length - 1 ? "0.3em" : 0 }}>
        {segs.map((seg, gi) =>
          seg.emphasis ? (
            <span
              key={gi}
              style={{
                color: emphasisColor,
                fontWeight: 900,
                textShadow: `0 0 14px rgba(255,200,80,0.8), ${SHADOW_BODY}`,
              }}
            >
              {seg.text}
            </span>
          ) : (
            <span key={gi}>{seg.text}</span>
          )
        )}
      </div>
    );
  });
}

// ─── カウントダウン ───────────────────────────────────────
const Countdown: React.FC<{ frame: number }> = ({ frame }) => {
  const count = 3 - Math.floor(frame / FPS);
  const lf = frame % FPS;
  const scale = spring({ fps: FPS, frame: lf, config: { damping: 12, stiffness: 300, mass: 0.5 }, from: 1.4, to: 1.0, durationInFrames: 20 });
  const opacity = interpolate(lf, [FPS - 8, FPS - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, background: "#1a0f05", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", width: 560, height: 560, borderRadius: "50%", border: "4px solid rgba(160,120,60,0.6)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", border: "2px solid rgba(100,70,30,0.4)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      <div style={{ fontSize: 320, fontWeight: 700, color: "#d4aa60", fontFamily: FONT_MINCHO, lineHeight: 1, textShadow: "0 0 40px rgba(212,170,96,0.4)", transform: `scale(${scale})`, opacity }}>
        {count}
      </div>
    </div>
  );
};

// ─── タイトルカード（001行目）────────────────────────────
const TitleCard: React.FC<{ text: string; opacity: number; popY: number }> = ({ text, opacity, popY }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 40,
      padding: "0 56px",
      opacity,
      transform: `translateY(${popY}px)`,
    }}
  >
    {/* 上下ライン */}
    <div style={{ width: 120, height: 3, background: "#d4aa60", borderRadius: 2, boxShadow: "0 0 12px rgba(212,170,96,0.6)" }} />

    <div
      style={{
        textAlign: "center",
        fontFamily: FONT_MINCHO,
        fontSize: 76,
        fontWeight: 900,
        color: "#d4aa60",
        lineHeight: 1.6,
        letterSpacing: "0.06em",
        textShadow: SHADOW_GOLD,
        wordBreak: "break-all",
        // 背景
        background: "rgba(0,0,0,0.55)",
        borderRadius: 20,
        padding: "32px 40px",
        width: "100%",
      }}
    >
      {renderLines(text, "#ffffff")}
    </div>

    <div style={{ width: 120, height: 3, background: "#d4aa60", borderRadius: 2, boxShadow: "0 0 12px rgba(212,170,96,0.6)" }} />
  </div>
);

// ─── 本文カード（002〜026）───────────────────────────────
const BodyCard: React.FC<{ text: string; opacity: number; popY: number; title: string }> = ({ text, opacity, popY, title }) => (
  <>
    {/* 上部タイトルラベル（隷書体・固定） */}
    <div
      style={{
        position: "absolute",
        top: 64,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: FONT_REISHO,
        fontSize: 46,
        fontWeight: 700,
        color: "#f5e8c0",
        letterSpacing: "0.25em",
        textShadow: SHADOW_BODY,
      }}
    >
      {title}
    </div>

    {/* 本文テキスト（明朝極太・固定60px・横15文字基準） */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "170px 50px 190px",
        opacity,
        transform: `translateY(${popY}px)`,
      }}
    >
      {/* 暗い背景ボックス */}
      <div
        style={{
          position: "absolute",
          left: 36,
          right: 36,
          top: "calc(50% - 280px)",
          bottom: "calc(50% - 280px)",
          background: "rgba(0,0,0,0.52)",
          borderRadius: 20,
        }}
      />
      {/* テキスト */}
      <div
        style={{
          position: "relative",
          width: "100%",
          textAlign: "left",
          fontFamily: FONT_MINCHO,
          fontSize: 66,         // 固定（1080px幅・横約14文字）
          fontWeight: 900,
          color: "#ffffff",
          lineHeight: 1.7,
          letterSpacing: "0.02em",
          textShadow: SHADOW_BODY,
          wordBreak: "break-all",
        }}
      >
        {renderLines(text)}
      </div>
    </div>
  </>
);

// ─── エンディングカード（最終行）─────────────────────────
const EndingCard: React.FC<{ text: string; opacity: number; popY: number; title: string }> = ({ text, opacity, popY, title }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 36,
      padding: "0 56px",
      opacity,
      transform: `translateY(${popY}px)`,
    }}
  >
    {/* チャンネル名 */}
    <div
      style={{
        fontFamily: FONT_REISHO,
        fontSize: 40,
        fontWeight: 700,
        color: "#fbebd0",
        letterSpacing: "0.2em",
        textShadow: SHADOW_GOLD,
        textAlign: "center",
      }}
    >
      {title}
    </div>

    <div style={{ width: 80, height: 2, background: "rgba(212,170,96,0.7)" }} />

    {/* エンディングテキスト（金・大きく） */}
    <div
      style={{
        textAlign: "center",
        fontFamily: FONT_MINCHO,
        fontSize: 66,
        fontWeight: 900,
        color: "#fbebd0",
        lineHeight: 1.65,
        letterSpacing: "0.04em",
        textShadow: SHADOW_GOLD,
        wordBreak: "break-all",
        background: "rgba(0,0,0,0.55)",
        borderRadius: 20,
        padding: "32px 40px",
        width: "100%",
      }}
    >
      {renderLines(text, "#ffffff")}
    </div>
  </div>
);

// ─── メインコンポーネント ─────────────────────────────────
export const KatsuScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const data = linesData as LinesData;
  const lines = data.lines as LineData[];
  const hasBgm = data.hasBgm;
  const title = data.title ?? "偉人の言葉";

  const lineFrames = lines.map(l => Math.round(l.duration * FPS));
  const totalBodyFrames = lineFrames.reduce((a, b) => a + b, 0);
  const totalFrames = COUNTDOWN_FRAMES + totalBodyFrames;

  if (frame < COUNTDOWN_FRAMES) {
    return <Countdown frame={frame} />;
  }

  const bodyFrame = frame - COUNTDOWN_FRAMES;
  const { line, localFrame, lf, index } = getLineAtFrame(bodyFrame, lines, lineFrames);

  // Ken Burns（行ごとに5パターン循環）
  const KB_PATTERNS = [
    { fromCX: 0.5, toCX: 0.5, fromCY: 0.48, toCY: 0.52, fromScale: 1.05, toScale: 1.0 },
    { fromCX: 0.48, toCX: 0.52, fromCY: 0.5, toCY: 0.5, fromScale: 1.05, toScale: 1.0 },
    { fromCX: 0.52, toCX: 0.48, fromCY: 0.5, toCY: 0.5, fromScale: 1.05, toScale: 1.0 },
    { fromCX: 0.5, toCX: 0.5, fromCY: 0.52, toCY: 0.48, fromScale: 1.05, toScale: 1.0 },
    { fromCX: 0.5, toCX: 0.5, fromCY: 0.5, toCY: 0.5, fromScale: 1.08, toScale: 0.98 },
  ];
  const kb = KB_PATTERNS[index % KB_PATTERNS.length];
  const kbProgress = localFrame / Math.max(lf - 1, 1);
  const kbScale = lerp(kb.fromScale, kb.toScale, kbProgress);
  const centerX = lerp(kb.fromCX, kb.toCX, kbProgress);
  const centerY = lerp(kb.fromCY, kb.toCY, kbProgress);
  const translateX = (0.5 - centerX) * 1080;
  const translateY = (0.5 - centerY) * 1920;

  // テキストアニメーション
  const popY = spring({ fps, frame: localFrame, config: { damping: 16, stiffness: 200, mass: 0.8 }, from: 60, to: 0, durationInFrames: 20 });
  const popOpacity = spring({ fps, frame: localFrame, config: { damping: 20, stiffness: 300, mass: 0.6 }, from: 0, to: 1, durationInFrames: 15 });
  const fadeOut = interpolate(localFrame, [lf - 6, lf - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textOpacity = popOpacity * fadeOut;

  // BGM
  const bgmVolume = hasBgm
    ? interpolate(frame, [0, BGM_FADE_FRAMES, totalFrames - BGM_FADE_FRAMES, totalFrames - 1], [0, BGM_VOLUME, BGM_VOLUME, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  const startFrames = lineFrames.reduce<number[]>((acc, f, i) => {
    acc.push(i === 0 ? COUNTDOWN_FRAMES : acc[i - 1] + lineFrames[i - 1]);
    return acc;
  }, []);
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", background: "#1a0f05" }}>
      {hasBgm && <Audio src={staticFile("bgm.mp3")} volume={bgmVolume} />}
      {lines.map((l, i) => (
        <Sequence key={i} from={startFrames[i]} durationInFrames={lineFrames[i]}>
          <Audio src={staticFile(`lines/${l.audio}`)} />
        </Sequence>
      ))}

      {/* 背景（Ken Burns） */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <img
          key={index}
          src={staticFile("bg.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "sepia(85%) brightness(0.78) contrast(1.05)",
            transform: `scale(${kbScale}) translate(${translateX}px, ${translateY}px)`,
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* ビネット */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 45%, rgba(10,5,0,0.75) 100%)", pointerEvents: "none" }} />

      {/* フィルムライン */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 4px)", pointerEvents: "none" }} />

      {/* 行タイプ別レンダリング */}
      {line.type === "title"   && <TitleCard  text={line.text} opacity={textOpacity} popY={popY} />}
      {line.type === "body"    && <BodyCard   text={line.text} opacity={textOpacity} popY={popY} title={title} />}
      {line.type === "ending"  && <EndingCard text={line.text} opacity={textOpacity} popY={popY} title={title} />}

      {/* クレジット（YouTube Shorts UIを避けて bottom: 210） */}
      <div
        style={{
          position: "absolute",
          bottom: 210,
          right: 24,
          fontSize: 22,
          color: "rgba(255,255,255,0.7)",
          fontFamily: FONT_MINCHO,
          textShadow: "1px 1px 3px rgba(0,0,0,0.9)",
          lineHeight: 1.6,
          textAlign: "right",
        }}
      >
        <div>音声：VOICEVOX 青山龍星</div>
        {hasBgm && <div>BGM：〇〇〇〇</div>}
      </div>
    </div>
  );
};
