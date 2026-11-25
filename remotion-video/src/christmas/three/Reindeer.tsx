import React from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { V3 } from "../lib/anim";
import { Glow, SoundRings } from "./fx";

export type Mood = "happy" | "sad" | "determined" | "scared" | "surprised" | "neutral";

export type ReindeerProps = {
  position?: V3;
  rotation?: V3;
  scale?: number;
  mood?: Mood;
  cry?: number;
  mouthOpen?: number;
  blink?: number;
  headTilt?: number;
  headTurn?: number;
  headRoll?: number;
  legPhase?: number;
  legAmp?: number;
  glow?: number;
  bellSwing?: number;
  rings?: number;
  soot?: number;
  adult?: boolean;
  lookY?: number;
};

const mixColor = (a: string, b: string, t: number) =>
  "#" + new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString();

const Fur: React.FC<{ color: string }> = ({ color }) => (
  <meshPhysicalMaterial color={color} roughness={0.9} sheen={0.6} sheenRoughness={0.6} sheenColor="#e8b98a" />
);

const Eye: React.FC<{ side: number; blink: number; mood: Mood; adult: boolean; lookY: number }> = ({
  side,
  blink,
  mood,
  adult,
  lookY,
}) => {
  const big = adult ? 0.62 : 1;
  const open = Math.max(0.06, 1 - blink) * (mood === "happy" ? 0.85 : 1) * (mood === "surprised" || mood === "scared" ? 1.12 : 1);
  let browRot = 0;
  let browY = 0.22;
  if (mood === "sad") browRot = side * -0.45;
  if (mood === "scared") {
    browRot = side * -0.3;
    browY = 0.27;
  }
  if (mood === "determined") browRot = side * 0.45;
  if (mood === "surprised") browY = 0.29;
  if (mood === "happy") browY = 0.25;
  return (
    <group position={[side * 0.2, 0.06, 0.4]} rotation={[0, side * 0.32, 0]} scale={big}>
      {/* white rim */}
      <mesh scale={[1.08, 1.2 * open, 0.55]}>
        <sphereGeometry args={[0.16, 32, 24]} />
        <meshPhysicalMaterial color="#fbf6ee" roughness={0.3} />
      </mesh>
      {/* iris */}
      <mesh position={[0, -0.01 + lookY * 0.03, 0.035]} scale={[1, 1.15 * open, 0.55]}>
        <sphereGeometry args={[0.145, 32, 24]} />
        <meshPhysicalMaterial color="#5a3317" roughness={0.15} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      {/* pupil */}
      <mesh position={[0, -0.01 + lookY * 0.03, 0.075]} scale={[1, 1.15 * open, 0.5]}>
        <sphereGeometry args={[0.1, 32, 24]} />
        <meshPhysicalMaterial color="#120a05" roughness={0.05} clearcoat={1} clearcoatRoughness={0.02} />
      </mesh>
      {open > 0.3 && (
        <>
          <mesh position={[0.045, 0.06 * open, 0.13]}>
            <sphereGeometry args={[0.042, 16, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.04, -0.05 * open, 0.125]}>
            <sphereGeometry args={[0.018, 12, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </>
      )}
      {/* brow */}
      <mesh position={[0, browY, 0.06]} rotation={[0, 0, Math.PI / 2 + browRot]}>
        <capsuleGeometry args={[0.022, 0.13, 4, 8]} />
        <meshStandardMaterial color="#4a2b14" />
      </mesh>
    </group>
  );
};

const Antler: React.FC<{ side: number; adult: boolean }> = ({ side, adult }) => {
  const s = adult ? 1.7 : 1;
  const col = "#6e4626";
  return (
    <group position={[side * 0.22, 0.42, -0.08]} rotation={[-0.2, 0, side * -0.35]} scale={s}>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 0.45, 8]} />
        <meshStandardMaterial color={col} roughness={0.8} />
      </mesh>
      <mesh position={[side * 0.08, 0.5, 0]} rotation={[0, 0, side * -0.5]}>
        <cylinderGeometry args={[0.03, 0.035, 0.25, 8]} />
        <meshStandardMaterial color={col} roughness={0.8} />
      </mesh>
      <mesh position={[side * -0.07, 0.3, 0.05]} rotation={[0.3, 0, side * 0.9]}>
        <cylinderGeometry args={[0.025, 0.03, 0.2, 8]} />
        <meshStandardMaterial color={col} roughness={0.8} />
      </mesh>
      <mesh position={[side * 0.13, 0.62, 0]}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshStandardMaterial color={col} />
      </mesh>
    </group>
  );
};

