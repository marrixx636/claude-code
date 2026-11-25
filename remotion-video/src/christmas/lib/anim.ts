import { Easing, interpolate } from "remotion";

export type V3 = [number, number, number];

export const ease = Easing.inOut(Easing.cubic);
export const easeOut = Easing.out(Easing.cubic);

/** Clamped interpolate between two frames. */
export const lerpF = (
  frame: number,
  from: number,
  to: number,
  a: number,
  b: number,
  easing: (t: number) => number = ease,
) =>
  interpolate(frame, [from, to], [a, b], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const mixV3 = (a: V3, b: V3, t: number): V3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/** Camera shake offset, deterministic per frame. */
export const shake = (frame: number, amount: number): V3 => [
  Math.sin(frame * 1.7) * amount + Math.sin(frame * 3.1) * amount * 0.5,
  Math.cos(frame * 2.3) * amount * 0.7,
  0,
];

/** Natural blink: returns 0 (open) .. 1 (closed). */
export const blinkAt = (frame: number, every = 75, offset = 0) => {
  const p = (frame + offset) % every;
  return p < 3 ? Math.sin((p / 3) * Math.PI) : 0;
};
