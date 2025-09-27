"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Gamepad2,
  Search,
  Users,
  Star,
  ShieldCheck,
  ArrowUpAZ,
  ArrowDownAZ,
  Heart,
  X,
  Plus,
  Menu,
  Sparkles,
  Command,
  LayoutGrid,
  Bell,
  Sun,
  Moon,
} from "lucide-react";

/* ============================= Mock Data ============================= */
type Member = {
  id: string;
  name: string;
  avatar: string;
  color: "green" | "blue" | "yellow" | "orange";
};
type Clan = {
  id: string;
  name: string;
  desc: string;
  badge: string;
  cover: string;
  power: number; // 0 - 100
  active: boolean;
  members: number;
};

const MEMBERS: Member[] = [
  { id: "m1", name: "Grew", avatar: "elements/2151624781.jpg", color: "green" },
  { id: "m2", name: "Oven", avatar: "elements/2151624782.jpg", color: "yellow" },
  { id: "m3", name: "Plect", avatar: "elements/vampire.png", color: "blue" },
  { id: "m4", name: "Mowin", avatar: "elements/cartoon-soldier-with-combat-war.jpg", color: "orange" },
  { id: "m5", name: "Gerot", avatar: "elements/man-wearing-vr-glasses-gaming.jpg", color: "green" },
];

const INITIAL_CLANS: Clan[] = [
  {
    id: "c1",
    name: "Kativ Oriens",
    desc: "Esports crew • coordinated",
    badge: "elements/bat_5922341.png",
    cover: "elements/futuristic-ninja-digital-art.jpg",
    power: 56,
    active: true,
    members: 38,
  },
  {
    id: "c2",
    name: "Bongie Ulrates",
    desc: "Rogue unit • offense",
    badge: "elements/bat.png",
    cover: "elements/2151500487.jpg",
    power: 58,
    active: true,
    members: 22,
  },
  {
    id: "c3",
    name: "Siarro Clan",
    desc: "Strong & close defenders",
    badge: "elements/vampire.png",
    cover: "elements/scary-monster-foggy-forest-night.jpg",
    power: 67,
    active: false,
    members: 41,
  },
  {
    id: "c4",
    name: "Nebula Forge",
    desc: "Tactical masterminds",
    badge: "elements/2151624782.jpg",
    cover: "elements/man-wearing-vr-glasses-gaming.jpg",
    power: 73,
    active: true,
    members: 51,
  },
];

type Log = {
  id: string;
  event: string;
  source: string;
  destination: string;
  status: "Clean" | "Excluded" | "Boost" | "Claimed";
};

const LOGS: Log[] = [
  { id: "l1", event: "FroerNector Clan", source: "Devote", destination: "Devote", status: "Clean" },
  { id: "l2", event: "Core Upload", source: "Crosscore", destination: "Elastics", status: "Excluded" },
  { id: "l3", event: "Baseoat", source: "Gateway", destination: "Masses", status: "Boost" },
  { id: "l4", event: "Grant Ops", source: "Node", destination: "Outliers", status: "Claimed" },
];

/* ============================ Small UI Bits ============================ */
const neonPanel =
  "rounded-2xl bg-[#0e111a]/80 ring-1 ring-white/10 shadow-[0_0_40px_rgba(244,63,94,.10)]";

const Section: React.FC<
  React.PropsWithChildren<{ title: string; right?: React.ReactNode; className?: string }>
> = ({ title, right, children, className = "" }) => (
  <div className={`${neonPanel} p-4 ${className}`}>
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold">{title}</h3>
      {right}
    </div>
    {children}
  </div>
);

