import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { SkyGradient } from "./fx";

export const NightLights: React.FC<{ key2?: number; warm?: number; storm?: number }> = ({
  key2 = 1,
  warm = 0.6,
  storm = 0,
}) => (
  <>
    <hemisphereLight args={["#8fb0ff", "#1a2240", 1.1 - storm * 0.4]} />
    <directionalLight position={[-6, 8, 6]} intensity={2.2 * key2} color="#cfe0ff" />
    <directionalLight position={[5, 3, 6]} intensity={1.4 * warm} color="#ffc98a" />
    <directionalLight position={[0, 4, -8]} intensity={2.5} color="#9fc0ff" />
    <ambientLight intensity={0.25} />
  </>
);

export const WarmLights: React.FC<{ level?: number }> = ({ level = 1 }) => (
  <>
    <hemisphereLight args={["#ffd8b0", "#3a2420", 0.7 * level + 0.25]} />
    <directionalLight position={[4, 6, 6]} intensity={1.6 * level + 0.3} color="#ffd2a0" />
    <directionalLight position={[-4, 3, 4]} intensity={0.8} color="#9fb4ff" />
    <ambientLight intensity={0.25} />
  </>
);

export const Stage: React.FC<{
  sky: string[];
  fog?: [string, number, number];
  children: React.ReactNode;
  overlay?: React.ReactNode;
}> = ({ sky, fog, children, overlay }) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      <ThreeCanvas width={width} height={height} camera={{ fov: 40, position: [0, 2, 8] }} gl={{ antialias: true }}>
        <SkyGradient stops={sky} />
        {fog && <fog attach="fog" args={fog} />}
        {children}
      </ThreeCanvas>
      {overlay}
    </AbsoluteFill>
  );
};

export const SKY_NIGHT = ["#050b24", "#0e1f4d", "#2a4a85"];
export const SKY_STORM = ["#0b0f1c", "#1f2638", "#3a4258"];
export const SKY_SUNRISE = ["#2b3a7a", "#c86a8a", "#ffb37a", "#ffe0a8"];
export const SKY_INSIDE = ["#000000", "#000000"];
