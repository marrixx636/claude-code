import { useThree } from "@react-three/fiber";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import { random, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { V3 } from "../lib/anim";

let glowTex: THREE.Texture | null = null;
export const getGlowTexture = () => {
  if (glowTex) return glowTex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.2, "rgba(255,255,255,0.65)");
  gr.addColorStop(0.5, "rgba(255,255,255,0.15)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  glowTex = new THREE.CanvasTexture(c);
  return glowTex;
};

const gradCache = new Map<string, THREE.Texture>();
const gradientTexture = (stops: string[]) => {
  const key = stops.join("|");
  const hit = gradCache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 256;
  const g = c.getContext("2d")!;
  const gr = g.createLinearGradient(0, 0, 0, 256);
  stops.forEach((s, i) => gr.addColorStop(i / (stops.length - 1), s));
  g.fillStyle = gr;
  g.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  gradCache.set(key, t);
  return t;
};

/** Screen-space vertical gradient background. Stops go top → bottom. */
export const SkyGradient: React.FC<{ stops: string[] }> = ({ stops }) => {
  const tex = useMemo(() => gradientTexture(stops), [stops]);
  return <primitive attach="background" object={tex} />;
};

/** Sets camera each frame. */
export const CameraRig: React.FC<{ pos: V3; target: V3; fov?: number; roll?: number }> = ({
  pos,
  target,
  fov = 40,
  roll = 0,
}) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pos);
    cam.fov = fov;
    cam.near = 0.05;
    cam.far = 400;
    cam.up.set(Math.sin(roll), Math.cos(roll), 0);
    cam.lookAt(...target);
    cam.updateProjectionMatrix();
  });
  return null;
};

export const Glow: React.FC<{
  position?: V3;
  scale?: number;
  color?: string;
  opacity?: number;
}> = ({ position = [0, 0, 0], scale = 1, color = "#ffd27a", opacity = 1 }) => (
  <sprite position={position} scale={[scale, scale, scale]}>
    <spriteMaterial
      map={getGlowTexture()}
      color={color}
      transparent
      opacity={opacity}
      depthWrite={false}
      blending={THREE.AdditiveBlending}
    />
  </sprite>
);

export const Stars: React.FC<{ count?: number; radius?: number; seed?: string }> = ({
  count = 600,
  radius = 120,
  seed = "stars",
}) => {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = random(`${seed}u${i}`) * Math.PI * 2;
      const v = random(`${seed}v${i}`) * 0.9 + 0.05;
      const phi = Math.acos(1 - v);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(u);
      arr[i * 3 + 1] = radius * Math.cos(phi) * 0.9 + 5;
      arr[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(u);
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [count, radius, seed]);
  return (
    <points geometry={geo}>
      <pointsMaterial
        size={1.1}
        map={getGlowTexture()}
        color="#fff8e0"
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

export const Moon: React.FC<{ position: V3; radius?: number; glow?: number }> = ({
  position,
  radius = 6,
  glow = 1,
}) => {
  const craters = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        a: random(`ca${i}`) * Math.PI * 2,
        r: random(`cr${i}`) * 0.7,
        s: 0.08 + random(`cs${i}`) * 0.16,
      })),
    [],
  );
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial color="#f4f1e4" />
      </mesh>
      {craters.map((c, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(c.a) * c.r * radius,
            Math.sin(c.a) * c.r * radius,
            radius * Math.sqrt(Math.max(0.05, 1 - c.r * c.r)) * 0.98,
          ]}
        >
          <circleGeometry args={[c.s * radius, 24]} />
          <meshBasicMaterial color="#d6d1c0" transparent opacity={0.7} />
        </mesh>
      ))}
      <Glow scale={radius * 3.2} color="#bcd3ff" opacity={0.55 * glow} />
      <Glow scale={radius * 6} color="#6f8fd6" opacity={0.3 * glow} />
    </group>
  );
};

