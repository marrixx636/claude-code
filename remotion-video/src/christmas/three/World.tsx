import React, { useMemo } from "react";
import { random } from "remotion";
import * as THREE from "three";
import { V3 } from "../lib/anim";
import { Glow } from "./fx";

const Gold = () => <meshPhysicalMaterial color="#e9b53b" metalness={0.3} roughness={0.3} emissive="#8a5a00" emissiveIntensity={0.4} />;

export const Gift: React.FC<{ position?: V3; size?: number; color?: string; ribbon?: string; rotation?: V3 }> = ({
  position = [0, 0, 0],
  size = 0.4,
  color = "#2f8f4e",
  ribbon = "#f2c94c",
  rotation = [0, 0, 0],
}) => (
  <group position={position} rotation={rotation}>
    <mesh>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
    <mesh>
      <boxGeometry args={[size * 1.02, size * 1.02, size * 0.18]} />
      <meshStandardMaterial color={ribbon} roughness={0.4} />
    </mesh>
    <mesh>
      <boxGeometry args={[size * 0.18, size * 1.02, size * 1.02]} />
      <meshStandardMaterial color={ribbon} roughness={0.4} />
    </mesh>
    {[1, -1].map((s) => (
      <mesh key={s} position={[s * size * 0.15, size * 0.58, 0]} rotation={[0, 0, s * 0.6]} scale={[1, 0.6, 0.5]}>
        <torusGeometry args={[size * 0.14, size * 0.04, 8, 16]} />
        <meshStandardMaterial color={ribbon} roughness={0.4} />
      </mesh>
    ))}
  </group>
);

const giftColors = ["#2f8f4e", "#c62f3a", "#3a6fd1", "#8e44ad", "#f39c12"];

/** Sleigh facing +x. */
export const Sleigh: React.FC<{
  position?: V3;
  rotation?: V3;
  scale?: number;
  sack?: number;
  children?: React.ReactNode;
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, sack = 1, children }) => (
  <group position={position} rotation={rotation} scale={scale}>
    {/* body */}
    <mesh position={[0, 0.75, 0]}>
      <boxGeometry args={[2.2, 0.6, 1.3]} />
      <meshPhysicalMaterial color="#b3141f" roughness={0.35} clearcoat={1} />
    </mesh>
    <mesh position={[-0.95, 1.25, 0]}>
      <boxGeometry args={[0.3, 1.0, 1.3]} />
      <meshPhysicalMaterial color="#b3141f" roughness={0.35} clearcoat={1} />
    </mesh>
    <mesh position={[1.1, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.35, 0.35, 1.3, 24, 1, false, 0, Math.PI]} />
      <meshPhysicalMaterial color="#b3141f" roughness={0.35} clearcoat={1} side={THREE.DoubleSide} />
    </mesh>
    {/* gold trims */}
    {[0.66, -0.66].map((z) => (
      <mesh key={z} position={[0, 1.06, z]}>
        <boxGeometry args={[2.3, 0.07, 0.05]} />
        <Gold />
      </mesh>
    ))}
    <mesh position={[-0.95, 1.77, 0]}>
      <boxGeometry args={[0.36, 0.07, 1.35]} />
      <Gold />
    </mesh>
    {/* runners */}
    {[0.55, -0.55].map((z) => (
      <group key={z} position={[0, 0, z]}>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[2.4, 0.07, 0.07]} />
          <Gold />
        </mesh>
        <mesh position={[1.2, 0.38, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <torusGeometry args={[0.3, 0.035, 8, 24, Math.PI]} />
          <Gold />
        </mesh>
        {[-0.6, 0.5].map((x) => (
          <mesh key={x} position={[x, 0.27, 0]}>
            <boxGeometry args={[0.06, 0.35, 0.06]} />
            <Gold />
          </mesh>
        ))}
      </group>
    ))}
    {/* sack + gifts */}
    {sack > 0 && (
      <group position={[-0.45, 1.15, 0]} scale={sack}>
        <mesh scale={[0.6, 0.65, 0.55]}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial color="#7a4b2a" roughness={1} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.12, 0.2, 0.2, 16]} />
          <meshStandardMaterial color="#6a3f22" roughness={1} />
        </mesh>
        <Gift position={[0.15, 0.7, 0.1]} size={0.3} color={giftColors[1]} rotation={[0.2, 0.4, 0.1]} />
        <Gift position={[-0.2, 0.65, -0.15]} size={0.26} color={giftColors[2]} rotation={[-0.1, 0.8, 0]} />
      </group>
    )}
    {children}
  </group>
);

