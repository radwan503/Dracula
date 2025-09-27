"use client";

import React, {
  useMemo,
  useRef,
  useLayoutEffect,
  useEffect,
  useState,
} from "react";
import { motion } from "framer-motion";
import { ChevronRight, Crown, Gamepad2, Newspaper, Search } from "lucide-react";

/* =============================== Types & Data =============================== */
type Team = { id: string; name: string; seed: number; color: "blue" | "red" };
type Match = { id: string; a: Team; b: Team; scoreA: number; scoreB: number };
type Round = Match[];

const TEAMS_LEFT: Team[] = [
  { id: "L1", name: "Team Alpha", seed: 1, color: "blue" },
  { id: "L2", name: "Team Beta", seed: 8, color: "red" },
  { id: "L3", name: "Team Pío", seed: 4, color: "blue" },
  { id: "L4", name: "Team B", seed: 5, color: "red" },
  { id: "L5", name: "Team j-1", seed: 2, color: "red" },
  { id: "L6", name: "Team - 1", seed: 7, color: "blue" },
  { id: "L7", name: "Team μ-1", seed: 3, color: "red" },
  { id: "L8", name: "Team - 1", seed: 6, color: "blue" },
];
const TEAMS_RIGHT: Team[] = [
  { id: "R1", name: "Team Beta", seed: 1, color: "red" },
  { id: "R2", name: "Team - 1", seed: 8, color: "blue" },
  { id: "R3", name: "Team Delta", seed: 4, color: "red" },
  { id: "R4", name: "Team - 1", seed: 5, color: "blue" },
  { id: "R5", name: "Team - C", seed: 2, color: "red" },
  { id: "R6", name: "Team - 1", seed: 7, color: "blue" },
  { id: "R7", name: "Team Beta", seed: 3, color: "red" },
  { id: "R8", name: "Teumi - 1", seed: 6, color: "red" },
];

const pairToRound = (teams: Team[], scores: Array<[number, number]>): Round =>
  Array.from({ length: teams.length / 2 }).map((_, i) => {
    const a = teams[i * 2];
    const b = teams[i * 2 + 1];
    const [sa, sb] = scores[i];
    return { id: `${a.id}-${b.id}`, a, b, scoreA: sa, scoreB: sb };
  });

/* Scores that mimic the screenshot */
const LEFT_R1 = pairToRound(TEAMS_LEFT, [[9, 7], [12, 9], [4, 7], [11, 5]]);
const LEFT_R2 = pairToRound(
  LEFT_R1.map((m) => (m.scoreA >= m.scoreB ? m.a : m.b)),
  [[9, 8], [11, 4]]
);
const LEFT_R3 = pairToRound(
  LEFT_R2.map((m) => (m.scoreA >= m.scoreB ? m.a : m.b)),
  [[11, 9]]
);

const RIGHT_R1 = pairToRound(TEAMS_RIGHT, [[3, 11], [2, 9], [10, 5], [5, 11]]);
const RIGHT_R2 = pairToRound(
  RIGHT_R1.map((m) => (m.scoreA >= m.scoreB ? m.a : m.b)),
  [[9, 2], [11, 5]]
);
const RIGHT_R3 = pairToRound(
  RIGHT_R2.map((m) => (m.scoreA >= m.scoreB ? m.a : m.b)),
  [[9, 11]]
);

const GRAND_FINAL: Match = {
  id: "GF",
  a: LEFT_R3[0].scoreA >= LEFT_R3[0].scoreB ? LEFT_R3[0].a : LEFT_R3[0].b,
  b: RIGHT_R3[0].scoreA >= RIGHT_R3[0].scoreB ? RIGHT_R3[0].a : RIGHT_R3[0].b,
  scoreA: 2,
  scoreB: 1,
};

/* ============================ UI Atoms / Styles ============================ */
const neon = {
  blue:
    "from-sky-500/20 to-cyan-400/20 ring-cyan-400/40 shadow-[0_0_24px_rgba(56,189,248,.25)]",
  red:
    "from-rose-500/20 to-red-400/20 ring-rose-400/40 shadow-[0_0_24px_rgba(244,63,94,.25)]",
};

const Card = ({
  title,
  subtitle,
  children,
}: React.PropsWithChildren<{ title: string; subtitle?: string }>) => (
  <div className="rounded-xl bg-[#0e1420]/80 ring-1 ring-white/10 p-4">
    <div className="font-semibold">{title}</div>
    {subtitle && <div className="text-xs text-white/60 mt-0.5">{subtitle}</div>}
    <div className="mt-3">{children}</div>
  </div>
);

