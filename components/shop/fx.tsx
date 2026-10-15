"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart";

/** Apparition au scroll (léger glissement vers le haut). */
export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 28,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Bandeau de texte qui défile en continu. */
export function Marquee({
  items,
  className = "",
  speed = "animate-marquee",
  separator = "✦",
}: {
  items: string[];
  className?: string;
  speed?: string;
  separator?: string;
}) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6">{t}</span>
          <span aria-hidden className="opacity-70">{separator}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-label={items.join(", ")}>
      <div className={`flex w-max motion-reduce:animate-none ${speed}`} aria-hidden>
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}

/** Explosion de confettis aux couleurs des saveurs. */
export function Confetti({ fire, colors = ["#F7C77E", "#2FD48A", "#FF7A2F", "#FFD43B", "#15110D"] }: { fire: number; colors?: string[] }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 46 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 46 + (i % 3) * 0.2;
        const dist = 120 + ((i * 37) % 140);
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 60,
          r: (i * 47) % 360,
          c: colors[i % colors.length],
          w: 6 + (i % 4) * 2,
          round: i % 3 === 0,
        };
      }),
    [colors]
  );
  if (!fire) return null;
  return (
    <div key={fire} className="pointer-events-none absolute left-1/2 top-1/3 z-10" aria-hidden>
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block"
          style={{ width: p.w, height: p.round ? p.w : p.w * 1.8, background: p.c, borderRadius: p.round ? 999 : 2 }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 260], opacity: [1, 1, 0], rotate: p.r + 360, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut", times: [0, 0.35, 1] }}
        />
      ))}
    </div>
  );
}

/** Pastilles qui volent du bouton « Ajouter » jusqu'au panier. */
export function FlyLayer() {
  const { flights, land } = useCart();
  const [target, setTarget] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = document.getElementById("cart-button");
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTarget({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }, [flights.length]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
      {flights.map((f) => (
        <motion.span
          key={f.id}
          className="absolute left-0 top-0 h-6 w-6 rounded-full border-[3px] border-ink shadow-lift"
          style={{ background: f.color }}
          initial={{ x: f.x - 12, y: f.y - 12, scale: 1 }}
          animate={{ x: [f.x - 12, (f.x + target.x) / 2, target.x - 12], y: [f.y - 12, Math.min(f.y, target.y) - 140, target.y - 12], scale: [1, 1.3, 0.4] }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
          onAnimationComplete={() => land(f.id)}
        />
      ))}
    </div>
  );
}
