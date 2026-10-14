import { Audio, Sequence, staticFile } from "remotion";
import { AudioClip } from "../data/script";
import { WaBackground } from "./WaBackground";
import { VerticalText } from "./VerticalText";

type Props = {
  number: number;
  title: string;
  body: string;
  audioClips: AudioClip[];
  totalItems: number;
};

const PRE = 15; // 音声開始前の余白フレーム

export const ItemScene: React.FC<Props> = ({ number, title, body, audioClips, totalItems }) => {
  // 各音声クリップの開始フレームを計算
  let offset = PRE;
  const clipOffsets = audioClips.map((clip) => {
    const start = offset;
    offset += clip.durationInFrames;
    return start;
  });

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <WaBackground />

      {/* 朱色の装飾帯 */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 12, background: "#C0392B" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 12, background: "#C0392B" }} />

      {/* 番号バッジ（左上） */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 70,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "#C0392B",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <span style={{ color: "#F5EDD8", fontSize: 36, fontFamily: "serif", lineHeight: 1 }}>
          {number}
        </span>
        <span style={{ color: "#F5EDD8", fontSize: 18, fontFamily: "serif", letterSpacing: "0.05em" }}>
          つ目
        </span>
      </div>

      {/* 進捗ドット（右側縦並び） */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {Array.from({ length: totalItems }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i + 1 === number ? 14 : 10,
              height: i + 1 === number ? 14 : 10,
              borderRadius: "50%",
              background: i + 1 === number ? "#C0392B" : "rgba(139,90,43,0.25)",
            }}
          />
        ))}
      </div>

      {/* テキストエリア（縦書き・中央） */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
          paddingRight: 50,
          paddingLeft: 30,
        }}
      >
        {/* 本文：最大4列×15文字 */}
        <VerticalText
          text={body}
          fontSize={60}
          color="#4A3020"
          delay={15}
          maxCharsPerColumn={15}
        />
        {/* 小タイトル：1列×15文字 */}
        <VerticalText
          text={title}
          fontSize={66}
          color="#2C1810"
          delay={0}
          maxCharsPerColumn={15}
        />
      </div>

      {/* 音声クリップを順番に再生 */}
      {audioClips.map((clip, i) => (
        <Sequence key={i} from={clipOffsets[i]} durationInFrames={clip.durationInFrames}>
          <Audio src={staticFile(clip.file)} />
        </Sequence>
      ))}
    </div>
  );
};
