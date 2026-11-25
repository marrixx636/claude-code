import React from "react";
import { V3 } from "../lib/anim";

const Skin = () => <meshPhysicalMaterial color="#f2b99a" roughness={0.6} sheen={0.5} sheenColor="#ffd9c4" />;
const Red = () => <meshPhysicalMaterial color="#c4222b" roughness={0.85} sheen={1} sheenColor="#ff8c8c" />;
const White = () => <meshPhysicalMaterial color="#f7f4ef" roughness={1} sheen={1} sheenColor="#ffffff" />;

const SimpleEye: React.FC<{ x: number; y: number; z: number; r: number; blink?: number; happy?: boolean }> = ({
  x,
  y,
  z,
  r,
  blink = 0,
  happy = false,
}) =>
  happy ? (
    <mesh position={[x, y, z]} rotation={[0, 0, 0]}>
      <torusGeometry args={[r * 0.8, r * 0.22, 8, 16, Math.PI]} />
      <meshStandardMaterial color="#1a0f08" />
    </mesh>
  ) : (
    <group position={[x, y, z]}>
      <mesh scale={[1, 1.2 * Math.max(0.08, 1 - blink), 0.6]}>
        <sphereGeometry args={[r, 24, 16]} />
        <meshPhysicalMaterial color="#1a0f08" roughness={0.1} clearcoat={1} />
      </mesh>
      {blink < 0.5 && (
        <mesh position={[r * 0.35, r * 0.4, r * 0.5]}>
          <sphereGeometry args={[r * 0.3, 12, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
    </group>
  );

export type SantaProps = {
  position?: V3;
  rotation?: V3;
  scale?: number;
  mouthOpen?: number;
  armL?: number;
  armR?: number;
  headTilt?: number;
  headTurn?: number;
  worried?: boolean;
  happyEyes?: boolean;
  blink?: number;
};

export const Santa: React.FC<SantaProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  mouthOpen = 0,
  armL = 0.3,
  armR = 0.3,
  headTilt = 0,
  headTurn = 0,
  worried = false,
  happyEyes = false,
  blink = 0,
}) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh position={[0, 1.0, 0]} scale={[0.92, 0.95, 0.82]}>
      <sphereGeometry args={[1, 48, 32]} />
      <Red />
    </mesh>
    <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.9, 1]}>
      <torusGeometry args={[0.62, 0.14, 16, 40]} />
      <White />
    </mesh>
    <mesh position={[0, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.0, 0.88, 1]}>
      <torusGeometry args={[0.88, 0.09, 12, 48]} />
      <meshStandardMaterial color="#1b1410" roughness={0.4} />
    </mesh>
    <mesh position={[0, 0.95, 0.8]}>
      <boxGeometry args={[0.32, 0.24, 0.06]} />
      <meshPhysicalMaterial color="#f2c03a" metalness={0.3} roughness={0.3} emissive="#8a5a00" emissiveIntensity={0.4} />
    </mesh>
    {/* arms */}
    {[
      [1, armR],
      [-1, armL],
    ].map(([s, a]) => (
      <group key={s} position={[s * 0.82, 1.45, 0]} rotation={[0, 0, s * (0.5 + a)]}>
        <mesh position={[0, -0.4, 0]}>
          <capsuleGeometry args={[0.2, 0.5, 6, 12]} />
          <Red />
        </mesh>
        <mesh position={[0, -0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.07, 10, 20]} />
          <White />
        </mesh>
        <mesh position={[0, -0.9, 0]}>
          <sphereGeometry args={[0.17, 16, 12]} />
          <meshStandardMaterial color="#2f5d34" roughness={0.9} />
        </mesh>
      </group>
    ))}
    {/* head */}
    <group position={[0, 2.12, 0.08]} rotation={[headTilt, headTurn, 0]}>
      <mesh>
        <sphereGeometry args={[0.45, 48, 32]} />
        <Skin />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={s} position={[s * 0.24, -0.06, 0.34]} scale={[1, 0.7, 0.5]}>
          <sphereGeometry args={[0.1, 16, 12]} />
          <meshBasicMaterial color="#ff8a80" transparent opacity={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.0, 0.44]}>
        <sphereGeometry args={[0.1, 20, 16]} />
        <meshPhysicalMaterial color="#e88f7c" roughness={0.5} />
      </mesh>
      <SimpleEye x={0.15} y={0.12} z={0.38} r={0.065} blink={blink} happy={happyEyes} />
      <SimpleEye x={-0.15} y={0.12} z={0.38} r={0.065} blink={blink} happy={happyEyes} />
      {[1, -1].map((s) => (
        <mesh key={s} position={[s * 0.16, 0.25, 0.37]} rotation={[0, 0, s * (worried ? -0.35 : 0.15)]} scale={[1, 0.5, 0.5]}>
          <capsuleGeometry args={[0.05, 0.14, 4, 8]} />
          <White />
        </mesh>
      ))}
      {/* beard */}
      <mesh position={[0, -0.38, 0.18]} scale={[0.55, 0.62, 0.42]}>
        <sphereGeometry args={[1, 32, 24]} />
        <White />
      </mesh>
      <mesh position={[0, -0.75, 0.22]} scale={[0.35, 0.3, 0.28]}>
        <sphereGeometry args={[1, 24, 16]} />
        <White />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={s} position={[s * 0.15, -0.1, 0.44]} rotation={[0, 0, s * -0.3]} scale={[0.2, 0.08, 0.08]}>
          <sphereGeometry args={[1, 16, 12]} />
          <White />
        </mesh>
      ))}
      {mouthOpen > 0.05 && (
        <mesh position={[0, -0.24, 0.5]} scale={[0.07 + mouthOpen * 0.04, 0.03 + mouthOpen * 0.08, 0.04]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#5a1a1a" />
        </mesh>
      )}
      {/* hat */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.1, 12, 32]} />
        <White />
      </mesh>
      <mesh position={[0, 0.62, -0.12]} rotation={[-0.55, 0, 0]}>
        <coneGeometry args={[0.4, 0.75, 32]} />
        <Red />
      </mesh>
      <mesh position={[0, 0.9, -0.38]}>
        <sphereGeometry args={[0.11, 16, 12]} />
        <White />
      </mesh>
    </group>
  </group>
);

