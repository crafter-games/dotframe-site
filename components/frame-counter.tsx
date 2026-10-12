"use client";

import { useEffect, useState } from "react";

// Frame advances at 60 Hz; the checksum is a hash of the frame number,
// so the same frame always shows the same sum.
function checksum(frame: number) {
  let h = 2166136261 ^ frame;
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return ((h ^ (h >>> 16)) >>> 0).toString(16).padStart(8, "0");
}

export function FrameCounter() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    let id = 0;
    const tick = (now: number) => {
      setFrame(Math.floor(((now - start) / 1000) * 60));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <p className="font-mono text-xs tracking-wide text-mute tabular-nums">
      <span className="text-paper">frame {String(frame).padStart(6, "0")}</span>
      <span className="mx-2 text-line">/</span>
      checksum {checksum(frame)}
    </p>
  );
}