/** Frame-driven falling snow. */
export const Snow: React.FC<{
  count?: number;
  area?: V3;
  center?: V3;
  speed?: number;
  wind?: number;
  size?: number;
  stretch?: number;
  seed?: string;
  opacity?: number;
}> = ({
  count = 400,
  area = [20, 14, 12],
  center = [0, 3, 0],
  speed = 0.04,
  wind = 0,
  size = 0.035,
  stretch = 1,
  seed = "snow",
  opacity = 0.9,
}) => {
  const frame = useCurrentFrame();
  const ref = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: random(`${seed}x${i}`),
        y: random(`${seed}y${i}`),
        z: random(`${seed}z${i}`),
        s: 0.5 + random(`${seed}s${i}`),
        p: random(`${seed}p${i}`) * 6.28,
      })),
    [count, seed],
  );
  const m = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(
    () => new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, wind !== 0 ? -Math.atan2(speed, Math.abs(wind)) * Math.sign(wind) : 0)),
    [wind, speed],
  );
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    data.forEach((d, i) => {
      const yy = (((d.y - (frame * speed * d.s) / area[1]) % 1) + 1) % 1;
      const xx = (((d.x + (frame * wind * d.s) / area[0] + 0.01 * Math.sin(frame * 0.05 + d.p)) % 1) + 1) % 1;
      m.compose(
        new THREE.Vector3(
          center[0] + (xx - 0.5) * area[0],
          center[1] + (yy - 0.5) * area[1],
          center[2] + (d.z - 0.5) * area[2],
        ),
        q,
        new THREE.Vector3(size * d.s * stretch, size * d.s, size * d.s),
      );
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
    </instancedMesh>
  );
};

export const Cloud: React.FC<{
  position: V3;
  scale?: number;
  color?: string;
  opacity?: number;
  seed?: string;
  puffs?: number;
}> = ({ position, scale = 1, color = "#c9d4ea", opacity = 0.85, seed = "c", puffs = 9 }) => {
  const p = useMemo(
    () =>
      Array.from({ length: puffs }, (_, i) => ({
        x: (random(`${seed}x${i}`) - 0.5) * 4,
        y: (random(`${seed}y${i}`) - 0.3) * 1.0,
        z: (random(`${seed}z${i}`) - 0.5) * 1.5,
        r: 0.7 + random(`${seed}r${i}`) * 0.9,
      })),
    [seed, puffs],
  );
  return (
    <group position={position} scale={scale}>
      {p.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]} scale={[c.r, c.r * 0.75, c.r]}>
          <sphereGeometry args={[1, 20, 16]} />
          <meshStandardMaterial color={color} roughness={1} transparent opacity={opacity} depthWrite={opacity > 0.95} />
        </mesh>
      ))}
    </group>
  );
};

/** Expanding golden rings (bell sound). */
export const SoundRings: React.FC<{ position: V3; strength: number; color?: string }> = ({
  position,
  strength,
  color = "#ffd65c",
}) => {
  const frame = useCurrentFrame();
  if (strength <= 0) return null;
  return (
    <group position={position}>
      {[0, 1, 2].map((k) => {
        const ph = (frame * 0.035 + k / 3) % 1;
        return (
          <mesh key={k} scale={0.3 + ph * 4} rotation={[0, 0, 0]}>
            <torusGeometry args={[1, 0.03, 8, 64]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={(1 - ph) * strength}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};

/** Golden sparkle trail following a path function t∈[0,1] → point. */
export const SparkleTrail: React.FC<{
  path: (t: number) => V3;
  count?: number;
  progress?: number;
  size?: number;
  seed?: string;
  color?: string;
}> = ({ path, count = 90, progress = 1, size = 0.5, seed = "trail", color = "#ffcf5a" }) => {
  const frame = useCurrentFrame();
  const n = Math.floor(count * progress);
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const t = i / count;
        const p = path(t);
        const jx = (random(`${seed}x${i}`) - 0.5) * 0.6;
        const jy = (random(`${seed}y${i}`) - 0.5) * 0.6;
        const tw = 0.55 + 0.45 * Math.sin(frame * 0.4 + i * 1.3);
        const s = size * (0.4 + random(`${seed}s${i}`) * 0.9) * tw;
        return <Glow key={i} position={[p[0] + jx, p[1] + jy, p[2]]} scale={s} color={color} opacity={0.9} />;
      })}
    </group>
  );
};

/** Simple cylinder rope between two points. */
export const Rope: React.FC<{ a: V3; b: V3; color?: string; r?: number }> = ({ a, b, color = "#5a3a1e", r = 0.025 }) => {
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const mid = va.clone().add(vb).multiplyScalar(0.5);
  const dir = vb.clone().sub(va);
  const len = dir.length();
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[r, r, len, 6]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
};

/** Soft blob shadow on the ground. */
export const BlobShadow: React.FC<{ position: V3; scale?: number; opacity?: number }> = ({
  position,
  scale = 1,
  opacity = 0.35,
}) => (
  <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
    <circleGeometry args={[1, 32]} />
    <meshBasicMaterial map={getGlowTexture()} color="#000000" transparent opacity={opacity} depthWrite={false} />
  </mesh>
);
