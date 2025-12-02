# 🔧 解决 Vercel CLI unlink 错误

## 🚨 错误信息

```
Error: Could not find "E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy\packages\nextjs\unlink"
```

## 🔍 问题原因

**可能的原因：**
1. 当前目录没有链接到 Vercel 项目（没有 `.vercel` 目录）
2. `vercel unlink` 命令在当前版本中可能不可用或语法不同

## ✅ 解决方案

### 方案 1: 直接部署（推荐，最简单）

**如果项目没有链接，直接部署即可：**

```powershell
# 在 packages/nextjs 目录下
cd packages\nextjs

# 直接部署（CLI 会自动处理链接）
vercel --prod --force
```

**CLI 会询问：**
- 是否设置并部署？ → 输入 `Y`
- 链接到现有项目？ → 选择 `Y`，然后选择 `salary-privacy`
- Root Directory？ → 输入 `.`（当前目录）

### 方案 2: 删除 .vercel 目录（如果存在）

**如果存在 `.vercel` 目录但链接有问题：**

```powershell
# 在 packages/nextjs 目录下
cd packages\nextjs

# 删除 .vercel 目录
Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue

# 重新部署
vercel --prod --force
```

### 方案 3: 使用 vercel link 重新链接

**如果项目已链接但配置错误：**

```powershell
# 在 packages/nextjs 目录下
cd packages\nextjs

# 重新链接项目
vercel link

# 按照提示：
# - 选择现有项目：salary-privacy
# - Root Directory: .（当前目录）

# 然后部署
vercel --prod --force
```

### 方案 4: 在 Vercel Dashboard 中配置（如果 CLI 有问题）

**如果 CLI 一直有问题，直接在 Dashboard 中配置：**

1. **访问 Vercel Dashboard**
   - https://vercel.com/673342907s-projects/salary-privacy/settings

2. **Settings → General**
   - **Root Directory**: `packages/nextjs`
   - 点击 **Save**

3. **清除缓存并重新部署**
   - Deployments → 最新部署 → "..." → "Redeploy"
   - 取消勾选 "Use existing Build Cache"
   - 点击 "Redeploy"

## 🎯 推荐操作

### 立即执行（最简单）：

```powershell
# 在 packages/nextjs 目录下
cd packages\nextjs

# 直接部署（不需要 unlink）
vercel --prod --force
```

**CLI 会处理所有链接和配置！**

## 📝 为什么不需要 unlink？

**如果项目没有链接：**
- `vercel --prod --force` 会自动处理链接
- CLI 会询问是否链接到现有项目

**如果项目已链接：**
- `vercel --prod --force` 会使用现有链接
- 如果需要更改配置，可以在 Dashboard 中修改

---

**推荐直接执行：`vercel --prod --force`，不需要 unlink！** 🚀

