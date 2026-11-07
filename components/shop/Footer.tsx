import { MessageCircle, Truck } from "lucide-react";
import { formatPhone } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Logo } from "@/components/Logo";

const TIKTOK = "cocomix022";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.59-2.6 2.6 2.6 0 0 1 3.4-2.47V9.67a5.7 5.7 0 0 0-.81-.06 5.69 5.69 0 0 0-5.69 5.69A5.69 5.69 0 0 0 9.86 21a5.69 5.69 0 0 0 5.69-5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.25-1.48Z" />
    </svg>
  );
}

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
          <a
            href={`https://www.tiktok.com/@${TIKTOK}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-[15px] font-bold transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
          >
            <TikTokIcon className="h-5 w-5" /> Suis-nous sur TikTok · @{TIKTOK}
          </a>
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
            <li>
              <a href={`https://www.tiktok.com/@${TIKTOK}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline-offset-4 hover:underline">
                <TikTokIcon className="h-4 w-4" /> TikTok · @{TIKTOK}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-[12px] text-white/40">© {new Date().getFullYear()} Cocomix. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
