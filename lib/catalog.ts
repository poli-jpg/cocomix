import { createClient, hasSupabase } from "./supabase/server";
import type { Product, Settings, Size } from "./types";

/** Données de l'affiche, utilisées tant que Supabase n'est pas configuré (aperçu local). */
export const FALLBACK = {
  settings: {
    whatsapp: "221781808213",
    whatsapp_2: "221777210907",
    announcement: "Livraison partout au Sénégal · Commande sur WhatsApp",
    delivery_note: "Frais de livraison confirmés sur WhatsApp selon ta zone.",
  } satisfies Settings,
  sizes: [
    { id: "s50", label: "50 g", grams: 50, price: 500, is_active: true, position: 1 },
    { id: "s250", label: "250 g", grams: 250, price: 1750, is_active: true, position: 2 },
    { id: "s500", label: "500 g", grams: 500, price: 3500, is_active: true, position: 3 },
    { id: "s1000", label: "1 kg", grams: 1000, price: 6500, is_active: true, position: 4 },
  ] satisfies Size[],
  products: [
    p("lait", "saveur", "Coco au lait", "Au lait", "Douce et crémeuse, la saveur classique qui plaît à tout le monde.", "#F7C77E", null, 1),
    p("menthe", "saveur", "Coco à la menthe", "Menthe", "Fraîche et légère, parfaite après le repas ou avec un bon thé.", "#2FD48A", null, 2),
    p("gingembre", "saveur", "Coco au gingembre", "Gingembre", "Une pointe piquante et chaleureuse, pour ceux qui aiment le relevé.", "#FF7A2F", null, 3),
    p("ananas", "saveur", "Coco ananas", "Ananas", "Fruitée et ensoleillée, un goût tropical qui fait voyager.", "#FFD43B", null, 4),
    p("moss", "pack", "Pack Moss Mossat", "Moss Mossat", "Pour goûter et se faire plaisir.", "#C98B4E", 750, 5),
    p("mbene", "pack", "Pack Mbene", "Mbene", "Le pack idéal à partager.", "#C98B4E", 2000, 6),
    p("khewal", "pack", "Pack Khewal", "Khewal", "Pour toute la famille.", "#C98B4E", 5000, 7),
    p("vip", "pack", "Pack VIP", "VIP", "Le grand format pour les événements.", "#C98B4E", 10000, 8),
  ],
};

function p(id: string, kind: Product["kind"], name: string, short: string, desc: string, color: string, price: number | null, position: number): Product {
  return { id, slug: id, kind, name, short_name: short, description: desc, color, image_url: null, price, is_available: true, position };
}

export async function getCatalog(): Promise<{ products: Product[]; sizes: Size[]; settings: Settings }> {
  if (!hasSupabase()) return FALLBACK;
  const supabase = createClient();
  const [pr, sz, st] = await Promise.all([
    supabase.from("products").select("*").order("position"),
    supabase.from("sizes").select("*").eq("is_active", true).order("position"),
    supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
  ]);
  return {
    products: (pr.data as Product[]) ?? [],
    sizes: (sz.data as Size[]) ?? [],
    settings: (st.data as Settings) ?? FALLBACK.settings,
  };
}
