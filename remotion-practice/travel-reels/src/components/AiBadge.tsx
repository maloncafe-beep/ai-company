export const AiBadge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 28,
      right: 28,
      background: "rgba(0,0,0,0.55)",
      borderRadius: 8,
      padding: "6px 14px",
      display: "flex",
      alignItems: "center",
      gap: 6,
      backdropFilter: "blur(4px)",
      border: "1px solid rgba(255,255,255,0.2)",
    }}
  >
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: "#60c0ff",
        boxShadow: "0 0 6px #60c0ff",
      }}
    />
    <span
      style={{
        fontSize: 22,
        fontWeight: 700,
        color: "#ffffff",
        letterSpacing: "0.05em",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}
    >
      AI Generated
    </span>
  </div>
);
