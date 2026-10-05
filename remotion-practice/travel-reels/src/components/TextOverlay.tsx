import { interpolate } from "remotion";

type Props = {
  location: string;
  comment: string;
  frame: number;
  totalFrames: number;
};

export const TextOverlay: React.FC<Props> = ({ location, comment, frame, totalFrames }) => {
  if (!location && !comment) return null;

  const slideUp = interpolate(frame, [0, 18], [40, 0], {
    extrapolateRight: "clamp",
  });
  const fadeIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [totalFrames - 10, totalFrames - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "60px 48px 64px",
        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
        transform: `translateY(${slideUp}px)`,
        opacity,
      }}
    >
      {location && (
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
            letterSpacing: "0.04em",
            textShadow: "1px 2px 8px rgba(0,0,0,0.8)",
            lineHeight: 1.3,
          }}
        >
          {location}
        </div>
      )}
      {comment && (
        <div
          style={{
            marginTop: 12,
            fontSize: 36,
            fontWeight: 400,
            color: "rgba(255,255,255,0.88)",
            fontFamily: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
            letterSpacing: "0.03em",
            textShadow: "1px 1px 6px rgba(0,0,0,0.8)",
            lineHeight: 1.5,
          }}
        >
          {comment}
        </div>
      )}
    </div>
  );
};
