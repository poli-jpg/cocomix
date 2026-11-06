"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, Leaf, Sparkles } from "lucide-react";
import { fcfa } from "@/lib/format";
import { flavorTheme } from "@/lib/theme";
import type { Product } from "@/lib/types";
import { FlakeShape, Pouch } from "./Pouch";

/* Photo d'un produit : celle de la base, sinon la photo du projet (public/photos). */
const KEYS = ["lait", "menthe", "gingembre", "ananas"];
function photoOf(p: Product): string | null {
  if (p.image_url) return p.image_url;
  const k = KEYS.find((key) => p.slug.includes(key) || p.id === key);
  return k ? `/photos/cocomix-${k}.jpg` : null;
}

const FLAKES = [
  { left: "-4%", top: "14%", w: 58, d: 0, r: -20 },
  { left: "84%", top: "4%", w: 48, d: 0.6, r: 25 },
  { left: "92%", top: "58%", w: 66, d: 1.1, r: -8 },
  { left: "-6%", top: "72%", w: 44, d: 1.6, r: 40 },
  { left: "54%", top: "92%", w: 38, d: 0.3, r: 12 },
];

const TITLE = ["Croquez", "autrement."];
const DELAY = 4200;

export function HeroPhotos({ flavors, fromPrice }: { flavors: Product[]; fromPrice: number }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = flavors.length;
  const f = flavors[i] ?? flavors[0];
  const t = flavorTheme(f?.color ?? "#FFD43B");

  // Défilement automatique des saveurs (pause au survol des photos)
  useEffect(() => {
    if (n < 2 || paused) return;
    const id = setTimeout(() => setI((x) => (x + 1) % n), DELAY);
    return () => clearTimeout(id);
  }, [i, n, paused]);

  // Inclinaison 3D qui suit la souris
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [10, -10]), { stiffness: 140, damping: 16 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [-8, 8]), { stiffness: 140, damping: 16 });

  // Parallaxe au scroll
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const stackY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  if (!f) return null;

  return (
    <motion.section
      ref={ref}
      className="relative overflow-hidden"
      animate={{ backgroundColor: t.soft }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      {/* halo de couleur qui suit la saveur */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] top-[-30%] h-[120%] w-[80%] rounded-full blur-3xl"
        animate={{ backgroundColor: t.base, opacity: 0.55 }}
        transition={{ duration: 0.9 }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply [background-image:radial-gradient(rgba(21,17,13,.08)_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="container-page relative grid items-center gap-10 pb-16 pt-8 md:grid-cols-[1fr_1fr] md:gap-8 md:pb-24 md:pt-16">
        {/* Texte */}
        <motion.div style={reduce ? undefined : { y: textY }} className="relative z-10">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3.5 py-1.5 text-[12.5px] font-bold text-ink"
          >
            <Leaf className="h-3.5 w-3.5" /> 100 % naturel · sans conservateurs
          </motion.span>

          <h1 className="mt-6 font-display text-[56px] font-extrabold leading-[0.9] tracking-[-0.045em] text-ink sm:text-[84px] lg:text-[100px]">
            {TITLE.map((word, w) => (
              <span key={word} className="block overflow-hidden pb-1">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "105%", rotate: 4 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + w * 0.14, ease: [0.2, 0.8, 0.2, 1] }}
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

          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={`d-${f.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="mt-5 min-h-[3.2em] max-w-[44ch] text-[17px] leading-relaxed text-cocoa-700"
            >
              {f.description ?? "Des chips de noix de coco croustillantes, en quatre saveurs."}
            </motion.p>
          </AnimatePresence>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <motion.a
              href="#saveurs"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-7 py-4 text-[15px] font-bold text-white shadow-lift"
            >
              {!reduce && (
                <motion.span
                  aria-hidden
                  className="absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/25"
                  animate={{ x: ["0%", "450%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
                />
              )}
              Commander maintenant
              <ArrowDown className="h-4 w-4 transition group-hover:translate-y-0.5" />
            </motion.a>
            <a href="#packs" className="rounded-full border-2 border-ink bg-white/70 px-6 py-[14px] text-[15px] font-bold text-ink transition hover:bg-white">
              Voir les packs
            </a>
          </div>

          {/* Choix de la saveur */}
          <div className="mt-9 flex flex-wrap gap-2" role="tablist" aria-label="Choisir une saveur">
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
                  {active && <motion.span layoutId="hero-photo-chip" className="absolute inset-0 -z-10" style={{ backgroundColor: x.color }} />}
                  {active && !reduce && !paused && (
                    <motion.span
                      key={`p${i}`}
                      className="absolute bottom-0 left-0 h-[3px] bg-ink/40"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: DELAY / 1000, ease: "linear" }}
                    />
                  )}
                  {x.short_name ?? x.name}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Pile de vraies photos */}
        <motion.div
          style={reduce ? undefined : { y: stackY }}
          className="relative order-first mx-auto aspect-[4/5] w-full max-w-[290px] sm:max-w-[360px] md:order-none md:max-w-[430px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => {
            setPaused(false);
            mx.set(0);
            my.set(0);
          }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
        >
          {/* anneau pointillé qui tourne */}
          <motion.div
            aria-hidden
            className="absolute -inset-[12%] rounded-full border-2 border-dashed border-ink/15"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />

          <motion.div className="relative h-full w-full [perspective:1200px]" style={reduce ? undefined : { rotateX: rotX, rotateY: rotY }}>
            {flavors.map((p, k) => {
              const pos = (k - i + n) % n; // 0 = devant
              const src = photoOf(p);
              const fan = [
                { x: "0%", y: "0%", r: -3, s: 1, z: 40, o: 1 },
                { x: "16%", y: "4%", r: 8, s: 0.9, z: 30, o: 1 },
                { x: "-16%", y: "6%", r: -12, s: 0.84, z: 20, o: 0.9 },
                { x: "2%", y: "10%", r: 3, s: 0.78, z: 10, o: 0 },
              ][Math.min(pos, 3)];
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  aria-label={`Voir ${p.name}`}
                  onClick={() => setI(k)}
                  className="absolute inset-0 overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-pop"
                  style={{ zIndex: fan.z, transformOrigin: "50% 90%" }}
                  initial={false}
                  animate={{ x: fan.x, y: fan.y, rotate: fan.r, scale: fan.s, opacity: fan.o }}
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 20 }}
                  whileHover={pos === 0 ? undefined : { scale: fan.s + 0.03 }}
                >
                  {src ? (
                    <motion.div
                      className="absolute inset-0"
                      animate={pos === 0 && !reduce ? { scale: [1.02, 1.12] } : { scale: 1.02 }}
                      transition={{ duration: DELAY / 1000 + 0.6, ease: "linear" }}
                      key={pos === 0 ? `kb-${i}` : `still-${p.id}`}
                    >
                      <Image
                        src={src}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 80vw, 430px"
                        className="object-cover"
                        priority={k === 0}
                      />
                    </motion.div>
                  ) : (
                    <div className="grid h-full place-items-center" style={{ backgroundColor: flavorTheme(p.color).soft }}>
                      <Pouch color={p.color} label={p.short_name ?? p.name} seed={k * 13 + 5} className="w-1/2" />
                    </div>
                  )}

                  {/* reflet qui balaie la photo de devant */}
                  {pos === 0 && !reduce && (
                    <motion.span
                      key={`shine-${i}`}
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/45 to-transparent"
                      initial={{ x: "0%" }}
                      animate={{ x: "520%" }}
                      transition={{ duration: 1.1, delay: 0.35, ease: "easeOut" }}
                    />
                  )}

                  {/* étiquette de la saveur */}
                  <span
                    className="absolute bottom-4 left-4 rounded-full border-2 border-ink px-3.5 py-1.5 text-[13px] font-extrabold text-ink"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.name}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* éclats de coco qui flottent */}
          {FLAKES.map((fl, k) => (
            <motion.div
              key={k}
              aria-hidden
              className="pointer-events-none absolute z-50"
              style={{ left: fl.left, top: fl.top, width: fl.w }}
              animate={reduce ? undefined : { y: [0, -18, 0], rotate: [fl.r, fl.r + 16, fl.r] }}
              transition={{ duration: 4 + k * 0.5, delay: fl.d, repeat: Infinity, ease: "easeInOut" }}
            >
              <FlakeShape className="w-full drop-shadow-md" />
            </motion.div>
          ))}

          {/* pastille prix */}
          <motion.div
            className="absolute -bottom-5 -right-4 z-50 grid h-28 w-28 place-items-center rounded-full bg-ink text-center text-white shadow-lift sm:h-32 sm:w-32"
            initial={reduce ? false : { scale: 0, rotate: -40 }}
            animate={reduce ? undefined : { scale: 1, rotate: [-8, 8, -8] }}
            transition={{ scale: { type: "spring", delay: 0.6 }, rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
          >
            <span className="leading-tight">
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-white/60">dès</span>
              <span className="block font-display text-[26px] font-extrabold tabular-nums sm:text-[30px]">{fcfa(fromPrice)}</span>
            </span>
          </motion.div>

          {/* badge « fait maison » */}
          <motion.div
            className="absolute -left-5 top-6 z-50 flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1.5 text-[12px] font-extrabold text-ink shadow-soft"
            initial={reduce ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, y: reduce ? 0 : [0, -6, 0] }}
            transition={{ opacity: { delay: 0.8 }, x: { delay: 0.8 }, y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } }}
          >
            <Sparkles className="h-3.5 w-3.5" /> Sans additifs
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
