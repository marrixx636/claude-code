import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { blinkAt, lerpF, mixV3, V3 } from "../lib/anim";
import { BlobShadow, CameraRig, Cloud, Glow, Moon, SparkleTrail, Snow, Stars } from "../three/fx";
import { Girl, Santa } from "../three/People";
import { Reindeer } from "../three/Reindeer";
import { NightLights, SKY_NIGHT, Stage, WarmLights } from "../three/Stage";
import { Team } from "../three/Team";
import { Gift, House, Letter, PineTree, Room, SnowGround, Village } from "../three/World";
import { Caption, Flash, FadeIn, Hook, LetterCard, Vignette } from "../ui/Overlay";

/* 1 — Una carta cae del saco */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const lt = lerpF(f, 10, 140, 0, 1, (x) => x);
  const letterPos: V3 = [-2.2 + lt * 3.6 + Math.sin(f * 0.12) * 0.4, 3.2 - lt * 6.5, 0.9 + lt * 0.6];
  return (
    <Stage
      sky={SKY_NIGHT}
      overlay={
        <>
          <Vignette strength={0.6} />
          <Hook
            from={0}
            to={80}
            lines={[
              { text: "ESTA CARTA SE CAYÓ", size: 96 },
              { text: "DEL SACO… 💌", size: 96, color: "#ffe45c" },
            ]}
          />
          <Hook from={80} to={150} lines={[{ text: "…y es de una niña SOLA 💔", size: 88 }]} />
        </>
      }
    >
      <CameraRig pos={[2.4, 1.9, 4.2]} target={[0.1, 1.2, 0]} fov={42} />
      <NightLights />
      <Stars />
      <Moon position={[-20, 12, -60]} radius={5} />
      {[0, 1, 2, 3].map((i) => (
        <Cloud
          key={i}
          position={[((14 - f * 0.18 + i * 8) % 32) - 14, -2.5 + (i % 2) * 1.2, -5 - i * 2]}
          scale={2.4}
          color="#8a9cc8"
          seed={`l${i}`}
        />
      ))}
      <Team
        position={[-5.4, Math.sin(f * 0.1) * 0.08, 0]}
        babyProps={{
          mood: "sad",
          cry: lerpF(f, 50, 80, 0, 0.8),
          headTilt: lerpF(f, 10, 120, -0.1, 0.45),
          headTurn: lerpF(f, 10, 120, -0.6, 0.5),
          lookY: lerpF(f, 10, 120, 0.3, -0.6),
          blink: blinkAt(f, 70),
        }}
      />
      <Letter position={letterPos} rotation={[Math.sin(f * 0.15) * 0.6, f * 0.05, Math.sin(f * 0.1) * 0.4]} scale={0.8} />
      <Snow count={300} area={[14, 10, 8]} center={[0, 2, -2]} speed={0.03} wind={-0.15} stretch={2} />
    </Stage>
  );
};

/* 2 — Se lanza en picada tras la carta */
const S2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage
      sky={["#0e1f4d", "#1f3a70", "#3b5a95"]}
      overlay={
        <>
          <Vignette strength={0.6} />
          <Caption text="¡Saltó sin pensarlo! 😱" from={4} to={150} y={1220} />
        </>
      }
    >
      <CameraRig pos={[2.2, 0.8, 4.6]} target={[0, -0.3, 0]} fov={44} roll={Math.sin(f * 0.08) * 0.05} />
      <NightLights />
      <Stars />
      <group position={[0, 1.6, 0]} rotation={[0, Math.PI, 0]}>
        <group rotation={[Math.PI * 0.8, 0, 0]}>
          <Reindeer mood="determined" legPhase={Math.PI / 2} legAmp={0.6} blink={blinkAt(f, 60)} lookY={0.6} />
        </group>
      </group>
      <Letter position={[0.2, -2.6 + Math.sin(f * 0.1) * 0.2, 0.4]} rotation={[Math.sin(f * 0.2), f * 0.08, 0]} scale={0.9} glow={0.8} />
      {Array.from({ length: 6 }, (_, i) => (
        <Cloud
          key={i}
          position={[(i % 2 ? 3.5 : -3.5) + (i % 3) * 0.8, ((-14 + f * 0.35 + i * 5) % 30) - 12, -3 - (i % 3) * 2]}
          scale={1.8}
          color="#b9c7e6"
          opacity={0.9}
          seed={`d${i}`}
        />
      ))}
      <Snow count={500} area={[12, 14, 8]} center={[0, 0, -2]} speed={-0.5} size={0.03} />
    </Stage>
  );
};

