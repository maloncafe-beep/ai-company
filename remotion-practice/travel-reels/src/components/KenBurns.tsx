import { Img, staticFile } from "remotion";

type Pattern = {
  fromScale: number; toScale: number;
  fromX: number; toX: number;
  fromY: number; toY: number;
};

const PATTERNS: Pattern[] = [
  { fromScale: 1.08, toScale: 1.0, fromX: 50, toX: 50, fromY: 48, toY: 52 },
  { fromScale: 1.0, toScale: 1.08, fromX: 48, toX: 52, fromY: 50, toY: 50 },
  { fromScale: 1.06, toScale: 1.0, fromX: 52, toX: 48, fromY: 50, toY: 50 },
  { fromScale: 1.0, toScale: 1.06, fromX: 50, toX: 50, fromY: 52, toY: 48 },
  { fromScale: 1.1, toScale: 1.0, fromX: 50, toX: 50, fromY: 50, toY: 50 },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type Props = {
  file: string;
  frame: number;
  totalFrames: number;
  patternIndex: number;
};

export const KenBurns: React.FC<Props> = ({ file, frame, totalFrames, patternIndex }) => {
  const p = PATTERNS[patternIndex % PATTERNS.length];
  const t = frame / Math.max(totalFrames - 1, 1);

  const scale = lerp(p.fromScale, p.toScale, t);
  const originX = lerp(p.fromX, p.toX, t);
  const originY = lerp(p.fromY, p.toY, t);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Img
        src={staticFile(`clips/${file}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          transformOrigin: `${originX}% ${originY}%`,
        }}
      />
    </div>
  );
};
