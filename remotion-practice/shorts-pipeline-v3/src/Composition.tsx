import { Composition } from "remotion";
import { KatsuScene } from "./KatsuScene";
import linesData from "./lines-data.json";

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;
const COUNTDOWN_FRAMES = 90;

export const MyComposition = () => {
  const bodyFrames = (linesData.lines as { duration: number }[])
    .reduce((sum, l) => sum + Math.round(l.duration * FPS), 0);

  const totalFrames = COUNTDOWN_FRAMES + bodyFrames;

  return (
    <Composition
      id="KatsuVideo"
      component={KatsuScene}
      durationInFrames={Math.max(totalFrames, 1)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
