import type { Product } from "./types";

/** Photos réelles des sachets (public/images/saveurs), associées par mot-clé du nom. */
const PHOTOS: [string, string][] = [
  ["lait", "/images/saveurs/lait.jpg"],
  ["menthe", "/images/saveurs/menthe.jpg"],
  ["gingembre", "/images/saveurs/gingembre.jpg"],
  ["ananas", "/images/saveurs/ananas.jpg"],
  ["chocolat", "/images/saveurs/chocolat.jpg"],
];

/** Photo du produit : celle ajoutée dans l'admin en priorité, sinon la photo fournie. */
export function productPhoto(p: Product): string | null {
  if (p.image_url) return p.image_url;
  const name = p.name.toLowerCase();
  return PHOTOS.find(([k]) => name.includes(k))?.[1] ?? null;
}
