"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/actions";
import { STATUS } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export function StatusSelect({ id, status }: { id: string; status: OrderStatus }) {
  const [value, setValue] = useState(status);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        aria-label="Statut de la commande"
        value={value}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as OrderStatus;
          const prev = value;
          setValue(next);
          setMsg(null);
          start(async () => {
            const res = await updateOrderStatus(id, next);
            if (!res?.ok) {
              setValue(prev);
              setMsg(res?.message ?? "Erreur");
            }
          });
        }}
        className={`cursor-pointer appearance-none rounded-full border-0 py-1.5 pl-3 pr-8 text-[13px] font-semibold ring-1 ring-inset focus:ring-2 focus:ring-leaf ${STATUS[value].tone}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%237A6050'%3E%3Cpath d='M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 8px center",
          backgroundSize: "16px",
        }}
      >
        {(Object.keys(STATUS) as OrderStatus[]).map((s) => (
          <option key={s} value={s}>
            {STATUS[s].label}
          </option>
        ))}
      </select>
      {msg && <span className="max-w-[220px] text-right text-[12px] text-red-700">{msg}</span>}
    </div>
  );
}
