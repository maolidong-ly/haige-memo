# 嗨记 · Supabase 一次性配置

## 1. 新建 Free 项目（与 `dili-shuati` 分开）

1. 打开 [Supabase 项目列表](https://supabase.com/dashboard/projects)（须已登录）
2. 点 **New project**
3. 建议名称：**`haige-memo`**（或 `haige-dili`）
4. **Database password**：自己设一串并保存（仅 Postgres 直连用，嗨记网页不用）
5. **Region**：选离学生近的（如 Northeast Asia / Singapore）
6. 等约 1–2 分钟直到项目状态为 **Active**

Free 组织一般最多 **2 个**活跃项目；你已有 `dili-shuati`，再建一个即可。

## 2. 执行建表 SQL

1. 进入新项目 → 左侧 **SQL Editor** → **New query**
2. 打开本目录 `schema.sql`，**全选复制**，粘贴到编辑器
3. 点 **Run**（或 Cmd+Enter），应显示 Success

## 3. 复制 API 给网页

1. 左侧 **Project Settings**（齿轮）→ **API**
2. 复制 **Project URL**
3. 复制 **Project API keys** 里的 **anon** `public`（不要复制 `service_role`）
4. 填入 `static/js/supabase-config.js`：

```js
window.SUPABASE_CONFIG = {
  url: "https://xxxx.supabase.co",
  anonKey: "eyJ...",
};
```

5. 本地用 **http://127.0.0.1:8765/** 打开，应出现昵称登录；完成一次 🎯 挑战后，在 **Table Editor** → `game_sessions` 能看到记录。

## 4. 后台怎么看刷记

- **Table Editor** → `profiles`：昵称、注册时间、最后登录
- **Table Editor** → `game_sessions`：地图、正确率、用时、`wrong` 错题 JSON

也可 **SQL Editor** 跑：

```sql
select p.username, g.map_title, g.accuracy, g.duration_ms, g.created_at
from game_sessions g
join profiles p on p.id = g.profile_id
order by g.created_at desc
limit 50;
```

## 5. 昵称 + 密码（必做，否则注册报 `gen_salt`）

1. 左侧 **Database** → **Extensions**，搜索 **pgcrypto**，点 **Enable**（若已启用可跳过）。
2. **SQL Editor** → **New query**，打开本目录 **`patch-profiles-password.sql`**，**整份复制** → 粘贴 → **Run**（必须看到 Success）。
3. 自检（应返回一行盐值，而不是报错）：

```sql
select extensions.gen_salt('bf'::text);
```

4. 浏览器 **强制刷新**（Cmd+Shift+R）后再试注册。

若仍报 `function gen_salt(unknown) does not exist`，说明第 2 步未成功覆盖 `auth_register` / `auth_login`，请把 SQL Editor 里的红色报错原文发给我。
