# 🔧 修复 Vercel routes-manifest.json 错误

## 🚨 问题

构建成功，但最后出现错误：
```
错误：找不到文件"/vercel/path0/test-app/cd ../.. && pnpm install --no-frozen-lockfile/routes-manifest.json"
```

## 🔍 问题原因

**错误路径中包含了命令字符串**，说明：
1. **配置冲突**：根目录的 `vercel.json` 和 `test-app/vercel.json` 可能冲突
2. **Install Command 配置错误**：Vercel 可能把某个命令当成了路径
3. **Root Directory 设置问题**：如果 Root Directory 设置为 `test-app`，应该只使用 `test-app/vercel.json`

## ✅ 解决方案

### 方案 1: 简化 test-app/vercel.json（推荐）

如果 Root Directory 设置为 `test-app`，Vercel 会自动检测 Next.js，不需要手动指定构建命令。

**简化后的配置：**
```json
{
  "framework": "nextjs"
}
```

**原因：**
- Next.js 会自动检测
- 不需要手动指定 `buildCommand` 和 `installCommand`
- 避免与根目录的 `vercel.json` 冲突

### 方案 2: 删除或重命名根目录的 vercel.json

如果 Root Directory 设置为 `test-app`，根目录的 `vercel.json` 不应该被使用，但可能会干扰。

**操作：**
```powershell
# 如果 vercel.json.backup 不存在，重命名
git mv vercel.json vercel.json.backup

# 提交
git add vercel.json.backup
git commit -m "重命名根目录 vercel.json 以避免与 test-app 冲突"
git push
```

### 方案 3: 在 Vercel Dashboard 中清空所有自定义命令

1. **访问 Vercel Dashboard**
   - https://vercel.com
   - 进入你的项目

2. **Settings → General → Build & Development Settings**
   - **Build Command**: **留空**（让 Vercel 自动检测）
   - **Install Command**: **留空**（让 Vercel 自动检测）
   - **Output Directory**: **留空**（Next.js 自动处理）
   - 点击 **Save**

3. **Settings → General**
   - **Root Directory**: `test-app`
   - 点击 **Save**

## 📋 立即操作步骤

### 步骤 1: 更新 test-app/vercel.json

已简化为：
```json
{
  "framework": "nextjs"
}
```

### 步骤 2: 提交并推送

```powershell
git add test-app/vercel.json
git commit -m "简化 test-app/vercel.json，修复 routes-manifest 错误"
git push
```

### 步骤 3: 在 Vercel Dashboard 中检查设置

1. **Settings → General**
   - **Root Directory**: `test-app`
   - 点击 **Save**

2. **Settings → General → Build & Development Settings**
   - **Framework Preset**: Next.js
   - **Build Command**: **留空**
   - **Install Command**: **留空**
   - **Output Directory**: **留空**
   - 点击 **Save**

### 步骤 4: 清除缓存并重新部署

1. **进入 Deployments**
2. **点击最新的部署** → **"..."** → **"Redeploy"**
3. **重要设置：**
   - ✅ **取消勾选** "Use existing Build Cache"
   - ✅ 选择最新提交
4. **点击 "Redeploy"**

## ✅ 验证修复

部署成功后，应该：
- ✅ 构建成功
- ✅ 没有 routes-manifest.json 错误
- ✅ 部署成功
- ✅ 可以访问应用

## 💡 为什么这样修复？

### Next.js 自动检测

当 Root Directory 设置为 `test-app` 时：
- Vercel 会自动检测到 `test-app/package.json` 中的 Next.js
- 自动使用正确的构建命令
- 不需要手动指定

### 配置冲突

如果同时有：
- 根目录的 `vercel.json`（针对 monorepo）
- `test-app/vercel.json`（针对 test-app）
- Vercel Dashboard 中的设置

可能会产生冲突，导致路径解析错误。

### 最佳实践

对于 Next.js 项目：
- ✅ 只设置 `framework: "nextjs"`
- ✅ 让 Vercel 自动检测其他配置
- ✅ 避免手动指定构建命令（除非有特殊需求）

---

**完成上述步骤后，routes-manifest.json 错误应该可以解决了！** 🚀


