import { Audio, staticFile } from "remotion";
import { WaBackground } from "./WaBackground";
import { VerticalText } from "./VerticalText";

type Props = {
  title: string;
  audioFile: string;
};

export const IntroScene: React.FC<Props> = ({ title, audioFile }) => {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <WaBackground />

      {/* 朱色の装飾帯（上） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 12,
          background: "#C0392B",
        }}
      />

      {/* 朱色の装飾帯（下） */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 12,
          background: "#C0392B",
        }}
      />

      {/* タイトル縦書き（上下中央） */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 180, // ラベル領域分だけ下げて視覚的中央に
        }}
      >
        <VerticalText text={title} fontSize={88} color="#2C1810" delay={5} maxCharsPerColumn={10} />
      </div>

      {/* 「人生哲学」ラベル */}
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

      {audioFile && <Audio src={staticFile(audioFile)} />}
    </div>
  );
};
