create table if not exists public.model_test_participations (
  exam_id text not null,
  user_id text not null references public.users(id) on delete cascade,
  attempt_id text not null unique references public.exam_attempts(id) on delete cascade,
  display_name text not null,
  score numeric(12,2),
  submitted_at timestamptz not null default now(),
  status text not null default 'submitted' check (status in ('pending', 'submitted', 'reviewed')),
  primary key (user_id, exam_id)
);

create index if not exists model_test_participations_leaderboard_idx
  on public.model_test_participations(exam_id, score desc, submitted_at asc)
  where score is not null;

insert into public.model_test_participations (
  exam_id, user_id, attempt_id, display_name, score, submitted_at, status
)
select distinct on (attempt.exam_id, attempt.user_id)
  attempt.exam_id,
  attempt.user_id,
  attempt.id,
  coalesce(attempt.data->>'userName', ''),
  case
    when attempt.status = 'pending' or attempt.data->>'cqStatus' = 'pending' then null
    when coalesce(attempt.data->>'score', '') ~ '^-?[0-9]+(\.[0-9]+)?$'
      then (attempt.data->>'score')::numeric
    else null
  end,
  attempt.submitted_at,
  case
    when attempt.status = 'pending' or attempt.data->>'cqStatus' = 'pending' then 'pending'
    when attempt.data->>'cqStatus' = 'reviewed' then 'reviewed'
    else 'submitted'
  end
from public.exam_attempts as attempt
join public.content_resources as exam
  on exam.id = attempt.exam_id and exam.resource_type = 'exams'
order by attempt.exam_id, attempt.user_id, attempt.submitted_at, attempt.created_at, attempt.id
on conflict (user_id, exam_id) do nothing;

create or replace function public.submit_model_test_attempt(
  p_user_id text,
  p_exam_id text,
  p_category text,
  p_attempt jsonb,
  p_answers jsonb,
  p_answer_sheet_asset_id text,
  p_status text,
  p_display_name text,
  p_score numeric,
  p_submitted_at timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if exists (
    select 1 from public.exam_attempts
    where user_id = p_user_id and exam_id = p_exam_id
  ) or exists (
    select 1 from public.model_test_participations
    where user_id = p_user_id and exam_id = p_exam_id
  ) then
    return false;
  end if;

  insert into public.exam_attempts (
    id, user_id, exam_id, category, answers, result, answer_sheet_asset_id,
    status, data, submitted_at
  ) values (
    p_attempt->>'id', p_user_id, p_exam_id, p_category, p_answers, p_attempt,
    p_answer_sheet_asset_id, p_status, p_attempt, p_submitted_at
  );

  insert into public.model_test_participations (
    exam_id, user_id, attempt_id, display_name, score, submitted_at, status
  ) values (
    p_exam_id, p_user_id, p_attempt->>'id', p_display_name, p_score, p_submitted_at, p_status
  );

  return true;
exception
  when unique_violation then
    return false;
end;
$$;

create or replace function public.grade_model_test_attempt(
  p_attempt_id text,
  p_attempt jsonb,
  p_score numeric
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not exists (
    select 1 from public.model_test_participations
    where attempt_id = p_attempt_id
  ) then
    return false;
  end if;

  update public.exam_attempts
  set status = 'reviewed', data = p_attempt, result = p_attempt
  where id = p_attempt_id;
  if not found then
    return false;
  end if;

  update public.model_test_participations
  set score = p_score, status = 'reviewed'
  where attempt_id = p_attempt_id;

  return true;
end;
$$;

alter table public.model_test_participations enable row level security;

revoke all on function public.submit_model_test_attempt(text, text, text, jsonb, jsonb, text, text, text, numeric, timestamptz)
  from public, anon, authenticated;
grant execute on function public.submit_model_test_attempt(text, text, text, jsonb, jsonb, text, text, text, numeric, timestamptz)
  to service_role;
revoke all on function public.grade_model_test_attempt(text, jsonb, numeric)
  from public, anon, authenticated;
grant execute on function public.grade_model_test_attempt(text, jsonb, numeric)
  to service_role;