# 🔧 解决 Vercel CLI 路径重复错误

## 🚨 错误信息

```
Error: The provided path "E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy\packages\nextjs\packages\nextjs" does not exist.
```

## 🔍 问题原因

**路径重复了！** 错误路径显示：`packages\nextjs\packages\nextjs`

**原因：**
- Vercel 项目设置中的 **Root Directory** 设置为 `packages/nextjs`
- 你已经在 `packages/nextjs` 目录下执行命令
- Vercel CLI 读取了项目设置，又在当前目录基础上加上了 Root Directory
- 导致路径重复：`当前目录(packages/nextjs) + Root Directory(packages/nextjs) = packages/nextjs/packages/nextjs`

## ✅ 解决方案

### 方案 1: 清除 Vercel 项目中的 Root Directory 设置（推荐）

1. **访问 Vercel Dashboard**
   - https://vercel.com/673342907s-projects/salary-privacy/settings
   - 或访问：https://vercel.com → 你的项目 → Settings → General

2. **清除 Root Directory**
   - 找到 **Root Directory** 设置
   - **清空它**（留空，不要填任何值）
   - 点击 **Save**

3. **重新执行 CLI 命令**
   ```powershell
   cd packages\nextjs
   vercel --prod --force
   ```

### 方案 2: 从项目根目录部署

**如果不想修改 Vercel Dashboard 设置，可以从项目根目录部署：**

```powershell
# 回到项目根目录
cd E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy

# 部署（Vercel 会使用 Root Directory 设置）
vercel --prod --force
```

**注意：** 这需要 Root Directory 设置为 `packages/nextjs`

### 方案 3: 使用 --cwd 参数（如果 CLI 支持）

```powershell
# 在项目根目录执行
cd E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy

# 使用 --cwd 指定工作目录
vercel --prod --force --cwd packages/nextjs
```

### 方案 4: 创建新的 Vercel 项目（如果以上都不行）

```powershell
cd packages\nextjs

# 取消链接当前项目
vercel unlink

# 创建新项目
vercel --prod
```

## 🎯 推荐操作步骤

### 立即执行（最简单）：

1. **访问 Vercel Dashboard**
   - https://vercel.com/673342907s-projects/salary-privacy/settings

2. **Settings → General**
   - **Root Directory**: **清空**（留空）
   - 点击 **Save**

3. **重新执行 CLI 命令**
   ```powershell
   cd packages\nextjs
   vercel --prod --force
   ```

## 📝 为什么会出现这个问题？

**Vercel CLI 的工作方式：**
- 如果项目已链接到 Vercel，CLI 会读取项目设置
- 如果设置了 Root Directory，CLI 会在当前目录基础上应用这个设置
- 如果你已经在 Root Directory 目录下，就会导致路径重复

**解决方案：**
- 清除 Root Directory 设置（让 CLI 使用当前目录）
- 或者从项目根目录部署（让 CLI 使用 Root Directory 设置）

---

**推荐立即执行方案 1：清除 Root Directory 设置，然后重新执行 CLI 命令！** 🚀



