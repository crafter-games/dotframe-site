import Image from "next/image";
import { Copy } from "@/components/copy";
import {
  Apple,
  Discord,
  Globe,
  Laptop,
  Phone,
  Windows,
} from "@/components/icons";
import { Mark } from "@/components/logo";
import { Scrubber } from "@/components/scrubber";
import { Smooth } from "@/components/smooth";
import { Terminal } from "@/components/terminal";
import { Code } from "@/lib/highlight";

const REPO = "https://github.com/crafter-games/dotframe";
const RAW =
  "https://raw.githubusercontent.com/crafter-games/dotframe/main/assets/badge";
const BADGE = `<a href="https://dotframe.crafter.games">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${RAW}/made-with-dotframe-dark.svg">
    <img alt="Made with dotframe" src="${RAW}/made-with-dotframe-light.svg" height="32">
  </picture>
</a>`;

// Real output, captured from Espresso perfecto with dotframe 0.3.3.
const tabs = [
  {
    id: "sim",
    parts: [
      {
        title: "cmd",
        lang: "sh" as const,
        body: "$ dotframe sim --mash 7 --frames 600 --json",
      },
      {
        title: "out",
        lang: "json" as const,
        body: `{
  "ok": true,
  "data": {
    "frames": 505,
    "over": true,
    "checksum": 661060014,
    "state": {
      "phase": "done",
      "served": 3,
      "drink": "espresso",
      "lives": 0,
      "verdict": "MUY LEJOS",
      …
    },
    "ms": 1
  }
}`,
      },
    ],
  },
  {
    id: "snap",
    parts: [
      {
        title: "cmd",
        lang: "sh" as const,
        body: `$ dotframe snap --frame 600 --mash 7 --out /tmp/snap-600.png
frame 600 -> /tmp/snap-600.png (checksum 99059207)

# then the agent opens the PNG and looks`,
      },
    ],
  },
  {
    id: "replay",
    parts: [
      {
        title: "cmd",
        lang: "sh" as const,
        body: `$ dotframe replay record replays/shift.json --mash 7
$ dotframe replay verify replays/*.json
ok   replays/shift.json

# 3868 frames, 64 checksums, one bot shift: 12 clean cups, 3 spills`,
      },
    ],
  },
  {
    id: "errors",
    parts: [
      {
        title: "cmd",
        lang: "sh" as const,
        body: `$ dotframe desync --latency 120ms --jitter 30ms
error UNSUPPORTED: desync simulates two peers; this sim has 1 players
fix: dotframe doctor (its sim:render check proves render purity for any player count)
guide: dotframe skills get netplay

# every error says what broke, how to fix it, and what to read`,
      },
    ],
  },
];

const GAME = `export function step(game: Game, inputs: number[]): void {
  game.frame += 1;
  game.players.forEach((p, i: number): void => {
    const bits = inputs[i] ?? 0;
    p.x = Math.max(20, Math.min(WINDOW.width - 20, p.x + (bits & 2 ? 4 : 0) - (bits & 1 ? 4 : 0)));
    p.y = Math.max(20, Math.min(WINDOW.height - 20, p.y - (bits & 4 ? 4 : 0) + 1));
  });
}`;

const targets = [
  {
    name: "Web",
    note: "WebGPU, and Canvas 2D on phones without it",
    cmd: "dotframe build web",
    icon: <Globe className="size-6" />,
  },
  {
    name: "iPhone",
    note: "a native app, no web view",
    cmd: "dotframe build ios",
    icon: (
      <span className="relative">
        <Phone className="size-6" />
      </span>
    ),
  },
  {
    name: "macOS",
    note: "one binary, SDL3 + wgpu-native",
    cmd: "dotframe build macos",
    icon: <Apple className="size-6" />,
  },
  {
    name: "Windows",
    note: "cross-built from your Mac",
    cmd: "build-native.sh windows",
    icon: <Windows className="size-5" />,
  },
  {
    name: "Discord",
    note: "an Activity in the voice channel",
    cmd: "dotframe build discord",
    icon: <Discord className="size-6" />,
  },
];

