-- Cocomix v2 : nouvelles couleurs vives des saveurs.
-- À exécuter une fois dans Supabase > SQL Editor si tu as déjà lancé schema.sql.
update public.products set color = '#F7C77E' where slug = 'coco-au-lait';
update public.products set color = '#2FD48A' where slug = 'coco-menthe';
update public.products set color = '#FF7A2F' where slug = 'coco-gingembre';
update public.products set color = '#FFD43B' where slug = 'coco-ananas';
update public.products set color = '#C98B4E' where kind = 'pack';
