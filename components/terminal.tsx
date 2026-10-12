"use client";

import { useState } from "react";
import { Code } from "@/lib/highlight";

export type Tab = {
  title: string;
  body: string;
  lang: "sh" | "json";
};

export function Terminal({ tabs }: { tabs: { id: string; parts: Tab[] }[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const tab = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-ink-2">
      <div className="flex items-center gap-1 border-b border-line px-3 py-2">
        <span className="mr-3 flex gap-1.5">
          <i className="size-2.5 rounded-full bg-line" />
          <i className="size-2.5 rounded-full bg-line" />
          <i className="size-2.5 rounded-full bg-line" />
        </span>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`rounded px-2 py-1 font-mono text-xs transition-colors ${t.id === active ? "bg-ink text-paper" : "text-mute hover:text-paper"}`}
          >
            {t.id}
          </button>
        ))}
      </div>
      <div className="min-h-[22rem] p-5">
        {tab.parts.map((p) => (
          <Code key={p.title} lang={p.lang} className="text-paper/90">
            {p.body}
          </Code>
        ))}
      </div>
    </div>
  );
}
