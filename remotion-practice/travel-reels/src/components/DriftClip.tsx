import { Img, staticFile, AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export type DriftDirection = "left-to-right" | "right-to-left";

const DRIFT_SCALE = 1.2; // originのスイープを成立させるための固定ズーム

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export type DriftClipProps = {
  file: string; // staticFile相対パス（例: "wide/007.jpg"）
  direction: DriftDirection;
};

export const DriftClip: React.FC<DriftClipProps> = ({ file, direction }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / Math.max(durationInFrames - 1, 1);

  const [fromX, toX] = direction === "left-to-right" ? [20, 80] : [80, 20];
  const originX = lerp(fromX, toX, t);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img
        src={staticFile(file)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${DRIFT_SCALE})`,
          transformOrigin: `${originX}% 50%`,
        }}
      />
    </AbsoluteFill>
  );
};
