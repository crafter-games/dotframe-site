"use client";

import { useState } from "react";

export function Copy({ text, label }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1200);
      }}
      className="shrink-0 font-mono text-xs text-mute transition-colors hover:text-paper"
    >
      {done ? "copied" : (label ?? "copy")}
    </button>
  );
}
