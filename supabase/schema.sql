-- 在 Supabase → SQL Editor 中执行一次

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  constraint profiles_username_unique unique (username)
);

create index if not exists profiles_username_idx on public.profiles (username);

create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  map_id text not null,
  map_title text,
  total int not null,
  correct int not null,
  accuracy numeric(5, 1) not null,
  duration_ms int not null,
  wrong jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists game_sessions_profile_idx on public.game_sessions (profile_id, created_at desc);
create index if not exists game_sessions_map_idx on public.game_sessions (map_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.game_sessions enable row level security;

-- 匿名客户端：注册/登录查昵称、写入成绩（无密码昵称制，请勿存放敏感信息）
create policy "profiles_select" on public.profiles for select to anon using (true);
create policy "profiles_insert" on public.profiles for insert to anon with check (true);
create policy "profiles_update_last_seen" on public.profiles for update to anon using (true);

create policy "game_sessions_insert" on public.game_sessions for insert to anon with check (true);

-- 网页排行榜：只读成绩（不含 service_role）
create policy "game_sessions_select" on public.game_sessions for select to anon using (true);

create or replace function public.get_map_leaderboard(p_map_id text, p_limit int default 25)
returns table (
  username text,
  accuracy numeric,
  duration_ms int,
  correct int,
  total int,
  played_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select username, accuracy, duration_ms, correct, total, played_at
  from (
    select distinct on (g.profile_id)
      p.username,
      g.accuracy,
      g.duration_ms,
      g.correct,
      g.total,
      g.created_at as played_at
    from game_sessions g
    inner join profiles p on p.id = g.profile_id
    where g.map_id = p_map_id
    order by g.profile_id, g.accuracy desc, g.duration_ms asc, g.created_at desc
  ) best_per_user
  order by accuracy desc, duration_ms asc, played_at desc
  limit greatest(1, least(p_limit, 100));
$$;

grant execute on function public.get_map_leaderboard(text, int) to anon;

-- 后台查看：在 Supabase Dashboard 用 service role，或 Table Editor
