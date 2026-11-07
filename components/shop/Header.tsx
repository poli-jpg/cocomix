"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Logo } from "@/components/Logo";

export { Logo };

// Le bandeau défilant du haut a été retiré ; `announcement` reste accepté pour ne rien casser.
export function Header({ hasNew = false }: { announcement: string; hasNew?: boolean }) {
  const { count, open, bump } = useCart();
  const { scrollY } = useScroll();
  const shadow = useTransform(scrollY, [0, 80], ["0 0 0 rgba(0,0,0,0)", "0 10px 30px -18px rgba(21,17,13,.35)"]);

  return (
    <>
      <motion.header style={{ boxShadow: shadow }} className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl">
        <div className="container-page flex h-[68px] items-center justify-between gap-4">
          <a href="#" aria-label="Cocomix, accueil">
            <Logo className="h-8 w-auto sm:h-9" />
          </a>
          <nav className="hidden items-center gap-1 rounded-full bg-cream-100 p-1 text-[14px] font-semibold md:flex">
            {hasNew && (
              <a href="#nouveautes" className="relative flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-white transition hover:bg-cocoa-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ananas opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-ananas" />
                </span>
                Nouveautés
              </a>
            )}
            {[
              ["#saveurs", "Saveurs"],
              ["#tarifs", "Tarifs"],
              ["#packs", "Packs"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="rounded-full px-4 py-2 text-cocoa-500 transition hover:bg-white hover:text-ink hover:shadow-soft">
                {label}
              </a>
            ))}
          </nav>
          {hasNew && (
            <a href="#nouveautes" className="ml-auto flex items-center gap-1.5 rounded-full border-2 border-ink bg-ananas px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wide text-ink md:hidden">
              Nouveau
            </a>
          )}
          <button
            id="cart-button"
            onClick={open}
            className="group relative flex items-center gap-2 rounded-full bg-ink py-2.5 pl-4 pr-2.5 text-[14px] font-semibold text-white transition hover:scale-[1.03] active:scale-95"
            aria-label={`Ouvrir le panier, ${count} article${count > 1 ? "s" : ""}`}
          >
            <ShoppingBag className="h-4 w-4 transition group-hover:-rotate-12" />
            <span>Panier</span>
            <span key={bump} className="grid h-6 min-w-6 animate-bump place-items-center rounded-full bg-ananas px-1.5 text-[12px] font-bold tabular-nums text-ink">
              {count}
            </span>
          </button>
        </div>
      </motion.header>
    </>
  );
}
