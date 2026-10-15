import { Sidebar } from "@/components/admin/Sidebar";
import { getOrders, requireAdmin } from "@/lib/admin";

export const metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireAdmin();
  const nouvelles = await getOrders(ctx, { status: "nouvelle", limit: 99 });

  return (
    <div className="min-h-screen bg-cream lg:flex">
      <Sidebar email={ctx.email} newCount={nouvelles.length} />
      <div className="min-w-0 flex-1">
        {ctx.demo && (
          <div className="bg-gold-100 px-4 py-2 text-center text-[13px] font-medium text-cocoa-700">
            Mode démo avec des données d’exemple. Connecte Supabase (voir README) pour gérer la vraie boutique.
          </div>
        )}
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
