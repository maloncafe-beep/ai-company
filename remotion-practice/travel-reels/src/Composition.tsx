import { Composition } from "remotion";
import { TravelScene } from "./TravelScene";
import clipsData from "./clips-data.json";

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

export const MyComposition = () => {
  const totalFrames = (clipsData.clips as { duration: number }[])
    .reduce((sum, c) => sum + Math.round(c.duration * FPS), 0);

  return (
    <Composition
      id="TravelVideo"
      component={TravelScene}
      durationInFrames={Math.max(totalFrames, 1)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
