create table if not exists public.notifications (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  resource_id text not null references public.content_resources(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('course', 'exam', 'book')),
  href text not null,
  created_at timestamptz not null default now(),
  seen_at timestamptz,
  unique (user_id, resource_id)
);

create index if not exists notifications_user_created_idx
  on public.notifications(user_id, created_at desc);

alter table public.notifications enable row level security;
