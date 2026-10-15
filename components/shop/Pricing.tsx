"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { fcfa, pricePerKg } from "@/lib/format";
import type { Product, Size } from "@/lib/types";
import { ProductVisual } from "./Flavors";
import { Reveal } from "./fx";

const BAR = ["#FFD43B", "#2FD48A", "#FF7A2F", "#F7C77E"];
const PACK_BG = ["#FFF6CC", "#D6FBE8", "#FFE3D2", "#FFF0D6"];

export function Pricing({ sizes, packs }: { sizes: Size[]; packs: Product[] }) {
  const { add } = useCart();
  const perKg = sizes.map((s) => pricePerKg(s.price, s.grams));
  const worst = Math.max(...perKg, 1);

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white md:py-28">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-menthe/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-gingembre/20 blur-3xl" />

      <div className="container-page relative grid gap-16 lg:grid-cols-[.95fr_1.05fr]">
        <div id="tarifs" className="scroll-mt-24">
          <Reveal>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-white/50">Tarifs par poids</p>
            <h2 className="mt-3 font-display text-[40px] font-extrabold leading-[0.95] tracking-[-0.04em] md:text-[56px]">
              Même prix,
              <br />
              <span className="text-ananas">toutes saveurs.</span>
            </h2>
          </Reveal>

          <div className="mt-10 space-y-3">
            {sizes.map((s, i) => {
              const saving = Math.round((1 - perKg[i] / worst) * 100);
              return (
                <Reveal key={s.id} delay={i * 0.08} y={18}>
                  <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/25 hover:bg-white/[0.07]">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-[26px] font-extrabold tracking-tight" style={{ color: BAR[i % BAR.length] }}>
                        {s.label}
                      </span>
                      <span className="font-display text-[26px] font-extrabold tabular-nums">{fcfa(s.price)}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: BAR[i % BAR.length] }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(perKg[i] / worst) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
                        />
                      </div>
                      <span className="w-28 text-right text-[13px] tabular-nums text-white/60">{fcfa(perKg[i])}/kg</span>
                      {saving > 0 ? (
                        <span className="w-14 rounded-full bg-white px-2 py-0.5 text-center text-[11px] font-extrabold text-ink">−{saving} %</span>
                      ) : (
                        <span className="w-14" />
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <p className="mt-4 text-[13px] text-white/50">Économie calculée par rapport au prix du kilo en sachet de 50 g.</p>
        </div>

        <div id="packs" className="scroll-mt-24">
          <Reveal>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-white/50">Nos packs</p>
            <h2 className="mt-3 font-display text-[40px] font-extrabold leading-[0.95] tracking-[-0.04em] md:text-[56px]">
              À offrir ou
              <br />
              <span className="text-menthe">à partager.</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {packs.map((p, i) => {
              const out = !p.is_available;
              return (
                <Reveal key={p.id} delay={i * 0.08} y={22}>
                  <motion.article
                    whileHover={{ y: -6, rotate: i % 2 ? 1 : -1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-3xl p-5 text-ink"
                    style={{ backgroundColor: PACK_BG[i % PACK_BG.length] }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-display text-[22px] font-extrabold leading-tight tracking-tight">{p.name}</h3>
                        {p.description && <p className="mt-1 text-[13px] leading-snug text-cocoa-700">{p.description}</p>}
                      </div>
                      <div className={`relative h-20 w-16 flex-none transition duration-500 group-hover:-rotate-12 group-hover:scale-110 ${out ? "opacity-50 grayscale" : ""}`}>
                        <ProductVisual product={p} seed={i * 7 + 40} className="h-full w-full" />
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-5">
                      <span className="font-display text-[28px] font-extrabold tabular-nums">{fcfa(p.price ?? 0)}</span>
                      <motion.button
                        type="button"
                        disabled={out}
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => {
                          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          add(p.id, null, 1, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
                        }}
                        className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white transition group-hover:rotate-90 disabled:opacity-40"
                        aria-label={out ? `${p.name} épuisé` : `Ajouter ${p.name} au panier`}
                      >
                        <Plus className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </motion.article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
