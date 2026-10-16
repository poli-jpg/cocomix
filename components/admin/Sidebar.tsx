"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ExternalLink, LayoutDashboard, LogOut, Menu, Package, Receipt, Scale, Settings, X } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/commandes", label: "Commandes", icon: Receipt },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/tarifs", label: "Tarifs", icon: Scale },
  { href: "/admin/reglages", label: "Réglages", icon: Settings },
];

export function Sidebar({ email, newCount }: { email: string; newCount: number }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition ${
            isActive(href) ? "bg-white text-cocoa shadow-soft" : "text-cocoa-500 hover:bg-white/60 hover:text-cocoa"
          }`}
        >
          <Icon className={`h-[18px] w-[18px] ${isActive(href) ? "text-leaf" : ""}`} />
          <span className="flex-1">{label}</span>
          {href === "/admin/commandes" && newCount > 0 && (
            <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold tabular-nums text-cocoa">{newCount}</span>
          )}
        </Link>
      ))}
      <a
        href="/"
        target="_blank"
        className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-cocoa-500 transition hover:bg-white/60 hover:text-cocoa"
      >
        <ExternalLink className="h-[18px] w-[18px]" /> Voir la boutique
      </a>
    </nav>
  );

  const footer = (
    <div className="border-t border-cocoa/10 pt-4">
      <p className="truncate px-3 text-[12px] text-cocoa-500">{email}</p>
      <form action={signOut}>
        <button className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-cocoa-500 transition hover:bg-white/60 hover:text-red-700">
          <LogOut className="h-[18px] w-[18px]" /> Se déconnecter
        </button>
      </form>
    </div>
  );

  const logo = (
    <p className="flex items-center gap-2 px-3">
      <Logo className="h-7 w-auto" />
      <span className=" rounded-md bg-cocoa px-1.5 py-0.5 align-middle font-sans text-[10px] font-bold uppercase tracking-wider text-cream">Admin</span>
    </p>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 flex-none flex-col gap-8 border-r border-cocoa/[0.07] bg-cream-100 p-4 lg:flex">
        {logo}
        {nav}
        {footer}
      </aside>

      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-cocoa/[0.07] bg-cream-100/90 px-4 py-3 backdrop-blur lg:hidden">
        {logo}
        <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-soft" aria-label="Ouvrir le menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-cocoa/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col gap-8 bg-cream-100 p-4 shadow-lift">
            <div className="flex items-center justify-between">
              {logo}
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white" aria-label="Fermer le menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
            {footer}
          </aside>
        </div>
      )}
    </>
  );
}
