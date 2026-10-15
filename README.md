# Cocomix · Boutique en ligne

Boutique de chips de noix de coco avec espace admin.
**Stack :** Next.js 14 (App Router) · Supabase (base de données, auth, photos) · Tailwind CSS · Vercel.

## Ce que fait le site

**Boutique (`/`)**
- 4 saveurs, avec un choix du poids (50 g → 1 kg) et un prix qui se met à jour, y compris le prix au kilo
- Tableau des tarifs par poids et les 4 packs
- Quiz « Ta saveur idéale » en 3 questions, qui recommande une saveur et un format
- Panier, puis commande : la commande est **enregistrée dans Supabase** (numéro `CMX-0001`…) et **WhatsApp s’ouvre** avec le message déjà rédigé
- Les prix sont toujours recalculés côté serveur : un client ne peut pas modifier le total

**Admin (`/admin`)**
- Tableau de bord : commandes à traiter, chiffre du mois, panier moyen, ventes sur 7 jours, meilleures ventes
- Commandes : filtres par statut, recherche, changement de statut (Nouvelle → Confirmée → En livraison → Livrée / Annulée), bouton « Écrire au client » sur WhatsApp
- Produits : modifier le nom, la description, la couleur, la photo, la disponibilité (« Épuisé ») et le prix des packs, ajouter ou supprimer des produits
- Tarifs : prix et formats par poids
- Réglages : numéro WhatsApp, bandeau du haut, message sur la livraison

Sans Supabase configuré, le site tourne avec les données de l’affiche, et l’admin s’ouvre en **mode démo** avec des commandes d’exemple.

---

## Mise à jour v2 (nouveau design)

Si tu avais déjà exécuté `schema.sql`, lance aussi `supabase/update-couleurs.sql` dans le SQL Editor pour passer les saveurs aux nouvelles couleurs vives. Puis :

```bash
npm install   # ajoute framer-motion (animations)
npm run dev
```

---

## Installation

### 1. En local

```bash
npm install
cp .env.example .env.local   # puis remplis les 3 variables (étape 2)
npm run dev                  # http://localhost:3000
```

### 2. Supabase

1. Crée un projet sur [supabase.com](https://supabase.com).
2. **SQL Editor → New query** : colle le contenu de `supabase/schema.sql` et clique sur **Run**. Ça crée les tables, la sécurité (RLS), le bucket des photos et les produits de l’affiche.
3. **Project Settings → API** : copie `Project URL`, la clé `anon` et la clé `service_role` dans `.env.local`.
4. **Créer ton compte admin :**
   - **Authentication → Users → Add user** (email + mot de passe, coche « Auto Confirm User »)
   - Puis dans le SQL Editor :
     ```sql
     insert into public.admins (user_id)
     select id from auth.users where email = 'ton-email@exemple.com';
     ```
5. Connecte-toi sur `/admin/login`.

### 3. Vercel

1. Pousse le projet sur GitHub.
2. Sur [vercel.com](https://vercel.com) : **Add New → Project**, importe le dépôt.
3. Dans **Environment Variables**, ajoute les 3 variables de `.env.example`.
4. **Deploy**.

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` ne doit jamais commencer par `NEXT_PUBLIC_` : elle reste côté serveur.

---

## Structure

```
app/
  page.tsx                 Boutique
  actions/order.ts         Création de commande (prix recalculés serveur)
  admin/login/             Connexion
  admin/(dash)/            Tableau de bord, commandes, produits, tarifs, réglages
  admin/actions.ts         Actions admin (statuts, produits, tarifs, réglages)
components/shop/           Header, Hero, saveurs, tarifs & packs, quiz, panier
components/admin/          Menu, formulaires admin
lib/                       Supabase, panier, catalogue, formats
supabase/schema.sql        Base de données + sécurité + données de départ
middleware.ts              Protège /admin
```

## À personnaliser

- **Photos** : Admin → Produits → Modifier → Photo. Elles remplacent les sachets dessinés.
- **Contenu des packs** : écris-le dans la description de chaque pack.
- **Frais de livraison** : Admin → Réglages → message sur la livraison.
