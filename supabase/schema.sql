-- =========================================================
-- COCOMIX · Schéma Supabase
-- À exécuter une fois dans Supabase > SQL Editor > New query
-- =========================================================

create extension if not exists pgcrypto;

-- ---------- Admins ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Produits (saveurs + packs) ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  kind text not null check (kind in ('saveur', 'pack')),
  name text not null,
  short_name text,
  description text,
  color text not null default '#F7C77E',
  image_url text,
  price integer,                       -- prix fixe en FCFA (packs uniquement)
  is_available boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Formats / poids (communs à toutes les saveurs) ----------
create table if not exists public.sizes (
  id uuid primary key default gen_random_uuid(),
  label text not null,                 -- "250 g"
  grams integer not null,
  price integer not null,              -- FCFA
  is_active boolean not null default true,
  position integer not null default 0
);

-- ---------- Réglages de la boutique (une seule ligne) ----------
create table if not exists public.settings (
  id integer primary key default 1 check (id = 1),
  whatsapp text not null default '221756574865',
  announcement text not null default 'Livraison partout au Sénégal · Commande sur WhatsApp',
  delivery_note text not null default 'Frais de livraison confirmés sur WhatsApp selon ta zone.',
  updated_at timestamptz not null default now()
);

-- ---------- Commandes ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  number bigint generated always as identity,
  customer_name text not null,
  phone text not null,
  address text not null,
  note text,
  items jsonb not null,                -- [{name, variant, unit_price, qty, line_total}]
  subtotal integer not null,
  delivery_fee integer not null default 0,
  total integer not null,
  status text not null default 'nouvelle'
    check (status in ('nouvelle', 'confirmee', 'en_livraison', 'livree', 'annulee')),
  created_at timestamptz not null default now()
);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- ---------- Sécurité (Row Level Security) ----------
alter table public.admins   enable row level security;
alter table public.products enable row level security;
alter table public.sizes    enable row level security;
alter table public.settings enable row level security;
alter table public.orders   enable row level security;

-- Lecture publique du catalogue
drop policy if exists "catalogue lisible" on public.products;
create policy "catalogue lisible" on public.products for select using (true);
drop policy if exists "formats lisibles" on public.sizes;
create policy "formats lisibles" on public.sizes for select using (true);
drop policy if exists "reglages lisibles" on public.settings;
create policy "reglages lisibles" on public.settings for select using (true);

-- Écriture réservée aux admins
drop policy if exists "admin produits" on public.products;
create policy "admin produits" on public.products for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin formats" on public.sizes;
create policy "admin formats" on public.sizes for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin reglages" on public.settings;
create policy "admin reglages" on public.settings for update using (public.is_admin()) with check (public.is_admin());

-- Commandes : lecture/modification admin uniquement.
-- La création passe par le serveur Next.js (clé service_role), qui recalcule les prix.
drop policy if exists "admin commandes" on public.orders;
create policy "admin commandes" on public.orders for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin se voit" on public.admins;
create policy "admin se voit" on public.admins for select using (user_id = auth.uid());

-- ---------- Stockage des photos produits ----------
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

drop policy if exists "photos publiques" on storage.objects;
create policy "photos publiques" on storage.objects for select using (bucket_id = 'products');
drop policy if exists "admin upload photos" on storage.objects;
create policy "admin upload photos" on storage.objects for insert with check (bucket_id = 'products' and public.is_admin());
drop policy if exists "admin modif photos" on storage.objects;
create policy "admin modif photos" on storage.objects for update using (bucket_id = 'products' and public.is_admin());
drop policy if exists "admin suppr photos" on storage.objects;
create policy "admin suppr photos" on storage.objects for delete using (bucket_id = 'products' and public.is_admin());

-- ---------- Données de départ (affiche Cocomix) ----------
insert into public.settings (id) values (1) on conflict (id) do nothing;

insert into public.sizes (label, grams, price, position)
select * from (values
  ('50 g', 50, 500, 1),
  ('250 g', 250, 1750, 2),
  ('500 g', 500, 3500, 3),
  ('1 kg', 1000, 6500, 4)
) as v(label, grams, price, position)
where not exists (select 1 from public.sizes);

insert into public.products (slug, kind, name, short_name, description, color, price, position) values
  ('coco-au-lait', 'saveur', 'Coco au lait', 'Au lait', 'Douce et crémeuse, la saveur classique qui plaît à tout le monde.', '#F7C77E', null, 1),
  ('coco-menthe', 'saveur', 'Coco à la menthe', 'Menthe', 'Fraîche et légère, parfaite après le repas ou avec un bon thé.', '#2FD48A', null, 2),
  ('coco-gingembre', 'saveur', 'Coco au gingembre', 'Gingembre', 'Une pointe piquante et chaleureuse, pour ceux qui aiment le relevé.', '#FF7A2F', null, 3),
  ('coco-ananas', 'saveur', 'Coco ananas', 'Ananas', 'Fruitée et ensoleillée, un goût tropical qui fait voyager.', '#FFD43B', null, 4),
  ('pack-moss-mossat', 'pack', 'Pack Moss Mossat', 'Moss Mossat', 'Pour goûter et se faire plaisir.', '#C98B4E', 750, 5),
  ('pack-mbene', 'pack', 'Pack Mbene', 'Mbene', 'Le pack idéal à partager.', '#C98B4E', 2000, 6),
  ('pack-khewal', 'pack', 'Pack Khewal', 'Khewal', 'Pour toute la famille.', '#C98B4E', 5000, 7),
  ('pack-vip', 'pack', 'Pack VIP', 'VIP', 'Le grand format pour les événements.', '#C98B4E', 10000, 8)
on conflict (slug) do nothing;

-- ---------- Créer le premier admin ----------
-- 1. Supabase > Authentication > Users > Add user (email + mot de passe)
-- 2. Puis exécute (en remplaçant l'email) :
-- insert into public.admins (user_id) select id from auth.users where email = 'ton-email@exemple.com';
