import { Composition } from "remotion";
import { ShortsScene } from "./SlideScene";
import slidesData from "./slides-data.json";

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;
export const MyComposition = () => {
  const slides = slidesData.slides as { duration: number }[];
  const totalFrames = slides.reduce(
    (sum, s) => sum + Math.round(s.duration * FPS),
    slides.length === 0 ? 1 : 0
  );

  return (
    <Composition
      id="ShortsVideo"
      component={ShortsScene}
      durationInFrames={Math.max(totalFrames, 1)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
