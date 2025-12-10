# 🔧 修复 Vercel 无法识别 Next.js 版本问题

## 🐛 问题

Vercel 构建错误：
```
警告：无法识别 Next.js 版本，请确保已将其定义为项目依赖项。
错误：未检测到 Next.js 版本。请确保 package.json 文件中的 "dependencies" 或 "devDependencies" 中包含 "next"。
```

## 🔍 问题原因

**Next.js 在 `packages/nextjs` 目录下，不在项目根目录**

Vercel 默认在项目根目录查找 `package.json` 中的 Next.js，但你的项目是 monorepo 结构，Next.js 在子目录中。

## ✅ 解决方案

### 方案 1: 在 Vercel Dashboard 中设置 Root Directory（推荐）

这是**最简单直接**的方法：

1. **访问 Vercel Dashboard**
   - https://vercel.com
   - 进入你的项目

2. **进入项目设置**
   - **Settings** → **General**

3. **设置 Root Directory**
   - 找到 **Root Directory** 设置
   - 设置为：`packages/nextjs`
   - 点击 **Save**

4. **调整构建命令**
   - 进入 **Build & Development Settings**
   - **Build Command**: `cd ../.. && pnpm sdk:build && pnpm build`
   - **Install Command**: `cd ../.. && pnpm install --no-frozen-lockfile`
   - 点击 **Save**

5. **重新部署**
   - 进入 **Deployments**
   - 点击 **"..."** → **"Redeploy"**
   - 选择最新提交
   - 点击 **"Redeploy"**

### 方案 2: 修改 vercel.json（如果方案 1 不工作）

更新 `vercel.json`：

```json
{
  "buildCommand": "pnpm sdk:build && cd packages/nextjs && pnpm build",
  "installCommand": "pnpm install --no-frozen-lockfile",
  "framework": "nextjs"
}
```

然后在 Vercel Dashboard 中：
- **Root Directory**: 设置为 `packages/nextjs`

## 📋 在 Cursor 中快速推送到 GitHub

### 方法 1: 使用 Cursor 的 Git 面板（最简单）

1. **打开 Git 面板**
   - 点击左侧边栏的 **Source Control** 图标（或按 `Ctrl+Shift+G`）

2. **查看更改**
   - 在 "Changes" 部分查看修改的文件

3. **暂存更改**
   - 点击文件旁边的 **"+"** 按钮
   - 或点击 "Changes" 旁边的 **"+"** 暂存所有更改

4. **提交**
   - 在顶部的输入框输入提交信息
   - 按 `Ctrl+Enter` 或点击 **"✓ Commit"** 按钮

5. **推送**
   - 点击 **"..."** 菜单（三个点）
   - 选择 **"Push"**
   - 或使用快捷键：`Ctrl+Shift+P` → 输入 "Git: Push"

### 方法 2: 使用命令面板

1. **打开命令面板**
   - 按 `Ctrl+Shift+P`（Windows）或 `Cmd+Shift+P`（Mac）

2. **执行 Git 命令**
   - 输入 `Git: Push` 并选择
   - 或输入 `Git: Commit` 先提交

### 方法 3: 使用终端（在 Cursor 中）

1. **打开终端**
   - 按 `` Ctrl+` ``（反引号）
   - 或菜单：**Terminal** → **New Terminal**

2. **执行命令**
   ```powershell
   git add .
   git commit -m "你的提交信息"
   git push
   ```

### 方法 4: 使用快捷键

- **提交**: `Ctrl+Enter`（在 Git 面板中）
- **推送**: `Ctrl+Shift+P` → `Git: Push`

## 🚀 快速操作流程

### 在 Cursor 中推送代码：

1. **查看更改** (`Ctrl+Shift+G`)
2. **暂存更改**（点击 "+"）
3. **提交**（输入信息，按 `Ctrl+Enter`）
4. **推送**（点击 "..." → "Push"）

### 或者使用终端：

```powershell
# 在 Cursor 的终端中（Ctrl+`）
git add .
git commit -m "修复 Next.js 识别问题"
git push
```

## ⚠️ 重要提示

### 关于 Root Directory

设置 Root Directory 为 `packages/nextjs` 后：
- ✅ Vercel 会在 `packages/nextjs` 目录查找 `package.json`
- ✅ 可以正确识别 Next.js 版本
- ⚠️ 但构建命令需要从根目录开始（因为需要先构建 SDK）

### 构建命令说明

如果 Root Directory 设置为 `packages/nextjs`，构建命令需要：
```bash
cd ../.. && pnpm sdk:build && pnpm build
```

这表示：
1. 回到项目根目录（`cd ../..`）
2. 构建 SDK（`pnpm sdk:build`）
3. 回到 nextjs 目录构建（`pnpm build` 在 nextjs 目录执行）

## 📝 检查清单

- [ ] 在 Vercel Dashboard 中设置 Root Directory 为 `packages/nextjs`
- [ ] 调整构建命令（如果需要）
- [ ] 在 Cursor 中提交并推送代码
- [ ] 在 Vercel 中重新部署
- [ ] 验证构建成功

---

**现在在 Vercel Dashboard 中设置 Root Directory，然后在 Cursor 中推送代码！** 🚀

