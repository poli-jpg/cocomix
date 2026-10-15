"use server";

import { getCatalog } from "@/lib/catalog";
import { fcfa, orderRef } from "@/lib/format";
import { hasSupabase } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { OrderItem } from "@/lib/types";

type Input = {
  name: string;
  phone: string;
  address: string;
  note?: string;
  lines: { productId: string; sizeId: string | null; qty: number }[];
};

export type OrderResult =
  | { ok: true; ref: string | null; whatsappUrl: string; total: number }
  | { ok: false; error: string };

export async function createOrder(input: Input): Promise<OrderResult> {
  const name = input.name?.trim().slice(0, 80);
  const phone = input.phone?.replace(/[^\d+ ]/g, "").trim().slice(0, 20);
  const address = input.address?.trim().slice(0, 160);
  const note = input.note?.trim().slice(0, 300) || null;

  if (!name) return { ok: false, error: "Indique ton prénom." };
  if (!phone || phone.replace(/\D/g, "").length < 9) return { ok: false, error: "Indique un numéro de téléphone valide (9 chiffres)." };
  if (!address) return { ok: false, error: "Indique ton quartier ou ta ville de livraison." };
  if (!Array.isArray(input.lines) || input.lines.length === 0) return { ok: false, error: "Ton panier est vide." };

  // Les prix sont toujours recalculés côté serveur à partir de la base.
  const { products, sizes, settings } = await getCatalog();
  const items: OrderItem[] = [];
  for (const l of input.lines.slice(0, 40)) {
    const qty = Math.max(1, Math.min(99, Math.floor(Number(l.qty) || 0)));
    const product = products.find((p) => p.id === l.productId && p.is_available);
    if (!product) return { ok: false, error: "Un article de ton panier n'est plus disponible. Retire-le et réessaie." };
    let unit = 0;
    let variant = "Pack";
    if (product.kind === "saveur") {
      const size = sizes.find((s) => s.id === l.sizeId);
      if (!size) return { ok: false, error: "Un format de ton panier n'existe plus. Retire-le et réessaie." };
      unit = size.price;
      variant = size.label;
    } else {
      unit = product.price ?? 0;
    }
    items.push({ product_id: product.id, name: product.name, variant, unit_price: unit, qty, line_total: unit * qty });
  }
  const subtotal = items.reduce((s, i) => s + i.line_total, 0);

  let ref: string | null = null;
  if (hasSupabase() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("orders")
      .insert({ customer_name: name, phone, address, note, items, subtotal, delivery_fee: 0, total: subtotal })
      .select("number")
      .single();
    if (error) return { ok: false, error: "La commande n'a pas pu être enregistrée. Réessaie dans un instant." };
    ref = orderRef(data.number);
  }

  const msg = [
    `Bonjour Cocomix ! Nouvelle commande${ref ? ` ${ref}` : ""} :`,
    ...items.map((i) => `• ${i.qty} × ${i.name}${i.variant !== "Pack" ? ` ${i.variant}` : ""} = ${fcfa(i.line_total)}`),
    `Total : ${fcfa(subtotal)}`,
    `Nom : ${name}`,
    `Téléphone : ${phone}`,
    `Livraison : ${address}`,
    note ? `Note : ${note}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    ok: true,
    ref,
    total: subtotal,
    whatsappUrl: `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`,
  };
}
