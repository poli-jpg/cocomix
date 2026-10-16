-- Cocomix : deux numéros WhatsApp.
-- À exécuter une fois dans Supabase > SQL Editor.
alter table public.settings add column if not exists whatsapp_2 text not null default '';

update public.settings
set whatsapp = '221781808213',   -- 78 180 82 13 (principal, reçoit les commandes)
    whatsapp_2 = '221777210907', -- 77 721 09 07
    updated_at = now()
where id = 1;
