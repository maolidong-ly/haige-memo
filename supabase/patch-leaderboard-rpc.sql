-- 在 Supabase SQL Editor 执行（排行榜 + 历史成绩可读）

-- 若尚未执行过，先允许匿名读取（可选，与 RPC 二选一或都保留）
drop policy if exists "game_sessions_select" on public.game_sessions;
create policy "game_sessions_select" on public.game_sessions for select to anon using (true);

-- 排行榜 RPC：不依赖前端直接 SELECT 权限，每人每图取最佳一次
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

revoke all on function public.get_map_leaderboard(text, int) from public;
grant execute on function public.get_map_leaderboard(text, int) to anon;
grant execute on function public.get_map_leaderboard(text, int) to authenticated;
