create extension if not exists pgcrypto;

create table if not exists public.users (
  id text primary key default ('usr_' || replace(gen_random_uuid()::text, '-', '')),
  email text not null unique,
  password_hash text not null,
  name text not null default '',
  mobile text not null unique,
  role text not null default 'STUDENT' check (role in ('STUDENT', 'ADMIN')),
  education_type text,
  batch_or_target text,
  status text not null default 'active',
  admin_eligible boolean not null default false,
  profile jsonb not null default '{}'::jsonb,
  joined_at date not null default current_date,
  last_login_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists sessions_user_expiry_idx on public.sessions(user_id, expires_at);

create table if not exists public.password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.content_resources (
  id text primary key,
  category text not null,
  resource_type text not null,
  title text not null,
  description text not null default '',
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_by text references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists content_resources_category_type_idx
  on public.content_resources(category, resource_type, sort_order);

create table if not exists public.assets (
  id text primary key,
  resource_id text references public.content_resources(id) on delete set null,
  category text not null,
  purpose text not null,
  storage_path text not null unique,
  original_name text not null,
  content_type text not null,
  size_bytes bigint not null default 0,
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  metadata jsonb not null default '{}'::jsonb,
  created_by text references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.upload_intents (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  storage_path text not null unique,
  original_name text not null,
  content_type text not null,
  category text not null,
  purpose text not null,
  size_bytes bigint not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  course_id text,
  amount numeric(12,2) not null,
  status text not null default 'pending',
  payment_method text not null default '',
  transaction_id text not null default '',
  details jsonb not null default '{}'::jsonb,
  order_data jsonb not null default '{}'::jsonb,
  reviewed_by text references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_created_idx on public.orders(user_id, created_at desc);
create unique index if not exists orders_transaction_id_unique on public.orders(transaction_id)
  where transaction_id <> '';

create table if not exists public.exam_attempts (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  exam_id text not null,
  category text not null,
  answers jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  answer_sheet_asset_id text references public.assets(id) on delete set null,
  status text not null default 'submitted',
  data jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists exam_attempts_user_exam_idx on public.exam_attempts(user_id, exam_id);

create table if not exists public.ai_question_solutions (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  question_hash text not null,
  question text not null,
  solution text not null,
  created_at timestamptz not null default now(),
  unique(category, question_hash)
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by text references public.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.rate_limit_events (
  id bigint generated always as identity primary key,
  rate_key text not null,
  created_at timestamptz not null default now()
);
create index if not exists rate_limit_events_key_created_idx
  on public.rate_limit_events(rate_key, created_at);
create index if not exists rate_limit_events_created_idx
  on public.rate_limit_events(created_at);

create or replace function public.consume_rate_limit(
  p_key text, p_limit integer, p_window_seconds integer
) returns boolean
language plpgsql security definer set search_path = public
as $$
declare
  event_count integer;
begin
  perform pg_advisory_xact_lock(hashtext(p_key));
  delete from rate_limit_events where created_at < now() - interval '1 day';
  delete from rate_limit_events
    where rate_key = p_key
      and created_at < now() - make_interval(secs => p_window_seconds);
  select count(*) into event_count from rate_limit_events
    where rate_key = p_key
      and created_at >= now() - make_interval(secs => p_window_seconds);
  if event_count >= p_limit then return false; end if;
  insert into rate_limit_events(rate_key) values (p_key);
  return true;
end;
$$;
revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;

create or replace function public.review_payment_order(
  p_order_id text, p_status text, p_admin_id text
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  saved_order jsonb;
  order_user text;
  user_profile jsonb;
  item jsonb;
  enrolled jsonb;
  unlocked jsonb;
begin
  if p_status not in ('approved', 'rejected') then
    raise exception 'অর্ডারের সিদ্ধান্ত সঠিক নয়।';
  end if;
  select order_data, user_id into saved_order, order_user
    from orders where id = p_order_id for update;
  if saved_order is null then raise exception 'অর্ডারটি পাওয়া যায়নি।'; end if;
  if saved_order->>'status' <> 'pending' then
    raise exception 'এই অর্ডারটি আগে থেকেই যাচাই করা হয়েছে।';
  end if;
  if p_status = 'approved' then
    select profile into user_profile from users where id = order_user for update;
    if user_profile is null then raise exception 'অর্ডারের শিক্ষার্থী অ্যাকাউন্ট পাওয়া যায়নি।'; end if;
    enrolled := coalesce(user_profile->'enrolledCourses', '[]'::jsonb);
    unlocked := coalesce(user_profile->'unlockedProducts', '[]'::jsonb);
    for item in select value from jsonb_array_elements(saved_order->'items')
    loop
      if item->>'type' = 'course' and not (enrolled ? (item->>'id')) then
        enrolled := enrolled || jsonb_build_array(item->>'id');
      elsif item->>'type' = 'digital' and not (unlocked ? (item->>'id')) then
        unlocked := unlocked || jsonb_build_array(item->>'id');
      end if;
    end loop;
    update users set profile = jsonb_set(jsonb_set(user_profile, '{enrolledCourses}', enrolled), '{unlockedProducts}', unlocked)
      where id = order_user;
  end if;
  saved_order := jsonb_set(saved_order, '{status}', to_jsonb(p_status));
  update orders set status = p_status, order_data = saved_order, reviewed_by = p_admin_id,
    updated_at = now() where id = p_order_id;
  return saved_order;
end;
$$;
revoke all on function public.review_payment_order(text, text, text) from public, anon, authenticated;
grant execute on function public.review_payment_order(text, text, text) to service_role;

alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.password_reset_tokens enable row level security;
alter table public.content_resources enable row level security;
alter table public.assets enable row level security;
alter table public.upload_intents enable row level security;
alter table public.orders enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.ai_question_solutions enable row level security;
alter table public.site_settings enable row level security;
alter table public.rate_limit_events enable row level security;

insert into storage.buckets (id, name, public, file_size_limit)
values ('academy-files', 'academy-files', false, 5368709120)
on conflict (id) do nothing;