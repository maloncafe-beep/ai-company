import {
  useCurrentFrame,
  interpolate,
  staticFile,
  Audio,
  Sequence,
  OffthreadVideo,
} from "remotion";
import clipsData from "./clips-data.json";
import { KenBurns } from "./components/KenBurns";
import { TextOverlay } from "./components/TextOverlay";
import { AiBadge } from "./components/AiBadge";

type Clip = {
  file: string;
  type: "photo" | "video";
  location: string;
  comment: string;
  duration: number;
  ai_generated: boolean;
};

const FPS = 30;
const FADE_FRAMES = 8;
const BGM_VOLUME = 0.35;
const BGM_FADE_FRAMES = 45;

// 1クリップ分の描画（Sequence 内部で使用 → useCurrentFrame は local frame）
const ClipView: React.FC<{ clip: Clip; clipIndex: number; totalFrames: number }> = ({
  clip,
  clipIndex,
  totalFrames,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, FADE_FRAMES], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [totalFrames - FADE_FRAMES, totalFrames - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {/* 映像 */}
      {clip.type === "photo" ? (
        <KenBurns
          file={clip.file}
          frame={frame}
          totalFrames={totalFrames}
          patternIndex={clipIndex}
        />
      ) : (
        <OffthreadVideo
          src={staticFile(`clips/${clip.file}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {/* テキストオーバーレイ */}
      <TextOverlay
        location={clip.location}
        comment={clip.comment}
        frame={frame}
        totalFrames={totalFrames}
      />

      {/* AI生成バッジ */}
      {clip.ai_generated && <AiBadge />}
    </div>
  );
};

export const TravelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const clips = clipsData.clips as Clip[];
  const hasBgm = clipsData.hasBgm;

  const clipFrames = clips.map((c) => Math.round(c.duration * FPS));
  const totalFrames = clipFrames.reduce((a, b) => a + b, 0);

  // 各クリップの開始フレーム
  const startFrames = clipFrames.reduce<number[]>((acc, f, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + clipFrames[i - 1]);
    return acc;
  }, []);

  // BGMボリューム（フェードイン/アウト）
  const bgmVolume = hasBgm
    ? interpolate(
        frame,
        [0, BGM_FADE_FRAMES, totalFrames - BGM_FADE_FRAMES, totalFrames - 1],
        [0, BGM_VOLUME, BGM_VOLUME, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        background: "#000000",
      }}
    >
      {/* BGM */}
      {hasBgm && <Audio src={staticFile("bgm.mp3")} volume={bgmVolume} />}

      {/* クリップ */}
      {clips.map((clip, i) => (
        <Sequence key={i} from={startFrames[i]} durationInFrames={clipFrames[i]}>
          <ClipView clip={clip} clipIndex={i} totalFrames={clipFrames[i]} />
        </Sequence>
      ))}
    </div>
  );
};
