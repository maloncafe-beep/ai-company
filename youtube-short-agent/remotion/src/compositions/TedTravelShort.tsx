import {
  AbsoluteFill,
  Composition,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const FPS = 25;
const WIDTH = 1920;
const HEIGHT = 1080;

type Scene = {
  bg: string;
  bear: string;
  text: string;
  durationInFrames: number;
};

// 元Filmoraプロジェクトのタイミングに合わせた4シーン構成
const scenes: Scene[] = [
  { bg: "ted/scene1.png", bear: "ted/bear/scene1.png", text: "高野山に行ったり", durationInFrames: 8 * FPS },
  { bg: "ted/scene2.png", bear: "ted/bear/scene2.png", text: "鍾乳洞を探検したり", durationInFrames: 5 * FPS },
  { bg: "ted/scene3.png", bear: "ted/bear/scene3.png", text: "廃線ウォークもやったりします", durationInFrames: 6 * FPS },
  { bg: "ted/scene4.png", bear: "ted/bear/scene4.png", text: "いいねとフォローをよろしくね", durationInFrames: 5 * FPS },
];

const TOTAL_DURATION = scenes.reduce((sum, s) => sum + s.durationInFrames, 0);

const FONT_FAMILY = "NotoSansJPBurn";

const Caption: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: HEIGHT * 0.14,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 40px",
      }}
    >
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 75,
          color: "#FFA500",
          WebkitTextStroke: "5px #FFFFFF",
          paintOrder: "stroke fill",
          textAlign: "center",
          lineHeight: 1.3,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );
};

const SceneView: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  // ゆっくりズーム（Ken Burns風）
  const scale = interpolate(frame, [0, scene.durationInFrames], [1, 1.08], {
    extrapolateRight: "clamp",
  });
  // フェードイン
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={staticFile(scene.bg)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <Img
        src={staticFile(scene.bear)}
        style={{
          position: "absolute",
          right: 40,
          bottom: HEIGHT * 0.14 + 40,
          width: 380,
          height: "auto",
        }}
      />
      <Caption text={scene.text} />
    </AbsoluteFill>
  );
};

export const TedTravelShortComponent: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <style>{`
        @font-face {
          font-family: '${FONT_FAMILY}';
          src: url('${staticFile("fonts/NotoSansJP-VF.ttf")}') format('truetype');
          font-weight: 100 900;
        }
      `}</style>
      {scenes.map((scene, i) => {
        const seq = (
          <Sequence key={i} from={from} durationInFrames={scene.durationInFrames}>
            <SceneView scene={scene} />
          </Sequence>
        );
        from += scene.durationInFrames;
        return seq;
      })}
    </AbsoluteFill>
  );
};

export const TedTravelShortComposition: React.FC = () => {
  return (
    <Composition
      id="TedTravelShort"
      component={TedTravelShortComponent}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
