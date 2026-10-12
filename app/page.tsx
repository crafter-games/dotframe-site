import Image from "next/image";
import { Copy } from "@/components/copy";
import { FrameCounter } from "@/components/frame-counter";
import { Mark } from "@/components/logo";

const REPO = "https://github.com/crafter-games/dotframe";
const BADGE = `<a href="${REPO}">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/crafter-games/dotframe/main/assets/badge/made-with-dotframe-dark.svg">
    <img alt="Made with dotframe" src="https://raw.githubusercontent.com/crafter-games/dotframe/main/assets/badge/made-with-dotframe-light.svg" height="32">
  </picture>
</a>`;

const SIM = `$ dotframe sim --mash 7 --frames 600 --json
{
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
}`;

const loop = [
  {
    cmd: "dotframe sim",
    title: "Play it without a screen",
    body: "The sim is pure state and a fixed step. An agent mashes inputs for 600 frames and reads back the state and a checksum in a millisecond.",
  },
  {
    cmd: "dotframe snap",
    title: "See the frame",
    body: "Step to any frame and render it through the real WebGPU renderer. The agent opens the PNG and looks, the same way you would.",
  },
  {
    cmd: "dotframe replay verify",
    title: "Lock it in",
    body: "Record a run, commit it, and every change after that has to land on the same checksums. A replay is the test.",
  },
  {
    cmd: "dotframe desync",
    title: "Break the network on purpose",
    body: "Two rollback peers over a simulated link with 120 ms of latency and 30 ms of jitter. Checksums are compared every frame, and any difference fails the run.",
  },
];

const targets = [
  ["Web", "WebGPU, with a Canvas 2D fallback for 2D games"],
  ["iPhone", "native app, no web view"],
  ["macOS", "native binary"],
  ["Windows", "native binary"],
  ["Discord", "Activities, multiplayer in a voice channel"],
];

const games = [
  {
    name: "Espresso perfecto",
    kind: "Pour game · web and phones",
    img: "/media/espresso.gif",
    href: "https://crafter.run/es/events/hot-reload",
    repo: "https://github.com/crafter-games/espresso",
    tall: true,
  },
  {
    name: "Craft Ones",
    kind: "1v1 artillery · online and Discord",
    img: "/media/ones.jpg",
    href: "https://craft-ones.crafter.run",
    repo: "https://github.com/crafter-games/craft-ones",
  },
  {
    name: "Crafter Smash",
    kind: "Platform fighter · local and gamepad",
    img: "/media/smash.jpg",
    href: "https://crafter-smash-dotframe.vercel.app",
    repo: "https://github.com/crafter-games/crafter-smash-dotframe",
  },
  {
    name: "The Ones",
    kind: "3D horror · Windows and iPhone",
    img: "/media/ones-game.jpg",
    href: "https://theones.crafter.games",
    repo: "https://github.com/crafter-games/the-ones-game",
    wide: true,
  },
];

