import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { blinkAt, lerpF, mixV3, shake, V3 } from "../lib/anim";
import { CameraRig, Cloud, Glow, Moon, SparkleTrail, Snow, Stars } from "../three/fx";
import { Santa } from "../three/People";
import { Reindeer } from "../three/Reindeer";
import { NightLights, SKY_NIGHT, SKY_STORM, Stage } from "../three/Stage";
import { Team } from "../three/Team";
import { Sleigh, SnowGround, SnowHill, Village } from "../three/World";
import { Caption, Clock, Flash, Hook, Vignette } from "../ui/Overlay";

/* 1 — El reno llora: Santa se va sin él */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const t = lerpF(f, 0, 150, 0, 1);
  return (
    <Stage
      sky={SKY_NIGHT}
      fog={["#16294f", 14, 70]}
      overlay={
        <>
          <Vignette strength={0.6} />
          <Hook
            from={0}
            to={80}
            lines={[
              { text: "SANTA LO DEJÓ FUERA", color: "#ffffff", size: 100 },
              { text: "por ser pequeño… 😭🦌", color: "#ffe45c", size: 84 },
            ]}
          />
          <Hook from={80} to={150} lines={[{ text: "Espera a ver quién salva la Navidad 👀", color: "#ffffff", size: 82 }]} />
        </>
      }
    >
      <CameraRig pos={mixV3([0.35, 2.0, 5.2], [0.1, 1.95, 4.1], t)} target={[0, 2.05, 0]} fov={38} />
      <NightLights />
      <Stars />
      <Moon position={[9, 16, -70]} radius={5} />
      <SnowGround />
      <Village center={[0, 0, -16]} seed="s1" />
      <Team
        position={[-3 + t * 5, 5.5 + t * 2.5, -24 - t * 6]}
        rotation={[0, -0.5, 0]}
        scale={0.55}
        babyProps={{}}
        baby={false}
      />
      <Reindeer
        mood="sad"
        cry={1}
        headTilt={0.18 + Math.sin(f * 0.45) * 0.035}
        headRoll={0.08}
        blink={blinkAt(f, 60, 20)}
        lookY={-0.3}
      />
      <Snow count={500} area={[10, 8, 8]} center={[0, 3, -1]} speed={0.03} />
    </Stage>
  );
};

/* 2 — Vuelan hacia la tormenta */
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const t = lerpF(f, 0, 150, 0, 1, (x) => x);
  const bolt = [55, 62, 118].some((a) => f >= a && f < a + 6) ? 1 : 0;
  return (
    <Stage
      sky={["#080d1f", "#1b2442", "#3b4566"]}
      fog={["#262e48", 18, 60]}
      overlay={
        <>
          <Flash at={[55, 62, 118]} max={0.7} />
          <Vignette />
          <Caption text="Se dirigían directo a la tormenta ⚡" from={6} to={150} y={1160} />
        </>
      }
    >
      <CameraRig pos={[-2 + t * 4, 3.4, 10]} target={[-0.5 + t * 4, 3.4, -2]} fov={44} />
      <NightLights storm={0.5} />
      <Stars count={300} />
      <Team
        position={[-5 + t * 9, 2.6 + Math.sin(f * 0.08) * 0.25, -t * 4]}
        rotation={[0, -0.25, 0.04]}
        scale={0.95}
        baby={false}
        santa={{ armR: 0.6 }}
      />
      {[
        [9, 5, -12, 3.2],
        [4, 8, -16, 3.6],
        [12, 1.5, -8, 2.6],
        [1, 10, -22, 4],
        [14, 7, -20, 4],
      ].map(([x, y, z, s], i) => (
        <Cloud key={i} position={[x - t * 1.5, y, z]} scale={s} color="#3a4258" opacity={0.97} seed={`st${i}`} />
      ))}
      <pointLight position={[8, 9, -10]} intensity={bolt * 400} distance={60} color="#cfe0ff" />
      <Snow count={400} area={[30, 16, 14]} center={[2, 4, -4]} speed={0.06} wind={-0.04} stretch={2} />
    </Stage>
  );
};