export const PineTree: React.FC<{ position: V3; scale?: number; snow?: boolean; lights?: number; seed?: string }> = ({
  position,
  scale = 1,
  snow = true,
  lights = 0,
  seed = "t",
}) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.12, 0.16, 0.6, 8]} />
      <meshStandardMaterial color="#5a3a22" />
    </mesh>
    {[0, 1, 2].map((i) => (
      <group key={i} position={[0, 0.9 + i * 0.65, 0]}>
        <mesh>
          <coneGeometry args={[1.0 - i * 0.25, 1.1, 10]} />
          <meshStandardMaterial color="#1f5a3a" roughness={0.9} />
        </mesh>
        {snow && (
          <mesh position={[0, 0.12, 0]} scale={[1, 0.55, 1]}>
            <coneGeometry args={[0.86 - i * 0.22, 0.9, 10]} />
            <meshStandardMaterial color="#eef4ff" roughness={1} />
          </mesh>
        )}
      </group>
    ))}
    {lights > 0 &&
      Array.from({ length: 18 }, (_, i) => {
        const h = random(`${seed}h${i}`);
        const a = random(`${seed}a${i}`) * Math.PI * 2;
        const r = (1 - h) * 0.95 + 0.08;
        const y = 0.6 + h * 1.9;
        const on = lights * 18 > i;
        const col = ["#ff4d4d", "#ffd84d", "#4dd2ff", "#7dff6a", "#ff7ad9"][i % 5];
        return on ? (
          <group key={i} position={[Math.cos(a) * r, y, Math.sin(a) * r]}>
            <mesh>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color={col} />
            </mesh>
            <Glow scale={0.45} color={col} opacity={0.9} />
          </group>
        ) : null;
      })}
    {lights > 0.95 && (
      <group position={[0, 2.85, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshBasicMaterial color="#ffe27a" />
        </mesh>
        <Glow scale={1.4} color="#ffe27a" />
      </group>
    )}
  </group>
);

export const House: React.FC<{
  position: V3;
  rotation?: V3;
  scale?: number;
  color?: string;
  windows?: number;
  chimneyGlow?: number;
}> = ({ position, rotation = [0, 0, 0], scale = 1, color = "#a0624a", windows = 1, chimneyGlow = 0 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh position={[0, 0.7, 0]}>
      <boxGeometry args={[1.6, 1.4, 1.4]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
    <mesh position={[0, 1.75, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1, 1, 1]}>
      <coneGeometry args={[1.35, 0.9, 4]} />
      <meshStandardMaterial color="#f2f6ff" roughness={1} />
    </mesh>
    <mesh position={[0.45, 1.9, 0.2]}>
      <boxGeometry args={[0.25, 0.6, 0.25]} />
      <meshStandardMaterial color="#7a4030" />
    </mesh>
    {chimneyGlow > 0 && <Glow position={[0.45, 2.3, 0.2]} scale={1.5 * chimneyGlow} color="#ffd36b" opacity={chimneyGlow} />}
    {windows > 0 &&
      [-0.4, 0.4].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.85, 0.71]}>
            <planeGeometry args={[0.36, 0.42]} />
            <meshBasicMaterial color="#ffcf6b" />
          </mesh>
          <Glow position={[x, 0.85, 0.75]} scale={1.0} color="#ffb84d" opacity={0.5 * windows} />
        </group>
      ))}
    <mesh position={[0, 0.35, 0.71]}>
      <planeGeometry args={[0.32, 0.6]} />
      <meshStandardMaterial color="#4a2a18" />
    </mesh>
  </group>
);

