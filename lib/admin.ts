import "server-only";
import { redirect } from "next/navigation";
import { FALLBACK } from "./catalog";
import { createClient, hasSupabase } from "./supabase/server";
import type { Order, Product, Settings, Size } from "./types";

export type AdminCtx =
  | { demo: true; email: string }
  | { demo: false; email: string; supabase: ReturnType<typeof createClient> };

/** Vérifie que l'utilisateur connecté est admin. Sans Supabase configuré : mode démo. */
export async function requireAdmin(): Promise<AdminCtx> {
  if (!hasSupabase()) return { demo: true, email: "demo@cocomix.sn" };
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin/login?erreur=acces");
  return { demo: false, email: user.email ?? "", supabase };
}

export async function getOrders(ctx: AdminCtx, opts: { status?: string; limit?: number } = {}): Promise<Order[]> {
  if (ctx.demo) {
    const list = DEMO_ORDERS.filter((o) => !opts.status || o.status === opts.status);
    return opts.limit ? list.slice(0, opts.limit) : list;
  }
  let q = ctx.supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (opts.status) q = q.eq("status", opts.status);
  q = q.limit(opts.limit ?? 500);
  const { data } = await q;
  return (data as Order[]) ?? [];
}

export async function getAdminCatalog(ctx: AdminCtx): Promise<{ products: Product[]; sizes: Size[]; settings: Settings }> {
  if (ctx.demo) return { ...FALLBACK, sizes: FALLBACK.sizes };
  const [pr, sz, st] = await Promise.all([
    ctx.supabase.from("products").select("*").order("position"),
    ctx.supabase.from("sizes").select("*").order("position"),
    ctx.supabase.from("settings").select("whatsapp, announcement, delivery_note").eq("id", 1).maybeSingle(),
  ]);
  return {
    products: (pr.data as Product[]) ?? [],
    sizes: (sz.data as Size[]) ?? [],
    settings: (st.data as Settings) ?? FALLBACK.settings,
  };
}

/* ---------- Données d'exemple pour le mode démo ---------- */
const now = Date.now();
const h = (n: number) => new Date(now - n * 3600_000).toISOString();
const it = (name: string, variant: string, unit: number, qty: number) => ({
  product_id: name,
  name,
  variant,
  unit_price: unit,
  qty,
  line_total: unit * qty,
});
function o(number: number, hoursAgo: number, name: string, phone: string, address: string, items: ReturnType<typeof it>[], status: Order["status"], note: string | null = null): Order {
  const subtotal = items.reduce((s, i) => s + i.line_total, 0);
  return { id: `demo-${number}`, number, customer_name: name, phone, address, note, items, subtotal, delivery_fee: 0, total: subtotal, status, created_at: h(hoursAgo) };
}
const DEMO_ORDERS: Order[] = [
  o(18, 0.4, "Awa Diop", "77 123 45 67", "Pikine Icotaf, Dakar", [it("Coco à la menthe", "250 g", 1750, 2), it("Coco au lait", "50 g", 500, 3)], "nouvelle"),
  o(17, 1.6, "Moussa Ndiaye", "78 456 12 90", "Parcelles U17, Dakar", [it("Pack Khewal", "Pack", 5000, 1)], "nouvelle", "Saveur ananas pour le pack"),
  o(16, 3.2, "Fatou Sarr", "76 220 33 81", "Rufisque centre", [it("Coco au gingembre", "500 g", 3500, 1), it("Coco ananas", "250 g", 1750, 1)], "confirmee"),
  o(15, 6, "Ibrahima Fall", "70 998 41 22", "Thiès, Grand Standing", [it("Pack VIP", "Pack", 10000, 1)], "en_livraison"),
  o(14, 22, "Khady Ba", "77 650 08 14", "Guédiawaye, Golf Sud", [it("Coco au lait", "1 kg", 6500, 1)], "livree"),
  o(13, 27, "Ousmane Sy", "78 301 77 05", "Keur Massar", [it("Pack Mbene", "Pack", 2000, 2), it("Coco à la menthe", "50 g", 500, 4)], "livree"),
  o(12, 49, "Mariama Diallo", "76 811 92 40", "Mermoz, Dakar", [it("Coco ananas", "500 g", 3500, 1)], "livree"),
  o(11, 53, "Cheikh Mbaye", "77 402 55 63", "Yeumbeul Nord", [it("Pack Moss Mossat", "Pack", 750, 4)], "annulee"),
  o(10, 75, "Aminata Gueye", "70 245 67 18", "Mbour, Saly", [it("Coco au gingembre", "250 g", 1750, 2), it("Coco au lait", "250 g", 1750, 2)], "livree"),
];
