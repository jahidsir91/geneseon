alter table public.study_goal_plans
  drop constraint if exists study_goal_plans_id_check;

update public.study_goal_plans
set id = 'SSC'
where id = 'default';

alter table public.study_goal_plans
  add constraint study_goal_plans_id_check check (id in ('SSC', 'HSC', 'JOB'));

alter table public.student_study_goal_cycles
  add column category text not null default 'SSC'
    check (category in ('SSC', 'HSC', 'JOB'));

update public.student_study_goal_cycles as cycles
set category = coalesce(users.education_type, 'SSC')
from public.users
where users.id = cycles.user_id;

alter table public.student_study_goal_cycles
  drop constraint student_study_goal_cycles_pkey;

alter table public.student_study_goal_cycles
  add constraint student_study_goal_cycles_pkey primary key (user_id, category);

alter table public.student_study_goal_completions
  add column category text not null default 'SSC'
    check (category in ('SSC', 'HSC', 'JOB'));

update public.student_study_goal_completions as completions
set category = cycles.category
from public.student_study_goal_cycles as cycles
where cycles.user_id = completions.user_id;

alter table public.student_study_goal_completions
  drop constraint student_study_goal_completions_pkey;

alter table public.student_study_goal_completions
  add constraint student_study_goal_completions_pkey
  primary key (user_id, category, cycle, day_index, goal_index);

drop index if exists public.student_study_goal_completions_cycle_idx;

create index student_study_goal_completions_cycle_idx
  on public.student_study_goal_completions(user_id, category, cycle, day_index);
