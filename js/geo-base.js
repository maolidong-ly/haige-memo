/**
 * 底图渲染 · 使用「中国山地空白图」
 */
window.GeoBase = (function () {
  "use strict";

  let mapMeta = null;

  /** 兼容 GitHub Pages 子路径（如 /haige/） */
  function assetUrl(path) {
    if (!path || /^https?:\/\//i.test(path)) return path;
    return new URL(path, document.baseURI).href;
  }

  function setMapMeta(meta) {
    mapMeta = meta;
  }

  function getSize() {
    return {
      w: mapMeta?.mapWidth || 2400,
      h: mapMeta?.mapHeight || 1696,
    };
  }

  function renderBaseLayer() {
    const src = assetUrl(mapMeta?.mapImage || "assets/china-mountains-blank.jpg");
    const { w, h } = getSize();
    return `
      <rect width="${w}" height="${h}" fill="#ffffff"/>
      <image href="${src}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>
    `;
  }

  function loadReady() {
    return Promise.resolve();
  }

  return {
    assetUrl,
    setMapMeta,
    getSize,
    renderBaseLayer,
    loadReady,
  };
})();
