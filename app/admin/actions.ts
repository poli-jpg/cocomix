"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import type { OrderStatus } from "@/lib/types";

export type ActionState = { ok: boolean; message: string } | null;

const DEMO: ActionState = { ok: false, message: "Mode démo : connecte Supabase pour enregistrer les modifications." };
const STATUSES: OrderStatus[] = ["nouvelle", "confirmee", "en_livraison", "livree", "annulee"];
const int = (v: FormDataEntryValue | null) => {
  const n = parseInt(String(v ?? "").replace(/\s/g, ""), 10);
  return Number.isFinite(n) ? n : null;
};
const str = (v: FormDataEntryValue | null, max = 300) => String(v ?? "").trim().slice(0, max);
const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}

export async function signOut() {
  const ctx = await requireAdmin();
  if (!ctx.demo) await ctx.supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateOrderStatus(id: string, status: string): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (ctx.demo) return DEMO;
  if (!STATUSES.includes(status as OrderStatus)) return { ok: false, message: "Statut inconnu." };
  const { error } = await ctx.supabase.from("orders").update({ status }).eq("id", id);
  if (error) return { ok: false, message: "Le statut n'a pas été modifié. Réessaie." };
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Statut mis à jour" };
}

export async function saveProduct(_prev: ActionState, form: FormData): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (ctx.demo) return DEMO;

  const id = str(form.get("id"), 60) || null;
  const kind = form.get("kind") === "pack" ? "pack" : "saveur";
  const name = str(form.get("name"), 80);
  if (!name) return { ok: false, message: "Le nom est obligatoire." };
  const price = kind === "pack" ? int(form.get("price")) : null;
  if (kind === "pack" && (price === null || price < 0)) return { ok: false, message: "Indique le prix du pack en FCFA." };
  const color = /^#[0-9a-fA-F]{6}$/.test(str(form.get("color"), 7)) ? str(form.get("color"), 7) : "#F1E4CA";

  const row: Record<string, unknown> = {
    kind,
    name,
    short_name: str(form.get("short_name"), 30) || name,
    description: str(form.get("description"), 300) || null,
    color,
    price,
    is_available: form.get("is_available") === "on",
    position: int(form.get("position")) ?? 0,
  };

  const file = form.get("image");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) return { ok: false, message: "La photo doit être une image (JPG, PNG ou WebP)." };
    if (file.size > 4 * 1024 * 1024) return { ok: false, message: "La photo dépasse 4 Mo. Réduis-la et réessaie." };
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${slugify(name)}-${Date.now()}.${ext}`;
    const { error: upErr } = await ctx.supabase.storage.from("products").upload(path, file, { contentType: file.type, upsert: true });
    if (upErr) return { ok: false, message: "La photo n'a pas pu être envoyée. Réessaie." };
    row.image_url = ctx.supabase.storage.from("products").getPublicUrl(path).data.publicUrl;
  }
  if (form.get("remove_image") === "on") row.image_url = null;

  if (id) {
    const { error } = await ctx.supabase.from("products").update(row).eq("id", id);
    if (error) return { ok: false, message: "Les modifications n'ont pas été enregistrées. Réessaie." };
  } else {
    row.slug = `${slugify(name)}-${Date.now().toString(36)}`;
    const { error } = await ctx.supabase.from("products").insert(row);
    if (error) return { ok: false, message: "Le produit n'a pas été créé. Réessaie." };
  }
  refresh();
  return { ok: true, message: id ? "Produit enregistré" : "Produit ajouté" };
}

export async function deleteProduct(id: string): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (ctx.demo) return DEMO;
  const { error } = await ctx.supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, message: "Le produit n'a pas été supprimé." };
  refresh();
  return { ok: true, message: "Produit supprimé" };
}

export async function saveSizes(_prev: ActionState, form: FormData): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (ctx.demo) return DEMO;
  const ids = form.getAll("id").map(String);
  for (let i = 0; i < ids.length; i++) {
    const label = str(form.getAll("label")[i], 20);
    const grams = int(form.getAll("grams")[i]);
    const price = int(form.getAll("price")[i]);
    const active = form.get(`active-${i}`) === "on";
    if (!label || !grams || grams <= 0 || price === null || price < 0) {
      if (!ids[i] && !label) continue; // ligne vide
      return { ok: false, message: `Ligne ${i + 1} : remplis le libellé, le poids en grammes et le prix.` };
    }
    const row = { label, grams, price, is_active: active, position: i + 1 };
    const res = ids[i]
      ? await ctx.supabase.from("sizes").update(row).eq("id", ids[i])
      : await ctx.supabase.from("sizes").insert(row);
    if (res.error) return { ok: false, message: "Les tarifs n'ont pas été enregistrés. Réessaie." };
  }
  refresh();
  return { ok: true, message: "Tarifs enregistrés" };
}

export async function saveSettings(_prev: ActionState, form: FormData): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (ctx.demo) return DEMO;
  const norm = (v: FormDataEntryValue | null) => {
    let n = str(v, 20).replace(/\D/g, "");
    if (n.length === 9) n = `221${n}`;
    return n;
  };
  const whatsapp = norm(form.get("whatsapp"));
  const whatsapp_2 = norm(form.get("whatsapp_2"));
  if (whatsapp.length < 11) return { ok: false, message: "Le numéro WhatsApp 1 doit contenir 9 chiffres (ex. 78 180 82 13)." };
  if (whatsapp_2 && whatsapp_2.length < 11) return { ok: false, message: "Le numéro WhatsApp 2 doit contenir 9 chiffres, ou laisse le champ vide." };
  const { error } = await ctx.supabase
    .from("settings")
    .update({
      whatsapp,
      whatsapp_2,
      announcement: str(form.get("announcement"), 140),
      delivery_note: str(form.get("delivery_note"), 200),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) return { ok: false, message: "Les réglages n'ont pas été enregistrés. Réessaie." };
  refresh();
  return { ok: true, message: "Réglages enregistrés" };
}
