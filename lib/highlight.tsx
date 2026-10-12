import type { ReactNode } from "react";

type Lang = "sh" | "json" | "html" | "ts";

// Token classes map to the palette in globals.css (.tk-*).
const rules: Record<Lang, [RegExp, string][]> = {
  sh: [
    [/^#.*/, "comment"],
    [/^\$/, "prompt"],
    [/^--?[\w-]+/, "flag"],
    [/^(dotframe|npm|npx|bun)\b/, "cmd"],
    [/^\d+(ms)?\b/, "num"],
    [/^->/, "punct"],
  ],
  json: [
    [/^"[^"]*"(?=\s*:)/, "key"],
    [/^"[^"]*"/, "str"],
    [/^-?\d+(\.\d+)?/, "num"],
    [/^(true|false|null)\b/, "bool"],
    [/^[{}[\],:]/, "punct"],
    [/^…/, "comment"],
  ],
  html: [
    [/^<\/?[\w-]+/, "tag"],
    [/^\/?>/, "tag"],
    [/^[\w-]+(?==)/, "attr"],
    [/^"[^"]*"/, "str"],
  ],
  ts: [
    [/^\/\/.*/, "comment"],
    [/^(import|from|export|default|const|return|function)\b/, "kw"],
    [/^"[^"]*"/, "str"],
    [/^\d+(\.\d+)?/, "num"],
    [/^[A-Za-z_]\w*(?=\()/, "fn"],
    [/^[{}()[\],.;:=>]/, "punct"],
  ],
};

function line(src: string, lang: Lang): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = src;
  let plain = "";
  let i = 0;
  const flush = () => {
    if (plain) out.push(plain);
    plain = "";
  };
  while (rest) {
    const hit = rules[lang]
      .map(([re, cls]) => [rest.match(re), cls] as const)
      .find(([m]) => m);
    if (hit?.[0]) {
      flush();
      out.push(
        <span key={i++} className={`tk-${hit[1]}`}>
          {hit[0][0]}
        </span>,
      );
      rest = rest.slice(hit[0][0].length);
    } else {
      plain += rest[0];
      rest = rest.slice(1);
    }
  }
  flush();
  return out;
}

export function Code({
  children,
  lang,
  className = "",
}: {
  children: string;
  lang: Lang;
  className?: string;
}) {
  return (
    <pre
      className={`overflow-x-auto font-mono text-[13px] leading-6 ${className}`}
    >
      <code>
        {children.split("\n").map((l, n) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: lines are static
          <span key={n} className="block">
            {line(l, lang)}
            {l === "" ? " " : null}
          </span>
        ))}
      </code>
    </pre>
  );
}
