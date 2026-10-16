/**
 * 本地/部署用 Supabase 配置（anon key 可公开，权限由 RLS 控制）
 * 未配置时：仅 127.0.0.1 / localhost 可免登录使用；线上须配置后才能登录刷记。
 */
window.SUPABASE_CONFIG = {
  url: "https://yvturzgmdhyhzadlqyyb.supabase.co",
  anonKey: "sb_publishable_Fc6WwMmTLcWMcWwqOuMs6Q_ixyMKhoY",
};

/** 嗨记站点选项（与 Supabase 无关，可单独改） */
window.HAIJI_APP = {
  /** 老师调整地图标注点的密码；留空 "" 则侧栏不显示该入口 */
  positionAdminPassword: "haige2026",
};
