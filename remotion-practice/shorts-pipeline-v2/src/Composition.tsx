import { Composition } from "remotion";
import { ShortsScene } from "./SlideScene";
import slidesData from "./slides-data.json";

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

export const MyComposition = () => {
  // 全セグメントのフレーム合計
  const totalFrames = (slidesData.slides as { segments: { duration: number }[] }[])
    .flatMap((slide) => slide.segments)
    .reduce((sum, seg) => sum + Math.round(seg.duration * FPS), 0);

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
