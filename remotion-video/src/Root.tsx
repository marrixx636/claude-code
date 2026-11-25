import { Composition } from "remotion";
import { Story1, STORY1_DURATION } from "./christmas/stories/Story1";
import { Story2, STORY2_DURATION } from "./christmas/stories/Story2";
import { Story3, STORY3_DURATION } from "./christmas/stories/Story3";

const common = { fps: 30, width: 1080, height: 1920 } as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Navidad1-LoEcharonDelTrineo" component={Story1} durationInFrames={STORY1_DURATION} {...common} />
      <Composition id="Navidad2-SantaSeCayo" component={Story2} durationInFrames={STORY2_DURATION} {...common} />
      <Composition id="Navidad3-LaCarta" component={Story3} durationInFrames={STORY3_DURATION} {...common} />
    </>
  );
};
