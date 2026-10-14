import { Audio, Sequence, staticFile } from "remotion";
import { AudioClip } from "../data/script";
import { WaBackground } from "./WaBackground";
import { VerticalText } from "./VerticalText";

type Props = {
  text: string;
  audioClips: AudioClip[];
};

const PRE = 15;

export const OutroScene: React.FC<Props> = ({ text, audioClips }) => {
  let offset = PRE;
  const clipOffsets = audioClips.map((clip) => {
    const start = offset;
    offset += clip.durationInFrames;
    return start;
  });

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <WaBackground />

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 12, background: "#C0392B" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 12, background: "#C0392B" }} />

      {/* 中央テキスト */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <VerticalText text={text} fontSize={64} color="#2C1810" delay={8} maxCharsPerColumn={15} />
      </div>

      {/* 人生哲学ラベル（イントロと同じ） */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#C0392B",
            color: "#F5EDD8",
            fontSize: 32,
            fontFamily: '"Noto Serif JP", serif',
            padding: "8px 32px",
            letterSpacing: "0.3em",
            writingMode: "horizontal-tb",
          }}
        >
          人 生 哲 学
        </div>
      </div>

      {audioClips.map((clip, i) => (
        <Sequence key={i} from={clipOffsets[i]} durationInFrames={clip.durationInFrames}>
          <Audio src={staticFile(clip.file)} />
        </Sequence>
      ))}
    </div>
  );
};
