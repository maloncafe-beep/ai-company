import { useCurrentFrame, interpolate, spring, useVideoConfig, staticFile, Audio, Sequence } from "remotion";
import { slides, slideFrames, getSlideAtFrame, totalFrames } from "./slides";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export const SlideScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { slide, localFrame, totalSlideFrames } = getSlideAtFrame(frame);
  const { kenBurns } = slide;

  // Ken Burns進行度（0〜1）
  const kbProgress = localFrame / Math.max(totalSlideFrames - 1, 1);

  const scale = lerp(kenBurns.fromScale, kenBurns.toScale, kbProgress);
  const centerX = lerp(kenBurns.fromCX, kenBurns.toCX, kbProgress);
  const centerY = lerp(kenBurns.fromCY, kenBurns.toCY, kbProgress);

  // scale=0.97 → 画像を 1/0.97 ≈ 1.03倍に拡大して端を見せない
  const renderScale = 1 / scale;
  const translateX = (0.5 - centerX) * width;
  const translateY = (0.5 - centerY) * height;

  // テキストのポッピンイン（約900ms = 27フレーム）
  const popScale = spring({
    fps,
    frame: localFrame,
    config: { damping: 14, stiffness: 220, mass: 0.7 },
    from: 0,
    to: 1,
    durationInFrames: 27,
  });

  // スライド切り替え時のフェード
  const fadeIn = interpolate(localFrame, [0, 4], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(
    localFrame,
    [totalSlideFrames - 5, totalSlideFrames - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = fadeIn * fadeOut;

  // BGM フェードイン/アウト（各2秒）
  const BGM_FADE_FRAMES = 60;
  const bgmVolume = interpolate(
    frame,
    [0, BGM_FADE_FRAMES, totalFrames - BGM_FADE_FRAMES, totalFrames - 1],
    [0, 0.35, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const lines = slide.text.split("\n");

  // 各スライドの開始フレームを計算
  const slideStartFrames = slideFrames.reduce<number[]>((acc, f, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + slideFrames[i - 1]);
    return acc;
  }, []);

  return (
    // 白背景は常時表示（フェードさせない）
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
      <Audio src={staticFile("audio/bgm.mp3")} volume={bgmVolume} />

      {/* TTS 音声（スライドごと） */}
      {slides.map((s, i) => (
        <Sequence key={i} from={slideStartFrames[i]} durationInFrames={slideFrames[i]}>
          <Audio src={staticFile(`audio/${s.audio}`)} />
        </Sequence>
      ))}

      {/* 背景イラスト（Ken Burns）— 画像だけフェード */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          opacity,
        }}
      >
        <img
          src={staticFile(`images/${slide.image}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${renderScale}) translate(${translateX}px, ${translateY}px)`,
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* テキストオーバーレイ（上部・白文字+黒アウトライン）— テキストもフェード */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "60px 42px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity,
          transform: `scale(${popScale})`,
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            padding: "28px 36px",
            width: "100%",
            textAlign: "center",
          }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: 72,
                fontWeight: 700,
                fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
                color: "#ffffff",
                lineHeight: 1.4,
                letterSpacing: "0.02em",
                textShadow:
                  "-6px -6px 0 #000, 6px -6px 0 #000, -6px 6px 0 #000, 6px 6px 0 #000," +
                  "-6px 0 0 #000, 6px 0 0 #000, 0 -6px 0 #000, 0 6px 0 #000",
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
