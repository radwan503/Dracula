"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Star,
  Sparkles,
} from "lucide-react";

/* =============================== Data =============================== */
type Featured = { id: string; title: string; subtitle?: string; cta: string; image: string };
const FEATURED: Featured[] = [
  { id: "f1", title: "New and Feane Games", subtitle: "Legendary Mafia", cta: "Download Now", image: "/elements/2151624781.jpg" },
  { id: "f2", title: "Erigige Britte", subtitle: "Limited time", cta: "Learn More", image: "/elements/2151624782.jpg" },
  { id: "f3", title: "New Featured Games", subtitle: "Premium picks", cta: "Learn More", image: "/elements/man-wearing-vr-glasses-gaming.jpg" },
  { id: "f4", title: "Greotofine", subtitle: "Adventure Genre", cta: "Learn More", image: "/elements/cartoon-soldier-with-combat-war.jpg" },
  { id: "f5", title: "OVINCE", subtitle: "", cta: "Download", image: "/elements/futuristic-ninja-digital-art.jpg" },
];

type Game = {
  id: string;
  title: string;
  cover: string;
  rating: number;
  tag?: string;
  genre: "Action" | "Adventure" | "RPG" | "Strategy" | "Indie" | "Multiplayer";
};
const GAMES: Game[] = [
  { id: "g1", title: "JAPFICN • Fow Voithip", cover: "/elements/2151500487.jpg", rating: 4.6, tag: "On Sale", genre: "Action" },
  { id: "g2", title: "MOSCHICS • Min Semars", cover: "/elements/man-racing-dirt-bike-fantasy-environment.jpg", rating: 4.4, tag: "Editor’s Pick", genre: "RPG" },
  { id: "g3", title: "MOSHICS • Tochtur", cover: "/elements/man-wearing-vr-glasses-gaming.jpg", rating: 4.7, tag: "New", genre: "Strategy" },
  { id: "g4", title: "Phehe Detip", cover: "/elements/futuristic-ninja-digital-art.jpg", rating: 4.2, tag: "Learn More", genre: "Adventure" },
  { id: "g5", title: "NIRVAD • Einds Winler", cover: "/elements/scary-monster-foggy-forest-night.jpg", rating: 4.8, tag: "Season 3", genre: "Multiplayer" },
  { id: "g6", title: "Caw Andeus", cover: "/elements/cartoon-soldier-with-combat-war.jpg", rating: 4.1, genre: "Action" },
  { id: "g7", title: "John Andrew", cover: "/elements/2151624781.jpg", rating: 4.1, genre: "Action" },
  { id: "g8", title: "Void Raider", cover: "/elements/2151624782.jpg", rating: 4.5, genre: "Indie" },
  { id: "g9", title: "City Breaker", cover: "/elements/cartoon-soldier-with-combat-war.jpg", rating: 4.0, genre: "RPG" },
  { id: "g10", title: "City Breaker", cover: "/elements/scary-monster-foggy-forest-night.jpg", rating: 4.0, genre: "Action" },
];

const GENRES = ["Action", "Adventure", "RPG", "Strategy", "Indie", "Multiplayer"] as const;
type Genre = (typeof GENRES)[number];

/* =============================== UI utils =============================== */
const chipBase =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ring-1 transition";

const cardVariants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

function RedButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1 rounded-full bg-red-500 hover:bg-red-400 text-black text-xs font-semibold px-3 py-1.5 ${className}`}
    >
      {children}
    </button>
  );
}

/* =============================== GameCard =============================== */
function GameCard({ g }: { g: Game }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -3 }}
      className="group rounded-xl overflow-hidden ring-1 ring-white/5 bg-[#010108] hover:ring-red-400/40 transition"
    >
      <div className="relative">
        <img src={g.cover} alt={g.title} className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {g.tag && (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 text-black text-[10px] font-semibold px-2 py-0.5">
            {g.tag}
          </span>
        )}
      </div>
      <div className="p-3">
        <p title={g.title} className="font-semibold leading-tight" style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical"
        }}>{g.title}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-white/70">⭐ {g.rating.toFixed(1)}</span>
          <RedButton>Details</RedButton>
        </div>
      </div>
    </motion.div>
  );
}

/* ====================== Compact slider for categories ====================== */
function RowSlider({ items }: { items: Game[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const to = (i: number) => {
    const node = ref.current;
    const el = node?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const onScroll = () => {
      const children = Array.from(node.children) as HTMLElement[];
      const mid = node.scrollLeft + node.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      children.forEach((el, i) => {
        const c = el.offsetLeft + el.clientWidth / 2;
        const d = Math.abs(c - mid);
        if (d < bestD) (bestD = d), (best = i);
      });
      setIdx(best);
    };
    onScroll();
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, [items.length]);

  return (
    <div className="relative">
      <div
        ref={ref}
        className="scroll-smooth flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide"
        style={{ maskImage: "linear-gradient(90deg, transparent 0, black 6%, black 94%, transparent 100%)" }}
      >
        {items.map((g) => (
          <div
            key={g.id}
            className="snap-center shrink-0 w-[78%] sm:w-[52%] md:w-[40%] lg:w-[31%] xl:w-[28%]"
          >
            <GameCard g={g} />
          </div>
        ))}
      </div>

      {/* arrows */}
      <button
        onClick={() => to(Math.max(0, idx - 1))}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/70 ring-1 ring-white/10"
        aria-label="Previous"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => to(Math.min(items.length - 1, idx + 1))}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/70 ring-1 ring-white/10"
        aria-label="Next"
      >
        <ChevronRight size={16} />
      </button>

      {/* dots */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-red-500" : "w-2 bg-white/30"}`} />
        ))}
      </div>
    </div>
  );
}