const houseColors = ["#a0624a", "#7f8fa6", "#b9854f", "#8c5a7a", "#6f8f6a"];

export const Village: React.FC<{ center?: V3; rows?: number; cols?: number; spacing?: number; seed?: string }> = ({
  center = [0, 0, 0],
  rows = 5,
  cols = 7,
  spacing = 3.4,
  seed = "v",
}) => {
  const items = useMemo(() => {
    const out: { kind: "house" | "tree"; p: V3; r: number; s: number; c: string }[] = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const k = `${seed}${i}-${j}`;
        const x = (j - (cols - 1) / 2) * spacing + (random(`${k}x`) - 0.5) * 1.4;
        const z = -i * spacing + (random(`${k}z`) - 0.5) * 1.4;
        const isTree = random(`${k}t`) < 0.3;
        out.push({
          kind: isTree ? "tree" : "house",
          p: [center[0] + x, center[1], center[2] + z],
          r: (random(`${k}r`) - 0.5) * 0.8,
          s: 0.8 + random(`${k}s`) * 0.5,
          c: houseColors[Math.floor(random(`${k}c`) * houseColors.length)],
        });
      }
    }
    return out;
  }, [center, rows, cols, spacing, seed]);
  return (
    <group>
      {items.map((it, i) =>
        it.kind === "house" ? (
          <House key={i} position={it.p} rotation={[0, it.r, 0]} scale={it.s} color={it.c} />
        ) : (
          <PineTree key={i} position={it.p} scale={it.s} seed={`vt${i}`} />
        ),
      )}
    </group>
  );
};

export const SnowGround: React.FC<{ y?: number; size?: number; color?: string }> = ({
  y = 0,
  size = 400,
  color = "#dfe8fb",
}) => (
  <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[size, size]} />
    <meshStandardMaterial color={color} roughness={1} />
  </mesh>
);

export const SnowHill: React.FC<{ position: V3; scale?: V3; color?: string }> = ({
  position,
  scale = [6, 2, 6],
  color = "#e6eeff",
}) => (
  <mesh position={position} scale={scale}>
    <sphereGeometry args={[1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
    <meshStandardMaterial color={color} roughness={1} />
  </mesh>
);

let letterTex: THREE.Texture | null = null;
const getLetterTexture = () => {
  if (letterTex) return letterTex;
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 180;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fffaf0";
  g.fillRect(0, 0, 256, 180);
  g.strokeStyle = "#c9d6f0";
  for (let y = 30; y < 180; y += 22) {
    g.beginPath();
    g.moveTo(14, y);
    g.lineTo(242, y);
    g.stroke();
  }
  g.fillStyle = "#3058c9";
  g.font = "bold 22px sans-serif";
  g.fillText("Querido Santa", 22, 26);
  g.font = "18px sans-serif";
  ["solo quiero que", "alguien venga", "a verme ♥"].forEach((t, i) => g.fillText(t, 22, 70 + i * 22));
  g.fillStyle = "#e0304a";
  g.fillText("♥", 210, 160);
  letterTex = new THREE.CanvasTexture(c);
  letterTex.colorSpace = THREE.SRGBColorSpace;
  return letterTex;
};

export const Letter: React.FC<{ position: V3; rotation?: V3; scale?: number; glow?: number }> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  glow = 0.5,
}) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh>
      <planeGeometry args={[0.7, 0.5]} />
      <meshBasicMaterial map={getLetterTexture()} side={THREE.DoubleSide} />
    </mesh>
    {glow > 0 && <Glow scale={1.6} color="#ffe9a8" opacity={glow} />}
  </group>
);

