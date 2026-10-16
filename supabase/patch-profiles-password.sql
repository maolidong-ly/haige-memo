-- 昵称 + 密码（防冒用同一昵称）· 在 Supabase SQL Editor 执行一次

-- Supabase 把 pgcrypto 装在 extensions 模式里
create extension if not exists pgcrypto with schema extensions;

alter table public.profiles
  add column if not exists password_hash text;

drop policy if exists "profiles_insert" on public.profiles;

create or replace function public.auth_register(p_username text, p_password text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  uid uuid;
  uname text;
begin
  uname := trim(p_username);
  if char_length(uname) < 2 then
    raise exception '昵称至少 2 个字';
  end if;
  if char_length(p_password) < 4 then
    raise exception '密码至少 4 位';
  end if;
  if char_length(p_password) > 64 then
    raise exception '密码最多 64 位';
  end if;

  insert into public.profiles (username, password_hash)
  values (uname, extensions.crypt(p_password, extensions.gen_salt('bf'::text)))
  returning id into uid;

  return json_build_object('id', uid, 'username', uname);
exception
  when unique_violation then
    raise exception '该昵称已注册，请直接登录';
end;
$$;

create or replace function public.auth_login(p_username text, p_password text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  rec public.profiles%rowtype;
  uname text;
begin
  uname := trim(p_username);
  if char_length(uname) < 2 then
    raise exception '昵称至少 2 个字';
  end if;
  if char_length(p_password) < 4 then
    raise exception '密码至少 4 位';
  end if;

  select * into rec from public.profiles where username = uname;
  if not found then
    raise exception '用户不存在，请先注册';
  end if;

  if rec.password_hash is null then
    update public.profiles
    set password_hash = extensions.crypt(p_password, extensions.gen_salt('bf'::text)),
        last_seen_at = now()
    where id = rec.id;
    return json_build_object('id', rec.id, 'username', rec.username, 'password_set', true);
  end if;

  if rec.password_hash = extensions.crypt(p_password, rec.password_hash) then
    update public.profiles set last_seen_at = now() where id = rec.id;
    return json_build_object('id', rec.id, 'username', rec.username);
  end if;

  raise exception '密码错误';
end;
$$;

revoke all on function public.auth_register(text, text) from public;
revoke all on function public.auth_login(text, text) from public;
grant execute on function public.auth_register(text, text) to anon;
grant execute on function public.auth_login(text, text) to anon;

notify pgrst, 'reload schema';