const Chip: React.FC<{ children: React.ReactNode; active?: boolean; onClick?: () => void }> = ({
  children,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs ring-1 transition ${
      active
        ? "bg-rose-500/20 text-rose-200 ring-rose-400/40"
        : "ring-white/10 text-white/80 hover:bg-white/5"
    }`}
  >
    {children}
  </button>
);

const Progress: React.FC<{ value: number }> = ({ value }) => (
  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-rose-400 to-red-500"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

/* ============================ Join Modal ============================ */
const JoinModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onCreate: (c: Clan) => void;
}> = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("Community-first squad");
  const submit = () => {
    if (!name.trim()) return;
    onCreate({
      id: crypto.randomUUID(),
      name,
      desc,
      badge: "elements/bat.png",
      cover: "elements/2151500487.jpg",
      power: Math.floor(40 + Math.random() * 50),
      active: true,
      members: Math.floor(15 + Math.random() * 60),
    });
    setName("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999] grid place-items-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-[#0f121c] ring-1 ring-white/10 p-5"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Create / Join a Clan</h3>
              <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-white/70 mb-4">Quickly add a clan to this list (local mock).</p>
            <label className="block text-sm mb-1">Clan name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 rounded-lg bg-[#151a26] px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-rose-400"
              placeholder="e.g., Crimson Vanguard"
            />
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="w-full mb-4 rounded-lg bg-[#151a26] px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm">
                Cancel
              </button>
              <button
                onClick={submit}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-black text-sm font-semibold"
              >
                <Plus size={16} /> Add Clan
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ============================ Main Component ============================ */
export default function JoinClansDashboard() {
  const [tab, setTab] = useState<"home" | "tournaments" | "teams" | "players" | "store">("home");
  const [filter, setFilter] = useState<"all" | "active" | "featured">("all");
  const [q, setQ] = useState("");
  const [asc, setAsc] = useState(true);
  const [sortKey, setSortKey] = useState<"name" | "power" | "members">("power");
  const [clans, setClans] = useState<Clan[]>(INITIAL_CLANS);

  const [claimed, setClaimed] = useState<Record<string, boolean>>({});
  const [fav, setFav] = useState<Record<string, boolean>>({});
  const [openJoin, setOpenJoin] = useState(false);

  const backgroundUrl = "elements/front-view-ninja-wearing-equipment_23-2150960894.jpg"


  const sorted = useMemo(() => {
    let base = clans.filter((c) => (c.name + c.desc).toLowerCase().includes(q.toLowerCase()));
    if (filter === "active") base = base.filter((c) => c.active);
    if (filter === "featured") base = base.filter((c) => c.power >= 60);

    base.sort((a, b) => {
      const dir = asc ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
      if (sortKey === "power") return (a.power - b.power) * dir;
      return (a.members - b.members) * dir;
    });
    return base;
  }, [q, filter, asc, sortKey, clans]);

  const toggleClaim = (id: string) => setClaimed((s) => ({ ...s, [id]: !s[id] }));
  const toggleFav = (id: string) => setFav((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div id="Clans" className="relative  text-white bg-black py-20 md:py-24">
      {/* BG image + deep red glows + scanline */}
      <div className="absolute inset-0 -z-30 bg-[url('/elements/scary-monster-foggy-forest-night.jpg')] bg-cover bg-center" />
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
            filter: backgroundUrl ? "grayscale(0%) contrast(1)" : undefined,
            opacity: .1,
          }}
      />
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,.10)_1px,transparent_1px)] bg-[length:100%_3px]" />

      {/* Header / navbar */}
      {/* ===== New Header (content-rich, responsive) ===== */}
        <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            {/* Left: brand + burger (mobile) */}
            <button
            className="md:hidden p-2 rounded-lg bg-white/5 ring-1 ring-white/10"
            aria-label="Open menu"
            onClick={() => setOpenJoin((o) => o)} // keep modal state intact; drawer lives below
            >
            <Menu size={18} />
            </button>

            <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl grid place-items-center bg-gradient-to-tr from-rose-500/30 to-red-400/20 ring-1 ring-rose-300/30 shadow-[0_0_24px_rgba(244,63,94,.25)]">
                <Gamepad2 size={18} className="text-rose-300" />
            </div>
            <div>
                <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-wide">VRANT</span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 ring-1 ring-rose-400/30">
                    <Sparkles size={12} /> live
                </span>
                </div>
                <p className="hidden sm:block text-[11px] text-white/60 -mt-0.5">
                Competitive clans • events • scrims
                </p>
            </div>
            </div>

            {/* Center: command bar search (desktop) */}
            <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="relative w-full max-w-[520px]">
                <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search clans, players, tournaments…"
                className="w-full rounded-xl bg-[#0f121c]/90 pl-10 pr-24 py-2.5 text-sm ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="hidden lg:inline text-[11px] text-white/50">Press</span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-white/5 ring-1 ring-white/10">
                    <Command size={12} /> K
                </span>
                </div>
            </div>
            </div>

            {/* Right: quick actions */}
            <div className="ml-auto flex items-center gap-2">
            <button className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-sm">
                <LayoutGrid size={16} /> Explore
            </button>
            <button className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10" aria-label="Notifications">
                <Bell size={16} />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-[10px] grid place-items-center">
                3
                </span>
            </button>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10" aria-label="Theme">
                {/* dumb toggle icon for demo; hook to your theme if you have one */}
                <Sun size={16} className="hidden dark:block" />
                <Moon size={16} className="block dark:hidden" />
            </button>
            {/* Mobile search */}
            <button
                className="md:hidden p-2 rounded-lg bg-white/5 ring-1 ring-white/10"
                onClick={() => {
                const input = document.querySelector<HTMLInputElement>('input[placeholder^="Search clans"]');
                input?.focus();
                }}
                aria-label="Search"
            >
                <Search size={16} />
            </button>
            {/* Primary CTA */}
            <button
                onClick={() => setOpenJoin(true)}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-sm font-semibold text-black"
            >
                Join Clan
            </button>
            {/* Avatar */}
            <img
                src="elements/2151624782.jpg"
                alt="you"
                className="ml-1 h-9 w-9 rounded-full object-cover ring-1 ring-white/20"
            />
            </div>
        </div>

        {/* Sub-toolbar: tabs + live stats (scrollable on mobile) */}
        <div className="border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            {/* Tabs */}
            <div className="flex items-center gap-4 overflow-hidden">
                {(["home", "tournaments", "teams", "players", "store"] as const).map((k) => (
                <button
                    key={k}
                    onClick={() => setTab(k)}
                    className={`relative pb-2 capitalize text-sm whitespace-nowrap ${
                    tab === k ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                >
                    {k}
                    {tab === k && (
                    <motion.span
                        layoutId="underline-main"
                        className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-rose-400 rounded-full"
                    />
                    )}
                </button>
                ))}
            </div>

            {/* Stats pills */}
            <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 text-[11px] px-2.5 py-1 rounded-full bg-white/5 ring-1 ring-white/10">
                <span className="h-2 w-2 rounded-full bg-rose-400" /> 1,284 online
                </span>
                <span className="hidden sm:inline-flex items-center gap-2 text-[11px] px-2.5 py-1 rounded-full bg-white/5 ring-1 ring-white/10">
                🏆 82 active clans
                </span>
                <span className="hidden lg:inline-flex items-center gap-2 text-[11px] px-2.5 py-1 rounded-full bg-white/5 ring-1 ring-white/10">
                ⚡ scrims tonight
                </span>
            </div>
            </div>
        </div>
        </header>


      <main className="max-w-7xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-12 gap-6">
          {/* ================= Left Column ================= */}
          <div className="col-span-12 md:col-span-4 space-y-4">
            <Section
              title="Rk.Std.Info"
              right={
                <span className="inline-flex items-center gap-1 text-xs text-white/70">
                  Overview <ChevronDown size={14} />
                </span>
              }
            >
              <div className="flex items-center gap-2 text-xs">
                <Chip active>Overview</Chip>
                <Chip>Team</Chip>
                <Chip>Admins</Chip>
              </div>
            </Section>

            <Section title="Economic Status">
              <div className="text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">Vault</span>
                  <span className="font-semibold">$25,000</span>
                </div>
                <Progress value={62} />
              </div>
            </Section>

            <Section title="Fitch.Noons">
              <p className="text-xs text-white/60">No notices to show.</p>
            </Section>

            <Section title="Active Clans">
              <div className="space-y-3">
                {clans.slice(0, 2).map((c) => (
                  <motion.div
                    key={c.id}
                    whileHover={{ y: -2 }}
                    className="rounded-xl bg-[#10131f]/90 ring-1 ring-white/10 p-3 flex items-center gap-3"
                  >
                    <img src={c.badge} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{c.name}</p>
                      <p className="text-[11px] text-white/60 truncate">{c.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleClaim(c.id)}
                      className={`px-3 py-1.5 rounded-lg text-black text-xs font-semibold ${
                        claimed[c.id]
                          ? "bg-rose-600"
                          : "bg-rose-500 hover:bg-rose-400"
                      }`}
                    >
                      {claimed[c.id] ? "Claimed" : "Claim"}
                    </button>
                  </motion.div>
                ))}
              </div>
            </Section>
          </div>

          {/* ================= Center Column ================= */}
          <div className="col-span-12 md:col-span-5 space-y-4">
            <Section title="FERTSB CLANS">
              <div className="grid grid-cols-5 gap-3">
                {MEMBERS.map((m) => (
                  <div key={m.id} className="rounded-xl bg-[#10131f]/90 ring-1 ring-white/10 p-2 text-center">
                    <div className="relative mx-auto w-14 h-14">
                      <img src={m.avatar} className="w-14 h-14 rounded-lg object-cover" alt={m.name} />
                      <span
                        className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full ring-2 ring-[#10131f] ${
                          m.color === "green"
                            ? "bg-emerald-400"
                            : m.color === "blue"
                            ? "bg-sky-400"
                            : m.color === "yellow"
                            ? "bg-amber-400"
                            : "bg-orange-400"
                        }`}
                      />
                    </div>
                    <p className="mt-1 text-xs font-medium truncate">{m.name}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              title="FEATURED CLANS"
              right={
                <div className="flex items-center gap-1 text-xs">
                  <button onClick={() => setSortKey("name")} className={sortKey === "name" ? "text-white" : "text-white/60"}>
                    Name
                  </button>
                  <span className="text-white/20">•</span>
                  <button onClick={() => setSortKey("power")} className={sortKey === "power" ? "text-white" : "text-white/60"}>
                    Power
                  </button>
                  <span className="text-white/20">•</span>
                  <button
                    onClick={() => setSortKey("members")}
                    className={sortKey === "members" ? "text-white" : "text-white/60"}
                  >
                    Members
                  </button>
                  <button onClick={() => setAsc((v) => !v)} className="ml-2">
                    {asc ? <ArrowDownAZ size={16} /> : <ArrowUpAZ size={16} />}
                  </button>
                </div>
              }
            >
              <div className="mb-3 flex items-center gap-2">
                <Chip active={filter === "all"} onClick={() => setFilter("all")}>
                  All
                </Chip>
                <Chip active={filter === "active"} onClick={() => setFilter("active")}>
                  Active
                </Chip>
                <Chip active={filter === "featured"} onClick={() => setFilter("featured")}>
                  Featured
                </Chip>
              </div>

              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {sorted.map((c) => (
                    <motion.div
                      key={c.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-xl bg-[#10131f]/90 ring-1 ring-white/10 p-3 flex gap-3 items-center"
                    >
                      <img src={c.cover} alt="" className="w-16 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold truncate">{c.name}</p>
                          {c.active && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 ring-1 ring-rose-400/30">
                              <ShieldCheck size={12} /> Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/60 truncate">{c.desc}</p>
                        <div className="mt-2 space-y-1">
                          <Progress value={c.power} />
                          <div className="flex items-center justify-between text-[11px] text-white/60">
                            <span>
                              Power: <b className="text-white/80">{c.power}%</b>
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Users size={12} /> {c.members}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={() => toggleFav(c.id)}
                          title={fav[c.id] ? "Unfavorite" : "Favorite"}
                          className={`p-2 rounded-lg ring-1 ${
                            fav[c.id]
                              ? "bg-rose-500/20 ring-rose-400/40 text-rose-200"
                              : "bg-white/5 ring-white/10 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          <Star size={16} className={fav[c.id] ? "fill-current" : ""} />
                        </motion.button>

                        <button
                          onClick={() => toggleClaim(c.id)}
                          className={`px-3 py-1.5 rounded-lg text-black text-xs font-semibold ${
                            claimed[c.id]
                              ? "bg-rose-600"
                              : "bg-rose-500 hover:bg-rose-400"
                          }`}
                        >
                          {claimed[c.id] ? "Claimed" : "Claim"}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Section>
          </div>

          {/* ================= Right Column ================= */}
          <div className="col-span-12 md:col-span-3 space-y-4">
            <Section title="Promoted Clans">
              <div className="rounded-xl overflow-hidden ring-1 ring-white/10">
                <img
                  src="elements/man-wearing-vr-glasses-gaming.jpg"
                  className="w-full h-28 object-cover"
                  alt="Promo"
                />
              </div>
              <p className="text-xs text-white/70 mt-2">
                Coordinate newcomers & veterans. Build pressure systems for tournament benefits.
              </p>
              <button
                onClick={() => setOpenJoin(true)}
                className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-black text-sm font-semibold"
              >
                Join Clans <ChevronRight size={16} />
              </button>
            </Section>

            <Section title="Recent Activity">
              <div className="rounded-xl overflow-hidden ring-1 ring-white/10">
                <div className="grid grid-cols-4 bg-white/5 text-[11px] font-medium px-3 py-2">
                  <span>Event</span>
                  <span>Source</span>
                  <span>Destination</span>
                  <span className="text-right">Status</span>
                </div>
                <div className="divide-y divide-white/10 text-[11px]">
                  {LOGS.map((l) => (
                    <div key={l.id} className="grid grid-cols-4 px-3 py-2 items-center">
                      <span className="truncate">{l.event}</span>
                      <span className="truncate">{l.source}</span>
                      <span className="truncate">{l.destination}</span>
                      <span className="text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            l.status === "Clean"
                              ? "bg-sky-500/20 text-sky-200"
                              : l.status === "Excluded"
                              ? "bg-rose-500/20 text-rose-200"
                              : l.status === "Boost"
                              ? "bg-violet-500/20 text-violet-200"
                              : "bg-emerald-500/20 text-emerald-200"
                          }`}
                        >
                          {l.status}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-8 flex items-center justify-center gap-2 text-white/60 text-xs">
          <Heart size={14} />
          Crafted for competitive clan management — red edition.
        </div>
      </main>

      {/* Join / Create modal */}
      <JoinModal
        open={openJoin}
        onClose={() => setOpenJoin(false)}
        onCreate={(c) => setClans((prev) => [c, ...prev])}
      />
    </div>
  );
}