type MatchCardProps = {
  m: Match;
  refCb?: (el: HTMLDivElement | null) => void;
  query?: string;
};
const MatchCard: React.FC<MatchCardProps> = ({ m, refCb, query = "" }) => {
  const aWon = m.scoreA >= m.scoreB;
  const bWon = m.scoreB > m.scoreA;
  const q = query.trim().toLowerCase();
  const matches =
    !q || m.a.name.toLowerCase().includes(q) || m.b.name.toLowerCase().includes(q);

  const Row = ({
    name,
    score,
    win,
    color,
  }: {
    name: string;
    score: number;
    win: boolean;
    color: "blue" | "red";
  }) => (
    <div
      className={`relative rounded-lg px-3 py-2 ring-1 text-[12px] flex items-center justify-between gap-3 backdrop-blur-sm ${
        win ? `bg-gradient-to-r ${neon[color]}` : "bg-white/[0.03] ring-white/10"
      } ${matches ? "" : "opacity-40"}`}
    >
      <span className="truncate">{name}</span>
      <span
        className={`text-[11px] px-2 py-0.5 rounded-md ${
          win ? "bg-white/90 text-black" : "bg-white/10"
        }`}
      >
        {score}
      </span>
    </div>
  );

  return (
    <div ref={refCb ?? undefined} className="relative w-[min(70px,88vw)] sm:w-[110px]">
      <Row name={m.a.name} score={m.scoreA} win={aWon} color={m.a.color} />
      <div className="h-1" />
      <Row name={m.b.name} score={m.scoreB} win={bWon} color={m.b.color} />
    </div>
  );
};

/* =============================== Connectors =============================== */
/** Draw smooth SVG lines between rounds by measuring card centers. */
const usePaths = (
  hostRef: React.RefObject<HTMLDivElement | null>,
  fromRefs: React.RefObject<HTMLDivElement | null>[],
  toRefs: React.RefObject<HTMLDivElement | null>[],
  side: "left" | "right"
) => {
  const [paths, setPaths] = useState<string[]>([]);
  const recompute = () => {
    const host = hostRef.current;
    if (!host) return;
    const hb = host.getBoundingClientRect();
    const center = (el: HTMLDivElement | null, edge: "left" | "right") => {
      if (!el) return { x: 0, y: 0 };
      const b = el.getBoundingClientRect();
      const x = edge === "left" ? b.left - hb.left : b.right - hb.left;
      const y = b.top - hb.top + b.height / 2;
      return { x, y };
    };

    const next: string[] = [];
    toRefs.forEach((toRef, j) => {
      const f1 = fromRefs[j * 2]?.current || null;
      const f2 = fromRefs[j * 2 + 1]?.current || null;
      const t = toRef.current || null;
      if (!f1 || !f2 || !t) return;

      const edgeFrom = side === "right" ? "right" : "left";
      const edgeTo = side === "right" ? "left" : "right";

      const p1 = center(f1, edgeFrom);
      const p2 = center(f2, edgeFrom);
      const pt = center(t, edgeTo);

      const dx1 = Math.abs(pt.x - p1.x);
      const dx2 = Math.abs(pt.x - p2.x);
      const c1 = dx1 * 0.6;
      const c2 = dx2 * 0.6;

      const path1 = `M ${p1.x} ${p1.y} C ${p1.x + (side === "right" ? -c1 : c1)} ${
        p1.y
      } ${pt.x - (side === "right" ? -c1 : c1)} ${pt.y} ${pt.x} ${pt.y}`;
      const path2 = `M ${p2.x} ${p2.y} C ${p2.x + (side === "right" ? -c2 : c2)} ${
        p2.y
      } ${pt.x - (side === "right" ? -c2 : c2)} ${pt.y} ${pt.x} ${pt.y}`;
      next.push(path1, path2);
    });
    setPaths(next);
  };

  useLayoutEffect(recompute, [hostRef, fromRefs, toRefs, side]);

  // Update on resize & scroll (and font load/layout changes)
  useEffect(() => {
    const r = () => recompute();
    window.addEventListener("resize", r, { passive: true });
    window.addEventListener("scroll", r, { passive: true });
    const ro = new ResizeObserver(r);
    if (hostRef.current) ro.observe(hostRef.current);
    return () => {
      window.removeEventListener("resize", r);
      window.removeEventListener("scroll", r);
      ro.disconnect();
    };
  }, [hostRef]);

  return paths;
};

