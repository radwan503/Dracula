"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Circle, CircleCheck, Plus, Search, User } from "lucide-react";

/* ===================== Types & Mock Data ===================== */
type GameKey = "Valorant" | "League of Legends" | "Apex" | "Fortnite";
type Tournament = {
  id: string;
  game: GameKey;
  title: string;
  startsAt: string;
  teams: number;
  banner: string;
  logo?: string;
  prizePool?: string;
  featured?: boolean;
  my?: boolean;
};

const TOURNAMENTS: Tournament[] = [
  { id: "t1", game: "Valorant", title: "Valorant Open", startsAt: "Start 20S 180V/2012", teams: 32, banner: "/elements/futuristic-ninja-digital-art.jpg", logo: "/elements/vampire.png", prizePool: "$1,500" },
  { id: "t2", game: "League of Legends", title: "League Masters", startsAt: "Start 20S 130V/2022", teams: 64, banner: "/elements/2151624781.jpg", logo: "/elements/2151500487.jpg", prizePool: "$4,000" },
  { id: "t3", game: "Valorant", title: "Valorant Metro", startsAt: "Start 20S 180V/2022", teams: 48, banner: "/elements/2151624782.jpg", logo: "/elements/cartoon-soldier-with-combat-war.jpg", prizePool: "$2,000" },
  { id: "t4", game: "League of Legends", title: "League: Torrends", startsAt: "Start 20S 100V/2013", teams: 16, banner: "/elements/man-wearing-vr-glasses-gaming.jpg", prizePool: "$3,300", featured: true },
  { id: "t5", game: "Apex", title: "Garamont Gorines", startsAt: "Start 20S 100V/2017", teams: 24, banner: "/elements/scary-monster-foggy-forest-night.jpg", prizePool: "$8,700", featured: true },
];

type Winner = { id: string; name: string; handle: string; avatar: string };
const WINNERS: Winner[] = [
  { id: "w1", name: "Moritz", handle: "@Goaramant", avatar: "/elements/vampire.png" },
  { id: "w2", name: "Glaries", handle: "Tournament", avatar: "/elements/bat_5922341.png" },
  { id: "w3", name: "Gleres", handle: "Tournament", avatar: "/elements/2151624781.jpg" },
  { id: "w4", name: "Glawes", handle: "Tournament", avatar: "/elements/2151624782.jpg" },
];

