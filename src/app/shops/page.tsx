"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Gamepad2,
  ShoppingCart,
  Star,
  Monitor,
  Play,
  Filter,
  X,
  Trash2,
  Plus,
  Minus,
  Heart,
  LogIn,
  CreditCard,
  CheckCircle2,
  Info,
  CircleX,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";

/* ----------------------------- Mock Data ----------------------------- */

type Platform = "PC" | "Xbox" | "PlayStation" | "Switch";

type Product = {
  id: string;
  title: string;
  price: number; // cents
  rating: number; // 0-5
  reviews: number;
  cover: string;
  platforms: Platform[];
  genres: string[];
  publisher: string;
  tag: "New Releases" | "Pre-orders" | "On Sale" | "Merchandise";
  badge?: string;
  blurb?: string;
};

const PRODUCTS: Product[] = [
  {
    id: "pc-mbor",
    title: "PC Mbor",
    price: 7590,
    rating: 4.1,
    reviews: 570,
    cover: "/shop/cool-gaming-setup-inside-still-life.jpg",
    platforms: ["PC"],
    genres: ["Shooter", "Action"],
    publisher: "Nighthawk",
    tag: "New Releases",
    badge: "PC",
    blurb:
      "Snowfront tactical shooter with reactive AI, tight gunplay, and co-op raids.",
  },
  {
    id: "and-geer",
    title: "And Geer Trost Gaver",
    price: 7590,
    rating: 4.4,
    reviews: 709,
    cover: "/shop/headphones-displayed-against-dark-background.jpg",
    platforms: ["PC", "Xbox"],
    genres: ["Shooter", "Adventure"],
    publisher: "Manticore",
    tag: "New Releases",
    badge: "PC",
    blurb:
      "Dust-land ops meets story-driven exploration. Upgrade your squad and survive.",
  },
  {
    id: "velte-plettur",
    title: "Velte Plettur Xbox",
    price: 8590,
    rating: 3.7,
    reviews: 370,
    cover: "/shop/high-angle-controller-vr-glasses.jpg",
    platforms: ["Xbox"],
    genres: ["Action"],
    publisher: "Silverleaf",
    tag: "New Releases",
    badge: "XBOX",
    blurb: "Bright warzones and mobility-based combat in crumbling cities.",
  },
  {
    id: "miaervet",
    title: "Miaervet Xbox",
    price: 7990,
    rating: 4.2,
    reviews: 532,
    cover: "/shop/still-life-seat-gamers.jpg",
    platforms: ["Xbox"],
    genres: ["Action", "Survival"],
    publisher: "Nighthawk",
    tag: "New Releases",
    badge: "XBOX",
    blurb:
      "Tropical storms, blade combat, stealth takedowns — survive the jungle.",
  },
  {
    id: "vatleron",
    title: "VATLERON Cridlinge Fonip",
    price: 9990,
    rating: 4.6,
    reviews: 398,
    cover: "/shop/view-computer-video-display-monitor.jpg",
    platforms: ["PC", "Xbox"],
    genres: ["Action", "RPG"],
    publisher: "Riftworks",
    tag: "New Releases",
    badge: "PC",
    blurb:
      "Gothic action-RPG with branching builds and boss arenas drenched in atmosphere.",
  },

  // Secondary rows / other tabs
  {
    id: "khoamem",
    title: "KHOAMEM",
    price: 5990,
    rating: 4.0,
    reviews: 220,
    cover: "/shop/view-computer-video-display-monitor.jpg",
    platforms: ["PC", "PlayStation"],
    genres: ["RPG"],
    publisher: "Emberforge",
    tag: "On Sale",
    blurb: "Tri-hero saga with hybrid tactics and cinematic set-pieces.",
  },
  {
    id: "karnige",
    title: "Bpbecs Karnige",
    price: 5090,
    rating: 3.9,
    reviews: 180,
    cover: "/shop/view-neon-illuminated-gaming-desk-setup-with-keyboard (1).jpg",
    platforms: ["PC"],
    genres: ["Indie", "Arcade"],
    publisher: "Ghostbyte",
    tag: "On Sale",
    blurb: "Arcade chaos, neon arenas, and power-ups galore.",
  },
  {
    id: "addange",
    title: "Addange Savor",
    price: 8690,
    rating: 4.5,
    reviews: 650,
    cover: "/shop/view-neon-illuminated-gaming-desk-setup-with-keyboard.jpg",
    platforms: ["PlayStation", "Xbox"],
    genres: ["Action", "Soulslike"],
    publisher: "Riftworks",
    tag: "Pre-orders",
    blurb: "Molten valleys. Massive blades. Parry or perish.",
  },
  {
    id: "warden",
    title: "Iron Warden",
    price: 6990,
    rating: 4.2,
    reviews: 300,
    cover: "/shop/wireless-earbuds-with-neon-cyberpunk-style-lighting.jpg",
    platforms: ["PC", "Switch"],
    genres: ["Action", "Platformer"],
    publisher: "Nighthawk",
    tag: "Merchandise",
    blurb: "Knightly precision platforming with forgeable gear.",
  },
  {
    id: "neon-rings",
    title: "Neon Rings",
    price: 2990,
    rating: 3.6,
    reviews: 120,
    cover: "/shop/gamer-chair-with-multicolored-neon-lights.jpg",
    platforms: ["Switch"],
    genres: ["Puzzle"],
    publisher: "Ghostbyte",
    tag: "New Releases",
    blurb: "Hypnotic puzzles set in synth tunnels of light.",
  },
];

