import { Img, staticFile } from "remotion";

// 全クリップ共通: ズームイン統一・左→右へ微速パン（動きの方向と速度を揃える）
const FROM_SCALE = 1.0;
const TO_SCALE = 1.08;
const FROM_X = 48;
const TO_X = 52;
const ORIGIN_Y = 50;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type Props = {
  file: string;
  frame: number;
  totalFrames: number;
};

export const KenBurns: React.FC<Props> = ({ file, frame, totalFrames }) => {
  const t = frame / Math.max(totalFrames - 1, 1);

  const scale = lerp(FROM_SCALE, TO_SCALE, t);
  const originX = lerp(FROM_X, TO_X, t);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Img
        src={staticFile(`clips/${file}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          transformOrigin: `${originX}% ${ORIGIN_Y}%`,
        }}
      />
    </div>
  );
};
