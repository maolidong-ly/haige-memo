# 嗨记 · 高中地理地图刷记（公开站点）

本仓库**仅含静态网页**，供 [GitHub Pages](https://pages.github.com/) 给学生访问。  
源码开发与打包在私有仓库 `Paige` 的 `geo-map/static/` 目录维护。

**线上地址（开启 Pages 后）：** https://maolidong-ly.github.io/haige-memo/

## 开启 Pages（公开仓，免费）

1. 本仓库须为 **Public**
2. **Settings → Pages → Build and deployment**
3. **Source**：Deploy from a branch  
4. **Branch**：`main` → **`/ (root)`** → Save  
5. 约 1～2 分钟后打开上方链接

## 从 Paige 同步更新

在私有仓 `geo-map` 目录执行：

```bash
./scripts/sync-haige-memo.sh
cd ../haige-memo && git push origin main
```