// const ConnectorLayer: React.FC<{
//   hostRef: React.RefObject<HTMLDivElement | null>;
//   fromRefs: React.RefObject<HTMLDivElement | null>[];
//   toRefs: React.RefObject<HTMLDivElement | null>[];
//   side: "left" | "right";
//   id: string;
// }> = ({ hostRef, fromRefs, toRefs, side, id }) => {
//   const paths = usePaths(hostRef, fromRefs, toRefs, side);
//   return (
//     <svg className="pointer-events-none absolute inset-0">
//       <defs>
//         <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
//           <stop
//             offset="0%"
//             stopColor={side === "right" ? "#f43f5e" : "#38bdf8"}
//             stopOpacity="0.28"
//           />
//           <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
//         </linearGradient>
//       </defs>
//       {paths.map((d, i) => (
//         <path key={i} d={d} stroke={`url(#${id})`} strokeWidth="1.5" fill="none" />
//       ))}
//     </svg>
//   );
// };

/* ================================== Page ================================== */
export default function TournamentBracket() {
  const [query, setQuery] = useState("");
  const [activeNav, setActiveNav] = useState(0); // cosmetic tabs like mock

  const standings = useMemo(
    () => [
      { team: "Rococoraster", score: "22 - 11" },
      { team: "Azala", score: "12 - 11" },
      { team: "Booster", score: "12 - 21" },
      { team: "Combi Scoal", score: "22 - 11" },
    ],
    []
  );

  /* refs to draw lines */
const hostRef = useRef<HTMLDivElement | null>(null);

const l1Refs = LEFT_R1.map(() => useRef<HTMLDivElement | null>(null));
const l2Refs = LEFT_R2.map(() => useRef<HTMLDivElement | null>(null));
const r1Refs = RIGHT_R1.map(() => useRef<HTMLDivElement | null>(null));
const r2Refs = RIGHT_R2.map(() => useRef<HTMLDivElement | null>(null));

const lfRef = useRef<HTMLDivElement | null>(null);
const rfRef = useRef<HTMLDivElement | null>(null);
const gfRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative  text-white bg-black  py-20 md:py-24 ">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"/>

      <div className="absolute inset-0 -z-10 pointer-events-none opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px)] bg-[length:100%_3px]" />

      {/* Header / nav */}
      <header className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md grid place-items-center bg-gradient-to-tr from-cyan-900/30 to-blue-900/30 ring-1 ring-red-400/30">
            <Gamepad2 className="text-red-300" size={18} />
          </div>
          <span className="text-lg font-bold tracking-wide">JRUPT</span>
          <nav className="hidden md:flex items-center gap-6 text-sm ml-6">
            {["Home", "Tournaments", "Teams", "Players", "Store"].map((n, i) => {
              const active = i === activeNav;
              return (
                <button
                  key={n}
                  onClick={() => setActiveNav(i)}
                  className={`pb-1 ${active ? "text-white" : "text-white/70 hover:text-white"}`}
                >
                  {n}
                  {active && (
                    <motion.span layoutId="nav" className="block h-[2px] bg-white/80 rounded-full mt-1" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teams…"
              className="w-[220px] rounded-lg bg-[#121827] pl-8 pr-3 py-2 text-xs ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60" />
          </div>
          <button className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-sm font-semibold text-black">
            Get Started
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 relative z-50">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mt-2 mb-6">
          Tournament Bracket
        </h2>

        <div className="grid grid-cols-12 gap-6">
          {/* Left sidebar */}
          <aside className="col-span-12 md:col-span-3 space-y-4">
            <Card title="Live Matches">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10">
                  <span>Team Alpha</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10">2 - 1</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10">
                  <span>Woven Alpha</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10">2 - 1</span>
                </div>
              </div>
            </Card>

            <Card title="Upcoming Matches">
              <ul className="space-y-2 text-sm">
                {["Goblin Moone", "Onion Quest", "Moon Head"].map((t) => (
                  <li
                    key={t}
                    className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10"
                  >
                    <span>{t}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10">2 - 1</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Past Winners">
              <div className="text-xs text-white/60">
                2024 — Team - 1
                <br />
                2023 — Team Alpha
              </div>
            </Card>
          </aside>

          {/* Bracket center */}
          <section className="col-span-12 md:col-span-6">
            <div ref={hostRef} className="relative">
              {/* 5 columns like the mock */}
              <div className="grid grid-cols-5 md:gap-x-4 items-center">
                {/* Round 1 (left) */}
                <div className="space-y-8">
                  {LEFT_R1.map((m, i) => (
                    <MatchCard
                      key={m.id}
                      m={m}
                      query={query}
                      refCb={(el) => (l1Refs[i].current = el)}
                    />
                  ))}
                </div>

                {/* Round 2 (left) + Left Final */}
                <div className="relative">
                  <div className="space-y-20 hidden sm:block">
                    {LEFT_R2.map((m, i) => (
                      <MatchCard
                        key={m.id}
                        m={m}
                        query={query}
                        refCb={(el) => (l2Refs[i].current = el)}
                      />
                    ))}
                  </div>
                  {/* Left Final (desktop) */}
                  <div className="hidden sm:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center justify-center">
                    <MatchCard
                      m={LEFT_R3[0]}
                      query={query}
                      refCb={(el) => (lfRef.current = el)}
                    />
                  </div>
                </div>

                {/* Center: logo + Grand Final */}
                <div className="space-y-6 flex flex-col items-center">
                  <motion.div
                    className="h-12 w-28 rounded-xl grid place-items-center bg-gradient-to-r from-cyan-500/20 to-blue-400/20 ring-1 ring-cyan-400/40 text-sm shadow-[0_0_24px_rgba(56,189,248,.25)]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="font-semibold">2 - 1</span>
                  </motion.div>
                  <MatchCard
                    m={GRAND_FINAL}
                    query={query}
                    refCb={(el) => (gfRef.current = el)}
                  />
                </div>

                {/* Round 2 (right) + Right Final */}
                <div className="relative">
                  <div className="space-y-20 hidden sm:block">
                    {RIGHT_R2.map((m, i) => (
                      <MatchCard
                        key={m.id}
                        m={m}
                        query={query}
                        refCb={(el) => (r2Refs[i].current = el)}
                      />
                    ))}
                  </div>
                  {/* Right Final (desktop) */}
                  <div className="hidden sm:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center justify-center">
                    <MatchCard
                      m={RIGHT_R3[0]}
                      query={query}
                      refCb={(el) => (rfRef.current = el)}
                    />
                  </div>
                </div>

                {/* Round 1 (right) */}
                <div className="space-y-8">
                  {RIGHT_R1.map((m, i) => (
                    <MatchCard
                      key={m.id}
                      m={m}
                      query={query}
                      refCb={(el) => (r1Refs[i].current = el)}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile finals below grid */}
              <div className="sm:hidden mt-6 grid grid-cols-2 gap-3">
                <MatchCard m={LEFT_R3[0]} query={query} />
                <MatchCard m={RIGHT_R3[0]} query={query} />
              </div>

              {/* CONNECTORS */}
              {/* Left: R1 → R2 */}
              {/* <ConnectorLayer
                id="line-left-r1-r2"
                hostRef={hostRef}
                fromRefs={l1Refs}
                toRefs={l2Refs}
                side="left"
              /> */}
              {/* Right: R1 → R2 */}
              {/* <ConnectorLayer
                id="line-right-r1-r2"
                hostRef={hostRef}
                fromRefs={r1Refs}
                toRefs={r2Refs}
                side="right"
              /> */}
              {/* Left: R2 → Left Final */}
              {/* <ConnectorLayer
                id="line-left-r2-lfinal"
                hostRef={hostRef}
                fromRefs={l2Refs}
                toRefs={[lfRef]}
                side="left"
              /> */}
              {/* Right: R2 → Right Final */}
              {/* <ConnectorLayer
                id="line-right-r2-rfinal"
                hostRef={hostRef}
                fromRefs={r2Refs}
                toRefs={[rfRef]}
                side="right"
              /> */}
              {/* Finals → Grand Final */}
              {/* <ConnectorLayer
                id="line-leftfinal-gf"
                hostRef={hostRef}
                fromRefs={[lfRef, lfRef]} // duplicate so the util draws 2 legs into GF (symmetry)
                toRefs={[gfRef]}
                side="left"
              /> */}
              
              {/* <ConnectorLayer
                id="line-rightfinal-gf"
                hostRef={hostRef}
                fromRefs={[rfRef, rfRef]}
                toRefs={[gfRef]}
                side="right"
              /> */}
            </div>
          </section>

          {/* Right sidebar */}
          <aside className="col-span-12 md:col-span-3 space-y-4">
            <Card title="Tournament Standings">
              <ul className="text-sm space-y-2">
                {standings.map((s) => (
                  <li
                    key={s.team}
                    className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10"
                  >
                    <span>{s.team}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10">
                      {s.score}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Recent News">
              <div className="space-y-3 text-sm">
                <div className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
                  <div className="flex items-center gap-2 text-white/90">
                    <Newspaper size={16} />
                    Team Name advances
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    Team moves to the next phase due to a 3-way tie in the
                    winners.
                  </p>
                </div>
                <button className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200">
                  More updates <ChevronRight size={14} />
                </button>
              </div>
            </Card>
          </aside>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-white/60 text-xs">
          <Crown size={14} />
          Single-Elimination • Best of 3
        </div>
      </main>
    </div>
  );
}
