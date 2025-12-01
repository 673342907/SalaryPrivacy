# 🔧 修复 Vercel 使用 yarn 而不是 pnpm 的问题

## 🐛 问题

Vercel 构建日志显示：
```
运行"安装"命令：`yarn install`...
错误 @fhevm-sdk@0.1.0：名称包含非法字符
```

**问题原因**：
- Vercel 在使用 `yarn install` 而不是 `pnpm install`
- yarn 不支持 workspace 协议 `workspace:*`（pnpm 支持）
- 导致 `@fhevm-sdk@0.1.0` 报错

## ✅ 解决方案

### 方案 1: 在 Vercel Dashboard 中强制使用 pnpm（推荐，最快）

1. **访问 Vercel Dashboard**
   - https://vercel.com
   - 进入你的项目

2. **进入项目设置**
   - **Settings** → **General** → **Build & Development Settings**

3. **设置 Package Manager**
   - 找到 **Package Manager** 或相关设置
   - 选择 **pnpm**（如果选项存在）

4. **设置 Install Command**
   - **Install Command**: `pnpm install --no-frozen-lockfile`
   - 确保没有设置为 `yarn install`

5. **清除其他锁定文件设置**
   - 确保没有引用 `yarn.lock`
   - 确保使用 `pnpm-lock.yaml`

6. **保存并重新部署**

### 方案 2: 删除 yarn.lock（如果存在）

如果项目中有 `yarn.lock` 文件，Vercel 可能会自动使用 yarn：

```powershell
# 检查是否有 yarn.lock
if (Test-Path yarn.lock) {
    Remove-Item yarn.lock
    git add yarn.lock
    git commit -m "删除 yarn.lock，使用 pnpm"
    git push
}
```

### 方案 3: 确保 vercel.json 正确

确保 `vercel.json` 中明确指定使用 pnpm：

```json
{
  "buildCommand": "pnpm sdk:build && cd packages/nextjs && pnpm build",
  "installCommand": "pnpm install --no-frozen-lockfile",
  "framework": "nextjs"
}
```

### 方案 4: 在 package.json 中指定包管理器

在根目录的 `package.json` 中添加：

```json
{
  "packageManager": "pnpm@10.24.0"
}
```

## 🚀 立即操作步骤

### 步骤 1: 在 Vercel Dashboard 中设置

1. **访问 Vercel Dashboard**
   - https://vercel.com
   - 进入项目

2. **Settings** → **General** → **Build & Development Settings**

3. **设置以下值**：
   - **Install Command**: `pnpm install --no-frozen-lockfile`
   - **Build Command**: `pnpm sdk:build && cd packages/nextjs && pnpm build`
   - **Framework**: Next.js（自动检测）
   - **Root Directory**: `packages/nextjs`（解决 Next.js 识别问题）

4. **点击 Save**

### 步骤 2: 检查并删除 yarn.lock（如果存在）

```powershell
# 检查
if (Test-Path yarn.lock) {
    Write-Host "发现 yarn.lock，需要删除" -ForegroundColor Red
    Remove-Item yarn.lock
    git add yarn.lock
    git commit -m "删除 yarn.lock，使用 pnpm"
}
```

### 步骤 3: 在 package.json 中指定包管理器

在根目录 `package.json` 中添加：

```json
{
  "packageManager": "pnpm@10.24.0"
}
```

### 步骤 4: 提交并推送

```powershell
git add package.json
git commit -m "指定使用 pnpm 作为包管理器"
git push
```

### 步骤 5: 重新部署

在 Vercel Dashboard 中：
- **Deployments** → **"..."** → **"Redeploy"**
- 取消勾选 "Use existing Build Cache"
- 点击 **"Redeploy"**

## 📋 检查清单

- [ ] 在 Vercel Dashboard 中设置 Install Command 为 `pnpm install --no-frozen-lockfile`
- [ ] 检查并删除 `yarn.lock`（如果存在）
- [ ] 在 `package.json` 中添加 `"packageManager": "pnpm@10.24.0"`
- [ ] 提交并推送更改
- [ ] 在 Vercel 中重新部署
- [ ] 验证构建日志显示使用 pnpm

## ⚠️ 重要提示

### 为什么 yarn 会失败？

1. **workspace 协议不支持**
   - yarn v1 不支持 `workspace:*` 协议
   - pnpm 和 yarn v2+ 支持

2. **包名格式**
   - `@fhevm-sdk@0.1.0` 中的 `@` 符号在 yarn v1 中可能有问题
   - pnpm 完全支持

### 确保使用 pnpm

1. **删除 yarn.lock**（如果存在）
2. **在 Vercel Dashboard 中明确设置**
3. **在 package.json 中指定包管理器**
4. **确保 vercel.json 正确**

---

**现在在 Vercel Dashboard 中设置使用 pnpm，然后重新部署！** 🚀

