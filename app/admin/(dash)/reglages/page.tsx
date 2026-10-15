import { getAdminCatalog, requireAdmin } from "@/lib/admin";
import { PageHead } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata = { title: "Réglages" };

export default async function SettingsPage() {
  const ctx = await requireAdmin();
  const { settings } = await getAdminCatalog(ctx);
  return (
    <>
      <PageHead title="Réglages" sub="Informations affichées sur la boutique." />
      <SettingsForm settings={settings} />
    </>
  );
}
