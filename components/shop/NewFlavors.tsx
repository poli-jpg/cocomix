import { Sparkles } from "lucide-react";
import type { Product, Size } from "@/lib/types";
import { fcfa } from "@/lib/format";
import { FlavorCard } from "./Flavors";
import { Reveal } from "./fx";

/* Section « Nouveautés » : visible seulement quand une saveur est cochée « Nouveauté » dans l'admin. */
export function NewFlavors({ flavors, sizes }: { flavors: Product[]; sizes: Size[] }) {
  const one = flavors.length === 1;
  const from = Math.min(...sizes.map((s) => s.price));
  return (
    <section id="nouveautes" className="scroll-mt-24 bg-cream-100 py-20 md:py-24">
      <div className="container-page grid items-center gap-10 md:grid-cols-[1fr_minmax(0,380px)] lg:gap-16">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-ananas px-3.5 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.18em] text-ink">
            <Sparkles className="h-3.5 w-3.5" /> Nouveauté
          </p>
          <h2 className="mt-5 font-display text-[44px] font-extrabold leading-[0.95] tracking-[-0.04em] text-ink md:text-[64px]">
            {one ? (
              <>
                Nouvelle saveur&nbsp;:
                <br />
                <span className="text-cocoa-700">{flavors[0].name.toLowerCase()}</span>
              </>
            ) : (
              <>Nos nouvelles saveurs</>
            )}
          </h2>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-cocoa-700">
            {one ? flavors[0].description : "Les dernières saveurs Cocomix, à découvrir dès maintenant."} Même prix que les autres saveurs, dès{" "}
            {Number.isFinite(from) ? fcfa(from) : ""}, et même commande sur WhatsApp.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2 text-[13px] font-bold text-ink">
            {sizes.map((s) => (
              <li key={s.id} className="rounded-full border-2 border-ink bg-white px-3.5 py-1.5 tabular-nums">
                {s.label} · {fcfa(s.price)}
              </li>
            ))}
          </ul>
        </Reveal>
        <div className={one ? "" : "grid gap-6 sm:grid-cols-2"}>
          {flavors.map((f, i) => (
            <FlavorCard key={f.id} product={f} sizes={sizes} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