/** Cozy interior: floor, back wall with window, fireplace. Origin at floor center; back wall at z=-3. */
export const Room: React.FC<{
  warmth?: number;
  fire?: number;
  frame: number;
  windowGlow?: number;
  wall?: string;
  outside?: React.ReactNode;
}> = ({ warmth = 1, fire = 1, frame, windowGlow = 1, wall = "#6b4a5a", outside }) => {
  const flicker = 0.8 + 0.2 * Math.sin(frame * 0.6) * Math.sin(frame * 0.23 + 1);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#7a5034" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.01, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 48]} />
        <meshStandardMaterial color="#9b2d3a" roughness={1} />
      </mesh>
      {/* back wall with a window hole: x -2.7..-1.1, y 1.45..3.35 */}
      {[
        [-4.85, 3.5, 4.3, 7],
        [3.45, 3.5, 9.1, 7],
        [-1.9, 0.725, 1.6, 1.45],
        [-1.9, 5.175, 1.6, 3.65],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, -3]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial color={wall} roughness={1} />
        </mesh>
      ))}
      {/* outside backdrop */}
      <mesh position={[-1.9, 2.4, -7]}>
        <planeGeometry args={[8, 6]} />
        <meshBasicMaterial color="#14254f" />
      </mesh>
      <mesh position={[-1.9, 0.5, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#c9d6f2" />
      </mesh>
      {outside}
      <mesh position={[-5, 3.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 7]} />
        <meshStandardMaterial color={wall} roughness={1} />
      </mesh>
      {/* window on back wall (left) */}
      <group position={[-1.9, 2.4, -2.98]}>
        <mesh>
          <planeGeometry args={[1.6, 1.9]} />
          <meshBasicMaterial color="#9fc0ff" transparent opacity={0.12} depthWrite={false} />
        </mesh>
        <Glow position={[0.45, 0.55, -3.9]} scale={1.6} color="#dfe8ff" opacity={0.6 * windowGlow} />
        <mesh position={[0.45, 0.55, -3.95]}>
          <circleGeometry args={[0.22, 24]} />
          <meshBasicMaterial color="#f4f1e4" />
        </mesh>
        {[
          [0, 0.97, 1.8, 0.1],
          [0, -0.97, 1.8, 0.1],
          [0.82, 0, 0.1, 2.0],
          [-0.82, 0, 0.1, 2.0],
          [0, 0, 0.07, 1.9],
          [0, 0, 1.6, 0.07],
        ].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, 0.03]}>
            <boxGeometry args={[w, h, 0.08]} />
            <meshStandardMaterial color="#f1e6d6" />
          </mesh>
        ))}
      </group>
      {/* fireplace (right) */}
      <group position={[2.2, 0, -2.6]}>
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[2.2, 2.0, 0.8]} />
          <meshStandardMaterial color="#8a4a3a" roughness={1} />
        </mesh>
        <mesh position={[0, 2.05, 0.05]}>
          <boxGeometry args={[2.5, 0.15, 0.95]} />
          <meshStandardMaterial color="#5a3420" />
        </mesh>
        <mesh position={[0, 0.65, 0.41]}>
          <planeGeometry args={[1.2, 1.0]} />
          <meshStandardMaterial color="#120806" />
        </mesh>
        {fire > 0 && (
          <>
            <Glow position={[0, 0.45, 0.45]} scale={1.4 * flicker * fire} color="#ff8a2a" />
            <Glow position={[0, 0.35, 0.47]} scale={0.8 * flicker * fire} color="#ffd36b" />
            <pointLight position={[0, 0.8, 1.2]} intensity={6 * flicker * fire * warmth} distance={9} color="#ff9a4a" />
          </>
        )}
        {[-0.7, 0.7].map((x) => (
          <mesh key={x} position={[x, 1.7, 0.45]} rotation={[0, 0, x > 0 ? 0.15 : -0.15]}>
            <boxGeometry args={[0.28, 0.4, 0.05]} />
            <meshStandardMaterial color={x > 0 ? "#c0222c" : "#2f7a4a"} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
