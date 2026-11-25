import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { blinkAt, lerpF, mixV3, shake, V3 } from "../lib/anim";
import { BlobShadow, CameraRig, Cloud, Glow, Moon, Snow, Stars } from "../three/fx";
import { Santa } from "../three/People";
import { Reindeer } from "../three/Reindeer";
import { NightLights, SKY_NIGHT, SKY_SUNRISE, Stage, WarmLights } from "../three/Stage";
import { Team } from "../three/Team";
import { Gift, PineTree, Room, Sleigh, SnowGround, SnowHill, Village } from "../three/World";
import { Caption, Clock, Counter, Flash, Hook, Vignette } from "../ui/Overlay";

const GUST = 32;

/* 1 — Una ráfaga tira a Santa del trineo */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const tx = f * 0.03;
  const sh = f > GUST && f < GUST + 25 ? shake(f, 0.12) : ([0, 0, 0] as V3);
  const fallen = f >= GUST;
  const tt = Math.max(0, (f - GUST) / 30);
  const santaPos: V3 = [tx - 0.3 - tt * 1.0, 4.45 + tt * 2.6 - tt * tt * 4.2, 0.6 + tt * 1.2];
  const tilt = f > GUST && f < GUST + 30 ? Math.sin((f - GUST) * 0.4) * 0.25 : 0;
  return (
    <Stage
      sky={SKY_NIGHT}
      overlay={
        <>
          <Flash at={[GUST]} max={0.5} />
          <Vignette />
          <Hook from={0} to={75} lines={[{ text: "¡SANTA SE CAYÓ! 😱", size: 110 }]} />
          <Hook from={75} to={150} lines={[{ text: "Y solo queda ÉL…", size: 100, color: "#ffe45c" }]} />
        </>
      }
    >
      <CameraRig pos={[tx + 1.4 + sh[0], 5.2 + sh[1], 11.5]} target={[tx + 1.4, 4.9, 0]} fov={42} />
      <NightLights />
      <Stars />
      <Moon position={[-14, 14, -60]} radius={5} />
      <Village center={[tx * 0.6, -14, -10]} seed="v2" rows={4} cols={9} />
      <Team
        position={[tx, 4 + Math.sin(f * 0.1) * 0.12, 0]}
        rotation={[0, 0, tilt]}
        adults={false}
        baby="only"
        santa={fallen ? false : { armR: 0.8, happyEyes: f < GUST - 5, mouthOpen: 0.4 }}
        babyProps={{
          mood: fallen ? "scared" : "happy",
          mouthOpen: fallen ? 1 : 0,
          headTurn: fallen ? lerpF(f, GUST, GUST + 10, 0, -1.3) : 0,
          blink: blinkAt(f, 60),
        }}
      />
      {fallen && (
        <Santa
          position={santaPos}
          rotation={[0, 0.6, tt * 4]}
          scale={0.58}
          mouthOpen={1}
          armL={2.2}
          armR={2.2}
          worried
        />
      )}
      <Cloud position={[tx - 4 - f * 0.04, 1.5, -4]} scale={2.2} seed="a1" color="#8a9cc8" />
      <Cloud position={[tx + 9 - f * 0.05, 2, -6]} scale={2.6} seed="a2" color="#8a9cc8" />
      <Snow count={350} area={[20, 12, 10]} center={[tx, 5, -1]} speed={0.04} wind={-0.08} />
    </Stage>
  );
};

/* 2 — Santa en el árbol; el pequeño, solo arriba */
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const up = lerpF(f, 70, 115, 0, 1);
  return (
    <Stage
      sky={SKY_NIGHT}
      fog={["#16294f", 16, 70]}
      overlay={
        <>
          <Vignette />
          <Caption text="Santa está bien… 😅" from={5} to={72} />
          <Caption text="Pero ahora TODO depende de él 🦌" from={80} to={150} y={1220} />
        </>
      }
    >
      <CameraRig pos={mixV3([0, 2.8, 7], [0, 4.2, 7.5], up)} target={mixV3([0, 2.7, 0], [0.8, 9.2, -6], up)} fov={42} />
      <NightLights />
      <Stars />
      <SnowGround />
      <Village center={[0, 0, -12]} seed="v2b" rows={3} />
      <PineTree position={[0, 0, 0]} scale={1.7} />
      <Santa
        position={[0.1, 2.5, 0.75]}
        rotation={[0.15, 0, -0.2]}
        scale={0.6}
        happyEyes
        mouthOpen={0.6 + Math.sin(f * 0.5) * 0.3}
        armR={1.8 + Math.sin(f * 0.35) * 0.5}
      />
      <Team
        position={[-0.5, 9 + Math.sin(f * 0.1) * 0.15, -7]}
        rotation={[0, -0.4, 0]}
        scale={0.6}
        adults={false}
        baby="only"
        santa={false}
        babyProps={{ mood: "scared", headTilt: 0.45, headTurn: -0.6, lookY: -0.5, blink: blinkAt(f, 50) }}
      />
      <Snow count={450} area={[14, 14, 10]} center={[0, 5, -1]} speed={0.035} />
    </Stage>
  );
};

