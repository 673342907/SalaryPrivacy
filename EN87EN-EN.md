# 🔧 解决 87 毫秒构建问题 - 完整方案

## 🚨 问题

**构建日志显示：**
- ✅ 构建完成，耗时 87 毫秒（太短！说明没有真正构建）
- ❌ 由于没有准备任何文件，因此跳过缓存上传（没有构建输出）
- ❌ 访问网页显示 404

**根本原因：**
Vercel 没有执行 Next.js 构建，可能是因为：
1. 安装命令没有正确执行
2. 构建命令没有正确执行
3. Root Directory 设置后，工作目录不正确

## ✅ 解决方案

### 方案 1: 更新 packages/nextjs/vercel.json（已更新）

**已更新 `packages/nextjs/vercel.json`：**

```json
{
  "version": 2,
  "framework": "nextjs",
  "installCommand": "cd ../.. && pnpm install && cd packages/nextjs",
  "buildCommand": "pnpm run build"
}
```

**关键点：**
- `installCommand`: 先回到根目录安装所有依赖（monorepo 需要），然后回到 `packages/nextjs`
- `buildCommand`: 在 `packages/nextjs` 目录中执行构建

### 方案 2: 在 Vercel Dashboard 中明确设置构建命令

**如果 `vercel.json` 不生效，在 Dashboard 中设置：**

1. **访问 Vercel Dashboard**
   - https://vercel.com/673342907s-projects/salary-privacy/settings

2. **Settings → General**
   - **Root Directory**: `packages/nextjs`（确认设置正确）
   - 点击 **Save**

3. **Settings → General → Build & Development Settings**
   - **Framework Preset**: Next.js
   - **Install Command**: `cd ../.. && pnpm install && cd packages/nextjs`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: **留空**（Next.js 自动处理）
   - 点击 **Save**

### 方案 3: 检查 monorepo 依赖安装

**问题可能是：**
- `packages/nextjs` 依赖 `packages/fhevm-sdk`
- 需要先在根目录安装所有依赖
- 然后才能构建 Next.js

**解决方案：**
确保 `installCommand` 在根目录执行 `pnpm install`。

## 🔍 诊断步骤

### 步骤 1: 检查构建日志

**在 Vercel Dashboard 中查看构建日志，确认：**

1. **是否执行了安装命令？**
   - 应该看到：`Running "install" command: ...`
   - 应该看到：`pnpm install` 的输出

2. **是否执行了构建命令？**
   - 应该看到：`Running "build" command: ...`
   - 应该看到：`next build` 的输出

3. **构建时间是多少？**
   - 正常应该需要几秒钟（不是 87 毫秒）
   - 应该看到：`Compiled successfully`

### 步骤 2: 验证 Root Directory 设置

**在 Vercel Dashboard 中：**
- Settings → General → Root Directory
- 确认设置为：`packages/nextjs`（没有斜杠，没有空格）

### 步骤 3: 检查 packages/nextjs/vercel.json

**确认文件存在且内容正确：**
- 文件路径：`packages/nextjs/vercel.json`
- 内容应该包含 `installCommand` 和 `buildCommand`

## 📝 立即操作

### 步骤 1: 推送到 GitHub

```powershell
git push
```

### 步骤 2: 在 Vercel Dashboard 中设置

1. **Settings → General**
   - **Root Directory**: `packages/nextjs`
   - 点击 **Save**

2. **Settings → General → Build & Development Settings**
   - **Install Command**: `cd ../.. && pnpm install && cd packages/nextjs`
   - **Build Command**: `pnpm run build`
   - 点击 **Save**

### 步骤 3: 清除缓存并重新部署

1. **Deployments → 最新部署**
2. 点击 "..." → "Redeploy"
3. **取消勾选** "Use existing Build Cache"
4. 点击 **"Redeploy"**

### 步骤 4: 检查构建日志

**部署后，检查构建日志，应该看到：**
- ✅ 执行了 `pnpm install`
- ✅ 执行了 `next build`
- ✅ 构建时间需要几秒钟
- ✅ 显示了路由信息

## 🎯 为什么需要 `cd ../.. && pnpm install`？

**Monorepo 结构：**
```
SalaryPrivacy/
├── package.json (根目录，定义 workspaces)
├── packages/
│   ├── fhevm-sdk/
│   ├── hardhat/
│   └── nextjs/
│       ├── package.json (依赖 @fhevm-sdk)
│       └── vercel.json
```

**问题：**
- `packages/nextjs` 依赖 `@fhevm-sdk`（workspace 依赖）
- 需要在根目录执行 `pnpm install` 才能安装所有 workspace 依赖
- 如果只在 `packages/nextjs` 目录执行 `pnpm install`，会找不到 workspace 依赖

**解决方案：**
- `installCommand`: `cd ../.. && pnpm install && cd packages/nextjs`
  - 回到根目录
  - 安装所有依赖（包括 workspace 依赖）
  - 回到 `packages/nextjs` 目录

---

**现在执行：`git push`，然后在 Dashboard 中设置构建命令！** 🚀