/* 3 — Perdidos en la ventisca */
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const sh = shake(f, 0.05);
  return (
    <Stage
      sky={SKY_STORM}
      fog={["#3a4258", 9, 34]}
      overlay={
        <>
          <Clock fromTime={23 * 60 + 50} toTime={23 * 60 + 52} from={0} to={180} />
          <Flash at={[100]} max={0.6} />
          <Vignette strength={0.7} />
          <Caption text="Faltan 10 minutos para medianoche…" from={8} to={92} />
          <Caption text="¡Están PERDIDOS! 😰" from={92} to={180} color="#ff6b6b" />
        </>
      }
    >
      <CameraRig
        pos={[0.2 + sh[0], 2.5 + sh[1], 8.2]}
        target={[-0.2, 1.3, 0]}
        fov={42}
        roll={Math.sin(f * 0.07) * 0.06}
      />
      <NightLights storm={1} key2={0.8} />
      <Team
        rotation={[Math.sin(f * 0.05) * 0.1, 0.4 + Math.sin(f * 0.04) * 0.35, Math.sin(f * 0.12) * 0.1]}
        position={[-1.2, Math.sin(f * 0.1) * 0.2, 0]}
        scale={0.9}
        baby={false}
        santa={{ worried: true, headTurn: Math.sin(f * 0.07) * 0.7, mouthOpen: 0.3, armL: 1.4, blink: blinkAt(f, 50) }}
        gallop={0.6}
      />
      {[
        [-6, 4, -9, 2.6],
        [7, 5, -10, 3],
        [-3, -3, -8, 3],
        [8, -2, -7, 2.5],
      ].map(([x, y, z, s], i) => (
        <Cloud key={i} position={[x - f * 0.03, y, z]} scale={s} color="#59627a" opacity={0.75} seed={`b${i}`} />
      ))}
      <Snow count={600} area={[18, 10, 10]} center={[1, 2, 0]} speed={0.12} wind={-0.55} stretch={5} size={0.022} opacity={0.7} />
    </Stage>
  );
};

/* 4 — El pequeño toca la campana */
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const det = lerpF(f, 50, 70, 0, 1);
  const ring = lerpF(f, 85, 105, 0, 1);
  const t = lerpF(f, 0, 180, 0, 1);
  return (
    <Stage
      sky={SKY_STORM}
      fog={["#2e3550", 8, 40]}
      overlay={
        <>
          <Flash at={[86]} color="#ffd65c" max={0.6} length={10} />
          <Vignette strength={0.55} />
          <Caption text="Pero el más pequeño no se rindió…" from={4} to={84} />
          <Caption text="🔔 ¡DING! ¡DING! ¡DING!" from={88} to={180} color="#ffd65c" />
        </>
      }
    >
      <CameraRig pos={mixV3([1.2, 1.0, 5.6], [0.5, 0.9, 4.4], t)} target={[0, 1.75, 0]} fov={40} />
      <NightLights storm={0.6} />
      <SnowHill position={[0, -2, 0]} scale={[7, 2, 7]} />
      <Reindeer
        mood={det > 0.5 ? "determined" : "sad"}
        cry={1 - det}
        headTilt={lerpF(f, 50, 80, 0.2, -0.2)}
        lookY={lerpF(f, 50, 80, -0.3, 0.4)}
        blink={f > 55 && f < 60 ? 1 : blinkAt(f, 70)}
        bellSwing={Math.sin(f * 0.9) * 0.7 * ring}
        glow={ring}
        rings={ring}
      />
      <pointLight position={[0, 1.2, 1.5]} intensity={ring * 5} distance={6} color="#ffcf5a" />
      {ring > 0 && <Glow position={[0, 1.4, -2]} scale={5 * ring} color="#ffcf5a" opacity={0.3 * ring} />}
      <Cloud position={[-6, 6, -14]} scale={4} color="#4a5370" opacity={0.95} seed="h1" />
      <Cloud position={[7, 7, -16]} scale={4} color="#4a5370" opacity={0.95} seed="h2" />
      <Snow count={600} area={[12, 9, 6]} center={[0, 3, -3]} speed={0.1} wind={-0.25} stretch={3} size={0.03} />
    </Stage>
  );
};