const Leg: React.FC<{ x: number; z: number; swing: number; color: string }> = ({ x, z, swing, color }) => (
  <group position={[x, 0.72, z]} rotation={[swing, 0, 0]}>
    <mesh position={[0, -0.3, 0]}>
      <capsuleGeometry args={[0.085, 0.45, 4, 12]} />
      <Fur color={color} />
    </mesh>
    <mesh position={[0, -0.64, 0.02]} scale={[1, 0.7, 1.15]}>
      <sphereGeometry args={[0.1, 16, 12]} />
      <meshStandardMaterial color="#3a2414" roughness={0.6} />
    </mesh>
  </group>
);

export const Reindeer: React.FC<ReindeerProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  mood = "neutral",
  cry = 0,
  mouthOpen = 0,
  blink = 0,
  headTilt = 0,
  headTurn = 0,
  headRoll = 0,
  legPhase = 0,
  legAmp = 0,
  glow = 0,
  bellSwing = 0,
  rings = 0,
  soot = 0,
  adult = false,
  lookY = 0,
}) => {
  const frame = useCurrentFrame();
  const fur = mixColor(adult ? "#8a5a34" : "#c98a4b", "#2a2522", soot);
  const cream = mixColor(adult ? "#e6d2b4" : "#f6e6cc", "#3b3632", soot);
  const scarfCol = mixColor("#c0222c", "#3a1c1c", soot * 0.7);
  const swing = Math.sin(legPhase) * legAmp;
  const headScale = adult ? 0.72 : 1;
  const sorrow = mood === "sad" || mood === "scared";

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* body */}
      <mesh position={[0, 0.9, -0.35]} scale={[0.5, 0.46, adult ? 0.95 : 0.72]}>
        <sphereGeometry args={[1, 48, 32]} />
        <Fur color={fur} />
      </mesh>
      <mesh position={[0, 0.78, -0.22]} scale={[0.36, 0.32, 0.52]}>
        <sphereGeometry args={[1, 32, 24]} />
        <Fur color={cream} />
      </mesh>
      {/* tail */}
      <mesh position={[0, 1.05, adult ? -1.28 : -1.03]}>
        <sphereGeometry args={[0.13, 16, 12]} />
        <Fur color={cream} />
      </mesh>
      <Leg x={0.24} z={0.05} swing={swing} color={fur} />
      <Leg x={-0.24} z={0.05} swing={-swing} color={fur} />
      <Leg x={0.24} z={adult ? -0.9 : -0.68} swing={-swing} color={fur} />
      <Leg x={-0.24} z={adult ? -0.9 : -0.68} swing={swing} color={fur} />
      {/* neck */}
      <mesh position={[0, 1.25, 0.05]} rotation={[0.45, 0, 0]}>
        <capsuleGeometry args={[0.22, 0.35, 6, 16]} />
        <Fur color={fur} />
      </mesh>
      {/* scarf */}
      <mesh position={[0, 1.2, 0.08]} rotation={[Math.PI / 2 - 0.45, 0, 0]}>
        <torusGeometry args={[0.24, 0.1, 16, 32]} />
        <meshStandardMaterial color={scarfCol} roughness={1} />
      </mesh>
      <mesh position={[0.18, 0.98, 0.3]} rotation={[0.3, 0, 0.25]}>
        <boxGeometry args={[0.16, 0.38, 0.07]} />
        <meshStandardMaterial color={scarfCol} roughness={1} />
      </mesh>
      {/* bell */}
      <group position={[0, 1.07, 0.36]} rotation={[0, 0, bellSwing]}>
        <mesh position={[0, -0.12, 0]}>
          <sphereGeometry args={[0.11, 24, 16]} />
          <meshPhysicalMaterial
            color="#f3c13a"
            metalness={0.35}
            roughness={0.25}
            clearcoat={1}
            emissive="#b37a00"
            emissiveIntensity={0.35 + glow * 1.2}
          />
        </mesh>
        <mesh position={[0, -0.2, 0.03]} scale={[1, 0.35, 0.6]}>
          <sphereGeometry args={[0.05, 12, 8]} />
          <meshStandardMaterial color="#3a2a10" />
        </mesh>
        {glow > 0 && <Glow position={[0, -0.12, 0.05]} scale={0.35 + glow * 0.8} color="#ffcf4d" opacity={glow * 0.75} />}
      </group>
      {rings > 0 && <SoundRings position={[0, 0.95, 0.5]} strength={rings} />}
      {/* head */}
      <group position={[0, 1.65, 0.25]} rotation={[headTilt, headTurn, headRoll]} scale={headScale}>
        <mesh scale={[1, 0.95, 0.95]}>
          <sphereGeometry args={[0.52, 48, 32]} />
          <Fur color={fur} />
        </mesh>
        <mesh position={[0, -0.13, 0.2]} scale={[0.85, 0.72, 0.8]}>
          <sphereGeometry args={[0.42, 32, 24]} />
          <Fur color={cream} />
        </mesh>
        {/* hair tuft */}
        {[-0.08, 0, 0.08].map((x, i) => (
          <mesh key={i} position={[x, 0.49, 0.08 - i * 0.02]} rotation={[0.4, 0, x * 3]} scale={[0.6, 1, 0.6]}>
            <coneGeometry args={[0.07, 0.18, 8]} />
            <Fur color={mixColor(fur, "#7a4a22", 0.4)} />
          </mesh>
        ))}
        {/* muzzle */}
        <mesh position={[0, -0.2, 0.43]} scale={[0.28, 0.2, 0.2]}>
          <sphereGeometry args={[1, 32, 24]} />
          <Fur color={mixColor(cream, "#ffffff", 0.3)} />
        </mesh>
        {/* nose */}
        <mesh position={[0, -0.13, 0.62]} scale={[1.25, 0.9, 0.9]}>
          <sphereGeometry args={[0.1, 32, 24]} />
          <meshPhysicalMaterial
            color={adult ? "#2b1a10" : "#b81d24"}
            roughness={0.25}
            clearcoat={1}
            emissive="#ff2a2a"
            emissiveIntensity={adult ? 0 : glow * 2}
          />
        </mesh>
        {!adult && glow > 0 && <Glow position={[0, -0.13, 0.7]} scale={0.3 + glow * 0.6} color="#ff5a4a" opacity={glow * 0.8} />}
        {/* mouth */}
        {mouthOpen > 0.05 ? (
          <mesh position={[0, -0.32, 0.5]} scale={[0.09 + mouthOpen * 0.03, 0.04 + mouthOpen * 0.08, 0.05]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial color="#4a1414" />
          </mesh>
        ) : (
          <mesh position={[0, sorrow ? -0.34 : -0.29, 0.53]} rotation={[0.2, 0, sorrow ? 0 : Math.PI]}>
            <torusGeometry args={[0.06, 0.013, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#4a2010" />
          </mesh>
        )}
        <Eye side={1} blink={blink} mood={mood} adult={adult} lookY={lookY} />
        <Eye side={-1} blink={blink} mood={mood} adult={adult} lookY={lookY} />
        {/* cheeks */}
        {[1, -1].map((s) => (
          <mesh key={s} position={[s * 0.3, -0.12, 0.36]} scale={[1, 0.6, 0.3]}>
            <sphereGeometry args={[0.08, 16, 12]} />
            <meshBasicMaterial color="#ff8f8f" transparent opacity={0.35 * (1 - soot)} />
          </mesh>
        ))}
        {/* ears */}
        {[1, -1].map((s) => (
          <group key={s} position={[s * 0.47, 0.17, -0.05]} rotation={[0, 0, s * (sorrow ? -1.6 : -1.05)]}>
            <mesh position={[0, 0.16, 0]} scale={[0.11, 0.24, 0.05]}>
              <sphereGeometry args={[1, 20, 16]} />
              <Fur color={fur} />
            </mesh>
            <mesh position={[0, 0.16, 0.03]} scale={[0.07, 0.17, 0.03]}>
              <sphereGeometry args={[1, 16, 12]} />
              <meshStandardMaterial color="#e8a7a0" roughness={0.9} />
            </mesh>
          </group>
        ))}
        <Antler side={1} adult={adult} />
        <Antler side={-1} adult={adult} />
        {/* tears */}
        {cry > 0 &&
          [1, -1].map((s) =>
            [0, 0.33, 0.66].map((ph, k) => {
              const t = (frame * 0.025 + ph + (s > 0 ? 0.15 : 0)) % 1;
              return (
                <mesh
                  key={`${s}-${k}`}
                  position={[s * (0.25 + t * 0.06), -0.06 - t * 0.42, 0.47 - t * 0.06]}
                  scale={[0.032, 0.045, 0.032].map((v) => v * cry * (1 - t * 0.3)) as V3}
                >
                  <sphereGeometry args={[1, 12, 10]} />
                  <meshPhysicalMaterial
                    color="#bfe6ff"
                    roughness={0}
                    transmission={0.6}
                    transparent
                    opacity={0.85}
                    emissive="#8fd0ff"
                    emissiveIntensity={0.4}
                  />
                </mesh>
              );
            }),
          )}
        {cry > 0 &&
          [1, -1].map((s) => (
            <mesh key={`pool${s}`} position={[s * 0.24, -0.03, 0.49]} scale={[0.12, 0.03, 0.04].map((v) => v * cry) as V3}>
              <sphereGeometry args={[1, 16, 8]} />
              <meshPhysicalMaterial color="#cfeeff" roughness={0} emissive="#9fd8ff" emissiveIntensity={0.5} transparent opacity={0.8} />
            </mesh>
          ))}
      </group>
    </group>
  );
};
