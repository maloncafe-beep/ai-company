import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { TitleCard } from "./TitleCard";
import { DriftClip } from "./components/DriftClip";

export const RemotionRoot: React.FC = () => (
  <>
    <MyComposition />
    <Composition
      id="TitleCard"
      component={TitleCard}
      durationInFrames={90}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        title: "曽爾高原",
        subtitle: "SONI KOUGEN",
      }}
    />
    <Composition
      id="DriftClip"
      component={DriftClip}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        file: "wide/placeholder.jpg",
        direction: "left-to-right" as const,
      }}
    />
  </>
);
