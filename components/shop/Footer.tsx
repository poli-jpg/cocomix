import { MessageCircle, Truck } from "lucide-react";
import { formatPhone } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Logo } from "@/components/Logo";

export function Footer({ numbers, flavors }: { numbers: string[]; flavors: Product[] }) {
  return (
    <footer className="overflow-hidden bg-ink text-white">
      <div className="container-page grid gap-10 pb-10 pt-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo variant="light" className="mb-6 h-10 w-auto" />
          <p className="max-w-sm font-display text-[32px] font-extrabold leading-tight tracking-[-0.03em]">
            Une envie de coco&nbsp;? <span className="text-menthe">Écris-nous.</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {numbers.map((n) => (
              <a
                key={n}
                href={`https://wa.me/${n}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-[15px] font-bold tabular-nums text-ink transition hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" /> {formatPhone(n)}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-white/40">Saveurs</h4>
          <ul className="mt-4 space-y-2.5 text-[15px] text-white/80">
            {flavors.map((f) => (
              <li key={f.id} className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                {f.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-white/40">Commande</h4>
          <ul className="mt-4 space-y-2.5 text-[15px] text-white/80">
            <li className="flex items-center gap-2"><Truck className="h-4 w-4" /> Livraison partout</li>
            <li>Commande et suivi sur WhatsApp</li>
            {numbers.map((n) => (
              <li key={n} className="tabular-nums">WhatsApp · {formatPhone(n)}</li>
            ))}
          </ul>
        </div>
      </div>
      <p
        aria-hidden
        className="select-none text-center font-display text-[25vw] font-extrabold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,.18)]"
      >
        cocomix
      </p>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-[12px] text-white/40">© {new Date().getFullYear()} Cocomix. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
