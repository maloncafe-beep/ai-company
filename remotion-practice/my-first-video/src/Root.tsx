import "./index.css";
import { MyComposition } from "./Composition";
import { PhilosophyShortComposition } from "./compositions/PhilosophyShort";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <PhilosophyShortComposition />
    </>
  );
};
