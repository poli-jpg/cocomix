"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { fcfa, pricePerKg } from "@/lib/format";
import { flavorTheme } from "@/lib/theme";
import type { Product, Size } from "@/lib/types";
import { Pouch } from "./Pouch";
import { Reveal } from "./fx";

export function ProductVisual({ product, seed, className = "" }: { product: Product; seed: number; className?: string }) {
  if (product.image_url) {
    return <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />;
  }
  return <Pouch color={product.color} label={product.short_name ?? product.name} seed={seed} kraft={product.kind === "pack"} className={className} />;
}

function FlavorCard({ product, sizes, index }: { product: Product; sizes: Size[]; index: number }) {
  const { add } = useCart();
  const reduce = useReducedMotion();
  const [sizeId, setSizeId] = useState(sizes[1]?.id ?? sizes[0]?.id);
  const [pop, setPop] = useState(0);
  const size = sizes.find((s) => s.id === sizeId) ?? sizes[0];
  const out = !product.is_available;
  const t = flavorTheme(product.color);

  // inclinaison 3D au survol
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 200, damping: 18 });

  return (
    <Reveal delay={index * 0.08} className="h-full [perspective:1000px]">
      <motion.article
        ref={ref}
        onMouseMove={(e) => {
          if (reduce || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        style={{ rotateX: rx, rotateY: ry, backgroundColor: t.softer, transformStyle: "preserve-3d" }}
        className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-4xl border-2 border-ink transition-shadow duration-300 hover:shadow-pop"
      >
        <div className="relative aspect-[16/12] overflow-hidden" style={{ backgroundColor: t.base }}>
          <div aria-hidden className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,.9)_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
          <span className="absolute left-4 top-4 z-10 rounded-full bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-ink">
            {product.short_name}
          </span>
          <span className={`absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-[11px] font-bold ${out ? "bg-white text-ink" : "bg-ink text-white"}`}>
            {out ? "Épuisé" : "Disponible"}
          </span>
          <motion.div
            key={pop}
            className={`absolute inset-0 flex items-end justify-center pb-3 pt-12 ${out ? "opacity-50 grayscale" : ""}`}
            style={{ transform: "translateZ(40px)" }}
            animate={pop ? { y: [0, -26, 0], rotate: [0, -8, 0] } : undefined}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {product.image_url ? (
              <ProductVisual product={product} seed={index} />
            ) : (
              <div className="h-full transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:-rotate-6 group-hover:scale-[1.06]">
                <ProductVisual product={product} seed={index * 13 + 5} className="h-full w-auto drop-shadow-[0_18px_18px_rgba(21,17,13,.3)]" />
              </div>
            )}
          </motion.div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div>
            <h3 className="font-display text-[24px] font-extrabold leading-tight tracking-tight text-ink">{product.name}</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-cocoa-700">{product.description}</p>
          </div>

          <fieldset>
            <legend className="sr-only">Choisir le poids</legend>
            <div className="grid grid-cols-4 gap-1 rounded-2xl border-2 border-ink bg-white p-1">
              {sizes.map((s) => {
                const active = s.id === size?.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSizeId(s.id)}
                    aria-pressed={active}
                    className={`relative rounded-xl py-2 text-[12.5px] font-bold transition-colors ${active ? "text-ink" : "text-cocoa-500 hover:text-ink"}`}
                  >
                    {active && (
                      <motion.span
                        layoutId={`size-${product.id}`}
                        className="absolute inset-0 rounded-xl"
                        style={{ backgroundColor: t.base }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-x-2 gap-y-3">
            {size && (
              <div className="shrink-0">
                <div className="h-8">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={size.id}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap font-display text-[24px] font-extrabold leading-8 tabular-nums text-ink"
                    >
                      {fcfa(size.price)}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <p className="mt-1 text-[12px] font-medium tabular-nums text-cocoa-500">{fcfa(pricePerKg(size.price, size.grams))} / kg</p>
              </div>
            )}
            <motion.button
              type="button"
              disabled={out || !size}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                if (!size) return;
                const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                add(product.id, size.id, 1, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
                setPop((p) => p + 1);
              }}
              className="inline-flex flex-none items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[14px] font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Ajouter ${product.name} ${size?.label ?? ""} au panier`}
            >
              <Plus className="h-4 w-4" /> Ajouter
            </motion.button>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

export function Flavors({ flavors, sizes }: { flavors: Product[]; sizes: Size[] }) {
  return (
    <section id="saveurs" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="container-page">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-cocoa-500">Nos saveurs</p>
            <h2 className="mt-3 font-display text-[44px] font-extrabold leading-[0.95] tracking-[-0.04em] text-ink md:text-[64px]">
              Quatre façons
              <br />
              de <span className="relative inline-block">croquer<svg aria-hidden viewBox="0 0 220 18" className="absolute -bottom-2 left-0 w-full"><path d="M3 12 C 60 2, 150 2, 217 10" stroke="#FF7A2F" strokeWidth="7" fill="none" strokeLinecap="round" /></svg></span>
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-cocoa-500">
            Choisis ta saveur et ton format : le prix s’adapte au poids. Plus le sachet est grand, plus le kilo est avantageux.
          </p>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {flavors.map((f, i) => (
            <FlavorCard key={f.id} product={f} sizes={sizes} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
