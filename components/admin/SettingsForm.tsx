"use client";

import { useFormState, useFormStatus } from "react-dom";
import { saveSettings } from "@/app/admin/actions";
import { formatPhone } from "@/lib/format";
import type { Settings } from "@/lib/types";

function Submit() {
  const { pending } = useFormStatus();
  return <button className="btn-primary" disabled={pending}>{pending ? "Enregistrement…" : "Enregistrer"}</button>;
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action] = useFormState(saveSettings, null);
  return (
    <form action={action} className="card max-w-2xl space-y-6 p-6">
      <div>
        <label htmlFor="whatsapp" className="label">Numéro WhatsApp des commandes</label>
        <input id="whatsapp" name="whatsapp" inputMode="tel" defaultValue={formatPhone(settings.whatsapp)} className="input max-w-xs tabular-nums" />
        <p className="mt-1.5 text-[13px] text-cocoa-500">Les commandes de la boutique arrivent sur ce numéro. Indicatif +221 ajouté automatiquement.</p>
      </div>
      <div>
        <label htmlFor="announcement" className="label">Bandeau en haut de la boutique</label>
        <input id="announcement" name="announcement" maxLength={140} defaultValue={settings.announcement} className="input" />
      </div>
      <div>
        <label htmlFor="delivery_note" className="label">Message sur la livraison (panier)</label>
        <textarea id="delivery_note" name="delivery_note" rows={2} maxLength={200} defaultValue={settings.delivery_note} className="input resize-none" />
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-cocoa/[0.06] pt-5">
        <Submit />
        {state && (
          <p role="status" className={`rounded-xl px-3 py-2 text-[13px] font-medium ${state.ok ? "bg-leaf-100 text-leaf-600" : "bg-red-50 text-red-700"}`}>{state.message}</p>
        )}
      </div>
    </form>
  );
}
