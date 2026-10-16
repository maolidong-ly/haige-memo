/**
 * 嗨记 · 高中地理地图背记
 */
(function () {
  "use strict";

  const STORAGE_WRONG = "geo-memo-wrong-";
  const STORAGE_POS = "geo-memo-positions-";
  const STORAGE_LOCKED = "geo-memo-positions-locked-";
  const STORAGE_POINTS_REV = "geo-memo-points-rev-";
  const STORAGE_GAME = "geo-memo-game-result-";
  const DRAG_THRESHOLD = 16;

  /** 仅本机预览（127.0.0.1 / localhost）默认可改坐标；线上须管理员密码 */
  const CAN_EDIT_POSITIONS = (() => {
    const h = location.hostname;
    return h === "127.0.0.1" || h === "localhost";
  })();

  function getPositionAdminPassword() {
    const p = window.HAIJI_APP?.positionAdminPassword;
    if (p === undefined || p === null) return "haige2026";
    return String(p);
  }

  const STORAGE_EDIT_AUTH = "geo-memo-edit-auth-session";

  let editSessionAuthorized = false;

  let ignoreMapClick = false;

  const MAP_CATALOG = [
    { id: "china-mountains", label: "中国山地图", icon: "⛰", ready: true },
    { id: "china-terrain", label: "中国地形图", icon: "🗾", ready: true },
    { id: "ocean-currents", label: "洋流图", icon: "🌊", ready: true },
    { id: "china-admin", label: "中国政区图", icon: "🗺", ready: true },
    { id: "plates", label: "板块图", icon: "🧩", ready: true },
    { id: "world-countries", label: "重要国家图", icon: "🌍", ready: true },
    { id: "world-straits-canals", label: "海峡运河图", icon: "🚢", ready: true },
    { id: "world-continents-oceans", label: "大洲大洋图", icon: "🌐", ready: true },
    { id: "world-islands-peninsulas", label: "岛屿半岛图", icon: "🏝", ready: true },
    { id: "rivers", label: "河流图", icon: "💧", ready: true },
    { id: "world-waters", label: "重要水域图", icon: "🪸", ready: true },
    { id: "world-terrain-regions", label: "世界地形区图", icon: "🏔", ready: true },
  ];

  const MARKER = { hit: 72, ring: 36, dot: 24 };

  let SVG_W = 2400;
  let SVG_H = 1696;
  let currentMapId = "china-mountains";
  /** 切换地图时递增，避免旧底图请求晚到误报错或盖掉新地图 */
  let mapLoadSeq = 0;
  let selectedId = null;
  let wrongIds = new Set();
  let savedPositions = {};
  /** 来自 static/data/*-positions.json，优先于 localStorage 与内置默认 */
  let repoPositions = {};
  let viewBox = { x: 0, y: 0, w: SVG_W, h: SVG_H };
  let pinchState = null;
  let dragState = null;
  /** 单指/鼠标拖拽平移地图 */
  let panState = null;
  let gameState = null;
  let gameTimerTick = null;

  const els = {
    mapNav: document.getElementById("mapNav"),
    mapSvg: document.getElementById("mapSvg"),
    mapStage: document.getElementById("mapStage"),
    mapLoading: document.getElementById("mapLoading"),
    mapLoadingText: document.getElementById("mapLoadingText"),
    mapChromeTitle: document.getElementById("mapChromeTitle"),
    menuBtn: document.getElementById("menuBtn"),
    mapDrawer: document.getElementById("mapDrawer"),
    drawerClose: document.getElementById("drawerClose"),
    drawerBackdrop: document.getElementById("drawerBackdrop"),
    resetPositionsBtn: document.getElementById("resetPositionsBtn"),
    exportPositionsBtn: document.getElementById("exportPositionsBtn"),
    exportAllPositionsBtn: document.getElementById("exportAllPositionsBtn"),
    importPositionsBtn: document.getElementById("importPositionsBtn"),
    importPositionsFile: document.getElementById("importPositionsFile"),
    lockPositionsBtn: document.getElementById("lockPositionsBtn"),
    unlockPositionsBtn: document.getElementById("unlockPositionsBtn"),
    positionsLockBadge: document.getElementById("positionsLockBadge"),
    mountainSheet: document.getElementById("mountainSheet"),
    sheetBackdrop: document.getElementById("sheetBackdrop"),
    sheetClose: document.getElementById("sheetClose"),
    sheetName: document.getElementById("sheetName"),
    sheetPeakRow: document.getElementById("sheetPeakRow"),
    sheetPeak: document.getElementById("sheetPeak"),
    sheetElevationRow: document.getElementById("sheetElevationRow"),
    sheetElevation: document.getElementById("sheetElevation"),
    sheetCategoryRow: document.getElementById("sheetCategoryRow"),
    sheetCategory: document.getElementById("sheetCategory"),
    sheetNote: document.getElementById("sheetNote"),
    sheetCoords: document.getElementById("sheetCoords"),
    markWrongBtn: document.getElementById("markWrongBtn"),
    unmarkWrongBtn: document.getElementById("unmarkWrongBtn"),
    wrongList: document.getElementById("wrongList"),
    wrongEmpty: document.getElementById("wrongEmpty"),
    wrongBadge: document.getElementById("wrongBadge"),
    clearAllWrongBtn: document.getElementById("clearAllWrongBtn"),
    zoomIn: document.getElementById("zoomIn"),
    zoomOut: document.getElementById("zoomOut"),
    zoomReset: document.getElementById("zoomReset"),
    comingSoon: document.getElementById("comingSoon"),
    gameChallengeBtn: document.getElementById("gameChallengeBtn"),
    leaderboardBtn: document.getElementById("leaderboardBtn"),
    leaderboardSheet: document.getElementById("leaderboardSheet"),
    leaderboardBackdrop: document.getElementById("leaderboardBackdrop"),
    leaderboardClose: document.getElementById("leaderboardClose"),
    leaderboardMap: document.getElementById("leaderboardMap"),
    leaderboardMine: document.getElementById("leaderboardMine"),
    leaderboardStatus: document.getElementById("leaderboardStatus"),
    leaderboardList: document.getElementById("leaderboardList"),
    leaderboardBtn: document.getElementById("leaderboardBtn"),
    leaderboardSheet: document.getElementById("leaderboardSheet"),
    leaderboardBackdrop: document.getElementById("leaderboardBackdrop"),
    leaderboardClose: document.getElementById("leaderboardClose"),
    leaderboardMap: document.getElementById("leaderboardMap"),
    leaderboardMine: document.getElementById("leaderboardMine"),
    leaderboardStatus: document.getElementById("leaderboardStatus"),
    leaderboardList: document.getElementById("leaderboardList"),
    gamePrompt: document.getElementById("gamePrompt"),
    gameTargetName: document.getElementById("gameTargetName"),
    gameProgress: document.getElementById("gameProgress"),
    gameTimer: document.getElementById("gameTimer"),
    gameFeedback: document.getElementById("gameFeedback"),
    gameExitBtn: document.getElementById("gameExitBtn"),
    gameResultSheet: document.getElementById("gameResultSheet"),
    gameResultBackdrop: document.getElementById("gameResultBackdrop"),
    gameResultClose: document.getElementById("gameResultClose"),
    gameResultMap: document.getElementById("gameResultMap"),
    gameResultAccuracy: document.getElementById("gameResultAccuracy"),
    gameResultTime: document.getElementById("gameResultTime"),
    gameResultCorrect: document.getElementById("gameResultCorrect"),
    gameResultWrongList: document.getElementById("gameResultWrongList"),
    gameResultPerfect: document.getElementById("gameResultPerfect"),
    gamePlayAgainBtn: document.getElementById("gamePlayAgainBtn"),
    gameResultDismissBtn: document.getElementById("gameResultDismissBtn"),
    drawerToolsDev: document.getElementById("drawerToolsDev"),
    drawerToolsPublic: document.getElementById("drawerToolsPublic"),
    adminEditAuthBtn: document.getElementById("adminEditAuthBtn"),
    adminEditExitBtn: document.getElementById("adminEditExitBtn"),
    authGate: document.getElementById("authGate"),
    authUsername: document.getElementById("authUsername"),
    authPassword: document.getElementById("authPassword"),
    authPasswordConfirm: document.getElementById("authPasswordConfirm"),
    authPasswordConfirmWrap: document.getElementById("authPasswordConfirmWrap"),
    authTabLogin: document.getElementById("authTabLogin"),
    authTabRegister: document.getElementById("authTabRegister"),
    authSubmit: document.getElementById("authSubmit"),
    authError: document.getElementById("authError"),
    authFormBlock: document.getElementById("authFormBlock"),
    authConfigMissing: document.getElementById("authConfigMissing"),
    drawerAuth: document.getElementById("drawerAuth"),
    drawerUserAvatar: document.getElementById("drawerUserAvatar"),
    drawerAdminBlock: document.getElementById("drawerAdminBlock"),
    drawerUsername: document.getElementById("drawerUsername"),
    authSwitchBtn: document.getElementById("authSwitchBtn"),
    gameResultHint: document.getElementById("gameResultHint"),
  };

  let appStarted = false;
  let authFormMode = "login";

  function getMapData(id) {
    return window.GEO_MAPS && window.GEO_MAPS[id];
  }

  function getMapPoints(data) {
    if (!data) return [];
    return data.points || data.mountains || [];
  }

  function isTerrainMap(data) {
    return data?.mapType === "terrain" || data?.mapType === "world-terrain";
  }

  function isCountriesMap(data) {
    return data?.mapType === "countries";
  }

  function isStraitsMap(data) {
    return data?.mapType === "straits";
  }

  function isContinentsOceansMap(data) {
    return data?.mapType === "continents-oceans";
  }

  function isIslandsPeninsulasMap(data) {
    return data?.mapType === "islands-peninsulas";
  }

  function isAdminMap(data) {
    return data?.mapType === "admin";
  }

  function isOceanCurrentsMap(data) {
    return data?.mapType === "ocean-currents";
  }

  function isPlatesMap(data) {
    return data?.mapType === "plates";
  }

  function isRiversMap(data) {
    return data?.mapType === "rivers";
  }

  function isWatersMap(data) {
    return data?.mapType === "waters";
  }

  function getMarkerSizes(data) {
    return data?.marker || MARKER;
  }

  function isPlaceMap(data) {
    return (
      isTerrainMap(data) ||
      isCountriesMap(data) ||
      isStraitsMap(data) ||
      isContinentsOceansMap(data) ||
      isIslandsPeninsulasMap(data) ||
      isOceanCurrentsMap(data) ||
      isPlatesMap(data) ||
      isRiversMap(data) ||
      isWatersMap(data)
    );
  }

  function formatElevation(m) {
    return `${m.toLocaleString("zh-CN")} 米`;
  }

  function wrongStorageKey() {
    return STORAGE_WRONG + currentMapId;
  }

  function posStorageKey() {
    return STORAGE_POS + currentMapId;
  }

  function loadWrongIds() {
    try {
      const raw = localStorage.getItem(wrongStorageKey());
      wrongIds = new Set(raw ? JSON.parse(raw) : []);
    } catch {
      wrongIds = new Set();
    }
  }

  function saveWrongIds() {
    localStorage.setItem(wrongStorageKey(), JSON.stringify([...wrongIds]));
  }

  function loadPositions() {
    try {
      const key = posStorageKey();
      const raw =
        localStorage.getItem(key) ||
        sessionStorage.getItem(key) ||
        "{}";
      savedPositions = JSON.parse(raw);
    } catch {
      savedPositions = {};
    }
  }

  function savePositions() {
    const key = posStorageKey();
    const json = JSON.stringify(savedPositions);
    localStorage.setItem(key, json);
    try {
      sessionStorage.setItem(key, json);
    } catch {
      /* ignore */
    }
  }

  /** 数据里新增的点：补进本机坐标（锁死时也显示） */
  function mergeMissingPointsFromData(data) {
    if (!data) return;
    let changed = false;
    getMapPoints(data).forEach((p) => {
      if (!savedPositions[p.id]) {
        savedPositions[p.id] = { x: Math.round(p.x), y: Math.round(p.y) };
        changed = true;
      }
    });
    if (changed) savePositions();
  }

  /** 点表升级时一次性写入新默认坐标（如补美国、冰岛） */
  function applyPointsRevisionMigration(data) {
    if (!data?.id || !data.pointsRevision) return;
    const revKey = STORAGE_POINTS_REV + data.id;
    const applied = parseInt(localStorage.getItem(revKey) || "0", 10);
    if (applied >= data.pointsRevision) return;

    let changed = false;
    if (data.id === "world-countries" && data.pointsRevision >= 2) {
      getMapPoints(data).forEach((p) => {
        if (p.id === "usa" || p.id === "iceland") {
          savedPositions[p.id] = { x: Math.round(p.x), y: Math.round(p.y) };
          changed = true;
        }
      });
    }
    if (data.id === "world-waters" && data.pointsRevision >= 2) {
      getMapPoints(data).forEach((p) => {
        if (p.id === "bering_sea" || p.id === "sea_of_okhotsk") {
          savedPositions[p.id] = { x: Math.round(p.x), y: Math.round(p.y) };
          changed = true;
        }
      });
    }
    if (data.id === "world-waters" && data.pointsRevision >= 3) {
      getMapPoints(data).forEach((p) => {
        if (p.id === "bering_sea" || p.id === "sea_of_okhotsk") {
          savedPositions[p.id] = { x: Math.round(p.x), y: Math.round(p.y) };
          changed = true;
        }
      });
    }
    if (data.id === "world-waters" && data.pointsRevision >= 4) {
      getMapPoints(data).forEach((p) => {
        if (p.id === "persian_gulf") {
          savedPositions[p.id] = { x: Math.round(p.x), y: Math.round(p.y) };
          changed = true;
        }
      });
    }
    if (data.id === "world-terrain-regions" && data.pointsRevision >= 2) {
      const ids = new Set([
        "labrador_plateau",
        "deccan_plateau",
        "western_ghats",
        "eastern_ghats",
      ]);
      getMapPoints(data).forEach((p) => {
        if (ids.has(p.id)) {
          savedPositions[p.id] = { x: Math.round(p.x), y: Math.round(p.y) };
          changed = true;
        }
      });
    }

    localStorage.setItem(revKey, String(data.pointsRevision));
    if (changed) savePositions();
  }

  async function loadRepoPositions(mapId) {
    try {
      const url = `${window.GeoBase.assetUrl(`data/${mapId}-positions.json`)}?v=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return {};
      const data = await res.json();
      return typeof data === "object" && data ? data : {};
    } catch {
      return {};
    }
  }

  function lockedStorageKey() {
    return STORAGE_LOCKED + currentMapId;
  }

  function loadEditAuthSession() {
    editSessionAuthorized = sessionStorage.getItem(STORAGE_EDIT_AUTH) === "1";
  }

  function setEditAuthSession(on) {
    editSessionAuthorized = on;
    if (on) sessionStorage.setItem(STORAGE_EDIT_AUTH, "1");
    else sessionStorage.removeItem(STORAGE_EDIT_AUTH);
  }

  /** 当前是否允许改坐标（须本标签页已通过管理员密码） */
  function canEditPositionsNow() {
    return editSessionAuthorized;
  }

  function needsPasswordForEdit() {
    const pwd = getPositionAdminPassword();
    if (CAN_EDIT_POSITIONS && !pwd) return false;
    return Boolean(pwd);
  }

  function hasAdminPasswordFeature() {
    return Boolean(getPositionAdminPassword());
  }

  function verifyPositionPassword() {
    if (!needsPasswordForEdit()) return true;
    const input = prompt("请输入管理员密码以调整标注位置：");
    if (input === null) return false;
    if (input === getPositionAdminPassword()) return true;
    alert("密码错误");
    return false;
  }

  function ensureEditAuthorized() {
    if (canEditPositionsNow()) return true;
    if (!verifyPositionPassword()) return false;
    setEditAuthSession(true);
    updatePositionEditModeUI();
    syncPositionsLockedClass();
    return true;
  }

  function exitAdminEditMode() {
    setEditAuthSession(false);
    setPositionsLocked(true);
    updatePositionEditModeUI();
    syncPositionsLockedClass();
    renderMap(getMapData(currentMapId));
    closeDrawer();
  }

  function syncPositionsLockedClass() {
    els.mapStage?.classList.toggle(
      "positions-locked",
      !canEditPositionsNow() || isPositionsLocked()
    );
  }

  function isPositionsLocked() {
    if (!canEditPositionsNow()) return true;
    return localStorage.getItem(lockedStorageKey()) === "1";
  }

  function setPositionsLocked(locked) {
    if (!canEditPositionsNow()) {
      els.mapStage?.classList.add("positions-locked");
      return;
    }
    if (locked) localStorage.setItem(lockedStorageKey(), "1");
    else localStorage.removeItem(lockedStorageKey());
    updateLockUI();
    syncPositionsLockedClass();
  }

  function updatePositionEditModeUI() {
    const adminMode = editSessionAuthorized;
    const showAdminEntry = hasAdminPasswordFeature();
    els.drawerAdminBlock?.classList.toggle("hidden", !showAdminEntry || adminMode);
    els.drawerToolsDev?.classList.toggle("hidden", !adminMode);
    els.drawerToolsPublic?.classList.toggle("hidden", adminMode || !showAdminEntry);
    els.adminEditAuthBtn?.classList.toggle("hidden", adminMode);
    els.adminEditExitBtn?.classList.toggle("hidden", !adminMode);
    syncPositionsLockedClass();
  }

  function updateLockUI() {
    updatePositionEditModeUI();
    const locked = localStorage.getItem(lockedStorageKey()) === "1";
    if (!canEditPositionsNow()) {
      els.positionsLockBadge?.classList.toggle("hidden", !locked);
      return;
    }
    els.lockPositionsBtn?.classList.toggle("hidden", locked);
    els.unlockPositionsBtn?.classList.toggle("hidden", !locked);
    els.resetPositionsBtn?.classList.toggle("hidden", locked);
    els.positionsLockBadge?.classList.toggle("hidden", !locked);
  }

  function getPointPos(point) {
    if (!canEditPositionsNow()) {
      const repo = repoPositions[point.id];
      if (repo) return { x: repo.x, y: repo.y };
      return { x: point.x, y: point.y };
    }
    const saved = savedPositions[point.id];
    if (saved) return { x: saved.x, y: saved.y };
    if (!isPositionsLocked()) {
      const repo = repoPositions[point.id];
      if (repo) return { x: repo.x, y: repo.y };
    }
    return { x: point.x, y: point.y };
  }

  function mergedPositionsForMap() {
    const data = getMapData(currentMapId);
    const merged = {};
    getMapPoints(data).forEach((p) => {
      const pos = getPointPos(p);
      merged[p.id] = { x: Math.round(pos.x), y: Math.round(pos.y) };
    });
    return merged;
  }

  function downloadJson(filename, obj) {
    const text = JSON.stringify(obj, null, 2);
    navigator.clipboard?.writeText(text).catch(() => {});
    const blob = new Blob([text], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function isWrong(id) {
    return wrongIds.has(id);
  }

  function clientToSvg(clientX, clientY) {
    const pt = els.mapSvg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = els.mapSvg.getScreenCTM();
    if (!ctm) return null;
    const svgPt = pt.matrixTransform(ctm.inverse());
    return {
      x: Math.max(0, Math.min(SVG_W, svgPt.x)),
      y: Math.max(0, Math.min(SVG_H, svgPt.y)),
    };
  }

  function applyMapSize(data) {
    SVG_W = data.mapWidth || 2400;
    SVG_H = data.mapHeight || 1696;
    els.mapSvg.setAttribute("viewBox", `0 0 ${SVG_W} ${SVG_H}`);
    window.GeoBase.setMapMeta(data);
    resetView();
  }

  function setViewBox(vb) {
    viewBox = vb;
    els.mapSvg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  }

  function resetView() {
    setViewBox({ x: 0, y: 0, w: SVG_W, h: SVG_H });
  }

  function zoomAt(factor, cx, cy) {
    const vb = { ...viewBox };
    setViewBox({
      x: cx - (cx - vb.x) * factor,
      y: cy - (cy - vb.y) * factor,
      w: vb.w * factor,
      h: vb.h * factor,
    });
  }

  function markerClasses(id) {
    const c = ["marker"];
    if (isPositionsLocked()) c.push("marker-locked");
    if (id === selectedId) c.push("selected");
    if (isWrong(id)) c.push("wrong");
    if (dragState?.id === id) c.push("dragging");
    return c.join(" ");
  }

  function updateMarkerStyles() {
    els.mapSvg.querySelectorAll(".marker").forEach((g) => {
      g.setAttribute("class", markerClasses(g.dataset.id));
    });
  }

  function setMarkerVisual(id, x, y) {
    const g = els.mapSvg.querySelector(`.marker[data-id="${id}"]`);
    if (!g) return;
    g.querySelectorAll("circle").forEach((c) => {
      c.setAttribute("cx", Math.round(x));
      c.setAttribute("cy", Math.round(y));
    });
  }

  function commitMarkerPos(id, x, y) {
    const rx = Math.round(x);
    const ry = Math.round(y);
    savedPositions[id] = { x: rx, y: ry };
    savePositions();
    setMarkerVisual(id, rx, ry);
    if (selectedId === id && els.sheetCoords) {
      els.sheetCoords.textContent = `x: ${rx}, y: ${ry}`;
    }
  }

  function updateWrongUI() {
    const count = wrongIds.size;
    els.wrongBadge.textContent = String(count);
    els.wrongBadge.classList.toggle("hidden", count === 0);

    const data = getMapData(currentMapId);
    const points = getMapPoints(data);
    const wrongPoints = points.filter((p) => isWrong(p.id));

    els.wrongEmpty.classList.toggle("hidden", wrongPoints.length > 0);
    els.wrongList.innerHTML = wrongPoints
      .map(
        (p) => `
        <li>
          <button type="button" class="wrong-item" data-id="${p.id}">
            <span>${p.name}</span>
            <span class="wrong-item-remove" data-remove="${p.id}" title="取消记错">×</span>
          </button>
        </li>`
      )
      .join("");

    els.wrongList.querySelectorAll(".wrong-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (e.target.closest("[data-remove]")) return;
        selectPoint(btn.dataset.id, { scrollSheet: false });
      });
    });

    els.wrongList.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleWrong(btn.dataset.remove, false);
      });
    });

    updateSheetWrongButtons();
    updateMarkerStyles();
  }

  function updateSheetWrongButtons() {
    if (!selectedId) return;
    const wrong = isWrong(selectedId);
    els.markWrongBtn.classList.toggle("hidden", wrong);
    els.unmarkWrongBtn.classList.toggle("hidden", !wrong);
  }

  function toggleWrong(id, markWrong) {
    if (markWrong === undefined) markWrong = !isWrong(id);
    if (markWrong) wrongIds.add(id);
    else wrongIds.delete(id);
    saveWrongIds();
    updateWrongUI();
  }

  function openDrawer() {
    els.mapDrawer.classList.remove("hidden");
    els.drawerBackdrop.classList.remove("hidden");
  }

  function closeDrawer() {
    els.mapDrawer.classList.add("hidden");
    els.drawerBackdrop.classList.add("hidden");
  }

  function openSheet() {
    els.mountainSheet.classList.remove("hidden");
    els.sheetBackdrop.classList.remove("hidden");
  }

  function closeSheet() {
    selectedId = null;
    els.mountainSheet.classList.add("hidden");
    els.sheetBackdrop.classList.add("hidden");
    updateMarkerStyles();
  }

  function renderNav() {
    els.mapNav.innerHTML = MAP_CATALOG.map(
      (m) => `
        <button type="button"
          class="map-tab ${m.id === currentMapId ? "active" : ""} ${m.ready ? "" : "soon"}"
          data-map="${m.id}"
          ${m.ready ? "" : 'aria-disabled="true"'}>
          <span class="tab-icon">${m.icon}</span>
          <span class="tab-label">${m.label}</span>
          ${m.ready ? "" : '<span class="tab-badge">待开发</span>'}
        </button>`
    ).join("");

    els.mapNav.querySelectorAll(".map-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = MAP_CATALOG.find((m) => m.id === btn.dataset.map);
        if (!item?.ready) return;
        closeDrawer();
        switchMap(item.id);
      });
    });
  }

  function preloadImageOnce(src, timeoutMs) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timer = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        img.src = "";
        reject(new Error("底图加载超时"));
      }, timeoutMs);
      img.onload = () => {
        clearTimeout(timer);
        resolve(img);
      };
      img.onerror = () => {
        clearTimeout(timer);
        reject(new Error("底图加载失败"));
      };
      img.decoding = "async";
      img.src = src;
    });
  }

  async function preloadImage(src, timeoutMs = 45000, retries = 2) {
    let lastErr = new Error("底图加载失败");
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await preloadImageOnce(src, timeoutMs);
      } catch (e) {
        lastErr = e instanceof Error ? e : lastErr;
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
        }
      }
    }
    throw lastErr;
  }

  function renderMap(data) {
    mergeMissingPointsFromData(data);
    const points = getMapPoints(data);
    const marker = getMarkerSizes(data);
    const parts = [window.GeoBase.renderBaseLayer()];

    els.mapStage?.classList.toggle("map-markers-xl", Boolean(data?.marker));

    parts.push(`<g class="markers">`);
    points.forEach((p) => {
      const { x, y } = getPointPos(p);
      parts.push(`
        <g class="${markerClasses(p.id)}" data-id="${p.id}" tabindex="0" role="button"
           aria-label="${p.name}">
          <circle class="marker-hit" cx="${x}" cy="${y}" r="${marker.hit}"/>
          <circle class="marker-ring" cx="${x}" cy="${y}" r="${marker.ring}"/>
          <circle class="marker-dot" cx="${x}" cy="${y}" r="${marker.dot}"/>
        </g>
      `);
    });
    parts.push(`</g>`);

    els.mapSvg.innerHTML = parts.join("");
    bindMarkerEvents();
  }

  function openMarker(id) {
    if (ignoreMapClick) return;
    if (isGameActive()) {
      handleGameMarkerClick(id);
      return;
    }
    suppressMapClick();
    selectPoint(id);
  }

  function suppressMapClick() {
    ignoreMapClick = true;
    setTimeout(() => { ignoreMapClick = false; }, 350);
  }

  function bindMarkerEvents() {
    els.mapSvg.querySelectorAll(".marker").forEach((g) => {
      const id = g.dataset.id;

      g.addEventListener("pointerdown", onMarkerPointerDown);
      g.addEventListener("click", (e) => {
        e.stopPropagation();
        openMarker(id);
      });
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectPoint(id);
        }
      });
    });
  }

  function onMarkerPointerDown(e) {
    if (isGameActive()) return;
    if (!canEditPositionsNow() || isPositionsLocked()) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.stopPropagation();

    const g = e.currentTarget;
    try { g.setPointerCapture(e.pointerId); } catch { /* SVG 上可能不支持 */ }

    dragState = {
      id: g.dataset.id,
      pointerId: e.pointerId,
      element: g,
      startClient: { x: e.clientX, y: e.clientY },
      moved: false,
    };
  }

  function onMapPanStart(e) {
    if (dragState || panState) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (canEditPositionsNow() && !isPositionsLocked() && e.target.closest?.(".marker")) {
      return;
    }
    panState = {
      pointerId: e.pointerId,
      last: { x: e.clientX, y: e.clientY },
      moved: false,
    };
    try {
      els.mapStage.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  function onPointerMove(e) {
    if (panState && e.pointerId === panState.pointerId) {
      const dx = e.clientX - panState.last.x;
      const dy = e.clientY - panState.last.y;
      if (!panState.moved) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        panState.moved = true;
      }
      e.preventDefault();
      const rect = els.mapSvg.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const scaleX = viewBox.w / rect.width;
        const scaleY = viewBox.h / rect.height;
        setViewBox({
          x: viewBox.x - dx * scaleX,
          y: viewBox.y - dy * scaleY,
          w: viewBox.w,
          h: viewBox.h,
        });
      }
      panState.last = { x: e.clientX, y: e.clientY };
      return;
    }

    if (!dragState || e.pointerId !== dragState.pointerId) return;

    const dx = e.clientX - dragState.startClient.x;
    const dy = e.clientY - dragState.startClient.y;
    if (!dragState.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      dragState.moved = true;
      dragState.element.classList.add("dragging");
    }

    e.preventDefault();
    const pt = clientToSvg(e.clientX, e.clientY);
    if (pt) setMarkerVisual(dragState.id, pt.x, pt.y);
  }

  function onPointerUp(e) {
    if (panState && e.pointerId === panState.pointerId) {
      if (panState.moved) suppressMapClick();
      try {
        els.mapStage.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      panState = null;
      return;
    }

    if (!dragState || e.pointerId !== dragState.pointerId) return;
    e.stopPropagation();

    const { id, element, moved } = dragState;
    element.classList.remove("dragging");
    try { element.releasePointerCapture?.(e.pointerId); } catch { /* ignore */ }

    if (moved) {
      const pt = clientToSvg(e.clientX, e.clientY);
      if (pt) commitMarkerPos(id, pt.x, pt.y);
      suppressMapClick();
    } else {
      openMarker(id);
    }

    dragState = null;
    updateMarkerStyles();
  }

  function updateSheetForMapType(data) {
    const terrain = isTerrainMap(data);
    const countries = isCountriesMap(data);
    const straits = isStraitsMap(data);
    const continentsOceans = isContinentsOceansMap(data);
    const islandsPeninsulas = isIslandsPeninsulasMap(data);
    const admin = isAdminMap(data);
    const oceanCurrents = isOceanCurrentsMap(data);
    const plates = isPlatesMap(data);
    const rivers = isRiversMap(data);
    const waters = isWatersMap(data);
    const place = isPlaceMap(data);
    els.sheetPeakRow.classList.toggle("hidden", (place && !admin) || oceanCurrents || plates || rivers || waters);
    els.sheetElevationRow.classList.toggle("hidden", (place && !admin) || oceanCurrents || plates || rivers || waters);
    els.sheetCategoryRow.classList.toggle("hidden", !place && !admin);
    if (admin) {
      els.sheetCategoryRow.classList.remove("hidden");
    }
    const peakLabel = document.getElementById("sheetPeakLabel");
    if (peakLabel && !admin) {
      peakLabel.textContent = "代表山峰";
    }
    const elevDt = els.sheetElevationRow?.querySelector("dt");
    if (elevDt) {
      elevDt.textContent = admin ? "省会 / 首府" : "海拔高度";
    }
    const noteDt = els.sheetNote?.closest("div")?.querySelector("dt");
    if (noteDt) {
      noteDt.textContent = admin ? "补充说明" : "地理意义";
    }
    if (els.sheetCategoryRow?.querySelector("dt")) {
      const dt = els.sheetCategoryRow.querySelector("dt");
      if (admin) dt.textContent = "行政区类型";
      else if (countries) dt.textContent = "所属区域";
      else if (straits) dt.textContent = "区域/类型";
      else if (continentsOceans) dt.textContent = "大洲/大洋";
      else if (islandsPeninsulas) dt.textContent = "岛屿/半岛";
      else if (oceanCurrents) dt.textContent = "暖流 / 寒流";
      else if (plates) dt.textContent = "板块类型";
      else if (rivers) dt.textContent = "所在大洲";
      else if (waters) dt.textContent = "水域类型";
      else dt.textContent = "地形类型";
    }
  }

  function selectPoint(id, opts = {}) {
    selectedId = id;
    const data = getMapData(currentMapId);
    const p = getMapPoints(data).find((x) => x.id === id);
    if (!p) return;

    const { x, y } = getPointPos(p);
    const place = isPlaceMap(data);
    const admin = isAdminMap(data);

    updateSheetForMapType(data);
    els.sheetName.textContent = p.name;

    if (admin) {
      els.sheetPeak.textContent = p.abbr || "—";
      els.sheetElevation.textContent = p.capital || "—";
      els.sheetCategory.textContent = p.category || "—";
    } else if (place) {
      els.sheetCategory.textContent = p.category || "—";
    } else {
      els.sheetPeak.textContent = p.peak;
      els.sheetElevation.textContent = formatElevation(p.elevation);
    }

    els.sheetNote.textContent = p.note || "—";
    if (els.sheetCoords) els.sheetCoords.textContent = `x: ${Math.round(x)}, y: ${Math.round(y)}`;

    updateSheetWrongButtons();
    updateMarkerStyles();
    openSheet();

    if (opts.scrollSheet !== false) {
      els.mountainSheet.scrollTop = 0;
    }
  }

  function exportPositions() {
    if (!canEditPositionsNow()) return;
    if (!getMapData(currentMapId)) return;
    downloadJson(`${currentMapId}-positions.json`, mergedPositionsForMap());
    closeDrawer();
    alert("坐标已复制到剪贴板，并已下载 JSON 文件");
  }

  function positionsFromMapData(mapId) {
    const data = getMapData(mapId);
    if (!data) return null;
    const positions = {};
    getMapPoints(data).forEach((p) => {
      positions[p.id] = { x: Math.round(p.x), y: Math.round(p.y) };
    });
    return positions;
  }

  async function loadStoredPositionsForMap(mapId) {
    try {
      const raw = localStorage.getItem(STORAGE_POS + mapId);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && Object.keys(parsed).length) {
          return parsed;
        }
      }
    } catch {
      /* ignore */
    }
    try {
      const url = `${window.GeoBase.assetUrl(`data/${mapId}-positions.json`)}?v=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === "object" && Object.keys(data).length) return data;
      }
    } catch {
      /* ignore */
    }
    return positionsFromMapData(mapId);
  }

  /** 一次导出全部地图坐标（本机保存 > 项目 JSON > JS 默认） */
  async function exportAllMapsPositions() {
    if (!canEditPositionsNow()) return;
    const bundle = {};
    for (const m of MAP_CATALOG) {
      if (!m.ready) continue;
      const positions = await loadStoredPositionsForMap(m.id);
      if (positions && Object.keys(positions).length) {
        bundle[m.id] = positions;
      }
    }
    const n = Object.keys(bundle).length;
    if (!n) {
      alert("没有可导出的地图坐标");
      return;
    }
    downloadJson("all-maps-positions.json", bundle);
    closeDrawer();
    alert(
      `已下载 all-maps-positions.json（共 ${n} 张图）。\n` +
        "放到 geo-map 文件夹后运行：\n" +
        "python3 scripts/import-positions-bundle.py all-maps-positions.json"
    );
  }

  function lockPositions() {
    if (!canEditPositionsNow()) return;
    if (!getMapData(currentMapId)) return;
    savedPositions = mergedPositionsForMap();
    savePositions();
    setPositionsLocked(true);
    renderMap(getMapData(currentMapId));
    closeDrawer();
  }

  function unlockPositions() {
    if (!ensureEditAuthorized()) return;
    if (needsPasswordForEdit() && CAN_EDIT_POSITIONS && !editSessionAuthorized) {
      if (!verifyPositionPassword()) return;
      setEditAuthSession(true);
      updatePositionEditModeUI();
    }
    if (!confirm("解锁后可以拖动调整位置，改完请再点「锁死位置」。")) return;
    setPositionsLocked(false);
    renderMap(getMapData(currentMapId));
    closeDrawer();
  }

  function importPositionsFromFile(file) {
    if (!canEditPositionsNow()) return;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        savedPositions = { ...savedPositions, ...data };
        savePositions();
        renderMap(getMapData(currentMapId));
        closeDrawer();
        alert("坐标已导入并保存到本机浏览器");
      } catch {
        alert("JSON 格式无效");
      }
    };
    reader.readAsText(file, "utf-8");
  }

  function resetAllPositions() {
    if (!canEditPositionsNow()) return;
    if (isPositionsLocked()) return;
    if (!confirm("恢复为软件内置默认坐标？")) return;
    savedPositions = {};
    savePositions();
    const data = getMapData(currentMapId);
    if (data) renderMap(data);
    closeDrawer();
  }

  function setMapLoadingMessage(text) {
    if (els.mapLoadingText) els.mapLoadingText.textContent = text;
    else if (els.mapLoading) els.mapLoading.textContent = text;
  }

  function switchMap(id) {
    const data = getMapData(id);
    if (!data) return;

    if (isGameActive() && id !== currentMapId) {
      if (!confirm("挑战进行中，切换地图将结束本次挑战且不保存成绩。继续？")) return;
      stopGameTimer();
      gameState = null;
      hideGamePrompt();
      clearGameFeedback();
    }

    closeSheet();
    currentMapId = id;
    loadWrongIds();
    loadPositions();
    mergeMissingPointsFromData(data);
    applyPointsRevisionMigration(data);
    repoPositions = {};
    els.comingSoon.classList.add("hidden");
    els.mapStage.classList.remove("hidden");
    els.mapLoading?.classList.remove("hidden");
    if (els.mapLoading) {
      if (isAdminMap(data)) {
        setMapLoadingMessage("正在加载中国政区空白图…");
      } else if (isOceanCurrentsMap(data)) {
        setMapLoadingMessage("正在加载世界洋流图…");
      } else if (isPlatesMap(data)) {
        setMapLoadingMessage("正在加载世界板块图…");
      } else if (isRiversMap(data)) {
        setMapLoadingMessage("正在加载世界河流图…");
      } else if (isWatersMap(data)) {
        setMapLoadingMessage("正在加载世界重要水域图…");
      } else if (isCountriesMap(data)) {
        setMapLoadingMessage("正在加载世界重要国家图…");
      } else if (isStraitsMap(data)) {
        setMapLoadingMessage("正在加载世界海峡运河图…");
      } else if (isContinentsOceansMap(data)) {
        setMapLoadingMessage("正在加载世界大洲与大洋图…");
      } else if (isIslandsPeninsulasMap(data)) {
        setMapLoadingMessage("正在加载世界岛屿半岛图…");
      } else if (data?.mapType === "world-terrain") {
        setMapLoadingMessage("正在加载世界主要地形区图…");
      } else if (isTerrainMap(data)) {
        setMapLoadingMessage("正在加载地形空白图…");
      } else {
        setMapLoadingMessage("正在加载山地空白图…");
      }
      els.mapLoading.classList.remove("error");
    }
    if (els.mapChromeTitle) {
      els.mapChromeTitle.textContent = data.title || data.label || id;
    }
    els.mapSvg.setAttribute("aria-label", data.title || "中国地图");

    applyMapSize(data);
    renderNav();
    updateWrongUI();

    const loadSeq = ++mapLoadSeq;
    const imageUrl = window.GeoBase.assetUrl(data.mapImage);

    Promise.all([preloadImage(imageUrl), loadRepoPositions(id)])
      .then(([, repo]) => {
        if (loadSeq !== mapLoadSeq || currentMapId !== id) return;
        repoPositions = repo;
        updateLockUI();
        syncPositionsLockedClass();
        renderMap(data);
        els.mapLoading?.classList.add("hidden");
      })
      .catch((err) => {
        if (loadSeq !== mapLoadSeq || currentMapId !== id) return;
        if (els.mapLoading) {
          const msg =
            err?.message === "底图加载超时"
              ? "底图加载超时，请检查网络后重试"
              : "底图加载失败，请刷新重试";
          setMapLoadingMessage(msg);
          els.mapLoading.classList.add("error");
        }
      });
  }

  function setupZoom() {
    els.mapStage.addEventListener("pointerdown", onMapPanStart);

    els.zoomIn.addEventListener("click", () => zoomAt(0.75, viewBox.x + viewBox.w / 2, viewBox.y + viewBox.h / 2));
    els.zoomOut.addEventListener("click", () => zoomAt(1.35, viewBox.x + viewBox.w / 2, viewBox.y + viewBox.h / 2));
    els.zoomReset.addEventListener("click", resetView);

    els.mapStage.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = els.mapSvg.getBoundingClientRect();
      zoomAt(
        e.deltaY < 0 ? 0.85 : 1.18,
        viewBox.x + ((e.clientX - rect.left) / rect.width) * viewBox.w,
        viewBox.y + ((e.clientY - rect.top) / rect.height) * viewBox.h
      );
    }, { passive: false });

    els.mapStage.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) panState = null;
      if (dragState || e.touches.length !== 2) return;
      const [a, b] = e.touches;
      pinchState = {
        dist: Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY),
        vb: { ...viewBox },
        mid: { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 },
      };
    }, { passive: true });

    els.mapStage.addEventListener("touchmove", (e) => {
      if (dragState || e.touches.length !== 2 || !pinchState) return;
      e.preventDefault();
      const [a, b] = e.touches;
      const factor = pinchState.dist / Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
      const rect = els.mapSvg.getBoundingClientRect();
      const cx = pinchState.vb.x + ((pinchState.mid.x - rect.left) / rect.width) * pinchState.vb.w;
      const cy = pinchState.vb.y + ((pinchState.mid.y - rect.top) / rect.height) * pinchState.vb.h;
      setViewBox({
        x: cx - (cx - pinchState.vb.x) * factor,
        y: cy - (cy - pinchState.vb.y) * factor,
        w: pinchState.vb.w * factor,
        h: pinchState.vb.h * factor,
      });
    }, { passive: false });

    els.mapStage.addEventListener("touchend", () => { pinchState = null; });
  }

  function isGameActive() {
    return Boolean(gameState);
  }

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function formatGameDuration(ms) {
    const sec = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const rm = m % 60;
      return `${h} 小时 ${rm} 分 ${s} 秒`;
    }
    if (m > 0) return `${m} 分 ${String(s).padStart(2, "0")} 秒`;
    return `${s} 秒`;
  }

  function formatGameClock(ms) {
    const sec = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function pointById(id) {
    return getMapPoints(getMapData(currentMapId)).find((p) => p.id === id);
  }

  function gameStorageKey() {
    const pid = window.HaigeAuth?.getProfile()?.id;
    const suffix = pid ? `${pid}-${currentMapId}` : currentMapId;
    return STORAGE_GAME + suffix;
  }

  function saveGameResult(result) {
    localStorage.setItem(gameStorageKey(), JSON.stringify(result));
  }

  function loadLocalGameResult() {
    try {
      const raw = localStorage.getItem(gameStorageKey());
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function closeLeaderboardSheet() {
    els.leaderboardSheet?.classList.add("hidden");
    els.leaderboardBackdrop?.classList.add("hidden");
  }

  async function openLeaderboardSheet() {
    const data = getMapData(currentMapId);
    if (!data) return;
    closeSheet();
    closeGameResultSheet();
    els.leaderboardSheet?.classList.remove("hidden");
    els.leaderboardBackdrop?.classList.remove("hidden");
    if (els.leaderboardMap) {
      els.leaderboardMap.textContent = data.title || currentMapId;
    }
    if (els.leaderboardList) els.leaderboardList.innerHTML = "";
    if (els.leaderboardStatus) {
      els.leaderboardStatus.textContent = "加载中…";
      els.leaderboardStatus.classList.remove("hidden");
    }

    const local = loadLocalGameResult();
    if (els.leaderboardMine) {
      if (local?.accuracy != null) {
        const who = window.HaigeAuth?.getProfile()?.username || "当前账号";
        els.leaderboardMine.textContent = `${who} 本机最近一次：正确率 ${local.accuracy}% · 用时 ${formatGameDuration(local.durationMs)}`;
        els.leaderboardMine.classList.remove("hidden");
      } else {
        els.leaderboardMine.classList.add("hidden");
      }
    }

    const auth = window.HaigeAuth;
    if (!auth?.isConfigured?.()) {
      if (els.leaderboardStatus) {
        els.leaderboardStatus.textContent = "完成 🎯 挑战后，配置 Supabase 即可显示全站排行。";
      }
      return;
    }

    try {
      const rows = await auth.fetchMapLeaderboard(currentMapId, 25);
      if (els.leaderboardStatus) els.leaderboardStatus.classList.add("hidden");
      if (!rows.length) {
        if (els.leaderboardStatus) {
          els.leaderboardStatus.textContent =
            "云端暂无记录。请在 Supabase 执行 static/supabase/patch-leaderboard-rpc.sql 后，完成 🎯 挑战即可上榜。";
          els.leaderboardStatus.classList.remove("hidden");
        }
        return;
      }
      if (els.leaderboardList) {
        els.leaderboardList.innerHTML = rows
          .map((row, i) => {
            const name =
              row.username ||
              row.profiles?.username ||
              (Array.isArray(row.profiles) ? row.profiles[0]?.username : null) ||
              "匿名";
            const rank = i + 1;
            const top =
              rank === 1 ? "lb-top1" : rank === 2 ? "lb-top2" : rank === 3 ? "lb-top3" : "";
            return `<li class="${top}">
              <span class="lb-rank">${rank}</span>
              <span class="lb-name">${name}</span>
              <span class="lb-meta">${row.accuracy}% · ${formatGameDuration(row.duration_ms)}</span>
            </li>`;
          })
          .join("");
      }
    } catch (e) {
      if (els.leaderboardStatus) {
        els.leaderboardStatus.textContent =
          e?.message?.includes("policy") || e?.code === "42501"
            ? "排行榜未开启：请在 Supabase 执行 patch-leaderboard-select.sql"
            : "排行榜加载失败，请稍后再试";
        els.leaderboardStatus.classList.remove("hidden");
      }
    }
  }

  function stopGameTimer() {
    if (gameTimerTick) {
      clearInterval(gameTimerTick);
      gameTimerTick = null;
    }
  }

  function updateGameTimerDisplay() {
    if (!gameState || !els.gameTimer) return;
    els.gameTimer.textContent = formatGameClock(Date.now() - gameState.startTime);
  }

  function gamePromptUsesTopBar() {
    return currentMapId === "china-admin";
  }

  function updateGamePromptPlacement() {
    els.gamePrompt?.classList.toggle("game-prompt-at-top", gamePromptUsesTopBar());
  }

  function showGamePrompt() {
    updateGamePromptPlacement();
    els.gamePrompt?.classList.remove("hidden");
    els.mapStage?.classList.add("game-active");
  }

  function hideGamePrompt() {
    els.gamePrompt?.classList.add("hidden");
    els.gamePrompt?.classList.remove("game-prompt-at-top");
    els.mapStage?.classList.remove("game-active");
  }

  function setGameFeedback(text, kind) {
    if (!els.gameFeedback) return;
    els.gameFeedback.textContent = text;
    els.gameFeedback.classList.remove("hidden", "ok", "bad");
    if (kind) els.gameFeedback.classList.add(kind);
  }

  function clearGameFeedback() {
    els.gameFeedback?.classList.add("hidden");
    els.gameFeedback?.classList.remove("ok", "bad");
  }

  function currentGameTargetId() {
    if (!gameState) return null;
    return gameState.queue[gameState.index];
  }

  function refreshGamePrompt() {
    if (!gameState) return;
    const target = pointById(currentGameTargetId());
    if (els.gameTargetName) els.gameTargetName.textContent = target?.name || "—";
    if (els.gameProgress) {
      els.gameProgress.textContent = `第 ${gameState.index + 1} / ${gameState.queue.length} 题`;
    }
    clearGameFeedback();
    updateGameTimerDisplay();
  }

  function closeGameResultSheet() {
    els.gameResultSheet?.classList.add("hidden");
    els.gameResultBackdrop?.classList.add("hidden");
  }

  function showGameResultSheet(result) {
    if (!result) return;
    els.gameResultMap.textContent = result.mapTitle || "—";
    els.gameResultAccuracy.textContent = `${result.accuracy}%`;
    els.gameResultTime.textContent = formatGameDuration(result.durationMs);
    els.gameResultCorrect.textContent = `${result.correct} / ${result.total}`;

    const misses = result.wrong || [];
    els.gameResultPerfect.classList.toggle("hidden", misses.length > 0);
    els.gameResultWrongList.innerHTML = misses.length
      ? misses
          .map(
            (w) =>
              `<li>要找「${w.targetName}」→ 点了「${w.pickedName}」</li>`
          )
          .join("")
      : "";

    els.gameResultSheet?.classList.remove("hidden");
    els.gameResultBackdrop?.classList.remove("hidden");
  }

  function finishGameChallenge() {
    if (!gameState) return;
    stopGameTimer();
    const durationMs = Date.now() - gameState.startTime;
    const total = gameState.queue.length;
    const correct = gameState.correct;
    const accuracy = total ? Math.round((correct / total) * 1000) / 10 : 0;
    const result = {
      mapId: currentMapId,
      mapTitle: getMapData(currentMapId)?.title || currentMapId,
      at: Date.now(),
      durationMs,
      total,
      correct,
      accuracy,
      wrong: gameState.misses,
    };
    saveGameResult(result);
    window.HaigeAuth?.saveGameSession(result).catch((err) => {
      console.warn("成绩同步失败", err);
    });
    gameState = null;
    hideGamePrompt();
    closeSheet();
    showGameResultSheet(result);
  }

  function abortGameChallenge() {
    if (!gameState) return;
    if (!confirm("确定退出本次挑战？进度不会保存。")) return;
    stopGameTimer();
    gameState = null;
    hideGamePrompt();
    clearGameFeedback();
  }

  function advanceGameAfterAnswer(wasCorrect, clickedId) {
    const targetId = currentGameTargetId();
    const target = pointById(targetId);
    const picked = pointById(clickedId);
    if (!wasCorrect) {
      gameState.misses.push({
        targetId,
        targetName: target?.name || targetId,
        pickedId: clickedId,
        pickedName: picked?.name || clickedId,
      });
    } else {
      gameState.correct += 1;
    }

    setGameFeedback(
      wasCorrect ? "正确！" : `不对，要找「${target?.name || "—"}」`,
      wasCorrect ? "ok" : "bad"
    );

    gameState.index += 1;
    suppressMapClick();

    if (gameState.index >= gameState.queue.length) {
      setTimeout(finishGameChallenge, 650);
      return;
    }
    setTimeout(refreshGamePrompt, 650);
  }

  function handleGameMarkerClick(clickedId) {
    if (!gameState || gameState.answering) return;
    gameState.answering = true;
    const ok = clickedId === currentGameTargetId();
    advanceGameAfterAnswer(ok, clickedId);
    setTimeout(() => {
      if (gameState) gameState.answering = false;
    }, 700);
  }

  function startGameChallenge() {
    const data = getMapData(currentMapId);
    if (!data) return;
    const catalog = MAP_CATALOG.find((m) => m.id === currentMapId);
    if (catalog && !catalog.ready) {
      alert("当前地图尚未开放挑战");
      return;
    }
    const points = getMapPoints(data);
    if (!points.length) {
      alert("当前地图没有标注点");
      return;
    }

    closeDrawer();
    closeSheet();
    closeGameResultSheet();

    gameState = {
      mapId: currentMapId,
      queue: shuffleArray(points.map((p) => p.id)),
      index: 0,
      correct: 0,
      misses: [],
      startTime: Date.now(),
      answering: false,
    };

    showGamePrompt();
    refreshGamePrompt();
    stopGameTimer();
    gameTimerTick = setInterval(updateGameTimerDisplay, 500);
  }

  /** 防止旧缓存 JS 漏点：运行时补全水域图条目 */
  function ensureDataPatches() {
    const w = window.GEO_MAPS?.["world-waters"];
    if (!w?.points) return;
    const extras = [
      {
        id: "bering_sea",
        name: "白令海",
        category: "边缘海",
        x: 3380,
        y: 960,
        note: "北太平洋，亚洲与北美洲之间，经白令海峡沟通北冰洋",
      },
      {
        id: "sea_of_okhotsk",
        name: "鄂霍次克海",
        category: "边缘海",
        x: 3580,
        y: 1080,
        note: "太平洋西北部，堪察加半岛、千岛群岛与萨哈林岛（库页岛）之间",
      },
      {
        id: "persian_gulf",
        name: "波斯湾",
        category: "海湾",
        x: 2285,
        y: 1310,
        note: "阿拉伯半岛与伊朗之间，石油出口要道，经霍尔木兹海峡通阿拉伯海",
      },
    ];
    extras.forEach((ex) => {
      if (!w.points.some((p) => p.id === ex.id)) {
        let j = w.points.findIndex((p) => p.id === "sea_of_japan");
        if (ex.id === "persian_gulf") {
          j = w.points.findIndex((p) => p.id === "arabian_sea");
        }
        if (j >= 0) w.points.splice(j + 1, 0, ex);
        else w.points.push(ex);
      }
    });
  }

  function showAuthGate(mode) {
    els.authGate?.classList.remove("hidden");
    els.authError?.classList.add("hidden");
    if (mode === "missing-config") {
      els.authFormBlock?.classList.add("hidden");
      els.authConfigMissing?.classList.remove("hidden");
    } else {
      els.authFormBlock?.classList.remove("hidden");
      els.authConfigMissing?.classList.add("hidden");
      els.authUsername?.focus();
    }
  }

  function hideAuthGate() {
    els.authGate?.classList.add("hidden");
  }

  function updateAuthUI() {
    const auth = window.HaigeAuth;
    if (!auth) return;
    const configured = auth.isConfigured();
    const profile = auth.getProfile();
    if (els.drawerAuth) {
      els.drawerAuth.classList.toggle("hidden", !configured);
    }
    if (els.drawerUsername) {
      els.drawerUsername.textContent = profile?.username || "—";
    }
    if (els.drawerUserAvatar && profile?.username) {
      els.drawerUserAvatar.textContent = profile.username.slice(0, 1);
    }
    if (els.gameResultHint) {
      els.gameResultHint.textContent = configured
        ? "再次挑战会覆盖本图的上次成绩；登录后挑战成绩会同步到后台"
        : "再次挑战会覆盖本图的上次成绩（本机预览，未连后台）";
    }
  }

  function startAppMaps() {
    if (appStarted) return;
    appStarted = true;
    switchMap("china-mountains");
  }

  function setAuthFormMode(mode) {
    authFormMode = mode === "register" ? "register" : "login";
    els.authTabLogin?.classList.toggle("active", authFormMode === "login");
    els.authTabRegister?.classList.toggle("active", authFormMode === "register");
    els.authTabLogin?.setAttribute("aria-selected", authFormMode === "login" ? "true" : "false");
    els.authTabRegister?.setAttribute("aria-selected", authFormMode === "register" ? "true" : "false");
    els.authPasswordConfirmWrap?.classList.toggle("hidden", authFormMode !== "register");
    if (els.authSubmit) {
      els.authSubmit.textContent = authFormMode === "register" ? "注册并进入" : "登录并进入";
    }
    if (els.authPassword) {
      els.authPassword.autocomplete = authFormMode === "register" ? "new-password" : "current-password";
    }
  }

  async function submitAuthLogin() {
    const auth = window.HaigeAuth;
    if (!auth) return;
    els.authError?.classList.add("hidden");
    const btn = els.authSubmit;
    if (btn) btn.disabled = true;
    try {
      const username = els.authUsername?.value;
      const password = els.authPassword?.value;
      if (authFormMode === "register") {
        const confirm = els.authPasswordConfirm?.value;
        if (password !== confirm) throw new Error("两次密码不一致");
        await auth.registerAccount(username, password);
      } else {
        await auth.loginAccount(username, password);
      }
      hideAuthGate();
      updateAuthUI();
      startAppMaps();
    } catch (e) {
      if (els.authError) {
        const raw = e?.message || String(e || "登录失败");
        els.authError.textContent = /failed to fetch|typeerror/i.test(raw)
          ? "无法连接登录服务器，请换 WiFi 或稍后再试。"
          : raw;
        els.authError.classList.remove("hidden");
      }
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  async function boot() {
    ensureDataPatches();
    renderNav();
    setupZoom();
    loadWrongIds();
    loadPositions();

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);

    els.gameChallengeBtn?.addEventListener("click", startGameChallenge);
    els.leaderboardBtn?.addEventListener("click", () => {
      openLeaderboardSheet().catch(() => {});
    });
    els.leaderboardClose?.addEventListener("click", closeLeaderboardSheet);
    els.leaderboardBackdrop?.addEventListener("click", closeLeaderboardSheet);
    els.gameExitBtn?.addEventListener("click", abortGameChallenge);
    els.gameResultClose?.addEventListener("click", closeGameResultSheet);
    els.gameResultBackdrop?.addEventListener("click", closeGameResultSheet);
    els.gameResultDismissBtn?.addEventListener("click", closeGameResultSheet);
    els.gamePlayAgainBtn?.addEventListener("click", () => {
      closeGameResultSheet();
      startGameChallenge();
    });

    els.menuBtn.addEventListener("click", openDrawer);
    els.drawerClose.addEventListener("click", closeDrawer);
    els.drawerBackdrop.addEventListener("click", closeDrawer);
    els.resetPositionsBtn?.addEventListener("click", resetAllPositions);
    els.exportPositionsBtn?.addEventListener("click", exportPositions);
    els.exportAllPositionsBtn?.addEventListener("click", () => {
      exportAllMapsPositions().catch(() => alert("导出失败，请重试"));
    });
    els.adminEditAuthBtn?.addEventListener("click", () => {
      if (ensureEditAuthorized()) {
        updateLockUI();
        closeDrawer();
      }
    });
    els.adminEditExitBtn?.addEventListener("click", exitAdminEditMode);

    els.lockPositionsBtn?.addEventListener("click", lockPositions);
    els.unlockPositionsBtn?.addEventListener("click", unlockPositions);
    els.importPositionsBtn?.addEventListener("click", () => els.importPositionsFile?.click());
    els.importPositionsFile?.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      importPositionsFromFile(file);
      e.target.value = "";
    });

    els.sheetClose.addEventListener("click", closeSheet);
    els.sheetBackdrop.addEventListener("click", closeSheet);

    els.markWrongBtn.addEventListener("click", () => {
      if (selectedId) toggleWrong(selectedId, true);
    });

    els.unmarkWrongBtn.addEventListener("click", () => {
      if (selectedId) toggleWrong(selectedId, false);
    });

    els.clearAllWrongBtn.addEventListener("click", () => {
      if (wrongIds.size === 0) return;
      if (!confirm(`清除全部 ${wrongIds.size} 条记错记录？`)) return;
      wrongIds.clear();
      saveWrongIds();
      updateWrongUI();
    });

    els.mapSvg.addEventListener("click", () => {
      if (ignoreMapClick || dragState) return;
      if (selectedId) closeSheet();
    });

    setAuthFormMode("login");
    els.authTabLogin?.addEventListener("click", () => setAuthFormMode("login"));
    els.authTabRegister?.addEventListener("click", () => setAuthFormMode("register"));
    els.authSubmit?.addEventListener("click", submitAuthLogin);
    const authEnter = (e) => {
      if (e.key === "Enter") submitAuthLogin();
    };
    els.authUsername?.addEventListener("keydown", authEnter);
    els.authPassword?.addEventListener("keydown", authEnter);
    els.authPasswordConfirm?.addEventListener("keydown", authEnter);
    els.authSwitchBtn?.addEventListener("click", () => {
      if (!confirm("切换账号将退出当前昵称，确认？")) return;
      window.HaigeAuth?.logout();
      location.reload();
    });

    loadEditAuthSession();
    updatePositionEditModeUI();
    updateLockUI();
    syncPositionsLockedClass();

    const auth = window.HaigeAuth;
    if (auth) {
      auth.primeFromStorage?.();
      if (auth.isConfigured() && !window.supabase?.createClient) {
        showAuthGate("login");
        if (els.authError) {
          els.authError.textContent =
            "登录组件未加载。请刷新；若在微信中打开，请改用 Safari/Chrome。";
          els.authError.classList.remove("hidden");
        }
        return;
      }
      if (!auth.isConfigured() && !auth.isLocalHost()) {
        showAuthGate("missing-config");
        return;
      }
      if (auth.requiresLogin() && !auth.isLoggedIn()) {
        const initResult = await auth.init();
        if (!initResult.ok) {
          showAuthGate("login");
          if (els.authError) {
            els.authError.textContent = initResult.error || "无法连接登录服务";
            els.authError.classList.remove("hidden");
          }
          return;
        }
        showAuthGate("login");
        return;
      }
      hideAuthGate();
      updateAuthUI();
      startAppMaps();
      auth.init().catch(() => {});
      return;
    }
    startAppMaps();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      boot().catch(() => showAuthGate("login"));
    });
  } else {
    boot().catch(() => showAuthGate("login"));
  }
})();
