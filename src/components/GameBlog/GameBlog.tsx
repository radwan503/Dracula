"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  HeartOff,
  Search,
  User2,
  Bookmark,
  ChevronRight,
} from "lucide-react";

/* ============================== Types & Data ============================== */
type Category = "Action" | "Adventure" | "Strategy" | "Guides" | "News" | "Reviews";
type Post = {
  id: string;
  title: string;
  author: string;
  date: string;
  cover: string;
  excerpt: string;
  category: Category;
  featured?: boolean;
};

const POSTS: Post[] = [
  {
    id: "p0",
    title: "The Ultimate Guide to RPGs",
    author: "GamerX",
    date: "October 26, 2023",
    cover: "/elements/futuristic-ninja-digital-art.jpg",
    excerpt: "Builds, leveling routes, and the best meta tips.",
    category: "Guides",
    featured: true,
  },
  {
    id: "p1",
    title: "The Exiled Sands",
    author: "Ari Nova",
    date: "Jan 5, 2025",
    cover: "/elements/2151500487.jpg",
    excerpt: "A sweeping ARPG that rewards smart risk.",
    category: "Reviews",
  },
  {
    id: "p2",
    title: "Lipants: Brtan tatíok",
    author: "eSports Desk",
    date: "Jan 4, 2025",
    cover: "/elements/2151624782.jpg",
    excerpt: "Dev picks & micro-moments from the weekend.",
    category: "News",
  },
  {
    id: "p3",
    title: "Esports Tournament Recap",
    author: "eSports Desk",
    date: "Jan 2, 2025",
    cover: "/elements/cartoon-soldier-with-combat-war.jpg",
    excerpt: "Brackets, upsets, VODs and the meta shifts.",
    category: "News",
  },
  {
    id: "p4",
    title: "Eophastus",
    author: "Field Ops",
    date: "Dec 28, 2024",
    cover: "/elements/man-wearing-vr-glasses-gaming.jpg",
    excerpt: "Operator builds & team synergies that win.",
    category: "Guides",
  },
  {
    id: "p5",
    title: "Top 10 New Indie Games",
    author: "Indie Radar",
    date: "Dec 21, 2024",
    cover: "/elements/2151624781.jpg",
    excerpt: "Fresh mechanics, small teams, big vibes.",
    category: "Reviews",
  },
  {
    id: "p6",
    title: "Esports Tournament Recap",
    author: "eSports Desk",
    date: "Dec 18, 2024",
    cover: "/elements/2151624782.jpg",
    excerpt: "Another week, another electrifying finish.",
    category: "News",
  },
  {
    id: "p7",
    title: "Tips for Leveling Up Fast",
    author: "GamerX",
    date: "Dec 12, 2024",
    cover: "/elements/scary-monster-foggy-forest-night.jpg",
    excerpt: "Route optimizations you can apply tonight.",
    category: "News",
  },
  {
    id: "p8",
    title: "Guides",
    author: "Staff",
    date: "Dec 1, 2024",
    cover: "/elements/front-view-ninja-wearing-equipment_23-2150960894.jpg",
    excerpt: "A hub for builds, maps and secrets.",
    category: "Guides",
  },
];

/* ============================== Little UI bits ============================== */
const neonWrap =
  "rounded-2xl bg-[#0c111b]/70 ring-1 ring-white/10 shadow-[0_0_60px_rgba(255,0,0,0)]";

const tagColor: Record<Category, string> = {
  Reviews: "bg-fuchsia-500/20 text-fuchsia-200",
  News: "bg-emerald-500/20 text-emerald-200",
  Guides: "bg-sky-500/20 text-sky-200",
  Action: "bg-rose-500/20 text-rose-200",
  Adventure: "bg-amber-500/20 text-amber-200",
  Strategy: "bg-lime-500/20 text-lime-200",
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
};

const Chip: React.FC<
  React.PropsWithChildren<{ active?: boolean; onClick?: () => void }>
> = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs ring-1 transition whitespace-nowrap ${
      active
        ? "bg-sky-500/20 text-sky-200 ring-sky-400/40"
        : "text-white/80 ring-white/10 hover:bg-white/5"
    }`}
  >
    {children}
  </button>
);

/* ================================= Component ================================ */
export default function GameBlog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "All">("All");
  const [favs, setFavs] = useState<Record<string, boolean>>({});

  const featured = POSTS.find((p) => p.featured) || POSTS[0];

  const posts = useMemo(() => {
    return POSTS.filter((p) => !p.featured)
      .filter((p) => (cat === "All" ? true : p.category === cat))
      .filter((p) =>
        (p.title + p.author + p.excerpt).toLowerCase().includes(q.toLowerCase())
      );
  }, [q, cat]);

  return (
    <div id="News" className="relative min-h-screen text-white bg-black py-20 md:py-24">
      {/* page background & neon frame */}
      <div className="absolute inset-0 -z-30 bg-[#05080e]" />
      <div
        className="absolute inset-6 -z-20 rounded-[26px] ring-1 ring-cyan-400/10"
        style={{
          boxShadow:
            "0 0 0 1px rgba(56,189,248,.18) inset, 0 0 80px rgba(56,189,248,.18)",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-12 gap-6">
        {/* ===================== LEFT (content) ===================== */}
        <section className="col-span-12 lg:col-span-9 space-y-6">
          {/* Header bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl grid place-items-center bg-gradient-to-tr from-red-400/20 to-fuchsia-400/20 ring-1 ring-white/10">
                <Bookmark size={18} className="text-red-300" />
              </div>
              <h1 className="text-xl font-extrabold">Blog</h1>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10">
                <Heart size={16} />
              </button>
              <button className="p-2 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10">
                <User2 size={16} />
              </button>
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search posts"
                  className="w-[220px] rounded-lg bg-[#0f1420]/90 pl-8 pr-3 py-2 text-xs ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60" />
              </div>
            </div>
          </div>

          {/* Featured banner */}
          <div className={`${neonWrap} overflow-hidden`}>
            <div className="relative">
              <img
                src={featured.cover}
                alt={featured.title}
                className="w-full h-56 md:h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute left-6 right-6 bottom-6">
                <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
                  {featured.title}
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  by {featured.author} • {featured.date}
                </p>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] w-2/3 bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-emerald-300 blur-[2px]" />
            </div>
          </div>

          {/* Blog Post grid */}
          <h3 className="text-lg font-semibold">Blog Post</h3>

          {/* Filter chips (mobile shows search here) */}
          <div className="flex items-center gap-2 flex-wrap">
            {(["All", "Action", "Adventure", "Strategy", "Guides", "News", "Reviews"] as const).map(
              (c) => (
                <Chip key={c} active={cat === c} onClick={() => setCat(c as any)}>
                  {c}
                </Chip>
              )
            )}
            <div className="sm:hidden relative ml-auto">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search"
                className="w-[160px] rounded-lg bg-[#0f1420]/90 pl-8 pr-3 py-2 text-xs ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {posts.map((p) => (
                <motion.article
                  key={p.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  whileHover={{ y: -4 }}
                  className={`${neonWrap} overflow-hidden`}
                >
                  <div className="relative">
                    <img src={p.cover} alt={p.title} className="w-full h-36 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span
                      className={`absolute left-2 top-2 text-[11px] px-2 py-0.5 rounded-full ${tagColor[p.category]}`}
                    >
                      {p.category}
                    </span>
                    <button
                      onClick={() =>
                        setFavs((f) => ({ ...f, [p.id]: !f[p.id] }))
                      }
                      className="absolute right-2 top-2 p-1.5 rounded-md bg-black/40 ring-1 ring-white/10 hover:bg-black/60"
                      title={favs[p.id] ? "Unfavorite" : "Favorite"}
                    >
                      {favs[p.id] ? (
                        <Heart className="text-rose-400" size={16} />
                      ) : (
                        <HeartOff size={16} />
                      )}
                    </button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold line-clamp-1">{p.title}</h4>
                    <p className="text-[12px] text-white/70 line-clamp-2">
                      {p.excerpt}
                    </p>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {/* View all */}
          <div className="flex justify-center">
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="mt-1 inline-flex items-center gap-1 px-6 py-2 rounded-full bg-[#0e1420] ring-1 ring-white/10 hover:bg-white/5 text-sm"
            >
              View All <ChevronRight size={16} />
            </motion.button>
          </div>
        </section>

        {/* ===================== RIGHT (sidebar) ===================== */}
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          {/* Search card */}
          <div className={`${neonWrap} p-4 space-y-3`}>
            <div className="text-sm font-semibold">Search</div>
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Find a post"
                className="w-full rounded-lg bg-[#0f1420]/90 pl-8 pr-3 py-2 text-xs ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60" />
            </div>
          </div>

          {/* Popular posts */}
          <div className={`${neonWrap} p-4`}>
            <h4 className="font-semibold mb-3">Popular Posts</h4>
            <div className="space-y-3 text-sm">
              {[POSTS[1], POSTS[5], POSTS[2]].map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.cover} className="w-14 h-10 rounded-md object-cover" alt={p.title} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{p.title}</p>
                    <p className="text-[11px] text-white/60">{p.author}</p>
                  </div>
                </div>
              ))}
              <button className="mt-2 inline-flex items-center gap-1 text-xs text-sky-300 hover:text-sky-200">
                Explore more <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className={`${neonWrap} p-4`}>
            <h4 className="font-semibold mb-3">Categories</h4>
            <div className="space-y-2">
              {(["Action", "Adventure", "Strategy", "Guides", "News", "Reviews"] as Category[]).map(
                (c) => (
                  <button
                    key={c}
                    onClick={() => setCat(cat === c ? "All" : c)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ring-1 text-sm ${
                      cat === c
                        ? "bg-white/10 ring-white/20"
                        : "bg-white/5 ring-white/10 hover:bg-white/10"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          tagColor[c as Category]
                            .replace("bg-", "")
                            .split(" ")[0]
                            .includes("sky")
                            ? "bg-sky-400"
                            : c === "Action"
                            ? "bg-rose-400"
                            : c === "Adventure"
                            ? "bg-amber-400"
                            : c === "Strategy"
                            ? "bg-lime-400"
                            : c === "Reviews"
                            ? "bg-fuchsia-400"
                            : "bg-emerald-400"
                        }`}
                      />
                      {c}
                    </span>
                    <span className="text-[11px] text-white/60">›</span>
                  </button>
                )
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
