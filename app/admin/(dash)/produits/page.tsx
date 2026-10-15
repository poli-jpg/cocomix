import { getAdminCatalog, requireAdmin } from "@/lib/admin";
import { PageHead } from "@/components/admin/ui";
import { NewProduct, ProductRow } from "@/components/admin/ProductEditor";

export const metadata = { title: "Produits" };

export default async function ProductsPage() {
  const ctx = await requireAdmin();
  const { products } = await getAdminCatalog(ctx);
  const flavors = products.filter((p) => p.kind === "saveur");
  const packs = products.filter((p) => p.kind === "pack");

  return (
    <>
      <PageHead title="Produits" sub="Saveurs et packs affichés sur la boutique. Ajoute des photos, change la disponibilité ou les prix des packs." />
      <section>
        <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.14em] text-cocoa-500">Saveurs · {flavors.length}</h2>
        <ul className="space-y-3">
          {flavors.map((p, i) => (
            <ProductRow key={p.id} product={p} index={i} />
          ))}
        </ul>
        <div className="mt-3"><NewProduct kind="saveur" /></div>
      </section>
      <section className="mt-10">
        <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.14em] text-cocoa-500">Packs · {packs.length}</h2>
        <ul className="space-y-3">
          {packs.map((p, i) => (
            <ProductRow key={p.id} product={p} index={i + 10} />
          ))}
        </ul>
        <div className="mt-3"><NewProduct kind="pack" /></div>
      </section>
    </>
  );
}
