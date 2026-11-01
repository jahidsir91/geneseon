create table if not exists public.study_goal_plans (
  id text primary key check (id = 'default'),
  goals jsonb not null,
  updated_by text references public.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.student_study_goal_cycles (
  user_id text primary key references public.users(id) on delete cascade,
  cycle integer not null default 1 check (cycle > 0),
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.student_study_goal_completions (
  user_id text not null references public.users(id) on delete cascade,
  cycle integer not null check (cycle > 0),
  day_index integer not null check (day_index between 1 and 12),
  goal_index integer not null check (goal_index between 0 and 2),
  completed_at timestamptz not null default now(),
  primary key (user_id, cycle, day_index, goal_index)
);

create index if not exists student_study_goal_completions_cycle_idx
  on public.student_study_goal_completions(user_id, cycle, day_index);

alter table public.study_goal_plans enable row level security;
alter table public.student_study_goal_cycles enable row level security;
alter table public.student_study_goal_completions enable row level security;
