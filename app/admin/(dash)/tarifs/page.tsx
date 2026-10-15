import { getAdminCatalog, requireAdmin } from "@/lib/admin";
import { PageHead } from "@/components/admin/ui";
import { SizesForm } from "@/components/admin/SizesForm";

export const metadata = { title: "Tarifs" };

export default async function SizesPage() {
  const ctx = await requireAdmin();
  const { sizes } = await getAdminCatalog(ctx);
  return (
    <>
      <PageHead title="Tarifs par poids" sub="Ces formats et prix s’appliquent à toutes les saveurs. Décoche « En vente » pour masquer un format." />
      <SizesForm sizes={sizes} />
    </>
  );
}