/* =============================== Coverflow (featured) =============================== */
function Coverflow({ items }: { items: Featured[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(2);

  const snapTo = (i: number) => {
    const node = ref.current;
    const el = node?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const onScroll = () => {
      const children = Array.from(node.children) as HTMLElement[];
      const mid = node.scrollLeft + node.clientWidth / 2;
      let best = 0,
        bestD = Infinity;
      children.forEach((el, i) => {
        const c = el.offsetLeft + el.clientWidth / 2;
        const d = Math.abs(c - mid);
        if (d < bestD) (bestD = d), (best = i);
      });
      setIndex(best);
    };
    onScroll();
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative">
      <div
        ref={ref}
        className="scroll-smooth flex gap-4 overflow-x-auto pb-2 pt-5 px-0 md:px-0 snap-x snap-mandatory scrollbar-hide"
        style={{ maskImage: "linear-gradient(90deg, transparent 0, black 7%, black 93%, transparent 100%)" }}
      >
        {items.map((f, i) => {
          const isCenter = i === index;
          return (
            <motion.div
              key={f.id}
              layout
              className="snap-center relative shrink-0 w-[78%] xs:w-[58%] sm:w-[46%] md:w-[36%] lg:w-[28%] xl:w-[22%] aspect-[16/9] rounded-2xl overflow-hidden ring-1 ring-white/10 bg-[#14182c]"
              animate={{ scale: isCenter ? 1.04 : 0.95, y: isCenter ? -4 : 0, rotate: isCenter ? 0 : -0.4 }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
            >
              <img src={f.image} alt={f.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute left-3 right-3 bottom-3">
                <h3 className={`font-semibold ${isCenter ? "text-base sm:text-lg" : "text-[13px]"}`}>{f.title}</h3>
                {f.subtitle && <p className="text-[11px] text-white/70">{f.subtitle}</p>}
                <RedButton className="mt-2">{f.cta}</RedButton>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() => snapTo(Math.max(0, index - 1))}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/70 ring-1 ring-white/10"
        aria-label="Previous"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => snapTo(Math.min(items.length - 1, index + 1))}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/70 ring-1 ring-white/10"
        aria-label="Next"
      >
        <ChevronRight size={16} />
      </button>

      <div className="mt-3 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-red-500" : "w-2 bg-white/30"}`} />
        ))}
      </div>
    </div>
  );
}

/* =============================== Main =============================== */
export default function GameSection() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState<Genre>("Action");

  const filtered = useMemo(() => {
    const byGenre = GAMES.filter((g) => g.genre === genre);
    if (!q.trim()) return byGenre;
    return byGenre.filter((g) => g.title.toLowerCase().includes(q.toLowerCase()));
  }, [genre, q]);

  return (
    <div id="Game" className="relative min-h-screen text-white bg-black py-20 md:py-24">
      {/* RED x BLACK GRADIENT BG with scanlines */}
      <div
        className="absolute inset-0 -z-30"
        style={{
          backgroundImage:
            "radial-gradient(1200px 700px at 65% 10%, rgba(239,68,68,0.22), transparent 60%), radial-gradient(900px 500px at 10% 85%, rgba(239,68,68,0.18), transparent 60%), linear-gradient(180deg,#0b0b12 0%, #07070d 100%)",
        }}
      />
      <div className="absolute inset-0 -z-20 pointer-events-none opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px)] bg-[length:100%_3px]" />

      <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 md:flex-none" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-red-400 to-rose-600 shadow-[0_0_16px_rgba(239,68,68,.6)]" />
            <h1 className="text-lg font-bold tracking-wide">Game</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-md bg-white/5 hover:bg-white/10">
              <Search size={16} />
            </button>
            <button className="p-2 rounded-md bg-white/5 hover:bg-white/10">
              <User size={16} />
            </button>
            <RedButton>Boost</RedButton>
          </div>
        </div>

        {/* Featured */}
        <div className="mt-6 md:mt-8 rounded-2xl">
          <Coverflow items={FEATURED} />
        </div>

        {/* Body */}
        <div className="mt-6 grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3 space-y-4">
            <div className="rounded-xl bg-[#0b0c15] ring-1 ring-white/10 p-3">
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search"
                  className="w-full rounded-lg bg-[#16192c] pl-9 pr-3 py-2 text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
              </div>
            </div>

            <div className="rounded-xl bg-[#0b0c15] ring-1 ring-white/10 p-4 space-y-4">
              <p className="text-sm font-semibold">Browse All Games</p>
              <div>
                <p className="text-sm font-semibold mb-2">Coming Soon</p>
                <div className="flex items-center gap-3">
                  <img src="/elements/vampire.png" alt="Faster" className="w-12 h-12 rounded-xl ring-1 ring-white/10" />
                  <img src="/elements/bat.png" alt="Saule" className="w-12 h-12 rounded-xl ring-1 ring-white/10" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">On Sale</p>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-xs text-white/70">
                    <Star size={14} className="text-yellow-400" /> Rating
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-white/70">
                    <ShoppingBag size={14} className="text-red-400" /> Sale
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Catalog */}
          <section className="col-span-12 md:col-span-6">
            {/* Chips */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className={`${chipBase} ${
                    genre === g ? "bg-red-500/20 text-red-200 ring-red-400/40" : "text-white/70 ring-white/15 hover:bg-white/5"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Section header (title + subtitle) */}
            <div className="rounded-2xl ring-1 ring-white/10 bg-[#0b0c15] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-500/20 text-red-300">
                      <Sparkles size={14} />
                    </span>
                    <h2 className="font-semibold text-base">Category Filters</h2>
                  </div>
                  <p className="mt-1 text-xs text-white/70">
                    Browse by genre to discover trending and editor-curated titles.
                  </p>
                </div>
              </div>

              {/* If more than 3 => slider, else grid */}
              {filtered.length > 3 ? (
                <RowSlider items={filtered} />
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((g) => (
                      <GameCard key={g.id} g={g} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </section>

          {/* Mobile mockup */}
          <aside className="col-span-12 md:col-span-3">
            <div className="sticky top-6">
              <div className="mx-auto w-64 rounded-[2rem] p-3 bg-[#0b0c15] ring-1 ring-white/15 shadow-[0_20px_60px_rgba(0,0,0,.45)]">
                <div className="rounded-[1.6rem] overflow-hidden bg-[#101426] ring-1 ring-white/10">
                  <img src="/elements/cartoon-superhero-illustration.jpg" alt="Caw Andeus" className="w-full h-48 object-cover" />
                  <div className="p-3">
                    <p className="font-semibold">Caw Andeus</p>
                    <p className="text-xs text-white/70">⭐ 4.1 • Action</p>
                    <RedButton className="mt-3 w-full">View Details</RedButton>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 opacity-70">
                  <span className="h-1 w-full rounded-full bg-white/10" />
                  <span className="h-1 w-full rounded-full bg-white/10" />
                  <span className="h-1 w-full rounded-full bg-white/10" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar{display:none}
        .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>
    </div>
  );
}
