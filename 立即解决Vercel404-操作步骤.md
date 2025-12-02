# 🚀 立即解决 Vercel 404 - 操作步骤

## 📋 快速操作指南

### 步骤 1: 在 Vercel Dashboard 中配置（5分钟）

1. **访问设置页面**
   - https://vercel.com/673342907s-projects/salary-privacy/settings

2. **设置 Root Directory**
   - Settings → General
   - **Root Directory**: 输入 `packages/nextjs`（不要有空格）
   - 点击 **Save**

3. **配置构建设置**
   - Settings → General → Build & Development Settings
   - **Framework Preset**: 选择 **Next.js**
   - **Build Command**: **留空**（让 Vercel 自动检测）
   - **Install Command**: **留空**（让 Vercel 自动检测）
   - **Output Directory**: **留空**（Next.js 自动处理）
   - 点击 **Save**

4. **清除缓存并重新部署**
   - Deployments → 最新部署
   - 点击 "..." → "Redeploy"
   - **取消勾选** "Use existing Build Cache"
   - 点击 **"Redeploy"**

### 步骤 2: 验证构建成功

**等待构建完成，检查日志：**
- ✅ 应该看到 `pnpm install`
- ✅ 应该看到 `next build`
- ✅ 构建时间应该需要几秒钟（不是 89 毫秒）
- ✅ 应该显示路由信息

### 步骤 3: 如果还是 404，使用 CLI 部署

```powershell
# 进入 packages/nextjs 目录
cd packages\nextjs

# 取消链接
vercel unlink

# 重新链接
vercel link
# 选择项目：salary-privacy
# Root Directory: .（当前目录）

# 部署
vercel --prod --force
```

## ✅ 验证清单

部署成功后，确认：

- [ ] 构建日志显示执行了 `pnpm install`
- [ ] 构建日志显示执行了 `next build`
- [ ] 构建时间需要几秒钟（不是 89 毫秒）
- [ ] 显示了路由信息（`/` 和 `/confidential-salary`）
- [ ] 访问 https://salary-privacy.vercel.app 可以看到页面（不是 404）

---

**立即执行步骤 1，应该就能解决问题！** 🚀

