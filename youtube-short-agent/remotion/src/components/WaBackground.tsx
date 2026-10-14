import { Img, staticFile } from "remotion";

// 和風背景コンポーネント
export const WaBackground: React.FC = () => {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* 背景画像（全画面・縦型にフィット） */}
      <Img
        src={staticFile("bg.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* 半透明オーバーレイ（テキストの読みやすさ確保） */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(245, 237, 216, 0.35)",
        }}
      />

      {/* 外枠 */}
      <div
        style={{
          position: "absolute",
          inset: 40,
          border: "2px solid rgba(139, 90, 43, 0.35)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 48,
          border: "1px solid rgba(139, 90, 43, 0.18)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