export type GirlProps = {
  position?: V3;
  rotation?: V3;
  scale?: number;
  sad?: boolean;
  happy?: boolean;
  cry?: number;
  hug?: number;
  headTilt?: number;
  blink?: number;
};

export const Girl: React.FC<GirlProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  sad = false,
  happy = false,
  hug = 0,
  headTilt = 0,
  blink = 0,
}) => {
  const hair = "#6b3a1f";
  const pj = "#9fc3e6";
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* body (sitting) */}
      <mesh position={[0, 0.55, 0]} scale={[0.42, 0.55, 0.36]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshPhysicalMaterial color={pj} roughness={0.9} sheen={1} sheenColor="#ffffff" />
      </mesh>
      {/* legs folded */}
      {[1, -1].map((s) => (
        <mesh key={s} position={[s * 0.18, 0.15, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.12, 0.35, 6, 12]} />
          <meshPhysicalMaterial color={pj} roughness={0.9} />
        </mesh>
      ))}
      {/* arms */}
      {[1, -1].map((s) => (
        <group key={s} position={[s * 0.36, 0.85, 0]} rotation={[-hug * 1.3, 0, s * (0.35 - hug * 0.2)]}>
          <mesh position={[0, -0.25, 0]}>
            <capsuleGeometry args={[0.09, 0.35, 6, 12]} />
            <meshPhysicalMaterial color={pj} roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <sphereGeometry args={[0.09, 12, 10]} />
            <Skin />
          </mesh>
        </group>
      ))}
      {/* head */}
      <group position={[0, 1.38, 0.02]} rotation={[headTilt, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.42, 48, 32]} />
          <Skin />
        </mesh>
        <mesh position={[0, 0.08, -0.06]} scale={[1.08, 1.05, 1.05]}>
          <sphereGeometry args={[0.42, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={hair} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.05, -0.12]} scale={[1.05, 1, 0.9]}>
          <sphereGeometry args={[0.43, 32, 24]} />
          <meshStandardMaterial color={hair} roughness={0.8} />
        </mesh>
        {[1, -1].map((s) => (
          <mesh key={s} position={[s * 0.48, -0.1, -0.05]} scale={[0.6, 1, 0.6]}>
            <sphereGeometry args={[0.2, 20, 16]} />
            <meshStandardMaterial color={hair} roughness={0.8} />
          </mesh>
        ))}
        <SimpleEye x={0.15} y={0.0} z={0.37} r={0.075} blink={blink} happy={happy} />
        <SimpleEye x={-0.15} y={0.0} z={0.37} r={0.075} blink={blink} happy={happy} />
        {[1, -1].map((s) => (
          <mesh key={s} position={[s * 0.25, -0.12, 0.32]} scale={[1, 0.6, 0.4]}>
            <sphereGeometry args={[0.07, 12, 10]} />
            <meshBasicMaterial color="#ff8a8a" transparent opacity={0.45} />
          </mesh>
        ))}
        <mesh position={[0, sad ? -0.2 : -0.16, 0.39]} rotation={[0.2, 0, sad ? 0 : Math.PI]}>
          <torusGeometry args={[0.05, 0.012, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#7a2a2a" />
        </mesh>
      </group>
    </group>
  );
};
