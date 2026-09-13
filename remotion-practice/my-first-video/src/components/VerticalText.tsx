import { interpolate, useCurrentFrame } from "remotion";

type Props = {
  text: string;
  fontSize?: number;
  color?: string;
  delay?: number;
  maxCharsPerColumn?: number; // 1列に収める最大文字数（デフォルト15）
  lineHeight?: number;
};

export const VerticalText: React.FC<Props> = ({
  text,
  fontSize = 64,
  color = "#2C1810",
  delay = 0,
  maxCharsPerColumn = 15,
  lineHeight = 1.55,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateX = interpolate(frame, [delay, delay + 12], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 1列の高さ = fontSize × lineHeight × maxChars
  const columnHeight = Math.round(fontSize * lineHeight * maxCharsPerColumn);

  return (
    <div
      style={{
        writingMode: "vertical-rl",
        textOrientation: "mixed",
        fontSize,
        color,
        lineHeight,
        letterSpacing: "0.08em",
        fontFamily: '"Noto Serif JP", "Yu Mincho", "YuMincho", "ヒラギノ明朝 ProN", serif',
        fontWeight: 700,
        opacity,
        transform: `translateX(${translateX}px)`,
        whiteSpace: "pre-wrap",
        // 高さを制限 → 溢れたテキストが左に新しい列を形成する
        height: columnHeight,
        overflow: "visible",
      }}
    >
      {text}
    </div>
  );
};
