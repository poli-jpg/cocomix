"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ChevronDown, ImagePlus, Plus, Trash2 } from "lucide-react";
import { deleteProduct, saveProduct, type ActionState } from "@/app/admin/actions";
import { fcfa } from "@/lib/format";
import type { Product, ProductKind } from "@/lib/types";
import { Pouch } from "@/components/shop/Pouch";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "Enregistrement…" : label}
    </button>
  );
}

function Feedback({ state }: { state: ActionState }) {
  if (!state) return null;
  return (
    <p role="status" className={`rounded-xl px-3 py-2 text-[13px] font-medium ${state.ok ? "bg-leaf-100 text-leaf-600" : "bg-red-50 text-red-700"}`}>
      {state.message}
    </p>
  );
}

function Fields({ product, kind, onDone }: { product?: Product; kind: ProductKind; onDone?: () => void }) {
  const [state, action] = useFormState(saveProduct, null);
  const [color, setColor] = useState(product?.color ?? (kind === "pack" ? "#D9B07C" : "#F1E4CA"));
  const [preview, setPreview] = useState<string | null>(null);
  const uid = product?.id ?? `new-${kind}`;

  useEffect(() => {
    if (state?.ok && onDone) onDone();
  }, [state, onDone]);

  return (
    <form action={action} className="grid gap-5 md:grid-cols-[160px_1fr]">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="kind" value={kind} />

      <div className="space-y-2">
        <div className="relative grid aspect-[3/4] place-items-center overflow-hidden rounded-2xl" style={{ background: `color-mix(in srgb, ${color} 35%, #fff)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {preview || product?.image_url ? <img src={preview ?? product!.image_url!} alt="" className="h-full w-full object-cover" /> : <Pouch color={color} kraft={kind === "pack"} label={product?.short_name ?? ""} seed={5} className="h-[85%]" />}
        </div>
        <label htmlFor={`img-${uid}`} className="btn-ghost w-full cursor-pointer py-2 text-[13px]">
          <ImagePlus className="h-4 w-4" /> Photo
        </label>
        <input
          id={`img-${uid}`}
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            setPreview(f ? URL.createObjectURL(f) : null);
          }}
        />
        {product?.image_url && (
          <label className="flex items-center gap-2 text-[12px] text-cocoa-500">
            <input type="checkbox" name="remove_image" className="accent-leaf" /> Retirer la photo
          </label>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor={`name-${uid}`}>Nom</label>
          <input id={`name-${uid}`} name="name" required defaultValue={product?.name} className="input" placeholder={kind === "pack" ? "Pack Mbene" : "Coco à la menthe"} />
        </div>
        <div>
          <label className="label" htmlFor={`short-${uid}`}>Nom court <span className="font-normal text-cocoa-300">(étiquette)</span></label>
          <input id={`short-${uid}`} name="short_name" defaultValue={product?.short_name ?? ""} className="input" placeholder={kind === "pack" ? "Mbene" : "Menthe"} />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor={`desc-${uid}`}>Description</label>
          <textarea id={`desc-${uid}`} name="description" rows={2} defaultValue={product?.description ?? ""} className="input resize-none" />
        </div>
        {kind === "pack" ? (
          <div>
            <label className="label" htmlFor={`price-${uid}`}>Prix (FCFA)</label>
            <input id={`price-${uid}`} name="price" inputMode="numeric" required defaultValue={product?.price ?? ""} className="input tabular-nums" placeholder="2000" />
          </div>
        ) : (
          <div className="rounded-xl bg-cream-100 px-3.5 py-2.5 text-[13px] text-cocoa-500">
            Le prix des saveurs dépend du poids. Modifie-le dans <strong className="text-cocoa">Tarifs</strong>.
          </div>
        )}
        <div className="grid grid-cols-[1fr_96px] gap-3">
          <div>
            <label className="label" htmlFor={`color-${uid}`}>Couleur</label>
            <div className="flex items-center gap-2">
              <input id={`color-${uid}`} name="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-[42px] w-12 cursor-pointer rounded-lg border border-cocoa/15 bg-white p-1" />
              <span className="text-[13px] uppercase tabular-nums text-cocoa-500">{color}</span>
            </div>
          </div>
          <div>
            <label className="label" htmlFor={`pos-${uid}`}>Ordre</label>
            <input id={`pos-${uid}`} name="position" inputMode="numeric" defaultValue={product?.position ?? 99} className="input tabular-nums" />
          </div>
        </div>
        <label className="flex items-center gap-3 sm:col-span-2">
          <input type="checkbox" name="is_available" defaultChecked={product?.is_available ?? true} className="h-5 w-5 accent-leaf" />
          <span className="text-[14px] font-semibold">Disponible à la vente</span>
          <span className="text-[13px] text-cocoa-500">Décoche pour afficher « Épuisé ».</span>
        </label>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <Submit label={product ? "Enregistrer" : "Ajouter le produit"} />
          <Feedback state={state} />
        </div>
      </div>
    </form>
  );
}

function DeleteButton({ id }: { id: string }) {
  const [confirm, setConfirm] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  if (!confirm)
    return (
      <button type="button" onClick={() => setConfirm(true)} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-cocoa-500 hover:text-red-700">
        <Trash2 className="h-4 w-4" /> Supprimer
      </button>
    );
  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-[13px]">
      <span className="font-semibold text-red-700">Supprimer définitivement ?</span>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => setMsg((await deleteProduct(id))?.message ?? null))}
        className="rounded-full bg-red-600 px-3 py-1 font-semibold text-white"
      >
        {pending ? "…" : "Oui, supprimer"}
      </button>
      <button type="button" onClick={() => setConfirm(false)} className="font-semibold text-cocoa-500">Annuler</button>
      {msg && <span className="text-cocoa-500">{msg}</span>}
    </span>
  );
}

export function ProductRow({ product, index }: { product: Product; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="card overflow-hidden">
      <div className="flex items-center gap-4 p-4">
        <div className="relative grid h-16 w-14 flex-none place-items-center overflow-hidden rounded-xl" style={{ background: `color-mix(in srgb, ${product.color} 35%, #fff)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {product.image_url ? <img src={product.image_url} alt="" className="h-full w-full object-cover" /> : <Pouch color={product.color} kraft={product.kind === "pack"} seed={index * 7 + 3} className="h-[88%]" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{product.name}</p>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${product.is_available ? "bg-leaf-100 text-leaf-600" : "bg-cocoa/10 text-cocoa-700"}`}>
              {product.is_available ? "Disponible" : "Épuisé"}
            </span>
          </div>
          <p className="truncate text-[13px] text-cocoa-500">
            {product.kind === "pack" ? fcfa(product.price ?? 0) : "Prix selon le poids"} · {product.description}
          </p>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-ghost flex-none py-2 text-[13px]" aria-expanded={open}>
          Modifier <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open && (
        <div className="border-t border-cocoa/[0.06] bg-cream/40 p-5">
          <Fields product={product} kind={product.kind} />
          <div className="mt-5 border-t border-cocoa/[0.06] pt-4">
            <DeleteButton id={product.id} />
          </div>
        </div>
      )}
    </li>
  );
}

export function NewProduct({ kind }: { kind: ProductKind }) {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <button onClick={() => setOpen(true)} className="btn-ghost w-full border-dashed py-3.5">
        <Plus className="h-4 w-4" /> {kind === "pack" ? "Ajouter un pack" : "Ajouter une saveur"}
      </button>
    );
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">{kind === "pack" ? "Nouveau pack" : "Nouvelle saveur"}</h3>
        <button onClick={() => setOpen(false)} className="text-[13px] font-semibold text-cocoa-500 hover:text-cocoa">Annuler</button>
      </div>
      <Fields kind={kind} onDone={() => setOpen(false)} />
    </div>
  );
}