/* 3 — El saco lleno y el reloj */
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const gulp = f > 70 && f < 95 ? Math.sin(((f - 70) / 25) * Math.PI) : 0;
  const t = lerpF(f, 0, 180, 0, 1);
  const gifts: [V3, string][] = [
    [[-0.9, 1.15, 0.35], "#c62f3a"],
    [[-0.1, 1.15, 0.4], "#3a6fd1"],
    [[0.2, 1.4, -0.2], "#8e44ad"],
    [[-0.55, 2.4, 0.1], "#f39c12"],
    [[-1.1, 2.0, -0.3], "#2f8f4e"],
  ];
  return (
    <Stage
      sky={SKY_NIGHT}
      overlay={
        <>
          <Clock fromTime={23 * 60 + 55} toTime={23 * 60 + 57} from={0} to={180} />
          <Vignette />
          <Caption text="Quedan 5 minutos…" from={5} to={85} />
          <Caption text="…y TODOS los regalos 😰🎁" from={90} to={180} color="#ff8a8a" />
        </>
      }
    >
      <CameraRig pos={mixV3([1.0, 2.3, 5.8], [0.7, 2.1, 4.9], t)} target={[0.2, 1.55, 0]} fov={42} />
      <NightLights />
      <Stars />
      {[0, 1, 2].map((i) => (
        <Cloud
          key={i}
          position={[((8 - f * 0.12 + i * 9) % 27) - 12, -1.5 + i, -6 - i * 2]}
          scale={2.2}
          seed={`s3${i}`}
          color="#8a9cc8"
        />
      ))}
      <Sleigh position={[-0.6, 0, -0.4]} sack={1.5} />
      {gifts.map(([p, c], i) => (
        <Gift key={i} position={p} color={c} size={0.38} rotation={[0.1 * i, 0.5 * i, 0.05]} />
      ))}
      <Reindeer
        position={[1.15, 0.3, 0.7]}
        rotation={[0, -0.5, 0]}
        scale={0.8}
        mood={f > 60 ? "scared" : "surprised"}
        headTurn={-0.55}
        headTilt={-0.1 + gulp * 0.25}
        mouthOpen={f > 40 && f < 70 ? 0.6 : 0}
        blink={blinkAt(f, 55)}
        lookY={0.2}
      />
      <Snow count={300} area={[14, 10, 8]} center={[0, 3, -3]} speed={0.03} wind={-0.12} stretch={2} />
    </Stage>
  );
};

/* 4 — Sale por la chimenea lleno de hollín */
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const pop = lerpF(f, 38, 52, 0, 1);
  const z = -2.7 + pop * 1.6 + Math.sin(Math.min(1, Math.max(0, (f - 52) / 12)) * Math.PI) * 0.12;
  const puff = lerpF(f, 38, 90, 0, 1);
  return (
    <Stage
      sky={["#000000", "#000000"]}
      overlay={
        <>
          <Vignette strength={0.5} />
          <Caption text="Primera parada… 😂" from={52} to={115} />
          <Caption text="¡Misión cumplida! 🎁" from={115} to={180} color="#7dff8a" />
        </>
      }
    >
      <CameraRig pos={[0.6, 1.5, 4.6]} target={[1.6, 0.9, -1.6]} fov={42} />
      <WarmLights level={0.8} />
      <Room frame={f} fire={0} warmth={0.7} />
      <PineTree position={[-2.4, 0, -1.6]} scale={0.85} lights={1} snow={false} seed="room" />
      <Gift position={[-1.6, 0.2, -0.8]} color="#c62f3a" />
      <Gift position={[-2.8, 0.18, -0.6]} color="#3a6fd1" size={0.35} />
      {f > 36 && (
        <group position={[2.2, 0, z]}>
          <Reindeer
            scale={0.6}
            soot={0.8}
            mood={f < 75 ? "surprised" : "happy"}
            blink={f > 60 && f < 66 ? 1 : blinkAt(f, 60)}
            headTilt={-0.1}
          />
          <Gift position={[0, 0.82, 0.55]} size={0.24} color="#2f8f4e" />
          <BlobShadow position={[0, 0.02, -0.2]} scale={0.6} />
        </group>
      )}
      {puff > 0 && puff < 1 && (
        <Cloud
          position={[2.2, 0.6 + puff * 0.8, -1.8 + puff * 0.6]}
          scale={0.3 + puff * 0.9}
          color="#3a3533"
          opacity={0.9 * (1 - puff)}
          seed="soot"
        />
      )}
    </Stage>
  );
};

