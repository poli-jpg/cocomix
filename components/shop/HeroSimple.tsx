"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowDown, Leaf } from "lucide-react";
import { fcfa } from "@/lib/format";
import { flavorTheme } from "@/lib/theme";
import type { Product } from "@/lib/types";
import { Pouch } from "./Pouch";

/* Photo d'un produit : celle de la base, sinon la photo du projet (public/photos). */
const KEYS = ["lait", "menthe", "gingembre", "ananas", "chocolat"];
const COUNT = ["zéro", "une", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix"];
function photoOf(p: Product): string | null {
  if (p.image_url) return p.image_url;
  const k = KEYS.find((key) => p.slug.includes(key) || p.id === key);
  return k ? `/photos/cocomix-${k}.jpg` : null;
}

const DELAY = 4000;

export function HeroSimple({ flavors, fromPrice }: { flavors: Product[]; fromPrice: number }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const f = flavors[i] ?? flavors[0];
  const t = flavorTheme(f?.color ?? "#FFD43B");

  useEffect(() => {
    if (flavors.length < 2) return;
    const id = setTimeout(() => setI((x) => (x + 1) % flavors.length), DELAY);
    return () => clearTimeout(id);
  }, [i, flavors.length]);

  if (!f) return null;
  const src = photoOf(f);

  return (
    <motion.section
      className="relative overflow-hidden"
      animate={{ backgroundColor: t.softer }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="container-page grid items-center gap-8 pb-14 pt-8 md:grid-cols-[1.2fr_.8fr] md:gap-12 md:pb-20 md:pt-14">
        {/* Texte */}
        <div>
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3.5 py-1.5 text-[12.5px] font-bold text-ink"
          >
            <Leaf className="h-3.5 w-3.5" /> 100 % naturel · sans conservateurs
          </motion.span>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-display text-[52px] font-extrabold leading-[0.92] tracking-[-0.045em] text-ink sm:text-[72px] lg:text-[84px]"
          >
            Croquez
            <br />
            autrement.
          </motion.h1>

          <div className="mt-5 flex h-11 items-center gap-3 text-[20px] font-bold sm:text-[24px]">
            <span className="text-cocoa-500">Saveur</span>
            <span className="relative inline-flex h-full min-w-[9ch] items-center overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={f.id}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="whitespace-nowrap rounded-xl px-3 py-1 text-ink"
                  style={{ backgroundColor: t.base }}
                >
                  {(f.short_name ?? f.name).toLowerCase()}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-cocoa-700">
            Des chips de noix de coco croustillantes, en {COUNT[flavors.length] ?? flavors.length} saveurs. Du petit sachet de 50 g au pack VIP pour vos événements.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#saveurs" className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-[15px] font-bold text-white shadow-lift transition hover:-translate-y-0.5">
              Commander maintenant
              <ArrowDown className="h-4 w-4 transition group-hover:translate-y-0.5" />
            </a>
            <a href="#packs" className="rounded-full border-2 border-ink bg-white/70 px-6 py-[14px] text-[15px] font-bold text-ink transition hover:bg-white">
              Voir les packs
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Choisir une saveur">
            {flavors.map((x, k) => {
              const active = k === i;
              return (
                <button
                  key={x.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setI(k)}
                  className={`rounded-full border-2 px-4 py-2 text-[13px] font-bold transition ${
                    active ? "border-ink text-ink" : "border-transparent bg-white/70 text-cocoa-500 hover:bg-white"
                  }`}
                  style={active ? { backgroundColor: x.color } : undefined}
                >
                  {x.short_name ?? x.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo (taille réduite) */}
        <div className="relative order-first mx-auto w-full max-w-[220px] sm:max-w-[260px] md:order-none md:max-w-[300px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border-2 border-ink bg-white shadow-pop">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={f.id}
                className="absolute inset-0"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                {src ? (
                  <Image src={src} alt={f.name} fill sizes="300px" className="object-cover" priority={i === 0} />
                ) : (
                  <div className="grid h-full place-items-center" style={{ backgroundColor: t.soft }}>
                    <Pouch color={f.color} label={f.short_name ?? f.name} seed={i * 13 + 5} className="w-1/2" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* pastille prix, avec un léger flottement */}
          <motion.div
            className="absolute -bottom-4 -right-4 grid h-20 w-20 place-items-center rounded-full bg-ink text-center text-white shadow-lift sm:h-24 sm:w-24"
            animate={reduce ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="leading-tight">
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-white/60">dès</span>
              <span className="block font-display text-[20px] font-extrabold tabular-nums sm:text-[22px]">{fcfa(fromPrice)}</span>
            </span>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
