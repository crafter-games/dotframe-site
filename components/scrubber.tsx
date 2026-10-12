"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// A tiny deterministic sim in the shape of a dotframe game: integer state,
// a fixed step, inputs from a seeded stream. Any frame can be rebuilt from 0.
const W = 160;
const H = 90;
const MAX = 3600;
const FLOOR = 76;
const PLATFORMS = [
  [24, 58, 28],
  [70, 44, 24],
  [112, 60, 30],
];

type State = {
  x: number; // 1/16 px
  y: number;
  vx: number;
  vy: number;
  ground: boolean;
  star: number;
  stars: number;
  seed: number;
};

const START: State = {
  x: 20 * 16,
  y: FLOOR * 16,
  vx: 18,
  vy: 0,
  ground: true,
  star: 90,
  stars: 0,
  seed: 7,
};

function rand(s: State) {
  s.seed = (Math.imul(s.seed, 1103515245) + 12345) >>> 0;
  return s.seed >>> 16;
}

function input(s: State, frame: number) {
  // the "agent": jumps when the star is just ahead, plus a seeded hop now and then
  const dx = s.star * 16 - s.x;
  const ahead = s.vx > 0 ? dx > 0 && dx < 22 * 16 : dx < 0 && dx > -22 * 16;
  let h = Math.imul(frame >> 5, 2654435761) >>> 0;
  h ^= h >>> 15;
  return s.ground && (ahead || ((h & 7) === 0 && (frame & 31) === 0));
}

function step(p: State, frame: number): State {
  const s = { ...p };
  if (input(p, frame)) {
    s.vy = -62;
    s.ground = false;
  }
  s.vy = Math.min(s.vy + 4, 80);
  s.x += s.vx;
  if (s.x < 4 * 16 || s.x > (W - 4) * 16) s.vx = -s.vx;
  const prev = s.y;
  s.y += s.vy;
  s.ground = false;
  for (const [px, py, pw] of [...PLATFORMS, [0, FLOOR, W]]) {
    const top = py * 16;
    if (
      s.vy >= 0 &&
      prev <= top &&
      s.y >= top &&
      s.x >= px * 16 &&
      s.x <= (px + pw) * 16
    ) {
      s.y = top;
      s.vy = 0;
      s.ground = true;
    }
  }
  const sx = s.star * 16;
  const sy = (40 + ((s.star * 7) % 22)) * 16;
  if (Math.abs(s.x - sx) < 6 * 16 && Math.abs(s.y - 3 * 16 - sy) < 10 * 16) {
    s.stars++;
    s.star = 12 + (rand(s) % (W - 24));
  }
  return s;
}

function checksum(s: State) {
  let h = 2166136261;
  for (const v of [s.x, s.y, s.vx, s.vy, s.star, s.stars, s.seed]) {
    h = Math.imul(h ^ (v & 0xffff), 16777619);
    h = Math.imul(h ^ (v >>> 16), 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function Scrubber() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const states = useRef<State[]>([START]);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const box = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  frameRef.current = frame;

  const at = useCallback((f: number) => {
    const list = states.current;
    while (list.length <= f)
      list.push(step(list[list.length - 1], list.length - 1));
    return list[f];
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    let id = 0;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      acc += now - last;
      last = now;
      const n = Math.floor(acc / (1000 / 60));
      if (n) {
        acc -= n * (1000 / 60);
        setFrame((f) => (f + n) % MAX);
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing]);

  const s = at(frame);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#131318";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#1d1d24";
    for (let x = 0; x < W; x += 8)
      for (let y = 0; y < H; y += 8) ctx.fillRect(x, y, 1, 1);
    ctx.fillStyle = "#efebe4";
    ctx.fillRect(0, FLOOR, W, 1);
    for (const [px, py, pw] of PLATFORMS) ctx.fillRect(px, py, pw, 2);
    // trail: the last frames, rebuilt from the same states
    for (let k = 12; k > 0; k--) {
      const t = states.current[Math.max(0, frame - k * 2)];
      ctx.globalAlpha = (12 - k) / 40;
      ctx.fillStyle = "#a970ff";
      ctx.fillRect((t.x >> 4) - 2, (t.y >> 4) - 5, 4, 4);
    }
    ctx.globalAlpha = 1;
    const sx = s.star;
    const sy = 40 + ((s.star * 7) % 22);
    ctx.fillStyle = "#f7e08e";
    ctx.fillRect(sx - 1, sy - 3, 2, 6);
    ctx.fillRect(sx - 3, sy - 1, 6, 2);
    ctx.fillStyle = "#a970ff";
    ctx.fillRect((s.x >> 4) - 3, (s.y >> 4) - 6, 6, 6);
    ctx.fillStyle = "#efebe4";
    ctx.fillRect((s.x >> 4) + (s.vx > 0 ? 0 : -2), (s.y >> 4) - 5, 2, 2);
  }, [frame, s]);

  const seek = useCallback((f: number) => {
    setPlaying(false);
    setFrame(Math.max(0, Math.min(MAX - 1, f)));
  }, []);

  // Keys work while the pointer is over the player, so space never steals page scroll elsewhere.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let over = false;
    const enter = () => {
      over = true;
    };
    const leave = () => {
      over = false;
    };
    const key = (e: KeyboardEvent) => {
      if (!over) return;
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
      if (e.key === "ArrowLeft") seek(frameRef.current - (e.shiftKey ? 60 : 1));
      if (e.key === "ArrowRight")
        seek(frameRef.current + (e.shiftKey ? 60 : 1));
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    window.addEventListener("keydown", key);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      window.removeEventListener("keydown", key);
    };
  }, [seek]);

  return (
    <div
      ref={box}
      className="rounded-lg border border-line bg-ink-2 p-2 shadow-[0_0_0_1px_#0b0b0e,0_30px_80px_-30px_rgb(169_112_255/0.35)]"
    >
      <canvas
        ref={canvas}
        width={W}
        height={H}
        className="block aspect-[16/9] w-full rounded-md [image-rendering:pixelated]"
        aria-label="A small deterministic game: a violet dot jumps between platforms and collects stars"
      />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-2 pt-3 pb-1 font-mono text-xs tabular-nums">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => seek(frame - 1)}
            className="btn"
            aria-label="Previous frame"
          >
            ◂
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="btn w-14"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "pause" : "play"}
          </button>
          <button
            type="button"
            onClick={() => seek(frame + 1)}
            className="btn"
            aria-label="Next frame"
          >
            ▸
          </button>
        </div>
        <span className="text-paper">
          frame {String(frame).padStart(4, "0")}
        </span>
        <span className="text-mute">
          checksum <span className="text-dot">{checksum(s)}</span>
        </span>
        <span className="text-mute">★ {s.stars}</span>
        <span
          className={`ml-auto ${input(s, frame) ? "text-sun" : "text-line"}`}
        >
          input ▲
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={MAX - 1}
        value={frame}
        onChange={(e) => seek(Number(e.target.value))}
        className="scrub mx-2 mt-1 mb-2 w-[calc(100%-1rem)]"
        aria-label="Scrub frames"
      />
    </div>
  );
}
