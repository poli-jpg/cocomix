-- Nouvelle saveur Coco au chocolat + colonne « Nouveauté »
alter table public.products add column if not exists is_new boolean not null default false;

insert into public.products (slug, kind, name, short_name, description, color, image_url, price, is_available, is_new, position)
values ('coco-chocolat', 'saveur', 'Coco au chocolat', 'Chocolat', 'Gourmande et fondante, pour les amoureux du cacao.', '#D9A06B', '/photos/cocomix-chocolat.jpg', null, true, true, 5)
on conflict (slug) do update set is_new = true, image_url = excluded.image_url;

-- les packs passent après les saveurs
update public.products set position = position + 1 where kind = 'pack' and position >= 5;
