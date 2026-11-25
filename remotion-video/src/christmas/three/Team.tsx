import React from "react";
import { useCurrentFrame } from "remotion";
import { V3 } from "../lib/anim";
import { Rope } from "./fx";
import { Reindeer, ReindeerProps } from "./Reindeer";
import { Santa, SantaProps } from "./People";
import { Sleigh } from "./World";

/** Sleigh (facing +x) with optional Santa, adult pair and baby leader. */
export const Team: React.FC<{
  position?: V3;
  rotation?: V3;
  scale?: number;
  santa?: SantaProps | false;
  adults?: boolean;
  baby?: "lead" | "only" | false;
  babyProps?: ReindeerProps;
  sack?: number;
  gallop?: number;
  children?: React.ReactNode;
}> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  santa = {},
  adults = true,
  baby = "lead",
  babyProps = {},
  sack = 1,
  gallop = 1,
  children,
}) => {
  const frame = useCurrentFrame();
  const phase = frame * 0.32;
  const babyX = baby === "only" ? 3.0 : adults ? 5.4 : 3.0;
  const deerRot: V3 = [0, Math.PI / 2, 0];
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Sleigh sack={sack}>
        {santa !== false && (
          <Santa position={[-0.3, 0.45, 0]} rotation={[0, Math.PI / 2 - 0.9, 0]} scale={0.58} {...santa} />
        )}
      </Sleigh>
      {adults &&
        [0.55, -0.55].map((z, i) => (
          <group key={z}>
            <Reindeer
              position={[3.0, 0.25 + Math.sin(phase + i) * 0.06, z]}
              rotation={deerRot}
              scale={0.78}
              adult
              legPhase={phase + i * 1.3}
              legAmp={0.55 * gallop}
              mood="happy"
            />
            <Rope a={[1.35, 0.9, z * 0.7]} b={[3.15, 1.0, z]} />
          </group>
        ))}
      {baby && (
        <>
          <Reindeer
            position={[babyX, 0.35 + Math.sin(phase + 2) * 0.08, 0]}
            rotation={deerRot}
            scale={0.7}
            legPhase={phase + 2}
            legAmp={0.6 * gallop}
            mood="happy"
            {...babyProps}
          />
          <Rope a={adults ? [3.6, 1.0, 0] : [1.35, 0.9, 0]} b={[babyX + 0.2, 1.05, 0]} color="#8a1c22" />
        </>
      )}
      {children}
    </group>
  );
};