/* ----------------------------- UI helpers ---------------------------- */

const platformIcon = (p: Platform) =>
  p === "PC" ? (
    <Monitor size={14} />
  ) : p === "Xbox" ? (
    // Using Play icon here would be confusing; keep Monitor/Play & plain X for Xbox-like
    <span className="inline-block text-[10px] font-bold">X</span>
  ) : p === "PlayStation" ? (
    <Play size={14} />
  ) : (
    <span className="inline-block text-[10px] font-bold">SW</span>
  );

const currency = (cents: number) =>
  `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

/* --------------------------------- App -------------------------------- */

type Tab = "New Releases" | "Pre-orders" | "On Sale" | "Merchandise";

type CartItem = { id: string; qty: number };

export default function ShopSection() {

  const [tab, setTab] = useState<Tab>("New Releases");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [active, setActive] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);

  // Filters
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [publisher, setPublisher] = useState<string>("All");
  const [price, setPrice] = useState<number>(10000);
  const [showFilters, setShowFilters] = useState(true);

  // Auth + checkout
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderDone, setOrderDone] = useState<{ id: string; total: number } | null>(null);

  const allGenres = useMemo(
    () => Array.from(new Set(PRODUCTS.flatMap((p) => p.genres))).sort(),
    []
  );
  const allPublishers = useMemo(
    () => ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.publisher))).sort()],
    []
  );

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (p.tag !== tab) return false;
      if (publisher !== "All" && p.publisher !== publisher) return false;
      if (platforms.length && !platforms.some((pl) => p.platforms.includes(pl)))
        return false;
      if (genres.length && !genres.some((g) => p.genres.includes(g))) return false;
      if (p.price > price) return false;
      return true;
    });
  }, [tab, platforms, genres, publisher, price]);

  const toggle = <T,>(arr: T[], v: T) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const addToCart = (id: string, qty = 1) =>
    setCart((s) => {
      const i = s.findIndex((x) => x.id === id);
      if (i >= 0) {
        const next = [...s];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...s, { id, qty }];
    });

  const removeFromCart = (id: string) =>
    setCart((s) => s.filter((x) => x.id !== id));

  const setQty = (id: string, qty: number) =>
    setCart((s) => s.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x)));

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const p = PRODUCTS.find((x) => x.id === item.id)!;
        return sum + p.price * item.qty;
      }, 0),
    [cart]
  );

  const checkout = () => {
    if (!cart.length) return;
    if (!user) {
      setShowLogin(true);
      return;
    }
    setShowCheckout(true);
  };

  /* --------------------------------- UI -------------------------------- */

  return (
    <section className="relative min-h-screen w-full bg-[#0a0a0a] text-white">
      {/* HEADER / BRAND */}
      <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/60 bg-black/80">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/">
          <div className="flex items-center gap-3">
            <Gamepad2 className="text-red-400" />
            <span className="font-semibold tracking-wide">Dracula Shop</span>
          </div></Link>
          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex gap-6 text-sm text-white/70">
              <button className="hover:text-red-300">PC</button>
              <button className="hover:text-red-300">Popular</button>
              <button className="hover:text-red-300">On Sale</button>
              <button className="hover:text-red-300">Collections</button>
            </nav>
            <button
              onClick={() => setShowCart(true)}
              className="relative rounded-md p-2 hover:bg-white/10 transition"
            >
              <ShoppingCart className="text-white/90" />
              {!!cart.length && (
                <span className="absolute -right-1 -top-1 rounded-full bg-red-500 text-black text-[10px] px-1.5 py-[1px]">
                  {cart.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>
            {user ? (
              <div className="text-xs text-white/70">Hi, {user.email}</div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/15 px-3 py-1.5 text-sm"
              >
                <LogIn size={14} /> Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BANNER */}
      <div className="mx-auto max-w-7xl px-4 mt-10">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7a001a]/50 via-[#2a0005]/40 to-transparent ring-1 ring-white/10"
        >
          <img
            src="/elements/modern-car-driving-city_23-2151674339.jpg"
            alt="Promo"
            className="absolute right-0 top-0 h-full w-[52%] object-cover object-center hidden md:block"
          />
          <div className="relative p-8 sm:p-12 md:p-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-300 ring-1 ring-red-500/25">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              HERO
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold">
              <span className="bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                DEA TREHER
              </span>
            </h2>
            <p className="mt-2 max-w-xl text-white/75">
              Co-op tactical raiding with cinematic, high-contrast lighting and crunchy
              combat. Assemble your fireteam and breach.
            </p>
            <button
              onClick={() => {
                setTab("New Releases");
                setActive(PRODUCTS[0]);
              }}
              className="mt-6 rounded-xl bg-red-500 px-5 py-2.5 text-black font-semibold hover:bg-red-400"
            >
              BUY NOW
            </button>
          </div>
        </motion.div>
      </div>

      {/* CONTENT GRID */}
      <div className="mx-auto max-w-7xl px-4 mt-8 grid grid-cols-12 gap-6">
        {/* SIDEBAR FILTERS */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="rounded-2xl bg-[#121212] ring-1 ring-white/10 p-4 md:p-5">
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="flex w-full items-center justify-between text-sm font-semibold"
            >
              <span className="inline-flex items-center gap-2">
                <Filter size={16} /> Filters
              </span>
              <ChevronDown
                size={16}
                className={`transition ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {/* Platform */}
                  <div className="mt-5">
                    <div className="text-xs uppercase tracking-wide text-white/60 mb-2">
                      Platform
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(["PC", "Xbox", "PlayStation", "Switch"] as const).map((p) => {
                        const active = platforms.includes(p);
                        return (
                          <button
                            key={p}
                            onClick={() => setPlatforms((arr) => toggle(arr, p))}
                            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ring-1 ${
                              active
                                ? "bg-red-500 text-black ring-red-400"
                                : "bg-white/[0.06] ring-white/10 hover:bg-white/[0.12]"
                            }`}
                          >
                            {platformIcon(p)}
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="mt-6">
                    <div className="text-xs uppercase tracking-wide text-white/60 mb-2">
                      Genre
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allGenres.map((g) => {
                        const active = genres.includes(g);
                        return (
                          <button
                            key={g}
                            onClick={() => setGenres((arr) => toggle(arr, g))}
                            className={`rounded-lg px-3 py-1.5 text-sm ring-1 ${
                              active
                                ? "bg-red-400 text-black ring-red-300"
                                : "bg-white/[0.06] ring-white/10 hover:bg-white/[0.12]"
                            }`}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-6">
                    <div className="text-xs uppercase tracking-wide text-white/60 mb-2">
                      Price Range
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={10000}
                      step={500}
                      value={price}
                      onChange={(e) => setPrice(parseInt(e.target.value))}
                      className="w-full accent-red-500"
                    />
                    <div className="mt-1 text-sm text-white/70">
                      Up to <span className="font-semibold">{currency(price)}</span>
                    </div>
                  </div>

                  {/* Publisher */}
                  <div className="mt-6">
                    <div className="text-xs uppercase tracking-wide text-white/60 mb-2">
                      Publisher
                    </div>
                    <select
                      value={publisher}
                      onChange={(e) => setPublisher(e.target.value)}
                      className="w-full rounded-lg bg-white/[0.06] px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-red-400"
                    >
                      {allPublishers.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* PRODUCT LISTS */}
        <main className="col-span-12 lg:col-span-9">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {(["New Releases", "Pre-orders", "On Sale", "Merchandise"] as Tab[]).map(
              (t) => {
                const active = t === tab;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`relative px-3 py-1.5 text-sm rounded-full transition ${
                      active
                        ? "bg-red-500 text-black"
                        : "text-white/80 hover:text-white bg-white/[0.06]"
                    }`}
                  >
                    {t}
                    {active && (
                      <span className="absolute -bottom-1 left-1/2 h-[2px] w-10 -translate-x-1/2 rounded bg-red-400" />
                    )}
                  </button>
                );
              }
            )}
          </div>

          {/* Grid of cards */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl bg-[#121212] ring-1 ring-white/10 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={p.cover}
                    alt={p.title}
                    className="h-44 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {p.badge && (
                      <span className="rounded-md bg-black/70 px-2 py-0.5 text-[10px] ring-1 ring-white/20">
                        {p.badge}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight group-hover:text-white">
                      {p.title}
                    </h3>
                    <div className="flex gap-1 text-white/70">
                      {p.platforms.map((pl) => (
                        <span
                          key={pl}
                          className="inline-flex items-center justify-center rounded-md bg-white/5 p-1.5 ring-1 ring-white/10"
                          title={pl}
                        >
                          {platformIcon(pl)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Star size={14} className="text-yellow-400" />
                    <span>{p.rating.toFixed(1)}</span>
                    <span className="text-white/40">•</span>
                    <span>{p.reviews.toLocaleString()} reviews</span>
                  </div>

                  <p className="text-xs text-white/60 line-clamp-2">{p.blurb}</p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-red-300 font-semibold">
                      {currency(p.price)}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setFavorites((favs) =>
                            favs.includes(p.id)
                              ? favs.filter((x) => x !== p.id)
                              : [...favs, p.id]
                          )
                        }
                        title="Add to wishlist"
                        className={`rounded-lg px-2 py-1 ring-1 ${
                          favorites.includes(p.id)
                            ? "bg-red-500 text-black ring-red-400"
                            : "bg-white/5 ring-white/10 hover:bg-white/10"
                        }`}
                      >
                        <Heart
                          size={16}
                          className={
                            favorites.includes(p.id) ? "fill-black" : "fill-transparent"
                          }
                        />
                      </button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addToCart(p.id)}
                        className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-semibold text-black hover:bg-red-400"
                      >
                        ADD TO CART
                      </motion.button>
                      <button
                        onClick={() => setActive(p)}
                        className="rounded-lg bg-white/5 hover:bg-white/10 px-2 py-1 text-xs"
                        title="Details"
                      >
                        <Info size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {!filtered.length && (
              <div className="col-span-full rounded-2xl bg-[#121212] ring-1 ring-white/10 p-10 text-center text-white/70">
                No items match your filters.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ======= MODALS & DRAWERS ======= */}

      {/* Product details modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="mx-auto mt-16 w-[92%] max-w-3xl overflow-hidden rounded-2xl bg-[#121212] ring-1 ring-white/10"
            >
              <div className="relative h-56 w-full">
                <img
                  src={active.cover}
                  alt={active.title}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => setActive(null)}
                  className="absolute right-3 top-3 rounded-full bg-black/70 p-2 ring-1 ring-white/20"
                >
                  <X size={18} />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold">{active.title}</h3>
                  <div className="text-red-300 font-semibold">{currency(active.price)}</div>
                </div>
                <p className="text-white/70">{active.blurb}</p>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Star size={14} className="text-yellow-400" />
                  {active.rating.toFixed(1)} · {active.reviews.toLocaleString()} reviews
                </div>
                <div className="flex gap-2">
                  {active.platforms.map((pl) => (
                    <span
                      key={pl}
                      className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm ring-1 ring-white/10"
                    >
                      {platformIcon(pl)} {pl}
                    </span>
                  ))}
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(active.id);
                      setActive(null);
                      setShowCart(true);
                    }}
                    className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-semibold text-black hover:bg-red-400"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() =>
                      setFavorites((f) =>
                        f.includes(active.id) ? f.filter((x) => x !== active.id) : [...f, active.id]
                      )
                    }
                    className={`rounded-lg px-4 py-2 ring-1 ${
                      favorites.includes(active.id)
                        ? "bg-red-500 text-black ring-red-400"
                        : "bg-white/5 ring-white/10 hover:bg-white/10"
                    }`}
                  >
                    <Heart
                      size={18}
                      className={favorites.includes(active.id) ? "mx-auto fill-black" : "mx-auto"}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setShowCart(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: 420 }}
              animate={{ x: 0 }}
              exit={{ x: 420 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="fixed right-0 top-0 z-50 h-full w-[380px] max-w-[92vw] bg-[#121212] ring-1 ring-white/10"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} />
                  <span className="font-semibold">Your Cart</span>
                </div>
                <button onClick={() => setShowCart(false)} className="p-1 rounded hover:bg-white/10">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-200px)]">
                {cart.length === 0 && (
                  <div className="text-center text-white/60 py-10">
                    Your cart is empty.
                  </div>
                )}

                {cart.map((item) => {
                  const p = PRODUCTS.find((x) => x.id === item.id)!;
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-lg bg-white/[0.04] p-3 ring-1 ring-white/10"
                    >
                      <img
                        src={p.cover}
                        alt={p.title}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold truncate">{p.title}</div>
                          <div className="text-red-300">{currency(p.price)}</div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                            <button
                              onClick={() => setQty(item.id, item.qty - 1)}
                              className="p-1.5 hover:bg-white/10"
                              aria-label="Decrease"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 text-sm">{item.qty}</span>
                            <button
                              onClick={() => setQty(item.id, item.qty + 1)}
                              className="p-1.5 hover:bg-white/10"
                              aria-label="Increase"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="rounded-lg px-2 py-1 text-xs bg-white/5 hover:bg-white/10"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4 space-y-3 bg-[#121212]">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Subtotal</span>
                  <span className="font-semibold text-red-300">{currency(subtotal)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCart([])}
                    disabled={!cart.length}
                    className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
                  >
                    Clear
                  </button>
                  <button
                    onClick={checkout}
                    disabled={!cart.length}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-black hover:bg-red-400 disabled:opacity-50"
                  >
                    <CreditCard size={16} /> Checkout
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Login modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowLogin(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-[#121212] ring-1 ring-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <LogIn size={18} />
                  <h3 className="text-lg font-semibold">Log in to continue</h3>
                </div>
                <button onClick={() => setShowLogin(false)} className="p-1 rounded hover:bg-white/10">
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-white/60 mb-4">
                Use any email/password — this is a demo form.
              </p>
              <LoginForm
                onSuccess={(email) => {
                  setUser({ email });
                  setShowLogin(false);
                  // If login was triggered by checkout, continue
                  if (cart.length) setShowCheckout(true);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl overflow-hidden rounded-2xl bg-[#121212] ring-1 ring-white/10"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} />
                  <h3 className="text-lg font-semibold">Checkout</h3>
                </div>
                <button onClick={() => setShowCheckout(false)} className="p-1 rounded hover:bg-white/10">
                  <X size={18} />
                </button>
              </div>

              <div className="grid md:grid-cols-5 gap-0">
                {/* Order summary */}
                <div className="md:col-span-2 p-6 border-r border-white/10 space-y-3 bg-white/[0.02]">
                  <h4 className="font-semibold">Order</h4>
                  <div className="space-y-3 max-h-64 overflow-auto pr-1">
                    {cart.map((item) => {
                      const p = PRODUCTS.find((x) => x.id === item.id)!;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-lg bg-white/5 p-3 ring-1 ring-white/10"
                        >
                          <img
                            src={p.cover}
                            alt={p.title}
                            className="h-12 w-12 rounded object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <div className="truncate">{p.title}</div>
                              <div className="text-red-300">{currency(p.price)}</div>
                            </div>
                            <div className="text-xs text-white/60">Qty: {item.qty}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Subtotal</span>
                      <span className="font-semibold text-red-300">
                        {currency(subtotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Tax (0%)</span>
                      <span className="font-semibold text-red-300">
                        {currency(0)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-extrabold text-red-400">
                        {currency(subtotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment form */}
                <div className="md:col-span-3 p-6">
                  <CheckoutForm
                    email={user?.email || ""}
                    amount={subtotal}
                    onCancel={() => setShowCheckout(false)}
                    onSuccess={async () => {
                      // Simulate order completion
                      await new Promise((r) => setTimeout(r, 800));
                      setOrderDone({
                        id: Math.random().toString(36).slice(2, 8).toUpperCase(),
                        total: subtotal,
                      });
                      setShowCheckout(false);
                      setCart([]);
                      setShowCart(false);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order success toast */}
      <AnimatePresence>
        {orderDone && (
          <motion.div
            key="success"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#121212] px-4 py-3 ring-1 ring-white/10 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-400" />
              <div>
                <div className="font-semibold">Order placed!</div>
                <div className="text-sm text-white/70">
                  Receipt <span className="font-mono">{orderDone.id}</span> —{" "}
                  {currency(orderDone.total)}
                </div>
              </div>
              <button
                onClick={() => setOrderDone(null)}
                className="ml-3 rounded-md p-1 hover:bg-white/10"
                aria-label="Close"
              >
                <CircleX size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16" />
    </section>
  );
}

/* ======================= Forms (Login & Checkout) ======================= */

function LoginForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const valid = /\S+@\S+\.\S+/.test(email) && pass.length >= 3;

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    onSuccess(email);
  };

  return (
    <form onSubmit={handle} className="space-y-3">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg bg-white/[0.06] px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-red-400"
      />
      <input
        type="password"
        placeholder="Password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        className="w-full rounded-lg bg-white/[0.06] px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-red-400"
      />
      <button
        disabled={!valid || busy}
        className="w-full rounded-lg bg-red-500 py-2 font-semibold text-black hover:bg-red-400 disabled:opacity-50"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-xs text-white/50">
        By continuing you agree to our{" "}
        <a className="text-red-300 hover:text-red-200 underline">Terms</a>.
      </p>
    </form>
  );
}

function CheckoutForm({
  email,
  amount,
  onCancel,
  onSuccess,
}: {
  email: string;
  amount: number;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [mail, setMail] = useState(email);
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);

  const ok =
    name.trim() &&
    /\S+@\S+\.\S+/.test(mail) &&
    /^\d{12,19}$/.test(card.replace(/\s/g, "")) &&
    /^\d{2}\/\d{2}$/.test(exp) &&
    /^\d{3,4}$/.test(cvc) &&
    agree &&
    amount > 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ok) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    onSuccess();
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg bg-white/[0.06] px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-red-400"
        />
        <input
          type="email"
          placeholder="Email for receipt"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          className="rounded-lg bg-white/[0.06] px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-red-400"
        />
      </div>

      <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 space-y-3">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <BadgeCheck size={16} className="text-green-400" /> Demo payment (no real charge)
        </div>
        <input
          inputMode="numeric"
          placeholder="Card number (numbers only)"
          value={card}
          onChange={(e) => setCard(e.target.value)}
          className="w-full rounded-lg bg-white/[0.06] px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-red-400"
        />
        <div className="grid grid-cols-3 gap-3">
          <input
            placeholder="MM/YY"
            value={exp}
            onChange={(e) => setExp(e.target.value)}
            className="col-span-1 rounded-lg bg-white/[0.06] px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-red-400"
          />
          <input
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="col-span-1 rounded-lg bg-white/[0.06] px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-red-400"
          />
          <div className="col-span-1 flex items-center text-sm">
            <span className="ml-auto text-white/70">Total:</span>
            <span className="ml-2 font-semibold text-red-300">
              {currency(amount)}
            </span>
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-white/70">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-transparent text-red-400 focus:ring-0"
        />
        I agree to the refund policy and EULA.
      </label>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          disabled={!ok || busy}
          className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-black hover:bg-red-400 disabled:opacity-50"
        >
          {busy ? "Processing…" : "Pay Now"}
        </button>
      </div>
    </form>
  );
}
