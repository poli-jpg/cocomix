"use client";

import { motion } from "framer-motion";
import { HeartHandshake, Leaf, ShieldCheck, Wheat } from "lucide-react";

const ITEMS = [
  { icon: Leaf, t: "100 % naturel", d: "Sans additifs.", c: "#2FD48A" },
  { icon: ShieldCheck, t: "Sans conservateurs", d: "Naturellement bon.", c: "#FFD43B" },
  { icon: Wheat, t: "Riche en fibres", d: "Bon pour la santé.", c: "#FF7A2F" },
  { icon: HeartHandshake, t: "Goût authentique", d: "Croquant et savoureux.", c: "#F7C77E" },
];

export function Benefits() {
  return (
    <section className="overflow-hidden bg-cream py-12 md:py-20">
      <div className="container-page grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, t, d, c }, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="group rounded-3xl border-2 border-ink bg-white p-4 transition sm:p-6-shadow hover:shadow-pop"
          >
            <motion.span
              className="grid h-11 w-11 place-items-center rounded-2xl sm:h-14 sm:w-14 border-2 border-ink text-ink"
              style={{ backgroundColor: c }}
              whileHover={{ rotate: [0, -12, 12, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.span>
            <h3 className="mt-3 font-display text-[16px] leading-tight sm:mt-5 sm:text-[20px] font-extrabold tracking-tight">{t}</h3>
            <p className="mt-1 text-[13px] text-cocoa-500 sm:text-[15px]">{d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