function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-line py-20 sm:py-28">
      <p className="mb-10 font-mono text-xs uppercase tracking-[0.2em] text-mute">
        <span className="text-dot">•</span> {label}
      </p>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <div className="frames pointer-events-none absolute inset-x-0 top-0 h-[720px]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <a
            href="/"
            className="flex items-center gap-2 font-mono text-sm font-medium"
          >
            <Mark />
            dotframe
          </a>
          <nav className="flex items-center gap-5 font-mono text-xs text-mute">
            <a href="#loop" className="hidden hover:text-paper sm:inline">
              loop
            </a>
            <a href="#games" className="hidden hover:text-paper sm:inline">
              games
            </a>
            <a
              href="https://www.npmjs.com/package/dotframe"
              className="hover:text-paper"
            >
              npm
            </a>
            <a href={REPO} className="hover:text-paper">
              github
            </a>
          </nav>
        </header>

        <section className="pt-20 pb-24 sm:pt-32 sm:pb-32">
          <FrameCounter />
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-balance sm:text-7xl">
            The game engine your agent can play
            <span className="text-dot">.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-mute text-pretty">
            One TypeScript codebase for the web, iPhone, macOS, Windows and
            Discord. Every frame is deterministic, so an agent can play your
            game, render any frame, and catch a desync before a player does.
          </p>

          <div className="mt-12 flex max-w-xl flex-col gap-2">
            {["npm i -g dotframe", "npx skills add crafter-games/dotframe"].map(
              (line) => (
                <div
                  key={line}
                  className="flex items-center justify-between gap-4 rounded-md border border-line bg-ink-2 px-4 py-3 font-mono text-sm"
                >
                  <span className="truncate">
                    <span className="select-none text-mute">$ </span>
                    {line}
                  </span>
                  <Copy text={line} />
                </div>
              ),
            )}
          </div>
        </section>

        <Section id="loop" label="the loop">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <ol className="flex flex-col gap-8">
              {loop.map((s, i) => (
                <li key={s.cmd} className="grid grid-cols-[2rem_1fr] gap-x-3">
                  <span className="font-mono text-xs text-mute tabular-nums pt-1">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium tracking-tight">
                      {s.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-dot">{s.cmd}</p>
                    <p className="mt-2 leading-relaxed text-mute">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-3">
              <pre className="overflow-x-auto rounded-md border border-line bg-ink-2 p-5 font-mono text-[13px] leading-6 text-paper/90">
                {SIM}
              </pre>
              <div className="flex items-center gap-4 rounded-md border border-line bg-ink-2 p-3">
                <Image
                  src="/media/f-600.png"
                  alt="Frame 600 of Espresso perfecto, rendered by dotframe snap"
                  width={90}
                  height={160}
                  className="rounded-sm"
                />
                <p className="font-mono text-xs leading-relaxed text-mute">
                  <span className="text-paper">
                    $ dotframe snap --frame 600 --mash 7
                  </span>
                  <br />
                  frame 600 -&gt; snap-600.png (checksum 99059207)
                  <br />
                  <br />
                  Errors carry a code, a fix, and the skill to read. Every
                  command takes --json.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section id="targets" label="one codebase, five places">
          <ul className="divide-y divide-line border-y border-line">
            {targets.map(([name, note]) => (
              <li
                key={name}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="text-2xl font-medium tracking-tight">
                  {name}
                </span>
                <span className="font-mono text-xs text-mute">{note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-xl leading-relaxed text-mute">
            Native builds compile your TypeScript with{" "}
            <a
              href="https://scriptc.dev"
              className="text-paper underline decoration-line underline-offset-4 hover:decoration-dot"
            >
              scriptc
            </a>{" "}
            over SDL3 and wgpu-native. There is no JavaScript engine in the
            binary.
          </p>
        </Section>

        <Section id="games" label="made with dotframe">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((g) => (
              <article
                key={g.name}
                className={`group flex flex-col overflow-hidden rounded-md border border-line bg-ink-2 ${g.tall ? "lg:row-span-2" : ""} ${"wide" in g && g.wide ? "lg:col-span-2" : ""}`}
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
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${g.tall ? "aspect-[9/16] lg:aspect-auto lg:h-full object-top" : "aspect-video"}`}
                  />
                </a>
                <div className="flex items-end justify-between gap-4 p-4">
                  <div>
                    <h3 className="font-medium tracking-tight">{g.name}</h3>
                    <p className="mt-1 font-mono text-xs text-mute">{g.kind}</p>
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
        </Section>

        <Section id="badge" label="shipped one?">
          <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr]">
            {/* biome-ignore lint/performance/noImgElement: the badge is the exact SVG games embed */}
            <img
              src="https://raw.githubusercontent.com/crafter-games/dotframe/main/assets/badge/made-with-dotframe-dark.svg"
              alt="Made with dotframe"
              height={32}
              className="h-8 w-auto"
            />
            <div className="min-w-0 rounded-md border border-line bg-ink-2">
              <div className="flex items-center justify-between border-b border-line px-4 py-2">
                <span className="font-mono text-xs text-mute">README.md</span>
                <Copy text={BADGE} label="copy badge" />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-5 text-paper/80">
                {BADGE}
              </pre>
            </div>
          </div>
        </Section>

        <footer className="flex flex-col gap-3 border-t border-line py-10 font-mono text-xs text-mute sm:flex-row sm:justify-between">
          <span className="flex items-center gap-2">
            <Mark className="size-4" /> MIT · made by{" "}
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
