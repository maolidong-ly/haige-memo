-- 若你已跑过旧版 schema.sql，在 SQL Editor 再执行本文件一次即可开启排行榜

create policy "game_sessions_select" on public.game_sessions for select to anon using (true);
