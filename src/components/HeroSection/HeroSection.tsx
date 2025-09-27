"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/** Props **/
type Props = {
  backgroundUrl?: string;
  logoUrl?: string;
  title?: string;
  kicker?: string;
};

/** ShardButton: angular cut-corners + reactive glow */
function ShardButton({
  variant = "primary",
  href = "#",
  children,
}: {
  variant?: "primary" | "ghost";
  href?: string;
  children: React.ReactNode;
}) {
  const base =
    "relative inline-flex items-center justify-center px-7 sm:px-9 py-3 uppercase tracking-[0.28em] text-[11px] sm:text-xs font-[Rubik] select-none";
  const shape = {
    clipPath:
      "polygon(8% 0, 92% 0, 100% 28%, 100% 72%, 92% 100%, 8% 100%, 0 72%, 0 28%)",
  } as React.CSSProperties;

  const skin =
    variant === "primary"
      ? "text-black bg-[linear-gradient(180deg,#ff4646,#ff2d2d)] shadow-[0_8px_30px_rgba(239,68,68,.35)]"
      : "text-white bg-white/5 ring-1 ring-white/20 hover:bg-white/10";

  return (
    <motion.a
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.98, y: 0 }}
      href={href}
      className={`${base} ${skin}`}
      style={shape}
    >
      {/* edge stroke */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-[0] pointer-events-none"
        style={{
          padding: 1,
          background:
            "linear-gradient(90deg, rgba(255,255,255,.0), rgba(255,180,180,.8), rgba(255,255,255,.0))",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          clipPath:
            "polygon(8% 0, 92% 0, 100% 28%, 100% 72%, 92% 100%, 8% 100%, 0 72%, 0 28%)",
        } as any}
      />
      {/* corner pips */}
      <span className="absolute -left-1 top-1 h-1 w-2 bg-red-400/80" />
      <span className="absolute -right-1 bottom-1 h-1 w-2 bg-red-400/80" />
      {children}
    </motion.a>
  );
}


/** RetroPixelButton: arcade vibe with pixel corners + scanline */
function RetroPixelButton({
  href = "#",
  children,
  tone = "red",
}: {
  href?: string;
  children: React.ReactNode;
  tone?: "red" | "purple" | "green";
}) {
  const palette: Record<string, string> = {
    red: "bg-[#ff3131] text-black",
    purple: "bg-[#ff3131] text-black",
    green: "bg-[#ff3131] text-black",
  };
  return (
    <motion.a
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      href={href}
      className={`relative inline-flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3 uppercase tracking-[0.22em] text-[11px] sm:text-xs font-[Rubik] ${palette[tone]} shadow-[0_6px_0_rgba(0,0,0,.6)]`}
      style={{
        clipPath:
          "polygon(0 8%, 8% 8%, 8% 0, 92% 0, 92% 8%, 100% 8%, 100% 92%, 92% 92%, 92% 100%, 8% 100%, 8% 92%, 0 92%)",
      }}
    >
      {/* scanline */}
      <span
        aria-hidden
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 1px, transparent 1px 3px)",
        }}
      />
      {/* border */}
      <span
        aria-hidden
        className="absolute inset-0 ring-2 ring-black/70"
        style={{
          clipPath:
            "polygon(0 8%, 8% 8%, 8% 0, 92% 0, 92% 8%, 100% 8%, 100% 92%, 92% 92%, 92% 100%, 8% 100%, 8% 92%, 0 92%)",
        }}
      />
      {children}
    </motion.a>
  );
}




