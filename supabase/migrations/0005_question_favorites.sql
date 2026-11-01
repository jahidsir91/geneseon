create table if not exists public.student_question_favorites (
  user_id text not null references public.users(id) on delete cascade,
  question_id text not null,
  category text not null check (category in ('SSC', 'HSC', 'JOB')),
  created_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create index if not exists student_question_favorites_category_idx
  on public.student_question_favorites(user_id, category);

alter table public.student_question_favorites enable row level security;
