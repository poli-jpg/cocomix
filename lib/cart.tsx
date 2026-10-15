"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine, Product, Size } from "./types";

type Resolved = CartLine & { product: Product; size: Size | null; unitPrice: number; label: string };

export type Flight = { id: number; x: number; y: number; color: string };

type CartCtx = {
  lines: Resolved[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (productId: string, sizeId?: string | null, qty?: number, origin?: { x: number; y: number }) => void;
  flights: Flight[];
  land: (id: number) => void;
  bump: number;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  toast: string | null;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE = "cocomix-cart-v1";

export function CartProvider({
  products,
  sizes,
  children,
}: {
  products: Product[];
  sizes: Size[];
  children: React.ReactNode;
}) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) || "[]");
      if (Array.isArray(saved)) setRaw(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(raw));
    } catch {}
  }, [raw]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const lines = useMemo<Resolved[]>(() => {
    return raw.flatMap((l): Resolved[] => {
      const product = products.find((p) => p.id === l.productId);
      if (!product || !product.is_available) return [];
      if (product.kind === "saveur") {
        const size = sizes.find((s) => s.id === l.sizeId);
        if (!size) return [];
        return [{ ...l, product, size, unitPrice: size.price, label: size.label }];
      }
      return [{ ...l, product, size: null, unitPrice: product.price ?? 0, label: "Pack" }];
    });
  }, [raw, products, sizes]);

  const add = useCallback(
    (productId: string, sizeId: string | null = null, qty = 1, origin?: { x: number; y: number }) => {
      const key = sizeId ? `${productId}:${sizeId}` : productId;
      setRaw((prev) => {
        const found = prev.find((l) => l.key === key);
        if (found) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
        return [...prev, { key, productId, sizeId, qty }];
      });
      const p = products.find((x) => x.id === productId);
      const s = sizes.find((x) => x.id === sizeId);
      setToast(`${p?.name ?? "Article"}${s ? ` · ${s.label}` : ""} ajouté au panier`);
      if (origin) setFlights((f) => [...f, { id: Date.now() + Math.random(), x: origin.x, y: origin.y, color: p?.color ?? "#FFB800" }]);
      else setBump((b) => b + 1);
    },
    [products, sizes]
  );

  const setQty = useCallback((key: string, qty: number) => {
    setRaw((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(99, qty) } : l))));
  }, []);

  const value: CartCtx = {
    lines,
    count: lines.reduce((s, l) => s + l.qty, 0),
    subtotal: lines.reduce((s, l) => s + l.qty * l.unitPrice, 0),
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    add,
    setQty,
    clear: () => setRaw([]),
    toast,
    flights,
    land: (id: number) => {
      setFlights((f) => f.filter((x) => x.id !== id));
      setBump((b) => b + 1);
    },
    bump,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart doit être utilisé dans CartProvider");
  return c;
}
