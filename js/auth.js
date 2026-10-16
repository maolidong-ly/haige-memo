/**
 * 免密昵称登录 + 挑战成绩上报 Supabase
 */
window.HaigeAuth = (function () {
  "use strict";

  const STORAGE_PROFILE = "geo-memo-profile-v1";

  let client = null;
  let profile = null;
  let configured = false;

  function isLocalHost() {
    const h = location.hostname;
    return h === "127.0.0.1" || h === "localhost";
  }

  function isConfigured() {
    const c = window.SUPABASE_CONFIG;
    return Boolean(c?.url && c?.anonKey);
  }

  function requiresLogin() {
    return isConfigured();
  }

  function loadSession() {
    try {
      const raw = localStorage.getItem(STORAGE_PROFILE);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data?.id && data?.username) return data;
    } catch {
      /* ignore */
    }
    return null;
  }

  function saveSession(p) {
    profile = p;
    localStorage.setItem(STORAGE_PROFILE, JSON.stringify(p));
  }

  function clearSession() {
    profile = null;
    localStorage.removeItem(STORAGE_PROFILE);
  }

  function normalizeUsername(raw) {
    return String(raw || "")
      .trim()
      .replace(/\s+/g, "")
      .slice(0, 24);
  }

  function validateUsername(name) {
    if (name.length < 2) return "昵称至少 2 个字";
    if (name.length > 24) return "昵称最多 24 个字";
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9_\-]+$/.test(name)) {
      return "仅支持中文、字母、数字、下划线、连字符";
    }
    return null;
  }

  function validatePassword(pwd) {
    const p = String(pwd || "");
    if (p.length < 4) return "密码至少 4 位";
    if (p.length > 64) return "密码最多 64 位";
    return null;
  }

  function profileFromRow(row) {
    return { id: row.id, username: row.username };
  }

  function friendlyNetworkError(err) {
    const msg = String(err?.message || err || "");
    if (/failed to fetch|networkerror|load failed|network request failed|超时/i.test(msg)) {
      return "网络连不上登录服务器。请用 Safari/Chrome 打开（勿用微信），或换 WiFi/流量后重试。";
    }
    if (/supabase|createClient/i.test(msg)) {
      return "登录组件未加载，请刷新页面；仍失败请改用系统浏览器打开。";
    }
    return msg || "登录失败";
  }

  async function rpcAuth(fn, username, password) {
    let data;
    let error;
    try {
      ({ data, error } = await client.rpc(fn, {
        p_username: username,
        p_password: password,
      }));
    } catch (e) {
      throw new Error(friendlyNetworkError(e));
    }
    if (error) {
      const raw = error.message || error.details || "请求失败";
      if (/auth_register|auth_login|schema cache|gen_salt|pgcrypto/i.test(raw)) {
        throw new Error(
          "密码功能未就绪：请在 Supabase → SQL Editor 重新执行 patch-profiles-password.sql（需启用 pgcrypto）。"
        );
      }
      throw new Error(raw);
    }
    if (!data?.id) throw new Error("登录失败，请重试");
    return profileFromRow(data);
  }

  function primeFromStorage() {
    configured = isConfigured();
    if (!profile) profile = loadSession();
  }

  async function init() {
    configured = isConfigured();
    if (!configured) {
      profile = loadSession();
      return { ok: true, mode: profile ? "offline" : "skip" };
    }

    if (!window.supabase?.createClient) {
      return { ok: false, error: "Supabase 库未加载" };
    }

    client = window.supabase.createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.anonKey
    );

    profile = loadSession();
    if (profile?.id) {
      touchLastSeen(profile.id).catch(() => {});
      return { ok: true, mode: "ready", profile };
    }
    return { ok: true, mode: "login" };
  }

  async function touchLastSeen(id) {
    if (!client) return;
    await client
      .from("profiles")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", id);
  }

  async function registerAccount(rawUsername, rawPassword) {
    const username = normalizeUsername(rawUsername);
    const err = validateUsername(username);
    if (err) throw new Error(err);
    const pwdErr = validatePassword(rawPassword);
    if (pwdErr) throw new Error(pwdErr);

    if (!configured || !client) {
      throw new Error("未连接云端，无法注册（请配置 Supabase）");
    }

    const p = await rpcAuth("auth_register", username, rawPassword);
    saveSession(p);
    return p;
  }

  async function loginAccount(rawUsername, rawPassword) {
    const username = normalizeUsername(rawUsername);
    const err = validateUsername(username);
    if (err) throw new Error(err);
    const pwdErr = validatePassword(rawPassword);
    if (pwdErr) throw new Error(pwdErr);

    if (!configured || !client) {
      throw new Error("未连接云端，无法登录（请配置 Supabase）");
    }

    const p = await rpcAuth("auth_login", username, rawPassword);
    saveSession(p);
    return p;
  }

  /** @deprecated 使用 loginAccount */
  async function loginWithUsername(rawUsername, rawPassword) {
    return loginAccount(rawUsername, rawPassword);
  }

  async function fetchMapLeaderboard(mapId, limit = 25) {
    if (!configured || !client || !mapId) return [];

    const { data: rpcData, error: rpcErr } = await client.rpc("get_map_leaderboard", {
      p_map_id: mapId,
      p_limit: limit,
    });
    if (!rpcErr && Array.isArray(rpcData)) {
      return rpcData.map((row) => ({
        username: row.username,
        accuracy: row.accuracy,
        duration_ms: row.duration_ms,
        correct: row.correct,
        total: row.total,
        created_at: row.played_at,
      }));
    }

    const { data, error } = await client
      .from("game_sessions")
      .select(
        "accuracy, duration_ms, correct, total, created_at, profile_id, profiles ( username )"
      )
      .eq("map_id", mapId)
      .order("accuracy", { ascending: false })
      .order("duration_ms", { ascending: true })
      .limit(Math.min(limit * 3, 100));
    if (error) throw error;

    const bestByProfile = new Map();
    (data || []).forEach((row) => {
      const pid = row.profile_id || row.profiles?.username || Math.random();
      const prev = bestByProfile.get(pid);
      if (
        !prev ||
        row.accuracy > prev.accuracy ||
        (row.accuracy === prev.accuracy && row.duration_ms < prev.duration_ms)
      ) {
        bestByProfile.set(pid, row);
      }
    });
    return [...bestByProfile.values()]
      .sort((a, b) => {
        if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
        return a.duration_ms - b.duration_ms;
      })
      .slice(0, limit);
  }

  async function saveGameSession(result) {
    if (!result || !profile?.id) return;
    if (!configured || !client) return;
    if (String(profile.id).startsWith("local-")) return;

    const { error } = await client.from("game_sessions").insert({
      profile_id: profile.id,
      map_id: result.mapId,
      map_title: result.mapTitle,
      total: result.total,
      correct: result.correct,
      accuracy: result.accuracy,
      duration_ms: result.durationMs,
      wrong: result.wrong || [],
    });
    if (error) throw error;
  }

  function logout() {
    clearSession();
  }

  function getProfile() {
    return profile;
  }

  function isLoggedIn() {
    if (!requiresLogin()) return true;
    if (!profile) profile = loadSession();
    return Boolean(profile?.id);
  }

  return {
    primeFromStorage,
    init,
    registerAccount,
    loginAccount,
    loginWithUsername,
    fetchMapLeaderboard,
    saveGameSession,
    logout,
    getProfile,
    isLoggedIn,
    requiresLogin,
    isConfigured,
    isLocalHost,
  };
})();