/* 3 — Lee la carta en el tejado */
const S3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage
      sky={SKY_NIGHT}
      overlay={
        <>
          <Vignette />
          <Caption text="La carta decía…" from={5} to={45} />
          <LetterCard
            from={45}
            to={180}
            lines={["Querido Santa:", "este año no quiero", "juguetes…", "solo quiero que", "alguien venga a verme ❤️"]}
            signature="— Lucía, 7 años"
          />
        </>
      }
    >
      <CameraRig pos={[0.7, 2.0, 3.6]} target={[0, 1.4, 0]} fov={40} />
      <NightLights />
      <Stars />
      <Moon position={[3, 9, -40]} radius={7} />
      <SnowGround y={0} size={8} color="#e4ecff" />
      <mesh position={[-1.5, 0.6, -1]}>
        <boxGeometry args={[0.6, 1.2, 0.6]} />
        <meshStandardMaterial color="#7a4030" />
      </mesh>
      <Village center={[0, -9, -14]} seed="v3" rows={4} cols={8} />
      <Reindeer
        mood="sad"
        cry={lerpF(f, 100, 140, 0, 1)}
        headTilt={0.35}
        lookY={-0.6}
        blink={blinkAt(f, 65)}
      />
      <Letter position={[0, 1.05, 0.95]} rotation={[-0.9, 0, 0]} scale={0.8} glow={0.3} />
      <Snow count={250} area={[10, 8, 6]} center={[0, 3, -2]} speed={0.02} />
    </Stage>
  );
};

/* 4 — La niña está sola; él mira por la ventana */
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const t = lerpF(f, 0, 180, 0, 1);
  return (
    <Stage
      sky={["#000000", "#000000"]}
      overlay={
        <>
          <FadeIn frames={12} />
          <Vignette strength={0.7} />
          <Caption text="Lucía estaba completamente sola… 💔" from={8} to={110} />
          <Caption text="Y él la vio por la ventana 🥺" from={110} to={180} />
        </>
      }
    >
      <CameraRig pos={mixV3([0.6, 1.7, 5.4], [0.2, 1.7, 4.6], t)} target={[-0.9, 1.6, -1.5]} fov={42} />
      <hemisphereLight args={["#7f95d6", "#201828", 0.55]} />
      <directionalLight position={[-2, 3, -6]} intensity={1.4} color="#9fb8ff" />
      <pointLight position={[0.5, 2.2, 1.5]} intensity={2} distance={6} color="#ffc98a" />
      <Room
        frame={f}
        fire={0}
        warmth={0.2}
        wall="#4a3a4e"
        outside={
          <>
            <Reindeer
              position={[-1.9, 0.75, -3.65]}
              scale={0.85}
              mood="sad"
              cry={0.7}
              headTilt={0.1}
              blink={blinkAt(f, 60)}
            />
            <pointLight position={[-1.6, 2.8, -2.4]} intensity={4} distance={4} color="#bcd0ff" />
            <Snow count={120} area={[3, 3, 1.5]} center={[-1.9, 2.4, -4.5]} speed={0.02} />
          </>
        }
      />
      <PineTree position={[-0.6, 0, -1]} scale={0.38} snow={false} />
      <Girl position={[0.25, 0, -0.3]} rotation={[0, -0.35, 0]} sad headTilt={0.25} blink={blinkAt(f, 80)} />
    </Stage>
  );
};

