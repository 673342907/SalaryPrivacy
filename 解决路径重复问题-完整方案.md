# 🔧 解决路径重复问题 - 完整方案

## 🚨 问题

**错误信息：**
```
Error: The provided path "E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy\packages\nextjs\packages\nextjs" does not exist.
```

**原因：**
- Vercel Dashboard 中的 Root Directory 设置为 `packages/nextjs`
- 从 `packages/nextjs` 目录运行 CLI 时，Vercel 会追加 Root Directory
- 导致路径重复：`packages/nextjs\packages/nextjs`

## ✅ 解决方案

### 方案 1: 清除 Vercel Dashboard 中的 Root Directory（推荐）

**步骤 1: 在 Vercel Dashboard 中清除 Root Directory**

1. **访问 Vercel Dashboard**
   - https://vercel.com/673342907s-projects/salary-privacy/settings

2. **Settings → General**
   - **Root Directory**: **清空**（删除 `packages/nextjs`，留空）
   - 点击 **Save**

3. **Settings → General → Build & Development Settings**
   - **Framework Preset**: Next.js
   - **Build Command**: `cd packages/nextjs && pnpm install && pnpm run build`
   - **Install Command**: `cd packages/nextjs && pnpm install`
   - **Output Directory**: `packages/nextjs/.next`
   - 点击 **Save**

**步骤 2: 从项目根目录运行 CLI**

```powershell
# 从项目根目录运行
cd E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy

# 部署
vercel --prod --force
```

### 方案 2: 删除 .vercel 并重新链接（从 packages/nextjs 目录）

**步骤 1: 删除 .vercel 目录**

```powershell
cd packages\nextjs
Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue
```

**步骤 2: 重新链接项目**

```powershell
vercel link
```

**链接时：**
- 选择项目：`salary-privacy`
- **Root Directory**: 输入 `.`（当前目录，不是 `packages/nextjs`）

**步骤 3: 部署**

```powershell
vercel --prod --force
```

### 方案 3: 从项目根目录部署（最简单）

**步骤 1: 在项目根目录创建 vercel.json**

```json
{
  "version": 2,
  "buildCommand": "cd packages/nextjs && pnpm install && pnpm run build",
  "installCommand": "cd packages/nextjs && pnpm install",
  "framework": "nextjs",
  "outputDirectory": "packages/nextjs/.next"
}
```

**步骤 2: 从根目录部署**

```powershell
# 回到项目根目录
cd E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy

# 删除 packages/nextjs 中的 .vercel（如果有）
Remove-Item -Recurse -Force packages\nextjs\.vercel -ErrorAction SilentlyContinue

# 链接项目（从根目录）
vercel link
# 选择项目：salary-privacy
# Root Directory: .（根目录）

# 部署
vercel --prod --force
```

## 🎯 推荐操作（按顺序执行）

### 立即执行（最简单）：

```powershell
# 1. 回到项目根目录
cd E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy

# 2. 删除 packages/nextjs 中的 .vercel
Remove-Item -Recurse -Force packages\nextjs\.vercel -ErrorAction SilentlyContinue

# 3. 链接项目（从根目录）
vercel link
# 选择：salary-privacy
# Root Directory: .（根目录）

# 4. 部署
vercel --prod --force
```

### 同时，在 Vercel Dashboard 中：

1. **Settings → General**
   - **Root Directory**: **清空**（留空）
   - 点击 **Save**

2. **Settings → General → Build & Development Settings**
   - **Build Command**: `cd packages/nextjs && pnpm install && pnpm run build`
   - **Install Command**: `cd packages/nextjs && pnpm install`
   - **Output Directory**: `packages/nextjs/.next`
   - 点击 **Save**

## 📝 为什么会出现路径重复？

**问题流程：**
1. Vercel Dashboard 中 Root Directory = `packages/nextjs`
2. 从 `packages/nextjs` 目录运行 CLI
3. CLI 读取 Dashboard 设置：Root Directory = `packages/nextjs`
4. CLI 将 Root Directory 追加到当前路径
5. 结果：`当前路径\packages/nextjs` = `packages/nextjs\packages/nextjs` ❌

**解决方案：**
- **选项 A**: 清除 Dashboard 的 Root Directory，从根目录部署
- **选项 B**: 从 `packages/nextjs` 部署时，设置 Root Directory 为 `.`（当前目录）

---

**现在就执行推荐操作！** 🚀




