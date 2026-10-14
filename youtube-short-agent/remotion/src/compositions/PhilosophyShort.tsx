import { Audio, Composition, Sequence, staticFile } from "remotion";
import { videoScript } from "../data/script";
import { IntroScene } from "../components/IntroScene";
import { ItemScene } from "../components/ItemScene";
import { OutroScene } from "../components/OutroScene";

const totalDuration =
  videoScript.titleDurationInFrames +
  videoScript.items.reduce((sum, item) => sum + item.durationInFrames, 0) +
  videoScript.outroDurationInFrames;

export const PhilosophyShortComposition: React.FC = () => {
  return (
    <Composition
      id="PhilosophyShort"
      component={PhilosophyShortVideo}
      durationInFrames={totalDuration}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};

export const PhilosophyShortVideo: React.FC = () => {
  let offset = 0;

  const introStart = offset;
  offset += videoScript.titleDurationInFrames;

  const itemStarts = videoScript.items.map((item) => {
    const start = offset;
    offset += item.durationInFrames;
    return start;
  });

  const outroStart = offset;

  return (
    <>
      {/* BGM：動画全体を通して再生、音量は30%に抑えてナレーションを優先 */}
      <Audio src={staticFile("audio/Escort.mp3")} volume={0.3} />

      {/* イントロ */}
      <Sequence from={introStart} durationInFrames={videoScript.titleDurationInFrames}>
        <IntroScene title={videoScript.title} audioFile={videoScript.titleAudio} />
      </Sequence>

      {/* 各項目 */}
      {videoScript.items.map((item, i) => (
        <Sequence key={i} from={itemStarts[i]} durationInFrames={item.durationInFrames}>
          <ItemScene
            number={item.number}
            title={item.title}
            body={item.body}
            audioClips={item.audioClips}
            totalItems={videoScript.items.length}
          />
        </Sequence>
      ))}

      {/* アウトロ */}
      <Sequence from={outroStart} durationInFrames={videoScript.outroDurationInFrames}>
        <OutroScene text={videoScript.outro} audioClips={videoScript.outroClips} />
      </Sequence>
    </>
  );
};
