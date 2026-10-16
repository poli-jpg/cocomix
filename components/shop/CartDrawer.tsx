"use client";

import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { createOrder } from "@/app/actions/order";
import { useCart } from "@/lib/cart";
import { fcfa, formatPhone } from "@/lib/format";
import { tint } from "@/lib/theme";
import { Confetti } from "./fx";
import { Pouch } from "./Pouch";

type Done = { ref: string | null; links: { number: string; url: string }[]; total: number };

export function CartDrawer({ deliveryNote }: { deliveryNote: string }) {
  const { lines, subtotal, isOpen, close, setQty, clear, toast } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cocomix-client") || "{}");
      setForm((f) => ({ ...f, name: saved.name ?? "", phone: saved.phone ?? "", address: saved.address ?? "" }));
    } catch {}
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await createOrder({ ...form, lines: lines.map((l) => ({ productId: l.productId, sizeId: l.sizeId, qty: l.qty })) });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      try {
        localStorage.setItem("cocomix-client", JSON.stringify({ name: form.name, phone: form.phone, address: form.address }));
      } catch {}
      setDone({ ref: res.ref, links: res.whatsapp, total: res.total });
      clear();
      if (res.whatsapp[0]) window.open(res.whatsapp[0].url, "_blank", "noopener");
    });
  };

  const field = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              aria-hidden
            />
            <motion.aside
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Panier"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l-2 border-ink bg-white"
            >
              <div className="flex items-center justify-between border-b-2 border-ink px-5 py-4">
                <h2 className="font-display text-[26px] font-extrabold tracking-tight">Ton panier</h2>
                <button onClick={close} className="grid h-10 w-10 place-items-center rounded-full transition hover:rotate-90 hover:bg-cream-100" aria-label="Fermer le panier">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {done ? (
                <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center">
                  <Confetti fire={1} />
                  <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 14 }}>
                    <CheckCircle2 className="h-16 w-16 text-menthe" strokeWidth={2.4} />
                  </motion.div>
                  <h3 className="mt-4 font-display text-[28px] font-extrabold tracking-tight">Commande enregistrée</h3>
                  {done.ref && <p className="mt-1 rounded-full bg-ananas px-3 py-1 text-[13px] font-extrabold tabular-nums">{done.ref}</p>}
                  <p className="mt-4 text-[15px] text-cocoa-500">
                    Total : <strong className="text-ink">{fcfa(done.total)}</strong>. Dernière étape : envoie le message WhatsApp préparé pour confirmer ta commande.
                  </p>
                  <div className="mt-6 flex w-full flex-col items-center gap-2.5">
                    {done.links.map((l, k) => (
                      <a
                        key={l.number}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full max-w-xs rounded-full px-6 py-3.5 font-bold tabular-nums transition hover:-translate-y-0.5 ${k === 0 ? "bg-[#25D366] text-ink" : "border-2 border-[#25D366] text-ink"}`}
                      >
                        Envoyer au {formatPhone(l.number)}
                      </a>
                    ))}
                  </div>
                  <button onClick={() => { setDone(null); close(); }} className="mt-3 text-[14px] font-bold text-cocoa-500 hover:text-ink">
                    Continuer mes achats
                  </button>
                </div>
              ) : lines.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                  <motion.span
                    animate={{ rotate: [-6, 6, -6] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="grid h-20 w-20 place-items-center rounded-3xl border-2 border-ink bg-ananas"
                  >
                    <ShoppingBag className="h-8 w-8" />
                  </motion.span>
                  <h3 className="mt-5 font-display text-[22px] font-extrabold">Ton panier est vide</h3>
                  <p className="mt-1 text-[14px] text-cocoa-500">Choisis une saveur pour commencer.</p>
                  <a href="#saveurs" onClick={close} className="mt-6 rounded-full bg-ink px-6 py-3 font-bold text-white">Voir les saveurs</a>
                </div>
              ) : (
                <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    <ul className="space-y-3">
                      <AnimatePresence initial={false}>
                        {lines.map((l, i) => (
                          <motion.li
                            key={l.key}
                            layout
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40, height: 0, marginTop: 0 }}
                            className="flex gap-3 rounded-2xl p-3"
                            style={{ backgroundColor: tint(l.product.color, 0.8) }}
                          >
                            <div className="h-16 w-14 flex-none">
                              <Pouch color={l.product.color} kraft={l.product.kind === "pack"} seed={i * 9 + 3} className="h-full w-full" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate font-bold">{l.product.name}</p>
                                  <p className="text-[13px] text-cocoa-700">{l.label} · {fcfa(l.unitPrice)}</p>
                                </div>
                                <button type="button" onClick={() => setQty(l.key, 0)} className="text-cocoa-500 transition hover:text-red-600" aria-label={`Retirer ${l.product.name}`}>
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center rounded-full border-2 border-ink bg-white">
                                  <button type="button" onClick={() => setQty(l.key, l.qty - 1)} className="grid h-8 w-8 place-items-center" aria-label="Diminuer la quantité">
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="w-6 text-center text-[14px] font-bold tabular-nums">{l.qty}</span>
                                  <button type="button" onClick={() => setQty(l.key, l.qty + 1)} className="grid h-8 w-8 place-items-center" aria-label="Augmenter la quantité">
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <span className="font-bold tabular-nums">{fcfa(l.qty * l.unitPrice)}</span>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>

                    <div className="mt-7 space-y-3">
                      <h3 className="font-display text-[20px] font-extrabold tracking-tight">Livraison</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="c-name" className="label">Prénom et nom</label>
                          <input id="c-name" className="input" autoComplete="name" placeholder="Awa Diop" required {...field("name")} />
                        </div>
                        <div>
                          <label htmlFor="c-phone" className="label">Téléphone</label>
                          <input id="c-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="77 123 45 67" required {...field("phone")} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="c-address" className="label">Quartier, ville</label>
                        <input id="c-address" className="input" autoComplete="street-address" placeholder="Pikine Icotaf, Dakar" required {...field("address")} />
                      </div>
                      <div>
                        <label htmlFor="c-note" className="label">Précision <span className="font-normal text-cocoa-300">(facultatif)</span></label>
                        <textarea id="c-note" rows={2} className="input resize-none" placeholder="Saveur pour le pack, point de repère…" {...field("note")} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t-2 border-ink bg-white px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-cocoa-500">Total articles</span>
                      <motion.span key={subtotal} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="font-display text-[28px] font-extrabold tabular-nums">
                        {fcfa(subtotal)}
                      </motion.span>
                    </div>
                    <p className="mt-1 text-[12.5px] text-cocoa-500">{deliveryNote}</p>
                    {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">{error}</p>}
                    <button type="submit" disabled={pending} className="mt-4 w-full rounded-full bg-[#25D366] py-4 text-[16px] font-extrabold text-ink transition hover:-translate-y-0.5 disabled:opacity-60">
                      {pending ? "Envoi…" : "Commander sur WhatsApp"}
                    </button>
                  </div>
                </form>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-[60] flex justify-center px-4" role="status">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast}
              initial={{ y: 40, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="max-w-full truncate rounded-full border-2 border-ink bg-white px-5 py-3 text-[14px] font-bold text-ink shadow-pop"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
