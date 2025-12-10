# 🔧 解决 Vercel 找不到 packages/nextjs 目录

## 🚨 问题

Vercel 构建时提示：
```
指定的根目录"packages/nextjs"不存在。请更新您的项目设置。
```

## 🔍 原因分析

**可能的原因：**
1. **代码未推送到 GitHub** - `packages/nextjs` 目录在本地，但 GitHub 上没有
2. **Vercel 使用了旧提交** - Vercel 从旧提交获取代码，旧提交中没有 `packages/nextjs`
3. **Git 忽略规则** - `.gitignore` 可能忽略了 `packages/nextjs`

## ✅ 解决方案

### 方案 1: 检查并推送代码到 GitHub（最重要！）

#### 步骤 1: 检查本地代码状态

```powershell
# 检查是否有未提交的更改
git status

# 检查 packages/nextjs 是否存在
ls packages/nextjs
```

#### 步骤 2: 添加并提交所有更改

```powershell
# 添加所有更改（包括 packages/nextjs）
git add .

# 提交更改
git commit -m "添加 ConfidentialSalary 主项目代码"

# 推送到 GitHub
git push
```

#### 步骤 3: 验证 GitHub 上的代码

访问：https://github.com/673342907/SalaryPrivacy/tree/main/packages/nextjs

**确认以下文件存在：**
- ✅ `package.json`
- ✅ `app/page.tsx`
- ✅ `app/confidential-salary/page.tsx`
- ✅ `vercel.json`

### 方案 2: 在 Vercel Dashboard 中重新部署

#### 步骤 1: 清除缓存并重新部署

1. **访问 Vercel Dashboard**
   - https://vercel.com
   - 进入你的项目

2. **Deployments → 最新部署**
   - 点击 "..." → "Redeploy"
   - **重要**：取消勾选 "Use existing Build Cache"
   - **选择最新提交**（应该包含 packages/nextjs）
   - 点击 "Redeploy"

#### 步骤 2: 验证 Root Directory 设置

1. **Settings → General**
   - **Root Directory**: 确认设置为 `packages/nextjs`
   - 如果没有设置，输入 `packages/nextjs`
   - 点击 **Save**

### 方案 3: 使用 Vercel CLI 部署（绕过 Git 问题）

**如果 Git 推送有问题，直接使用 CLI 部署：**

```powershell
# 进入主项目目录
cd packages\nextjs

# 部署到生产环境
vercel --prod --force
```

**优势：**
- ✅ 直接使用当前代码，不依赖 Git
- ✅ 绕过所有 Git 连接问题
- ✅ 立即看到效果

## 🔍 检查清单

在部署前，确认：

- [ ] `packages/nextjs` 目录在本地存在
- [ ] `packages/nextjs/package.json` 存在
- [ ] `packages/nextjs/app/page.tsx` 存在
- [ ] 代码已推送到 GitHub
- [ ] GitHub 上可以看到 `packages/nextjs` 目录
- [ ] Vercel Root Directory 设置为 `packages/nextjs`
- [ ] Vercel 使用最新提交

## 📝 快速操作步骤

### 如果代码未推送：

```powershell
# 1. 添加所有更改
git add .

# 2. 提交
git commit -m "添加 ConfidentialSalary 主项目代码"

# 3. 推送
git push

# 4. 在 Vercel Dashboard 中重新部署
# 或使用 CLI：
cd packages\nextjs
vercel --prod --force
```

### 如果代码已推送但 Vercel 仍找不到：

```powershell
# 使用 CLI 直接部署（推荐）
cd packages\nextjs
vercel --prod --force
```

## 💡 推荐方案

**推荐使用方案 3（Vercel CLI）：**
- ✅ 最可靠
- ✅ 直接使用当前代码
- ✅ 不依赖 Git 连接
- ✅ 可以立即看到效果

---

**按照以上步骤操作，应该就能解决"找不到 packages/nextjs 目录"的问题！** 🚀




