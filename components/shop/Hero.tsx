"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowDown, Leaf } from "lucide-react";
import { fcfa } from "@/lib/format";
import { flavorTheme } from "@/lib/theme";
import type { Product } from "@/lib/types";
import { FlakeShape, Pouch } from "./Pouch";

const FLAKES = [
  { left: "6%", top: "18%", w: 64, d: 0, r: -20 },
  { left: "78%", top: "8%", w: 52, d: 0.6, r: 25 },
  { left: "86%", top: "62%", w: 70, d: 1.1, r: -8 },
  { left: "2%", top: "70%", w: 48, d: 1.6, r: 40 },
  { left: "60%", top: "86%", w: 40, d: 0.3, r: 12 },
  { left: "28%", top: "4%", w: 36, d: 2, r: -35 },
];

const TITLE = ["Croquez", "autrement."];

export function Hero({ flavors, fromPrice }: { flavors: Product[]; fromPrice: number }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const f = flavors[i] ?? flavors[0];
  const t = flavorTheme(f?.color ?? "#FFD43B");

  useEffect(() => {
    if (paused || reduce || flavors.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % flavors.length), 3600);
    return () => clearInterval(id);
  }, [paused, reduce, flavors.length]);

  if (!f) return null;

  return (
    <motion.section
      className="relative overflow-hidden"
      animate={{ backgroundColor: t.soft }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* grain léger */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply [background-image:radial-gradient(rgba(21,17,13,.08)_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="container-page relative grid items-center gap-6 pb-14 pt-6 md:grid-cols-[1.05fr_.95fr] md:gap-10 md:pb-24 md:pt-16">
        <div className="relative z-10">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3.5 py-1.5 text-[12.5px] font-bold text-ink"
          >
            <Leaf className="h-3.5 w-3.5" /> 100 % naturel · sans conservateurs
          </motion.span>

          <h1 className="mt-6 font-display text-[56px] font-extrabold leading-[0.9] tracking-[-0.045em] text-ink sm:text-[84px] lg:text-[104px]">
            {TITLE.map((word, w) => (
              <span key={word} className="block overflow-hidden pb-1">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 + w * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <div className="mt-5 flex h-12 items-center gap-3 text-[22px] font-bold sm:text-[26px]">
            <span className="text-cocoa-500">Saveur</span>
            <span className="relative inline-flex h-full min-w-[9ch] items-center overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={f.id}
                  initial={{ y: 40, opacity: 0, rotate: 6 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -40, opacity: 0, rotate: -6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="whitespace-nowrap rounded-xl px-3 py-1 text-ink"
                  style={{ backgroundColor: t.base }}
                >
                  {(f.short_name ?? f.name).toLowerCase()}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-cocoa-700">
            Des chips de noix de coco croustillantes, en quatre saveurs. Du petit sachet de 50 g au pack VIP pour vos événements.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#saveurs" className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-[15px] font-bold text-white shadow-lift transition hover:-translate-y-0.5">
              Commander maintenant
              <ArrowDown className="h-4 w-4 transition group-hover:translate-y-0.5" />
            </a>
            <a href="#packs" className="rounded-full border-2 border-ink bg-white/70 px-6 py-[14px] text-[15px] font-bold text-ink transition hover:bg-white">
              Voir les packs
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Choisir une saveur">
            {flavors.map((x, k) => {
              const active = k === i;
              return (
                <button
                  key={x.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setI(k)}
                  className={`relative overflow-hidden rounded-full border-2 px-4 py-2 text-[13px] font-bold transition ${
                    active ? "border-ink text-ink" : "border-transparent bg-white/60 text-cocoa-500 hover:bg-white"
                  }`}
                >
                  {active && <motion.span layoutId="hero-chip" className="absolute inset-0 -z-10" style={{ backgroundColor: x.color }} />}
                  {active && !paused && !reduce && (
                    <motion.span
                      key={`p${i}`}
                      className="absolute bottom-0 left-0 h-[3px] bg-ink/40"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3.6, ease: "linear" }}
                    />
                  )}
                  {x.short_name ?? x.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Visuel */}
        <div className="relative order-first mx-auto -mb-4 aspect-square w-full max-w-[300px] sm:max-w-[420px] md:order-none md:mb-0 md:max-w-[560px]">
          <motion.div
            className="absolute inset-[8%] rounded-full"
            animate={{ backgroundColor: t.base, scale: [0.94, 1] }}
            transition={{ duration: 0.8 }}
            key={`blob-${f.id}`}
          />
          <motion.div
            aria-hidden
            className="absolute inset-[2%] rounded-full border-2 border-dashed border-ink/20"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />

          {FLAKES.map((fl, k) => (
            <motion.div
              key={k}
              className="absolute z-20"
              style={{ left: fl.left, top: fl.top, width: fl.w }}
              animate={reduce ? undefined : { y: [0, -16, 0], rotate: [fl.r, fl.r + 14, fl.r] }}
              transition={{ duration: 4 + k * 0.4, delay: fl.d, repeat: Infinity, ease: "easeInOut" }}
            >
              <FlakeShape className="w-full drop-shadow-md" />
            </motion.div>
          ))}

          <div className="absolute inset-0 z-10 grid place-items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={f.id}
                className="w-[52%]"
                initial={reduce ? { opacity: 0 } : { y: 80, rotate: -18, scale: 0.7, opacity: 0 }}
                animate={{ y: 0, rotate: -6, scale: 1, opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { y: -60, rotate: 14, scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 16 }}
              >
                <motion.div animate={reduce ? undefined : { y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                  <Pouch color={f.color} label={f.short_name ?? f.name} seed={i * 13 + 5} className="w-full drop-shadow-[0_30px_30px_rgba(21,17,13,.35)]" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            className="absolute bottom-[10%] right-[4%] z-30 grid h-28 w-28 place-items-center rounded-full bg-ink text-center text-white shadow-lift sm:h-32 sm:w-32"
            animate={reduce ? undefined : { rotate: [-8, 8, -8] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="leading-tight">
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-white/60">dès</span>
              <span className="block font-display text-[26px] font-extrabold tabular-nums sm:text-[30px]">{fcfa(fromPrice)}</span>
            </span>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
