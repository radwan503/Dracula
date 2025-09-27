"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Check,
  Paperclip,
  Trash2,
  UploadCloud,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  Instagram,
} from "lucide-react";

/* ------------------------------ Utilities ------------------------------ */
const emailOk = (v: string) => /\S+@\S+\.\S+/.test(v);
const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

export default function ContactNeonSection() {
  const MAX = 600;
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    topic: "General",
    priority: "Normal",
    message: "",
    consent: false,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(
    null
  );
  const [showTop, setShowTop] = useState(false);
  const dropRef = useRef<HTMLLabelElement>(null);
  const backgroundUrl = "/elements/fantasy-style-scene-with-mountains-landscape_23-2151124960.jpg"


  /* ------------------------------- Derived ------------------------------- */
  const chars = form.message.length;
  const remaining = clamp(MAX - chars, 0, MAX);

  const invalid = useMemo(() => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!emailOk(form.email)) return "Please enter a valid email.";
    if (!form.subject.trim()) return "Please add a subject.";
    if (!form.message.trim()) return "Message can’t be empty.";
    if (!form.consent) return "Please accept the privacy terms.";
    return null;
  }, [form]);

  /* ------------------------------- Handlers ------------------------------ */
  const onFiles = (list: FileList | null) => {
    if (!list || !list.length) return;
    const next = Array.from(list).slice(0, 5); // cap to 5
    setFiles((s) => [...s, ...next].slice(0, 5));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onFiles(e.dataTransfer.files);
    dropRef.current?.classList.remove("ring-cyan-400");
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter") dropRef.current?.classList.add("ring-cyan-400");
    if (e.type === "dragleave") dropRef.current?.classList.remove("ring-cyan-400");
  };

  const send = async () => {
    if (invalid) {
      setStatus({ ok: false, msg: invalid });
      return;
    }
    setSending(true);
    setStatus(null);
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 700));
    setSending(false);
    setStatus({ ok: true, msg: "Message sent! We’ll get back to you soon." });
    setForm({
      name: "",
      email: "",
      subject: "",
      topic: "General",
      priority: "Normal",
      message: "",
      consent: false,
    });
    setFiles([]);
  };

  const resetAll = () => {
    setForm({
      name: "",
      email: "",
      subject: "",
      topic: "General",
      priority: "Normal",
      message: "",
      consent: false,
    });
    setFiles([]);
    setStatus(null);
  };

  /* ------------------------ Scroll To Top Setup ------------------------- */
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /* -------------------------------- Render ------------------------------- */
  return (
    <>
      <div id="Contact" className="relative min-h-screen text-white bg-gradient-to-b from-black via-[#0a0f1a] to-black py-20 md:py-24">
                  <div
        className="absolute inset-0 z-5"
        
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
        
        <div className="relative mx-auto max-w-7xl px-4">
          {/* Banner */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative rounded-2xl overflow-hidden ring-1 ring-white/10"
          >
            <img
              src="/elements/futuristic-ninja-digital-art.jpg"
              alt="Banner"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute left-5 bottom-4">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-red-400 via-cyan-200 to-white bg-clip-text text-transparent">
                Contact & Support Hub
              </h2>
              <p className="text-sm text-white/70">
                Get in touch — we’d love to hear from you.
              </p>
            </div>
          </motion.div>

          {/* Grid: Form + Info */}
          <div className="mt-10 grid lg:grid-cols-3 gap-8 relative z-50">
            {/* --- Form --- */}
            <div className="lg:col-span-2 rounded-2xl bg-[#0b1220]/90 p-6 sm:p-10 ">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-lg bg-[#0f172a] px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-cyan-400"
                />
                <input
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-lg bg-[#0f172a] px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-cyan-400"
                />
                <input
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="sm:col-span-2 rounded-lg bg-[#0f172a] px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-cyan-400"
                />
                <select
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  className="rounded-lg bg-[#0f172a] px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-cyan-400"
                >
                  {["General", "Partnership", "Bug Report", "Account", "Careers"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="rounded-lg bg-[#0f172a] px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-cyan-400"
                >
                  {["Normal", "High", "Urgent"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Write your message…"
                rows={6}
                maxLength={MAX}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-4 w-full rounded-xl bg-[#0f172a] px-3 py-3 text-sm ring-1 ring-white/10 focus:ring-2 focus:ring-cyan-400"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-white/60">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) =>
                      setForm({ ...form, consent: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-white/20 bg-transparent text-cyan-400 focus:ring-0"
                  />
                  I agree to the privacy policy.
                </label>
                <span>
                  {remaining} / {MAX}
                </span>
              </div>

              {/* Attachments */}
              <div className="mt-4">
                <label
                  ref={dropRef}
                  onDrop={handleDrop}
                  onDragOver={handleDrag}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  className="group grid place-items-center min-h-[140px] rounded-xl border border-dashed border-white/15 bg-[#0f172a] px-3 text-center text-sm ring-1 ring-white/5 transition hover:border-cyan-400/50"
                >
                  <input
                    type="file"
                    multiple
                    onChange={(e) => onFiles(e.target.files)}
                    className="hidden"
                  />
                  <UploadCloud className="mb-2 opacity-70 group-hover:text-cyan-300" />
                  <div>
                    Drag & drop files here
                    <span className="text-white/50"> (max 5)</span>
                  </div>
                  <div className="mt-1 text-white/60">or click to browse</div>
                </label>
                <div className="mt-2 space-y-2">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-white/5 px-2 py-1.5 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Paperclip size={14} className="opacity-70" />
                        <span className="truncate">{f.name}</span>
                      </div>
                      <button
                        onClick={() =>
                          setFiles((s) => s.filter((_, k) => k !== i))
                        }
                        className="p-1 rounded hover:bg-white/10"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={send}
                  disabled={!!invalid || sending}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                    sending
                      ? "bg-cyan-400/60 cursor-wait text-black"
                      : invalid
                      ? "bg-red-400/40 cursor-not-allowed text-white"
                      : "bg-red-500 hover:bg-red-400 text-white"
                  }`}
                >
                  {sending ? "Sending…" : "Send Message"}
                </button>
                <button
                  onClick={resetAll}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold bg-white/10 hover:bg-white/20"
                >
                  Reset
                </button>
              </div>

              {/* Status */}
              <AnimatePresence>
                {status && (
                  <motion.div
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    className={`mt-4 rounded-lg px-3 py-2 text-sm ${
                      status.ok
                        ? "bg-emerald-500/15 text-emerald-200"
                        : "bg-rose-500/15 text-rose-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {status.ok && <Check size={16} />}
                      <span>{status.msg}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- Contact Info --- */}
            <div className="space-y-8">
                {/* Info Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a0f11] via-[#111827] to-[#0b0f1a] p-6"
                >
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.4),transparent_70%)]" />
                    <h3 className="text-xl font-bold tracking-wide mb-4 bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
                    Contact Information
                    </h3>

                    <div className="space-y-3 text-sm text-white/80">
                    <p className="flex items-center gap-3 hover:text-cyan-300 transition">
                        <span className="p-2 rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/30">
                        <Mail size={16} />
                        </span>
                        support@dracula.dev
                    </p>
                    <p className="flex items-center gap-3 hover:text-cyan-300 transition">
                        <span className="p-2 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/30">
                        <Phone size={16} />
                        </span>
                        +1 (555) 123-4567
                    </p>
                    <p className="flex items-center gap-3 hover:text-cyan-300 transition">
                        <span className="p-2 rounded-lg bg-fuchsia-500/10 ring-1 ring-fuchsia-500/30">
                        <MapPin size={16} />
                        </span>
                        123 Gaming St, Esports City
                    </p>
                    </div>
                </motion.div>

                {/* Social Links */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b0f1a] p-6"
                >
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.4),transparent_70%)]" />
                    <h3 className="text-xl font-bold tracking-wide mb-4 bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
                    Connect With Us
                    </h3>
                    <div className="flex gap-5">
                    {[
                        { Icon: Twitter, color: "hover:text-sky-400" },
                        { Icon: Linkedin, color: "hover:text-blue-400" },
                        { Icon: Github, color: "hover:text-gray-300" },
                        { Icon: Instagram, color: "hover:text-pink-400" },
                    ].map(({ Icon, color }, i) => (
                        <motion.div
                        key={i}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        className={`p-3 rounded-full bg-white/5 ring-1 ring-white/10 cursor-pointer transition ${color}`}
                        >
                        <Icon size={20} />
                        </motion.div>
                    ))}
                    </div>
                </motion.div>

                {/* Extra: Quick Links / Help */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="rounded-2xl bg-[#0f172a]/90 p-6 shadow-inner"
                >
                    <h3 className="text-lg font-semibold mb-3 text-white">Need Quick Help?</h3>
                    <ul className="space-y-2 text-sm text-white/70">
                    <li className="hover:text-cyan-400 cursor-pointer">📖 Knowledge Base</li>
                    <li className="hover:text-cyan-400 cursor-pointer">⚡ System Status</li>
                    <li className="hover:text-cyan-400 cursor-pointer">🎮 Join Discord</li>
                    </ul>
                </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Footer --- */}
      <footer className="relative py-6 border-t border-white/10 text-center text-sm text-white/60 bg-black">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">Dracula UI</span>. All
          rights reserved.
        </p>
      </footer>

      {/* --- Scroll To Top --- */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-red-500 hover:bg-red-400 text-white shadow-lg ring-1 ring-white/10"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
