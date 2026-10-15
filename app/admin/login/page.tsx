import { hasSupabase } from "@/lib/supabase/server";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Connexion admin" };

export default function LoginPage({ searchParams }: { searchParams: { erreur?: string } }) {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4 py-10">
      <div className="w-full max-w-sm">
        <p className="text-center font-display text-3xl font-extrabold tracking-tight">
          <span className="text-cocoa-700">COCO</span>
          <span className="text-leaf">MIX</span>
        </p>
        <div className="card mt-6 p-6 sm:p-8">
          <h1 className="font-display text-2xl font-bold">Espace admin</h1>
          <p className="mt-1 text-[14px] text-cocoa-500">Connecte-toi pour gérer les commandes et les produits.</p>
          {searchParams.erreur === "acces" && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">
              Ce compte n’a pas accès à l’admin. Ajoute-le dans la table « admins » de Supabase.
            </p>
          )}
          {hasSupabase() ? (
            <LoginForm />
          ) : (
            <div className="mt-6 space-y-4">
              <p className="rounded-xl bg-gold-100 px-3 py-2 text-[13px] text-cocoa-700">
                Supabase n’est pas encore configuré. Tu peux visiter l’admin en mode démo avec des données d’exemple.
              </p>
              <a href="/admin" className="btn-primary w-full">Ouvrir la démo</a>
            </div>
          )}
        </div>
        <p className="mt-6 text-center text-[13px] text-cocoa-500">
          <a href="/" className="hover:text-leaf">← Retour à la boutique</a>
        </p>
      </div>
    </main>
  );
}