/* 5 — Toca la campana y llegan todos */
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const ring = lerpF(f, 18, 32, 0, 1);
  const land = lerpF(f, 70, 165, 0, 1);
  const from: V3 = [-6, 12, -10];
  const to: V3 = [-3.6, 0.05, -1.5];
  const teamPos = mixV3(from, to, land);
  const tUp = lerpF(f, 55, 90, 0, 1) * (1 - lerpF(f, 105, 145, 0, 1));
  return (
    <Stage
      sky={SKY_NIGHT}
      fog={["#16294f", 18, 60]}
      overlay={
        <>
          <Flash at={[20]} color="#ffd65c" max={0.6} length={10} />
          <Vignette />
          <Caption text="Entonces hizo sonar su campana 🔔" from={5} to={85} />
          <Caption text="¡Y llegaron TODOS! ✨" from={90} to={180} color="#ffd65c" />
        </>
      }
    >
      <CameraRig pos={[0.5, 2.2 + tUp * 1.5, 8]} target={[-0.8 - tUp * 2, 2.2 + tUp * 3.5, 0]} fov={44} />
      <NightLights />
      <Stars />
      <SnowGround />
      <House position={[1.2, 0, -4]} scale={1.8} color="#8c5a7a" />
      <PineTree position={[4.5, 0, -3]} scale={1.2} />
      <PineTree position={[-6, 0, -6]} scale={1.4} />
      <Reindeer
        position={[0.9, 0, 1.6]}
        rotation={[0, -0.4, 0]}
        scale={0.8}
        mood={f > 120 ? "happy" : "determined"}
        bellSwing={Math.sin(f * 0.9) * 0.7 * ring * (1 - land)}
        glow={ring}
        rings={ring * (1 - land)}
        headTilt={-0.2}
        blink={blinkAt(f, 70)}
      />
      <BlobShadow position={[0.9, 0.02, 1.3]} scale={0.8} />
      <pointLight position={[0.9, 1.2, 2.6]} intensity={ring * 6} distance={6} color="#ffcf5a" />
      {land > 0 && (
        <SparkleTrail
          path={(tt) => mixV3(from, teamPos, tt).map((v, i) => (i === 1 ? v + 0.5 : v)) as V3}
          count={80}
          size={0.7}
        />
      )}
      <Team
        position={teamPos}
        rotation={[0, 0.35, -0.12 * (1 - land)]}
        scale={0.72}
        baby={false}
        gallop={1 - land * 0.8}
        santa={{ armR: 1.8, happyEyes: land > 0.9, mouthOpen: 0.5 }}
      />
      <Snow count={300} area={[16, 10, 10]} center={[0, 4, -1]} speed={0.03} />
    </Stage>
  );
};

/* 6 — Abrazo y el árbol se ilumina */
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const lights = lerpF(f, 20, 110, 0, 1);
  const t = lerpF(f, 0, 210, 0, 1);
  return (
    <Stage
      sky={["#000000", "#000000"]}
      overlay={
        <>
          <Flash at={[0]} color="#ffd65c" max={0.5} length={12} />
          <Vignette strength={0.4} />
          <Caption text="La mejor Navidad de su vida 🎄" from={5} to={85} color="#ffffff" />
          <Hook
            from={90}
            to={210}
            top={210}
            lines={[
              { text: "ETIQUETA A ALGUIEN", size: 88 },
              { text: "que no debería pasar", size: 70, color: "#ffffff" },
              { text: "la Navidad SOLO ❤️👇", size: 84, color: "#ffe45c" },
            ]}
          />
        </>
      }
    >
      <CameraRig pos={mixV3([0.6, 1.7, 5.6], [0.3, 1.6, 4.6], t)} target={[0, 1.15, 0]} fov={42} />
      <WarmLights level={0.4 + lights * 0.6} />
      <Room frame={f} fire={1} warmth={1} wall="#7a4a52" />
      <PineTree position={[-1.8, 0, -1.2]} scale={0.95} snow={false} lights={lights} seed="hug" />
      <Gift position={[-1.0, 0.2, -0.6]} color="#c62f3a" />
      <Gift position={[-2.4, 0.18, -0.4]} color="#3a6fd1" size={0.35} />
      <Girl position={[0.45, 0, 0.3]} rotation={[0, -0.55, 0]} happy hug={1} headTilt={0.05} />
      <Reindeer
        position={[-0.25, 0, 0.75]}
        rotation={[0, 0.55, 0]}
        scale={0.7}
        mood="happy"
        headRoll={-0.2}
        blink={blinkAt(f, 70)}
        glow={0.5}
      />
      <Santa position={[1.5, 0, -1.7]} rotation={[0, -0.5, 0]} scale={0.8} happyEyes armL={2.1} armR={2.1} mouthOpen={0.5} />
      {lights > 0.95 && <Glow position={[-1.8, 1.6, -1.2]} scale={4} color="#ffd36b" opacity={0.25} />}
    </Stage>
  );
};

export const STORY3_DURATION = 1050;

export const Story3: React.FC = () => (
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