const games = [
  {
    name: "Espresso perfecto",
    kind: "hold, pour, release on the line",
    img: "/media/espresso.gif",
    href: "https://crafter.run/es/events/hot-reload",
    repo: "https://github.com/crafter-games/espresso",
    span: "lg:row-span-2",
    fit: "aspect-[9/16] lg:aspect-auto lg:h-full object-top",
  },
  {
    name: "Craft Ones",
    kind: "1v1 artillery, online and in Discord",
    img: "/media/ones.jpg",
    href: "https://craft-ones.crafter.run",
    repo: "https://github.com/crafter-games/craft-ones",
    span: "",
    fit: "aspect-video",
  },
  {
    name: "Crafter Smash",
    kind: "platform fighter, bring a gamepad",
    img: "/media/smash.jpg",
    href: "https://crafter-smash-dotframe.vercel.app",
    repo: "https://github.com/crafter-games/crafter-smash-dotframe",
    span: "",
    fit: "aspect-video",
  },
  {
    name: "The Ones",
    kind: "3D horror, 60 fps on an iPhone 15 Plus",
    img: "/media/ones-game.jpg",
    href: "https://theones.crafter.games",
    repo: "https://github.com/crafter-games/the-ones-game",
    span: "lg:col-span-2",
    fit: "aspect-video lg:aspect-[21/9]",
  },
];

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="mb-10 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-mute">
      <span className="rounded border border-line px-1.5 py-0.5 text-dot tabular-nums">
        f{n}
      </span>
      {children}
    </p>
  );
}

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <Smooth />
      <div className="frames pointer-events-none absolute inset-x-0 top-0 h-[900px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <a
            href="/"
            className="flex items-center gap-2 font-mono text-sm font-medium"
          >
            <Mark />
            dotframe
          </a>
          <nav className="flex items-center gap-5 font-mono text-xs text-mute">
            <a href="#play" className="hidden hover:text-paper sm:inline">
              play
            </a>
            <a href="#ship" className="hidden hover:text-paper sm:inline">
              ship
            </a>
            <a href="#games" className="hidden hover:text-paper sm:inline">
              games
            </a>
            <a href={REPO} className="hover:text-paper">
              github
            </a>
          </nav>
        </header>

        <section className="grid items-center gap-12 pt-16 pb-24 lg:grid-cols-[1.05fr_1fr] lg:pt-24 lg:pb-32">
          <div>
            <a
              href="https://www.npmjs.com/package/dotframe"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-2 px-3 py-1 font-mono text-xs text-mute hover:text-paper"
            >
              <span className="size-1.5 rounded-full bg-dot" />
              0.3.3 · Canvas 2D fallback for phones
            </a>
            <h1 className="mt-7 text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-balance sm:text-7xl">
              The game engine your agent can play
              <span className="text-dot">.</span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-mute text-pretty">
              Write the game once in TypeScript. Ship it to the web, iPhone,
              macOS, Windows and Discord. Every frame is deterministic, so your
              agent can play it headless, look at any frame, and find the bug
              before your players do.
            </p>
            <div className="mt-10 flex max-w-lg items-center justify-between gap-4 rounded-lg border border-line bg-ink-2 px-4 py-3">
              <Code lang="sh" className="text-paper">
                $ npm i -g dotframe
              </Code>
              <Copy text="npm i -g dotframe" />
            </div>
            <p className="mt-3 font-mono text-xs text-mute">
              then tell your agent:{" "}
              <span className="text-paper">dotframe skills get core</span>
            </p>
          </div>

          <div className="reveal">
            <Scrubber />
            <p className="mt-4 text-center font-mono text-xs text-mute">
              Drag it back. Same frame, same checksum, every time.
              <span className="hidden sm:inline">
                {" "}
                <kbd className="rounded border border-line px-1">space</kbd>{" "}
                <kbd className="rounded border border-line px-1">←</kbd>{" "}
                <kbd className="rounded border border-line px-1">→</kbd>
              </span>
            </p>
          </div>
        </section>

        <section id="play" className="border-t border-line py-24 sm:py-32">
          <Label n="001">how an agent plays</Label>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="reveal flex flex-col gap-6">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.03em] text-balance">
                No screen needed. Until it wants one.
              </h2>
              <p className="leading-relaxed text-mute">
                The sim is pure state and a fixed step. An agent mashes inputs
                through 600 frames in a millisecond and reads the state back as
                JSON. When it needs to see, it renders that exact frame through
                the real WebGPU renderer and opens the PNG.
              </p>
              <p className="leading-relaxed text-mute">
                Record a run once and it becomes the test: every change after
                that has to land on the same checksums. That is how a spill that
                kept taking lives in a loop showed up, at{" "}
                <span className="font-mono text-paper">lives: -12</span>.
              </p>
              <div className="flex items-center gap-4 rounded-lg border border-line bg-ink-2 p-3">
                <Image
                  src="/media/f-600.png"
                  alt="Frame 600 of Espresso perfecto, rendered by dotframe snap"
                  width={72}
                  height={128}
                  className="rounded"
                />
                <p className="font-mono text-xs leading-relaxed text-mute">
                  <span className="text-paper">snap-600.png</span>
                  <br />
                  what the agent saw at frame 600
                </p>
              </div>
            </div>
            <div className="reveal">
              <Terminal tabs={tabs} />
            </div>
          </div>
        </section>

        <section className="border-t border-line py-24 sm:py-32">
          <Label n="002">the whole contract</Label>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="reveal overflow-hidden rounded-lg border border-line bg-ink-2">
              <div className="border-b border-line px-4 py-2 font-mono text-xs text-mute">
                game.ts <span className="text-line">·</span> dotframe new
                my-game --template blank
              </div>
              <Code lang="ts" className="p-5 text-paper/90">
                {GAME}
              </Code>
            </div>
            <div className="reveal flex flex-col justify-center gap-6">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.03em] text-balance">
                State in, inputs in, next frame out.
              </h2>
              <p className="leading-relaxed text-mute">
                All the state lives in one object and only changes in{" "}
                <span className="font-mono text-paper">step()</span>. That is
                what lets dotframe replay it, snapshot it, and roll it back for
                netplay. Render only reads.
              </p>
            </div>
          </div>
        </section>

        <section id="ship" className="border-t border-line py-24 sm:py-32">
          <Label n="003">one codebase, five places</Label>
          <h2 className="reveal max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-balance">
            Native builds have no JavaScript engine inside.
          </h2>
          <p className="reveal mt-5 max-w-xl leading-relaxed text-mute">
            <a
              href="https://scriptc.dev"
              className="text-paper underline decoration-line underline-offset-4 hover:decoration-dot"
            >
              scriptc
            </a>{" "}
            compiles your TypeScript to a real binary. The web build runs the
            same code on WebGPU.
          </p>
          <ul className="reveal mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {targets.map((t) => (
              <li
                key={t.name}
                className="group flex flex-col gap-6 bg-ink-2 p-5 transition-colors hover:bg-ink"
              >
                <span className="flex size-10 items-center justify-center rounded-md border border-line text-paper transition-colors group-hover:border-dot group-hover:text-dot">
                  {t.icon}
                </span>
                <div>
                  <h3 className="text-lg font-medium tracking-tight">
                    {t.name}
                  </h3>
                  <p className="mt-1 text-sm text-mute">{t.note}</p>
                </div>
                <Code lang="sh" className="mt-auto text-[11px] leading-5">
                  {t.cmd}
                </Code>
              </li>
            ))}
          </ul>
        </section>

        <section id="games" className="border-t border-line py-24 sm:py-32">
          <Label n="004">made with dotframe</Label>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((g) => (
              <article
                key={g.name}
                className={`reveal group flex flex-col overflow-hidden rounded-lg border border-line bg-ink-2 transition-colors hover:border-dot/50 ${g.span}`}
              >
                <a
                  href={g.href}
                  className="relative block grow overflow-hidden bg-ink"
                >
                  <Image
                    src={g.img}
                    alt={`${g.name} gameplay`}
                    width={960}
                    height={540}
                    unoptimized={g.img.endsWith(".gif")}
                    className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${g.fit}`}
                  />
                  <span className="absolute top-3 right-3 rounded-full bg-ink/80 px-2.5 py-1 font-mono text-[11px] text-paper opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                    play ↗
                  </span>
                </a>
                <div className="flex items-end justify-between gap-4 p-4">
                  <div>
                    <h3 className="font-medium tracking-tight">{g.name}</h3>
                    <p className="mt-1 text-sm text-mute">{g.kind}</p>
                  </div>
                  <a
                    href={g.repo}
                    className="font-mono text-xs text-mute hover:text-paper"
                  >
                    source
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="badge" className="border-t border-line py-24 sm:py-32">
          <Label n="005">shipped one?</Label>
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="reveal flex flex-col gap-6">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.03em] text-balance">
                Wear the badge.
              </h2>
              <p className="leading-relaxed text-mute">
                Put it in your README so the next person finds the engine.
              </p>
              {/* biome-ignore lint/performance/noImgElement: the exact SVG games embed */}
              <img
                src={`${RAW}/made-with-dotframe-dark.svg`}
                alt="Made with dotframe"
                height={32}
                className="h-8 w-auto self-start"
              />
            </div>
            <div className="reveal min-w-0 overflow-hidden rounded-lg border border-line bg-ink-2">
              <div className="flex items-center justify-between border-b border-line px-4 py-2">
                <span className="font-mono text-xs text-mute">README.md</span>
                <Copy text={BADGE} label="copy badge" />
              </div>
              <Code lang="html" className="p-5 text-xs leading-5 text-paper/80">
                {BADGE}
              </Code>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-line py-10 font-mono text-xs text-mute sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            <Mark className="size-4" /> MIT · made in Lima and Buenos Aires by{" "}
            <a href="https://crafter.games" className="hover:text-paper">
              Crafter Games
            </a>
          </span>
          <span>
            <span className="caret text-dot">▍</span> dotframe skills get core
          </span>
        </footer>
      </div>
    </main>
  );
}