function HoloButton({
  variant = "primary",
  href = "#",
  children,
}: {
  variant?: "primary" | "ghost";
  href?: string;
  children: React.ReactNode;
}) {
  const base =
    "relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 uppercase tracking-[0.28em] text-[11px] sm:text-xs font-[Rubik] rounded-xl select-none";
  const solid =
    "text-black bg-[linear-gradient(180deg,#ff4949,#ff3434)] shadow-[0_8px_30px_rgba(239,68,68,.35)]";
  const ghost =
    "text-white/90 bg-white/5 ring-1 ring-white/20 hover:bg-white/[0.08]";

  return (
    <motion.a
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ y: 0, scale: 0.98 }}
      href={href}
      className={`${base} ${variant === "primary" ? solid : ghost}`}
      data-testid="cta"
      style={{ WebkitMaskImage: "radial-gradient(circle, #000 70%, rgba(0,0,0,0.7) 100%)" }}
    >
      {/* Energy border */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-xl -z-10"
        style={{
          padding: 1,
          background:
            "conic-gradient(from 0deg, rgba(255,255,255,.0), rgba(255,0,90,.6), rgba(255,120,120,.85), rgba(255,0,90,.6), rgba(255,255,255,.0))",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          animation: "spinBorder 4.5s linear infinite",
        } as any}
      />
      {/* Inner glass highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,.16), rgba(255,255,255,0) 60%)",
          mixBlendMode: "soft-light",
        }}
      />
      {/* Shimmer sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-[-40%] top-0 h-full w-1/3 rounded-xl"
        style={{
          background:
            "linear-gradient(75deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.45) 45%, rgba(255,255,255,0) 100%)",
          transform: "skewX(-20deg)",
          animation: "sweep 2.4s ease-in-out infinite",
          opacity: variant === "ghost" ? 0.35 : 0.6,
        }}
      />

      {children}

      <style jsx>{`
        @keyframes spinBorder {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes sweep {
          0% {
            left: -40%;
          }
          55% {
            left: 120%;
          }
          100% {
            left: 120%;
          }
        }
      `}</style>
    </motion.a>
  );
}



/** Curved title with aggressive red + digital glitch */
function CurvedTitle({ text }: { text: string }) {
  const letters = Array.from(text);
  const n = letters.length;
  const mid = (n - 1) / 2;

  return (
    <div
      className="relative mx-auto flex items-end justify-center gap-[0.06em] select-none"
      aria-label={text}
    >
      {letters.map((ch, i) => {
        const t = i - mid; // centered index
        const arc = -0.12 * t * t + 6; // px upshift for arc
        const rot = t * 2.2; // degrees
        const skew = -t * 1.5; // degrees

        const gradient =
          "linear-gradient(180deg,#ff3b3b 0%,#ff1f1f 60%,#b41212 100%)," +
          "repeating-linear-gradient(-18deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 10px, rgba(0,0,0,0.35) 10px, rgba(0,0,0,0.35) 16px)";

        return (
          <span
            key={i}
            className="relative inline-block font-['Teko'] leading-[0.8] font-[700] tracking-[0.12em] uppercase [text-shadow:0_10px_18px_rgba(0,0,0,0.55)]"
            style={{
              transform: `translateY(${-arc}px) rotate(${rot}deg) skewX(${skew}deg)`,
              fontSize: "clamp(56px, 12vw, 160px)",
            }}
            data-testid={i === Math.round(mid) ? "title" : undefined}
          >
            {/* BASE */}
            <span
              className="relative block"
              style={{
                WebkitTextStroke: "2px rgba(0,0,0,0.6)",
                backgroundImage: gradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.55))",
              }}
            >
              {ch}
            </span>

            {/* GLITCH A (cyan) */}
            <span
              aria-hidden
              className="absolute inset-0 block text-transparent mix-blend-screen"
              style={{
                backgroundImage: gradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextStroke: "2px rgba(0,255,255,0.45)",
                animation: "glitchA 1.9s steps(2,end) infinite",
                transform: "translate(1px,-1px)",
                opacity: 0.35,
              }}
            >
              {/* {ch} */}
            </span>

            {/* GLITCH B (magenta) */}
            <span
              aria-hidden
              className="absolute inset-0 block text-transparent mix-blend-screen"
              style={{
                backgroundImage: gradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextStroke: "2px rgba(255,0,255,0.45)",
                animation: "glitchB 8.6s steps(18,end) infinite",
                transform: "translate(-1px,1px)",
                opacity: 0.15,
              }}
            >
              {ch}
            </span>
          </span>
        );
      })}

      {/* Keyframes (scoped) */}
      <style jsx>{`
        @keyframes glitchA {
          0% { clip-path: inset(0 0 0 0); }
          20% { clip-path: inset(12% 0 76% 0); }
          40% { clip-path: inset(0 0 70% 0); }
          60% { clip-path: inset(40% 0 20% 0); }
          80% { clip-path: inset(18% 0 50% 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
        @keyframes glitchB {
          0% { clip-path: inset(0 0 0 0); }
          25% { clip-path: inset(75% 0 8% 0); }
          50% { clip-path: inset(10% 0 65% 0); }
          75% { clip-path: inset(55% 0 18% 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          span[style*="glitchA"], span[style*="glitchB"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function HeroSection(props: Props) {
  const {
    backgroundUrl = "elements/scary-monster-foggy-forest-night.jpg", // optional overlay texture
    logoUrl = "elements/vampire.png",
    title = "DRACULA",
    kicker = "Beat the Game",
  } = props || {};

   const backgrounds = [
    "elements/scary-monster-foggy-forest-night.jpg",
    "elements/cartoon-soldier-with-combat-war.jpg",
    "elements/man-racing-dirt-bike-fantasy-environment.jpg",
  ];

  const [bgIndex, setBgIndex] = useState(0);
  const bgRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const nextBg = () => setBgIndex((i) => (i + 1) % backgrounds.length);
  const prevBg = () => setBgIndex((i) => (i - 1 + backgrounds.length) % backgrounds.length);


  useEffect(() => {
    const titleEl = document.querySelector('[data-testid="title"]');
    const ctas = document.querySelectorAll('[data-testid="cta"]');
    const left = document.querySelector('[data-testid="nav-left"]');
    const right = document.querySelector('[data-testid="nav-right"]');

    console.assert(titleEl, "[HeroSection] Title element did not render");
    console.assert(ctas.length === 2, "[HeroSection] Expected 2 CTA buttons");
    console.assert(left && right, "[HeroSection] Split nav (left/right) did not render");
  }, []);

  return (
    <section id="Home" className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden">
      {/* Google Fonts: Teko (title), Rubik (UI) */}
      <link
        href="https://fonts.googleapis.com/css2?family=Teko:wght@700&family=Rubik:wght@400;600;800&display=swap"
        rel="stylesheet"
      />

      {/* Background image (optional texture layer) */}
      <div
        ref={bgRef}
        key={bgIndex}
        className="absolute inset-0 z-10 transition-all duration-700" // keep it behind content
        style={{
          // 1) Put the IMAGE FIRST so it renders on top of subsequent blends
          // 2) Then the radial red glow, then the dark conic wash
            backgroundImage: backgroundUrl
              ? `url(${backgrounds[bgIndex]}), radial-gradient(1200px 700px at 60% 20%, rgba(239,68,68,0.30), transparent 100%), conic-gradient(from 220deg at 70% 30%, #1a0b0b 0%, #160707 30%, #0b0505 60%, #000 100%)`
              : `radial-gradient(1200px 700px at 60% 20%, rgba(239,68,68,0.30), transparent 60%), conic-gradient(from 220deg at 70% 30%, #1a0b0b 0%, #160707 30%, #0b0505 60%, #000 100%)`,
            backgroundSize: backgroundUrl ? "cover, 100% 100%, 100% 100%" : "100% 100%, 100% 100%",
            backgroundPosition: "center, center, center",
            backgroundRepeat: "no-repeat, no-repeat, no-repeat",
            // Blend so the photo takes on the red theme but stays visible
            backgroundBlendMode: backgroundUrl ? "overlay, normal, normal" : "normal, normal",
            // Optional extra styling on the image
            filter: backgroundUrl ? "grayscale(100%) contrast(1)" : undefined,
            opacity: 1,
          }}
        />

      {/* RED GRADIENT THEME (core) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px)] bg-[length:100%_3px]" />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-20"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22 viewBox=%220 0 160 160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.18%22/></svg>')",
        }}
      />
      <div className="absolute inset-0 shadow-[inset_0_0_260px_rgba(0,0,0,0.9)]" />
      
      {/* === NAVBAR (responsive) === */}
      <header className="absolute top-0 left-0 right-0 z-30 font-[Rubik]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top row: search | logo | hamburger */}
          <div className="flex items-center justify-between py-4">
            {/* Left: Search icon */}
            <button
              aria-label="Search"
              className="rounded-md p-2 hover:bg-white/10 transition"
            >
              {/* simple magnifier */}
              <svg width="18" height="18" viewBox="0 0 24 24" className="text-white/90" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Center: Logo */}
            <div className="flex items-center justify-center">
              <Link href="/">
                <img src={logoUrl} width={64} height={64} alt="Logo" className="drop-shadow-[0_0_16px_rgba(239,68,68,0.35)]" />
              </Link>
            </div>

            {/* Right: hamburger */}
            <button
              onClick={() => setOpen(v => !v)}
              aria-label="Open Menu"
              aria-expanded={open}
              className="rounded-md p-2 hover:bg-white/10 transition md:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="text-white/90" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Desktop right-side quick links */}
            <nav className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-[0.28em]">
              <Link href="#News" className="text-white/85 hover:text-red-300 transition">Blog</Link>
              <Link href="/shops" className="text-white/85 hover:text-red-300 transition">Shop</Link>
              <Link href="/" className="text-white/85 hover:text-red-300 transition">Landing</Link>
            </nav>
          </div>

          {/* Desktop primary nav (split) */}
          <div className="hidden md:grid grid-cols-3 items-center pb-3 text-xs font-semibold uppercase tracking-[0.32em]">
            <nav data-testid="nav-left" className="flex gap-8">
              {["Home", "Game", "Tournament"].map((item) => (
                <a key={item} href={`#${item}`} className="text-white/80 hover:text-red-300 transition">
                  {item}
                </a>
              ))}
            </nav>
            <div className="text-center text-white/40 select-none"></div>
            <nav data-testid="nav-right" className="flex gap-8 justify-end">
              {["News", "Clans", "Contact"].map((item) => (
                <a key={item} href={`#${item}`} className="text-white/80 hover:text-red-300 transition">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile drawer */}
        <motion.div
          initial={false}
          animate={open ? "open" : "closed"}
          variants={{
            open: { height: "auto", opacity: 1 },
            closed: { height: 0, opacity: 0 },
          }}
          className="md:hidden overflow-hidden bg-black/60 backdrop-blur-sm border-t border-white/10"
        >
          <div className="px-4 py-4 space-y-3 text-[12px] uppercase tracking-[0.28em]">
            {["Home", "Pages", "Tournament", "Blog", "Shop", "Landing"].map((item) => (
              <a
                key={item}
                href="#"
                className="block py-2 text-white/90 hover:text-red-300 transition"
                onClick={() => setOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      </header>

      {/* Side pagination hints */}
      <div className="absolute bottom-1/3 w-full flex justify-between px-6 z-30 text-xs uppercase tracking-widest font-[Rubik]">
        <button
          onClick={prevBg}
          className="flex items-center gap-2 text-white/80 hover:text-red-300 transition"
        >
          <span className="rotate-180">›</span> Prev
        </button>
        <button
          onClick={nextBg}
          className="flex items-center gap-2 text-white/80 hover:text-red-300 transition"
        >
          Next <span>›</span>
        </button>
      </div>

      {/* === HERO CONTENT === */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="z-20 text-center px-6 max-w-6xl mx-auto pt-28 md:pt-40 pb-20"
      >
        <p className="text-[10px] sm:text-xs tracking-[0.6em] uppercase mb-4 text-red-300/85 font-[Rubik]">
          {kicker.split("").join(" ")}
        </p>

        {/* Decorative arc */}
        <motion.svg
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          viewBox="0 0 1200 200"
          className="mx-auto w-[88%] h-[120px] -mb-6"
        >
          <defs>
            <linearGradient id="curveStrokeR" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <motion.path
            d="M60 140 C 360 20, 840 20, 1140 140"
            fill="none"
            stroke="url(#curveStrokeR)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </motion.svg>

        {/* Curved, jagged, glitch title */}
        <CurvedTitle text={title} />

        {/* Subcopy / value prop */}
        <p className="mt-5 max-w-3xl mx-auto text-white/85 font-[Rubik] leading-relaxed">
          Build <span className="text-red-300 font-semibold">arena-grade</span> UI with
          cinematic motion, razor latency, and cross-platform controls. Drop-in sections,
          HUD chips, and hero animations for your next raid, tourney, or clan launch.
        </p>

        {/* CTAs + tiny stats */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <ShardButton variant="primary" href="#play">Start Raid</ShardButton>
          <HoloButton variant="ghost" href="#trailer">Watch Trailer</HoloButton>
          <RetroPixelButton tone="purple" href="#clan">Join Clan</RetroPixelButton>
        </div>

       <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] font-[Rubik]">
        <span className="rounded-md px-3 py-1 ring-1 ring-white/10 bg-white/5">144Hz Anim</span>
        <span className="rounded-md px-3 py-1 ring-1 ring-white/10 bg-white/5">Controller & KBM</span>
        <span className="rounded-md px-3 py-1 ring-1 ring-white/10 bg-white/5">Cross-Platform UI</span>
        <span className="rounded-md px-3 py-1 ring-1 ring-white/10 bg-white/5">Ultra Low Jank</span>
      </div>
      </motion.div>

      {/* Vertical scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 1 }}
        className="absolute bottom-12 right-1/2 translate-x-1/2 text-[10px] sm:text-xs tracking-[0.3em] uppercase z-20 rotate-90 text-white/90 font-[Rubik]"
      >
        <a href="#Tournament">Scroll Down</a>
      </motion.div>
    </section>
  );
}
