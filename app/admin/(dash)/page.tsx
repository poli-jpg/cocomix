import Link from "next/link";
import { ArrowRight, Clock, Receipt, ShoppingBasket, Wallet } from "lucide-react";
import { getOrders, requireAdmin } from "@/lib/admin";
import { dateFR, fcfa, orderRef } from "@/lib/format";
import { PageHead, StatusBadge } from "@/components/admin/ui";

export default async function Dashboard() {
  const ctx = await requireAdmin();
  const orders = await getOrders(ctx);
  const valid = orders.filter((o) => o.status !== "annulee");

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);

  const today = valid.filter((o) => new Date(o.created_at) >= startOfDay);
  const month = valid.filter((o) => new Date(o.created_at) >= startOfMonth);
  const toHandle = orders.filter((o) => o.status === "nouvelle" || o.status === "confirmee");
  const revenueMonth = month.reduce((s, o) => s + o.total, 0);
  const avg = valid.length ? Math.round(valid.reduce((s, o) => s + o.total, 0) / valid.length) : 0;

  // 7 derniers jours
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfDay);
    d.setDate(d.getDate() - (6 - i));
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const total = valid.filter((o) => new Date(o.created_at) >= d && new Date(o.created_at) < next).reduce((s, o) => s + o.total, 0);
    return { label: new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(d).replace(".", ""), total, isToday: i === 6 };
  });
  const maxDay = Math.max(...days.map((d) => d.total), 1);

  // Meilleures ventes (quantités)
  const top = new Map<string, { qty: number; revenue: number }>();
  for (const o of valid)
    for (const it of o.items) {
      const k = it.name;
      const cur = top.get(k) ?? { qty: 0, revenue: 0 };
      top.set(k, { qty: cur.qty + it.qty, revenue: cur.revenue + it.line_total });
    }
  const best = [...top.entries()].sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5);
  const bestMax = best[0]?.[1].revenue ?? 1;

  const kpis = [
    { label: "À traiter", value: String(toHandle.length), hint: "nouvelles et confirmées", icon: Clock, accent: toHandle.length > 0 },
    { label: "Commandes du jour", value: String(today.length), hint: fcfa(today.reduce((s, o) => s + o.total, 0)), icon: Receipt },
    { label: "Chiffre du mois", value: fcfa(revenueMonth), hint: `${month.length} commande${month.length > 1 ? "s" : ""}`, icon: Wallet },
    { label: "Panier moyen", value: fcfa(avg), hint: "hors annulations", icon: ShoppingBasket },
  ];

  return (
    <>
      <PageHead title="Tableau de bord" sub="L’activité de la boutique en un coup d’œil." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, hint, icon: Icon, accent }) => (
          <div key={label} className={`card p-5 ${accent ? "ring-2 ring-gold/60" : ""}`}>
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-cocoa-500">{label}</p>
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${accent ? "bg-gold-100 text-cocoa" : "bg-leaf-50 text-leaf"}`}>
                <Icon className="h-[18px] w-[18px]" />
              </span>
            </div>
            <p className="mt-3 font-display text-[28px] font-extrabold leading-none tabular-nums">{value}</p>
            <p className="mt-2 text-[12.5px] tabular-nums text-cocoa-500">{hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-bold">Ventes des 7 derniers jours</h2>
            <span className="text-[13px] tabular-nums text-cocoa-500">{fcfa(days.reduce((s, d) => s + d.total, 0))}</span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-3">
            {days.map((d) => (
              <div key={d.label + d.isToday} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[11px] font-semibold tabular-nums text-cocoa-500">{d.total ? `${Math.round(d.total / 1000)}k` : ""}</span>
                <div
                  className={`w-full max-w-[44px] rounded-t-lg ${d.isToday ? "bg-leaf" : "bg-leaf/25"}`}
                  style={{ height: `${Math.max(d.total ? 4 : 1, (d.total / maxDay) * 100)}%` }}
                  title={fcfa(d.total)}
                />
                <span className={`text-[12px] capitalize ${d.isToday ? "font-bold text-cocoa" : "text-cocoa-500"}`}>{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-display text-lg font-bold">Meilleures ventes</h2>
          {best.length === 0 ? (
            <p className="mt-4 text-[14px] text-cocoa-500">Les ventes apparaîtront ici après les premières commandes.</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {best.map(([name, v]) => (
                <li key={name}>
                  <div className="flex items-baseline justify-between gap-3 text-[14px]">
                    <span className="truncate font-semibold">{name}</span>
                    <span className="flex-none tabular-nums text-cocoa-500">{fcfa(v.revenue)}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream-200">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${(v.revenue / bestMax) * 100}%` }} />
                  </div>
                  <p className="mt-1 text-[12px] tabular-nums text-cocoa-500">{v.qty} vendu{v.qty > 1 ? "s" : ""}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="font-display text-lg font-bold">Dernières commandes</h2>
          <Link href="/admin/commandes" className="inline-flex items-center gap-1 text-[14px] font-semibold text-leaf hover:underline">
            Tout voir <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="border-y border-cocoa/[0.06] bg-cream-100/60 text-[12px] uppercase tracking-wider text-cocoa-500">
              <tr>
                <th className="px-6 py-3 font-semibold">N°</th>
                <th className="px-6 py-3 font-semibold">Client</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 text-right font-semibold">Total</th>
                <th className="px-6 py-3 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa/[0.06]">
              {orders.slice(0, 6).map((o) => (
                <tr key={o.id} className="hover:bg-cream/50">
                  <td className="px-6 py-3.5 font-semibold tabular-nums">{orderRef(o.number)}</td>
                  <td className="px-6 py-3.5">
                    <p className="font-medium">{o.customer_name}</p>
                    <p className="text-[12.5px] text-cocoa-500">{o.address}</p>
                  </td>
                  <td className="px-6 py-3.5 text-cocoa-500">{dateFR(o.created_at)}</td>
                  <td className="px-6 py-3.5 text-right font-semibold tabular-nums">{fcfa(o.total)}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
