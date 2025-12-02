# 🔧 解决 Vercel CLI 路径重复问题 - 最终方案

## 🚨 错误信息

```
Error: The provided path "E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy\packages\nextjs\packages\nextjs" does not exist.
```

## 🔍 问题原因

**路径重复了！** 错误路径显示：`packages\nextjs\packages\nextjs`

**原因：**
- Vercel 项目设置中的 **Root Directory** 是 `packages/nextjs`
- 你已经在 `packages/nextjs` 目录下执行命令
- Vercel CLI 读取了项目设置，又在当前目录基础上加上了 Root Directory
- 导致路径重复

## ✅ 解决方案

### 方案 1: 删除 .vercel 目录并重新链接（推荐）

**删除本地链接，然后重新链接，设置 Root Directory 为当前目录：**

```powershell
# 在 packages/nextjs 目录下
cd packages\nextjs

# 删除 .vercel 目录（清除本地链接）
Remove-Item -Recurse -Force .vercel

# 重新链接项目
vercel link
# 按照提示：
# - 选择现有项目：salary-privacy
# - Root Directory: .（当前目录，不是 packages/nextjs）

# 部署
vercel --prod --force
```

### 方案 2: 在 Vercel Dashboard 中清除 Root Directory

**如果不想删除 .vercel 目录，在 Dashboard 中修改：**

1. **访问 Vercel Dashboard**
   - https://vercel.com/673342907s-projects/salary-privacy/settings

2. **Settings → General**
   - **Root Directory**: **清空**（留空，不要填任何值）
   - 点击 **Save**

3. **重新执行 CLI 命令**
   ```powershell
   cd packages\nextjs
   vercel --prod --force
   ```

### 方案 3: 从项目根目录部署

**如果 Root Directory 设置为 `packages/nextjs`，从根目录部署：**

```powershell
# 回到项目根目录
cd E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy

# 部署（Vercel 会使用 Root Directory 设置）
vercel --prod --force
```

## 🎯 推荐操作步骤

### 立即执行（最简单）：

```powershell
# 1. 在 packages/nextjs 目录下
cd packages\nextjs

# 2. 删除 .vercel 目录
Remove-Item -Recurse -Force .vercel

# 3. 重新链接
vercel link
# 选择项目：salary-privacy
# Root Directory: .（当前目录）

# 4. 部署
vercel --prod --force
```

## 📝 为什么会出现路径重复？

**Vercel CLI 的工作方式：**
- 如果项目已链接，CLI 会读取 `.vercel` 目录中的配置
- 如果 Vercel Dashboard 中设置了 Root Directory，CLI 会使用这个设置
- 如果你已经在 Root Directory 目录下，CLI 会在当前路径基础上加上 Root Directory
- 导致路径重复

**解决方案：**
- 删除 `.vercel` 目录，重新链接时设置 Root Directory 为 `.`（当前目录）
- 或者在 Dashboard 中清除 Root Directory 设置

---

**推荐立即执行方案 1：删除 .vercel 目录，重新链接，设置 Root Directory 为 `.`！** 🚀

