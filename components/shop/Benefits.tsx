"use client";

import { motion } from "framer-motion";
import { HeartHandshake, Leaf, ShieldCheck, Wheat } from "lucide-react";
import { Marquee } from "./fx";

const ITEMS = [
  { icon: Leaf, t: "100 % naturel", d: "Sans additifs.", c: "#2FD48A" },
  { icon: ShieldCheck, t: "Sans conservateurs", d: "Naturellement bon.", c: "#FFD43B" },
  { icon: Wheat, t: "Riche en fibres", d: "Bon pour la santé.", c: "#FF7A2F" },
  { icon: HeartHandshake, t: "Goût authentique", d: "Croquant et savoureux.", c: "#F7C77E" },
];

export function Benefits() {
  return (
    <section className="overflow-hidden bg-cream py-20">
      <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, t, d, c }, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="group rounded-3xl border-2 border-ink bg-white p-6 transition-shadow hover:shadow-pop"
          >
            <motion.span
              className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink text-ink"
              style={{ backgroundColor: c }}
              whileHover={{ rotate: [0, -12, 12, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-6 w-6" />
            </motion.span>
            <h3 className="mt-5 font-display text-[20px] font-extrabold tracking-tight">{t}</h3>
            <p className="mt-1 text-[15px] text-cocoa-500">{d}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-20 -rotate-2 border-y-2 border-ink bg-ananas py-4 font-display text-[28px] font-extrabold uppercase tracking-tight text-ink md:text-[40px]">
        <Marquee items={["Coco au lait", "Coco à la menthe", "Coco au gingembre", "Coco ananas"]} separator="✺" />
      </div>
    </section>
  );
}
