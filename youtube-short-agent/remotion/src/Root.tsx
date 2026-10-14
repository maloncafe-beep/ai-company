import "./index.css";
import { MyComposition } from "./Composition";
import { PhilosophyShortComposition } from "./compositions/PhilosophyShort";
import { TedTravelShortComposition } from "./compositions/TedTravelShort";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <PhilosophyShortComposition />
      <TedTravelShortComposition />
    </>
  );
};
