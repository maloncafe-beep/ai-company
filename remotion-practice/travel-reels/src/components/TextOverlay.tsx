import { interpolate } from "remotion";

type Props = {
  location: string;
  comment: string;
  frame: number;
  totalFrames: number;
  layout?: "vertical" | "horizontal";
  instant?: boolean;
};

const SHADOW = [
  "0px 2px 12px rgba(0,0,0,0.95)",
  "0px 0px 30px rgba(0,0,0,0.85)",
  "1px 1px 3px rgba(0,0,0,1)",
  "-1px -1px 3px rgba(0,0,0,1)",
].join(", ");

export const TextOverlay: React.FC<Props> = ({
  location,
  comment,
  frame,
  totalFrames,
  layout = "vertical",
  instant = false,
}) => {
  if (!location && !comment) return null;

  const fadeIn = instant
    ? 1
    : interpolate(frame, [0, layout === "horizontal" ? 8 : 24], [0, 1], {
        extrapolateRight: "clamp",
      });
  const fadeOut = interpolate(frame, [totalFrames - 15, totalFrames - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  if (layout === "horizontal") {
    return (
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 60px",
          opacity,
          pointerEvents: "none",
          textAlign: "center",
          fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', serif",
          color: "#ffffff",
          textShadow: SHADOW,
        }}
      >
        {comment && (
          <div style={{ fontSize: 68, fontWeight: 400, letterSpacing: "0.1em", lineHeight: 1.5 }}>
            {comment}
          </div>
        )}
        {location && (
          <div style={{ fontSize: 38, fontWeight: 300, letterSpacing: "0.18em", marginTop: 12 }}>
            {location}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* 詩的テキスト（comment）— 画面中央・縦書き・大きく */}
      {comment && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              fontSize: 56,
              fontWeight: 400,
              color: "#ffffff",
              fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', serif",
              letterSpacing: "0.14em",
              lineHeight: 1.8,
              maxHeight: "70%",
              textShadow: [
                "0px 2px 12px rgba(0,0,0,0.95)",
                "0px 0px 30px rgba(0,0,0,0.85)",
                "1px 1px 3px rgba(0,0,0,1)",
                "-1px -1px 3px rgba(0,0,0,1)",
              ].join(", "),
            }}
          >
            {comment}
          </div>
        </div>
      )}

      {/* 場所名（location）— 下部・小さく */}
      {location && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "40px 48px 56px",
            background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
            opacity,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 300,
              color: "rgba(255,255,255,0.80)",
              fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', serif",
              letterSpacing: "0.15em",
              textShadow: "1px 1px 6px rgba(0,0,0,0.8)",
            }}
          >
            {location}
          </div>
        </div>
      )}
    </>
  );
};
