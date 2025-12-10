# 🔧 解决 Vercel 无法识别 Next.js 版本

## 🚨 错误信息

```
警告：无法识别 Next.js 版本，请确保已将其定义为项目依赖项。
错误：未检测到 Next.js 版本。请确保 package.json 文件中的 "dependencies" 或 "devDependencies" 中包含 "next"。另请检查您的根目录设置是否与 package.json 文件的目录一致。
```

## 🔍 问题分析

**从构建日志看：**
- ✅ 依赖安装成功
- ✅ SDK 构建成功
- ❌ Vercel 无法识别 Next.js 版本

**可能的原因：**
1. Vercel 在错误的目录查找 `package.json`
2. Root Directory 设置不正确
3. Vercel 没有正确切换到 `packages/nextjs` 目录

## ✅ 解决方案

### 方案 1: 在 Vercel Dashboard 中正确设置 Root Directory（最重要！）

1. **访问 Vercel Dashboard**
   - https://vercel.com/673342907s-projects/salary-privacy/settings

2. **Settings → General**
   - **Root Directory**: 设置为 `packages/nextjs`
   - **重要**：确保没有前导或尾随空格
   - 点击 **Save**

3. **Settings → General → Build & Development Settings**
   - **Framework Preset**: 手动选择 **Next.js**
   - **Build Command**: 留空（让 Vercel 自动检测）
   - **Install Command**: 留空（让 Vercel 自动检测）
   - **Output Directory**: 留空（Next.js 自动处理）
   - 点击 **Save**

4. **清除缓存并重新部署**
   - Deployments → 最新部署 → "..." → "Redeploy"
   - 取消勾选 "Use existing Build Cache"
   - 点击 "Redeploy"

### 方案 2: 确保 next 在 dependencies 中

**检查 `packages/nextjs/package.json`：**

`next` 应该在 `dependencies` 中，而不是 `devDependencies`。

**当前配置（应该已经正确）：**
```json
{
  "dependencies": {
    "next": "~15.2.3",
    ...
  }
}
```

### 方案 3: 在 packages/nextjs/vercel.json 中明确指定

**更新 `packages/nextjs/vercel.json`：**

```json
{
  "version": 2,
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "buildCommand": "pnpm run build",
  "outputDirectory": ".next"
}
```

### 方案 4: 使用 Vercel CLI 从 packages/nextjs 目录部署

**如果 Dashboard 配置有问题，使用 CLI：**

```powershell
# 在 packages/nextjs 目录下
cd packages\nextjs

# 确保已删除 .vercel 目录（如果之前有路径重复问题）
Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue

# 重新链接
vercel link
# 选择项目：salary-privacy
# Root Directory: .（当前目录）

# 部署
vercel --prod --force
```

## 🔍 验证构建成功

**构建成功后，日志应该显示：**
- ✅ 执行了 `pnpm install`
- ✅ 执行了 `next build`
- ✅ 没有 "无法识别 Next.js 版本" 的警告
- ✅ 构建时间需要几秒钟（不是 89 毫秒）
- ✅ 显示了路由信息

## 📝 推荐操作步骤

### 立即执行（按顺序）：

1. **在 Vercel Dashboard 中：**
   - Settings → General → Root Directory: `packages/nextjs`
   - Settings → Build & Development Settings:
     - Framework Preset: **Next.js**（手动选择）
     - Build Command: 留空
     - Install Command: 留空
     - Output Directory: 留空
   - 点击 Save

2. **清除缓存并重新部署：**
   - Deployments → 最新部署 → "..." → "Redeploy"
   - 取消勾选 "Use existing Build Cache"
   - 点击 "Redeploy"

3. **等待构建完成，检查日志：**
   - 应该没有 "无法识别 Next.js 版本" 的警告
   - 应该看到 `next build` 执行

## 💡 为什么会出现这个问题？

**Vercel 的工作方式：**
- Vercel 需要在正确的位置查找 `package.json`
- 如果 Root Directory 设置错误，Vercel 会在错误的位置查找
- 即使依赖安装成功，如果 Vercel 没有在正确的位置查找，也会报错

**解决方案：**
- 正确设置 Root Directory 为 `packages/nextjs`
- 手动选择 Framework Preset 为 Next.js
- 确保 Vercel 在正确的位置查找 `package.json`

---

**推荐立即执行方案 1：在 Vercel Dashboard 中正确设置 Root Directory 和 Framework Preset！** 🚀




