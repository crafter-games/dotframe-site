import Image from "next/image";
import { Copy } from "@/components/copy";
import { Apple, Discord, Globe, Phone, Windows } from "@/components/icons";
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
    note: "WebGPU, Canvas 2D on phones",
    cmd: "build web",
    icon: Globe,
  },
  {
    name: "iPhone",
    note: "native app, no web view",
    cmd: "build ios",
    icon: Phone,
  },
  {
    name: "macOS",
    note: "one binary, SDL3 + wgpu",
    cmd: "build macos",
    icon: Apple,
  },
  {
    name: "Windows",
    note: "cross-built from a Mac",
    cmd: "build-native.sh windows",
    icon: Windows,
  },
  {
    name: "Discord",
    note: "an Activity in voice",
    cmd: "build discord",
    icon: Discord,
  },
];

const games = [
  {
    name: "Espresso perfecto",
    kind: "Hold, pour, release on the line",
    where: "Web · phones",
    img: "/media/espresso.jpg",
    video: "/media/espresso.mp4",
    href: "https://crafter.run/es/events/hot-reload",
    repo: "https://github.com/crafter-games/espresso",
  },
  {
    name: "Craft Ones",
    kind: "1v1 artillery with Peruvian critters",
    where: "Online · Discord",
    img: "/media/ones.jpg",
    video: "/media/ones.mp4",
    href: "https://craft-ones.crafter.run",
    repo: "https://github.com/crafter-games/craft-ones",
  },
  {
    name: "Crafter Smash",
    kind: "Platform fighter, bring a gamepad",
    where: "Web · local 2P",
    img: "/media/smash.jpg",
    video: "/media/smash.mp4",
    href: "https://crafter-smash-dotframe.vercel.app",
    repo: "https://github.com/crafter-games/crafter-smash-dotframe",
  },
  {
    name: "The Ones",
    kind: "3D horror, 60 fps on an iPhone 15 Plus",
    where: "Windows · iPhone",
    img: "/media/ones-game.jpg",
    href: "https://theones.crafter.games",
    repo: "https://github.com/crafter-games/the-ones-game",
  },
];

function Edge({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-12 flex items-center gap-4 font-mono text-xs font-bold uppercase tracking-[0.18em]">
      <span className="text-pencil">▸ {n}</span>
      <span className="shrink-0">{children}</span>
      <span className="h-[2px] grow bg-ink" />
      <span className="hidden text-mute sm:inline">dotframe 0.3.3</span>
    </div>
  );
}

