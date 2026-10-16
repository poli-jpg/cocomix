import type { OrderStatus } from "./types";

export const fcfa = (n: number) =>
  `${new Intl.NumberFormat("fr-FR").format(n).replace(/[\u202f\u00a0 ]/g, "\u00a0")}\u00a0F`;

export const orderRef = (n: number) => `CMX-${String(n).padStart(4, "0")}`;

export const pricePerKg = (price: number, grams: number) => Math.round((price / grams) * 1000);

export const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, "").replace(/^221/, "");
  return d.length === 9 ? `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}` : raw;
};

export const STATUS: Record<OrderStatus, { label: string; tone: string }> = {
  nouvelle: { label: "Nouvelle", tone: "bg-gold-100 text-amber-900 ring-gold/50" },
  confirmee: { label: "Confirmée", tone: "bg-sky-50 text-sky-800 ring-sky-200" },
  en_livraison: { label: "En livraison", tone: "bg-violet-50 text-violet-800 ring-violet-200" },
  livree: { label: "Livrée", tone: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  annulee: { label: "Annulée", tone: "bg-red-50 text-red-700 ring-red-200" },
};

export const dateFR = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

/** Les numéros WhatsApp renseignés (1 ou 2), au format international sans espaces. */
export const whatsappNumbers = (s: { whatsapp: string; whatsapp_2?: string | null }) =>
  [s.whatsapp, s.whatsapp_2 ?? ""].map((n) => n.replace(/\D/g, "")).filter((n) => n.length >= 9);
