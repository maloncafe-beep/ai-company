import { Composition } from "remotion";
import { SlideScene } from "./SlideScene";
import { totalFrames, FPS, VIDEO_WIDTH, VIDEO_HEIGHT } from "./slides";

export const MyComposition = () => {
  return (
    <Composition
      id="HabitsVideo"
      component={SlideScene}
      durationInFrames={totalFrames}
      fps={FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
    />
  );
};
