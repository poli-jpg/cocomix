import Link from "next/link";
import { MapPin, MessageCircle, Phone, StickyNote } from "lucide-react";
import { getOrders, requireAdmin } from "@/lib/admin";
import { dateFR, fcfa, orderRef, STATUS } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";
import { Empty, PageHead } from "@/components/admin/ui";
import { StatusSelect } from "@/components/admin/StatusSelect";

export const metadata = { title: "Commandes" };

const TABS: { key: string; label: string }[] = [
  { key: "", label: "Toutes" },
  ...(Object.keys(STATUS) as OrderStatus[]).map((k) => ({ key: k, label: STATUS[k].label })),
];

export default async function OrdersPage({ searchParams }: { searchParams: { statut?: string; q?: string } }) {
  const ctx = await requireAdmin();
  const all = await getOrders(ctx);
  const statut = searchParams.statut && searchParams.statut in STATUS ? searchParams.statut : "";
  const q = (searchParams.q ?? "").trim().toLowerCase();
  const orders = all.filter(
    (o) =>
      (!statut || o.status === statut) &&
      (!q || [o.customer_name, o.phone, o.address, orderRef(o.number)].some((v) => v.toLowerCase().includes(q)))
  );
  const counts = all.reduce<Record<string, number>>((acc, o) => ((acc[o.status] = (acc[o.status] ?? 0) + 1), acc), {});

  return (
    <>
      <PageHead title="Commandes" sub={`${all.length} commande${all.length > 1 ? "s" : ""} au total`} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 overflow-x-auto rounded-2xl bg-cream-100 p-1">
          {TABS.map((t) => {
            const active = t.key === statut;
            const n = t.key ? counts[t.key] ?? 0 : all.length;
            return (
              <Link
                key={t.key || "all"}
                href={t.key ? `/admin/commandes?statut=${t.key}` : "/admin/commandes"}
                className={`flex flex-none items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition ${
                  active ? "bg-white text-cocoa shadow-soft" : "text-cocoa-500 hover:text-cocoa"
                }`}
              >
                {t.label}
                <span className={`tabular-nums ${active ? "text-leaf" : "text-cocoa-300"}`}>{n}</span>
              </Link>
            );
          })}
        </div>
        <form className="w-full sm:w-72">
          {statut && <input type="hidden" name="statut" value={statut} />}
          <label htmlFor="q" className="sr-only">Rechercher</label>
          <input id="q" name="q" defaultValue={searchParams.q} placeholder="Nom, téléphone, quartier, N°…" className="input py-2" />
        </form>
      </div>

      {orders.length === 0 ? (
        <Empty title="Aucune commande ici" text="Les commandes passées sur la boutique apparaissent ici dès qu’un client valide son panier." />
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => {
            const wa = o.phone.replace(/\D/g, "");
            const waNum = wa.length === 9 ? `221${wa}` : wa;
            return (
              <li key={o.id} className="card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cocoa/[0.06] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg font-bold tabular-nums">{orderRef(o.number)}</span>
                    <span className="text-[13px] text-cocoa-500">{dateFR(o.created_at)}</span>
                  </div>
                  <StatusSelect id={o.id} status={o.status} />
                </div>
                <div className="grid gap-5 px-5 py-4 md:grid-cols-[1fr_1.3fr]">
                  <div className="space-y-2 text-[14px]">
                    <p className="font-semibold">{o.customer_name}</p>
                    <p className="flex items-center gap-2 text-cocoa-500"><Phone className="h-4 w-4" /> <span className="tabular-nums">{o.phone}</span></p>
                    <p className="flex items-center gap-2 text-cocoa-500"><MapPin className="h-4 w-4" /> {o.address}</p>
                    {o.note && <p className="flex items-start gap-2 rounded-xl bg-gold-100/70 px-3 py-2 text-cocoa-700"><StickyNote className="mt-0.5 h-4 w-4 flex-none" /> {o.note}</p>}
                    <a
                      href={`https://wa.me/${waNum}?text=${encodeURIComponent(`Bonjour ${o.customer_name}, c'est Cocomix pour votre commande ${orderRef(o.number)}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 pt-1 text-[13px] font-semibold text-[#178a45] hover:underline"
                    >
                      <MessageCircle className="h-4 w-4" /> Écrire au client
                    </a>
                  </div>
                  <div>
                    <ul className="divide-y divide-cocoa/[0.06] rounded-xl border border-cocoa/[0.07]">
                      {o.items.map((it, i) => (
                        <li key={i} className="flex items-center justify-between gap-3 px-4 py-2.5 text-[14px]">
                          <span className="min-w-0">
                            <span className="font-semibold tabular-nums">{it.qty} ×</span> {it.name}
                            {it.variant !== "Pack" && <span className="text-cocoa-500"> · {it.variant}</span>}
                          </span>
                          <span className="flex-none tabular-nums text-cocoa-500">{fcfa(it.line_total)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex items-center justify-between px-1">
                      <span className="text-[14px] text-cocoa-500">Total</span>
                      <span className="font-display text-xl font-extrabold tabular-nums">{fcfa(o.total)}</span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