function Reel() {
  const row = [...targets, ...targets];
  return (
    <div className="film relative overflow-hidden py-6" aria-hidden="true">
      <div className="sprockets absolute inset-x-0 top-2 h-2" />
      <div className="reel flex w-max items-center gap-14 px-7">
        {row.map((t, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: duplicated row for the loop
            key={i}
            className="flex items-center gap-4"
          >
            <t.icon className="size-7" />
            <span className="display text-5xl">{t.name}</span>
            <span className="ml-8 size-2 rounded-full bg-pencil" />
          </span>
        ))}
      </div>
      <div className="sprockets absolute inset-x-0 bottom-2 h-2" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <Smooth />

      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <header className="flex items-center justify-between border-b-2 border-ink py-4 font-mono text-xs font-bold uppercase tracking-[0.14em]">
          <a href="/" className="flex items-center gap-2">
            <Mark className="size-5" />
            dotframe
          </a>
          <span className="hidden text-mute md:inline">
            roll 0.3.3 · MIT · TypeScript
          </span>
          <nav className="flex items-center gap-5">
            <a href="#play" className="hidden hover:text-pencil sm:inline">
              Play
            </a>
            <a href="#games" className="hidden hover:text-pencil sm:inline">
              Games
            </a>
            <a href={REPO} className="hover:text-pencil">
              GitHub ↗
            </a>
          </nav>
        </header>
        <div className="mt-[3px] h-[2px] bg-ink" />

        <section className="grid items-start gap-14 pt-14 pb-28 lg:grid-cols-[1fr_1.05fr] lg:pt-20">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-pencil">
              ▸ F 0000 · a game engine
            </p>
            <h1 className="display mt-5 text-[clamp(3.5rem,7.4vw,6.6rem)] [font-variation-settings:'wdth'_75]">
              The engine your agent can{" "}
              <span className="relative inline-block">
                play
                <svg
                  viewBox="0 0 200 20"
                  className="absolute -bottom-3 left-0 w-full text-pencil"
                  aria-hidden="true"
                >
                  <path
                    d="M3 12c40-6 90-9 194-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="text-pencil">.</span>
            </h1>
            <p className="mt-10 max-w-md text-lg leading-relaxed">
              Write the game once in TypeScript. Ship it to the web, iPhone,
              macOS, Windows and Discord. Every frame is deterministic, so your
              agent plays it headless, looks at any frame, and finds the bug
              before your players do.
            </p>
            <div className="mt-10 flex max-w-md items-center justify-between gap-4 border-2 border-ink bg-paper px-4 py-3 shadow-[4px_4px_0_var(--color-ink)]">
              <Code lang="sh">$ npm i -g dotframe</Code>
              <Copy text="npm i -g dotframe" />
            </div>
            <p className="mt-4 font-mono text-xs text-mute">
              then tell your agent:{" "}
              <span className="font-bold text-ink">
                dotframe skills get core
              </span>
            </p>
          </div>
          <div className="lg:pt-6">
            <Scrubber />
          </div>
        </section>
      </div>

      <Reel />

      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <section id="play" className="py-28">
          <Edge n="01A">How an agent plays</Edge>
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="reveal flex flex-col gap-6">
              <h2 className="display text-6xl">
                No screen needed. Until it wants one.
              </h2>
              <p className="leading-relaxed">
                The sim is pure state and a fixed step. An agent mashes inputs
                through 600 frames in a millisecond and reads the state back as
                JSON. When it needs to see, it renders that exact frame through
                the real WebGPU renderer and opens the PNG.
              </p>
              <p className="leading-relaxed">
                Record a run once and it becomes the test: every change after
                that has to land on the same checksums. That is how a spill that
                kept taking lives in a loop showed up, at{" "}
                <span className="bg-ink px-1 font-mono text-paper">
                  lives: -12
                </span>
                .
              </p>
              <figure className="relative mt-2 flex w-fit items-end gap-4">
                <Image
                  src="/media/f-600.png"
                  alt="Frame 600 of Espresso perfecto, rendered by dotframe snap"
                  width={110}
                  height={196}
                  className="rotate-[-3deg] border-2 border-ink shadow-[4px_4px_0_var(--color-ink)]"
                />
                <figcaption className="pb-2 font-hand text-lg leading-tight text-pencil">
                  what the agent
                  <br />
                  saw at F 0600
                </figcaption>
              </figure>
            </div>
            <div className="reveal">
              <Terminal tabs={tabs} />
            </div>
          </div>
        </section>

        <section className="pb-28">
          <Edge n="02A">The whole contract</Edge>
          <div className="flex flex-col-reverse gap-12">
            <div className="reveal border-2 border-ink bg-paper shadow-[6px_6px_0_var(--color-ink)]">
              <div className="flex items-center justify-between border-b-2 border-ink px-4 py-2 font-mono text-xs font-bold uppercase">
                <span>game.ts</span>
                <span className="text-mute">
                  dotframe new my-game --template blank
                </span>
              </div>
              <Code lang="ts" className="p-5">
                {GAME}
              </Code>
            </div>
            <div className="reveal flex flex-col gap-6">
              <h2 className="display text-6xl">
                State in. Inputs in. Next frame out.
              </h2>
              <p className="leading-relaxed">
                All the state lives in one object and only changes in{" "}
                <span className="font-mono font-bold">step()</span>. That is
                what lets dotframe replay it, snapshot it, and roll it back for
                netplay. Render only reads.
              </p>
            </div>
          </div>
        </section>

        <section id="ship" className="pb-28">
          <Edge n="03A">One codebase, five places</Edge>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <h2 className="reveal display text-6xl">
              No JavaScript engine in the binary.
            </h2>
            <p className="reveal self-end leading-relaxed">
              <a
                href="https://scriptc.dev"
                className="font-bold underline decoration-pencil decoration-2 underline-offset-4"
              >
                scriptc
              </a>{" "}
              compiles your TypeScript to a real native binary over SDL3 and
              wgpu-native. The web build runs the same code on WebGPU, and 2D
              games fall back to Canvas 2D on phones without it.
            </p>
          </div>
          <ul className="reveal mt-12 grid border-t-2 border-l-2 border-ink sm:grid-cols-2 lg:grid-cols-5">
            {targets.map((t, i) => (
              <li
                key={t.name}
                className="group flex flex-col gap-8 border-r-2 border-b-2 border-ink p-5 transition-colors hover:bg-ink hover:text-paper"
              >
                <div className="flex items-start justify-between">
                  <t.icon className="size-8" />
                  <span className="font-mono text-[10px] font-bold text-mute group-hover:text-paper/60">
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="display text-4xl">{t.name}</h3>
                  <p className="mt-2 text-sm text-mute group-hover:text-paper/70">
                    {t.note}
                  </p>
                </div>
                <p className="mt-auto font-mono text-[11px] font-bold">
                  <span className="text-pencil">$</span> {t.cmd}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section id="games" className="pb-28">
          <Edge n="04A">Made with dotframe</Edge>
          <ol className="reveal border-t-2 border-ink">
            {games.map((g, i) => (
              <li
                key={g.name}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-5 gap-y-2 border-b border-ink py-5 sm:grid-cols-[2.5rem_15rem_1fr_auto_auto]"
              >
                <span className="font-mono text-xs font-bold">Nº 0{i + 1}</span>
                <a
                  href={g.href}
                  className="relative col-span-2 block overflow-hidden border-2 border-ink sm:col-span-1"
                >
                  {"video" in g && g.video ? (
                    <video
                      src={g.video}
                      poster={g.img}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={`${g.name} gameplay`}
                      className={`aspect-video w-full object-cover`}
                    />
                  ) : (
                    <Image
                      src={g.img}
                      alt={`${g.name}`}
                      width={480}
                      height={270}
                      className="aspect-video w-full object-cover"
                    />
                  )}
                </a>
                <div className="col-span-2 sm:col-span-1">
                  <a
                    href={g.href}
                    className="display text-4xl group-hover:text-pencil sm:text-5xl"
                  >
                    {g.name}
                  </a>
                  <p className="mt-1 text-sm text-mute">{g.kind}</p>
                </div>
                <span className="hidden font-mono text-xs font-bold uppercase tracking-wider sm:inline">
                  {g.where}
                </span>
                <span className="flex gap-3 font-mono text-xs font-bold uppercase">
                  <a
                    href={g.href}
                    className="bg-ink px-2.5 py-1.5 text-paper hover:bg-pencil"
                  >
                    Play ↗
                  </a>
                  <a
                    href={g.repo}
                    className="border-2 border-ink px-2 py-1 hover:bg-ink hover:text-paper"
                  >
                    Src
                  </a>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section id="badge" className="pb-28">
          <Edge n="05A">Shipped one?</Edge>
          <div className="grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="reveal flex flex-col gap-6">
              <h2 className="display text-6xl">Wear the badge.</h2>
              <p className="leading-relaxed">
                Put it in your README so the next person finds the engine.
              </p>
              <div className="flex flex-wrap gap-3">
                {/* biome-ignore lint/performance/noImgElement: the exact SVGs games embed */}
                <img
                  src={`${RAW}/made-with-dotframe-light.svg`}
                  alt="Made with dotframe, light"
                  height={32}
                  className="h-8 w-auto"
                />
                {/* biome-ignore lint/performance/noImgElement: the exact SVGs games embed */}
                <img
                  src={`${RAW}/made-with-dotframe-dark.svg`}
                  alt="Made with dotframe, dark"
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
            </div>
            <div className="reveal min-w-0 border-2 border-ink bg-paper shadow-[6px_6px_0_var(--color-ink)]">
              <div className="flex items-center justify-between border-b-2 border-ink px-4 py-2 font-mono text-xs font-bold uppercase">
                <span>README.md</span>
                <Copy text={BADGE} label="copy badge" />
              </div>
              <Code lang="html" className="p-5 text-xs leading-5">
                {BADGE}
              </Code>
            </div>
          </div>
        </section>
      </div>

      <footer className="film">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 sm:px-8 md:flex-row md:items-end md:justify-between">
          <p className="display text-[clamp(3.5rem,9vw,7rem)]">
            dotframe<span className="text-pencil">.</span>
          </p>
          <div className="flex flex-col gap-2 font-mono text-xs font-bold uppercase tracking-wider text-paper/70 md:items-end">
            <span>MIT · Crafter Games</span>
            <a href={REPO} className="hover:text-paper">
              github.com/crafter-games/dotframe
            </a>
            <span className="text-pencil">▍ dotframe skills get core</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