/* 5 — Santa ve el camino dorado */
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const beam = lerpF(f, 15, 80, 0, 1);
  const amazed = lerpF(f, 25, 40, 0, 1);
  const happy = f > 115;
  const path = (t: number): V3 => [-7 + t * 15, -5 + t * 14, -6 - t * 10];
  return (
    <Stage
      sky={SKY_STORM}
      fog={["#3a4258", 6, 40]}
      overlay={
        <>
          <Vignette strength={0.5} />
          <Caption text="¡Su campana abrió un camino! ✨" from={30} to={180} color="#ffd65c" />
        </>
      }
    >
      <CameraRig pos={[0.3, 1.95 + Math.sin(f * 0.1) * 0.03, 3.3]} target={[0, 1.75, 0]} fov={40} />
      <NightLights storm={1 - beam * 0.6} />
      <Santa
        position={[0, 0.25, -0.3]}
        scale={0.82}
        mouthOpen={happy ? 0.7 : amazed}
        happyEyes={happy}
        headTilt={happy ? -0.05 : -0.12 * amazed}
        headTurn={-0.25 * amazed}
        armL={happy ? 2.2 : 0.4}
        armR={0.4 + amazed * 0.6}
        blink={blinkAt(f, 60)}
      />
      <Sleigh position={[0, -0.2, 0.2]} rotation={[0, -Math.PI / 2, 0]} scale={1.15} sack={0} />
      <pointLight position={[-1.5, 1.5, 2]} intensity={beam * 20} distance={8} color="#ffcf5a" />
      <SparkleTrail path={path} count={110} progress={beam} size={0.9} />
      {[
        [-4, 4, -8, 3],
        [5, 5, -9, 3],
        [-6, 0, -6, 2.5],
      ].map(([x, y, z, s], i) => (
        <Cloud
          key={i}
          position={[x + Math.sign(x) * beam * 4, y, z]}
          scale={s}
          color="#5a6380"
          opacity={0.85}
          seed={`c5${i}`}
        />
      ))}
      <Snow
        count={600}
        area={[14, 10, 8]}
        center={[0, 3, -2]}
        speed={0.1 - beam * 0.06}
        wind={-0.4 * (1 - beam)}
        stretch={1 + 3 * (1 - beam)}
      />
    </Stage>
  );
};

/* 6 — Final: guía el trineo por la luna */
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const x = lerpF(f, 0, 210, -7, 5, (v) => v);
  const y = 4.5 + Math.sin(f * 0.06) * 0.2;
  const sc = 0.68;
  return (
    <Stage
      sky={SKY_NIGHT}
      overlay={
        <>
          <Vignette strength={0.45} />
          <Hook
            from={95}
            to={210}
            top={250}
            lines={[
              { text: "¿QUÉ NOMBRE", size: 100 },
              { text: "LE PONDRÍAS? 👇", size: 100, color: "#ffe45c" },
            ]}
          />
          <Caption text="Sígueme para la PARTE 2 ❤️" from={120} to={210} y={1250} color="#ffffff" />
          <Caption text="Ahora él va DELANTE 🦌✨" from={6} to={92} />
        </>
      }
    >
      <CameraRig pos={[0, 4.2, 15]} target={[0, 5.2, -5]} fov={40} />
      <NightLights />
      <Stars />
      <Moon position={[0, 6.5, -45]} radius={12} />
      <SparkleTrail
        path={(t) => [x * 1 + 0.2 - t * 13, y + 0.3 - t * 1.8 + Math.sin(t * 9 + f * 0.1) * 0.25, -0.4]}
        count={120}
        size={0.55}
      />
      <Team
        position={[x, y, 0]}
        rotation={[0, -0.12, 0.05]}
        scale={sc}
        santa={{ happyEyes: true, armR: 2.0, mouthOpen: 0.5 }}
        babyProps={{ glow: 1, mood: "happy", blink: blinkAt(f, 80) }}
      />
      {[
        [-10, -4, -10, 4],
        [9, -5, -12, 4.5],
        [0, -6.5, -8, 4],
      ].map(([cx, cy, cz, s], i) => (
        <Cloud key={i} position={[cx, cy, cz]} scale={s} color="#7f93c8" opacity={0.9} seed={`m${i}`} />
      ))}
      <Snow count={250} area={[24, 14, 10]} center={[0, 5, -2]} speed={0.025} />
    </Stage>
  );
};

export const STORY1_DURATION = 1050;

export const Story1: React.FC = () => (
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
