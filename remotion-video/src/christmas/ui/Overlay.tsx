import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const FONT = "'Inter Display', 'Inter', 'Noto Color Emoji', sans-serif";

const stroke = (px: number): React.CSSProperties => ({
  WebkitTextStroke: `${px}px #0b0b14`,
  paintOrder: "stroke fill",
  textShadow: "0 8px 24px rgba(0,0,0,0.55)",
});

/** Big hook text with pop-in. `from`/`to` are frames relative to the parent sequence. */
export const Hook: React.FC<{
  lines: { text: string; color?: string; size?: number }[];
  from: number;
  to: number;
  top?: number;
}> = ({ lines, from, to, top = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from || frame >= to) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top, width: 900, textAlign: "center" }}>
        {lines.map((l, i) => {
          const s = spring({ frame: frame - from - i * 6, fps, config: { damping: 9, stiffness: 160 } });
          const wob = Math.sin((frame - from) * 0.25 + i) * 1.2;
          return (
            <div
              key={i}
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: l.size ?? 96,
                lineHeight: 1.05,
                color: l.color ?? "#ffffff",
                transform: `scale(${s}) rotate(${wob}deg)`,
                margin: "10px 0",
                ...stroke(14),
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Mini-hook caption in the lower-middle area (above TikTok UI). */
export const Caption: React.FC<{ text: string; from: number; to: number; y?: number; color?: string }> = ({
  text,
  from,
  to,
  y = 1180,
  color = "#ffe45c",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from || frame >= to) return null;
  const s = spring({ frame: frame - from, fps, config: { damping: 12, stiffness: 200 } });
  const out = interpolate(frame, [to - 6, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: y,
          width: 880,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 72,
          lineHeight: 1.1,
          color,
          opacity: out,
          transform: `translateY(${(1 - s) * 60}px) scale(${0.8 + s * 0.2})`,
          ...stroke(12),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** Countdown clock badge. */
export const Clock: React.FC<{ fromTime: number; toTime: number; from: number; to: number }> = ({
  fromTime,
  toTime,
  from,
  to,
}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const minutes = Math.floor(
    interpolate(frame, [from, to], [fromTime, toTime], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const pulse = 1 + 0.06 * Math.max(0, Math.sin(frame * 0.4));
  return (
    <AbsoluteFill style={{ alignItems: "center", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 240,
          padding: "18px 44px",
          borderRadius: 40,
          background: "rgba(180,20,30,0.92)",
          border: "6px solid #ffd65c",
          color: "white",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 96,
          transform: `scale(${pulse})`,
          boxShadow: "0 0 60px rgba(255,80,80,0.7)",
        }}
      >
        ⏰ {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};

/** Counter badge (e.g. gifts delivered). */
export const Counter: React.FC<{ label: string; fromN: number; toN: number; from: number; to: number }> = ({
  label,
  fromN,
  toN,
  from,
  to,
}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const n = Math.floor(
    interpolate(frame, [from, to - 10], [fromN, toN], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return (
    <AbsoluteFill style={{ alignItems: "center", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 240,
          padding: "16px 40px",
          borderRadius: 40,
          background: "rgba(20,110,60,0.92)",
          border: "6px solid #ffd65c",
          color: "white",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 84,
        }}
      >
        {label} {n}
      </div>
    </AbsoluteFill>
  );
};

/** Full-screen flash (lightning, magic). */
export const Flash: React.FC<{ at: number[]; color?: string; length?: number; max?: number }> = ({
  at,
  color = "#ffffff",
  length = 8,
  max = 0.85,
}) => {
  const frame = useCurrentFrame();
  let o = 0;
  for (const a of at) {
    if (frame >= a && frame < a + length) o = Math.max(o, max * (1 - (frame - a) / length));
  }
  if (o <= 0) return null;
  return <AbsoluteFill style={{ backgroundColor: color, opacity: o, pointerEvents: "none" }} />;
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

/** Fade from black at the start of a scene. */
export const FadeIn: React.FC<{ frames?: number; color?: string }> = ({ frames = 6, color = "#000" }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (o <= 0) return null;
  return <AbsoluteFill style={{ backgroundColor: color, opacity: o }} />;
};

/** Handwritten letter card shown full-screen. */
export const LetterCard: React.FC<{ from: number; to: number; lines: string[]; signature: string }> = ({
  from,
  to,
  lines,
  signature,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from || frame >= to) return null;
  const s = spring({ frame: frame - from, fps, config: { damping: 14 } });
  const chars = Math.floor((frame - from - 8) * 1.4);
  const full = lines.join("\n");
  const shown = full.slice(0, Math.max(0, chars));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          width: 820,
          padding: "60px 64px",
          background: "#fffaf0",
          backgroundImage: "repeating-linear-gradient(#fffaf0 0 62px, #c9d6f0 62px 64px)",
          borderRadius: 18,
          transform: `rotate(-3deg) scale(${s})`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          fontFamily: FONT,
          fontStyle: "italic",
          fontWeight: 600,
          color: "#2f4fb8",
          fontSize: 54,
          lineHeight: "64px",
          whiteSpace: "pre-wrap",
          minHeight: 560,
        }}
      >
        {shown}
        {chars > full.length + 10 && (
          <div style={{ textAlign: "right", marginTop: 24, color: "#d0304a" }}>{signature}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};