/* ===================== UI Bits ===================== */
const Card = ({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) => (
  <div className={`rounded-xl bg-[#150d12] ring-1 ring-white/10 ${className}`}>{children}</div>
);

const pulseVariants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

/* ===================== Create Tournament Modal ===================== */
function CreateModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (t: Tournament) => void;
}) {
  const [title, setTitle] = useState("");
  const [game, setGame] = useState<GameKey>("Valorant");
  const [date, setDate] = useState("Start 20S 100V/2025");

  const submit = () => {
    if (!title.trim()) return;
    onCreate({
      id: crypto.randomUUID(),
      title,
      game,
      startsAt: date,
      teams: 0,
      banner: "/elements/2151624782.jpg",
      prizePool: "$500",
      my: true,
    });
    setTitle(""); onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div role="dialog" aria-modal="true" className="fixed inset-0 z-[999] grid place-items-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="w-full max-w-md rounded-2xl bg-[#120b10] ring-1 ring-white/10 p-5"
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}>
            <h3 className="text-lg font-semibold">Create Tournament</h3>
            <p className="text-sm text-white/70 mb-4">Add a quick tournament (local mock only).</p>

            <label className="block text-sm mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-3 rounded-lg bg-[#1b1117] px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-red-400" placeholder="e.g., Weekend Clash" />

            <label className="block text-sm mb-1">Game</label>
            <select value={game} onChange={(e) => setGame(e.target.value as GameKey)}
              className="w-full mb-3 rounded-lg bg-[#1b1117] px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-red-400">
              {["Valorant", "League of Legends", "Apex", "Fortnite"].map((g) => (
                <option key={g} value={g as GameKey}>{g}</option>
              ))}
            </select>

            <label className="block text-sm mb-1">Starts At</label>
            <input value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full mb-5 rounded-lg bg-[#1b1117] px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-red-400" />

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Cancel</button>
              <button onClick={submit} className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-black text-sm font-semibold">Create</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ===================== Main ===================== */
export default function TournamentHub() {
  const [tab, setTab] = useState<"all" | "mine" | "create" | "rules">("all");
  const [query, setQuery] = useState("");
  const [joined, setJoined] = useState<Record<string, boolean>>({});
  const [items, setItems] = useState<Tournament[]>(TOURNAMENTS);
  const [openCreate, setOpenCreate] = useState(false);
  const backgroundUrl = "/elements/view-illuminated-neon-gaming-keyboard-setup-controller_23-2149529367.jpg"

  const filtered = useMemo(() => {
    const base = tab === "mine" ? items.filter((t) => t.my) : items;
    return base.filter(
      (t) => t.title.toLowerCase().includes(query.toLowerCase()) || t.game.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, tab, query]);

  const activeList = filtered.filter((t) => !t.featured).slice(0, 3);
  const featuredMain = filtered.find((t) => t.featured && /league/i.test(t.title)) ?? filtered.find((t) => t.featured) ?? null;
  const featuredBanner = filtered.find((t) => t.featured && t.id !== featuredMain?.id) ?? null;

  const toggleJoin = (id: string) => setJoined((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div id="Tournament" className="relative  text-white bg-black px-4 sm:px-6 py-20 md:py-24 ">
      {/* RED / BLACK BACKGROUND */}
      <div
        className="absolute inset-0 z-10"
        
        style={{
          // 1) Put the IMAGE FIRST so it renders on top of subsequent blends
          // 2) Then the radial red glow, then the dark conic wash
            backgroundImage: backgroundUrl
              ? `url(${backgroundUrl}), radial-gradient(1200px 700px at 60% 20%, rgba(239,68,68,0.30), transparent 100%), conic-gradient(from 220deg at 70% 30%, #1a0b0b 0%, #160707 30%, #0b0505 60%, #000 100%)`
              : `radial-gradient(1200px 700px at 60% 20%, rgba(239,68,68,0.30), transparent 60%), conic-gradient(from 220deg at 70% 30%, #1a0b0b 0%, #160707 30%, #0b0505 60%, #000 100%)`,
            backgroundSize: backgroundUrl ? "cover, 100% 100%, 100% 100%" : "100% 100%, 100% 100%",
            backgroundPosition: "center, center, center",
            backgroundRepeat: "no-repeat, no-repeat, no-repeat",
            // Blend so the photo takes on the red theme but stays visible
           //backgroundBlendMode: backgroundUrl ? "overlay, normal, normal" : "normal, normal",
            // Optional extra styling on the image
            filter: backgroundUrl ? "grayscale(50%) contrast(1)" : undefined,
            opacity: .1,
          }}
      />
      <div className="absolute inset-0 -z-20 pointer-events-none opacity-[0.07] bg-[linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px)] bg-[length:100%_3px]" />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="relative">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">TOURNAMENT HUB</h1>
            <img src="/elements/bat.png" alt="me" className="hidden sm:block w-9 h-9 rounded-full ring-1 ring-white/20" />
          </div>

          {/* Tabs */}
          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
            {[
              { k: "all", label: "All Tournaments" },
              { k: "mine", label: "My Tournaments" },
              { k: "create", label: "Create Tournament" },
              { k: "rules", label: "Rules" },
            ].map(({ k, label }) => {
              const active = tab === (k as any);
              return (
                <button
                  key={k}
                  onClick={() => {
                    if (k === "create") return setOpenCreate(true);
                    setTab(k as any);
                  }}
                  className={`relative pb-2 transition ${active ? "text-red-300" : "text-white/80 hover:text-white"}`}
                >
                  {label}
                  {active && (
                    <motion.span layoutId="underline" className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-red-400 rounded-full" />
                  )}
                </button>
              );
            })}
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="w-[180px] sm:w-[220px] rounded-lg bg-[#1a1014] pl-8 pr-3 py-2 text-xs ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-white/50" size={16} />
              </div>
              <button className="p-2 rounded-md bg-white/5 hover:bg-white/10"><User size={16} /></button>
              <button onClick={() => setOpenCreate(true)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-black text-xs font-semibold">
                <Plus size={14} /> New
              </button>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="mt-6 grid grid-cols-12 gap-6">
          {/* Left: Active list */}
          <section className="col-span-12 md:col-span-5 space-y-4">
            <h2 className="text-lg font-semibold">Active Active</h2>

            {activeList.length === 0 ? (
              <Card className="p-6 text-center text-sm text-white/70">
                {tab === "mine" ? (
                  <>
                    You haven’t joined any tournaments yet.
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <button onClick={() => setOpenCreate(true)} className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-black text-sm font-semibold">Create Tournament</button>
                      <button onClick={() => setTab("all")} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Browse All</button>
                    </div>
                  </>
                ) : (
                  "No tournaments match your search."
                )}
              </Card>
            ) : (
              activeList.map((t) => (
                <motion.div key={t.id} variants={pulseVariants} initial="hidden" animate="show"
                  className="rounded-xl ring-1 ring-white/10 bg-[#150d12] p-3 sm:p-4 flex items-center gap-3">
                  <img src={t.banner} alt={t.title} className="w-16 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{t.game}</p>
                    <p className="text-[11px] text-white/70">{t.startsAt}</p>
                    <p className="text-[11px] text-white/60">teams {String(t.teams).padStart(2, "0")}</p>
                  </div>
                  {t.logo && <img src={t.logo} className="hidden sm:block w-9 h-9 rounded-md object-cover opacity-80" alt="" />}
                  <button
                    onClick={() => toggleJoin(t.id)}
                    className={`ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                      joined[t.id] ? "bg-red-600 text-black" : "bg-red-500 hover:bg-red-400 text-black"
                    }`}
                  >
                    {joined[t.id] ? (<><CircleCheck size={16} /> Joined</>) : (<><Circle size={16} /> Join</>)}
                  </button>
                </motion.div>
              ))
            )}
          </section>

          {/* Middle: big card */}
          <section className="col-span-12 md:col-span-4 space-y-4">
            <h2 className="text-lg font-semibold invisible md:visible md:h-6">_</h2>

            {featuredMain ? (
              <Card className="p-0 overflow-hidden">
                <div className="relative">
                  <img src={featuredMain.banner} className="w-full h-40 object-cover" alt={featuredMain.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-4 right-4 bottom-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{featuredMain.title}</h3>
                      <span className="inline-flex items-center gap-1 text-xs text-white/80">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`w-1.5 h-1.5 rounded-full ${i < 4 ? "bg-red-400" : "bg-white/30"}`} />
                        ))}
                      </span>
                    </div>
                    <p className="text-[12px] text-white/80">{featuredMain.startsAt}</p>
                    <div className="mt-2 flex justify-end">
                      <button onClick={() => toggleJoin(featuredMain.id)} className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-black text-sm font-semibold">
                        {joined[featuredMain.id] ? "Joined" : "Join"}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center text-sm text-white/70">No featured tournament here yet.</Card>
            )}

            <Card className="p-3 flex items-center gap-3">
              <img src="/elements/2151500487.jpg" className="w-14 h-12 object-cover rounded-lg" alt="" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">Geaple Wriors</p>
                <p className="text-[11px] text-white/70">Start 20S 100V/2017 • 0mes 01</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-black text-sm font-semibold">Join</button>
            </Card>
          </section>

          {/* Right: featured banner + winners */}
          <aside className="col-span-12 md:col-span-3 space-y-5">
            <div>
              <h3 className="text-lg font-semibold">Featured Tournament</h3>
              {featuredBanner ? (
                <Card className="overflow-hidden mt-2">
                  <img src={featuredBanner.banner} className="w-full h-24 object-cover" alt="Featured banner" />
                  <div className="p-3">
                    <p className="font-semibold truncate">{featuredBanner.title}</p>
                    <p className="text-[12px] text-white/70 leading-relaxed">
                      Valorant eiriumt dsopierte • tree poolings tournet Plant.
                    </p>
                    <div className="mt-2 text-[12px] text-white/80 grid grid-cols-2 gap-y-1">
                      <span>Prize Pool</span>
                      <span className="text-right font-semibold">{featuredBanner.prizePool ?? "$6,700"}</span>
                      <span>Roo</span>
                      <span className="text-right">$870 pool</span>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-black text-sm font-semibold">
                        View Details <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="mt-2 p-6 text-center text-sm text-white/70">No featured banner available.</Card>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold">Recent Winners</h3>
              <div className="mt-3 flex items-center gap-4">
                {WINNERS.map((w, i) => (
                  <div key={w.id} className="text-center">
                    <div className={`relative mx-auto w-12 h-12 rounded-full ring-2 ${i === 0 ? "ring-red-400" : "ring-white/20"}`}>
                      <img src={w.avatar} alt={w.name} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <p className="mt-1 text-[12px] font-medium">{w.name}</p>
                    <p className="text-[11px] text-white/60">{w.handle}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Create modal */}
      <CreateModal open={openCreate} onClose={() => setOpenCreate(false)} onCreate={(t) => setItems((prev) => [t, ...prev])} />
    </div>
  );
}
