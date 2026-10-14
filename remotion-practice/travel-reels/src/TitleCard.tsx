import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const SHADOW = [
  "0px 2px 12px rgba(0,0,0,0.95)",
  "0px 0px 30px rgba(0,0,0,0.85)",
  "1px 1px 3px rgba(0,0,0,1)",
  "-1px -1px 3px rgba(0,0,0,1)",
].join(", ");

type Props = {
  title: string;
  subtitle?: string;
};

export const TitleCard: React.FC<Props> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const titleScale = interpolate(frame, [0, 0.6 * fps], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });

  const titleTranslate = interpolate(frame, [0, 0.6 * fps], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const subtitleOpacity = interpolate(frame, [0.5 * fps, 1.1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          scale: titleScale,
          translate: `0px ${titleTranslate}px`,
          fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', serif",
          fontSize: 72,
          fontWeight: 400,
          letterSpacing: "0.1em",
          color: "#ffffff",
          textShadow: SHADOW,
          textAlign: "center",
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            opacity: subtitleOpacity,
            marginTop: 20,
            fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', serif",
            fontSize: 32,
            fontWeight: 300,
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.8)",
            textShadow: SHADOW,
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