/* 5 — Reparto a toda velocidad */
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const tx = -8 + f * 0.11;
  return (
    <Stage
      sky={SKY_NIGHT}
      fog={["#16294f", 14, 50]}
      overlay={
        <>
          <Counter label="🎁" fromN={1} toN={1000} from={0} to={180} />
          <Vignette />
          <Caption text="¡A TODA velocidad! 🚀" from={5} to={180} />
        </>
      }
    >
      <CameraRig pos={[tx - 1.5, 7.2, 8.5]} target={[tx + 1.8, 3.6, -1]} fov={46} />
      <NightLights />
      <Stars />
      <Moon position={[10, 16, -60]} radius={5} />
      <SnowGround />
      <Village center={[4, 0, 2]} seed="v5" rows={3} cols={9} />
      <Team
        position={[tx, 5 + Math.sin(f * 0.15) * 0.2, 0]}
        rotation={[0, 0, 0.06]}
        scale={0.75}
        adults={false}
        baby="only"
        santa={false}
        sack={1}
        babyProps={{ mood: "happy", glow: 0.6, mouthOpen: 0.4 }}
      />
      {Array.from({ length: 9 }, (_, i) => {
        const t0 = i * 18;
        const dt = f - t0;
        if (dt < 0 || dt > 30) return null;
        const x0 = -8 + t0 * 0.11 - 0.4;
        const y = 5.6 - 0.006 * dt * dt * 1.0 - dt * 0.05;
        return (
          <group key={i}>
            <Gift position={[x0, y, 0.2]} size={0.3} color={["#c62f3a", "#3a6fd1", "#8e44ad"][i % 3]} rotation={[dt * 0.2, dt * 0.1, 0]} />
            <Glow position={[x0, y, 0.25]} scale={0.9} color="#ffd65c" opacity={0.7} />
          </group>
        );
      })}
      <Snow count={400} area={[24, 12, 12]} center={[tx + 2, 5, -1]} speed={0.03} wind={-0.25} stretch={4} />
    </Stage>
  );
};

/* 6 — Amanecer: Santa abraza al pequeño */
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const t = lerpF(f, 0, 210, 0, 1);
  return (
    <Stage
      sky={SKY_SUNRISE}
      overlay={
        <>
          <Vignette strength={0.35} />
          <Caption text="«Esta noche el héroe eres TÚ» ❤️" from={5} to={85} color="#ffffff" />
          <Hook
            from={90}
            to={210}
            top={230}
            lines={[
              { text: "¿LE DARÍAS EL PUESTO", size: 84 },
              { text: "DE RUDOLPH? 🦌👇", size: 96, color: "#ffe45c" },
            ]}
          />
          <Caption text="Comenta SÍ o NO 👇" from={120} to={210} y={1250} color="#ffffff" />
        </>
      }
    >
      <CameraRig pos={mixV3([0.2, 1.8, 6.8], [0.1, 1.6, 5.6], t)} target={[-0.1, 1.25, 0]} fov={40} />
      <hemisphereLight args={["#ffd6b0", "#4a3a6a", 1.1]} />
      <directionalLight position={[6, 3, 2]} intensity={2.4} color="#ffb070" />
      <directionalLight position={[-4, 5, 5]} intensity={1.0} color="#c8d4ff" />
      <Glow position={[7, 1.5, -30]} scale={40} color="#ffcf8a" opacity={0.6} />
      <SnowHill position={[0, -1.5, 0]} scale={[8, 1.5, 6]} color="#f3e8ef" />
      <SnowHill position={[-12, -2, -20]} scale={[14, 5, 8]} color="#d9c6dc" />
      <SnowHill position={[12, -2, -24]} scale={[14, 6, 8]} color="#d2bfd8" />
      <Santa position={[-0.7, 0, -0.2]} rotation={[0, 0.5, 0]} scale={0.85} happyEyes armL={1.6} armR={0.8} mouthOpen={0.4} />
      <Reindeer
        position={[0.55, 0, 0.45]}
        rotation={[0, -0.35, 0]}
        scale={0.75}
        mood="happy"
        headRoll={-0.18 + Math.sin(f * 0.08) * 0.03}
        blink={blinkAt(f, 70)}
        glow={0.4}
      />
      <mesh position={[1.7, 0.08, 1.1]} scale={[0.55, 0.08, 0.4]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#7a4b2a" roughness={1} />
      </mesh>
      <BlobShadow position={[0, 0.02, 0.2]} scale={1.6} opacity={0.25} />
      <Snow count={150} area={[12, 8, 8]} center={[0, 3, -2]} speed={0.015} />
    </Stage>
  );
};

export const STORY2_DURATION = 1050;

export const Story2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence durationInFrames={150}>
      <S1 />
    </Sequence>
    <Sequence from={150} durationInFrames={150}>
      <S2 />
    </Sequence>
    <Sequence from={300} durationInFrames={180}>
      <S3 />
    </Sequence>
    <Sequence from={480} durationInFrames={180}>
      <S4 />
    </Sequence>
    <Sequence from={660} durationInFrames={180}>
      <S5 />
    </Sequence>
    <Sequence from={840} durationInFrames={210}>
      <S6 />
    </Sequence>
  </AbsoluteFill>
);
