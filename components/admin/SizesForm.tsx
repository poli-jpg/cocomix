"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import { saveSizes } from "@/app/admin/actions";
import { fcfa, pricePerKg } from "@/lib/format";
import type { Size } from "@/lib/types";

type Row = { id: string; label: string; grams: string; price: string; active: boolean };

function Submit() {
  const { pending } = useFormStatus();
  return <button className="btn-primary" disabled={pending}>{pending ? "Enregistrement…" : "Enregistrer les tarifs"}</button>;
}

export function SizesForm({ sizes }: { sizes: Size[] }) {
  const [state, action] = useFormState(saveSizes, null);
  const [rows, setRows] = useState<Row[]>(
    sizes.map((s) => ({ id: s.id, label: s.label, grams: String(s.grams), price: String(s.price), active: s.is_active }))
  );
  const set = (i: number, patch: Partial<Row>) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  return (
    <form action={action} className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-[14px]">
          <thead className="bg-cream-100/60 text-[12px] uppercase tracking-wider text-cocoa-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Libellé</th>
              <th className="px-5 py-3 font-semibold">Poids (g)</th>
              <th className="px-5 py-3 font-semibold">Prix (FCFA)</th>
              <th className="px-5 py-3 font-semibold">Prix au kilo</th>
              <th className="px-5 py-3 text-center font-semibold">En vente</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cocoa/[0.06]">
            {rows.map((r, i) => {
              const g = parseInt(r.grams, 10), p = parseInt(r.price, 10);
              return (
                <tr key={r.id || `new-${i}`}>
                  <td className="px-5 py-3">
                    <input type="hidden" name="id" value={r.id} />
                    <input name="label" aria-label="Libellé" value={r.label} onChange={(e) => set(i, { label: e.target.value })} className="input py-2" placeholder="250 g" />
                  </td>
                  <td className="px-5 py-3">
                    <input name="grams" aria-label="Poids en grammes" inputMode="numeric" value={r.grams} onChange={(e) => set(i, { grams: e.target.value })} className="input py-2 tabular-nums" placeholder="250" />
                  </td>
                  <td className="px-5 py-3">
                    <input name="price" aria-label="Prix en FCFA" inputMode="numeric" value={r.price} onChange={(e) => set(i, { price: e.target.value })} className="input py-2 tabular-nums" placeholder="1750" />
                  </td>
                  <td className="px-5 py-3 tabular-nums text-cocoa-500">{g > 0 && p >= 0 ? fcfa(pricePerKg(p, g)) : "—"}</td>
                  <td className="px-5 py-3 text-center">
                    <input type="checkbox" name={`active-${i}`} aria-label="En vente" checked={r.active} onChange={(e) => set(i, { active: e.target.checked })} className="h-5 w-5 accent-leaf" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cocoa/[0.06] px-5 py-4">
        <button type="button" onClick={() => setRows((r) => [...r, { id: "", label: "", grams: "", price: "", active: true }])} className="btn-ghost py-2 text-[13px]">
          <Plus className="h-4 w-4" /> Ajouter un format
        </button>
        <div className="flex flex-wrap items-center gap-3">
          {state && (
            <p role="status" className={`rounded-xl px-3 py-2 text-[13px] font-medium ${state.ok ? "bg-leaf-100 text-leaf-600" : "bg-red-50 text-red-700"}`}>{state.message}</p>
          )}
          <Submit />
        </div>
      </div>
    </form>
  );
}
