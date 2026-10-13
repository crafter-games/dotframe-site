"use client";

import { useState } from "react";
import { Code } from "@/lib/highlight";

export type Tab = { title: string; body: string; lang: "sh" | "json" };

export function Terminal({ tabs }: { tabs: { id: string; parts: Tab[] }[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const tab = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <div>
      <div className="flex gap-1 pl-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`-mb-[2px] border-2 border-ink px-3 pt-1.5 pb-1 font-mono text-xs font-bold uppercase transition-colors ${t.id === active ? "border-b-paper bg-paper text-ink" : "bg-paper-2 text-mute hover:text-ink"}`}
          >
            {t.id}
          </button>
        ))}
      </div>
      {/* Every panel sits in the same grid cell so the box keeps the tallest height. */}
      <div className="grid border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_var(--color-ink)]">
        {tabs.map((t) => (
          <div
            key={t.id}
            className={`col-start-1 row-start-1 min-w-0 ${t.id === tab.id ? "" : "invisible"}`}
            aria-hidden={t.id !== tab.id}
          >
            {t.parts.map((p) => (
              <Code key={p.title} lang={p.lang}>
                {p.body}
              </Code>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
