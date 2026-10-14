import { CalculateMetadataFunction, Composition, interpolate, Sequence, useCurrentFrame } from "remotion";

type Props = {};

const calculateMetadata: CalculateMetadataFunction<Props> = () => {
  return {};
};

// 3秒 × 30fps = 90フレーム、4秒 = 120フレーム、合計300フレーム（10秒）
const FPS = 30;
const OPENING_DURATION = 2 * FPS;  // 60フレーム
const MAIN_DURATION = 6 * FPS;     // 180フレーム
const ENDING_DURATION = 2 * FPS;   // 60フレーム

export const MyComposition = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={OPENING_DURATION + MAIN_DURATION + ENDING_DURATION}
      fps={FPS}
      width={1280}
      height={720}
      calculateMetadata={calculateMetadata}
    />
  );
};

const FADE_FRAMES = 9; // 0.3秒 × 30fps

// フェードイン・フェードアウト付きのシーン共通コンポーネント
const Scene: React.FC<{ title: string; color?: string; backgroundColor?: string; durationInFrames: number }> = ({
  title,
  color = "#ffffff",
  backgroundColor = "#0F172A",
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, FADE_FRAMES], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - FADE_FRAMES, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);
  const translateY = interpolate(frame, [0, FADE_FRAMES], [30, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor }}>
      <h1
        style={{
          color,
          fontSize: 72,
          fontFamily: "sans-serif",
          margin: 0,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {title}
      </h1>
    </div>
  );
};

export const MyComponent: React.FC<Props> = () => {
  return (
    <>
      {/* シーン1：オープニング（0〜3秒） */}
      <Sequence from={0} durationInFrames={OPENING_DURATION}>
        <Scene title="私のチャンネルへようこそ" backgroundColor="#3B82F6" durationInFrames={OPENING_DURATION} />
      </Sequence>

      {/* シーン2：メイン（2〜8秒） */}
      <Sequence from={OPENING_DURATION} durationInFrames={MAIN_DURATION}>
        <Scene title="今日のテーマは〇〇です" color="#000000" backgroundColor="#FFFFFF" durationInFrames={MAIN_DURATION} />
      </Sequence>

      {/* シーン3：エンディング（8〜10秒） */}
      <Sequence from={OPENING_DURATION + MAIN_DURATION} durationInFrames={ENDING_DURATION}>
        <Scene title="チャンネル登録お願いします" backgroundColor="#8B5CF6" durationInFrames={ENDING_DURATION} />
      </Sequence>
    </>
  );
};
